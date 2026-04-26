# LMS Module Format Specification
**B&M Training LMS — Authoring Reference**
_Revision: 2026-04-25 (reviewed 2026-04-25)_

---

## Table of Contents

1. [Module Classification](#1-module-classification)
2. [Module Data Structure](#2-module-data-structure)
3. [Content Block Types](#3-content-block-types)
4. [Card Types](#4-card-types)
5. [Assessment Conventions](#5-assessment-conventions)
6. [File and Directory Conventions](#6-file-and-directory-conventions)
7. [Visual and Style Conventions](#7-visual-and-style-conventions)
8. [Minimal Worked Example](#8-minimal-worked-example)
9. [Bespoke Modules Inventory](#9-bespoke-modules-inventory)
10. [Known Inconsistencies](#10-known-inconsistencies)
11. [Out of Scope](#11-out-of-scope)

---

## 1. Module Classification

All modules in this LMS fall into one of two categories:

### Standard Modules
Data-driven. Content is defined entirely in a `src/data/moduleNData.js` file and rendered through the shared card-renderer pipeline (`ModuleDispatcher` → `ModuleN.jsx` → `StoryCard`, `ContentCard`, `QuizCard`, etc.). Authors produce a data artifact; a developer wires it into the codebase mechanically (one entry in `contentService.js` and one new `ModuleN.jsx` shell).

**Current standard modules:** Module 2, 3, 4, 5, 6 (all VCF/WTCHP content).

### Bespoke Modules
Hand-built with their own React state, layout, and theme. Not produced via the standard data format. These must be authored directly as React components.

**Current bespoke modules:** Salesforce Basics (`SalesforceBasicsModule.jsx` and its sub-components under `src/components/salesforce/`).

> **This spec covers Standard modules only.** For guidance on registering a new bespoke module in the codebase and the recommended construction pattern for future bespoke modules, see [§9 — Bespoke Modules Inventory](#9-bespoke-modules-inventory).

---

## 2. Module Data Structure

A standard module is a single named export from `src/data/moduleNData.js`:

```js
export const MODULE_N = {
  cards: [
    { id, nav, type, data },
    // ...
  ]
};
```

### Top-level fields

| Field | Type | Required | Description |
|---|---|---|---|
| `cards` | `Card[]` | ✓ | Ordered array of all cards in the module. Rendered in sequence. |

### Card shape

```js
{
  id:   string,    // kebab-case, unique within the module
  nav:  string,    // short label shown in the navigation/progress bar
  type: string,    // one of the card types listed in §4
  data: object     // card-type-specific payload (see §4)
}
```

### `id` conventions
- Kebab-case: `"meet-yajaira"`, `"two-programs"`, `"quiz-programs"`
- Must be unique within the module (used as localStorage key for completion state)
- By convention, quiz/matching cards are prefixed: `"quiz-"`, `"match-"`
- The completion card is typically `"complete-module-N"` or simply `"complete"`

---

## 3. Content Block Types

Content and story cards contain a `blocks` array. Each block has a `type` field. All block types are rendered by `<Blocks blocks={...} cardId={...} />` in `src/components/Shared.jsx`.

### Glossary integration

Glossary terms defined in `src/data/glossary.js` are **auto-linked** when their text appears in any `paragraph`, `subheading`, `callout`, `yajaira-check`, or `doc-cards` block. This is handled by the `<GT>` (glossary-aware text) renderer — authors do **not** need any special markup. Terms auto-highlight on render based on pattern-matching against the glossary. Bold markdown (`**term**`) is independent of glossary linking; a term can be both bolded and glossary-linked at the same time.

To suppress a false-positive link on a short abbreviation, the renderer has a hard-coded `STRICT_ABBRS` list for case-sensitive matches like "IS" and "IT". If a new module introduces an abbreviation that triggers false glossary hits, add it to that list in `src/components/Glossary.jsx`.

### 3.1 `paragraph`
Plain text paragraph with `**bold**` markdown support and automatic glossary-term linking.

```js
{ type: "paragraph", text: "The **WTCHP** only certifies illnesses linked to 9/11 toxin exposure." }
```

### 3.2 `subheading`
Section-level heading (`<h3>`) inside a content card. Appears large and bold. Accepts `**bold**` markdown.

```js
{ type: "subheading", text: "Minimum Latency & Maximum Time Interval" }
```

### 3.3 `callout`
Highlighted alert box. Two style variants:

| `style` | Background | Border | Use case |
|---|---|---|---|
| `"info"` (default) | Light blue | Blue | Tips, context, special rules |
| `"warn"` | Light amber | Amber | Warnings, internal-only info |

```js
{
  type: "callout",
  style: "warn",         // or "info" (default if omitted)
  icon: "⚠️",
  text: "**Tier designations are INTERNAL only.** Never discuss tiers with clients."
}
```

### 3.4 `yajaira-check`
Narrative aside with Yajaira's avatar. Used to tie abstract content back to the case study. Accepts `**bold**` markdown.

```js
{ type: "yajaira-check", text: "Breast cancer is a solid cancer — **Tier 1**. Yajaira's illness qualifies." }
```

### 3.5 `image`
Generic image block. Supports `src` (path or URL), optional `alt` and `caption`.

```js
{
  type: "image",
  src: "/src/assets/forms/retainer-1.png",   // or absolute https:// URL
  alt: "Retainer agreement — page 1",
  caption: "The B&M retainer agreement — page 1 of 2"   // optional
}
```

> **Note:** Paths like `/src/assets/...` are automatically rewritten to the public-folder equivalent by `resolveFormImage()`. Static assets referenced this way must be copied to `public/`.

### 3.6 `map-diagram`
Hardcoded map of the 9/11 Lower Manhattan exposure zones. No data fields required — the asset and legend are baked in.

```js
{ type: "map-diagram" }
```

### 3.7 `program-cards`
Side-by-side cards comparing two programs. Used for the WTCHP vs. VCF introduction.

```js
{
  type: "program-cards",
  cards: [
    {
      icon: "HP",
      iconBg: "#63656a",
      title: "World Trade Center Health Program",
      agency: "U.S. Dept. of Health & Human Services (CDC/NIOSH)",
      bullets: ["Confirms exposure to 9/11 toxins", "Certifies the claimant has a qualified illness"],
      accent: "#63656a"
    },
    {
      icon: "$",
      iconBg: "#009bdf",
      title: "Victim Compensation Fund",
      agency: "U.S. Dept. of Justice",
      bullets: ["Confirms presence in the VCF eligibility area", "Provides financial compensation"],
      accent: "#009bdf"
    }
  ]
}
```

### 3.8 `comparison-table`
Striped data table. Supports an optional `"pos-neg"` style that tints two data columns green/amber.

```js
{
  type: "comparison-table",
  style: "pos-neg",   // optional; omit for neutral grey headers
  headers: ["", "WTCHP", "VCF"],
  rows: [
    ["Administered by", "HHS (CDC/NIOSH)", "Department of Justice"],
    ["Purpose", "Healthcare & illness certification", "Financial compensation"]
  ]
}
```

- Column 0 is treated as the row-label column when `headers.length >= 3` (bold, cream background in pos-neg mode).
- In `"pos-neg"` mode: data column 1 = green (positive), data column 2 = amber (negative).

### 3.9 `tier-cards`
Grid of styled category cards. Renders in 2-column grid for 4 tiers, 3-column grid otherwise.

```js
{
  type: "tier-cards",
  tiers: [
    {
      name: "Solid & Blood Cancers",
      label: "Tier 1",
      color: "#009bdf",
      bg: "#e6f5fc",
      border: "#b3dcf2",
      items: ["64 solid cancers (incl. melanoma)", "Blood cancers"]
    }
    // ...
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `name` | string | Bold title |
| `label` | string | Subtitle (tier label, e.g. "Tier 1") |
| `color` | hex | Text color for name, label, and bullet dots |
| `bg` | hex | Card background |
| `border` | hex | Card border |
| `items` | string[] | Bullet list items (plain text) |

### 3.10 `latency-list`
Two-column list: time period on the left, description on the right. Used for latency periods and time intervals.

```js
{
  type: "latency-list",
  items: [
    { time: "~5 months", desc: "Blood cancers" },
    { time: "4 years",   desc: "Most solid cancers" }
  ]
}
```

### 3.11 `exposure-grid`
Side-by-side panel grid comparing exposure hour requirements across categories (e.g. Responders vs. Survivors).

```js
{
  type: "exposure-grid",
  groups: [
    {
      title: "Responders",
      rows: [
        { period: "9/11 – 9/14/01", hours: "4 hours" },
        { period: "9/11 – 9/30/01", hours: "24 hours" }
      ]
    },
    {
      title: "Survivors",
      rows: [
        { period: "9/11 – 1/10/02", hours: "4 days (>4 hrs each)" }
      ]
    }
  ]
}
```

### 3.12 `doc-cards`
Stack of document-description cards. Each card has a colored header, body paragraph, optional bullet notes, and an optional paginated form image viewer.

```js
{
  type: "doc-cards",
  cards: [
    {
      abbr: "AUTH",
      color: "#009bdf",
      desc: "The **Authorization form** allows B&M to access the claimant's records from WTCHP and VCF.",
      notes: [
        "Must be signed by the claimant (not a representative)",
        "Re-signed every 2 years"
      ],
      formImages: ["/src/assets/forms/auth-1.png", "/src/assets/forms/auth-2.png"]
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `abbr` | string | ✓ | Short label shown as badge (first 3 chars used as the badge text) |
| `color` | hex | ✓ | Badge background, border tint, and bullet color |
| `desc` | string | ✓ | Body paragraph (`**bold**` markdown and glossary linking supported) |
| `notes` | string[] | | Optional bullet list below the description |
| `formImages` | string[] | | Optional paginated form preview (array of image paths). **Use this field** — not `formImage`. |

### 3.13 `sufficiency-quiz`
Binary Sufficient / Not Sufficient interactive classifier. Each item shows a label and two buttons. After answering, feedback is revealed.

```js
{
  type: "sufficiency-quiz",
  items: [
    {
      label: "A co-worker's signed statement that the claimant worked on-site every day from 9/17/01.",
      sufficient: true,
      feedback: "An eyewitness statement from a co-worker is strong corroborating evidence."
    },
    {
      label: "A handwritten note the claimant wrote themselves.",
      sufficient: false,
      feedback: "Self-authored evidence alone is not sufficient — it needs corroboration."
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `items` | object[] | ✓ | Array of items to classify |
| `items[].label` | string | ✓ | The document or situation to evaluate (plain text) |
| `items[].sufficient` | boolean | ✓ | The correct answer |
| `items[].feedback` | string | ✓ | Explanation shown after answering |

### 3.14 `multi-select-scenarios`
A set of client-situation scenarios where the learner selects **all** applicable compensation or action categories. Used in Module 5 to practice categorizing NEL, severity, and Economic Loss claims.

```js
{
  type: "multi-select-scenarios",
  options: [
    "NEL — Baseline",
    "NEL — Severity",
    "EL — Lost Income"
  ],
  scenarios: [
    {
      id: "ms1",
      text: "A claimant is certified for breast cancer. She has continued working full time and reports no significant functional limitations.",
      correct: [0],                  // indices into options[] — all correct answers
      feedback: "NEL — Baseline only. No severity indicators and no disability — standard NEL applies."
    },
    {
      id: "ms2",
      text: "A claimant is certified for COPD. He went on permanent disability two years ago and has documented disability determination.",
      correct: [0, 2],               // multiple correct answers
      feedback: "NEL — Baseline and EL — Lost Income. Documented disability with onset, duration, and cause supports an EL claim."
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `options` | string[] | ✓ | The selectable category labels (shown as toggle buttons above each scenario) |
| `scenarios` | object[] | ✓ | Array of scenario items |
| `scenarios[].id` | string | ✓ | Unique identifier (used as React key) |
| `scenarios[].text` | string | ✓ | The client situation description (plain text) |
| `scenarios[].correct` | number[] | ✓ | Array of 0-based indices into `options[]` indicating all correct answers |
| `scenarios[].feedback` | string | ✓ | Explanation shown after submission |

> The learner selects any combination of options and submits; feedback is revealed per scenario. All scenarios must be answered before Continue → is unlocked.

---

## 4. Card Types

### 4.1 `story`
Opening narrative card introducing the client character and learning objectives.

```js
{
  id: "meet-yajaira",
  nav: "Meet Yajaira",
  type: "story",
  data: {
    character: "Yajaira",
    portrait: "Y",
    portraitColor: "#009bdf",
    headline: "Meet Yajaira",
    body: [
      "Paragraph one...",
      "Paragraph two..."
    ],
    closing: "By the end of this module, you'll understand...",
    objectives: [
      "The two federal programs at the center of what we do",
      "Eligible illnesses and the timing rules that apply"
    ]
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `character` | string | ✓ | Character name |
| `portrait` | string | ✓ | Initial letter shown in the avatar circle |
| `portraitColor` | hex | ✓ | Avatar background color |
| `headline` | string | ✓ | Card headline |
| `body` | string[] | ✓ | Array of paragraph strings (plain text; no bold markdown) |
| `closing` | string | ✓ | Summary sentence bridging character story to learning objectives |
| `objectives` | string[] | ✓ | Bulleted learning objectives |

> Typically the **first card** in a module. There is usually exactly one `story` card.

**Unlock gate:** Always unlocked — Continue → is active immediately.

### 4.2 `content`
Main instructional card. Rendered by `ContentCard`. Contains a title, subtitle, optional intro paragraph, and a `blocks` array (see §3).

```js
{
  id: "two-programs",
  nav: "Two Federal Programs",
  type: "content",
  data: {
    title: "Two Federal Programs",
    subtitle: "Two programs, two processes, two sets of requirements",
    blocks: [ /* block objects — see §3 */ ]
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✓ | Large card heading |
| `subtitle` | string | | Secondary heading shown beneath title |
| `blocks` | Block[] | ✓ | Content blocks (see §3) |

> **Do not include** `intro` unless the lead paragraph genuinely needs to appear outside the blocks (e.g., it precedes a first block with no natural preceding paragraph). If present, `intro` must be a non-empty string — omit the field rather than setting it to `""`.

**Unlock gate:** Always unlocked — Continue → is active immediately.

### 4.3 `quiz`
Single multiple-choice question with a second-attempt retry variant.

```js
{
  id: "quiz-programs",
  nav: "Check: Two Programs",
  type: "quiz",
  data: {
    label: "Knowledge Check",
    context: "A client calls and asks:",               // optional framing text
    question: "\"I'm enrolled in the Health Program — does that mean I've filed my VCF claim?\"",
    options: [
      "No — the WTCHP and VCF are separate programs.",
      "Yes — enrollment in WTCHP automatically submits to VCF.",
      "It depends on whether their illness has been certified."
    ],
    correctIndex: 0,
    feedbackCorrect: "Exactly right. The WTCHP (HHS) and VCF (DOJ) are entirely separate systems.",
    feedbackIncorrect: "Not quite. Take another look and pay attention to which agencies administer each program.",
    reviewCardIndex: 1,                                // 0-based index of card to review on incorrect
    retryQuestion: "A claimant wants to skip Health Program enrollment. Can they go straight to VCF?",
    retryOptions: [
      "Yes — the VCF is a separate program, so Health Program enrollment is optional.",
      "Only if they have a doctor's note confirming their illness is 9/11-related.",
      "No — most living claimants need to be enrolled in and certified by the WTCHP first."
    ],
    retryCorrectIndex: 2,
    retryFeedbackCorrect: "Correct. For most living claimants, WTCHP certification is a prerequisite.",
    retryFeedbackIncorrect: "For most living claimants, the VCF requires WTCHP certification first."
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `label` | string | ✓ | Badge label (e.g. "Knowledge Check") |
| `context` | string | | Optional framing sentence displayed before the question |
| `question` | string | ✓ | The question text |
| `options` | string[] | ✓ | Answer options (2–4 items) |
| `correctIndex` | number | ✓ | 0-based index of the correct option |
| `feedbackCorrect` | string | ✓ | Shown when learner answers correctly on first attempt |
| `feedbackIncorrect` | string | ✓ | Shown when learner answers incorrectly |
| `reviewCardIndex` | number | ✓ | Card index learner is prompted to re-read on incorrect |
| `retryQuestion` | string | ✓ | Alternative second-attempt question |
| `retryOptions` | string[] | ✓ | Second-attempt options |
| `retryCorrectIndex` | number | ✓ | 0-based index of the correct retry option |
| `retryFeedbackCorrect` | string | ✓ | Feedback for correct retry answer |
| `retryFeedbackIncorrect` | string | ✓ | Feedback for incorrect retry answer |

> **Placement convention:** One quiz card per content section, inserted immediately after the content card it tests. Nav label format: `"Check: <Topic Name>"`.

**Unlock gate:** Locked until the learner answers correctly (first or second attempt). In review mode, Continue → is active immediately.

### 4.4 `matching`
Click-to-match exercise. Learner clicks an item on the left then its match on the right.

```js
{
  id: "match-latency",
  nav: "Match: Timing Rules",
  type: "matching",
  data: {
    label: "Interactive Exercise",
    instruction: "Click an illness on the left, then click its timing requirement on the right.",
    pairs: [
      { left: "Blood cancers",    right: "~5 months min. latency" },
      { left: "Most solid cancers", right: "4 years min. latency" },
      { left: "Mesothelioma",     right: "11 years min. latency" }
    ],
    successMessage: "All matched correctly. Yajaira was first exposed September 17, 2001..."
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `label` | string | ✓ | Badge label |
| `instruction` | string | ✓ | Instruction text above the exercise |
| `pairs` | `{left, right}[]` | ✓ | Matching pairs (min 3, max ~6 for readability) |
| `successMessage` | string | ✓ | Text shown when all pairs are matched correctly |

**Unlock gate:** Locked until all pairs are correctly matched. In review mode, Continue → is active immediately.

### 4.5 `scenario`
Linear multi-step decision exercise. Rendered by `ScenarioCard`. The learner works through a sequence of steps, each presenting a situation and a set of answer choices. All steps must be completed before Continue → unlocks.

```js
{
  id: "scenario",
  nav: "Apply It: New Client",
  type: "scenario",
  data: {
    title: "A New Client Calls",
    subtitle: "Apply what you've learned",
    intro: "You've learned through Yajaira. Now apply the concepts to someone new.",
    steps: [
      {
        text: "**Denise** worked as an admin at **120 Broadway** in Lower Manhattan from 9/11/2001 through March 2002. Diagnosed with **chronic rhinosinusitis**.",
        question: "Would Denise's work location fall in the 9/11 exposure zone?",
        options: [
          "Yes — 120 Broadway is south of Canal and west of Clinton.",
          "No — north of the boundary.",
          "Need more info."
        ],
        correctIndex: 0,
        feedback: "120 Broadway is well south of Canal Street. Having a specific address is essential..."
      }
      // additional steps...
    ]
  }
}
```

**Top-level `data` fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✓ | Card heading |
| `subtitle` | string | | Secondary heading |
| `intro` | string | | Lead paragraph before the first step |
| `noteText` | string | | Optional Salesforce Note block (rendered as monospace preformatted text) |
| `pathwayBoxes` | object[] | | Optional reference panels shown above the steps (see below) |
| `steps` | object[] | ✓ | Ordered array of step objects |

**Each step object:**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | ✓ | Scenario description for this step (`**bold**` markdown supported) |
| `question` | string | ✓ | The question to answer |
| `options` | string[] | ✓ | Answer choices (2–4 items) |
| `correctIndex` | number | ✓ | 0-based index of the correct answer |
| `feedback` | string | ✓ | Explanation shown after any answer is selected |

**Optional `pathwayBoxes` (each box):**

| Field | Type | Description |
|---|---|---|
| `icon` | string | Emoji or character for the box icon |
| `title` | string | Bold box title |
| `desc` | string | Box body text |
| `color` | hex | Title color and icon border/tint |
| `bg` | hex | Box background |
| `border` | hex | Box border |

> **Note:** Despite the name `scenario`, this card type is a **linear** sequence — not a branching tree. Every step is presented in order; there is no `nextStep` routing. The learner must answer every step before the card completes. Incorrect answers show feedback but do not block progression.

**Unlock gate:** Locked until all steps have been answered (any answer advances; correct answer is shown via feedback). In review mode, Continue → is active immediately.

### 4.6 `assessment`
Per-module knowledge assessment. Typically 5 questions at the end of the module, before the completion card. Rendered by `AssessmentCard`.

```js
{
  id: "assessment",
  nav: "Final Assessment",
  type: "assessment",
  data: {
    title: "Final Assessment",
    subtitle: "Five questions",
    questions: [
      {
        question: "Which agency administers the VCF?",
        options: ["HHS", "Department of Justice", "CDC/NIOSH", "FEMA"],
        correctIndex: 1,
        feedback: "The VCF is administered by the Department of Justice."
      }
      // 4 more questions...
    ]
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✓ | Assessment heading (e.g. "Final Assessment") |
| `subtitle` | string | | Short descriptor (e.g. "Five questions") |
| `questions` | object[] | ✓ | Exactly 5 question objects (see below) |

**Each question object:**

| Field | Type | Required | Description |
|---|---|---|---|
| `question` | string | ✓ | The question text |
| `options` | string[] | ✓ | Answer choices (2–4 items) |
| `correctIndex` | number | ✓ | 0-based index of the correct answer |
| `feedback` | string | ✓ | Explanation shown after answering |

> **See §5 for full assessment conventions** including passing score and retry behavior.

**Unlock gate:** Locked until the learner achieves a passing score (≥4/5 by default). The learner can retry the full assessment on failure.

### 4.7 `document-review`
Interactive document review exercise. Rendered by `DocumentReviewCard`. The learner reads a simulated document (a Salesforce note, an EVL, a form) and for each flagged section must select the correct action or identify the problem.

**Three modes**, controlled by `data.mode`:

| Mode | Interaction | Typical use |
|---|---|---|
| `"find-errors"` (default) | Click a zone row to expand it, then select what's wrong | EVL review, form errors |
| `"action-items"` | Same layout, prompt reads "What action is required?" | ER Note review, CA decision-making |
| `"image-review"` | Questions shown inline below paginated form images; no expand step | Form image inspection |

```js
{
  id: "m4-evl-check",
  nav: "Check: EVL Review",
  type: "document-review",
  data: {
    title: "Is This EVL Sufficient?",
    subtitle: "Identify every problem before it goes to the VCF",
    instructions: "Below is an EVL that a client's employer emailed. Find every problem with this document.",
    mode: "find-errors",
    noteText: "Meridian Building Services\n123 Corporate Drive\n...",   // optional
    headerNote: "Refer to the EVL sufficiency checklist before reviewing.",  // optional
    documents: [
      {
        name: "EVL — Meridian Building Services",
        formImages: [],    // optional; populated for "image-review" mode
        errors: [
          {
            id: "evl-1",
            zone: "Work location",                                     // not used in image-review
            displayed: "\"work assignments in Lower Manhattan\"",      // not used in image-review
            options: [
              "This is sufficient — Lower Manhattan is within the VCF exposure zone.",
              "This is insufficient — an EVL must state a specific address or cross streets.",
              "The address can be supplemented by a WPS."
            ],
            correctOption: 1,
            feedback: "\"Lower Manhattan\" does not meet the VCF's specificity requirement..."
          }
        ]
      }
    ],
    completionMessage: "This EVL needs to be reissued before it goes anywhere..."  // optional
  }
}
```

**Top-level `data` fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✓ | Card heading |
| `subtitle` | string | | Secondary heading |
| `instructions` | string | | Override for the instruction paragraph (defaults to a mode-appropriate message if omitted) |
| `mode` | string | | `"find-errors"` (default), `"action-items"`, or `"image-review"` |
| `noteText` | string | | Optional Salesforce Note block rendered as monospace preformatted text above the documents |
| `headerNote` | string | | Optional blue info callout rendered above the documents |
| `documents` | object[] | ✓ | Array of document sections (usually one, but can be multiple) |
| `completionMessage` | string | | Message shown in a green panel when all items are resolved |

**Each `document` object:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✓ | Document section header (e.g. "Section 1 — Certified conditions") |
| `formImages` | string[] | | Image paths for paginated form preview; triggers image layout when present |
| `errors` | object[] | ✓ | Array of zones/questions (named `errors` even in non-find-errors modes) |

**Each `errors` entry:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | Unique identifier (used as localStorage key for tracking) |
| `zone` | string | find-errors / action-items only | Short uppercase label for the form field or section |
| `displayed` | string | find-errors / action-items only | The value shown in the zone row (the "content" to evaluate) |
| `options` | string[] | ✓ | Answer choices (2–4 recommended) |
| `correctOption` | number | ✓ | 0-based index of the correct answer |
| `feedback` | string | ✓ | Explanation shown after the correct option is selected |

**Unlock gate:** Locked until all items across all documents are correctly resolved. Incorrect picks are crossed out and remain visible; the learner keeps trying until they find the correct option. In review mode, Continue → is active immediately and all items are shown as resolved.

### 4.8 `transcript`
Simulated call or conversation with an embedded decision point. Rendered by `TranscriptCard`. The learner reads the dialogue and then answers a multiple-choice question embedded at the end of the call.

```js
{
  id: "m5-award-call",
  nav: "The Award Call",
  type: "transcript",
  data: {
    title: "The Award Call",
    subtitle: "Yajaira's attorney calls with the VCF's determination",
    intro: "Fourteen months after Yajaira's claim was submitted, the VCF has issued a Loss Calculation Letter. Read the call and answer the decision point.",
    calls: [
      {
        callTitle: "Yajaira's Award",
        lines: [
          { type: "ca",     speaker: "Attorney", text: "Yajaira, thank you for picking up..." },
          { type: "client", speaker: "Yajaira",  text: "Finally. What does it say?" },
          { type: "ca",     speaker: "Attorney", text: "The VCF has determined an award of $250,000..." },
          {
            type: "decision",
            question: "Which of the following statements about this call is accurate?",
            options: [
              "The attorney should have given Yajaira both options equally...",
              "The call accurately reflects the award process...",
              "The attorney made an error — the 30-day window starts when the client accepts.",
              "The attorney should have itemized all deductions first."
            ],
            correctIndex: 1,
            feedback: "The attorney's role is to review the Loss Calculation Letter, assess whether it's fair, and give the client a clear recommendation..."
          }
        ]
      }
    ]
  }
}
```

**Top-level `data` fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✓ | Card heading |
| `subtitle` | string | | Secondary heading |
| `intro` | string | | Lead paragraph before the transcript |
| `calls` | object[] | ✓ | Array of call objects (usually one, but can be multiple calls in sequence) |

**Each `call` object:**

| Field | Type | Required | Description |
|---|---|---|---|
| `callTitle` | string | ✓ | Section heading for this call (shown above the transcript) |
| `lines` | object[] | ✓ | Array of line objects (see below) |

**Each `line` object — three types:**

| `type` | Fields | Description |
|---|---|---|
| `"ca"` | `speaker` (string), `text` (string) | A line spoken by the B&M staff member / attorney |
| `"client"` | `speaker` (string), `text` (string) | A line spoken by the client |
| `"decision"` | `question`, `options`, `correctIndex`, `feedback` | Embedded multiple-choice question; appears at the end of the call |

> Each call must end with exactly one `"decision"` line. Calls without a decision line are not supported by the current renderer.

**Unlock gate:** Locked until the `decision` question is answered correctly. In review mode, Continue → is active immediately.

### 4.9 `completion`
Final card in every module. Triggers `markComplete` on mount and renders a summary of the learner's performance, a "Submit to Training Record" button, and navigation to the next step. **There must be exactly one `completion` card per module, and it must be the last card.**

The `CompletionCard` component reads all context it needs from the React context (`moduleId`, `moduleTitle`, quiz/assessment scores, time-on-task) rather than from `data`. The `data` field should be an empty object.

```js
{
  id: "complete",
  nav: "Module Complete",
  type: "completion",
  data: {}
}
```

> The `id` value does not need to include the module number. `"complete"` is sufficient and is what most modules use. The module identity comes from the shell component's `Ctx.Provider` value, not from card data.

**Unlock gate:** N/A — the completion card is the last card; there is no Continue → beyond it.

### 4.10 Card Unlock and Completion Gates

A summary of what makes each card type "complete" (i.e., enables the Continue → button):

| Card type | Completion condition |
|---|---|
| `story` | Immediate — no gate |
| `content` | Immediate — no gate |
| `quiz` | Learner answers correctly on first or second attempt |
| `matching` | All pairs correctly matched |
| `scenario` | All steps answered (any answer; incorrect answers show feedback but do not block) |
| `assessment` | Score ≥ `passingScore` (default 4/5) — full retry on failure |
| `document-review` | All items in all documents resolved with the correct option |
| `transcript` | `"decision"` question answered correctly |
| `completion` | N/A (last card) |

In **review mode** (activated from the module header), Continue → is enabled on every card regardless of completion state. Review mode is intended for instructors and returning learners who need to re-read content without repeating exercises.

---

## 5. Assessment Conventions

### Per-module assessment (5 questions)
- Card type: `assessment` (see §4.6)
- Position: second-to-last card (before `completion`)
- Questions: exactly **5**
- Passing score: **4 out of 5** — the `passingScore` field is not present in the data; the component defaults to 4
- On fail: the assessment card stays locked; the learner can retry the full 5-question set
- **Every question must include a `feedback` field.** Older modules (2–3) have some questions without feedback — this is a known inconsistency; do not replicate it in new modules

### Journey capstone assessment (20 questions)
- Separate component: `src/components/NewHireAssessment.jsx`
- Separate data file: `src/data/newHireAssessmentData.js`
- Route: `/journeys/:journeyId/assessment`
- Wired to journey via `assessment: "new-hire-assessment"` field in `journeys.js`
- Questions: **20** (mix of multiple-choice and scenario-based)
- Completion: calls `markComplete("new-hire-assessment", payload)` on submit
- This format is **not** part of the standard module data format; it has its own shape

---

## 6. File and Directory Conventions

### Data file
- Path: `src/data/moduleNData.js`
- Named export: `MODULE_N` (uppercase, matching the number)
- Format: JSON-format with quoted keys (the format Edit Mode auto-generates). Unquoted JS object keys also parse identically, but quoted keys are the standard going forward.

### Shell component
- Path: `src/components/ModuleN.jsx`
- Shape: minimal wrapper that loads module data from the content service and renders it through the card pipeline

**What varies between shells (it is not a copy-paste clone):**

The five existing shells (`Module2.jsx` through `Module6.jsx`) share identical boilerplate — same hooks, same layout, same edit toolbar. What differs is:
1. `MODULE_ID` constant (e.g. `"module-3"`)
2. Module display-name strings in the header and edit toolbar (e.g. `"Module 3: From Sign-Up to Submitted"`)
3. The card-type **imports** — each shell only imports the card components it actually uses. Module 2 does not import `DocumentReviewCard` or `TranscriptCard`; Module 3 does not import `MatchingCard` or `ScenarioCard`; Module 5 imports all card types.
4. The **`switch` statement** — cases are included only for card types used by that module
5. The export function export data filename reference in the Edit Mode export helper

When creating a new shell, **copy `Module5.jsx`** (it imports all card types) and adapt the five items above.

### Service registration
- File: `src/services/contentService.js`
- Add one entry to `MODULE_MAP`:
  ```js
  "module-7": () => import("../data/module7Data.js").then(m => m.MODULE7)
  ```
- Add one entry to `ModuleDispatcher.jsx`'s module lookup

### Asset paths
- Bundled assets (imported into JS): `src/assets/` — use ES `import` at the top of the data file
- Public-folder assets (form images, PDFs): `public/forms/` or `public/review_forms/` — referenced as `/src/assets/forms/filename.png` in data (auto-rewritten by `resolveFormImage()` at runtime)
- Character portrait image: `src/assets/Yajaira_Torso.png` is the canonical Yajaira asset

---

## 7. Visual and Style Conventions

### Color system

All color tokens are defined in `src/theme.js` and re-exported via `src/data/brand.js` as the `B` object. Data authors do not import `B` directly — hex values below are provided as an authoring reference for use in data fields like `color`, `bg`, `border`, `iconBg`, and `accent`.

| Token | Hex | Typical use |
|---|---|---|
| `B.blue` | `#009bdf` | Primary brand blue — VCF, interactive elements, primary buttons |
| `B.blueLt` | `#e6f5fc` | Light blue background — info callouts, callout blocks |
| `B.gray` | `#63656a` | Neutral gray — WTCHP, secondary elements |
| `B.ok` | `#4a8c6f` | Success green — correct answers, completion states |
| `B.err` | `#b54a4a` | Error red — incorrect answers, warning states |
| `B.sand` | `#e8e2d6` | Sand — card borders, dividers |
| `B.ww` | `#fdfcfa` | Near-white — card backgrounds |
| `B.tm` | `#555555` | Medium — body text |
| `B.td` | `#2c2c2c` | Dark — headings, labels |
| `B.tl` | `#888888` | Light — subtitles, secondary text |

Dynamic colors (computed from data values at render time) are applied via `style={{...}}` inline — **never** hard-coded in Tailwind class strings, because Tailwind purges unused dynamic classes at build time.

### Typography
- **Bold in text fields:** use `**double asterisks**` — rendered by `<Md>` or `<GT>` (the glossary-aware renderer). Never use raw HTML `<strong>` in data files.
- **Headings** use `font-heading` (set in `tailwind.config.cjs`)
- **Card title** font size: `text-xl` or `text-2xl`
- **Body text:** `text-sm` (13–14px)

### Card layout anatomy
Every card type follows this anatomy (enforced by the shell component):
```
┌──────────────────────────────────────────────────┐
│  [Badge label — e.g. "Knowledge Check"]          │
│  Title / Headline                                │
│  Subtitle (optional)                             │
│                                                  │
│  [Content area — blocks / questions / matching] │
│                                                  │
│  [← Previous]              [Continue →]          │
└──────────────────────────────────────────────────┘
```
The `<Nav>` component in `Shared.jsx` renders the previous/continue buttons. Continue → is disabled until the card's completion condition is met (see §4.10).

### Edit Mode
- In admin edit mode, text fields are wrapped in `<ET cardId={id} path="..." value={...}>` for click-to-edit
- Data authors do not need to think about `ET` — the shell components apply it automatically to supported fields
- Edit Mode is gated by `VITE_ADMIN_PASSWORD` (client-side; not a security boundary)

---

## 8. Minimal Worked Example

Below is a complete, valid `module7Data.js` with five cards demonstrating the most common card types. This can be integrated into the codebase without modification (once a `Module7.jsx` shell and service entry exist). Copy `Module5.jsx` as the shell template since it handles all card types.

```js
export const MODULE7 = {
  cards: [
    // ── Card 1: Story ──────────────────────────────────────────
    {
      id: "meet-carlos",
      nav: "Meet Carlos",
      type: "story",
      data: {
        character: "Carlos",
        portrait: "C",
        portraitColor: "#009bdf",
        headline: "Meet Carlos",
        body: [
          "Carlos worked as a maintenance technician for a Lower Manhattan office building from 1999 to 2004. On September 11, 2001, he was on-site performing routine HVAC maintenance when the towers collapsed.",
          "Carlos developed mesothelioma in 2015. He's heard other workers from his building received compensation through a program but isn't sure he qualifies."
        ],
        closing: "By the end of this module, you'll understand how workers in Carlos's situation qualify under both programs and what documentation we need from him.",
        objectives: [
          "How occupation-based responders differ from general survivors",
          "The special 4-hour threshold for certain occupational categories",
          "What documentation distinguishes a strong case from a weak one"
        ]
      }
    },

    // ── Card 2: Content ────────────────────────────────────────
    {
      id: "responder-categories",
      nav: "Responder Categories",
      type: "content",
      data: {
        title: "Who Counts as a Responder?",
        subtitle: "Occupation and location determine which exposure rules apply",
        blocks: [
          {
            type: "paragraph",
            text: "Responders who worked south of Canal Street in a qualifying occupation between 9/11/2001 and 7/31/2002 are subject to the responder exposure thresholds rather than the higher survivor thresholds."
          },
          {
            type: "callout",
            style: "info",
            icon: "⭐",
            text: "**Special 4-hour threshold occupations** include vehicle maintenance workers, FDNY/NYPD members who worked on-site, and workers whose duties directly exposed them to heavy collapse dust. Carlos may qualify under this rule."
          },
          {
            type: "subheading",
            text: "Carlos's Situation"
          },
          {
            type: "yajaira-check",
            text: "Carlos was performing HVAC maintenance — directly pulling collapse dust through building systems. If his work logs confirm on-site presence from 9/11 through at least 9/14, he may qualify under the 4-hour special threshold. ✓"
          }
        ]
      }
    },

    // ── Card 3: Quiz ────────────────────────────────────────────
    {
      id: "quiz-responder",
      nav: "Check: Responder Categories",
      type: "quiz",
      data: {
        label: "Knowledge Check",
        context: "A new client calls and mentions they worked as a vehicle maintenance technician cleaning rescue vehicles at Ground Zero on 9/12/2001 for one shift (about 6 hours).",
        question: "Does this client likely meet the WTCHP exposure threshold for enrollment?",
        options: [
          "No — one shift is not enough time; they need at least 4 days.",
          "Yes — vehicle maintenance workers have a special 4-hour minimum that they easily meet.",
          "It depends on whether they also have a qualifying illness."
        ],
        correctIndex: 1,
        feedbackCorrect: "Correct. Vehicle maintenance workers who cleaned or maintained rescue vehicles are in the special occupational category with a 4-hour total minimum. One 6-hour shift clears that bar.",
        feedbackIncorrect: "Look back at the special occupational category rules. Vehicle maintenance workers have a lower threshold than the standard survivor or responder minimums.",
        reviewCardIndex: 1,
        retryQuestion: "The same client asks: 'Do I still need to enroll in the Health Program before filing my VCF claim?' How do you respond?",
        retryOptions: [
          "No — since you have a special occupational status, you can file VCF directly.",
          "Yes — for most living claimants, WTCHP certification is a required first step before the VCF will process the claim.",
          "Only if you were diagnosed after 2010."
        ],
        retryCorrectIndex: 1,
        retryFeedbackCorrect: "Correct. The special 4-hour threshold only affects the WTCHP enrollment bar — the two-program sequence (WTCHP first, then VCF) still applies.",
        retryFeedbackIncorrect: "The special occupational category changes the exposure threshold, not the program sequence. WTCHP certification is still a prerequisite for the VCF."
      }
    },

    // ── Card 4: Matching ────────────────────────────────────────
    {
      id: "match-thresholds",
      nav: "Match: Exposure Thresholds",
      type: "matching",
      data: {
        label: "Interactive Exercise",
        instruction: "Click a worker category on the left, then click its minimum exposure threshold on the right.",
        pairs: [
          { left: "Vehicle maintenance workers (rescue vehicles)",   right: "4 hours total (special threshold)" },
          { left: "General survivors (south of Houston, post-9/11)", right: "4 days >4 hrs each (by 1/10/02)" },
          { left: "Standard responders (south of Canal)",            right: "24 hours by 9/30/01" },
          { left: "Anyone engulfed in the 9/11 dust cloud",          right: "No minimum — dust cloud exposure qualifies" }
        ],
        successMessage: "Matched correctly. Carlos — as an HVAC tech who pulled collapse dust through building systems — likely falls in the 4-hour special threshold category, making enrollment straightforward if he has supporting work records."
      }
    },

    // ── Card 5: Completion ──────────────────────────────────────
    {
      id: "complete",
      nav: "Module Complete",
      type: "completion",
      data: {}
    }
  ]
};
```

---

## 9. Bespoke Modules Inventory

The following modules are **not** produced using the standard data format. Do not attempt to generate data artifacts for them.

| Module | Entry Component | Notes |
|---|---|---|
| Salesforce Basics | `src/components/SalesforceBasicsModule.jsx` | Sub-components under `src/components/salesforce/`. Own state, theme, exercise engine. Includes `ReportingModule.jsx` (report-builder simulation with interactive Salesforce-style exercises). |

---

### 9.1 Registering a Bespoke Module

Every module — standard or bespoke — must be wired into the LMS at **four touchpoints**. Missing any one will cause the module to be unreachable, invisible to the journey engine, or to throw on entry.

| # | File | What to add | Why |
|---|---|---|---|
| 1 | `src/services/contentService.js` — `MODULE_MAP` | `"module-id": { bespoke: true, cards: [] }` | Prevents `getModule()` from throwing on look-up; signals to callers that no card data exists |
| 2 | `src/components/ModuleDispatcher.jsx` — `MODULE_COMPONENTS` | `"module-id": YourComponent` | Wires the URL (`/modules/module-id`) to the React component |
| 3 | `src/services/contentService.js` — `MODULE_METADATA` | `"module-id": { title: "...", time: "..." }` | Makes the module visible in the catalog, homepage, and journey progress lists |
| 4 | `src/data/journeys.js` — relevant journey's `modules` array | `{ id: "module-id", required: true }` | Includes the module in journey progress tracking and unlock gates |

**Registration checklist — before shipping a new bespoke module:**
- [ ] `MODULE_MAP` has a `{ bespoke: true, cards: [] }` sentinel entry
- [ ] `MODULE_COMPONENTS` in `ModuleDispatcher.jsx` maps the id to the component
- [ ] `MODULE_METADATA` has `title` and estimated `time`
- [ ] The correct journey's `modules` array includes the module id

---

### 9.2 Recommended Construction Pattern for Future Bespoke Modules

Future modules that include UI simulations (process walk-throughs, interactive tools, etc.) should follow a **hybrid two-layer pattern** rather than embedding all content directly in JSX. This gives a simulation module the same LMS features as standard modules (glossary auto-linking, Edit Mode, content separated from logic) without requiring a full card-based architecture.

#### Layer 1 — Instructional text (data file → `Blocks` renderer)

Extract all explanatory text (introductions, instructions, concept explanations) into a lightweight data file and render it through the standard `<Blocks>` component from `Shared.jsx`.

```js
// src/data/mySimModuleData.js
export const MY_SIM_MODULE = {
  id: "my-sim-module",
  title: "My Simulation Module",
  time: "~25 min",
  sections: [
    {
      id: "intro",
      title: "Before You Start",
      blocks: [
        { type: "paragraph", text: "This simulation walks you through the **three-step intake process** used for every new claimant." },
        { type: "callout", style: "info", icon: "💡", text: "Complete each step before moving to the next — the system mirrors real Salesforce behavior." }
      ]
    }
  ],
  exercises: [
    {
      id: "ex-1",
      title: "Step 1: Create the Account",
      instructions: "Using the fields below, create an Account record for the new claimant.",
      // exercise-specific config — field list, expected values, etc.
    }
  ]
};
```

Benefits of this layer:
- All `blocks` text receives **automatic glossary linking** via `<GT>` — no special markup needed.
- **Edit Mode** works on every block field at zero cost — `<Blocks>` already wraps fields in `<ET>` when edit mode is active.
- Wording changes (instructions, callouts, explanations) live in the data file and are independent of simulation logic.

#### Layer 2 — Simulation UI (bespoke JSX + config from data file)

The interactive portion (click targets, field inputs, animated UI, state machine) lives in JSX. Rather than hard-coding exercise parameters, the component reads its configuration from the data file:

```js
// src/components/MySimModule.jsx
import { MY_SIM_MODULE } from "../data/mySimModuleData";
import { Blocks } from "./Shared";

export default function MySimModule() {
  const [step, setStep] = useState(0);
  const section = MY_SIM_MODULE.sections[step];
  const exercise = MY_SIM_MODULE.exercises[step];

  return (
    <div>
      {/* Instructional text — free glossary + Edit Mode */}
      <Blocks blocks={section.blocks} cardId={section.id} />

      {/* Simulation UI — bespoke, driven by config from data file */}
      <SimulationEngine exercise={exercise} onComplete={() => setStep(s => s + 1)} />
    </div>
  );
}
```

#### Why the split matters

| | All-in-JSX (Salesforce Basics pattern) | Hybrid (recommended) |
|---|---|---|
| Glossary auto-linking | ✗ Not available | ✓ Free via `<Blocks>` |
| Edit Mode | ✗ Not available | ✓ Free via `<Blocks>` + `<ET>` |
| Content vs. logic separation | ✗ Tangled in component | ✓ Data file vs. component |
| Simulation fidelity | ✓ Full JSX freedom | ✓ Full JSX freedom |
| Registration requirements | Same 4 touchpoints (§9.1) | Same 4 touchpoints (§9.1) |

The Salesforce Basics module predates this pattern — all text is embedded in JSX and neither glossary linking nor Edit Mode is available. New bespoke modules should use the hybrid pattern from the start.

---

## 10. Known Inconsistencies

This section documents patterns that exist in the codebase but diverge from the standard now defined in this spec. **Older modules do not need to be retrofitted** (unless noted). New modules must follow the preferred form.

### Resolved — use the preferred form in all new content

| Issue | Legacy form | Required form | Resolution |
|---|---|---|---|
| `doc-cards` form images | `formImage: "path"` (single string) | `formImages: ["path1"]` (always an array) | Both are accepted by the renderer, but `formImages` is the only documented form going forward. Do not use `formImage` in new cards. |
| Empty `intro` field | `"intro": ""` | Omit the field entirely | An empty string adds nothing and creates unnecessary noise. The spec (§4.2) now explicitly requires omitting rather than nulling. |
| Module data key format | Unquoted JS keys (`id: "foo"`) | JSON-format quoted keys (`"id": "foo"`) | Module 6 uses unquoted JS; Modules 2–5 use quoted JSON (the format Edit Mode generates). Both parse identically — no need to retrofit Module 6. Use quoted keys in all new modules. |
| Assessment `feedback` missing | Some questions in Modules 2–3 omit `feedback` | `feedback` is **required** on every question | Older questions without feedback can remain. All new assessment questions must include feedback. |

### Out of date — remove from existing data if convenient

| Issue | Detail |
|---|---|
| `objectivesLabel` field on `story` cards | Module 6 includes `objectivesLabel: "In this module:"` in its story card. This field is not read by `StoryCard` — the label is hardcoded. Remove the field if editing the module data; do not include it in new modules. |

### Style guidance — not a structural issue

The `context` field on `quiz` cards is inconsistently present across modules. Whether to include it is a **content** decision (include it when a framing sentence genuinely helps, omit it when the question stands alone). This is not a format inconsistency and belongs in a content style guide rather than this spec.

---

## 11. Out of Scope

The following are intentionally excluded from this specification:

- **Glossary data format** (`src/data/glossary.js`) — see §3 intro for how glossary linking works; the glossary term schema itself is out of scope
- **Journey configuration** (`src/data/journeys.js`) — wired separately after module is complete
- **Assessment data format** (`src/data/newHireAssessmentData.js`) — journey-scoped capstone, separate authoring workflow
- **Admin Edit Mode internals** (`ET` wrapper, `useEditableContent`) — infrastructure only, not authored in data files
- **Backend API shape** — documented in `MEMORY.md`; not relevant to content authoring
- **Bespoke module internals** — see §9
- **Brand token source** (`src/theme.js`, re-exported via `src/data/brand.js`) — hex values are inlined in §7 for authoring convenience; do not import `brand.js` directly in data files
- **React component internals** — data authors do not write JSX; data files are pure JS object exports
