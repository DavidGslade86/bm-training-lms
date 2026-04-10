import { useState, useEffect } from "react";
import { GlossaryProvider } from "./hooks/useEditableGlossary";
import { useUser } from "./context/UserContext";
import RegistrationScreen from "./components/RegistrationScreen";
import HomePage from "./components/HomePage";
import JourneyView from "./components/JourneyView";
import Module2 from "./components/Module2";
import Module3 from "./components/Module3";
import Module4 from "./components/Module4";
import Module5 from "./components/Module5";
import Module6 from "./components/Module6";
import JeopardyGame from "./components/JeopardyGame";
import FinalAssessment from "./components/FinalAssessment";

// Navigation-only session blob. User identity lives in UserContext;
// this key only holds the UI-state bits (currentView, previousView,
// guestReview, moduleStartedAt) so a page refresh lands the learner
// back where they were.
const SESSION_KEY = "bm-lms-session";

export default function App() {
  return (
    <GlossaryProvider>
      <AppInner />
    </GlossaryProvider>
  );
}

function AppInner() {
  const { user, setUser } = useUser();

  // Restore nav state from localStorage (survives page refresh)
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  })();

  const [currentView, setCurrentView] = useState(stored?.currentView || (user ? "home" : "registration"));
  const [previousView, setPreviousView] = useState(stored?.previousView || null);
  const [moduleStartedAt, setModuleStartedAt] = useState(stored?.moduleStartedAt || null);
  const [editMode, setEditMode]       = useState(false); // never persisted — requires password gate
  const [guestReview, setGuestReview] = useState(stored?.guestReview || false);

  // Persist nav state on every relevant change
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        currentView, previousView, guestReview, moduleStartedAt,
      }));
    } catch { /* storage full — silently fail */ }
  }, [currentView, previousView, guestReview, moduleStartedAt]);

  const handleRegistration = (l) => {
    setGuestReview(false);
    setUser(l);
    setCurrentView("home");
    setPreviousView(null);
  };

  const handleGuestReview = () => {
    setGuestReview(true);
    setCurrentView("home");
    setPreviousView(null);
  };

  /** Navigate to a journey detail view. */
  const viewJourney = (journeyId) => {
    setPreviousView(currentView);
    setCurrentView(`journey-${journeyId}`);
  };

  /** Start a module — track where the learner came from so we can navigate back. */
  const startModule = (moduleKey) => {
    setModuleStartedAt(Date.now());
    setPreviousView(currentView);
    setCurrentView(moduleKey);
  };

  /**
   * "Back" handler used by modules and activities. Returns the learner
   * to wherever they came from — a journey view or the home page.
   */
  const goBack = () => {
    const dest = previousView || "home";
    setCurrentView(dest);
    setPreviousView(null);
  };

  // ── Jeopardy ────────────────────────────────────────
  if (currentView === "jeopardy") {
    return (
      <JeopardyGame onBack={goBack} />
    );
  }

  // ── Final Assessment ────────────────────────────────
  if (currentView === "final-assessment") {
    return (
      <FinalAssessment onBack={goBack} />
    );
  }

  // ── Registration ────────────────────────────────────
  if (currentView === "registration") {
    return (
      <RegistrationScreen
        onStart={handleRegistration}
        onGuestReview={handleGuestReview}
        onPlayJeopardy={() => setCurrentView("jeopardy")}
      />
    );
  }

  // ── Journey detail views ────────────────────────────
  if (currentView.startsWith("journey-")) {
    const journeyId = currentView.replace("journey-", "");
    return (
      <JourneyView
        journeyId={journeyId}
        onBack={() => { setCurrentView("home"); setPreviousView(null); }}
        onStartModule={startModule}
      />
    );
  }

  // ── Module views ────────────────────────────────────
  const moduleProps = {
    moduleStartedAt,
    onHome: goBack,
    onSignIn: () => { setGuestReview(false); setCurrentView("registration"); },
    editMode,
    onExitEditMode: () => setEditMode(false),
    forceReview: guestReview,
  };

  if (currentView === "module-2") return <Module2 {...moduleProps} />;
  if (currentView === "module-3") return <Module3 {...moduleProps} />;
  if (currentView === "module-4") return <Module4 {...moduleProps} />;
  if (currentView === "module-5") return <Module5 {...moduleProps} />;
  if (currentView === "module-6") return <Module6 {...moduleProps} />;

  // ── Home (default after registration) ───────────────
  return (
    <HomePage
      onStartModule={startModule}
      onStartActivity={(key) => { setPreviousView("home"); setCurrentView(key); }}
      onViewJourney={viewJourney}
      editMode={editMode}
      onEnterEditMode={() => setEditMode(true)}
      onExitEditMode={() => setEditMode(false)}
    />
  );
}
