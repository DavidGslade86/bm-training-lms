import { useState, useReducer, useEffect } from "react";
import { B } from "../data/brand";
import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";
import { DATA } from "../data/cards";
import { initState, red, Ctx } from "../state";
import StoryCard from "./StoryCard";
import ContentCard from "./ContentCard";
import QuizCard from "./QuizCard";
import MatchingCard from "./MatchingCard";
import ScenarioCard from "./ScenarioCard";
import AssessmentCard from "./AssessmentCard";
import CompletionCard from "./CompletionCard";
import GlossaryDrawer from "./GlossaryDrawer";

export default function Module2({ learner, moduleStartedAt, onHome }) {
  const [s, d] = useReducer(red, initState);
  const [glossOpen, setGlossOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const toggleReviewMode = () => setReviewMode(v => !v);

  useEffect(() => { window.scrollTo({top:0, behavior:"smooth"}); }, [s.cur]);

  const cards = DATA.cards;
  const card = cards[s.cur];
  const pct  = (s.cur / (cards.length - 1)) * 100;

  let C;
  switch (card.type) {
    case "story":      C = <StoryCard data={card.data}/>; break;
    case "content":    C = <ContentCard data={card.data}/>; break;
    case "quiz":       C = <QuizCard data={card.data} cardId={card.id} cardIndex={s.cur}/>; break;
    case "matching":   C = <MatchingCard data={card.data} cardId={card.id}/>; break;
    case "scenario":   C = <ScenarioCard data={card.data} cardId={card.id}/>; break;
    case "assessment": C = <AssessmentCard data={card.data} cardId={card.id}/>; break;
    case "completion": C = <CompletionCard/>; break;
    default:           C = null;
  }

  return (
    <Ctx.Provider value={{s, d, learner, moduleStartedAt, cards, moduleId:"module-2-foundational-concepts", moduleTitle:"Module 2: Foundational Concepts", reviewMode, toggleReviewMode}}>
      <div className="min-h-screen bg-brand-cream">

        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-brand-sand">
          <div className="h-full transition-all duration-500 bg-brand-blue" style={{width:`${pct}%`}} /* dynamic: computed progress width *//>
        </div>

        {/* Top nav */}
        <div className="fixed top-1 left-0 right-0 z-40 flex items-center justify-between px-5 py-2 bg-brand-hdr shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-4">
            <button onClick={onHome} className="bg-white rounded px-2 py-1 inline-flex items-center border-none cursor-pointer">
              <img src={bmLogo} alt="B&M" className="h-8"/>
            </button>
            <div className="w-px h-5 bg-white/15"/>
            <span className="text-xs text-white/50">Module 2: Foundational Concepts</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={()=>setGlossOpen(true)}
              className="flex items-center gap-1.5 px-3 py-[5px] bg-white/[0.08] border border-white/15 rounded-md cursor-pointer text-white/70 text-xs font-semibold">
              <span className="text-sm">📖</span> Glossary
            </button>
            <button onClick={toggleReviewMode}
              className="flex items-center gap-1.5 px-3 py-[5px] rounded-md cursor-pointer text-xs font-semibold transition-all duration-150"
              style={reviewMode
                ? {background:B.blue, color:"white", border:"1.5px solid "+B.blue}
                : {background:"transparent", color:"rgba(255,255,255,0.6)", border:"1.5px solid rgba(255,255,255,0.25)"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {reviewMode ? "Reviewing" : "Review Mode"}
            </button>
            {learner && <span className="text-xs text-white/35">{learner.name}</span>}
            <span className="text-xs text-white/40">Section {s.cur+1} of {cards.length}</span>
          </div>
        </div>

        {/* Review mode banner */}
        {reviewMode && (
          <div className="fixed left-0 right-0 z-40 flex items-center justify-center h-8 text-xs font-semibold" style={{top:52, background:"#dbeeff", color:"#1a6fa0", borderBottom:"1px solid #a8d4f5"}}>
            Review mode — all sections unlocked, questions skippable
          </div>
        )}

        <div className="flex" style={{marginTop: reviewMode ? 84 : 52}} /* dynamic: offset for fixed nav + optional banner */>

          {/* Sidebar */}
          <div className="fixed bottom-0 left-0 overflow-y-auto z-30 py-5 w-60 bg-brand-side" style={{top: reviewMode ? 84 : 56}} /* dynamic: shift down in review mode */>
            <div className="px-5 mb-3 text-xs font-bold tracking-widest text-white/25">SECTIONS</div>
            {cards.map((c, i) => {
              const act  = i === s.cur;
              const comp = s.done.has(i);
              const unlk = s.open.has(i) || reviewMode;
              return (
                <div key={c.id}
                  onClick={()=>(unlk||comp)&&d({t:"GO",i})}
                  className="flex items-start gap-3 px-5 py-2"
                  style={{
                    borderLeft: `3px solid ${act ? B.blue : "transparent"}`,
                    background: act ? "rgba(255,255,255,0.06)" : "transparent",
                    opacity: unlk || comp ? 1 : 0.3,
                    cursor: unlk || comp ? "pointer" : "default",
                  }} /* dynamic: active/completed/locked sidebar-item state */>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5 text-[9px]"
                    style={{
                      border: `2px solid ${comp ? B.ok : act ? B.blue : "rgba(255,255,255,0.2)"}`,
                      background: comp ? B.ok : "transparent",
                      color: comp ? "white" : act ? B.blue : "rgba(255,255,255,0.35)",
                    }} /* dynamic: sidebar circle depends on active/completed state */>
                    {comp ? "✓" : i+1}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs" style={{color: act ? "white" : "rgba(255,255,255,0.55)"}} /* dynamic: active-state text color */>{c.nav}</span>
                    {reviewMode && act && <span className="text-[9px] font-bold px-1 rounded shrink-0" style={{background:"rgba(0,155,223,0.3)", color:B.blue}}>Review</span>}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Main content */}
          <div className="flex-1 py-8 px-10 ml-60 max-w-[840px]">{C}</div>
        </div>

        <GlossaryDrawer open={glossOpen} onClose={()=>setGlossOpen(false)}/>
      </div>
    </Ctx.Provider>
  );
}
