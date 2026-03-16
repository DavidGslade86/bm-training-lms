import { useState, useContext } from "react";
import { B } from "../data/brand";
import { DATA } from "../data/cards";
import { Ctx } from "../state";
import { P } from "./Shared";

export default function CompletionCard() {
  const {s, learner, moduleStartedAt} = useContext(Ctx);
  const [copied, setCopied] = useState(false);
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success | error
  const [submittedAt, setSubmittedAt] = useState(null);
  const tot = DATA.cards.find(c=>c.type==="assessment")?.data.questions.length || 5;

  // ── Derived metrics ──────────────────────────────────────────────
  const completedAt = new Date();
  const elapsedSec  = moduleStartedAt ? Math.round((Date.now() - moduleStartedAt) / 1000) : null;
  const elapsedStr  = elapsedSec
    ? elapsedSec < 60 ? `${elapsedSec}s`
      : `${Math.floor(elapsedSec/60)}m ${elapsedSec%60}s`
    : "—";

  const quizErrCount  = s.errorLog.length;
  const matchErrCount = Object.values(s.matchErrors).reduce((n,arr)=>n+arr.length, 0);
  const scenErrCount  = Object.values(s.scenErrors).reduce((n,steps)=>
    n + Object.values(steps).reduce((a,b)=>a+b, 0), 0);

  const assessDetails = DATA.cards.find(c=>c.type==="assessment")?.data.questions.map((q,qi)=>({
    q: `Q${qi+1}`, text: q.question,
    attempts: s.assessTries[qi] || (s.assessAns[qi]!==undefined ? 1 : 0),
    correct: s.assessAns[qi] !== undefined,
  })) || [];

  // ── Completion payload ───────────────────────────────────────────
  const payload = {
    userId:        learner?.email || "",
    displayName:   learner?.name  || "",
    role:          learner?.role  || "",
    moduleId:      "module-2-foundational-concepts",
    moduleTitle:   "Module 2: Foundational Concepts",
    completedAt:   completedAt.toISOString(),
    timeOnTaskSec: elapsedSec || 0,
    assessScore:   s.assessScore,
    assessTotal:   tot,
    assessFirstPct:Math.round((s.assessScore / tot) * 100),
    assessDetails: assessDetails.map(r=>`${r.q}:${r.attempts}att`).join("|"),
    quizReviews:   quizErrCount,
    matchErrors:   matchErrCount,
    scenarioErrors:scenErrCount,
  };

  // ── CSV export ───────────────────────────────────────────────────
  const downloadCSV = () => {
    const headers = Object.keys(payload);
    const values  = headers.map(k => {
      const v = String(payload[k]);
      return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g,'""')}"` : v;
    });
    const csv = [headers.join(","), values.join(",")].join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `bm-training-${learner?.name?.replace(/\s+/g,"-").toLowerCase()}-module2.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Plain-text summary ───────────────────────────────────────────
  const summary = `BARASCH & McGARRY — TRAINING COMPLETION REPORT
${"=".repeat(50)}
Module:     ${payload.moduleTitle}
Learner:    ${payload.displayName} (${payload.userId})
Role:       ${payload.role}
Completed:  ${completedAt.toLocaleString()}
Time:       ${elapsedStr}
PERFORMANCE SUMMARY
${"─".repeat(30)}
Final Assessment:       ${s.assessScore}/${tot} (${payload.assessFirstPct}% first-attempt)
Assessment detail:      ${assessDetails.map(r=>`${r.q} — ${r.attempts} attempt${r.attempts!==1?"s":""}`).join(", ")}
Knowledge check reviews: ${quizErrCount}
Matching errors:        ${matchErrCount}
Scenario errors:        ${scenErrCount}
Generated: ${completedAt.toISOString()}`;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(summary).then(() => {
      setCopied(true); setTimeout(()=>setCopied(false), 2500);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = summary; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true); setTimeout(()=>setCopied(false), 2500);
    });
  };

  const openEmail = () => {
    const subject = encodeURIComponent(`Training Completion — ${payload.displayName} — ${payload.moduleTitle}`);
    const body    = encodeURIComponent(summary);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // ── Power Automate submission ──────────────────────────────────────
  const paUrl = import.meta.env.VITE_POWERAUTOMATE_URL;
  const canSubmit = paUrl && paUrl.trim().length > 0;

  const submitToPA = async () => {
    if (!canSubmit || submitState === "submitting") return;
    setSubmitState("submitting");
    if (import.meta.env.DEV) console.log("Power Automate payload:", payload);
    try {
      const res = await fetch(paUrl, {
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

  return (
    <div>
      {/* Hero */}
      <div className="rounded-lg p-10 text-center text-white mb-6 bg-brand-hdr">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 bg-brand-ok">✓</div>
        <div className="text-2xl font-bold mb-1 text-brand-blue font-heading">Module Complete</div>
        <p className="text-sm mb-1 text-white/55">
          {learner?.name && <span className="text-white/80 font-semibold">{learner.name} · </span>}
          Module 2: Foundational Concepts
        </p>
        <p className="text-xs mb-6 text-white/35">
          Completed {completedAt.toLocaleString()} · {elapsedStr} on module
        </p>
        <div className="inline-block rounded-lg px-10 py-5 bg-white/[0.07]">
          <div className="text-5xl font-bold mb-1 text-brand-blue font-heading">{s.assessScore}/{tot}</div>
          <div className="text-xs text-white/40">First-attempt correct answers</div>
        </div>
      </div>

      {/* Performance breakdown */}
      <div className="rounded-lg p-6 mb-4 bg-brand-ww border border-brand-sand">
        <div className="text-xs font-bold tracking-widest mb-4 text-brand-tl">PERFORMANCE BREAKDOWN</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            {label:"Assessment score",       val:`${s.assessScore}/${tot}`, sub:`${payload.assessFirstPct}% first-attempt`, color:s.assessScore===tot?B.ok:s.assessScore>=3?B.blue:B.err},
            {label:"Time on module",         val:elapsedStr, sub:"from start to completion", color:B.gray},
            {label:"Knowledge check reviews",val:quizErrCount, sub:quizErrCount===0?"all correct first try":"sections reviewed", color:quizErrCount===0?B.ok:B.err},
            {label:"Scenario errors",        val:scenErrCount, sub:scenErrCount===0?"all correct first try":"wrong picks", color:scenErrCount===0?B.ok:scenErrCount>3?B.err:B.gray},
            {label:"Matching errors",        val:matchErrCount, sub:matchErrCount===0?"all matched correctly":"incorrect attempts", color:matchErrCount===0?B.ok:matchErrCount>3?B.err:B.gray},
          ].map(({label,val,sub,color},i)=>(
            <div key={i} className="rounded p-3 bg-brand-cream border border-brand-sand">
              <div className="text-xs mb-1 text-brand-tl">{label}</div>
              <div className="text-xl font-bold font-heading" style={{color}} /* dynamic: performance-conditional color */>{val}</div>
              <div className="text-xs mt-0.5 text-brand-tl">{sub}</div>
            </div>
          ))}
        </div>

        {/* Per-question breakdown */}
        <div className="mt-4 pt-4 border-t border-brand-sand">
          <div className="text-xs font-bold tracking-widest mb-3 text-brand-tl">ASSESSMENT QUESTION DETAIL</div>
          <div className="flex flex-col gap-1.5">
            {assessDetails.map(({q,text,attempts,correct})=>(
              <div key={q} className="flex items-start gap-3 text-xs text-brand-tm">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold mt-0.5 text-white text-[9px]"
                  style={{background:correct?B.ok:B.err}} /* dynamic: correct/incorrect indicator */>
                  {correct?"✓":"✗"}
                </div>
                <div className="flex-1">
                  <span className="font-semibold">{q}</span> — {text.length>70?text.slice(0,70)+"…":text}
                </div>
                <div className="shrink-0" style={{color:attempts>1?B.err:B.tl}} /* dynamic: attempt-count color */>{attempts} att.</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export panel */}
      <div className="rounded-lg p-6 mb-6 bg-brand-ww border border-brand-sand">
        <div className="text-xs font-bold tracking-widest mb-1 text-brand-tl">SAVE YOUR RESULTS</div>
        <p className="text-xs mb-4 text-brand-tl">Your completion data needs to be submitted so your progress can be recorded.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={downloadCSV} className="flex items-center gap-[7px] px-4 py-[9px] bg-brand-blue text-white border-none rounded-md cursor-pointer text-xs font-bold">⬇ Download CSV</button>
          <button onClick={copyToClipboard}
            className="flex items-center gap-[7px] px-4 py-[9px] rounded-md cursor-pointer text-xs font-semibold transition-all duration-200"
            style={{background:copied?B.ok:"white",color:copied?"white":B.gray,border:`1.5px solid ${copied?B.ok:B.sand}`}} /* dynamic: copied-state styling */>
            {copied ? "✓ Copied!" : "📋 Copy Summary"}
          </button>
          <button onClick={openEmail} className="flex items-center gap-[7px] px-4 py-[9px] bg-white text-brand-gray border-[1.5px] border-brand-sand rounded-md cursor-pointer text-xs font-semibold">✉ Open Email Draft</button>
          {canSubmit && submitState === "success" && (
            <span className="flex items-center gap-[7px] px-4 py-[9px] text-xs font-semibold text-brand-ok">✓ Submitted to training record{submittedAt && ` · ${submittedAt}`}</span>
          )}
          {canSubmit && submitState !== "success" && (
            <button onClick={submitToPA} disabled={submitState==="submitting"}
              className="flex items-center gap-[7px] px-4 py-[9px] rounded-md text-xs font-bold border-none cursor-pointer bg-brand-ok text-white disabled:opacity-60 disabled:cursor-wait">
              {submitState === "submitting" ? "Submitting…" : "📤 Submit to Training Record"}
            </button>
          )}
        </div>
        {submitState === "error" && (
          <p className="text-xs mt-2 font-semibold text-brand-err">Submission failed — please use Download CSV as a backup</p>
        )}
        <p className="text-xs mt-3 text-brand-tl">
          <strong>CSV</strong> — one-row spreadsheet-ready file · <strong>Copy</strong> — formatted text for email · <strong>Email</strong> — opens your mail client with subject + body pre-filled
        </p>
      </div>

      {/* Next module tease */}
      <div className="rounded-lg p-5 flex items-start gap-4 bg-brand-hdr">
        {/* TODO: drop Yajaira_Torso_sm.png into src/assets/ and replace with <img> */}
        <P l="Y" c={B.blue} sz="sm"/>
        <p className="text-sm text-white/55">And Yajaira? We're going to help her. That's the next module.</p>
      </div>
    </div>
  );
}
