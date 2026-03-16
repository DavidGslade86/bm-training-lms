import { useState, useEffect, useRef, useContext } from "react";
import { B } from "../data/brand";
import { Ctx } from "../state";
import { P, Nav } from "./Shared";

export default function MatchingCard({ data, cardId }) {
  const {s, d} = useContext(Ctx);
  const done = s.matchDone[cardId];
  const [selL, setSelL] = useState(null);
  const matches = s.matchPairs[cardId] || {};
  const [errs, setErrs] = useState({});

  // Shuffle right-side options once per mount
  const shuf = useRef(null);
  if (!shuf.current) shuf.current = [...data.pairs.map(p=>p.right)].sort(()=>Math.random()-0.5);

  const allOk = Object.keys(matches).length === data.pairs.length;
  const missCount = (s.matchErrors[cardId] || []).length;

  useEffect(() => {
    if (allOk && !done) d({t:"MATCH", id:cardId});
  }, [allOk, done, d, cardId]);

  const mR = new Set(Object.values(matches));

  return (
    <div>
      <div className="text-xs font-bold tracking-widest mb-2 text-brand-blue">{data.label}</div>
      <p className="text-sm mb-5 text-brand-tm">{data.instruction}</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Left column: illnesses */}
        <div>
          <div className="text-xs font-bold tracking-wider mb-3 uppercase text-brand-gray">Illness / Condition</div>
          {data.pairs.map((p, i) => {
            const m = matches[i] !== undefined, sel = selL === i, er = errs.left === i;
            /* dynamic: match-state colors for bg/border/text */
            let bg="white", bd=B.sand, cl=B.tm;
            if (m)        { bg=B.okBg;  bd=B.ok;  cl="#2d5a3f"; }
            else if (er)  { bg=B.errBg; bd=B.err; }
            else if (sel) { bg=B.blueLt; bd=B.blue; cl=B.blueDk; }
            return (
              <div key={i} onClick={()=>!m&&!done&&setSelL(i)}
                className="px-4 py-3 rounded-md text-sm mb-2 font-medium"
                style={{background:bg,border:`2px solid ${bd}`,color:cl,cursor:m||done?"default":"pointer"}} /* dynamic: match-state styling */>
                {m && <span className="mr-2">✓</span>}{p.left}
              </div>
            );
          })}
        </div>

        {/* Right column: timing requirements */}
        <div>
          <div className="text-xs font-bold tracking-wider mb-3 uppercase text-brand-gray">Timing Requirement</div>
          {shuf.current.map((r, i) => {
            const m = mR.has(r), er = errs.right === r;
            /* dynamic: match-state colors for bg/border/text */
            let bg="white", bd=B.sand, cl=B.tm;
            if (m)        { bg=B.okBg;  bd=B.ok; cl="#2d5a3f"; }
            else if (er)  { bg=B.errBg; bd=B.err; }
            else if (selL !== null) { bd=B.blue; }
            return (
              <div key={i}
                onClick={() => {
                  if (done || m || selL === null) return;
                  if (r === data.pairs[selL].right) {
                    d({t:"MATCH_PAIR", id:cardId, idx:selL, right:r});
                    setSelL(null);
                  } else {
                    d({t:"MATCH_ERR", id:cardId, left:data.pairs[selL].left, right:r});
                    setErrs({left:selL, right:r});
                    setTimeout(()=>setErrs({}), 800);
                  }
                }}
                className="px-4 py-3 rounded-md text-sm mb-2 font-medium"
                style={{background:bg,border:`2px solid ${bd}`,color:cl,cursor:m||done||selL===null?"default":"pointer"}} /* dynamic: match-state styling */>
                {m && <span className="mr-2">✓</span>}{r}
              </div>
            );
          })}
        </div>
      </div>

      {allOk && (
        <div className="rounded-lg p-4 mt-5 flex gap-3 items-start bg-brand-ww border border-brand-sand">
          {/* TODO: drop Yajaira_Torso_sm.png into src/assets/ and replace with <img> */}
          <P l="Y" c={B.blue} sz="sm"/>
          <div>
            <p className="text-sm text-brand-tm">{data.successMessage}</p>
            {missCount > 0 && (
              <p className="text-xs mt-2 text-brand-tl">
                {missCount} incorrect attempt{missCount>1?"s":""} — consider reviewing the timing requirements above before continuing.
              </p>
            )}
          </div>
        </div>
      )}
      <Nav ok={allOk}/>
    </div>
  );
}
