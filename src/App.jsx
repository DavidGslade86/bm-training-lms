import { useState, useEffect } from "react";
import { GlossaryProvider } from "./hooks/useEditableGlossary";
import { useUser } from "./context/UserContext";
import RegistrationScreen from "./components/RegistrationScreen";
import HomePage from "./components/HomePage";
import Module2 from "./components/Module2";
import Module3 from "./components/Module3";
import Module4 from "./components/Module4";
import Module5 from "./components/Module5";
import Module6 from "./components/Module6";
import JeopardyGame from "./components/JeopardyGame";
import FinalAssessment from "./components/FinalAssessment";

// Navigation-only session blob. User identity lives in UserContext;
// this key only holds the UI-state bits (currentView, guestReview,
// moduleStartedAt) so a page refresh lands the learner back where
// they were.
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
  const [moduleStartedAt, setModuleStartedAt] = useState(stored?.moduleStartedAt || null);
  const [editMode, setEditMode]       = useState(false); // never persisted — requires password gate
  const [guestReview, setGuestReview] = useState(stored?.guestReview || false);

  // Persist nav state on every relevant change
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        currentView, guestReview, moduleStartedAt,
      }));
    } catch { /* storage full — silently fail */ }
  }, [currentView, guestReview, moduleStartedAt]);

  const handleRegistration = (l) => {
    setGuestReview(false);
    setUser(l);
    setCurrentView("home");
  };

  const handleGuestReview = () => {
    setGuestReview(true);
    setCurrentView("home");
  };

  const startModule = (moduleKey) => {
    setModuleStartedAt(Date.now());
    setCurrentView(moduleKey);
  };

  // Jeopardy and Final Assessment always navigate back to the module landing page
  if (currentView === "jeopardy") {
    return (
      <JeopardyGame
        onBack={() => setCurrentView("home")}
      />
    );
  }

  if (currentView === "final-assessment") {
    return (
      <FinalAssessment
        onBack={() => setCurrentView("home")}
      />
    );
  }

  if (currentView === "registration") {
    return (
      <RegistrationScreen
        onStart={handleRegistration}
        onGuestReview={handleGuestReview}
        onPlayJeopardy={() => setCurrentView("jeopardy")}
      />
    );
  }

  if (currentView === "module-2") {
    return (
      <Module2
        moduleStartedAt={moduleStartedAt}
        onHome={() => setCurrentView("home")}
        onSignIn={() => { setGuestReview(false); setCurrentView("registration"); }}
        editMode={editMode}
        onExitEditMode={() => setEditMode(false)}
        forceReview={guestReview}
      />
    );
  }

  if (currentView === "module-3") {
    return (
      <Module3
        moduleStartedAt={moduleStartedAt}
        onHome={() => setCurrentView("home")}
        onSignIn={() => { setGuestReview(false); setCurrentView("registration"); }}
        editMode={editMode}
        onExitEditMode={() => setEditMode(false)}
        forceReview={guestReview}
      />
    );
  }

  if (currentView === "module-4") {
    return (
      <Module4
        moduleStartedAt={moduleStartedAt}
        onHome={() => setCurrentView("home")}
        onSignIn={() => { setGuestReview(false); setCurrentView("registration"); }}
        editMode={editMode}
        onExitEditMode={() => setEditMode(false)}
        forceReview={guestReview}
      />
    );
  }

  if (currentView === "module-5") {
    return (
      <Module5
        moduleStartedAt={moduleStartedAt}
        onHome={() => setCurrentView("home")}
        onSignIn={() => { setGuestReview(false); setCurrentView("registration"); }}
        editMode={editMode}
        onExitEditMode={() => setEditMode(false)}
        forceReview={guestReview}
      />
    );
  }

  if (currentView === "module-6") {
    return (
      <Module6
        moduleStartedAt={moduleStartedAt}
        onHome={() => setCurrentView("home")}
        onSignIn={() => { setGuestReview(false); setCurrentView("registration"); }}
        editMode={editMode}
        onExitEditMode={() => setEditMode(false)}
        forceReview={guestReview}
      />
    );
  }

  // currentView === "home" (default after registration)
  return (
    <HomePage
      onStartModule={startModule}
      onStartActivity={(key) => setCurrentView(key)}
      editMode={editMode}
      onEnterEditMode={() => setEditMode(true)}
      onExitEditMode={() => setEditMode(false)}
    />
  );
}
