// ═══════════════════════════════════════════════════════
//  usePersistedReducer — drop-in replacement for useReducer
//  that saves state to localStorage after every change.
//  Handles Set serialization via useLocalStorage helpers.
// ═══════════════════════════════════════════════════════
import { useReducer, useEffect, useRef } from "react";
import { serializeState, deserializeState } from "./useLocalStorage";

/**
 * @param {Function} reducer   — the reducer function (same as useReducer)
 * @param {Object}   initial   — the initial state template (initState from state.js)
 * @param {string}   storageKey — localStorage key for this module + learner
 * @returns {[Object, Function]} — [state, dispatch], same shape as useReducer
 */
export function usePersistedReducer(reducer, initial, storageKey) {
  const [state, dispatch] = useReducer(reducer, storageKey, (key) => {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      return raw ? deserializeState(raw, initial) : initial;
    } catch {
      return initial;
    }
  });

  // Debounced write to localStorage (300ms)
  const timer = useRef(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(serializeState(state)));
      } catch {
        // Storage full or unavailable — silently fail
      }
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [state, storageKey]);

  return [state, dispatch];
}
