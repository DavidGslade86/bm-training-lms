import { useState, useEffect } from "react";
import { KEYS } from "./hooks/useLocalStorage";
import RegistrationScreen from "./components/RegistrationScreen";
import HomePage from "./components/HomePage";
import Module2 from "./components/Module2";
import Module3 from "./components/Module3";
import Module4 from "./components/Module4";
import Module5 from "./components/Module5";
import Module6 from "./components/Module6";
import JeopardyGame from "./components/JeopardyGame";
import FinalAssessment from "./components/FinalAssessment";

export default function App() {
  // Restore session from localStorage (survives page refresh)
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(KEYS.session())); }
    catch { return null; }
  })();

  const [currentView, setCurrentView] = useState(stored?.currentView || "registration");
  const [learner, setLearner]         = useState(stored?.learner || null);
  const [moduleStartedAt, setModuleStartedAt] = useState(stored?.moduleStartedAt || null);
  const [editMode, setEditMode]       = useState(false); // never persisted — requires password gate
  const [guestReview, setGuestReview] = useState(stored?.guestReview || false);

  // Persist session on every state change
  useEffect(() => {
    try {
      localStorage.setItem(KEYS.session(), JSON.stringify({
        learner, currentView, guestReview, moduleStartedAt,
      }));
    } catch { /* storage full — silently fail */ }
  }, [learner, currentView, guestReview, moduleStartedAt]);

  const handleRegistration = (l) => {
    setGuestReview(false);
    setLearner(l);
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
        learner={learner}
        onBack={() => setCurrentView("home")}
      />
    );
  }

  if (currentView === "final-assessment") {
    return (
      <FinalAssessment
        learner={learner}
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
        learner={learner}
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
        learner={learner}
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
        learner={learner}
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
        learner={learner}
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
        learner={learner}
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
      learner={learner}
      onStartModule={startModule}
      onStartActivity={(key) => setCurrentView(key)}
      editMode={editMode}
      onEnterEditMode={() => setEditMode(true)}
      onExitEditMode={() => setEditMode(false)}
    />
  );
}
