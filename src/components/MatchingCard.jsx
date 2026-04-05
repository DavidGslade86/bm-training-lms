import { useState, useEffect, useRef, useContext } from "react";
import { B } from "../data/brand";
import { Ctx } from "../state";
import { P, Nav, ET } from "./Shared";
import yajairaImg from "../assets/Yajaira_Torso.png";

export default function MatchingCard({ data, cardId }) {
  const {s, d, reviewMode, editMode} = useContext(Ctx);
  const done = s.matchDone[cardId];
  const [selL, setSelL] = useState(null);
  const matches = s.matchPairs[cardId] || {};
  const [errs, setErrs] = useState({});
  const [revealAll, setRevealAll] = useState(false);

  // Shuffle right-side options once per mount
  const shuf = useRef(null);
  if (!shuf.current) shuf.current = [...data.pairs.map(p=>p.right)].sort(()=>Math.random()-0.5);

  const allOk = Object.keys(matches).length === data.pairs.length;
  const missCount = (s.matchErrors[cardId] || []).length;

  useEffect(() => {
    if (allOk && !done) d({t:"MATCH", id:cardId});
  }, [allOk, done, d, cardId]);

  const mR = new Set(Object.values(matches));

  // In review mode, build a "revealed" right column that maps each left item to its correct right
  const revealedRights = reviewMode && revealAll
    ? new Set(data.pairs.map(p => p.right))
    : null;

  return (
    <div>
      <div className="text-xs font-bold tracking-widest mb-2 text-brand-blue">
        {editMode && cardId
          ? <ET cardId={cardId} path="data.label" value={data.label}>{data.label}</ET>
          : data.label}
      </div>
      <div className="text-sm mb-5 text-brand-tm">
        {editMode && cardId
          ? <ET cardId={cardId} path="data.instruction" value={data.instruction} multiline>{data.instruction}</ET>
          : <p className="m-0">{data.instruction}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left column: illnesses */}
        <div>
          <div className="text-xs font-bold tracking-wider mb-3 uppercase text-brand-gray">Illness / Condition</div>
          {data.pairs.map((p, i) => {
            const m = matches[i] !== undefined || !!revealAll, sel = selL === i, er = errs.left === i;
            /* dynamic: match-state colors for bg/border/text */
            let bg="white", bd=B.sand, cl=B.tm;
            if (m)        { bg=B.okBg;  bd=B.ok;  cl="#2d5a3f"; }
            else if (er)  { bg=B.errBg; bd=B.err; }
            else if (sel) { bg=B.blueLt; bd=B.blue; cl=B.blueDk; }
            return (
              <div key={i} onClick={()=>!m&&!done&&!reviewMode&&setSelL(i)}
                className="px-4 py-3 rounded-md text-sm mb-2 font-medium"
                style={{background:bg,border:`2px solid ${bd}`,color:cl,cursor:m||done||reviewMode?"default":"pointer"}} /* dynamic: match-state styling */>
                {m && <span className="mr-2">✓</span>}
                {editMode && cardId
                  ? <ET cardId={cardId} path={`data.pairs.${i}.left`} value={p.left}>{p.left}</ET>
                  : p.left}
              </div>
            );
          })}
        </div>

        {/* Right column: timing requirements */}
        <div>
          <div className="text-xs font-bold tracking-wider mb-3 uppercase text-brand-gray">Timing Requirement</div>
          {shuf.current.map((r, i) => {
            const m = mR.has(r) || (revealedRights?.has(r)), er = errs.right === r;
            /* dynamic: match-state colors for bg/border/text */
            let bg="white", bd=B.sand, cl=B.tm;
            if (m)        { bg=B.okBg;  bd=B.ok; cl="#2d5a3f"; }
            else if (er)  { bg=B.errBg; bd=B.err; }
            else if (selL !== null) { bd=B.blue; }
            return (
              <div key={i}
                onClick={() => {
                  if (done || m || selL === null || reviewMode) return;
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
                style={{background:bg,border:`2px solid ${bd}`,color:cl,cursor:m||done||selL===null||reviewMode?"default":"pointer"}} /* dynamic: match-state styling */>
                {m && <span className="mr-2">✓</span>}
                {editMode && cardId
                  ? <ET cardId={cardId} path={`data.pairs.${data.pairs.findIndex(p=>p.right===r)}.right`} value={r}>{r}</ET>
                  : r}
              </div>
            );
          })}
        </div>
      </div>

      {reviewMode && !revealAll && (
        <button onClick={()=>setRevealAll(true)} className="mt-4 px-4 py-2 rounded text-sm font-semibold border-[1.5px]" style={{borderColor:B.blue, color:B.blue, background:B.blueLt}}>Reveal all matches</button>
      )}

      {(allOk || revealAll) && (
        <div className="rounded-lg p-4 mt-5 flex gap-3 items-start bg-brand-ww border border-brand-sand">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
            <img src={yajairaImg} alt="Yajaira" className="w-full h-full object-cover"/>
          </div>
          <div>
            <div className="text-sm text-brand-tm">
              {editMode && cardId
                ? <ET cardId={cardId} path="data.successMessage" value={data.successMessage} multiline>{data.successMessage}</ET>
                : data.successMessage}
            </div>
            {!reviewMode && missCount > 0 && (
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
