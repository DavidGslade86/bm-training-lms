import { useState } from "react";
import RegistrationScreen from "./components/RegistrationScreen";
import HomePage from "./components/HomePage";
import Module2 from "./components/Module2";
import Module3 from "./components/Module3";
import Module4 from "./components/Module4";
import JeopardyGame from "./components/JeopardyGame";

export default function App() {
  const [currentView, setCurrentView] = useState("registration");
  const [learner, setLearner] = useState(null);
  const [moduleStartedAt, setModuleStartedAt] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [guestReview, setGuestReview] = useState(false);

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

  // Jeopardy is accessible without registration
  if (currentView === "jeopardy") {
    return (
      <JeopardyGame
        learner={learner}
        onBack={() => setCurrentView(learner ? "home" : "registration")}
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
