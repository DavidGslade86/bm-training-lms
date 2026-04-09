import { useState, useRef } from "react";
import {
  GMAP as STATIC_GMAP,
  GREGEX_SRC as STATIC_GREGEX_SRC,
  STRICT_RX_SRC as STATIC_STRICT_RX_SRC,
  CAT_COLOR,
  CAT_LABEL,
} from "../data/glossary";
import { useEditableGlossary } from "../hooks/useEditableGlossary";

// ─── Popup tooltip shown on click ────────────────────
export function GlossaryPopup({ entry, rect }) {
  const W = 300;
  let left = rect.left + rect.width / 2 - W / 2;
  if (left < 8) left = 8;
  if (typeof window !== "undefined" && left + W > window.innerWidth - 8) left = window.innerWidth - W - 8;
  const above = rect.top > 200;
  const top = above ? rect.top - 8 : rect.bottom + 8;
  const cc = CAT_COLOR[entry.cat] || "#63656a";
  const cl = CAT_LABEL[entry.cat] || entry.cat;
  const header = entry.abbr && entry.abbr !== entry.term ? entry.abbr : entry.term;
  const sub    = entry.abbr && entry.abbr !== entry.term ? entry.term : null;
  const defTxt = entry.def.length > 280 ? entry.def.slice(0, 277) + "\u2026" : entry.def;
  return (
    <div
      className="fixed z-[99999] pointer-events-none bg-white rounded-lg overflow-hidden border border-[#e0ddd8] text-xs leading-normal"
      style={{left, top, width:W, transform: above ? "translateY(-100%)" : "none", boxShadow:"0 6px 28px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1)"}} /* dynamic: computed position + conditional transform + custom shadow */>
      <div className="flex items-center justify-between gap-2 px-3 py-[7px]" style={{background:cc}} /* dynamic: category color */>
        <span className="text-white font-bold text-[13px] shrink min-w-0">{header}</span>
        <span className="text-white/75 text-[9px] uppercase tracking-[0.8px] whitespace-nowrap shrink-0">{cl}</span>
      </div>
      {sub && <div className="px-3 pt-[5px] text-brand-tm italic text-[11px]">{sub}</div>}
      {defTxt && <div className="px-3 text-brand-td" style={{padding: sub ? "4px 12px 10px" : "9px 12px"}} /* dynamic: conditional padding based on sub */>{defTxt}</div>}
      {entry.ex && <div className="px-3 pb-[9px] text-brand-tl text-[11px] italic">{entry.ex}</div>}
    </div>
  );
}

// ─── Inline term wrapper with click-to-show popup ────
export function GlossaryTerm({ entry, children }) {
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  return (
    <span ref={ref}
      onClick={(e) => { e.stopPropagation(); setRect(rect ? null : ref.current?.getBoundingClientRect()); }}
      onMouseLeave={() => setRect(null)}
      className="border-b border-dotted border-brand-blue cursor-pointer text-inherit inline">
      {children}
      {rect && <GlossaryPopup entry={entry} rect={rect}/>}
    </span>
  );
}

// ─── Two-pass tokenizer ───────────────────────────────
// Pass 1: case-sensitive strict regex for IS, IT
// Pass 2: case-insensitive main regex for everything else
//
// Reads regex sources + GMAP from the GlossaryProvider context if mounted,
// otherwise falls back to the static module-level exports.
export function GlossaryInline({ text }) {
  const ctx = useEditableGlossary();
  const GMAP = ctx?.GMAP || STATIC_GMAP;
  const GREGEX_SRC = ctx?.GREGEX_SRC || STATIC_GREGEX_SRC;
  const STRICT_RX_SRC = ctx?.STRICT_RX_SRC || STATIC_STRICT_RX_SRC;

  if (!text) return null;
  const strictRx = new RegExp(STRICT_RX_SRC, "g"); // NO 'i' flag
  const mainRx = new RegExp(GREGEX_SRC, "gi");

  const tokens = [];
  let last = 0, m;
  while ((m = strictRx.exec(text)) !== null) {
    if (m.index > last) tokens.push({ type:"text", s: text.slice(last, m.index) });
    tokens.push({ type:"term", s: m[0], entry: GMAP[m[0].toLowerCase()] });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ type:"text", s: text.slice(last) });

  const output = [];
  tokens.forEach((tok, ti) => {
    if (tok.type === "term") {
      output.push(tok.entry
        ? <GlossaryTerm key={`s${ti}`} entry={tok.entry}>{tok.s}</GlossaryTerm>
        : <span key={`s${ti}`}>{tok.s}</span>);
    } else {
      const parts = [];
      let l = 0, m2;
      mainRx.lastIndex = 0;
      while ((m2 = mainRx.exec(tok.s)) !== null) {
        if (m2.index > l) parts.push(<span key={`${ti}-${l}`}>{tok.s.slice(l, m2.index)}</span>);
        const matched = m2[0];
        const entry = GMAP[matched.toLowerCase()];
        parts.push(entry
          ? <GlossaryTerm key={`${ti}-${m2.index}`} entry={entry}>{matched}</GlossaryTerm>
          : <span key={`${ti}-${m2.index}`}>{matched}</span>);
        l = m2.index + matched.length;
      }
      if (l < tok.s.length) parts.push(<span key={`${ti}-end`}>{tok.s.slice(l)}</span>);
      output.push(...parts);
    }
  });
  return <>{output}</>;
}

// ─── GT: bold (**text**) + glossary highlighting ─────
// dark=true → bold text renders white (for dark card backgrounds)
export function GT({ t, dark }) {
  if (!t) return null;
  const boldColor = dark ? "white" : "#1a1a1a";
  return <>{t.split(/(\*\*[^*]+\*\*)/g).map((seg, i) => {
    if (seg.startsWith("**") && seg.endsWith("**"))
      return <strong key={i} style={{color: boldColor}} /* dynamic: dark/light mode bold color */><GlossaryInline text={seg.slice(2,-2)}/></strong>;
    return <GlossaryInline key={i} text={seg}/>;
  })}</>;
}
