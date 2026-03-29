import { useState, useContext } from "react";
import { B } from "../data/brand";
import { Ctx } from "../state";
import { Nav } from "./Shared";
import { GT } from "./Glossary";

export default function AssessmentCard({ data }) {
  const {s, d, reviewMode} = useContext(Ctx);
  // wrongPicks[qi] = Set of option indices chosen incorrectly for question qi
  const [wrongPicks, setWrongPicks] = useState({});
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const L = ["A","B","C","D"];
  const tot = data.questions.length;
  const ct  = Object.keys(s.assessAns).length;

  return (
    <div>
      <div className="mb-1 text-2xl font-bold text-brand-gray-dk font-heading">{data.title}</div>
      <div className="text-sm mb-2 text-brand-tl">{data.subtitle}</div>
      <div className="text-xs mb-6 text-brand-tl">
        Select the correct answer for each question. You must answer correctly to advance — the correct answer is not revealed on a wrong pick, so read carefully.
      </div>

      {data.questions.map((q, qi) => {
        const correct = reviewMode && showAllAnswers ? true : s.assessAns[qi] !== undefined;
        const qWrong  = wrongPicks[qi] || new Set();
        const lk      = !reviewMode && qi > ct;
        const tries   = s.assessTries[qi] || 0;

        return (
          <div key={qi} className="rounded-lg p-5 mb-3 transition-colors duration-200" style={{
            background: correct ? B.okBg : B.ww,
            border: `1px solid ${correct ? "#b8d5c4" : B.sand}`,
            opacity: lk ? 0.35 : 1,
            pointerEvents: lk ? "none" : "auto",
          }} /* dynamic: answer-state + lock-state styling */>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold tracking-widest" style={{color:correct?B.ok:B.blue}} /* dynamic: answer-state color */>Q{qi+1} / {tot}</div>
              {!reviewMode && tries > 0 && !correct && <div className="text-xs text-brand-err">{tries} incorrect attempt{tries>1?"s":""} — try again</div>}
              {correct && <div className="text-xs font-bold text-brand-ok">✓ Correct{!reviewMode && tries > 1 ? ` (${tries} attempts)` : ""}</div>}
            </div>

            <div className="text-sm font-bold mb-3 text-brand-gray-dk font-heading"><GT t={q.question}/></div>

            <div className="flex flex-col gap-2">
              {q.options.map((o, oi) => {
                /* dynamic: option border/bg/color depends on correct + wrong-pick state */
                let st = {border:`1.5px solid ${B.sand}`, background:"white", color:B.tm};
                if (correct) {
                  if (oi === q.correctIndex)  st = {border:`1.5px solid ${B.ok}`,  background:B.okBg,  color:"#2d5a3f"};
                  else if (qWrong.has(oi))    st = {border:`1.5px solid ${B.err}`, background:B.errBg, color:"#9a3030"};
                  else                        st = {border:`1.5px solid ${B.sand}`, background:"#f7f5f0", color:"#aaa"};
                } else if (qWrong.has(oi)) {
                  st = {border:`1.5px solid ${B.err}`, background:B.errBg, color:"#9a3030"};
                }
                const clickable    = !correct && !lk && !qWrong.has(oi) && !reviewMode;
                /* dynamic: circle indicator colors depend on answer state */
                const circleBorder = correct && oi===q.correctIndex ? B.ok : qWrong.has(oi) ? B.err : "#ddd";
                const circleBg     = correct && oi===q.correctIndex ? B.ok : qWrong.has(oi) ? B.err : "transparent";
                const circleColor  = (correct && oi===q.correctIndex) || qWrong.has(oi) ? "white" : "#999";

                return (
                  <div key={oi}
                    onClick={() => {
                      if (!clickable) return;
                      const isOk = oi === q.correctIndex;
                      if (!isOk) {
                        setWrongPicks(prev => {
                          const ws = new Set(prev[qi] || []);
                          ws.add(oi);
                          return {...prev, [qi]: ws};
                        });
                      }
                      d({t:"ASSES", qi, a:oi, ok:isOk});
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-100"
                    style={{...st, cursor: clickable ? "pointer" : "default"}} /* dynamic: answer-state styling */>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{border:`1.5px solid ${circleBorder}`, background:circleBg, color:circleColor}} /* dynamic: answer-state indicator */>
                      {L[oi]}
                    </div>
                    <span>{o}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {reviewMode && !showAllAnswers && (
        <button onClick={()=>setShowAllAnswers(true)} className="mb-4 px-4 py-2 rounded text-sm font-semibold border-[1.5px]" style={{borderColor:B.blue, color:B.blue, background:B.blueLt}}>Show all answers</button>
      )}
      {!reviewMode && (
        <div className="text-xs mt-2 mb-4 text-brand-tl">
          Score shown at completion reflects questions answered correctly on the first attempt.
        </div>
      )}
      <Nav ok={ct >= tot}/>
    </div>
  );
}
