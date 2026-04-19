import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { B } from "../data/brand";
import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";
import { getNextStep, getParentJourneyId } from "../services/contentService";
import { useUser } from "../context/UserContext";
import { useSession } from "../context/SessionContext";
import { KEYS } from "../hooks/useLocalStorage";
import ThemedContainers from "./salesforce/ThemedContainers";
import ReportingModule from "./salesforce/ReportingModule";

// ═══════════════════════════════════════════════════════
//  SalesforceBasicsModule — parent module for the tech-stack
//  journey that wraps two self-contained Salesforce training
//  components as sequential "parts":
//
//    Part 1 — Objects: Containers for Data (ThemedContainers)
//    Part 2 — Building Reports            (ReportingModule)
//
//  The child components are imported verbatim from
//  src/components/salesforce/ and kept intact so they can be
//  updated from the source spec without merge conflicts. This
//  wrapper supplies:
//
//    • LMS chrome (top nav, back-to-journey, learner label)
//    • Part switcher (Part 1 / Part 2 pills + progress dots)
//    • Per-part completion tracking (self-report — the learner
//      clicks "Mark Part Complete" when they've walked through
//      the content)
//    • Overall module completion via markComplete once both
//      parts are done, plus optional Submit to Training Record
//
//  Progress is persisted under bm-lms-progress-salesforce-basics-<email>
//  alongside the other modules' reducer state. We don't use
//  the reducer-based Ctx here because the SF components have
//  their own internal state machines (step counters, exercise
//  progress) and don't slot into the card-based progression.
// ═══════════════════════════════════════════════════════

const MODULE_ID = "salesforce-basics";
const MODULE_TITLE = "Salesforce Basics";

const PARTS = [
  {
    id: 1,
    slug: "data-model",
    label: "Part 1",
    title: "Objects: Containers for Data",
    subtitle: "How Salesforce organizes data into themed containers.",
  },
  {
    id: 2,
    slug: "reporting",
    label: "Part 2",
    title: "Building Reports",
    subtitle: "From business question to report — three guided exercises.",
  },
];

// ── Persistence helpers ────────────────────────────────
// Progress shape: { part1Done, part2Done, recordedAt }
function loadProgress(storageKey) {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey));
    if (!raw || typeof raw !== "object") return { part1Done: false, part2Done: false };
    return {
      part1Done: !!raw.part1Done,
      part2Done: !!raw.part2Done,
      recordedAt: raw.recordedAt || null,
    };
  } catch {
    return { part1Done: false, part2Done: false };
  }
}

function saveProgress(storageKey, progress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // storage full — silently fail, matches usePersistedReducer behavior
  }
}

export default function SalesforceBasicsModule() {
  const navigate = useNavigate();
  const { user: learner, markComplete, recordCompletion } = useUser();
  const { guestReview, setGuestReview, moduleStartedAt } = useSession();
  const forceReview = guestReview;
  const [reviewMode, setReviewMode] = useState(forceReview);
  const toggleReviewMode = () => { if (!forceReview) setReviewMode(v => !v); };

  const storageKey = KEYS.module(MODULE_ID, learner?.email || "anonymous");
  const [progress, setProgress] = useState(() => loadProgress(storageKey));
  const [currentPart, setCurrentPart] = useState(progress.part1Done && !progress.part2Done ? 2 : 1);
  const [parentJourneyId, setParentJourneyId] = useState(null);
  const [nextStep, setNextStep] = useState(null);
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success | error

  // Persist progress on change
  useEffect(() => { saveProgress(storageKey, progress); }, [storageKey, progress]);

  // Resolve parent journey for the back button
  useEffect(() => {
    let cancelled = false;
    getParentJourneyId(MODULE_ID).then((id) => {
      if (!cancelled) setParentJourneyId(id);
    });
    return () => { cancelled = true; };
  }, []);

  // Resolve next step in the journey for the completion screen
  useEffect(() => {
    let cancelled = false;
    getNextStep(MODULE_ID).then((step) => {
      if (!cancelled) setNextStep(step);
    });
    return () => { cancelled = true; };
  }, []);

  const onHome = () => navigate("/");
  const onSignIn = () => { setGuestReview(false); navigate("/"); };
  const onBackToJourney = () => navigate(parentJourneyId ? `/journeys/${parentJourneyId}` : "/");

  const bothDone = progress.part1Done && progress.part2Done;

  // ── Part-complete handler ──
  // In review/guest mode we still let the learner walk around but
  // don't persist progress — matches the rest of the LMS.
  const markPartComplete = (partId) => {
    if (reviewMode) return;
    setProgress((p) => ({
      ...p,
      ...(partId === 1 ? { part1Done: true } : { part2Done: true }),
    }));
    // Auto-advance to the next part if they finished Part 1 and haven't done Part 2
    if (partId === 1 && !progress.part2Done) {
      setCurrentPart(2);
    }
  };

  // ── Module-complete side effect ──
  // Mirrors CompletionCard: as soon as both parts are done and the
  // learner is signed in (not a guest reviewer), stamp the completion
  // locally so the journey progress bar reflects it. The PA webhook
  // still only fires on an explicit "Submit to Training Record" click.
  useEffect(() => {
    if (!bothDone) return;
    if (reviewMode) return;
    if (!learner?.email) return;
    if (progress.recordedAt) return; // already stamped

    const completedAt = new Date();
    const elapsedSec = moduleStartedAt ? Math.round((Date.now() - moduleStartedAt) / 1000) : 0;
    const payload = {
      userId: learner.email,
      displayName: learner.name || "",
      role: learner.role || "",
      moduleId: MODULE_ID,
      moduleTitle: MODULE_TITLE,
      completedAt: completedAt.toISOString(),
      timeOnTaskSec: elapsedSec,
      // Module has no scored assessment — these keep the payload
      // shape consistent with the other modules.
      assessScore: 0,
      assessTotal: 0,
      assessFirstPct: 0,
      assessDetails: "",
      quizReviews: 0,
      matchErrors: 0,
      scenarioErrors: 0,
    };
    markComplete(MODULE_ID, payload);
    setProgress((p) => ({ ...p, recordedAt: completedAt.toISOString() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bothDone, reviewMode, learner?.email]);

  const canSubmit = Boolean(
    import.meta.env.VITE_POWERAUTOMATE_URL &&
    import.meta.env.VITE_POWERAUTOMATE_URL.trim().length > 0
  );

  const submitToPA = async () => {
    if (!canSubmit || submitState === "submitting") return;
    setSubmitState("submitting");
    const completedAt = new Date();
    const elapsedSec = moduleStartedAt ? Math.round((Date.now() - moduleStartedAt) / 1000) : 0;
    const payload = {
      userId: learner?.email || "",
      displayName: learner?.name || "",
      role: learner?.role || "",
      moduleId: MODULE_ID,
      moduleTitle: MODULE_TITLE,
      completedAt: completedAt.toISOString(),
      timeOnTaskSec: elapsedSec,
      assessScore: 0,
      assessTotal: 0,
      assessFirstPct: 0,
      assessDetails: "",
      quizReviews: 0,
      matchErrors: 0,
      scenarioErrors: 0,
    };
    const result = await recordCompletion(MODULE_ID, payload);
    setSubmitState(result.success ? "success" : "error");
  };

  const hasBanner = reviewMode;
  const topOffset = hasBanner ? 84 : 52;

  const part = PARTS.find((p) => p.id === currentPart) || PARTS[0];

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Top nav — matches Module2..Module6 chrome */}
      <div className="fixed top-1 left-0 right-0 z-40 flex items-center justify-between px-5 py-2 bg-brand-hdr shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4">
          <button onClick={onHome} className="bg-white rounded px-2 py-1 inline-flex items-center border-none cursor-pointer">
            <img src={bmLogo} alt="B&M" className="h-8" />
          </button>
          <div className="w-px h-5 bg-white/15" />
          <span className="text-xs text-white/50">{MODULE_TITLE} — {part.label}: {part.title}</span>
        </div>
        <div className="flex items-center gap-3">
          {!forceReview && (
            <button
              onClick={toggleReviewMode}
              className="flex items-center gap-1.5 px-3 py-[5px] rounded-md cursor-pointer text-xs font-semibold transition-all duration-150"
              style={reviewMode
                ? { background: B.blue, color: "white", border: "1.5px solid " + B.blue }
                : { background: "transparent", color: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.25)" }}
            >
              {reviewMode ? "Reviewing" : "Review Mode"}
            </button>
          )}
          {forceReview && (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-[5px] rounded-md cursor-pointer text-xs font-semibold transition-all duration-150"
              style={{ background: B.blue, color: "white", border: "1.5px solid " + B.blue }}
            >
              Sign in to complete →
            </button>
          )}
          {learner && <span className="text-xs text-white/35">{learner.name}</span>}
          <button
            onClick={onBackToJourney}
            className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer border-none"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}
            title={parentJourneyId ? "Return to the journey landing page" : "Return to Home"}
          >
            ← Back to Learning Journey
          </button>
        </div>
      </div>

      {/* Review mode banner */}
      {reviewMode && (
        <div
          className="fixed left-0 right-0 z-40 flex items-center justify-center h-8 text-xs font-semibold"
          style={{ top: 52, background: "#dbeeff", color: "#1a6fa0", borderBottom: "1px solid #a8d4f5" }}
        >
          Review mode — progress won't be recorded
        </div>
      )}

      {/* Part switcher — pill nav + completion bar */}
      <div
        className="fixed left-0 right-0 z-30 flex items-center justify-between px-6 py-3 border-b"
        style={{
          top: topOffset,
          background: "#faf5ea",
          borderColor: "rgba(58,50,38,0.1)",
        }}
      >
        <div className="flex items-center gap-2">
          {PARTS.map((p) => {
            const active = p.id === currentPart;
            const done = p.id === 1 ? progress.part1Done : progress.part2Done;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentPart(p.id)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all"
                style={{
                  background: active ? "#3a3226" : "white",
                  color: active ? "#faf5ea" : "#3a3226",
                  borderColor: active ? "#3a3226" : "rgba(58,50,38,0.2)",
                }}
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{
                    background: done ? "#4a8c6f" : active ? "rgba(250,245,234,0.2)" : "rgba(58,50,38,0.1)",
                    color: done ? "white" : active ? "#faf5ea" : "#3a3226",
                  }}
                >
                  {done ? "✓" : p.id}
                </span>
                {p.label}: {p.title}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          {bothDone && (
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#e8f5ee", color: "#4a8c6f", border: "1px solid #a8d4b5" }}>
              ✓ Module complete
            </span>
          )}
          {!bothDone && (
            <span className="text-xs" style={{ color: "#7a6d5c" }}>
              {(progress.part1Done ? 1 : 0) + (progress.part2Done ? 1 : 0)} of 2 parts complete
            </span>
          )}
        </div>
      </div>

      {/* Main content region — embeds the SF component below the
          fixed chrome. The SF components render with minHeight:100vh
          and their own gradient backgrounds; we pad the top to clear
          the fixed nav + part switcher. */}
      <div style={{ paddingTop: topOffset + 56 }}>
        {currentPart === 1 && <ThemedContainers />}
        {currentPart === 2 && <ReportingModule />}
      </div>

      {/* Completion footer — fixed to bottom so the learner can always
          self-report part completion without scrolling back up. */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 border-t"
        style={{
          background: "#faf5ea",
          borderColor: "rgba(58,50,38,0.15)",
          boxShadow: "0 -2px 12px rgba(58,50,38,0.08)",
        }}
      >
        <div className="flex items-center gap-3 text-xs" style={{ color: "#7a6d5c" }}>
          <span style={{ fontFamily: "'Georgia',serif", fontSize: 13 }}>
            <strong>{part.label}:</strong> {part.title}
          </span>
          {((part.id === 1 && progress.part1Done) || (part.id === 2 && progress.part2Done)) && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#e8f5ee", color: "#4a8c6f", border: "1px solid #a8d4b5" }}>
              ✓ Complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Mark-complete button for the current part */}
          {!reviewMode && (
            <>
              {part.id === 1 && !progress.part1Done && (
                <button
                  onClick={() => markPartComplete(1)}
                  className="px-4 py-2 rounded-md text-xs font-bold border-none cursor-pointer"
                  style={{ background: "#3a3226", color: "#faf5ea" }}
                >
                  Mark Part 1 Complete →
                </button>
              )}
              {part.id === 2 && !progress.part2Done && (
                <button
                  onClick={() => markPartComplete(2)}
                  className="px-4 py-2 rounded-md text-xs font-bold border-none cursor-pointer"
                  style={{ background: "#3a3226", color: "#faf5ea" }}
                >
                  Mark Part 2 Complete →
                </button>
              )}
            </>
          )}

          {/* Jump-to-next-part shortcut */}
          {part.id === 1 && progress.part1Done && currentPart === 1 && (
            <button
              onClick={() => setCurrentPart(2)}
              className="px-4 py-2 rounded-md text-xs font-bold border-none cursor-pointer"
              style={{ background: B.blue, color: "white" }}
            >
              Continue to Part 2 →
            </button>
          )}

          {/* Both done: submit + next-step */}
          {bothDone && (
            <>
              {canSubmit && submitState === "success" && (
                <span className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-brand-ok">
                  ✓ Submitted to training record
                </span>
              )}
              {canSubmit && submitState !== "success" && !reviewMode && (
                <button
                  onClick={submitToPA}
                  disabled={submitState === "submitting"}
                  className="px-4 py-2 rounded-md text-xs font-bold border-none cursor-pointer bg-brand-ok text-white disabled:opacity-60 disabled:cursor-wait"
                >
                  {submitState === "submitting" ? "Submitting…" : "📤 Submit to Training Record"}
                </button>
              )}
              {nextStep && (
                <button
                  onClick={() => navigate(nextStep.path)}
                  className="px-4 py-2 rounded-md text-xs font-bold border-none cursor-pointer"
                  style={{ background: nextStep.kind === "assessment" ? "#4a8c6f" : B.blue, color: "white" }}
                >
                  {nextStep.label} →
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Give the fixed footer breathing room so content doesn't
          disappear behind it. 64px ≈ footer height. */}
      <div style={{ height: 64 }} />
    </div>
  );
}
