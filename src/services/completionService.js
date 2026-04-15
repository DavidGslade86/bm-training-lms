// ═══════════════════════════════════════════════════════
//  completionService — records and retrieves completion data.
//
//  Today: persists to localStorage and POSTs to the Power
//  Automate webhook (VITE_POWERAUTOMATE_URL) when configured.
//
//  Later: POSTs to the backend API (VITE_API_URL), which in
//  turn handles persistence and any downstream webhooks.
//
//  ─── Two-phase completion lifecycle ───────────────────
//
//  Each completion record carries two timestamps so the
//  backend can distinguish "learner finished the module" from
//  "learner submitted the result to the training record":
//
//    recordedAt   — set by markModuleComplete() the moment the
//                   learner lands on CompletionCard (or finishes
//                   the capstone assessment). Drives the journey
//                   progress bars without any webhook fan-out.
//
//    submittedAt  — set by recordModuleCompletion() when the
//                   learner clicks "Submit to Training Record".
//                   This is when the PA webhook fires today, and
//                   when the future backend would fan out to any
//                   downstream training systems.
//
//  A record with only recordedAt is in "recorded" state; a
//  record with both timestamps is in "submitted" state. Either
//  state counts as "complete" for journey progress purposes.
//
//  This shape is forward-compatible with the backend endpoints:
//    • POST /api/completions                    → recorded
//    • POST /api/completions  { submit: true }  → submitted
//  (Or equivalently, a dedicated PATCH /api/completions/:id/submit
//  transition endpoint — the choice is an API detail, the
//  client-side schema is the same either way.)
//
//  All functions are async so callers don't have to change
//  when the implementation switches to real API calls.
// ═══════════════════════════════════════════════════════

import { API_ENABLED, apiGet, apiPost } from "./api";

const PA_URL = import.meta.env.VITE_POWERAUTOMATE_URL;

// Per-user localStorage key for the completion map.
// Shape: { [moduleId]: { ...completionData, recordedAt, submittedAt? } }
const completionsKey = (userId) => `bm-lms-completions-${userId || "anonymous"}`;

// ── Internal: safe read/write of the completion map ───────
function readMap(userId) {
  try {
    return JSON.parse(localStorage.getItem(completionsKey(userId)) || "{}");
  } catch {
    return {};
  }
}

function writeMap(userId, map) {
  try {
    localStorage.setItem(completionsKey(userId), JSON.stringify(map));
  } catch {
    /* storage full — silently fail */
  }
}

/**
 * Mark a module complete LOCALLY only — no webhook fan-out.
 *
 * Called by CompletionCard on mount (and by NewHireAssessment on
 * submit) so the learner's journey progress bar reflects the
 * completion the moment they finish, without depending on them
 * clicking "Submit to Training Record".
 *
 * Idempotent: safe to call multiple times for the same module.
 * The first call stamps `recordedAt`; subsequent calls refresh
 * the metrics payload but leave `recordedAt` and `submittedAt`
 * untouched so we never "downgrade" a record that has already
 * been submitted.
 *
 * Today:  writes to localStorage only.
 * Later:  POST /api/completions with { userId, moduleId, data }
 *         — backend stamps recordedAt server-side and does NOT
 *         trigger downstream webhook fan-out.
 *
 * @returns {{ success: boolean, error?: string }}
 */
export async function markModuleComplete(userId, moduleId, data) {
  if (API_ENABLED) {
    try {
      await apiPost("/api/completions", { userId, moduleId, data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  const map = readMap(userId);
  const existing = map[moduleId] || {};
  map[moduleId] = {
    ...existing,
    ...data,
    // Preserve first-seen recordedAt — overwriting it every visit
    // would make the "when did they finish" timestamp useless.
    recordedAt: existing.recordedAt || new Date().toISOString(),
    // Never clobber a submittedAt that's already set. If the learner
    // revisits the completion screen after submitting, we keep the
    // "submitted" state intact.
    ...(existing.submittedAt ? { submittedAt: existing.submittedAt } : {}),
  };
  writeMap(userId, map);
  return { success: true };
}

/**
 * Record a module completion for a user AND submit it to the
 * training record (PA webhook today, backend endpoint later).
 *
 * Flow:
 *   1. markModuleComplete() — ensures the local record exists
 *      and is up-to-date (stamps recordedAt on first call).
 *   2. Fire the Power Automate webhook if configured. Failures
 *      short-circuit and leave submittedAt unset so the UI can
 *      show an error and let the learner retry.
 *   3. Stamp submittedAt on the local record once the webhook
 *      (or backend) acks — the learner can then see "Submitted
 *      to training record" in the UI and journey progress stays
 *      complete even without the webhook ever firing again.
 *
 * Later:
 *   POST /api/completions  { submit: true } — single call; the
 *   backend handles persistence + any downstream webhook work
 *   and returns the stamped submittedAt.
 *
 * @returns {{ success: boolean, status?: number, error?: string }}
 */
export async function recordModuleCompletion(userId, moduleId, data) {
  // Phase 1 — make sure the local record exists. This guarantees
  // the journey progress bar reflects the completion even if the
  // webhook call below fails.
  await markModuleComplete(userId, moduleId, data);

  // ─── Path B — backend API is configured ────────────────
  if (API_ENABLED) {
    try {
      await apiPost("/api/completions", { userId, moduleId, data, submit: true });
      stampSubmittedAt(userId, moduleId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // ─── Path A — local persistence + webhook (today) ──────

  // Fire Power Automate webhook if configured. This is the
  // only place the webhook is called — do not scatter it
  // through individual completion cards.
  if (PA_URL && PA_URL.trim().length > 0) {
    if (import.meta.env.DEV) {
      console.log("completionService → Power Automate payload:", data);
    }
    try {
      const res = await fetch(PA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!(res.status === 200 || res.status === 202)) {
        return { success: false, status: res.status };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Stamp submittedAt on the local record. We do this even when
  // the webhook is not configured — the learner explicitly
  // clicked "Submit to Training Record", so the record is
  // semantically "submitted" from their perspective.
  stampSubmittedAt(userId, moduleId);
  return { success: true };
}

/**
 * Stamp submittedAt on an existing local completion record.
 * No-op if the record doesn't exist (shouldn't happen — callers
 * go through markModuleComplete first).
 */
function stampSubmittedAt(userId, moduleId) {
  const map = readMap(userId);
  if (!map[moduleId]) return;
  map[moduleId] = { ...map[moduleId], submittedAt: new Date().toISOString() };
  writeMap(userId, map);
}

/**
 * Read the completion map for a user.
 *
 * Today: reads from localStorage.
 * Later: GET /api/users/:id/completions
 *
 * @returns {Promise<Object>} { [moduleId]: completionData }
 */
export async function getCompletionStatus(userId) {
  if (API_ENABLED) {
    try {
      return await apiGet(`/api/users/${encodeURIComponent(userId)}/completions`);
    } catch {
      return {};
    }
  }

  return readMap(userId);
}

/**
 * Record a capstone-assessment submission for the New Hire Pathway.
 *
 * Today: same localStorage + webhook path as module completions,
 *        using the reserved moduleId "new-hire-assessment" so the
 *        result shows up alongside the module completions.
 * Later: POST /api/assessments — dedicated endpoint.
 *
 * Historical note: this function was previously named
 * recordFinalAssessment and wrote under moduleId "final-assessment"
 * when the assessment was a top-level activity. Both the function
 * name and the moduleId were renamed when the assessment was moved
 * inside the New Hire Pathway journey. UserContext.loadPersistedUser
 * handles in-place migration of existing localStorage records.
 */
export async function recordNewHireAssessment(userId, data) {
  if (API_ENABLED) {
    try {
      await apiPost("/api/assessments", { userId, data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Reuse the module-completion code path so the assessment
  // result lands in the same localStorage bucket and PA
  // webhook call.
  return recordModuleCompletion(userId, "new-hire-assessment", data);
}
