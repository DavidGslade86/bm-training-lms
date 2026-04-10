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
      if (!cancelled) setModuleCompletions(data || {});
    });
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  /** Persist user + update in-memory state. */
  const setUser = useCallback((userData) => {
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
   * Record a module completion. Delegates to completionService for
   * persistence + webhook, then refreshes the in-memory map so any
   * subscribers see the update immediately.
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

  /** Clear user + in-memory completions (does not wipe localStorage history). */
  const clearSession = useCallback(() => {
    setUserState(null);
    setModuleCompletions({});
    try {
      localStorage.removeItem(USER_KEY);
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
      recordCompletion,
      clearSession,
    }),
    [user, isAdmin, moduleCompletions, setUser, recordCompletion, clearSession]
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
