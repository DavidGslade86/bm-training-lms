import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { B } from "../data/brand";
import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";
import { getNextStep, getParentJourneyId } from "../services/contentService";
import { useUser } from "../context/UserContext";
import { useSession } from "../context/SessionContext";
import { KEYS, serializeState, deserializeState } from "../hooks/useLocalStorage";
import ThemedContainers from "./salesforce/ThemedContainers";
import { EX, Flow, InjectCSS, OBJ } from "./salesforce/ReportingModule";

// ═══════════════════════════════════════════════════════
//  SalesforceBasicsModule — tech-stack journey module that
//  walks the learner through two Salesforce training
//  components in a sidebar-driven progression matching the
//  rest of the LMS:
//
//    1. Data Model        — ThemedContainers walkthrough (Part 1)
//    2. Field Explorer    — how to preview available fields
//                           inside the Create Report picker and
//                           the Builder's Fields panel
//    3. Exercise 1        — Single Object Report
//    4. Exercise 2        — Cross-Object Report
//    5. Exercise 3        — Refining by Record Type
//    6. Reporting Tips    — Show Me nuance, when Type=Client
//                           actually applies, when Record Type
//                           filters matter, and when to clone an
//                           existing report instead of starting
//                           from scratch
//    7. Complete          — completion summary + submit
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
  { id: "field-tools",     nav: "Field Explorer",  kind: "field-tools", title: "Exploring Available Fields" },
  { id: "ex-1",            nav: "Exercise 1",      kind: "exercise", exerciseId: 1, title: "Single Object Report" },
  { id: "ex-2",            nav: "Exercise 2",      kind: "exercise", exerciseId: 2, title: "Cross-Object Report" },
  { id: "ex-3",            nav: "Exercise 3",      kind: "exercise", exerciseId: 3, title: "Refining by Record Type" },
  { id: "reporting-tips",  nav: "Reporting Tips",  kind: "tips",     title: "Reporting Tips & Nuance" },
  { id: "complete",        nav: "Complete",        kind: "completion", title: "Module Complete" },
];

// Stable lookup for sections the rest of the file has to reason about.
// Avoids re-counting by id every time the learner advances.
const EX3_IDX  = SECTIONS.findIndex((s) => s.id === "ex-3");
const DONE_IDX = SECTIONS.findIndex((s) => s.id === "complete");

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
  // When Exercise 3 is marked done, stamp the completion locally so the
  // journey progress bar fills in. The Reporting Tips section is
  // supplementary content — not gating completion — so we fire here
  // rather than waiting for tips to be acknowledged. Submission to the
  // training record still requires an explicit button click.
  const ex3Done = s.done.has(EX3_IDX);
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
                      goTo(idx + 1);
                    }}
                    nextLabel={
                      section.exerciseId === 1 ? "Continue to Exercise 2 →" :
                      section.exerciseId === 2 ? "Continue to Exercise 3 →" :
                      "Continue to Reporting Tips →"
                    }
                  />
                </div>
              </div>
            );
          })()}

          {section.kind === "field-tools" && (
            <FieldToolsSection
              onComplete={() => completeSection(s.cur)}
              onNext={() => {
                completeSection(s.cur);
                goTo(s.cur + 1);
              }}
            />
          )}

          {section.kind === "tips" && (
            <ReportingTipsSection
              onComplete={() => completeSection(s.cur)}
              onNext={() => {
                completeSection(s.cur);
                goTo(DONE_IDX);
              }}
            />
          )}

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
  // Count everything except the "Complete" landing page itself —
  // reaching it is implied by being rendered inside CompletionPanel.
  const trackable = SECTIONS
    .map((_, i) => i)
    .filter((i) => i !== DONE_IDX);
  const completedCount = trackable.filter((i) => done.has(i)).length;
  const completedTotal = trackable.length;

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
          <div className="text-5xl font-bold mb-1 text-brand-blue font-heading">{completedCount}/{completedTotal}</div>
          <div className="text-xs text-white/40">Sections completed</div>
        </div>
      </div>

      {/* Recap */}
      <div className="rounded-lg p-6 mb-4 bg-brand-ww border border-brand-sand">
        <div className="text-xs font-bold tracking-widest mb-4 text-brand-tl">WHAT YOU COVERED</div>
        <ul className="flex flex-col gap-2 text-xs text-brand-tm">
          <li>• How Salesforce objects, fields, and records fit together</li>
          <li>• Previewing available fields in the Create Report picker and the Builder</li>
          <li>• Picking a report type: single-object vs. combined report types</li>
          <li>• Adding filters, refining by Record Type, and grouping with Summary reports</li>
          <li>• When to use Show Me = "My Accounts" vs. "All Accounts"</li>
          <li>• When Type = Client and Account Record Type filters actually apply</li>
          <li>• Cloning an existing report as a faster starting point</li>
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

// ═══════════════════════════════════════════════════════
//  Field Explorer section
// ═══════════════════════════════════════════════════════
// Two interactive panels that mirror where the learner would
// encounter the Fields tool inside Salesforce:
//
//   1. The Fields tab of the Details panel inside the Create
//      Report picker — used BEFORE a report type is selected
//      to sanity-check that the fields you'll need actually
//      exist on those objects.
//   2. The expandable Fields panel inside the Report Builder —
//      used DURING building to find a field you haven't added
//      yet or to confirm field names before filtering.
//
// Each field row is hoverable; the tooltip at the top of the
// section updates to explain which object the field lives on
// and why a learner might reach for it. The mock visual style
// mirrors the real Salesforce chrome so learners recognize it
// when they see the actual UI.
// ═══════════════════════════════════════════════════════

// Field-level annotations. Only the handful of fields that
// actually come up across the three exercises are noted in
// plain English; any field without an entry falls back to the
// generic "lives on [Object]" tooltip.
const FIELD_NOTES = {
  "Lead.Employer":                            "Text field — where a lead worked. Drives Exercise 1's FDNY filter.",
  "Lead.Last Name":                           "Used in almost every Lead report as an output column.",
  "Account.Account Name":                     "Primary display name for the account — shown in nearly every Account-based report.",
  "Account.VCF #":                            "The VCF claim identifier — useful as an output column for claim-lifecycle reports.",
  "Account.Status":                           "Picklist — where the account sits in the lifecycle. Used in Exercises 2 and 3 to find 'Claim Submission'.",
  "Account.Type":                             "Picklist — 'Client' only applies once the account has signed a retainer. Not a universal filter.",
  "Account.Account Record Type":              "Picklist — the VCF cohort: VCF Victim, VCF Estate, or VCF Courtesy. Used in Exercise 3 to scope to Estate accounts.",
  "Account.Account Owner":                    "The Salesforce user who owns this account. This is what the Show Me = My Accounts shortcut filters by.",
  "Account.Primary Contact":                  "Lookup to the main Contact for the account.",
  "Account.Last Modified Date":               "Useful for 'changed since' queries.",
  "CMS Claim Submission.Submitted Date":      "Date — when the claim was submitted to the VCF. Used in Exercises 2 and 3 for date filtering.",
  "CMS Claim Submission.Claim No":            "The claim's internal identifier — usually included as an output column.",
  "CMS Claim Submission.Claim Status":        "Picklist — current state of the claim submission.",
};

// Which objects to surface in each panel. The report-picker panel
// mimics the Ex2 report type (Accounts with CMS Claim Submissions);
// the builder panel is identical — if the learner wanted Ex1's Leads
// they'd see a single-object field list instead, and this demo would
// feel redundant. Two objects is the more instructive example.
const PANEL_OBJS = ["Account", "CMS Claim Submission"];

function FieldRow({ obj, field, onHover }) {
  const [active, setActive] = useState(false);
  const key = `${obj}.${field}`;
  const note = FIELD_NOTES[key];
  return (
    <div
      onMouseEnter={() => { setActive(true); onHover({ obj, field, note }); }}
      onMouseLeave={() => { setActive(false); onHover(null); }}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "5px 10px",
        fontFamily: "'Salesforce Sans','Segoe UI',sans-serif",
        fontSize: 12.5,
        color: "#181818",
        background: active ? "#e8f4fd" : "transparent",
        borderLeft: active ? "2px solid #0176d3" : "2px solid transparent",
        cursor: "help",
        borderRadius: 2,
      }}
    >
      <span style={{ color: "#706e6b", fontSize: 11, fontFamily: "'SF Mono','Courier New',monospace" }}>A</span>
      <span style={{ flex: 1 }}>{field}</span>
      {note && <span style={{ fontSize: 10, color: "#0176d3", opacity: active ? 1 : 0.4 }}>●</span>}
    </div>
  );
}

function FieldToolsSection({ onComplete, onNext }) {
  const [hover, setHover] = useState(null);
  // Mark the section "explored" as soon as the learner hovers any
  // field — that's proof they engaged with the tool. The sidebar
  // "Next" button is always available though, so they can skip.
  useEffect(() => { if (hover && onComplete) onComplete(); }, [hover, onComplete]);

  const T = {
    bg: "linear-gradient(155deg,#faf5ea 0%,#f2ead6 35%,#e8dfc8 100%)",
    text: "#3a3226", tm: "#7a6e5a", card: "rgba(255,255,255,0.55)", cb: "rgba(58,50,38,0.1)",
    sb: "#0176d3", sbo: "#d8dde6",
    d: "'Georgia','Times New Roman',serif",
    s: "'Salesforce Sans','Segoe UI',sans-serif",
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 52px)", background: T.bg,
      fontFamily: T.d, color: T.text, padding: "24px 16px", boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            display: "inline-block", background: T.text, color: "#faf5ea",
            padding: "4px 18px", borderRadius: 20, fontSize: 10.5, letterSpacing: 2.5,
            textTransform: "uppercase", fontFamily: "'SF Mono','Courier New',monospace", marginBottom: 8,
          }}>Before You Build</div>
          <h1 style={{ fontSize: 26, fontWeight: 400, margin: "8px 0 0", letterSpacing: -0.5 }}>
            Previewing Available Fields
          </h1>
          <p style={{ fontSize: 13, opacity: 0.6, margin: "6px 0 0", fontStyle: "italic" }}>
            Two tools Salesforce gives you for checking what's available — hover any field to see what it's used for.
          </p>
        </div>

        {/* Live tooltip — updates as the learner hovers fields below */}
        <div style={{
          background: hover ? "#fdf8e8" : "rgba(255,255,255,0.4)",
          border: `1px solid ${hover ? "#c9a84c" : T.cb}`,
          borderRadius: 10, padding: "14px 18px", minHeight: 72,
          marginBottom: 20, fontFamily: T.d, fontSize: 14, lineHeight: 1.5,
          transition: "background-color 150ms",
        }}>
          {hover ? (
            <>
              <div style={{ fontSize: 11, color: T.tm, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: T.s, fontWeight: 700 }}>
                Hovering
              </div>
              <div style={{ fontSize: 15 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: OBJ[hover.obj]?.c || "#888", color: "#fff",
                  padding: "2px 9px", borderRadius: 10, fontSize: 11,
                  fontFamily: T.s, fontWeight: 600, marginRight: 8,
                }}>{hover.obj}</span>
                <strong>{hover.field}</strong>
              </div>
              <div style={{ fontSize: 13, color: T.tm, marginTop: 6 }}>
                {hover.note || `Lives on the ${hover.obj} object. Included in any report type that uses ${hover.obj}.`}
              </div>
            </>
          ) : (
            <div style={{ color: T.tm, fontStyle: "italic", paddingTop: 4 }}>
              Hover a field in either panel below. Fields marked with a blue dot have extra notes about when to use them.
            </div>
          )}
        </div>

        {/* Panel 1 — Create Report picker (Fields tab) */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: T.s, fontSize: 11, fontWeight: 700, color: T.tm, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            1. Inside the Create Report picker
          </div>
          <p style={{ fontFamily: T.d, fontSize: 14, color: T.text, lineHeight: 1.6, margin: "0 0 10px" }}>
            When you're choosing a report type, click the <strong>Fields</strong> tab in the Details panel on the right to preview the fields each object brings to the table. This is how you catch mistakes <em>before</em> you start building — if the field you need isn't listed, you picked the wrong report type.
          </p>
          <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${T.sbo}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {/* Header strip mimicking the real picker */}
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.sbo}`, fontFamily: T.s, fontSize: 13, color: "#181818", fontWeight: 600 }}>
              Accounts with CMS Claim Submissions
              <span style={{ fontSize: 11, color: "#706e6b", marginLeft: 10, fontWeight: 400 }}>· Details panel</span>
            </div>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `2px solid ${T.sbo}`, padding: "0 14px" }}>
              <div style={{ padding: "8px 14px", fontFamily: T.s, fontSize: 12, fontWeight: 600, color: "#706e6b", borderBottom: "2px solid transparent", marginBottom: -2 }}>ⓘ Details</div>
              <div style={{ padding: "8px 14px", fontFamily: T.s, fontSize: 12, fontWeight: 600, color: T.sb, borderBottom: `2px solid ${T.sb}`, marginBottom: -2 }}>☰ Fields</div>
            </div>
            {/* Search placeholder + fields */}
            <div style={{ padding: "10px 14px" }}>
              <div style={{ border: `1px solid ${T.sbo}`, borderRadius: 4, padding: "5px 10px", fontFamily: T.s, fontSize: 12, color: "#706e6b", marginBottom: 12 }}>🔍 Quick Lookup</div>
              {PANEL_OBJS.map((on) => (
                <div key={on} style={{ marginBottom: 14 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: T.s, fontSize: 11, fontWeight: 700, color: "#706e6b",
                    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: OBJ[on]?.c || "#888" }} />
                    {on} Fields
                    <span style={{ color: "#b5b5b5", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                      ({OBJ[on]?.f.length})
                    </span>
                  </div>
                  {(OBJ[on]?.f || []).map((f) => (
                    <FieldRow key={f} obj={on} field={f} onHover={setHover} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2 — Builder's expanded Fields panel */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: T.s, fontSize: 11, fontWeight: 700, color: T.tm, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            2. Inside the Report Builder
          </div>
          <p style={{ fontFamily: T.d, fontSize: 14, color: T.text, lineHeight: 1.6, margin: "0 0 10px" }}>
            Once you're in the Builder, the <strong>Fields</strong> ribbon on the far left slides out a searchable panel with everything available. Use it to double-check a field name before filtering, or to pull an extra column you didn't plan for.
          </p>
          <div style={{ background: "#fafafa", borderRadius: 8, border: `1px solid ${T.sbo}`, overflow: "hidden", display: "flex", minHeight: 280, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {/* Ribbon tab (open) */}
            <div style={{ width: 24, background: "#eef3f8", borderRight: `1px solid ${T.sbo}`, display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-lr", fontFamily: T.s, fontSize: 11, color: T.sb, fontWeight: 600, letterSpacing: 1 }}>
              Fields ◂
            </div>
            {/* Fields panel body */}
            <div style={{ flex: 1, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontFamily: T.s, fontSize: 13, fontWeight: 700, color: "#181818" }}>Fields</span>
                <span style={{ fontFamily: T.s, fontSize: 12, color: "#706e6b" }}>×</span>
              </div>
              <div style={{ border: `1px solid ${T.sbo}`, borderRadius: 4, padding: "5px 10px", fontFamily: T.s, fontSize: 12, color: "#706e6b", marginBottom: 12, background: "#fff" }}>🔍 Search all fields...</div>
              {PANEL_OBJS.map((on) => (
                <div key={on} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: T.s, fontSize: 11, fontWeight: 700, color: "#706e6b", marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: OBJ[on]?.c || "#888" }} />
                    {on} ({OBJ[on]?.f.length})
                  </div>
                  {(OBJ[on]?.f || []).map((f) => (
                    <FieldRow key={f} obj={on} field={f} onHover={setHover} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          background: "#fdf8e8", border: "1px solid #c9a84c", borderRadius: 10,
          padding: "14px 18px", fontFamily: T.d, fontSize: 14, color: T.text, lineHeight: 1.6,
          marginBottom: 20,
        }}>
          <strong>Why this matters.</strong> Catching a missing field at this stage — before you've committed to a report type — saves you the detour of starting over. If the field you need isn't on the objects in the Details panel, pick a different report type.
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={onNext}
            style={{
              padding: "12px 24px", background: T.sb, color: "#fff", border: "none",
              borderRadius: 8, fontSize: 14, fontFamily: T.d, fontWeight: 700, cursor: "pointer",
            }}
          >
            Continue to Exercise 1 →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  Reporting Tips section
// ═══════════════════════════════════════════════════════
// Post-exercise nuance. The exercises teach the mechanics; this
// section teaches the things that trip experienced users up:
//
//   • Show Me — default to "My Accounts", escalate to "All
//     Accounts" only for firm-wide questions.
//   • Type = Client isn't universal — CA I pre-retainer accounts
//     and Courtesy Team accounts often aren't Client-typed.
//   • Account Record Type is a cohort dimension (VCF Victim /
//     Estate / Courtesy), not an ownership filter.
//   • Clone-and-modify — search existing reports first,
//     especially ones built by supervisors or senior CAs.
//
// Kept deliberately terse — deeper reporting scenarios belong in
// a follow-up "Advanced Reporting" module.
// ═══════════════════════════════════════════════════════

function TipCard({ icon, title, children, accent = "#0176d3" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.6)", border: "1px solid rgba(58,50,38,0.1)",
      borderLeft: `4px solid ${accent}`, borderRadius: 10, padding: "16px 20px", marginBottom: 14,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
        fontFamily: "'Georgia',serif", fontSize: 16, fontWeight: 700, color: "#3a3226",
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        {title}
      </div>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: "#3a3226", lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

function ReportingTipsSection({ onComplete, onNext }) {
  // Mark the section done as soon as the learner scrolls/mounts —
  // the content is advisory, not gated. Running onComplete once on
  // mount keeps the sidebar checkmark consistent with how the other
  // sections behave.
  useEffect(() => { if (onComplete) onComplete(); }, [onComplete]);

  const T = {
    bg: "linear-gradient(155deg,#faf5ea 0%,#f2ead6 35%,#e8dfc8 100%)",
    text: "#3a3226", tm: "#7a6e5a",
    sb: "#0176d3", accent: "#c9a84c",
    d: "'Georgia','Times New Roman',serif",
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 52px)", background: T.bg,
      fontFamily: T.d, color: T.text, padding: "24px 16px", boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            display: "inline-block", background: T.text, color: "#faf5ea",
            padding: "4px 18px", borderRadius: 20, fontSize: 10.5, letterSpacing: 2.5,
            textTransform: "uppercase", fontFamily: "'SF Mono','Courier New',monospace", marginBottom: 8,
          }}>Real-World Nuance</div>
          <h1 style={{ fontSize: 26, fontWeight: 400, margin: "8px 0 0", letterSpacing: -0.5 }}>
            Reporting Tips
          </h1>
          <p style={{ fontSize: 13, opacity: 0.6, margin: "6px 0 0", fontStyle: "italic" }}>
            A few things the exercises didn't show you that will save you time and mistakes.
          </p>
        </div>

        <TipCard icon="🔎" title="Start with Show Me — &quot;My Accounts&quot; is usually what you want" accent={T.sb}>
          Every Account report opens with <strong>Show Me</strong> set to <em>All Accounts</em>. Most of the time the question you actually have is about <em>your</em> accounts — switch it to <strong>My Accounts</strong> and the Builder quietly filters by Account Owner = you, which is almost always what you meant.
          <div style={{ marginTop: 8, fontSize: 13, color: T.tm }}>
            Use <em>All Accounts</em> when you're answering a firm-wide question — staffing load across a team, overall claim volume, etc. — not when you're looking at your own pipeline.
          </div>
        </TipCard>

        <TipCard icon="⚠️" title="&quot;Type = Client&quot; is not a universal filter" accent="#9a6b1a">
          An account only becomes <strong>Type = Client</strong> once the firm has a signed retainer. That means it <em>excludes</em> a lot of real work:
          <ul style={{ margin: "8px 0 0 18px", padding: 0, fontSize: 14, lineHeight: 1.7 }}>
            <li><strong>CA I scope, pre-retainer:</strong> people being enrolled in the World Trade Center Health Program who haven't returned their Intake Kit aren't Client-typed yet.</li>
            <li><strong>Courtesy Team accounts:</strong> often unretained potential clients without actionable claims today.</li>
          </ul>
          <div style={{ marginTop: 8, fontSize: 13, color: T.tm }}>
            Reach for <strong>Type = Client</strong> only when you specifically want accounts that have retained the firm. Otherwise it silently drops records you probably wanted.
          </div>
        </TipCard>

        <TipCard icon="📂" title="Account Record Type is about cohort, not ownership" accent="#3d7a56">
          Record Type is how Salesforce distinguishes the VCF cohorts:
          <ul style={{ margin: "8px 0 0 18px", padding: 0, fontSize: 14, lineHeight: 1.7 }}>
            <li><strong>VCF Victim</strong> — a living claimant</li>
            <li><strong>VCF Estate</strong> — a claim filed on behalf of a deceased victim</li>
            <li><strong>VCF Courtesy</strong> — exploratory / unretained contacts</li>
          </ul>
          <div style={{ marginTop: 8, fontSize: 13, color: T.tm }}>
            Filter by Record Type when the question is <em>which cohort?</em> (Exercise 3 scoped to VCF Estate). Don't filter by it when the question is just <em>whose accounts?</em> — that's Show Me.
          </div>
        </TipCard>

        <TipCard icon="🔁" title="Search before you build — clone a good report" accent="#6b4fa0">
          Chances are someone has already built a report that answers most of your question. Before you start from scratch, <strong>search the Reports tab</strong> and see what's there — especially reports authored by <strong>assistant managers</strong> (our supervisors) or <strong>senior CAs</strong>, who tend to have the reporting chops.
          <div style={{ marginTop: 8, fontSize: 13, color: T.tm }}>
            Open the closest match → <strong>Save As</strong> → tweak the filters. You'll get to the answer faster, and you inherit the right report type and column choices someone already thought through.
          </div>
        </TipCard>

        <div style={{
          background: "#fdf8e8", border: `1px solid ${T.accent}`, borderRadius: 10,
          padding: "14px 18px", fontSize: 13, color: T.text, lineHeight: 1.6, marginTop: 18, marginBottom: 20,
        }}>
          <strong>Going further.</strong> Advanced reporting — cross-filters, row-level formulas, joined reports, and dashboard building — is coming in a follow-up module. This covers the day-to-day 80%.
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={onNext}
            style={{
              padding: "12px 24px", background: T.sb, color: "#fff", border: "none",
              borderRadius: 8, fontSize: 14, fontFamily: T.d, fontWeight: 700, cursor: "pointer",
            }}
          >
            Complete Module →
          </button>
        </div>
      </div>
    </div>
  );
}
