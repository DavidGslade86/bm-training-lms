import { useState, useContext } from "react";
import { B } from "../data/brand";
import { Ctx } from "../state";
import { Nav } from "./Shared";
import { GT } from "./Glossary";

export default function ScenarioCard({ data, cardId }) {
  const {s, d} = useContext(Ctx);
  const cur = s.scenProg[cardId] || 0;
  const sa  = s.scenAns[cardId]  || {};
  const allDone = cur >= data.steps.length;

  // wrongPicks[si] = Set of option indices chosen incorrectly for step si
  const [wrongPicks, setWrongPicks] = useState({});

  return (
    <div>
      <div className="mb-1 text-2xl font-bold" style={{color:B.grayDk,fontFamily:"Georgia,serif"}}>{data.title}</div>
      <div className="text-sm mb-2" style={{color:B.tl}}>{data.subtitle}</div>
      <p className="text-sm mb-5" style={{color:B.tm}}>{data.intro}</p>

      {data.steps.map((st, si) => {
        if (si > cur) return null;
        const correct    = sa[si] !== undefined;
        const stepWrong  = wrongPicks[si] || new Set();
        const tryCount   = stepWrong.size;

        return (
          <div key={si} className="rounded-lg p-6 mb-4 text-white" style={{background:B.hdr}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div className="text-xs font-bold tracking-widest" style={{color:B.blue}}>
                STEP {si+1} OF {data.steps.length}
              </div>
              {tryCount > 0 && !correct && <div style={{fontSize:11,color:B.err}}>{tryCount} incorrect — try again</div>}
              {correct && tryCount > 0 && <div style={{fontSize:11,color:B.ok}}>✓ ({tryCount} attempt{tryCount>1?"s":""})</div>}
            </div>

            <div className="text-sm mb-4" style={{color:"rgba(255,255,255,0.85)"}}><GT t={st.text} dark/></div>
            <div className="text-sm font-bold mb-3" style={{color:B.blue}}><GT t={st.question} dark/></div>

            <div className="flex flex-col gap-2">
              {st.options.map((o, oi) => {
                let bg="rgba(255,255,255,0.03)", bd="rgba(255,255,255,0.2)", cl="rgba(255,255,255,0.8)";
                if (correct && oi === st.correctIndex) { bg="rgba(74,140,111,0.2)"; bd=B.ok; cl="white"; }
                else if (stepWrong.has(oi))            { bg="rgba(181,74,74,0.15)"; bd=B.err; cl="rgba(255,255,255,0.45)"; }
                else if (correct)                      { cl="rgba(255,255,255,0.35)"; }
                const clickable = !correct && !stepWrong.has(oi);
                return (
                  <div key={oi}
                    onClick={() => {
                      if (!clickable) return;
                      if (oi === st.correctIndex) {
                        d({t:"SCEN_ANS", id:cardId, step:si, ans:oi});
                        setTimeout(()=>d({t:"SCEN", id:cardId}), 420);
                      } else {
                        d({t:"LOG_SCEN_ERR", cardId, step:si});
                        setWrongPicks(prev => {
                          const ws = new Set(prev[si] || []);
                          ws.add(oi);
                          return {...prev, [si]: ws};
                        });
                      }
                    }}
                    className="px-4 py-3 rounded-md text-sm"
                    style={{background:bg,border:`1.5px solid ${bd}`,color:cl,cursor:clickable?"pointer":"default",transition:"all 0.12s"}}>
                    {o}
                  </div>
                );
              })}
            </div>

            {correct && (
              <div className="rounded-md p-4 mt-4 text-sm" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.85)"}}>
                <GT t={st.feedback} dark/>
              </div>
            )}
          </div>
        );
      })}

      {allDone && (
        <div className="rounded-lg p-4 my-4 flex gap-3" style={{background:B.blueLt,border:"1px solid #b3dcf2"}}>
          <span>✅</span>
          <p className="text-sm" style={{color:B.tm}}><strong>Scenario complete.</strong></p>
        </div>
      )}
      <Nav ok={allDone}/>
    </div>
  );
}
