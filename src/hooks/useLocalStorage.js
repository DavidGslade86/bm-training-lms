// ═══════════════════════════════════════════════════════
//  localStorage utilities for learner progress persistence
//  Key namespace: bm-lms-*  (does NOT collide with
//  edit-mode keys: bm-lms-edits-*)
// ═══════════════════════════════════════════════════════

const PREFIX = "bm-lms";

/** Storage key generators */
export const KEYS = {
  session:    ()                 => `${PREFIX}-session`,
  module:     (moduleKey, email) => `${PREFIX}-progress-${moduleKey}-${email}`,
  assessment: (email)            => `${PREFIX}-final-assessment-${email}`,
};

/**
 * Serialize reducer state for JSON storage.
 * Converts Set instances to plain arrays.
 */
export function serializeState(state) {
  const out = {};
  for (const [k, v] of Object.entries(state)) {
    out[k] = v instanceof Set ? [...v] : v;
  }
  return out;
}

/**
 * Deserialize stored JSON back into reducer state.
 * Uses `template` (initState) to know which fields should be Sets
 * and to provide defaults for any keys missing from stored data
 * (forward-compatible with new fields added to initState).
 */
export function deserializeState(raw, template) {
  const out = {};
  for (const [k, v] of Object.entries(template)) {
    if (!(k in raw)) {
      // Key missing from stored data — use template default
      out[k] = v instanceof Set ? new Set(v) : v;
    } else {
      // Key present — restore type from template
      out[k] = v instanceof Set ? new Set(raw[k]) : raw[k];
    }
  }
  return out;
}
