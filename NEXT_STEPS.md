# Next Steps — B&M Training LMS

## What Is Built and Working

### Module 2: Foundational Concepts
- **12-card interactive training module** covering VCF and WTCHP eligibility, timing rules, exposure requirements, proof of presence, and a full assessment
- **Card types**: Story, Content, Quiz (with retry), Matching, Scenario (multi-step), Assessment (5 questions), and Completion
- **Registration gate** collects learner name, email, and role before the module begins
- **Glossary system** with 132 terms, inline term highlighting, and a searchable drawer with category tabs
- **Completion card** with performance breakdown, per-question detail, and four export options:
  - Download CSV
  - Copy formatted summary to clipboard
  - Open pre-filled email draft
  - Submit to Training Record (Power Automate webhook — ready to wire up)
- **Tailwind CSS** build pipeline with brand color tokens
- **GitHub Pages** deployment via Actions workflow on push to `main`

### Payload Schema
`src/data/learnerSchema.js` documents every field in the completion payload — use this as the source of truth for Power Automate flow columns and the master Excel spreadsheet headers.

---

## How to Create the Power Automate Flow

### Step 1: Create the HTTP Trigger
1. Go to [Power Automate](https://make.powerautomate.com/)
2. Create a new **Instant cloud flow** > **When an HTTP request is received**
3. In the trigger, click "Use sample payload to generate schema" and paste:
   ```json
   {
     "userId": "jane@barashmcgarry.com",
     "displayName": "Jane Smith",
     "role": "CA I — Health Program",
     "moduleId": "module-2-foundational-concepts",
     "moduleTitle": "Module 2: Foundational Concepts",
     "completedAt": "2026-03-16T14:32:07.123Z",
     "timeOnTaskSec": 1845,
     "assessScore": 4,
     "assessTotal": 5,
     "assessFirstPct": 80,
     "assessDetails": "Q1:1att|Q2:2att|Q3:1att|Q4:1att|Q5:3att",
     "quizReviews": 1,
     "matchErrors": 3,
     "scenarioErrors": 2
   }
   ```
4. Click "Done" — Power Automate will generate the schema automatically

### Step 2: Add an Action (e.g. Write to Excel)
1. Add action: **Excel Online (Business)** > **Add a row into a table**
2. Point it at your master Excel file in SharePoint/OneDrive
3. Map each column to the corresponding dynamic content from the trigger
4. The column headers should match `PAYLOAD_SCHEMA` field names in `src/data/learnerSchema.js`

### Step 3: Add a Response Action
1. Add action: **Response** with status code **200** and an empty body (or a JSON acknowledgement)
2. This ensures the app gets a success signal

### Step 4: Copy the HTTP POST URL
1. Save the flow
2. Go back to the HTTP trigger step — it now shows an **HTTP POST URL**
3. Copy the full URL

### Step 5: Add the URL to the App
**For local dev:**
- Paste into `.env`: `VITE_POWERAUTOMATE_URL=https://prod-XX.westus.logic.azure.com/workflows/...`
- Restart dev server

**For production (GitHub Pages):**
- Go to repo Settings > Secrets and variables > Actions
- Add secret: Name = `VITE_POWERAUTOMATE_URL`, Value = the full URL
- Push to `main` to trigger a rebuild, or run `npm run deploy` locally

---

## How to Add a New Module

### Files to Create/Copy
1. **`src/data/cards-module3.js`** — Copy `cards.js` as a template. Update all card `id`, `nav`, and `data` fields with the new module's content. Follow the same card type patterns (story, content, quiz, matching, scenario, assessment, completion).

2. **`src/data/glossary-module3.js`** — Add any new glossary terms. You can extend the existing `GLOSSARY` array or create a module-specific one that merges in.

3. **Update `src/App.jsx`** — Import the new cards data and add routing logic (e.g., a module selector screen before registration, or separate entry points).

### Key Patterns to Follow
- Each card has `{ id, nav, type, data }` — `id` is a unique kebab-case string, `nav` is the sidebar label, `type` selects the component
- Quiz cards with retry need: `retryQuestion`, `retryOptions`, `retryCorrectIndex`, `retryFeedbackCorrect`, `retryFeedbackIncorrect`, and `reviewCardIndex`
- The `payload.moduleId` in CompletionCard should be updated per module
- Brand tokens live in `src/theme.js` — shared across all modules

### Longer-Term Architecture
Once there are 3+ modules, consider:
- A module registry/manifest file that lists all available modules
- A module selector landing page
- Shared completion tracking across modules (localStorage or a backend)
- A learner dashboard showing progress across all modules

---

## SharePoint SSO Path (Future Priority)

The current app uses a simple registration form. For tighter SharePoint integration:

### Phase 1: Embed with Manual Login (Current)
- Deploy to GitHub Pages
- Embed via iframe in SharePoint
- Learner enters name/email manually

### Phase 2: SharePoint Framework (SPFx) Web Part
- Migrate the React app into an SPFx project
- The SPFx context provides the current user's name, email, and department automatically — no registration form needed
- Completion data can POST to Power Automate with the authenticated user's identity
- Deployed via SharePoint App Catalog

### Phase 3: Azure AD Authentication
- Register the app in Azure AD
- Use MSAL.js to authenticate against the tenant
- Token-based API calls to Microsoft Graph for user profile
- Can validate that the user is a B&M employee before allowing access

### Recommendation
Phase 1 (current) is sufficient for internal training rollout. Move to Phase 2 only when the registration form becomes a friction point or when IT wants centralized deployment through SharePoint App Catalog.
