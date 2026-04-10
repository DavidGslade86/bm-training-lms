// ═══════════════════════════════════════════════════════
//  journeys.js — learning journey definitions
//
//  Each journey is a curated sequence of modules aimed
//  at a specific role or learning goal. Components should
//  NOT import this file directly — go through
//  contentService.getJourneys().
// ═══════════════════════════════════════════════════════

export const JOURNEYS = [
  {
    id: "new-hire",
    title: "New Hire Pathway",
    description:
      "The complete foundation for all B&M staff \u2014 VCF and WTCHP fundamentals, the intake process, proof of presence, the claim lifecycle, and complex cases.",
    icon: "BookOpen",
    type: "core",
    estimatedTime: "~4 hrs 15 min",
    completionLabel: "BM VCF/WTCHP Fundamentals",
    color: "#009bdf",
    modules: [
      { id: "module-2", required: true },
      { id: "module-3", required: true },
      { id: "module-4", required: true },
      { id: "module-5", required: true },
      { id: "module-6", required: true },
    ],
    assessment: "final-assessment",
  },
  {
    id: "ca-i-track",
    title: "Client Advocate I Track",
    description:
      "Role-specific training for Client Advocate I \u2014 WTCHP enrollment, HP POP collection, medical records, and client communication.",
    icon: "UserCheck",
    type: "role",
    estimatedTime: "Coming soon",
    color: "#3d7a56",
    modules: [],
    comingSoon: true,
  },
  {
    id: "ca-ii-track",
    title: "Client Advocate II Track",
    description:
      "Role-specific training for Client Advocate II \u2014 full POP collection, claim submission, ER Notes, and FA claims.",
    icon: "ClipboardList",
    type: "role",
    estimatedTime: "Coming soon",
    color: "#6b4fa0",
    modules: [],
    comingSoon: true,
  },
  {
    id: "tech-stack",
    title: "Tech Stack",
    description:
      "AI prompting, Salesforce, UAT testing, and PMO fundamentals \u2014 available to all staff.",
    icon: "Cpu",
    type: "tech",
    estimatedTime: "Coming soon",
    color: "#63656a",
    modules: [],
    comingSoon: true,
  },
  {
    id: "microlearning",
    title: "Microlearning",
    description:
      "Short standalone refreshers on specific topics \u2014 5 to 15 minutes each.",
    icon: "Zap",
    type: "micro",
    estimatedTime: "Coming soon",
    color: "#9a6b1a",
    modules: [],
    comingSoon: true,
  },
];
