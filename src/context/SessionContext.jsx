import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ═══════════════════════════════════════════════════════
//  SessionContext — holds UI-local session state that
//  outlives a single route but does NOT go to the backend.
//
//  • guestReview       — is the learner browsing in review
//                        mode without an account?
//  • editMode          — admin edit mode flag. Never persisted
//                        (requires password gate every time).
//  • moduleStartedAt   — epoch ms when the current module was
//                        entered; used by CompletionCard to
//                        compute time-on-task.
//
//  guestReview + moduleStartedAt are persisted in the legacy
//  `bm-lms-session` localStorage key (kept for backward compat
//  with existing learners). currentView / previousView used
//  to live in that blob too — they are now owned by the URL
//  (react-router) and are no longer persisted here.
// ═══════════════════════════════════════════════════════

const SESSION_KEY = "bm-lms-session";

const SessionContext = createContext(null);

function loadPersisted() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      guestReview: Boolean(parsed?.guestReview),
      moduleStartedAt: parsed?.moduleStartedAt || null,
    };
  } catch {
    return {};
  }
}

export function SessionProvider({ children }) {
  const initial = loadPersisted();
  const [guestReview, setGuestReviewState] = useState(!!initial.guestReview);
  const [moduleStartedAt, setModuleStartedAtState] = useState(
    initial.moduleStartedAt || null
  );
  // editMode is intentionally NOT persisted — the admin password
  // gate has to be passed every session.
  const [editMode, setEditMode] = useState(false);

  // Persist guestReview + moduleStartedAt on every change.
  useEffect(() => {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ guestReview, moduleStartedAt })
      );
    } catch {
      /* storage full — silently fail */
    }
  }, [guestReview, moduleStartedAt]);

  const setGuestReview = useCallback((v) => setGuestReviewState(Boolean(v)), []);
  const setModuleStartedAt = useCallback((v) => setModuleStartedAtState(v), []);

  const value = useMemo(
    () => ({
      guestReview,
      setGuestReview,
      editMode,
      setEditMode,
      moduleStartedAt,
      setModuleStartedAt,
    }),
    [guestReview, editMode, moduleStartedAt, setGuestReview, setModuleStartedAt]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside a <SessionProvider>");
  return ctx;
}
