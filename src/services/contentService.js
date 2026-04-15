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

import { MODULE2 } from "../data/module2Data";
import { MODULE3 } from "../data/module3Data";
import { MODULE4 } from "../data/module4Data";
import { MODULE5 } from "../data/module5Data";
import { MODULE6 } from "../data/module6Data";
import { NEW_HIRE_ASSESSMENT } from "../data/newHireAssessmentData";
import { GLOSSARY } from "../data/glossary";
import { JOURNEYS } from "../data/journeys";
import { API_ENABLED, apiGet } from "./api";

// ── Module lookup map ──────────────────────────────────
// Maps the canonical module id to its imported data object.
const MODULE_MAP = {
  "module-2":            MODULE2,
  "module-3":            MODULE3,
  "module-4":            MODULE4,
  "module-5":            MODULE5,
  "module-6":            MODULE6,
  "new-hire-assessment": NEW_HIRE_ASSESSMENT,
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
];

// ═══════════════════════════════════════════════════════
//  Public API — all functions return promises
// ═══════════════════════════════════════════════════════

/**
 * Return all journey definitions.
 * Today: loads from src/data/journeys.js.
 * Later: GET /api/journeys
 */
export async function getJourneys() {
  if (API_ENABLED) return apiGet("/api/journeys");
  return JOURNEYS;
}

/**
 * Return a single module's full data object.
 * Today: returns from the appropriate moduleXData.js file via MODULE_MAP.
 * Later: GET /api/modules/:id
 */
export async function getModule(moduleId) {
  if (API_ENABLED) return apiGet(`/api/modules/${moduleId}`);

  const data = MODULE_MAP[moduleId];
  if (!data) {
    throw new Error(`Unknown module id: ${moduleId}`);
  }
  return data;
}

/**
 * Return all module metadata (id, title, description, time, status).
 * No card content — just the listing.
 * Today: static MODULE_METADATA array.
 * Later: GET /api/modules
 */
export async function getAllModules() {
  if (API_ENABLED) return apiGet("/api/modules");
  return MODULE_METADATA;
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
    j.modules?.some((m) => m.id === moduleId)
  );
  return parent?.id || null;
}
