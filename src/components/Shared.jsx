import { useContext } from "react";
import { B } from "../data/brand";
import { DATA } from "../data/cards";
import { Ctx } from "../state";
import { GT } from "./Glossary";
import mapImg from "../assets/911-map-alt.jpg";

// ─── Md: simple **bold** renderer (no glossary) ──────
export function Md({ t }) {
  if (!t) return null;
  return <>{t.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**")
      ? <strong key={i} className="text-gray-800">{p.slice(2,-2)}</strong>
      : <span key={i}>{p}</span>
  )}</>;
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
  const {s, d} = useContext(Ctx);
  const i = s.cur, tot = DATA.cards.length;
  return (
    <div className="flex justify-between items-center mt-10 pt-5 border-t border-brand-sand">
      {i > 0
        ? <button onClick={()=>d({t:"GO",i:i-1})} className="px-5 py-2.5 rounded text-sm font-semibold border-[1.5px] border-brand-sand text-brand-gray">← Previous</button>
        : <div/>
      }
      {i < tot-1
        ? <button onClick={()=>{d({t:"DONE",i});d({t:"GO",i:i+1})}} disabled={!ok} className="px-5 py-2.5 rounded text-sm font-semibold text-white" style={{background:ok?B.blue:"#ccc",cursor:ok?"pointer":"default"}} /* dynamic: depends on ok prop */>Continue →</button>
        : <div/>
      }
    </div>
  );
}

// ─── Blocks: renders typed content blocks ────────────
export function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.type === "paragraph")
      return <p key={i} className="text-sm leading-relaxed mb-4 text-brand-tm"><GT t={b.text}/></p>;

    if (b.type === "subheading")
      return <h3 key={i} className="text-lg font-bold mt-8 mb-3 text-brand-gray-dk font-heading"><GT t={b.text}/></h3>;

    if (b.type === "callout")
      return (
        <div key={i} className="rounded-lg p-4 my-5 flex gap-3" style={{background:b.style==="warn"?"#fef6e8":B.blueLt,border:`1px solid ${b.style==="warn"?"#e8d5a0":"#b3dcf2"}`}} /* dynamic: callout style variant */>
          <span className="text-lg shrink-0">{b.icon}</span>
          <p className="text-sm leading-relaxed text-brand-tm"><GT t={b.text}/></p>
        </div>
      );

    if (b.type === "yajaira-check")
      return (
        <div key={i} className="rounded-lg p-4 my-5 flex gap-3 items-start bg-brand-ww border border-brand-sand">
          {/* TODO: drop Yajaira_Torso_sm.png into src/assets/ and replace with <img> */}
          <P l="Y" c={B.blue} sz="sm"/>
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

    return null;
  });
}
