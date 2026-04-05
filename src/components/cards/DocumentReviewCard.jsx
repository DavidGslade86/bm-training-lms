import { useState, useContext, useMemo } from "react";
import { B } from "../../data/brand";
import { Ctx } from "../../state";
import { Nav, ET } from "../Shared";
import { GT } from "../Glossary";

// ═══════════════════════════════════════════════════════
//  DocumentReviewCard
//  Shows a styled representation of a form with clickable
//  error zones. The learner clicks each zone, picks what's
//  wrong from a list, and must find all errors to continue.
// ═══════════════════════════════════════════════════════

export default function DocumentReviewCard({ data, cardId }) {
  const { s, d, reviewMode, editMode } = useContext(Ctx);
  const found = s.docFound[cardId] || {};

  const [active, setActive] = useState(null);           // active error id (expanded)
  const [wrongPicks, setWrongPicks] = useState({});      // { [errorId]: Set<optionIndex> }

  // mode: "find-errors" (default) | "action-items"
  const mode = data.mode || "find-errors";
  const isActionItems = mode === "action-items";

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

  // Instruction text varies by mode
  const instructions = data.instructions || (
    isActionItems
      ? "Review the note below and identify what action is required for each item."
      : "Review the document below and find everything that needs to be corrected."
  );

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-1 text-2xl font-bold text-brand-gray-dk font-heading">
        {editMode && cardId
          ? <ET cardId={cardId} path="data.title" value={data.title}>{data.title}</ET>
          : data.title}
      </div>
      <div className="text-sm mb-3 text-brand-tl">
        {editMode && cardId
          ? <ET cardId={cardId} path="data.subtitle" value={data.subtitle}>{data.subtitle}</ET>
          : data.subtitle}
      </div>
      <div className="text-sm leading-relaxed mb-5 text-brand-tm">
        {editMode && cardId
          ? <ET cardId={cardId} path="data.instructions" value={instructions} multiline><GT t={instructions} /></ET>
          : <p className="m-0"><GT t={instructions} /></p>}
      </div>

      {/* ── Salesforce note block (optional) ── */}
      {data.noteText && (
        <div
          className="mb-5 rounded-lg border px-5 py-4"
          style={{ background: "#f8f9fa", borderColor: "#d0d5dd", fontFamily: "monospace" }}
        >
          <div
            className="text-[10px] font-bold tracking-widest mb-2 uppercase"
            style={{ color: "#6b7280", fontFamily: "system-ui, sans-serif" }}
          >
            Salesforce Note
          </div>
          <pre className="text-xs leading-relaxed whitespace-pre-wrap m-0" style={{ color: "#1a1a1a", fontFamily: "inherit" }}>
            {editMode && cardId
              ? <ET cardId={cardId} path="data.noteText" value={data.noteText} multiline>{data.noteText}</ET>
              : data.noteText}
          </pre>
        </div>
      )}

      {/* ── Progress counter ── */}
      <div
        className="flex items-center gap-2 mb-5 px-4 py-2.5 rounded-lg"
        style={{ background: allFound ? B.okBg : B.blueLt }} /* dynamic: bg switches on allFound */
      >
        <span
          className="text-sm font-bold"
          style={{ color: allFound ? B.ok : B.blue }} /* dynamic: color switches on allFound */
        >
          {foundCount} of {totalErrors} {isActionItems ? "items identified" : "errors found"}
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
            {editMode && cardId
              ? <ET cardId={cardId} path={`data.documents.${di}.name`} value={doc.name}>{doc.name}</ET>
              : doc.name}
          </div>

          {/* Error zones rendered as form fields */}
          <div className="p-4 space-y-3" style={{ background: B.ww }} /* dynamic: brand bg */>
            {doc.errors.map((err, ei) => {
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
                          {editMode && cardId
                            ? <ET cardId={cardId} path={`data.documents.${di}.errors.${ei}.zone`} value={err.zone}>{err.zone}</ET>
                            : err.zone}
                        </div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: isFound ? B.ok : B.td }} /* dynamic: value color */
                        >
                          {isFound ? "\u2713 " : ""}
                          {editMode && cardId
                            ? <ET cardId={cardId} path={`data.documents.${di}.errors.${ei}.displayed`} value={err.displayed}>{err.displayed}</ET>
                            : err.displayed}
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
                        {isActionItems ? "What action is required?" : "What's wrong with this field?"}
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
                              {isWrong ? "\u2717 " : ""}
                              {editMode && cardId
                                ? <ET cardId={cardId} path={`data.documents.${di}.errors.${ei}.options.${oi}`} value={opt}>{opt}</ET>
                                : opt}
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
                      {editMode && cardId
                        ? <ET cardId={cardId} path={`data.documents.${di}.errors.${ei}.feedback`} value={err.feedback} multiline><GT t={err.feedback} /></ET>
                        : <GT t={err.feedback} />}
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
          {editMode && cardId
            ? <ET cardId={cardId} path="data.completionMessage" value={data.completionMessage} multiline><GT t={data.completionMessage} /></ET>
            : <GT t={data.completionMessage} />}
        </div>
      )}

      <Nav ok={allFound} />
    </div>
  );
}
