import { useState } from "react";
import RegistrationScreen from "./components/RegistrationScreen";
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

  // currentView === "home" (and future module views)
  // Placeholder until HomePage is built in Step 2
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-heading text-brand-gray-dk mb-4">Welcome, {learner?.name}</h1>
        <button
          onClick={() => startModule("module-2")}
          className="px-6 py-3 bg-brand-blue text-white rounded-lg font-bold text-sm cursor-pointer border-none">
          Begin Module 2
        </button>
      </div>
    </div>
  );
}
