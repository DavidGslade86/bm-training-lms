// ═══════════════════════════════════════════════════════
//  completionService — records and retrieves completion data.
//
//  Today: persists to localStorage and POSTs to the Power
//  Automate webhook (VITE_POWERAUTOMATE_URL) when configured.
//
//  Later: POSTs to the backend API (VITE_API_URL), which in
//  turn handles persistence and any downstream webhooks.
//
//  All functions are async so callers don't have to change
//  when the implementation switches to real API calls.
// ═══════════════════════════════════════════════════════

import { API_ENABLED, apiGet, apiPost } from "./api";

const PA_URL = import.meta.env.VITE_POWERAUTOMATE_URL;

// Per-user localStorage key for the completion map.
// Shape: { [moduleId]: completionData }
const completionsKey = (userId) => `bm-lms-completions-${userId || "anonymous"}`;

/**
 * Record a module completion for a user.
 *
 * Today:
 *   1. Writes the completion payload to localStorage
 *      (keyed by userId). UserContext reads this key to
 *      expose `moduleCompletions` to the rest of the app.
 *   2. Fires the Power Automate webhook (VITE_POWERAUTOMATE_URL)
 *      when configured — this consolidates a call that used to
 *      be scattered across multiple completion cards.
 *
 * Later:
 *   POST /api/completions — single call; the backend handles
 *   persistence and any downstream Power Automate / webhook work.
 *
 * @returns {{ success: boolean, status?: number, error?: string }}
 */
export async function recordModuleCompletion(userId, moduleId, data) {
  // ─── Path B — backend API is configured ────────────────
  if (API_ENABLED) {
    try {
      await apiPost("/api/completions", { userId, moduleId, data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // ─── Path A — local persistence + webhook (today) ──────

  // 1. Save to localStorage (UserContext reads from this key).
  try {
    const key = completionsKey(userId);
    const stored = JSON.parse(localStorage.getItem(key) || "{}");
    stored[moduleId] = {
      ...data,
      recordedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(stored));
  } catch {
    /* storage full — silently fail */
  }

  // 2. Fire Power Automate webhook if configured. This is the
  //    only place the webhook is called — do not scatter it
  //    through individual completion cards.
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

  return { success: true };
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

  try {
    return JSON.parse(localStorage.getItem(completionsKey(userId)) || "{}");
  } catch {
    return {};
  }
}

/**
 * Record a final-assessment submission.
 *
 * Today: same localStorage + webhook path as module completions,
 *        using the reserved moduleId "final-assessment" so the
 *        assessment shows up alongside the module completions.
 * Later: POST /api/assessments — dedicated endpoint.
 */
export async function recordFinalAssessment(userId, data) {
  if (API_ENABLED) {
    try {
      await apiPost("/api/assessments", { userId, data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Reuse the module-completion code path so the final
  // assessment result lands in the same localStorage bucket
  // and PA webhook call.
  return recordModuleCompletion(userId, "final-assessment", data);
}
