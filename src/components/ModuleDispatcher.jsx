import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import Module2 from "./Module2";
import Module3 from "./Module3";
import Module4 from "./Module4";
import Module5 from "./Module5";
import Module6 from "./Module6";

// ═══════════════════════════════════════════════════════
//  ModuleDispatcher — /modules/:moduleId
//
//  Maps the URL segment to the matching Module component.
//  Modules 2–6 read their dependencies from context + hooks
//  (UserContext, SessionContext, useNavigate), so this layer
//  is just a lookup table plus a side-effect: we stamp
//  moduleStartedAt on every moduleId change so CompletionCard
//  can compute time-on-task from the moment this specific
//  module was entered (not the first module of the session).
//
//  Unknown :moduleId → redirect to home.
// ═══════════════════════════════════════════════════════
const MODULE_COMPONENTS = {
  "module-2": Module2,
  "module-3": Module3,
  "module-4": Module4,
  "module-5": Module5,
  "module-6": Module6,
};

export default function ModuleDispatcher() {
  const { moduleId } = useParams();
  const { setModuleStartedAt } = useSession();

  // Reset the module-start timestamp every time the learner enters
  // a different module. Without this, switching from module-2 to
  // module-3 mid-session would keep the module-2 start time and
  // CompletionCard would report the wrong time-on-task for module-3.
  useEffect(() => {
    if (moduleId && MODULE_COMPONENTS[moduleId]) {
      setModuleStartedAt(Date.now());
    }
  }, [moduleId, setModuleStartedAt]);

  const Component = MODULE_COMPONENTS[moduleId];
  if (!Component) return <Navigate to="/" replace />;
  return <Component />;
}
