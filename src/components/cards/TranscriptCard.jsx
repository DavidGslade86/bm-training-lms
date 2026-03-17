import { useState, useContext, useMemo, useEffect, useRef } from "react";
import { B } from "../../data/brand";
import { Ctx } from "../../state";
import { Nav } from "../Shared";
import { GT } from "../Glossary";

// ═══════════════════════════════════════════════════════
//  TranscriptCard
//  Renders a call transcript as chat bubbles (CA on right,
//  Client on left) with decision-point questions woven in.
//  Lines reveal in segments separated by decision points.
// ═══════════════════════════════════════════════════════

export default function TranscriptCard({ data, cardId }) {
  const { s, d } = useContext(Ctx);
  const answers = s.transAns[cardId] || {};
  const [wrongPicks, setWrongPicks] = useState({});   // { [decKey]: Set<optIdx> }
  const endRef = useRef(null);

  // ── Flatten calls into segments ──
  // Each segment = { lines: [...dialogue/headers], decision: obj|null, decKey: string|null }
  // Segments are separated by decision points.
  const segments = useMemo(() => {
    const segs = [];
    let curLines = [];

    data.calls.forEach((call, ci) => {
      curLines.push({ type: "call-header", title: call.callTitle });
      call.lines.forEach((line, li) => {
        if (line.type === "decision") {
          const decKey = `${ci}-${li}`;
          segs.push({ lines: curLines, decision: { ...line, decKey }, decKey });
          curLines = [];
        } else {
          curLines.push(line);
        }
      });
    });
    // Last segment (after the final decision, or all lines if no decisions)
    if (curLines.length > 0) {
      segs.push({ lines: curLines, decision: null, decKey: null });
    }
    return segs;
  }, [data.calls]);

  // ── Visible segment count ──
  // Walk from the start; a segment is "blocking" if it has an unanswered decision.
  const visibleCount = useMemo(() => {
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].decision && answers[segments[i].decKey] === undefined) {
        return i + 1; // show this segment (lines visible, decision pending)
      }
    }
    return segments.length; // all segments visible
  }, [segments, answers]);

  const allDone = visibleCount === segments.length &&
    segments.every(seg => !seg.decision || answers[seg.decKey] !== undefined);

  // ── Decision handler ──
  const handleDecisionPick = (decKey, correctIdx, optIdx) => {
    if (answers[decKey] !== undefined) return;
    if (optIdx === correctIdx) {
      d({ t: "TRANS_ANS", id: cardId, key: decKey, ans: optIdx });
    } else {
      d({ t: "TRANS_ERR", id: cardId, key: decKey });
      setWrongPicks(prev => ({
        ...prev,
        [decKey]: new Set([...(prev[decKey] || []), optIdx]),
      }));
    }
  };

  // ── Auto-scroll when new content appears ──
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [visibleCount, answers]);

  // ── Render helpers ──
  const renderBubble = (line, idx) => {
    const isCA = line.type === "ca";
    return (
      <div key={idx} className={`flex ${isCA ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[80%]">
          <div
            className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isCA ? "text-right" : "text-left"}`}
            style={{ color: B.grayLt }} /* dynamic: brand label color */
          >
            {line.speaker}
          </div>
          <div
            className="px-3.5 py-2.5 rounded-xl text-sm leading-relaxed"
            style={{
              background: isCA ? B.blue : B.grayDk,
              color: "white",
              borderBottomRightRadius: isCA ? 4 : undefined,
              borderBottomLeftRadius: !isCA ? 4 : undefined,
            }} /* dynamic: CA (blue) vs client (gray) bubble styling */
          >
            <GT t={line.text} dark />
          </div>
        </div>
      </div>
    );
  };

  const renderCallHeader = (line, idx) => (
    <div key={idx} className="text-center py-3">
      <span
        className="text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full inline-block"
        style={{ background: B.sand, color: B.gray }} /* dynamic: brand pill color */
      >
        {line.title}
      </span>
    </div>
  );

  const renderDecisionPending = (decision) => {
    const wrongs = wrongPicks[decision.decKey] || new Set();
    return (
      <div
        className="mx-auto max-w-[92%] p-4 rounded-xl border-2 my-3"
        style={{ borderColor: B.blue, background: "white" }} /* dynamic: brand border */
      >
        <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: B.blue }} /* dynamic: brand color */>
          Decision Point
        </div>
        <div className="text-sm font-medium mb-3" style={{ color: B.td }} /* dynamic: brand color */>
          <GT t={decision.question} />
        </div>
        <div className="space-y-1.5">
          {decision.options.map((opt, oi) => {
            const isWrong = wrongs.has(oi);
            return (
              <button
                key={oi}
                disabled={isWrong}
                onClick={() => handleDecisionPick(decision.decKey, decision.correctIndex, oi)}
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
    );
  };

  const renderDecisionAnswered = (decision, ansIdx) => (
    <div
      className="mx-auto max-w-[92%] p-4 rounded-xl border-2 my-3"
      style={{ borderColor: B.ok, background: B.okBg }} /* dynamic: ok styling */
    >
      <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: B.ok }} /* dynamic: ok color */>
        Decision Point
      </div>
      <div className="text-sm font-medium mb-2" style={{ color: B.td }} /* dynamic: brand color */>
        <GT t={decision.question} />
      </div>
      <div
        className="text-sm px-3 py-2 rounded mb-2"
        style={{ background: "white", color: B.ok, border: `1px solid ${B.ok}` }} /* dynamic: ok styling */
      >
        {"\u2713"} {decision.options[ansIdx]}
      </div>
      {decision.feedback && (
        <div className="text-xs leading-relaxed" style={{ color: B.ok }} /* dynamic: ok color */>
          <GT t={decision.feedback} />
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-1 text-2xl font-bold text-brand-gray-dk font-heading">{data.title}</div>
      <div className="text-sm mb-3 text-brand-tl">{data.subtitle}</div>
      {data.intro && (
        <p className="text-sm leading-relaxed mb-5 text-brand-tm">
          <GT t={data.intro} />
        </p>
      )}

      {/* ── Transcript area ── */}
      <div
        className="rounded-xl border overflow-hidden mb-4"
        style={{ borderColor: B.sand, background: B.cream }} /* dynamic: brand border/bg */
      >
        <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
          {segments.slice(0, visibleCount).map((seg, si) => {
            const isLastVisible = si === visibleCount - 1;
            const decAnswered   = seg.decKey && answers[seg.decKey] !== undefined;

            return (
              <div key={si}>
                {/* Dialogue lines */}
                {seg.lines.map((line, li) => {
                  const key = `${si}-${li}`;
                  if (line.type === "call-header") return renderCallHeader(line, key);
                  return renderBubble(line, key);
                })}

                {/* Decision point */}
                {seg.decision && (
                  decAnswered
                    ? renderDecisionAnswered(seg.decision, answers[seg.decKey])
                    : isLastVisible
                      ? renderDecisionPending(seg.decision)
                      : null
                )}
              </div>
            );
          })}

          <div ref={endRef} />
        </div>
      </div>

      {/* ── Completion feedback ── */}
      {allDone && (
        <div
          className="px-5 py-4 rounded-lg mb-4 text-sm leading-relaxed"
          style={{ background: B.okBg, color: B.ok }} /* dynamic: ok styling */
        >
          {"\u2713"} Transcript review complete
        </div>
      )}

      <Nav ok={allDone} />
    </div>
  );
}
