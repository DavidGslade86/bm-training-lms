import { useState, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════
//  useEditableContent
//  Manages localStorage-persisted content edits for a module.
//  Merges edits onto originalCards and exposes updateCard / resetModule.
//
//  WARNING: This hook uses VITE_ADMIN_PASSWORD for client-side gating
//  only. Do not store sensitive data through this mechanism — it is
//  intended solely to protect against accidental editing, not against
//  a determined adversary who can inspect network traffic or JS bundles.
// ═══════════════════════════════════════════════════════

// Deep-set a value at a dot-separated path (supports numeric array indices)
function deepSet(obj, path, value) {
  const cloned = JSON.parse(JSON.stringify(obj));
  const keys = path.split(".");
  let cur = cloned;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = /^\d+$/.test(keys[i]) ? Number(keys[i]) : keys[i];
    cur = cur[k];
  }
  const last = /^\d+$/.test(keys[keys.length - 1])
    ? Number(keys[keys.length - 1])
    : keys[keys.length - 1];
  cur[last] = value;
  return cloned;
}

/**
 * @param {string} moduleId  - e.g. "module-2" or "module-3"
 * @param {Array}  originalCards - the source-of-truth cards array from the data file
 * @returns {{ cards, updateCard, resetModule, hasEdits, editCount }}
 */
export function useEditableContent(moduleId, originalCards) {
  const storageKey = `bm-lms-edits-${moduleId}`;

  // edits shape: { [cardId]: { [dotPath]: newValue } }
  const [edits, setEdits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  });

  // Persist to localStorage whenever edits change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(edits));
  }, [edits, storageKey]);

  const editCount = Object.values(edits).reduce(
    (n, cardEdits) => n + Object.keys(cardEdits).length,
    0
  );
  const hasEdits = editCount > 0;

  // Apply stored edits on top of the original cards
  const cards = originalCards.map((card) => {
    const cardEdits = edits[card.id];
    if (!cardEdits || Object.keys(cardEdits).length === 0) return card;
    let result = card;
    for (const [path, value] of Object.entries(cardEdits)) {
      result = deepSet(result, path, value);
    }
    return result;
  });

  const updateCard = useCallback((cardId, path, value) => {
    setEdits((prev) => ({
      ...prev,
      [cardId]: { ...(prev[cardId] || {}), [path]: value },
    }));
  }, []);

  const resetModule = useCallback(() => {
    setEdits({});
  }, []);

  return { cards, updateCard, resetModule, hasEdits, editCount };
}
