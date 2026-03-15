import { useState, useEffect, useRef } from "react";
import { B } from "../data/brand";
import { GLOSSARY, CAT_COLOR } from "../data/glossary";

const ALL_CATS = [
  "All",
  "B&M GENERAL VOCABULARY",
  "FORM AND DOCUMENT ACRONYMS",
  "MEDICAL TERMS/CONDITIONS",
  "DEPARTMENTS AND TITLES",
  "FA VOCABULARY",
  "AWARD/REVIEW TERMS",
  "GOVERNMENT PROGRAMS/AGENCIES",
];

const CAT_SHORT = {
  "All": "All",
  "B&M GENERAL VOCABULARY": "B&M Vocab",
  "FORM AND DOCUMENT ACRONYMS": "Forms & Docs",
  "MEDICAL TERMS/CONDITIONS": "Medical",
  "DEPARTMENTS AND TITLES": "Departments",
  "FA VOCABULARY": "Family Assist.",
  "AWARD/REVIEW TERMS": "Awards",
  "GOVERNMENT PROGRAMS/AGENCIES": "Programs",
};

export default function GlossaryDrawer({ open, onClose }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ(""); setCat("All"); setExpanded(null);
      setTimeout(()=>inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const lq = q.trim().toLowerCase();
  const filtered = GLOSSARY.filter(e => {
    if (cat !== "All" && e.cat !== cat) return false;
    if (!lq) return true;
    return (
      e.term.toLowerCase().includes(lq) ||
      e.abbr.toLowerCase().includes(lq) ||
      e.def.toLowerCase().includes(lq)
    );
  });

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/45 z-[10000] backdrop-blur-sm"/>

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] z-[10001] bg-brand-ww flex flex-col shadow-[-6px_0_40px_rgba(0,0,0,0.2)]">

        {/* Header */}
        <div className="bg-brand-hdr px-5 py-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-brand-blue text-[10px] font-bold tracking-[1.2px] uppercase mb-[3px]">BMSP GLOSSARY</div>
              <div className="text-white text-base font-bold font-heading">
                {filtered.length} of {GLOSSARY.length} terms
              </div>
            </div>
            <button onClick={onClose} className="bg-white/[0.08] border-none text-white/60 rounded-md w-8 h-8 cursor-pointer text-lg flex items-center justify-center">✕</button>
          </div>
          <input
            ref={inputRef}
            value={q}
            onChange={e=>{setQ(e.target.value); setExpanded(null);}}
            placeholder="Search terms, abbreviations, definitions…"
            className="w-full px-3 py-[9px] rounded-md border-none bg-white/10 text-white text-[13px] outline-none box-border"
          />
        </div>

        {/* Category tabs */}
        <div className="bg-brand-side px-3 py-2 flex gap-1.5 flex-wrap shrink-0 border-b border-white/[0.06]">
          {ALL_CATS.map(c => {
            const cc = CAT_COLOR[c] || B.blue;
            const active = cat === c;
            return (
              <button key={c} onClick={()=>{setCat(c); setExpanded(null);}}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer border-none tracking-[0.4px] transition-all duration-150"
                style={{background:active?cc:"rgba(255,255,255,0.07)",color:active?"white":"rgba(255,255,255,0.45)"}} /* dynamic: active category color */>
                {CAT_SHORT[c] || c}
              </button>
            );
          })}
        </div>

        {/* Term list */}
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-brand-tl text-[13px]">
              No terms match <strong>"{q}"</strong>
            </div>
          )}
          {filtered.map((e, idx) => {
            const key = `${e.abbr}|${e.term}|${idx}`;
            const isOpen = expanded === key;
            const cc = CAT_COLOR[e.cat] || B.gray;
            const label = e.abbr ? e.abbr : e.term;
            const sub   = e.abbr ? e.term : null;
            return (
              <div key={key}
                onClick={()=>setExpanded(isOpen ? null : key)}
                className="cursor-pointer border-b border-brand-sand transition-colors duration-100"
                style={{padding:isOpen?"12px 20px 14px":"10px 20px",background:isOpen?B.blueLt:"transparent"}} /* dynamic: expanded-state padding + bg */>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-[13px] text-brand-gray-dk">{label}</span>
                      {sub && <span className="text-[11px] text-brand-tl italic">{sub}</span>}
                    </div>
                    {!isOpen && e.def && (
                      <div className="text-[11px] text-brand-tl mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-[360px]">
                        {e.def}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] px-[7px] py-[2px] rounded-[10px] font-bold uppercase tracking-[0.5px] whitespace-nowrap"
                      style={{background:cc+"22",color:cc}} /* dynamic: category color with hex opacity suffix */>
                      {CAT_SHORT[e.cat] || e.cat}
                    </span>
                    <span className="text-brand-tl text-xs">{isOpen?"▲":"▼"}</span>
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-2.5">
                    {e.def && <p className="text-[13px] text-brand-tm leading-relaxed mb-1.5">{e.def}</p>}
                    {e.ex && <p className="text-[11px] text-brand-tl italic m-0">See also: {e.ex}</p>}
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.6px]" style={{color:cc}} /* dynamic: category color */>{e.cat}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2.5 bg-brand-ww border-t border-brand-sand text-[11px] text-brand-tl shrink-0">
          Hover over <span className="border-b border-dotted border-brand-blue text-brand-tm">underlined terms</span> anywhere in the module to see definitions inline.
        </div>
      </div>
    </>
  );
}
