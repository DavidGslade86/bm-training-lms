import { useState, useEffect } from "react";
import {
  BookOpen,
  UserCheck,
  ClipboardList,
  Cpu,
  Zap,
  Check,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { getJourneys, getAllModules } from "../services/contentService";
import { useUser } from "../context/UserContext";

// ── Icon lookup ──────────────────────────────────────
const ICON_MAP = { BookOpen, UserCheck, ClipboardList, Cpu, Zap };

/**
 * Check if a short-form module id (e.g. "module-2") has a completion
 * record. Completions are keyed by the long-form id used in
 * CompletionCard (e.g. "module-2-foundational-concepts"), so we
 * match with a startsWith check as a normalisation bridge.
 */
function isModuleComplete(shortId, completions) {
  if (!completions || !shortId) return false;
  if (completions[shortId]) return true;
  return Object.keys(completions).some((k) => k.startsWith(shortId + "-"));
}

export default function JourneyView({ journeyId, onBack, onStartModule }) {
  const { user: learner, moduleCompletions } = useUser();
  const [journey, setJourney] = useState(null);
  const [moduleMeta, setModuleMeta] = useState([]);

  // Load journey + module metadata
  useEffect(() => {
    let cancelled = false;
    Promise.all([getJourneys(), getAllModules()]).then(([journeys, modules]) => {
      if (cancelled) return;
      setJourney(journeys.find((j) => j.id === journeyId) || null);
      setModuleMeta(modules || []);
    });
    return () => { cancelled = true; };
  }, [journeyId]);

  if (!journey) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center text-brand-tl text-sm">
        Loading journey...
      </div>
    );
  }

  const Icon = ICON_MAP[journey.icon] || BookOpen;

  // Build enriched module list
  const modules = journey.modules.map((jm) => {
    const meta = moduleMeta.find((m) => m.id === jm.id) || {};
    const complete = isModuleComplete(jm.id, moduleCompletions);
    return { ...jm, ...meta, complete };
  });

  const totalModules = modules.length;
  const completedCount = modules.filter((m) => m.complete).length;
  const progressPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const allRequiredDone = modules.filter((m) => m.required).every((m) => m.complete);
  const assessmentComplete = journey.assessment
    ? isModuleComplete(journey.assessment, moduleCompletions)
    : false;

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Journey header */}
      <div className="relative" style={{ background: journey.color }}>
        <div className="max-w-[960px] mx-auto px-8 py-8">
          {/* Back link */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold mb-5 cursor-pointer border-none bg-transparent"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <ArrowLeft size={14} />
            Back to Home
          </button>

          <div className="flex items-start gap-5">
            {/* Icon circle */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <Icon size={26} color="white" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold font-heading text-white mb-1">
                {journey.title}
              </h1>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
                {journey.description}
              </p>

              {/* Progress summary */}
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%`, background: "white" }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-white whitespace-nowrap">
                  {completedCount} of {totalModules} modules complete
                </span>
                {journey.estimatedTime && (
                  <span className="text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {journey.estimatedTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="max-w-[960px] mx-auto px-8 py-8">
        {learner && (
          <p className="text-xs text-brand-tl mb-6">
            Welcome, {learner.name} &mdash; pick up where you left off or start a new module.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {modules.map((m, i) => {
            const available = m.status === "available";
            let buttonLabel = "Begin Module \u2192";
            let buttonStyle = "primary";
            if (m.complete) {
              buttonLabel = "Review Module \u2192";
              buttonStyle = "secondary";
            }

            return (
              <div
                key={m.id}
                className="rounded-lg border bg-brand-ww border-brand-sand overflow-hidden flex"
              >
                {/* Left accent */}
                <div className="w-1 shrink-0" style={{ background: journey.color }} />

                <div className="flex-1 px-6 py-5 flex items-center gap-5">
                  {/* Step indicator / check */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                    style={
                      m.complete
                        ? { background: journey.color, color: "white" }
                        : { background: "transparent", border: `2px solid ${journey.color}40`, color: journey.color }
                    }
                  >
                    {m.complete ? <Check size={18} /> : i + 1}
                  </div>

                  {/* Module info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {m.number && (
                        <span className="text-[11px] font-bold tracking-widest" style={{ color: journey.color }}>
                          {m.number.toUpperCase()}
                        </span>
                      )}
                      {m.complete && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${journey.color}15`, color: journey.color, border: `1px solid ${journey.color}30` }}
                        >
                          Complete
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold font-heading text-brand-gray-dk mb-0.5">
                      {m.title || m.id}
                    </h3>
                    {m.description && (
                      <p className="text-xs text-brand-tm leading-relaxed">{m.description}</p>
                    )}
                    {m.time && (
                      <span className="text-[11px] text-brand-tl mt-1 inline-block">{m.time}</span>
                    )}
                  </div>

                  {/* Action button */}
                  {available && (
                    <button
                      onClick={() => onStartModule(m.id)}
                      className="shrink-0 px-5 py-2.5 rounded-md text-sm font-bold border-none cursor-pointer whitespace-nowrap"
                      style={
                        buttonStyle === "primary"
                          ? { background: journey.color, color: "white" }
                          : { background: "white", color: journey.color, border: `1.5px solid ${journey.color}40` }
                      }
                    >
                      {buttonLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Assessment card */}
          {journey.assessment && (
            <div className="rounded-lg border overflow-hidden flex mt-2"
              style={{
                background: allRequiredDone ? journey.color : "#f5f0e8",
                borderColor: allRequiredDone ? journey.color : "#e2d9cc",
              }}
            >
              {/* Left accent */}
              <div className="w-1 shrink-0" style={{ background: allRequiredDone ? "rgba(255,255,255,0.3)" : "#d4cdc0" }} />

              <div className="flex-1 px-6 py-5 flex items-center gap-5">
                {/* Lock / check icon */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={
                    assessmentComplete
                      ? { background: "rgba(255,255,255,0.25)", color: "white" }
                      : allRequiredDone
                        ? { background: "rgba(255,255,255,0.2)", color: "white" }
                        : { background: "#e8e2d8", color: "#9a9088" }
                  }
                >
                  {assessmentComplete ? (
                    <Check size={18} />
                  ) : allRequiredDone ? (
                    <span className="text-sm font-bold">{modules.length + 1}</span>
                  ) : (
                    <Lock size={16} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[11px] font-bold tracking-widest"
                      style={{ color: allRequiredDone ? "rgba(255,255,255,0.7)" : "#9a9088" }}
                    >
                      FINAL ASSESSMENT
                    </span>
                    {assessmentComplete && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                      >
                        Complete
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-base font-bold font-heading mb-0.5"
                    style={{ color: allRequiredDone ? "white" : "#6b6255" }}
                  >
                    {journey.completionLabel || "Final Assessment"}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: allRequiredDone ? "rgba(255,255,255,0.7)" : "#9a9088" }}
                  >
                    {allRequiredDone
                      ? "All required modules complete \u2014 you're ready for the final assessment."
                      : `Complete all ${totalModules} required modules to unlock the final assessment.`}
                  </p>
                </div>

                {/* Button */}
                {allRequiredDone && !assessmentComplete && (
                  <button
                    onClick={() => onStartModule(journey.assessment)}
                    className="shrink-0 px-5 py-2.5 rounded-md text-sm font-bold border-none cursor-pointer whitespace-nowrap"
                    style={{ background: "white", color: journey.color }}
                  >
                    Begin Assessment &rarr;
                  </button>
                )}
                {assessmentComplete && (
                  <button
                    onClick={() => onStartModule(journey.assessment)}
                    className="shrink-0 px-5 py-2.5 rounded-md text-sm font-bold cursor-pointer whitespace-nowrap"
                    style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.4)" }}
                  >
                    Review Assessment &rarr;
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
