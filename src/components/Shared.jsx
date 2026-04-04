import { useContext, useState, useEffect } from "react";
import { B } from "../data/brand";
import { Ctx } from "../state";
import { GT } from "./Glossary";
import mapImg from "../assets/911-map-alt.jpg";
import yajairaImg from "../assets/Yajaira_Torso.png";

// ─── Md: simple **bold** renderer (no glossary) ──────
export function Md({ t }) {
  if (!t) return null;
  return <>{t.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**")
      ? <strong key={i} className="text-gray-800">{p.slice(2,-2)}</strong>
      : <span key={i}>{p}</span>
  )}</>;
}

// ─── ET: editable text (edit mode only) ──────────────
// Wraps any text field with click-to-edit in edit mode.
// In normal/review mode renders children (or raw value) unchanged.
// Usage: <ET cardId={id} path="data.title" value={data.title}>{data.title}</ET>
//   or:  <ET cardId={id} path="data.blocks.0.text" value={b.text} multiline><GT t={b.text}/></ET>
export function ET({ cardId, path, value, children, multiline = false, className = "" }) {
  const ctx = useContext(Ctx);
  const editMode = ctx?.editMode;
  const updateCard = ctx?.updateCard;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  // Keep draft in sync when value changes externally (after another field saves)
  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);

  // In non-edit mode render children (or value) completely transparently
  if (!editMode) return children ?? value ?? null;

  const save = () => {
    if (String(draft) !== String(value) && updateCard) {
      updateCard(cardId, path, draft);
    }
    setEditing(false);
  };

  if (editing) {
    const cls = "border-2 border-amber-400 rounded px-2 py-1 bg-amber-50 focus:outline-none w-full text-sm";
    return multiline
      ? <textarea
          className={cls}
          value={draft}
          rows={3}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          autoFocus
        />
      : <input
          className={`${cls} block`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setEditing(false); setDraft(value); } }}
          autoFocus
        />;
  }

  return (
    <span
      className={`cursor-text rounded transition-all hover:outline hover:outline-2 hover:outline-amber-400/60 hover:outline-offset-1 hover:bg-amber-50/30 ${className}`}
      title="Click to edit"
      onClick={() => { setDraft(value); setEditing(true); }}
    >
      {children ?? value}
    </span>
  );
}

// ─── P: avatar circle ────────────────────────────────
export function P({ l, c, sz="lg" }) {
  return (
    <div
      className={`${sz==="lg" ? "w-14 h-14 text-xl" : "w-9 h-9 text-sm"} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{background:c}} /* dynamic: color from prop */>
      {l}
    </div>
  );
}

// ─── Nav: prev / continue buttons ────────────────────
export function Nav({ ok }) {
  const {s, d, cards, reviewMode} = useContext(Ctx);
  const i = s.cur, tot = cards.length;
  const canContinue = ok || !!reviewMode;
  return (
    <div className="flex justify-between items-center mt-10 pt-5 border-t border-brand-sand">
      {i > 0
        ? <button onClick={()=>d({t:"GO",i:i-1})} className="px-5 py-2.5 rounded text-sm font-semibold border-[1.5px] border-brand-sand text-brand-gray">← Previous</button>
        : <div/>
      }
      {i < tot-1
        ? <button onClick={()=>{d({t:"DONE",i,total:tot});d({t:"GO",i:i+1})}} disabled={!canContinue} className="px-5 py-2.5 rounded text-sm font-semibold text-white" style={{background:canContinue?B.blue:"#ccc",cursor:canContinue?"pointer":"default"}} /* dynamic: depends on ok prop or reviewMode */>Continue →</button>
        : <div/>
      }
    </div>
  );
}

// ─── FormImageViewer: paginated form preview ─────────
function FormImageViewer({ images, alt }) {
  const [page, setPage] = useState(0);
  if (!images || images.length === 0) return null;
  const total = images.length;
  return (
    <div className="mt-3 pt-3 border-t border-brand-sand">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] font-bold tracking-widest text-brand-tl">FORM PREVIEW</div>
        {total > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold disabled:opacity-25"
              style={{background:"#e8f4fb", color:"#009bdf"}}>‹</button>
            <span className="text-[11px] text-brand-tl tabular-nums">{page + 1} / {total}</span>
            <button
              onClick={() => setPage(p => Math.min(total - 1, p + 1))}
              disabled={page === total - 1}
              className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold disabled:opacity-25"
              style={{background:"#e8f4fb", color:"#009bdf"}}>›</button>
          </div>
        )}
      </div>
      <img src={images[page]} alt={`${alt} — page ${page + 1}`} className="w-full rounded border border-brand-sand"/>
    </div>
  );
}

// ─── Blocks: renders typed content blocks ────────────
// cardId is optional; when provided and editMode is active, paragraph/subheading/callout blocks become editable.
export function Blocks({ blocks, cardId }) {
  const ctx = useContext(Ctx);
  const editMode = ctx?.editMode;

  return blocks.map((b, i) => {
    if (b.type === "paragraph") {
      // Use div in edit mode to avoid textarea-inside-p invalid HTML
      const Tag = editMode ? "div" : "p";
      return (
        <Tag key={i} className="text-sm leading-relaxed mb-4 text-brand-tm">
          {editMode && cardId
            ? <ET cardId={cardId} path={`data.blocks.${i}.text`} value={b.text} multiline><GT t={b.text}/></ET>
            : <GT t={b.text}/>}
        </Tag>
      );
    }

    if (b.type === "subheading")
      return (
        <h3 key={i} className="text-lg font-bold mt-8 mb-3 text-brand-gray-dk font-heading">
          {editMode && cardId
            ? <ET cardId={cardId} path={`data.blocks.${i}.text`} value={b.text}><GT t={b.text}/></ET>
            : <GT t={b.text}/>}
        </h3>
      );

    if (b.type === "callout")
      return (
        <div key={i} className="rounded-lg p-4 my-5 flex gap-3" style={{background:b.style==="warn"?"#fef6e8":B.blueLt,border:`1px solid ${b.style==="warn"?"#e8d5a0":"#b3dcf2"}`}} /* dynamic: callout style variant */>
          {editMode && cardId
            ? <ET cardId={cardId} path={`data.blocks.${i}.icon`} value={b.icon} className="text-lg shrink-0">{b.icon}</ET>
            : <span className="text-lg shrink-0">{b.icon}</span>}
          <div className="flex-1">
            <div className="text-sm leading-relaxed text-brand-tm">
              {editMode && cardId
                ? <ET cardId={cardId} path={`data.blocks.${i}.text`} value={b.text} multiline><GT t={b.text}/></ET>
                : <GT t={b.text}/>}
            </div>
            {editMode && cardId && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-amber-700">Style:</span>
                <select
                  value={b.style || "info"}
                  onChange={(e) => ctx?.updateCard?.(cardId, `data.blocks.${i}.style`, e.target.value)}
                  className="text-[10px] border border-amber-400 rounded px-1 py-0.5 bg-amber-50 cursor-pointer focus:outline-none"
                >
                  <option value="info">Blue (info)</option>
                  <option value="warn">Amber (warn)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      );

    if (b.type === "yajaira-check")
      return (
        <div key={i} className="rounded-lg p-4 my-5 flex gap-3 items-start bg-brand-ww border border-brand-sand">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
            <img src={yajairaImg} alt="Yajaira" className="w-full h-full object-cover"/>
          </div>
          <p className="text-sm leading-relaxed text-brand-tm"><GT t={b.text}/></p>
        </div>
      );

    if (b.type === "program-cards")
      return (
        <div key={i} className="grid grid-cols-2 gap-4 my-5">
          {b.cards.map((c, ci) => (
            <div key={ci} className="rounded-lg p-5 bg-brand-ww border border-brand-sand">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{background:c.iconBg}} /* dynamic: color from card data */>{c.icon}</div>
                <div className="font-bold text-sm text-brand-gray-dk font-heading"><GT t={c.title}/></div>
              </div>
              <div className="text-xs mb-3 text-brand-tl"><GT t={c.agency}/></div>
              {c.bullets.map((bl, bi) => (
                <div key={bi} className="flex gap-2 text-sm mb-1 text-brand-tm">
                  <span style={{color:c.accent}} /* dynamic: accent color from card data */>•</span><span><GT t={bl}/></span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    if (b.type === "comparison-table")
      return (
        <div key={i} className="my-5 rounded-lg overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>{b.headers.map((h, hi) => <th key={hi} className="text-left px-4 py-3 text-xs font-bold text-white bg-brand-gray-dk">{h}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 border-b border-brand-sand bg-brand-ww align-top text-[13px]" style={{color:ci===0?B.td:B.tm,fontWeight:ci===0?600:400}} /* dynamic: column-index styling */>
                      <GT t={cell}/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    if (b.type === "tier-cards")
      return (
        <div key={i} className="grid grid-cols-3 gap-4 my-5">
          {b.tiers.map((t, ti) => (
            <div key={ti} className="rounded-lg p-5" style={{background:t.bg,border:`1px solid ${t.border}`}} /* dynamic: tier-specific colors from data */>
              <div className="font-bold text-base mb-1 font-heading" style={{color:t.color}} /* dynamic: tier color */><GT t={t.name}/></div>
              <div className="text-xs font-bold tracking-wide mb-3 uppercase" style={{color:t.color,letterSpacing:1}} /* dynamic: tier color + custom tracking */>{t.label}</div>
              {t.items.map((item, ii) => (
                <div key={ii} className="flex gap-2 text-xs mb-1 text-brand-tm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{background:t.color}} /* dynamic: tier color *//>
                  <span><GT t={item}/></span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    if (b.type === "exposure-grid")
      return (
        <div key={i} className="grid grid-cols-2 gap-4 my-5">
          {b.groups.map((g, gi) => (
            <div key={gi} className="rounded-lg p-5 bg-brand-ww border border-brand-sand">
              <div className="font-bold text-sm mb-3 text-brand-gray-dk font-heading">{g.title}</div>
              {g.rows.map((r, ri) => (
                <div key={ri} className="flex justify-between py-1.5 text-xs border-b border-black/5">
                  <span className="text-brand-tm">{r.period}</span>
                  <span className="font-bold text-brand-gray-dk">{r.hours}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    if (b.type === "latency-list")
      return (
        <div key={i} className="my-4">
          {b.items.map((item, ii) => (
            <div key={ii} className="flex items-center gap-4 py-2.5 text-sm border-b border-black/[0.06]">
              <span className="font-bold min-w-24 text-brand-gray-dk">{item.time}</span>
              <span className="text-brand-tm"><GT t={item.desc}/></span>
            </div>
          ))}
        </div>
      );

    if (b.type === "doc-cards")
      return (
        <div key={i} className="space-y-4 my-5">
          {b.cards.map((c, ci) => (
            <div key={ci} className="rounded-lg border overflow-hidden" style={{borderColor:c.color+"33"}} /* dynamic: tinted border from card color */>
              <div className="flex items-center gap-3 px-5 py-3" style={{background:c.color+"0d"}} /* dynamic: tinted bg from card color */>
                <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-[10px]" style={{background:c.color}} /* dynamic: badge color */>{c.abbr.slice(0,3)}</div>
                <div className="font-bold text-sm text-brand-gray-dk font-heading">{c.abbr}</div>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm leading-relaxed mb-3 text-brand-tm"><GT t={c.desc}/></p>
                {c.notes && c.notes.map((n, ni) => (
                  <div key={ni} className="flex gap-2 text-xs mb-1.5 text-brand-tm">
                    <span className="mt-0.5 shrink-0" style={{color:c.color}} /* dynamic: bullet color */>•</span>
                    <span className="leading-relaxed"><GT t={n}/></span>
                  </div>
                ))}
                {(c.formImages || c.formImage) && (
                  <FormImageViewer images={c.formImages || [c.formImage]} alt={c.abbr}/>
                )}
              </div>
            </div>
          ))}
        </div>
      );

    if (b.type === "map-diagram")
      return (
        <div key={i} className="my-5 rounded-lg overflow-hidden border border-brand-sand bg-brand-ww">
          <img src={mapImg} alt="9/11 exposure zone map — VCF and WTCHP eligibility areas" className="w-full rounded-lg"/>
          <div className="px-4 py-3">
            <div className="text-[11px] font-bold text-brand-gray-dk mb-2">LOWER MANHATTAN EXPOSURE ZONES</div>
            <div className="flex gap-6 text-xs">
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-[#e6c65a]"/><span className="text-brand-tm">VCF Zone (south of Canal)</span></div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-[#7bbce6]"/><span className="text-brand-tm">WTCHP Survivor Zone (south of Houston, 1.5mi radius)</span></div>
            </div>
          </div>
        </div>
      );

    if (b.type === "multi-select-scenarios")
      return <MultiSelectScenarios key={i} block={b} />;

    if (b.type === "sufficiency-quiz")
      return <SufficiencyQuiz key={i} block={b} />;

    return null;
  });
}

// ── SufficiencyQuiz ──────────────────────────────────────────────────────────
// Binary Sufficient / Not Sufficient classifier per item.
// block.items = [{ label, sufficient (bool), feedback }]
function SufficiencyQuiz({ block }) {
  const { reviewMode } = useContext(Ctx);
  const [answers, setAnswers] = useState(
    () => block.items.map(() => ({ choice: null })) // choice: null | "s" | "ns"
  );

  const choose = (idx, choice) => {
    if (answers[idx].choice !== null || reviewMode) return;
    setAnswers(prev => prev.map((a, i) => i === idx ? { choice } : a));
  };

  return (
    <div className="my-5 space-y-3">
      {block.items.map((item, idx) => {
        const { choice } = answers[idx];
        const answered = choice !== null || reviewMode;
        const correctChoice = item.sufficient ? "s" : "ns";
        const isCorrect = choice === correctChoice;

        // Button style helper
        const btnStyle = (btn) => {
          // btn = "s" or "ns"
          const isSuf = btn === "s";
          const correctBtn = isSuf === item.sufficient; // is this button the right answer?
          if (!answered) {
            // default idle state
            return {
              background: isSuf ? "#f0faf4" : "#fdf2f2",
              border: `1.5px solid ${isSuf ? "#b3dcca" : "#f5c0c0"}`,
              color: isSuf ? "#2d7a55" : "#b54a4a",
              opacity: 1,
              cursor: "pointer",
            };
          }
          // answered (or reviewMode) — highlight correct, dim wrong
          if (correctBtn) {
            // always highlight the correct button after answer / in review
            return {
              background: isSuf ? "#d1fae5" : "#fee2e2",
              border: `1.5px solid ${isSuf ? B.ok : B.err}`,
              color: isSuf ? B.ok : B.err,
              fontWeight: 700,
              cursor: "default",
            };
          }
          // wrong button — dim it out
          if (choice === btn && !isCorrect) {
            // user chose THIS wrong button — show strikethrough dim
            return {
              background: isSuf ? "#f0faf4" : "#fdf2f2",
              border: `1.5px solid ${isSuf ? "#b3dcca" : "#f5c0c0"}`,
              color: isSuf ? "#2d7a5580" : "#b54a4a80",
              cursor: "default",
              textDecoration: "line-through",
            };
          }
          return {
            background: "transparent",
            border: "1.5px solid #e2d9cc",
            color: "#c0b8ae",
            cursor: "default",
          };
        };

        // Row border reflects result
        const rowBorder = !answered ? B.sand
          : isCorrect || reviewMode ? B.ok + "55" : B.err + "55";
        const rowBg = !answered ? B.ww
          : isCorrect || reviewMode ? "#f0fdf4" : "#fff5f5";

        return (
          <div
            key={idx}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: rowBorder, background: rowBg, transition: "border-color 0.2s" }}
          >
            <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* Label */}
              <div className="flex-1 text-sm leading-relaxed" style={{ color: B.td }}>
                {item.label}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => choose(idx, "s")}
                  className="px-3 py-1.5 rounded text-xs font-bold transition-all"
                  style={btnStyle("s")}
                >
                  ✓ Sufficient
                </button>
                <button
                  onClick={() => choose(idx, "ns")}
                  className="px-3 py-1.5 rounded text-xs font-bold transition-all"
                  style={btnStyle("ns")}
                >
                  ✗ Not Sufficient
                </button>
              </div>

              {/* Result badge */}
              {answered && !reviewMode && (
                <div
                  className="text-xs font-bold shrink-0 px-2 py-1 rounded"
                  style={{
                    background: isCorrect ? B.ok + "1a" : B.err + "1a",
                    color: isCorrect ? B.ok : B.err,
                    border: `1px solid ${isCorrect ? B.ok + "55" : B.err + "55"}`,
                  }}
                >
                  {isCorrect ? "Correct ✓" : "Incorrect ✗"}
                </div>
              )}
              {reviewMode && (
                <div
                  className="text-xs font-bold shrink-0 px-2 py-1 rounded"
                  style={{ background: B.ok + "1a", color: B.ok, border: `1px solid ${B.ok + "55"}` }}
                >
                  {item.sufficient ? "Sufficient" : "Not Sufficient"}
                </div>
              )}
            </div>

            {/* Feedback — shown after answering */}
            {(answered) && item.feedback && (
              <div
                className="px-4 py-2.5 text-xs leading-relaxed border-t"
                style={{
                  background: isCorrect || reviewMode ? "#f0fdf4" : "#fff5f5",
                  color: isCorrect || reviewMode ? "#2d7a55" : "#b54a4a",
                  borderColor: isCorrect || reviewMode ? B.ok + "33" : B.err + "33",
                }}
              >
                {item.feedback}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── MultiSelectScenarios ─────────────────────────────────────────────────────
function MultiSelectScenarios({ block }) {
  const { reviewMode } = useContext(Ctx);
  // Per-scenario state: selected indices + submitted flag
  const [states, setStates] = useState(
    () => block.scenarios.map(() => ({ selected: new Set(), submitted: false }))
  );

  const toggle = (si, oi) => {
    if (states[si].submitted) return;
    setStates(prev => {
      const next = prev.map((st, idx) => {
        if (idx !== si) return st;
        const sel = new Set(st.selected);
        sel.has(oi) ? sel.delete(oi) : sel.add(oi);
        return { ...st, selected: sel };
      });
      return next;
    });
  };

  const submit = (si) => {
    setStates(prev => prev.map((st, idx) =>
      idx === si ? { ...st, submitted: true } : st
    ));
  };

  return (
    <div className="my-5 space-y-5">
      {block.scenarios.map((sc, si) => {
        const { selected, submitted } = states[si];
        const correct = new Set(sc.correct);
        const isCorrect = (oi) => correct.has(oi);
        const wasSelected = (oi) => selected.has(oi);

        const allCorrect = submitted && [...correct].every(oi => selected.has(oi)) && [...selected].every(oi => correct.has(oi));

        return (
          <div
            key={sc.id}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: submitted ? (allCorrect ? B.ok : B.err) + "55" : B.sand }}
          >
            {/* Scenario prompt */}
            <div className="px-5 py-4" style={{ background: B.hdr }}>
              <div className="text-[10px] font-bold tracking-widest mb-1" style={{ color: B.blue }}>
                SCENARIO {si + 1}
              </div>
              <div className="text-sm leading-relaxed text-white/90">{sc.text}</div>
            </div>

            {/* Options */}
            <div className="px-5 py-4 space-y-2" style={{ background: B.ww }}>
              <div className="text-xs font-bold mb-3" style={{ color: B.tl }}>
                Select all that apply:
              </div>
              {block.options.map((opt, oi) => {
                const checked = wasSelected(oi) || (reviewMode && isCorrect(oi));
                let borderColor = B.sand;
                let bg = "white";
                let labelColor = B.td;
                if (submitted || reviewMode) {
                  if (isCorrect(oi)) { borderColor = B.ok; bg = B.okBg; labelColor = B.ok; }
                  else if (wasSelected(oi)) { borderColor = B.err; bg = B.errBg; labelColor = B.err; }
                }
                return (
                  <label
                    key={oi}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors"
                    style={{ borderColor, background: bg, cursor: submitted || reviewMode ? "default" : "pointer" }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(si, oi)}
                      disabled={submitted || reviewMode}
                      className="mt-0.5 shrink-0 cursor-pointer"
                      style={{ accentColor: B.blue }}
                    />
                    <span className="text-sm" style={{ color: labelColor }}>{opt}</span>
                    {(submitted || reviewMode) && isCorrect(oi) && (
                      <span className="ml-auto text-xs font-bold shrink-0" style={{ color: B.ok }}>✓</span>
                    )}
                    {submitted && !reviewMode && wasSelected(oi) && !isCorrect(oi) && (
                      <span className="ml-auto text-xs font-bold shrink-0" style={{ color: B.err }}>✗</span>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Submit button */}
            {!submitted && !reviewMode && (
              <div className="px-5 pb-4" style={{ background: B.ww }}>
                <button
                  onClick={() => submit(si)}
                  disabled={selected.size === 0}
                  className="px-4 py-2 rounded text-sm font-semibold border-none cursor-pointer disabled:opacity-40 disabled:cursor-default"
                  style={{ background: B.blue, color: "white" }}
                >
                  Submit →
                </button>
              </div>
            )}

            {/* Feedback */}
            {(submitted || reviewMode) && sc.feedback && (
              <div
                className="px-5 py-3 text-sm leading-relaxed border-t"
                style={{
                  background: allCorrect || reviewMode ? B.okBg : B.errBg,
                  color: allCorrect || reviewMode ? B.ok : B.err,
                  borderColor: allCorrect || reviewMode ? B.ok + "33" : B.err + "33",
                }}
              >
                {sc.feedback}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
