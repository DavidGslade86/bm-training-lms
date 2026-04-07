import { useState, useRef, useEffect } from "react";
import { B } from "../data/brand";
import { FINAL_ASSESSMENT } from "../data/finalAssessmentData";
import { KEYS } from "../hooks/useLocalStorage";
import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";

const PA_URL = import.meta.env.VITE_POWERAUTOMATE_URL;
const OPT_LETTERS = ["A", "B", "C", "D"];

export default function FinalAssessment({ learner, onBack }) {
  const assessKey = KEYS.assessment(learner?.email || "anonymous");
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(assessKey)); }
    catch { return null; }
  })();

  const [answers, setAnswers]       = useState(stored?.answers   || {});
  const [submitted, setSubmitted]   = useState(stored?.submitted || false);
  const [startedAt]                 = useState(stored?.startedAt || Date.now());
  const [completedAt, setCompletedAt] = useState(stored?.completedAt || null);
  const [copied, setCopied]         = useState(false);
  const [submitState, setSubmitState] = useState(stored?.submitState || "idle"); // idle | submitting | success | error
  const [submittedAt, setSubmittedAt] = useState(stored?.submittedAt || null);
  const topRef = useRef(null);

  // Persist answers + submitted state + timing + submission state
  useEffect(() => {
    try {
      localStorage.setItem(assessKey, JSON.stringify({
        answers, submitted, startedAt, completedAt, submitState, submittedAt,
      }));
    } catch { /* storage full — silently fail */ }
  }, [answers, submitted, startedAt, completedAt, submitState, submittedAt, assessKey]);

  const questions = FINAL_ASSESSMENT.questions;
  const sections  = FINAL_ASSESSMENT.sections;
  const total     = questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered   = answeredCount >= total;

  // ── Score calculation ──
  const score = questions.reduce(
    (sum, q, qi) => sum + (answers[qi] === q.correctIndex ? 1 : 0), 0
  );
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const sectionScores = sections.map((sec) => {
    const [start, end] = sec.range;
    let correct = 0, count = 0;
    for (let i = start; i <= end; i++) {
      count++;
      if (answers[i] === questions[i].correctIndex) correct++;
    }
    return { label: sec.label, correct, total: count };
  });

  // ── Timing ──
  const elapsedSec = completedAt
    ? Math.round((completedAt - startedAt) / 1000)
    : Math.round((Date.now() - startedAt) / 1000);
  const elapsedStr = elapsedSec < 60
    ? `${elapsedSec}s`
    : `${Math.floor(elapsedSec/60)}m ${elapsedSec%60}s`;

  // ── Per-question detail for export ──
  const questionDetails = questions.map((q, qi) => {
    const selected   = answers[qi];
    const isCorrect  = selected === q.correctIndex;
    return {
      q: `Q${qi+1}`,
      section: q.section || "",
      text: q.question,
      selected: selected !== undefined ? OPT_LETTERS[selected] : "—",
      correct: OPT_LETTERS[q.correctIndex],
      isCorrect,
    };
  });

  // ── Completion payload (LMS-ready) ──
  const completedAtDate = completedAt ? new Date(completedAt) : new Date();
  const payload = {
    userId:           learner?.email || "",
    displayName:      learner?.name  || "",
    role:             learner?.role  || "",
    moduleId:         "final-assessment",
    moduleTitle:      "Final Assessment — B&M Training Pathway",
    completedAt:      completedAtDate.toISOString(),
    timeOnTaskSec:    elapsedSec || 0,
    assessScore:      score,
    assessTotal:      total,
    assessPercentage: pct,
    sectionBreakdown: sectionScores
      .map(s => `${s.label}:${s.correct}/${s.total}`).join("|"),
    questionDetails:  questionDetails
      .map(r => `${r.q}:${r.selected}${r.isCorrect ? "✓" : "✗"}(${r.correct})`).join("|"),
  };

  // ── CSV export ──
  const downloadCSV = () => {
    const headers = Object.keys(payload);
    const values  = headers.map(k => {
      const v = String(payload[k]);
      return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g,'""')}"` : v;
    });
    const csv = [headers.join(","), values.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (learner?.name || "learner").replace(/\s+/g,"-").toLowerCase();
    a.href = url; a.download = `bm-final-assessment-${safeName}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Plain-text summary ──
  const summary = `BARASCH & McGARRY — FINAL ASSESSMENT REPORT
${"=".repeat(50)}
Learner:    ${payload.displayName} (${payload.userId})
Role:       ${payload.role}
Completed:  ${completedAtDate.toLocaleString()}
Time:       ${elapsedStr}

OVERALL SCORE
${"─".repeat(30)}
${score} / ${total} correct  (${pct}%)

SECTION BREAKDOWN
${"─".repeat(30)}
${sectionScores.map(s => `${s.label.padEnd(28," ")} ${s.correct}/${s.total}`).join("\n")}

QUESTION DETAIL
${"─".repeat(30)}
${questionDetails.map(r =>
  `${r.q} ${r.isCorrect ? "✓" : "✗"}  selected ${r.selected} · correct ${r.correct}`
).join("\n")}

Generated: ${completedAtDate.toISOString()}`;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(summary).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = summary; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    });
  };

  const openEmail = () => {
    const subject = encodeURIComponent(`Final Assessment — ${payload.displayName} — ${score}/${total}`);
    const body    = encodeURIComponent(summary);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // ── Power Automate submission ──
  const canSubmit = PA_URL && PA_URL.trim().length > 0;

  const submitToPA = async () => {
    if (!canSubmit || submitState === "submitting") return;
    setSubmitState("submitting");
    if (import.meta.env.DEV) console.log("Final Assessment payload:", payload);
    try {
      const res = await fetch(PA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 200 || res.status === 202) {
        setSubmitState("success");
        setSubmittedAt(new Date().toLocaleString());
      } else {
        setSubmitState("error");
      }
    } catch {
      setSubmitState("error");
    }
  };

  // ── Handlers ──
  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    setCompletedAt(Date.now());
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-brand-cream" ref={topRef}>

      {/* ── Header ── */}
      <div className="bg-brand-hdr shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <div className="max-w-[720px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button onClick={onBack} className="bg-white rounded px-2 py-1 inline-flex items-center border-none cursor-pointer">
              <img src={bmLogo} alt="B&M" className="h-8" />
            </button>
            <div className="w-px h-5 bg-white/15" />
            <span className="text-sm font-bold text-white font-heading">Final Assessment</span>
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer border-none"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            ← Return Home
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[720px] mx-auto px-8 py-10">

        {/* Title */}
        <div className="mb-2 text-2xl font-bold text-brand-gray-dk font-heading">
          {FINAL_ASSESSMENT.title}
        </div>
        <div className="text-sm mb-1 text-brand-tl">{FINAL_ASSESSMENT.subtitle}</div>
        {!submitted && (
          <div className="text-sm mb-8 text-brand-tm leading-relaxed">
            {FINAL_ASSESSMENT.description}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────── */}
        {/*  POST-SUBMIT: Hero + Breakdown + Save Results panel    */}
        {/* ─────────────────────────────────────────────────────── */}
        {submitted && (
          <div className="mb-8 mt-4">

            {/* Hero card */}
            <div className="rounded-lg p-10 text-center text-white mb-6 bg-brand-hdr">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ background: pct >= 80 ? B.ok : pct >= 60 ? "#f59e0b" : B.err }}
              >
                {pct >= 80 ? "✓" : pct >= 60 ? "!" : "✗"}
              </div>
              <div className="text-2xl font-bold mb-1 text-brand-blue font-heading">Final Assessment Complete</div>
              <p className="text-sm mb-1 text-white/55">
                {learner?.name && <span className="text-white/80 font-semibold">{learner.name} · </span>}
                B&amp;M Training Pathway
              </p>
              <p className="text-xs mb-6 text-white/35">
                Completed {completedAtDate.toLocaleString()} · {elapsedStr} on assessment
              </p>
              <div className="inline-block rounded-lg px-10 py-5 bg-white/[0.07]">
                <div className="text-5xl font-bold mb-1 text-brand-blue font-heading">{score}/{total}</div>
                <div className="text-xs text-white/40">{pct}% correct</div>
              </div>
              <div
                className="text-sm font-semibold mt-5"
                style={{ color: pct >= 80 ? "#a8e6c9" : pct >= 60 ? "#fde68a" : "#fca5a5" }}
              >
                {pct >= 80
                  ? "Excellent work! You have a strong grasp of the material."
                  : pct >= 60
                  ? "Good effort. Review the sections below to strengthen your understanding."
                  : "Additional review is recommended. Focus on the sections highlighted below."}
              </div>
            </div>

            {/* Section breakdown */}
            <div className="rounded-lg p-6 mb-4 bg-brand-ww border border-brand-sand">
              <div className="text-xs font-bold tracking-widest mb-4 text-brand-tl">SECTION BREAKDOWN</div>
              <div className="grid grid-cols-2 gap-3">
                {sectionScores.map((sec, i) => {
                  const secPct = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;
                  const color  = secPct >= 80 ? B.ok : secPct >= 60 ? "#d97706" : B.err;
                  return (
                    <div key={i} className="rounded p-3 bg-brand-cream border border-brand-sand">
                      <div className="text-xs mb-1 text-brand-tl">{sec.label}</div>
                      <div className="text-xl font-bold font-heading" style={{ color }}>
                        {sec.correct}/{sec.total}
                      </div>
                      <div className="text-xs mt-0.5 text-brand-tl">{secPct}% correct</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── SAVE YOUR RESULTS panel ── */}
            <div className="rounded-lg p-6 mb-6 bg-brand-ww border border-brand-sand">
              <div className="text-xs font-bold tracking-widest mb-1 text-brand-tl">SAVE YOUR RESULTS</div>
              <p className="text-xs mb-4 text-brand-tl">
                Your completion data needs to be submitted so your progress can be recorded.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-[7px] px-4 py-[9px] bg-brand-blue text-white border-none rounded-md cursor-pointer text-xs font-bold"
                >
                  ⬇ Download CSV
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-[7px] px-4 py-[9px] rounded-md cursor-pointer text-xs font-semibold transition-all duration-200"
                  style={{
                    background: copied ? B.ok : "white",
                    color:      copied ? "white" : B.gray,
                    border:    `1.5px solid ${copied ? B.ok : B.sand}`,
                  }}
                >
                  {copied ? "✓ Copied!" : "📋 Copy Summary"}
                </button>
                <button
                  onClick={openEmail}
                  className="flex items-center gap-[7px] px-4 py-[9px] bg-white text-brand-gray border-[1.5px] border-brand-sand rounded-md cursor-pointer text-xs font-semibold"
                >
                  ✉ Open Email Draft
                </button>
                {canSubmit && submitState === "success" && (
                  <span className="flex items-center gap-[7px] px-4 py-[9px] text-xs font-semibold text-brand-ok">
                    ✓ Submitted to training record{submittedAt && ` · ${submittedAt}`}
                  </span>
                )}
                {canSubmit && submitState !== "success" && (
                  <button
                    onClick={submitToPA}
                    disabled={submitState === "submitting"}
                    className="flex items-center gap-[7px] px-4 py-[9px] rounded-md text-xs font-bold border-none cursor-pointer bg-brand-ok text-white disabled:opacity-60 disabled:cursor-wait"
                  >
                    {submitState === "submitting" ? "Submitting…" : "📤 Submit to Training Record"}
                  </button>
                )}
              </div>
              {submitState === "error" && (
                <p className="text-xs mt-2 font-semibold text-brand-err">
                  Submission failed — please use Download CSV as a backup
                </p>
              )}
              <p className="text-xs mt-3 text-brand-tl">
                <strong>CSV</strong> — one-row spreadsheet-ready file ·{" "}
                <strong>Copy</strong> — formatted text for email ·{" "}
                <strong>Email</strong> — opens your mail client with subject + body pre-filled
              </p>
            </div>

            <div className="text-xs text-brand-tl mb-2">
              Scroll down to review each question. Correct answers are highlighted in green;
              incorrect selections are highlighted in red.
            </div>
          </div>
        )}

        {/* ── Questions grouped by section ── */}
        {sections.map((sec, si) => {
          const [start, end] = sec.range;
          return (
            <div key={si}>
              {/* Section divider */}
              <div
                className="mb-4 mt-8"
                style={{ borderLeft: `3px solid ${B.blue}`, paddingLeft: 12 }}
              >
                <div className="text-sm font-bold text-brand-gray-dk font-heading">
                  {sec.label}
                </div>
              </div>

              {/* Questions in this section */}
              {questions.slice(start, end + 1).map((q, offset) => {
                const qi = start + offset;          // global question index
                const selected  = answers[qi];
                const isCorrect = submitted && selected === q.correctIndex;
                const isWrong   = submitted && selected !== undefined && selected !== q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="rounded-lg p-5 mb-3 transition-colors duration-200"
                    style={{
                      background: submitted ? (isCorrect ? B.okBg : isWrong ? B.errBg : B.ww) : B.ww,
                      border: `1px solid ${submitted ? (isCorrect ? "#b8d5c4" : isWrong ? "#e8b4b4" : B.sand) : B.sand}`,
                    }}
                  >
                    {/* Question header */}
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="text-xs font-bold tracking-widest"
                        style={{ color: submitted ? (isCorrect ? B.ok : isWrong ? B.err : B.blue) : B.blue }}
                      >
                        Q{qi + 1} / {total}
                      </div>
                      {submitted && isCorrect && (
                        <div className="text-xs font-bold text-brand-ok">✓ Correct</div>
                      )}
                      {submitted && isWrong && (
                        <div className="text-xs font-bold" style={{ color: B.err }}>✗ Incorrect</div>
                      )}
                    </div>

                    {/* Question text */}
                    <div className="text-sm font-bold mb-3 text-brand-gray-dk font-heading">
                      {q.question}
                    </div>

                    {/* Options */}
                    <div className="flex flex-col gap-2">
                      {q.options.map((o, oi) => {
                        const isSel   = selected === oi;
                        const isRight = q.correctIndex === oi;

                        // Option box style
                        let st = { border: `1.5px solid ${B.sand}`, background: "white", color: B.tm };
                        if (!submitted) {
                          if (isSel) st = { border: `1.5px solid ${B.blue}`, background: B.blueLt, color: B.blueDk };
                        } else {
                          if (isRight)            st = { border: `1.5px solid ${B.ok}`,  background: B.okBg,    color: "#2d5a3f" };
                          else if (isSel)         st = { border: `1.5px solid ${B.err}`, background: B.errBg,   color: "#9a3030" };
                          else                    st = { border: `1.5px solid ${B.sand}`, background: "#f7f5f0", color: "#aaa" };
                        }

                        // Circle indicator
                        const cBd = submitted && isRight ? B.ok
                          : submitted && isSel ? B.err
                          : isSel ? B.blue : "#ddd";
                        const cBg = submitted && isRight ? B.ok
                          : submitted && isSel ? B.err
                          : isSel ? B.blue : "transparent";
                        const cCl = (submitted && isRight) || (submitted && isSel) || isSel ? "white" : "#999";

                        return (
                          <div
                            key={oi}
                            onClick={() => handleSelect(qi, oi)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-100"
                            style={{ ...st, cursor: submitted ? "default" : "pointer" }}
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ border: `1.5px solid ${cBd}`, background: cBg, color: cCl }}
                            >
                              {OPT_LETTERS[oi]}
                            </div>
                            <span>{o}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Feedback (post-submit) */}
                    {submitted && q.feedback && (
                      <div
                        className="mt-3 p-3 rounded-md text-xs leading-relaxed"
                        style={{
                          background: isCorrect ? "rgba(74,140,111,0.08)" : "rgba(181,74,74,0.08)",
                          color: isCorrect ? "#2d5a3f" : "#6b3030",
                          border: `1px solid ${isCorrect ? "rgba(74,140,111,0.2)" : "rgba(181,74,74,0.2)"}`,
                        }}
                      >
                        {q.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ── Progress bar + Submit ── */}
        {!submitted && (
          <div className="mt-8 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-brand-tl">
                {answeredCount} of {total} answered
              </span>
              {!allAnswered && (
                <span className="text-xs text-brand-tl">
                  {total - answeredCount} remaining
                </span>
              )}
            </div>
            <div className="w-full h-2 rounded-full mb-5" style={{ background: B.sand }}>
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(answeredCount / total) * 100}%`,
                  background: allAnswered ? B.ok : B.blue,
                }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full py-3 rounded-lg text-sm font-bold border-none transition-all"
              style={{
                background: allAnswered ? B.blue : B.sand,
                color: allAnswered ? "white" : B.tl,
                cursor: allAnswered ? "pointer" : "default",
              }}
            >
              {allAnswered ? "Submit Assessment" : `Answer all ${total} questions to submit`}
            </button>
          </div>
        )}

        {/* Back to Home (post-submit) */}
        {submitted && (
          <div className="mt-8 mb-4 flex flex-col items-center gap-3">
            <button
              onClick={onBack}
              className="px-8 py-3 rounded-lg text-sm font-bold text-white border-none cursor-pointer"
              style={{ background: B.blue }}
            >
              ← Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
