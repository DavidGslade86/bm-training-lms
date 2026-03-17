import { createContext } from "react";

// ═══════════════════════════════════════════════════════
//  STATE — initial state, reducer, context
// ═══════════════════════════════════════════════════════
export const initState = {
  cur: 0,
  done: new Set(),
  open: new Set([0]),
  qa: {},
  qAttempts: {},
  errorLog: [],
  matchErrors: {},
  scenProg: {},
  scenAns: {},
  scenErrors: {},
  assessAns: {},
  assessScore: 0,
  assessTries: {},
  matchDone: {},
  matchPairs: {},
  qReviewed: {},
};

export function red(s, a) {
  switch (a.t) {
    case "GO":
      return { ...s, cur: a.i, open: new Set([...s.open, a.i]) };
    case "DONE": {
      const d = new Set([...s.done, a.i]);
      const o = new Set([...s.open]);
      if (a.total && a.i + 1 < a.total) o.add(a.i + 1);
      return { ...s, done: d, open: o };
    }
    case "QUIZ":
      return { ...s, qa: { ...s.qa, [a.id]: a.a }, qAttempts: { ...s.qAttempts, [a.id]: (s.qAttempts[a.id] || 0) + 1 } };
    case "QUIZ_REVIEW":
      return { ...s, qa: { ...s.qa, [a.id]: undefined }, qReviewed: { ...s.qReviewed, [a.id]: true } };
    case "LOG_ERROR":
      return { ...s, errorLog: [...s.errorLog, { cardId: a.id, attempt: a.attempt, ts: Date.now() }] };
    case "SCEN":
      return { ...s, scenProg: { ...s.scenProg, [a.id]: (s.scenProg[a.id] || 0) + 1 } };
    case "SCEN_ANS": {
      const key = a.id;
      const prev = s.scenAns[key] || {};
      return { ...s, scenAns: { ...s.scenAns, [key]: { ...prev, [a.step]: a.ans } } };
    }
    case "ASSES": {
      const tries = (s.assessTries[a.qi] || 0) + 1;
      const newTries = { ...s.assessTries, [a.qi]: tries };
      if (a.ok) {
        const firstTry = tries === 1;
        return { ...s, assessAns: { ...s.assessAns, [a.qi]: a.a }, assessScore: s.assessScore + (firstTry ? 1 : 0), assessTries: newTries };
      }
      return { ...s, assessTries: newTries };
    }
    case "MATCH":
      return { ...s, matchDone: { ...s.matchDone, [a.id]: true } };
    case "MATCH_PAIR": {
      const key = a.id;
      const prev = s.matchPairs[key] || {};
      return { ...s, matchPairs: { ...s.matchPairs, [key]: { ...prev, [a.idx]: a.right } } };
    }
    case "MATCH_ERR": {
      const key = a.id;
      const prev = s.matchErrors[key] || [];
      return { ...s, matchErrors: { ...s.matchErrors, [key]: [...prev, { left: a.left, right: a.right, ts: Date.now() }] } };
    }
    case "LOG_SCEN_ERR": {
      const prev = s.scenErrors[a.cardId] || {};
      return { ...s, scenErrors: { ...s.scenErrors, [a.cardId]: { ...prev, [a.step]: (prev[a.step] || 0) + 1 } } };
    }
    default:
      return s;
  }
}

export const Ctx = createContext();
