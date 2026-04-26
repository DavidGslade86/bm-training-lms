// ═══════════════════════════════════════════════════════
//  salesforceBasicsData — identity/metadata layer for the
//  Salesforce Basics bespoke module.
//
//  This is NOT a standard module data file (no cards array).
//  It follows the bespoke registration pattern in §9 of
//  LMS_Module_Format_Spec.md: the simulation UI lives in
//  SalesforceBasicsModule.jsx and its sub-components; this
//  file only owns the identity, section manifest, and
//  completion recap text so those strings have a single
//  source of truth and aren't scattered across JSX.
// ═══════════════════════════════════════════════════════

export const SALESFORCE_BASICS = {
  id:          "salesforce-basics",
  title:       "Salesforce Basics",
  number:      "Salesforce Basics",     // matches MODULE_METADATA.number in contentService.js
  description: "How the Salesforce data model is organized (objects, fields, records, relationships) and how to build reports from business questions.",
  time:        "~30 min",
  bespoke:     true,

  // Learning objectives — shown in a future intro card and used as a
  // reference by content authors; not yet rendered by the component.
  objectives: [
    "Understand how Salesforce objects, fields, and records fit together",
    "Preview available fields in the Create Report picker and the report Builder",
    "Choose the right report type: single-object vs. combined (cross-object)",
    "Add filters, scope with Show Me, and group rows with Summary reports",
    "Recognize when to use Show Me = \"My Accounts\" vs. Account Type / Record Type filters",
  ],

  // Ordered section manifest. The component uses this for the sidebar,
  // unlock gates, and completion payload — any section-level change
  // (title, order, adding a new exercise) happens here, not in the JSX.
  sections: [
    {
      id:       "data-model",
      nav:      "Data Model",
      kind:     "themed",
      title:    "Objects: Containers for Data",
      subtitle: "Part 1 — how Salesforce organizes data",
    },
    { id: "ex-1",     nav: "Exercise 1", kind: "exercise",   exerciseId: 1, title: "Single Object Report" },
    { id: "ex-2",     nav: "Exercise 2", kind: "exercise",   exerciseId: 2, title: "Cross-Object Report" },
    { id: "ex-3",     nav: "Exercise 3", kind: "exercise",   exerciseId: 3, title: "Refining with Show Me and Grouping" },
    { id: "complete", nav: "Complete",   kind: "completion",                title: "Module Complete" },
  ],

  // Bullet points shown in the CompletionPanel "WHAT YOU COVERED" recap.
  // Kept here so they can also populate a future module-intro overview
  // without duplicating the strings.
  coverageBullets: [
    "How Salesforce objects, fields, and records fit together",
    "Previewing available fields in the Create Report picker and the Builder",
    "Picking a report type: single-object vs. combined report types",
    "Adding filters, scoping with Show Me, and grouping with Summary reports",
    "When to use Show Me = \"My Accounts\" and when account type / record type matter",
  ],
};
