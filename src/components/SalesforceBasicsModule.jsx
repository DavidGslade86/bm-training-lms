import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { B } from "../data/brand";
import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";
import { getNextStep, getParentJourneyId } from "../services/contentService";
import { useUser } from "../context/UserContext";
import { useSession } from "../context/SessionContext";
import { KEYS, serializeState, deserializeState } from "../hooks/useLocalStorage";
import ThemedContainers from "./salesforce/ThemedContainers";
import { EX, Flow, InjectCSS } from "./salesforce/ReportingModule";

// ═══════════════════════════════════════════════════════
//  SalesforceBasicsModule — tech-stack journey module that
//  walks the learner through two Salesforce training
//  components in a sidebar-driven progression matching the
//  rest of the LMS:
//
//    1. Data Model  — ThemedContainers walkthrough (Part 1)
//    2. Exercise 1  — Single Object Report (Reporting Flow)
//    3. Exercise 2  — Cross-Object Report (Reporting Flow)
//    4. Exercise 3  — Refining & Grouping (Reporting Flow)
//    5. Complete    — completion summary + submit
//
//  Each sidebar entry unlocks the next when the learner fires
//  the child component's onComplete callback. Exercises also
//  surface an inline "Next Exercise →" button at the Try It
//  stage for faster progression; the sidebar stays clickable
//  once a section is unlocked so learners can jump around.
//
//  The child SF components are kept intact in src/components/
//  salesforce/ so they can be refreshed from the spec without
//  merge conflicts. This wrapper only adds the LMS chrome +
//  progression + completion plumbing (markComplete, PA submit,
//  getNextStep for the journey-continue button).
//
//  Progress is persisted under bm-lms-progress-salesforce-basics-<email>
//  using a tiny reducer with Set-valued done/open fields so it
//  rides the same STATE_VERSION guard as the other modules.
// ═══════════════════════════════════════════════════════

const MODULE_ID = "salesforce-basics";
const MODULE_TITLE = "Salesforce Basics";

const SECTIONS = [
  {
    id: "data-model",
    nav: "Data Model",
    kind: "themed",
    title: "Objects: Containers for Data",
    subtitle: "Part 1 — how Salesforce organizes data",
  },
  { id: "ex-1",    nav: "Exercise 1", kind: "exercise", exerciseId: 1, title: "Single Object Report" },
  { id: "ex-2",    nav: "Exercise 2", kind: "exercise", exerciseId: 2, title: "Cross-Object Report" },
  { id: "ex-3",    nav: "Exercise 3", kind: "exercise", exerciseId: 3, title: "Refining & Grouping" },
  { id: "complete", nav: "Complete",  kind: "completion", title: "Module Complete" },
];

// ── Reducer (mirrors the card-modules' state.js pattern) ──
const initSF = {
  done: new Set(),
  open: new Set([0]),
  cur: 0,
  recordedAt: null,
};

function sfRed(s, a) {
  switch (a.t) {
    case "GO":
      return { ...s, cur: a.i, open: new Set([...s.open, a.i]) };
    case "COMPLETE_SECTION": {
      if (s.done.has(a.i)) return s; // idempotent
      const d = new Set([...s.done, a.i]);
      const o = new Set([...s.open]);
      if (a.i + 1 < SECTIONS.length) o.add(a.i + 1);
      return { ...s, done: d, open: o };
    }
    case "RECORDED_AT":
      return s.recordedAt ? s : { ...s, recordedAt: a.at };
    default:
      return s;
  }
}

// Bespoke persistence hook. We don't use usePersistedReducer here
// because its STATE_VERSION guard lives in state.js and is shared
// by the other modules — we don't want a schema bump there to wipe
// this module's progress (and vice-versa). Shape is small enough
// that rolling our own is simpler than generalizing the hook.
function useSFReducer(storageKey) {
  const [state, dispatch] = useReducer(sfRed, storageKey, (key) => {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      if (!raw) return initSF;
      return deserializeState(raw, initSF);
    } catch {
      return initSF;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(serializeState(state)));
    } catch {
      // storage full — silently fail, matches the other persistence paths
    }
  }, [state, storageKey]);
  return [state, dispatch];
}

export default function SalesforceBasicsModule() {
  const navigate = useNavigate();
  const { user: learner, markComplete, recordCompletion } = useUser();
  const { guestReview, setGuestReview, moduleStartedAt } = useSession();
  const forceReview = guestReview;
  const [reviewMode, setReviewMode] = useState(forceReview);
  const toggleReviewMode = () => { if (!forceReview) setReviewMode(v => !v); };

  const storageKey = KEYS.module(MODULE_ID, learner?.email || "anonymous");
  const [s, d] = useSFReducer(storageKey);

  const [parentJourneyId, setParentJourneyId] = useState(null);
  const [nextStep, setNextStep] = useState(null);
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success | error
  const [submittedAt, setSubmittedAt] = useState(null);

  // Resolve parent journey + next step for the back + continue buttons
  useEffect(() => {
    let cancelled = false;
    getParentJourneyId(MODULE_ID).then((id) => { if (!cancelled) setParentJourneyId(id); });
    getNextStep(MODULE_ID).then((step) => { if (!cancelled) setNextStep(step); });
    return () => { cancelled = true; };
  }, []);

  // Smooth-scroll on section change to mirror the card modules' UX.
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [s.cur]);

  const onHome = () => navigate("/");
  const onSignIn = () => { setGuestReview(false); navigate("/"); };
  const onBackToJourney = () => navigate(parentJourneyId ? `/journeys/${parentJourneyId}` : "/");

  const completeSection = (i) => { if (!reviewMode) d({ t: "COMPLETE_SECTION", i }); };
  const goTo = (i) => { d({ t: "GO", i }); };

  // ── Module-level completion side effect ──
  // When Exercise 3 is marked done (index 3), stamp the completion
  // locally so the journey progress bar fills in. Submission to the
  // training record still requires an explicit button click.
  const ex3Done = s.done.has(3);
  useEffect(() => {
    if (!ex3Done) return;
    if (reviewMode) return;
    if (!learner?.email) return;
    if (s.recordedAt) return; // already stamped — idempotent

    const completedAt = new Date();
    const elapsedSec = moduleStartedAt ? Math.round((Date.now() - moduleStartedAt) / 1000) : 0;
    const payload = buildPayload(learner, completedAt, elapsedSec, s.done);
    markComplete(MODULE_ID, payload);
    d({ t: "RECORDED_AT", at: completedAt.toISOString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex3Done, reviewMode, learner?.email]);

  const canSubmit = Boolean(
    import.meta.env.VITE_POWERAUTOMATE_URL &&
    import.meta.env.VITE_POWERAUTOMATE_URL.trim().length > 0
  );

  const submitToPA = async () => {
    if (!canSubmit || submitState === "submitting") return;
    setSubmitState("submitting");
    const completedAt = new Date();
    const elapsedSec = moduleStartedAt ? Math.round((Date.now() - moduleStartedAt) / 1000) : 0;
    const payload = buildPayload(learner, completedAt, elapsedSec, s.done);
    const result = await recordCompletion(MODULE_ID, payload);
    if (result.success) {
      setSubmitState("success");
      setSubmittedAt(new Date().toLocaleString());
    } else {
      setSubmitState("error");
    }
  };

  const hasBanner = reviewMode;
  const topOffset = hasBanner ? 84 : 52;
  const section = SECTIONS[s.cur] || SECTIONS[0];
  const totalSections = SECTIONS.length;
  const pct = totalSections > 1 ? (s.cur / (totalSections - 1)) * 100 : 0;

  // Pre-compute the callback props for each section so the nested
  // JSX below stays readable.
  const dataModelComplete = () => completeSection(0);
  const dataModelNext = () => {
    completeSection(0); // mark Data Model done
    goTo(1);            // navigate to Exercise 1 (which COMPLETE_SECTION also unlocks)
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <InjectCSS />

      {/* Progress bar (top 1px) */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-brand-sand">
        <div className="h-full transition-all duration-500 bg-brand-blue" style={{ width: `${pct}%` }} />
      </div>

      {/* Top nav */}
      <div className="fixed top-1 left-0 right-0 z-40 flex items-center justify-between px-5 py-2 bg-brand-hdr shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4">
          <button onClick={onHome} className="bg-white rounded px-2 py-1 inline-flex items-center border-none cursor-pointer">
            <img src={bmLogo} alt="B&M" className="h-8" />
          </button>
          <div className="w-px h-5 bg-white/15" />
          <span className="text-xs text-white/50">{MODULE_TITLE}</span>
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
          <span className="text-xs text-white/40">Section {s.cur + 1} of {totalSections}</span>
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
          Review mode — all sections unlocked, progress won't be recorded
        </div>
      )}

      <div className="flex" style={{ marginTop: topOffset }}>
        {/* Sidebar */}
        <div
          className="fixed left-0 overflow-y-auto z-30 py-5 w-60 bg-brand-side"
          style={{ top: topOffset, bottom: 0 }}
        >
          <div className="px-5 mb-3 text-xs font-bold tracking-widest text-white/25">SECTIONS</div>
          {SECTIONS.map((sec, i) => {
            const act = i === s.cur;
            const comp = s.done.has(i);
            const unlk = s.open.has(i) || reviewMode;
            return (
              <div
                key={sec.id}
                onClick={() => { if (unlk || comp) goTo(i); }}
                className="flex items-start gap-3 px-5 py-2"
                style={{
                  borderLeft: `3px solid ${act ? B.blue : "transparent"}`,
                  background: act ? "rgba(255,255,255,0.06)" : "transparent",
                  opacity: unlk || comp ? 1 : 0.3,
                  cursor: unlk || comp ? "pointer" : "default",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5 text-[9px]"
                  style={{
                    border: `2px solid ${comp ? B.ok : act ? B.blue : "rgba(255,255,255,0.2)"}`,
                    background: comp ? B.ok : "transparent",
                    color: comp ? "white" : act ? B.blue : "rgba(255,255,255,0.35)",
                  }}
                >
                  {comp ? "✓" : i + 1}
                </div>
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <span
                    className="text-xs truncate"
                    style={{ color: act ? "white" : "rgba(255,255,255,0.55)" }}
                  >
                    {sec.nav}
                  </span>
                  {reviewMode && act && (
                    <span
                      className="text-[9px] font-bold px-1 rounded shrink-0 ml-1"
                      style={{ background: "rgba(0,155,223,0.3)", color: B.blue }}
                    >
                      Review
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main content — the SF components render with their own
            gradient backgrounds and max-widths, so we just give them
            breathing room to the right of the fixed sidebar. */}
        <div className="flex-1 ml-60 min-h-[calc(100vh-52px)]">
          {section.kind === "themed" && (
            <ThemedContainers
              onComplete={dataModelComplete}
              onNext={dataModelNext}
              nextLabel="Continue to Exercise 1 →"
            />
          )}

          {section.kind === "exercise" && (() => {
            const ex = EX.find((e) => e.id === section.exerciseId);
            if (!ex) return null;
            const idx = s.cur;
            const isLastExercise = section.exerciseId === 3;
            return (
              <div style={{
                minHeight: "calc(100vh - 52px)",
                background: "linear-gradient(155deg,#faf5ea 0%,#f2ead6 35%,#e8dfc8 100%)",
                fontFamily: "'Georgia','Times New Roman',serif",
                color: "#3a3226",
                padding: "20px 16px",
                boxSizing: "border-box",
              }}>
                <div style={{ maxWidth: 860, margin: "0 auto" }}>
                  {/* key={ex.id} resets Flow's internal stage state when
                      switching exercises — otherwise stage 5 (Try It) from
                      Ex2 carries into Ex3, and since Ex3's prefilled flow
                      only has 4 stages (indices 0-3), stage 5 falls out
                      of range and the card renders blank.

                      We intentionally DO NOT pass onBack: the sidebar is
                      the navigation surface inside the LMS wrapper, so
                      the in-Flow "← Exercises" button (which used to
                      point at the now-removed picker view) is suppressed.

                      onNext is passed for every exercise — the last one
                      drives the learner straight into the completion
                      card instead of the next exercise. */}
                  <Flow
                    key={ex.id}
                    ex={ex}
                    onComplete={() => completeSection(idx)}
                    onNext={() => {
                      completeSection(idx);
                      goTo(isLastExercise ? SECTIONS.length - 1 : idx + 1);
                    }}
                    nextLabel={
                      section.exerciseId === 1 ? "Continue to Exercise 2 →" :
                      section.exerciseId === 2 ? "Continue to Exercise 3 →" :
                      "Complete Module →"
                    }
                  />
                </div>
              </div>
            );
          })()}

          {section.kind === "completion" && (
            <CompletionPanel
              reviewMode={reviewMode}
              canSubmit={canSubmit}
              submitState={submitState}
              submittedAt={submittedAt}
              onSubmit={submitToPA}
              nextStep={nextStep}
              navigate={navigate}
              learner={learner}
              moduleStartedAt={moduleStartedAt}
              done={s.done}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Completion payload builder ──
// Kept out of the component body so both the auto-stamp effect and the
// Submit-to-PA button use the exact same shape.
//
// Shape matches PAYLOAD_SCHEMA in src/data/learnerSchema.js. The flat
// assessment/error fields are zeroed (this module has no scored quiz)
// and module-specific progression info rides in `moduleData`, which
// the future backend can land in a JSON column on the completion row.
function buildPayload(learner, completedAt, elapsedSec, done) {
  const sectionsCompleted = SECTIONS
    .filter((_, i) => done && done.has(i))
    .map((sec) => sec.id);
  const exercisesCompleted = SECTIONS
    .filter((sec, i) => sec.kind === "exercise" && done && done.has(i))
    .length;

  return {
    userId: learner?.email || "",
    displayName: learner?.name || "",
    role: learner?.role || "",
    moduleId: MODULE_ID,
    moduleTitle: MODULE_TITLE,
    completedAt: completedAt.toISOString(),
    timeOnTaskSec: elapsedSec,
    // Module has no scored assessment — zero fields keep the payload
    // shape consistent with the card-based modules.
    assessScore: 0,
    assessTotal: 0,
    assessFirstPct: 0,
    assessDetails: "",
    quizReviews: 0,
    matchErrors: 0,
    scenarioErrors: 0,
    // Module-specific progression metadata — see PAYLOAD_SCHEMA.moduleData.
    moduleData: {
      sectionsCompleted,
      exercisesCompleted,
      totalSections: SECTIONS.length,
    },
  };
}

// ── Completion panel ──
// Small inline component so the main render function stays focused
// on routing/sidebar logic. Mirrors the relevant bits of
// CompletionCard without the quiz/scenario error metrics (which
// don't apply to this module).
function CompletionPanel({ reviewMode, canSubmit, submitState, submittedAt, onSubmit, nextStep, navigate, learner, moduleStartedAt, done }) {
  const completedAt = new Date();
  const elapsedSec = moduleStartedAt ? Math.round((Date.now() - moduleStartedAt) / 1000) : null;
  const elapsedStr = elapsedSec
    ? elapsedSec < 60 ? `${elapsedSec}s` : `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`
    : "—";
  const completedCount = [0, 1, 2, 3].filter((i) => done.has(i)).length;

  return (
    <div className="py-8 px-10 max-w-[840px] mx-auto">
      {/* Hero */}
      <div className="rounded-lg p-10 text-center text-white mb-6 bg-brand-hdr">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 bg-brand-ok">✓</div>
        <div className="text-2xl font-bold mb-1 text-brand-blue font-heading">Module Complete</div>
        <p className="text-sm mb-1 text-white/55">
          {learner?.name && <span className="text-white/80 font-semibold">{learner.name} · </span>}
          {MODULE_TITLE}
        </p>
        <p className="text-xs mb-6 text-white/35">
          Completed {completedAt.toLocaleString()} · {elapsedStr} on module
        </p>
        <div className="inline-block rounded-lg px-10 py-5 bg-white/[0.07]">
          <div className="text-5xl font-bold mb-1 text-brand-blue font-heading">{completedCount}/4</div>
          <div className="text-xs text-white/40">Sections completed</div>
        </div>
      </div>

      {/* Recap */}
      <div className="rounded-lg p-6 mb-4 bg-brand-ww border border-brand-sand">
        <div className="text-xs font-bold tracking-widest mb-4 text-brand-tl">WHAT YOU COVERED</div>
        <ul className="flex flex-col gap-2 text-xs text-brand-tm">
          <li>• How Salesforce objects, fields, and records fit together</li>
          <li>• Master-detail vs. lookup relationships, and what that means for reporting</li>
          <li>• Picking a report type: single-object vs. combined report types</li>
          <li>• Adding filters, refining results, and grouping with Summary reports</li>
        </ul>
      </div>

      {/* Submit to Training Record */}
      {reviewMode ? (
        <div className="rounded-lg p-6 mb-6 bg-brand-ww border border-brand-sand text-center">
          <div className="text-sm font-semibold text-brand-tl">
            Module review complete — exit review mode to record a real completion.
          </div>
        </div>
      ) : (
        <div className="rounded-lg p-6 mb-6 bg-brand-ww border border-brand-sand">
          <div className="text-xs font-bold tracking-widest mb-1 text-brand-tl">SAVE YOUR RESULTS</div>
          <p className="text-xs mb-4 text-brand-tl">
            Submit your completion so your training record stays current.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            {canSubmit && submitState === "success" && (
              <span className="flex items-center gap-[7px] px-4 py-[9px] text-xs font-semibold text-brand-ok">
                ✓ Submitted to training record{submittedAt && ` · ${submittedAt}`}
              </span>
            )}
            {canSubmit && submitState !== "success" && (
              <button
                onClick={onSubmit}
                disabled={submitState === "submitting"}
                className="flex items-center gap-[7px] px-4 py-[9px] rounded-md text-xs font-bold border-none cursor-pointer bg-brand-ok text-white disabled:opacity-60 disabled:cursor-wait"
              >
                {submitState === "submitting" ? "Submitting…" : "📤 Submit to Training Record"}
              </button>
            )}
            {!canSubmit && (
              <span className="text-xs text-brand-tl italic">
                (Training-record submission isn't configured in this environment.)
              </span>
            )}
          </div>
          {submitState === "error" && (
            <p className="text-xs mt-2 font-semibold text-brand-err">
              Submission failed — please try again.
            </p>
          )}
        </div>
      )}

      {/* Next-step navigation */}
      {nextStep && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(nextStep.path)}
            className="px-8 py-3 rounded-lg text-sm font-bold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: nextStep.kind === "assessment" ? B.ok : B.blue }}
          >
            {nextStep.label} →
          </button>
        </div>
      )}
    </div>
  );
}
