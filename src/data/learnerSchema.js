// ═══════════════════════════════════════════════════════
//  PAYLOAD SCHEMA — source of truth for completion data
//  Used by: CompletionCard POST, Power Automate flow,
//           master Excel column headers
// ═══════════════════════════════════════════════════════

export const PAYLOAD_SCHEMA = {
  userId: {
    type: "string",
    desc: "Learner work email (from registration form)",
    example: "jane@barashmcgarry.com",
  },
  displayName: {
    type: "string",
    desc: "Full name from registration form",
    example: "Jane Smith",
  },
  role: {
    type: "string",
    desc: "Role / department selected at registration",
    example: "CA I — Health Program",
  },
  moduleId: {
    type: "string",
    desc: "Kebab-case module identifier (stable across versions)",
    example: "module-2-foundational-concepts",
  },
  moduleTitle: {
    type: "string",
    desc: "Human-readable module title",
    example: "Module 2: Foundational Concepts",
  },
  completedAt: {
    type: "string (ISO 8601)",
    desc: "Timestamp when the learner reached the completion card",
    example: "2026-03-16T14:32:07.123Z",
  },
  timeOnTaskSec: {
    type: "number",
    desc: "Elapsed seconds from registration submit to module completion",
    example: 1845,
  },
  assessScore: {
    type: "number",
    desc: "Final assessment questions answered correctly on first attempt",
    example: 4,
  },
  assessTotal: {
    type: "number",
    desc: "Total number of final assessment questions",
    example: 5,
  },
  assessFirstPct: {
    type: "number",
    desc: "First-attempt correct percentage (0–100, rounded)",
    example: 80,
  },
  assessDetails: {
    type: "string",
    desc: "Pipe-delimited per-question attempt counts (e.g. Q1:1att|Q2:2att|Q3:1att)",
    example: "Q1:1att|Q2:2att|Q3:1att|Q4:1att|Q5:3att",
  },
  quizReviews: {
    type: "number",
    desc: "Number of knowledge-check questions answered incorrectly (triggered review)",
    example: 1,
  },
  matchErrors: {
    type: "number",
    desc: "Total incorrect matching attempts across all matching exercises",
    example: 3,
  },
  scenarioErrors: {
    type: "number",
    desc: "Total incorrect scenario picks across all scenario steps",
    example: 2,
  },
};
