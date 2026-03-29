import { useState, useContext, useMemo } from "react";
import { B } from "../../data/brand";
import { Ctx } from "../../state";
import { Nav } from "../Shared";
import { GT } from "../Glossary";

// ═══════════════════════════════════════════════════════
//  DocumentReviewCard
//  Shows a styled representation of a form with clickable
//  error zones. The learner clicks each zone, picks what's
//  wrong from a list, and must find all errors to continue.
// ═══════════════════════════════════════════════════════

export default function DocumentReviewCard({ data, cardId }) {
  const { s, d, reviewMode } = useContext(Ctx);
  const found = s.docFound[cardId] || {};

  const [active, setActive] = useState(null);           // active error id (expanded)
  const [wrongPicks, setWrongPicks] = useState({});      // { [errorId]: Set<optionIndex> }

  // Total errors across all documents
  const totalErrors = useMemo(
    () => data.documents.reduce((sum, doc) => sum + doc.errors.length, 0),
    [data.documents],
  );
  const foundCount = Object.keys(found).length;
  const allFound   = reviewMode || foundCount >= totalErrors;

  // ── Pick handler ──
  const handlePick = (err, optIdx) => {
    if (found[err.id]) return;
    if (optIdx === err.correctOption) {
      d({ t: "DOC_FIND", id: cardId, errorId: err.id });
      setActive(null);
    } else {
      d({ t: "DOC_ERR", id: cardId, errorId: err.id });
      setWrongPicks(prev => ({
        ...prev,
        [err.id]: new Set([...(prev[err.id] || []), optIdx]),
      }));
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-1 text-2xl font-bold text-brand-gray-dk font-heading">{data.title}</div>
      <div className="text-sm mb-3 text-brand-tl">{data.subtitle}</div>
      <p className="text-sm leading-relaxed mb-5 text-brand-tm">
        <GT t={data.instructions} />
      </p>

      {/* ── Progress counter ── */}
      <div
        className="flex items-center gap-2 mb-5 px-4 py-2.5 rounded-lg"
        style={{ background: allFound ? B.okBg : B.blueLt }} /* dynamic: bg switches on allFound */
      >
        <span
          className="text-sm font-bold"
          style={{ color: allFound ? B.ok : B.blue }} /* dynamic: color switches on allFound */
        >
          {foundCount} of {totalErrors} errors found
        </span>
        {allFound && <span className="ml-auto text-sm" style={{ color: B.ok }} /* dynamic: ok color */>All found!</span>}
      </div>

      {/* ── Documents ── */}
      {data.documents.map((doc, di) => (
        <div key={di} className="mb-6 rounded-lg border overflow-hidden" style={{ borderColor: B.sand }} /* dynamic: brand border */>
          {/* Document header bar */}
          <div
            className="px-5 py-3 font-bold text-sm border-b"
            style={{ background: B.cream, borderColor: B.sand, color: B.td }} /* dynamic: brand colors */
          >
            {doc.name}
          </div>

          {/* Error zones rendered as form fields */}
          <div className="p-4 space-y-3" style={{ background: B.ww }} /* dynamic: brand bg */>
            {doc.errors.map((err) => {
              const isFound  = reviewMode || !!found[err.id];
              const isActive = !reviewMode && active === err.id;
              const wrongs   = wrongPicks[err.id] || new Set();

              return (
                <div key={err.id}>
                  {/* ── Zone row ── */}
                  <div
                    className="rounded-lg border-2 p-3.5 transition-colors"
                    style={{
                      borderColor: isFound ? B.ok : isActive ? B.blue : B.sand,
                      background:  isFound ? B.okBg : isActive ? B.blueLt : "white",
                      cursor: isFound || reviewMode ? "default" : "pointer",
                    }} /* dynamic: border/bg change on found/active state */
                    onClick={() => { if (!isFound && !reviewMode) setActive(isActive ? null : err.id); }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className="text-[11px] font-bold uppercase tracking-wider mb-1"
                          style={{ color: isFound ? B.ok : B.grayLt }} /* dynamic: label color */
                        >
                          {err.zone}
                        </div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: isFound ? B.ok : B.td }} /* dynamic: value color */
                        >
                          {isFound ? "\u2713 " : ""}{err.displayed}
                        </div>
                      </div>
                      {!isFound && !reviewMode && (
                        <div
                          className="text-xs px-2 py-1 rounded shrink-0 ml-3"
                          style={{ color: B.blue, background: B.blueLt }} /* dynamic: brand badge */
                        >
                          {isActive ? "\u25B2" : "Review \u25BC"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Options panel (expanded) — hidden in review mode ── */}
                  {isActive && !isFound && !reviewMode && (
                    <div className="mt-2 ml-4 p-3 rounded-lg border" style={{ borderColor: B.sand, background: "white" }} /* dynamic: brand border */>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: B.grayLt }} /* dynamic: label color */>
                        What's wrong with this field?
                      </div>
                      <div className="space-y-1.5">
                        {err.options.map((opt, oi) => {
                          const isWrong = wrongs.has(oi);
                          return (
                            <button
                              key={oi}
                              disabled={isWrong}
                              onClick={(e) => { e.stopPropagation(); handlePick(err, oi); }}
                              className="w-full text-left px-3 py-2 rounded text-sm transition-colors"
                              style={{
                                background: isWrong ? B.errBg : "transparent",
                                color:   isWrong ? B.err : B.td,
                                border:  `1px solid ${isWrong ? B.err : B.sand}`,
                                opacity: isWrong ? 0.5 : 1,
                                cursor:  isWrong ? "default" : "pointer",
                              }} /* dynamic: wrong-pick styling */
                            >
                              {isWrong ? "\u2717 " : ""}{opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Feedback (after finding the error, or always in review mode) ── */}
                  {isFound && (
                    <div
                      className="mt-2 ml-4 px-3 py-2 rounded-lg text-xs leading-relaxed"
                      style={{ background: B.okBg, color: B.ok }} /* dynamic: ok styling */
                    >
                      <GT t={err.feedback} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Completion message ── */}
      {allFound && data.completionMessage && (
        <div
          className="px-5 py-4 rounded-lg mb-4 text-sm leading-relaxed"
          style={{ background: B.okBg, color: B.ok }} /* dynamic: ok styling */
        >
          <GT t={data.completionMessage} />
        </div>
      )}

      <Nav ok={allFound} />
    </div>
  );
}
