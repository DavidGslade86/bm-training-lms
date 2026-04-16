import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCompletionStatus,
  markModuleComplete,
  recordModuleCompletion,
} from "../services/completionService";

// ═══════════════════════════════════════════════════════
//  UserContext — single source of truth for the signed-in
//  user and their completion history.
//
//  Today:
//    • user is persisted in localStorage (bm-lms-user).
//    • moduleCompletions are read from the completionService
//      (which itself reads localStorage today, API later).
//
//  Later:
//    • setUser() will be called after Azure AD authentication.
//    • recordCompletion() will POST to the backend API.
// ═══════════════════════════════════════════════════════

const USER_KEY    = "bm-lms-user";
// Legacy session key — used during the split of user state
// out of the old "session" blob in App.jsx. We read it once
// for backward compatibility so existing learners don't get
// bounced back to the registration screen after deploy.
const SESSION_KEY = "bm-lms-session";

const UserContext = createContext(null);

/** Load the persisted user from localStorage (with legacy fallback). */
/**
 * One-time migration: rename the legacy "final-assessment" completion
 * key to "new-hire-assessment" and persist the rewritten map. Safe to
 * call on every load — no-op if the legacy key isn't present.
 */
function migrateLegacyFinalAssessment(completions, userEmail) {
  if (!completions || typeof completions !== "object") return completions;
  if (!("final-assessment" in completions)) return completions;
  if ("new-hire-assessment" in completions) {
    // Both keys present — drop the legacy one, keep the new one.
    const { "final-assessment": _legacy, ...rest } = completions;
    persistCompletionsMap(userEmail, rest);
    return rest;
  }
  const { "final-assessment": legacy, ...rest } = completions;
  const migrated = { ...rest, "new-hire-assessment": legacy };
  persistCompletionsMap(userEmail, migrated);
  return migrated;
}

/** Write the completion map back to localStorage after a migration. */
function persistCompletionsMap(userEmail, map) {
  try {
    const key = `bm-lms-completions-${userEmail || "anonymous"}`;
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    /* storage full — the migration will just re-run next load */
  }
}

/**
 * Merge two completion records for the same moduleId into one.
 * Rules:
 *   • A record with `submittedAt` wins over one without (never "downgrade").
 *   • Otherwise prefer the more recent `recordedAt`.
 *   • Payload fields are shallow-merged with the winner on top.
 *
 * Exported for testing — covered by userContext.test.js.
 */
export function mergeCompletionRecords(a, b) {
  if (!a) return b;
  if (!b) return a;
  const aSubmitted = Boolean(a.submittedAt);
  const bSubmitted = Boolean(b.submittedAt);
  if (aSubmitted && !bSubmitted) return { ...b, ...a };
  if (bSubmitted && !aSubmitted) return { ...a, ...b };
  const aTs = Date.parse(a.recordedAt || 0) || 0;
  const bTs = Date.parse(b.recordedAt || 0) || 0;
  return bTs > aTs ? { ...a, ...b } : { ...b, ...a };
}

/**
 * When a learner signs in after browsing in guest-review mode, merge
 * any completions they recorded as "anonymous" into their own bucket
 * and delete the anonymous bucket. Without this, guest progress gets
 * stranded the moment they register.
 *
 * Safe to call on every sign-in — no-op when the anonymous bucket is
 * empty or missing.
 *
 * Exported for testing — covered by userContext.test.js.
 */
export function migrateAnonymousCompletions(userEmail) {
  if (!userEmail) return;
  const anonKey = "bm-lms-completions-anonymous";
  const userKey = `bm-lms-completions-${userEmail}`;
  let anon, mine;
  try {
    anon = JSON.parse(localStorage.getItem(anonKey) || "null");
  } catch { return; }
  if (!anon || typeof anon !== "object" || Object.keys(anon).length === 0) return;
  try {
    mine = JSON.parse(localStorage.getItem(userKey) || "{}");
  } catch {
    mine = {};
  }
  const merged = { ...mine };
  for (const [moduleId, record] of Object.entries(anon)) {
    merged[moduleId] = mergeCompletionRecords(merged[moduleId], record);
  }
  try {
    localStorage.setItem(userKey, JSON.stringify(merged));
    localStorage.removeItem(anonKey);
  } catch {
    /* storage full — leave the anon bucket in place; re-run next sign-in */
  }
}

function loadPersistedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore parse errors */
  }
  // Backward-compat: older builds stored learner inside the
  // session blob. Migrate it over to the new key.
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.learner) {
        localStorage.setItem(USER_KEY, JSON.stringify(parsed.learner));
        return parsed.learner;
      }
    }
  } catch {
    /* ignore parse errors */
  }
  return null;
}

export function UserProvider({ children }) {
  const [user, setUserState] = useState(() => loadPersistedUser());
  const [moduleCompletions, setModuleCompletions] = useState({});

  // Load completion history whenever the user (or their email) changes.
  useEffect(() => {
    let cancelled = false;
    if (!user?.email) {
      setModuleCompletions({});
      return;
    }
    getCompletionStatus(user.email).then((data) => {
      if (cancelled) return;
      // One-time migration: the capstone assessment used to be stored
      // under moduleId "final-assessment". It is now keyed as
      // "new-hire-assessment" (journey-scoped). Rename in place on load
      // so existing learners keep their completion record.
      const migrated = migrateLegacyFinalAssessment(data || {}, user.email);
      setModuleCompletions(migrated);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  /** Persist user + update in-memory state. */
  const setUser = useCallback((userData) => {
    // On sign-in (user going from null → authenticated), roll any
    // completions captured under the "anonymous" bucket into the
    // learner's own bucket so guest progress isn't stranded.
    if (userData?.email) {
      migrateAnonymousCompletions(userData.email);
    }
    setUserState(userData);
    try {
      if (userData) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      /* storage full */
    }
  }, []);

  /**
   * Mark a module complete LOCALLY — drives journey progress bars
   * the moment a learner finishes a module, without firing the PA
   * webhook. Called by CompletionCard on mount (and by the capstone
   * assessment on submit).
   *
   * Idempotent: re-calling it refreshes the metrics payload but
   * preserves recordedAt / submittedAt so we never "downgrade" a
   * record that has already been submitted to the training record.
   */
  const markComplete = useCallback(
    async (moduleId, completionData) => {
      const userId = user?.email || "anonymous";
      const result = await markModuleComplete(userId, moduleId, completionData);
      const fresh = await getCompletionStatus(userId);
      setModuleCompletions(fresh || {});
      return result;
    },
    [user?.email]
  );

  /**
   * Record a module completion AND submit it to the training record
   * (PA webhook today, backend endpoint later). Delegates to
   * completionService for persistence + webhook, then refreshes the
   * in-memory map so any subscribers see the update immediately.
   */
  const recordCompletion = useCallback(
    async (moduleId, completionData) => {
      const userId = user?.email || "anonymous";
      const result = await recordModuleCompletion(
        userId,
        moduleId,
        completionData
      );
      const fresh = await getCompletionStatus(userId);
      setModuleCompletions(fresh || {});
      return result;
    },
    [user?.email]
  );

  /**
   * Clear user + in-memory completions + UI-local session blob.
   * Does NOT wipe the per-learner completion history — a learner who
   * signs back in with the same email keeps their progress.
   */
  const clearSession = useCallback(() => {
    setUserState(null);
    setModuleCompletions({});
    try {
      localStorage.removeItem(USER_KEY);
      // Wipe the UI-local session blob too. Otherwise state like
      // moduleStartedAt can bleed from one learner's session into
      // the next learner who signs in on the same machine.
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // isAdmin is a placeholder for Phase 2 (Azure AD / backend
  // authorization). The Edit Mode gate still uses the separate
  // VITE_ADMIN_PASSWORD check in HomePage — this flag is
  // reserved for real backend-authenticated admin routes.
  const isAdmin = false;

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      moduleCompletions,
      setUser,
      markComplete,
      recordCompletion,
      clearSession,
    }),
    [
      user,
      isAdmin,
      moduleCompletions,
      setUser,
      markComplete,
      recordCompletion,
      clearSession,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/** Hook used by components to read/mutate user state. */
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside a <UserProvider>");
  }
  return ctx;
}
