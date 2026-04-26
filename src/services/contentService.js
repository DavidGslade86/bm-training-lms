// ═══════════════════════════════════════════════════════
//  contentService — single source of truth for reading
//  training content (modules, journeys, glossary).
//
//  Today: resolves from local data files.
//  Later: delegates to the backend API when VITE_API_URL is set.
//
//  All functions are async and return promises so the switch
//  from local data to real API calls requires no changes to
//  calling code.
//
//  Components should NEVER import from src/data/moduleXData.js
//  directly after this refactor — go through this module.
// ═══════════════════════════════════════════════════════

import { GLOSSARY } from "../data/glossary";
import { JOURNEYS } from "../data/journeys";
import { SALESFORCE_BASICS } from "../data/salesforceBasicsData";
import { API_ENABLED, apiGet, apiPost } from "./api";

// ── Module lookup map ──────────────────────────────────
// Each standard module entry is a factory function that returns a
// dynamic import so Vite/Rollup can code-split the module data into
// separate on-demand chunks. A learner who never opens Module 4 never
// downloads module4Data.js. The bespoke sentinel is a plain object
// (no card data to split).
const MODULE_MAP = {
  "module-2":            () => import("../data/module2Data").then(m => m.MODULE2),
  "module-3":            () => import("../data/module3Data").then(m => m.MODULE3),
  "module-4":            () => import("../data/module4Data").then(m => m.MODULE4),
  "module-5":            () => import("../data/module5Data").then(m => m.MODULE5),
  "module-6":            () => import("../data/module6Data").then(m => m.MODULE6),
  "new-hire-assessment": () => import("../data/newHireAssessmentData").then(m => m.NEW_HIRE_ASSESSMENT),
  // Bespoke modules — no card data, but registered here so getModule()
  // resolves without throwing. Callers can check data.bespoke === true
  // to know not to expect a cards array.
  "salesforce-basics":   { bespoke: true, cards: [] },
};

// ── Module metadata ────────────────────────────────────
// Lightweight per-module entries used by home screens and
// nav rails. Kept separate from full module data so listing
// calls don't have to pull card content.
const MODULE_METADATA = [
  {
    id: "module-2",
    number: "Module 2",
    title: "Foundational Concepts",
    description:
      "The two federal programs, qualified illnesses, timing rules, and proof of presence.",
    time: "~45 min",
    status: "available",
  },
  {
    id: "module-3",
    number: "Module 3",
    title: "From Sign-Up to Submitted",
    description:
      "The intake process, authorization documents, document integrity, and WTCHP enrollment.",
    time: "~40 min",
    status: "available",
  },
  {
    id: "module-4",
    number: "Module 4",
    title: "Proof of Presence: Building the Case",
    description:
      "Sufficient vs. non-sufficient primary evidence, EVLs, TPVs, witness rules, and how to build a POP package.",
    time: "~45 min",
    status: "available",
  },
  {
    id: "module-5",
    number: "Module 5",
    title: "From Certification to Close",
    description:
      "The claim lifecycle from the Eligibility Ready Note through the Loss Calculation Letter and award review.",
    time: "~40 min",
    status: "available",
  },
  {
    id: "module-6",
    number: "Module 6",
    title: "Complex Cases",
    description:
      "FA claims, the Private Physician Process, and the Expedite pathway.",
    time: "~35 min",
    status: "available",
  },
  {
    id:          SALESFORCE_BASICS.id,
    number:      SALESFORCE_BASICS.number,
    title:       SALESFORCE_BASICS.title,
    description: SALESFORCE_BASICS.description,
    time:        SALESFORCE_BASICS.time,
    status:      "available",
  },
];

// ═══════════════════════════════════════════════════════
//  Public API — all functions return promises
// ═══════════════════════════════════════════════════════

// ── In-flight request cache ────────────────────────────
// getJourneys() and getAllModules() get called 2-3 times on a single
// CompletionCard render (HomePage → JourneyView → getNextStep →
// getParentJourneyId, each pulling the full journey list). We stash
// the in-flight promise so concurrent callers share one resolution
// instead of hammering either the local import or the backend.
//
// The cache is intentionally simple: stores the Promise (not the
// resolved value), so the API-branch fetch + local-data branch
// behave identically. Busted by resetContentCache() for tests.
let journeysPromise = null;
let modulesPromise = null;

export function resetContentCache() {
  journeysPromise = null;
  modulesPromise = null;
}

/**
 * Return all journey definitions.
 * Today: loads from src/data/journeys.js.
 * Later: GET /api/journeys
 */
export async function getJourneys() {
  if (!journeysPromise) {
    journeysPromise = API_ENABLED
      ? apiGet("/api/journeys").catch((err) => {
          journeysPromise = null;
          throw err;
        })
      : Promise.resolve(JOURNEYS);
  }
  return journeysPromise;
}

/**
 * Return a single module's full data object.
 * Today: returns from the appropriate moduleXData.js file via MODULE_MAP.
 * Later: GET /api/modules/:id
 */
export async function getModule(moduleId) {
  if (API_ENABLED) return apiGet(`/api/modules/${moduleId}`);

  const entry = MODULE_MAP[moduleId];
  if (entry === undefined) {
    throw new Error(`Unknown module id: ${moduleId}`);
  }
  // Standard modules are factory functions (dynamic imports).
  // The bespoke sentinel is a plain object — return it directly.
  return typeof entry === "function" ? entry() : entry;
}

/**
 * Return all module metadata (id, title, description, time, status).
 * No card content — just the listing.
 * Today: static MODULE_METADATA array.
 * Later: GET /api/modules
 */
export async function getAllModules() {
  if (!modulesPromise) {
    modulesPromise = API_ENABLED
      ? apiGet("/api/modules").catch((err) => {
          modulesPromise = null;
          throw err;
        })
      : Promise.resolve(MODULE_METADATA);
  }
  return modulesPromise;
}

/**
 * Return the full glossary array.
 * Today: from glossary.js.
 * Later: GET /api/glossary
 */
export async function getGlossary() {
  if (API_ENABLED) return apiGet("/api/glossary");
  return GLOSSARY;
}

/**
 * Match a module id against a journey entry, tolerating the long/short
 * id mismatch. Journey entries use the canonical short id (e.g.
 * "module-2"), but CompletionCard and the in-module Ctx use the long
 * slug (e.g. "module-2-foundational-concepts"). We accept either form.
 *
 * This is the same bridge `JourneyView.isModuleComplete` applies when
 * looking up completion records.
 */
function moduleIdMatches(journeyEntryId, incomingId) {
  if (!journeyEntryId || !incomingId) return false;
  if (journeyEntryId === incomingId) return true;
  return incomingId.startsWith(journeyEntryId + "-");
}

/**
 * Find the id of the first journey that contains the given module.
 * Used by module headers to build a "Back to Learning Journey" link
 * that returns the learner to the journey they came from. Falls back
 * to null if no journey references the module (e.g. a learner landed
 * on the module via the "Browse all modules" catalog).
 *
 * Today: scans the in-memory JOURNEYS array.
 * Later: could be a GET /api/modules/:id/parent-journey endpoint, but
 *        cheap enough client-side that it's not worth a round trip.
 */
export async function getParentJourneyId(moduleId) {
  const journeys = await getJourneys();
  const parent = journeys?.find((j) =>
    j.modules?.some((m) => moduleIdMatches(m.id, moduleId))
  );
  return parent?.id || null;
}

/**
 * Figure out what comes after the given module inside its parent journey.
 *
 * Returns one of:
 *   { kind: "module",     path, label, journeyId }  — another module follows
 *   { kind: "assessment", path, label, journeyId }  — this was the last
 *                                                     module and the
 *                                                     journey has a capstone
 *   { kind: "journey",    path, label, journeyId }  — last module, no
 *                                                     capstone; link back
 *                                                     to the journey landing
 *   null                                             — module is not part
 *                                                     of any journey (e.g.
 *                                                     reached via the global
 *                                                     module catalog)
 *
 * The `label` is shaped for the "next step" button on CompletionCard — e.g.
 * "Next: Module 3 — From Sign-Up to Submitted" or "Begin Capstone Assessment".
 */
/**
 * Read the admin edit overrides for a module. Returns an object
 * shaped `{ [cardId]: { [field]: newValue } }` (empty object when
 * no overrides are present). Admin-only content today, gated by
 * VITE_ADMIN_PASSWORD in HomePage.
 *
 * Today: reads `bm-lms-edits-<moduleId>` from localStorage.
 * Later: GET /api/modules/:id/edits
 */
export async function getModuleEdits(moduleId) {
  if (API_ENABLED) {
    try {
      return await apiGet(`/api/modules/${encodeURIComponent(moduleId)}/edits`);
    } catch {
      return {};
    }
  }
  try {
    return JSON.parse(localStorage.getItem(`bm-lms-edits-${moduleId}`) || "{}");
  } catch {
    return {};
  }
}

/**
 * Clear all admin edit overrides for a module. The future backend
 * call would be an admin-only DELETE; for now it just drops the
 * localStorage key so `useEditableContent` falls back to canonical
 * module data on the next load.
 *
 * Today: removes `bm-lms-edits-<moduleId>` from localStorage.
 * Later: DELETE /api/modules/:id/edits
 */
export async function clearModuleEdits(moduleId) {
  if (API_ENABLED) {
    try {
      await apiPost(`/api/modules/${encodeURIComponent(moduleId)}/edits/clear`, {});
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  try {
    localStorage.removeItem(`bm-lms-edits-${moduleId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getNextStep(moduleId) {
  const journeys = await getJourneys();
  const journey = journeys?.find((j) =>
    j.modules?.some((m) => moduleIdMatches(m.id, moduleId))
  );
  if (!journey) return null;

  const idx = journey.modules.findIndex((m) => moduleIdMatches(m.id, moduleId));
  const next = journey.modules[idx + 1];

  // Another module follows — deep-link straight to it.
  if (next) {
    const allModules = await getAllModules();
    const meta = allModules.find((m) => m.id === next.id);
    const label = meta
      ? `Next: ${meta.number} — ${meta.title}`
      : "Next module";
    return {
      kind: "module",
      path: `/modules/${next.id}`,
      label,
      journeyId: journey.id,
    };
  }

  // Last module — offer the capstone if the journey has one.
  if (journey.assessment) {
    return {
      kind: "assessment",
      path: `/journeys/${journey.id}/assessment`,
      label: "Begin Capstone Assessment",
      journeyId: journey.id,
    };
  }

  // Last module and no capstone — send them back to the journey page.
  return {
    kind: "journey",
    path: `/journeys/${journey.id}`,
    label: "Back to Learning Journey",
    journeyId: journey.id,
  };
}
