// ═══════════════════════════════════════════════════════
//  usePersistedReducer — drop-in replacement for useReducer
//  that saves state to localStorage after every change.
//  Handles Set serialization via useLocalStorage helpers.
// ═══════════════════════════════════════════════════════
import { useReducer, useEffect, useRef } from "react";
import { serializeState, deserializeState } from "./useLocalStorage";
import { STATE_VERSION } from "../state";

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
      if (!raw) return initial;

      // Version guard: if the stored blob was written by an older version
      // of the state shape, discard it and start fresh. This prevents
      // stale indexed data (e.g. reordered quiz items) from causing
      // runtime crashes. Bump STATE_VERSION in state.js whenever the
      // reducer shape changes in a way that makes old data incompatible.
      if (raw._v !== STATE_VERSION) {
        localStorage.removeItem(key);
        return initial;
      }

      return deserializeState(raw, initial);
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
        localStorage.setItem(
          storageKey,
          JSON.stringify({ ...serializeState(state), _v: STATE_VERSION })
        );
      } catch {
        // Storage full or unavailable — silently fail
      }
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [state, storageKey]);

  return [state, dispatch];
}
