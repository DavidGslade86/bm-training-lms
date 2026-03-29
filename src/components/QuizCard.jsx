import { useContext, useState } from "react";
import { B } from "../data/brand";
import { Ctx } from "../state";
import { Nav } from "./Shared";
import { GT } from "./Glossary";

export default function QuizCard({ data, cardId }) {
  const {s, d, reviewMode} = useContext(Ctx);
  const [showAnswer, setShowAnswer] = useState(false);
  const attempts = s.qAttempts[cardId] || 0;
  const answered = s.qa[cardId] !== undefined;
  // Once learner has clicked "Review Section", card stays in retry mode permanently
  const isRetry = !!s.qReviewed[cardId];
  const L = ["A","B","C","D"];

  const q    = isRetry && data.retryQuestion  ? data.retryQuestion  : data.question;
  const opts = isRetry && data.retryOptions   ? data.retryOptions   : data.options;
  const ci   = isRetry && data.retryCorrectIndex !== undefined ? data.retryCorrectIndex : data.correctIndex;
  const fbOk = isRetry ? (data.retryFeedbackCorrect   || data.feedbackCorrect)   : data.feedbackCorrect;
  const fbNo = isRetry ? (data.retryFeedbackIncorrect || data.feedbackIncorrect) : data.feedbackIncorrect;

  const ans = s.qa[cardId];
  const correct = ans === ci;

  const handleAnswer = (oi) => {
    if (answered || reviewMode) return;
    const isCorrect = oi === ci;
    d({t:"QUIZ", id:cardId, a:oi});
    if (!isCorrect) d({t:"LOG_ERROR", id:cardId, attempt:attempts+1});
  };

  const handleReview = () => {
    // Clear answer and mark card as reviewed so retry question shows on return
    d({t:"QUIZ_REVIEW", id:cardId});
    d({t:"GO", i:data.reviewCardIndex});
  };

  const showingAnswer   = ans !== undefined;
  const wrongAndCanReview = showingAnswer && !correct && attempts <= 1 && data.reviewCardIndex !== undefined;
  const wrongAndDone    = showingAnswer && !correct && (attempts > 1 || !data.reviewCardIndex);
  const canProceed      = (showingAnswer && correct) || wrongAndDone;

  // In review mode, treat showAnswer as if the correct answer is revealed
  const revealCorrect = reviewMode && showAnswer;

  return (
    <div>
      <div className="rounded-lg p-7 bg-brand-ww border border-brand-sand">
        <div className="text-xs font-bold tracking-widest mb-2 text-brand-blue">{data.label}{isRetry ? " — Try Again" : ""}</div>
        {data.context && !isRetry && <p className="text-sm mb-1 text-brand-tl">{data.context}</p>}
        <div className="text-lg font-bold mb-5 text-brand-gray-dk font-heading leading-snug"><GT t={q}/></div>

        <div className="flex flex-col gap-2">
          {opts.map((o, oi) => {
            /* dynamic: option border/bg/color depends on answer state */
            let st = {border:`1.5px solid ${B.sand}`,background:"white",color:B.tm};
            if (revealCorrect) {
              if (oi === ci) st = {border:`1.5px solid ${B.ok}`,background:B.okBg,color:"#2d5a3f"};
              else           st = {border:`1.5px solid ${B.sand}`,background:"#f7f5f0",color:"#aaa"};
            } else if (showingAnswer) {
              if (oi === ans && correct)        st = {border:`1.5px solid ${B.ok}`,background:B.okBg,color:"#2d5a3f"};
              else if (oi === ans)              st = {border:`1.5px solid ${B.err}`,background:B.errBg,color:"#7a2e2e"};
              else if (oi === ci && !correct)   st = {border:`1.5px solid ${B.ok}`,background:B.okBg,color:"#2d5a3f"};
            }
            /* dynamic: circle indicator colors depend on answer state */
            const revCircleOk = revealCorrect && oi === ci;
            const circleBd = revCircleOk ? B.ok : showingAnswer && oi === ans ? (correct ? B.ok : B.err) : "#ddd";
            const circleBg = revCircleOk ? B.ok : showingAnswer && oi === ans ? (correct ? B.ok : B.err) : "transparent";
            const circleColor = revCircleOk || (showingAnswer && oi === ans) ? "white" : "#999";
            return (
              <div key={oi} onClick={()=>handleAnswer(oi)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm"
                style={{...st,cursor:(showingAnswer||reviewMode)?"default":"pointer"}} /* dynamic: answer-state styling */>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{border:`1.5px solid ${circleBd}`,background:circleBg,color:circleColor}} /* dynamic: answer-state indicator */>
                  {L[oi]}
                </div>
                <span>{o}</span>
              </div>
            );
          })}
        </div>

        {revealCorrect && (
          <div className="rounded-md p-4 mt-4 text-sm bg-brand-ok-bg border border-[#b8d5c4] text-[#2d5a3f]"><GT t={fbOk}/></div>
        )}
        {!reviewMode && showingAnswer && correct && (
          <div className="rounded-md p-4 mt-4 text-sm bg-brand-ok-bg border border-[#b8d5c4] text-[#2d5a3f]"><GT t={fbOk}/></div>
        )}
        {!reviewMode && wrongAndCanReview && (
          <div className="rounded-md p-4 mt-4 text-sm bg-brand-err-bg border border-[#e4b8b8] text-[#7a2e2e]">
            <p className="mb-3"><GT t={data.feedbackIncorrect}/></p>
            <button onClick={handleReview} className="px-4 py-2 rounded text-sm font-semibold text-white bg-brand-blue">← Review Section</button>
          </div>
        )}
        {!reviewMode && wrongAndDone && (
          <div className="rounded-md p-4 mt-4 text-sm bg-brand-err-bg border border-[#e4b8b8] text-[#7a2e2e]"><GT t={fbNo}/></div>
        )}
        {reviewMode && !showAnswer && (
          <button onClick={()=>setShowAnswer(true)} className="mt-4 px-4 py-2 rounded text-sm font-semibold border-[1.5px]" style={{borderColor:B.blue, color:B.blue, background:B.blueLt}}>Show answer</button>
        )}
      </div>
      <Nav ok={canProceed}/>
    </div>
  );
}
