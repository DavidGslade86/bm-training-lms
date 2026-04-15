import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { GlossaryProvider } from "./hooks/useEditableGlossary";
import { useUser } from "./context/UserContext";
import { useSession } from "./context/SessionContext";
import RegistrationScreen from "./components/RegistrationScreen";
import HomePage from "./components/HomePage";
import JourneyView from "./components/JourneyView";
import ModuleDispatcher from "./components/ModuleDispatcher";
import JeopardyGame from "./components/JeopardyGame";
import NewHireAssessment from "./components/NewHireAssessment";

// ═══════════════════════════════════════════════════════
//  App — route configuration only.
//
//  Session state (user, guestReview, editMode, moduleStartedAt)
//  lives in UserContext + SessionContext. Navigation lives in
//  the URL. Individual components use useNavigate() directly
//  instead of receiving onHome/onStartModule-style callback
//  props. Back/forward buttons "just work" because they use
//  the browser history that react-router maintains.
// ═══════════════════════════════════════════════════════
export default function App() {
  return (
    <GlossaryProvider>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/journeys/:journeyId" element={<JourneyView />} />
        <Route path="/journeys/:journeyId/assessment" element={<NewHireAssessment />} />
        <Route path="/modules/:moduleId" element={<ModuleDispatcher />} />
        <Route path="/jeopardy" element={<JeopardyGame />} />
        {/* Unknown paths → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GlossaryProvider>
  );
}

/**
 * Root route behavior:
 *   • If a learner is signed in, OR they are browsing as a guest
 *     reviewer, show the HomePage.
 *   • Otherwise, show the RegistrationScreen.
 *
 * Handlers are defined here so the screens that need them don't
 * each have to reach into multiple contexts.
 */
function RootRoute() {
  const { user, setUser } = useUser();
  const { guestReview, setGuestReview } = useSession();
  const navigate = useNavigate();

  // Signed-in or reviewing-as-guest → HomePage
  if (user || guestReview) {
    return <HomePage />;
  }

  // Otherwise → Registration
  return (
    <RegistrationScreen
      onStart={(learner) => {
        setGuestReview(false);
        setUser(learner);
        // Stay on "/" — RootRoute will re-render as <HomePage />
      }}
      onGuestReview={() => {
        setGuestReview(true);
      }}
      onPlayJeopardy={() => navigate("/jeopardy")}
    />
  );
}
