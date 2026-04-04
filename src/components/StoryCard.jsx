import { useState, useContext } from "react";
import { B } from "../data/brand";
import { Ctx } from "../state";
import { P, Nav, ET } from "./Shared";
import { GT } from "./Glossary";
import yajairaImg from "../assets/Yajaira_Torso.png";

export default function StoryCard({ data, cardId }) {
  const { editMode } = useContext(Ctx);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div>
      <div className="rounded-lg p-8 mb-8 text-white bg-brand-hdr">
        <div className="flex items-center gap-4 mb-6">
          {!imgErr
            ? <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                <img src={yajairaImg} alt={data.character} className="w-full h-full object-cover" onError={()=>setImgErr(true)}/>
              </div>
            : <P l={data.portrait} c={data.portraitColor}/>
          }
          <div>
            <div className="text-xs font-bold tracking-widest mb-1 text-brand-blue">BEFORE WE BEGIN</div>
            <div className="text-xl font-bold font-heading">
              {editMode && cardId
                ? <ET cardId={cardId} path="data.headline" value={data.headline}>{data.headline}</ET>
                : data.headline}
            </div>
          </div>
        </div>
        {data.body.map((p, i) => (
          <div key={i} className="text-sm leading-relaxed mb-3 text-white/80">
            {editMode && cardId
              ? <ET cardId={cardId} path={`data.body.${i}`} value={p} multiline><GT t={p}/></ET>
              : <GT t={p}/>}
          </div>
        ))}
        <div className="rounded-lg p-4 mt-6 bg-white/[0.06] border border-white/10">
          <div className="text-sm text-white/90">
            {editMode && cardId
              ? <ET cardId={cardId} path="data.closing" value={data.closing} multiline><GT t={data.closing}/></ET>
              : <GT t={data.closing}/>}
          </div>
        </div>
      </div>

      <div className="text-xs font-bold tracking-widest mb-4 text-brand-tl">{(data.objectivesLabel || "Topics covered").toUpperCase()}</div>
      <div className="grid grid-cols-2 gap-3">
        {data.objectives.map((o, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-brand-tm">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border-[1.5px] border-brand-blue text-brand-blue">{i+1}</div>
            <span>
              {editMode && cardId
                ? <ET cardId={cardId} path={`data.objectives.${i}`} value={o}>{o}</ET>
                : o}
            </span>
          </div>
        ))}
      </div>
      <Nav ok={true}/>
    </div>
  );
}
