import { useState } from "react";
import RegistrationScreen from "./components/RegistrationScreen";
import HomePage from "./components/HomePage";
import Module2 from "./components/Module2";

export default function App() {
  const [currentView, setCurrentView] = useState("registration");
  const [learner, setLearner] = useState(null);
  const [moduleStartedAt, setModuleStartedAt] = useState(null);

  const handleRegistration = (l) => {
    setLearner(l);
    setCurrentView("home");
  };

  const startModule = (moduleKey) => {
    setModuleStartedAt(Date.now());
    setCurrentView(moduleKey);
  };

  if (currentView === "registration") {
    return <RegistrationScreen onStart={handleRegistration}/>;
  }

  if (currentView === "module-2") {
    return (
      <Module2
        learner={learner}
        moduleStartedAt={moduleStartedAt}
        onHome={() => setCurrentView("home")}
      />
    );
  }

  // currentView === "home" (default after registration)
  return (
    <HomePage
      learner={learner}
      onStartModule={startModule}
    />
  );
}
