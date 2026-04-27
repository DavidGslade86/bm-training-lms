// src/data/moduleCA1_1Data.js
// Client Advocate Track — Health Program Enrollment
// Module CA1-1: The Role of a CA I

export const MODULE_CA1_1 = {
  "cards": [

    // ── Card 1: Story ────────────────────────────────────────────────
    {
      "id": "meet-maya",
      "nav": "Meet Maya",
      "type": "story",
      "data": {
        "character": "Maya",
        "portrait": "M",
        "portraitColor": "#7c3aed",
        "headline": "Meet Maya",
        "body": [
          "Maya is in her second year on the Health Program team. She is methodical, keeps a clean Salesforce, and is the person the rest of the team quietly consults when they cannot remember which sub-status a Pizza Tracker should be in.",
          "It's 9:00 on a Tuesday morning. Maya has just opened her laptop, pinned her My Open Tasks view, and refreshed her Mail Received report. There are about forty things she could do next. Her job, for the next eight hours, is to do them in the right order, at the right cadence, with the right notes left behind.",
          "You will spend a lot of this pathway watching Maya work. She is not always perfect — but she is consistent, and consistency is most of the job."
        ],
        "closing": "By the end of this module, you'll understand the rhythm of the CA I role and the daily mental model that keeps a caseload of 80+ clients moving without anything falling through the cracks.",
        "objectives": [
          "Where the CA I sits in the client journey — what comes in, what goes out",
          "The five client touchpoints you own, from kit-out to enrollment-confirmed",
          "IAKARF as a daily prioritization method, not just an acronym",
          "The 24-hour standard and how it relates to the SOP language",
          "How follow-up cadence ramps as the client moves toward submission",
          "Task naming conventions and what they signal to your future self and your team"
        ]
      }
    },

    // ── Card 2: Content — Where You Fit & The Five Touchpoints ──────
    {
      "id": "where-you-fit",
      "nav": "Where You Fit",
      "type": "content",
      "data": {
        "title": "Where You Fit",
        "subtitle": "What's handed to you, the five touchpoints you own, and what you hand off",
        "blocks": [
          {
            "type": "paragraph",
            "text": "The CA I role is the middle of a longer chain. Knowing what happens *before* a client reaches you and what happens *after* you hand them off shapes the questions you ask, the notes you leave, and the expectations you set."
          },
          {
            "type": "subheading",
            "text": "What comes in: the handoff from CAT"
          },
          {
            "type": "paragraph",
            "text": "The **Client Acquisition Team (CAT)** handles initial intake — the prospective-client conversation, eligibility vetting, and sign-up. By the time an account is yours, the Lead has been converted to an Account, the retainer is signed, and Desa has registered the client in CMS. The kit has been generated and mailed by the Mailroom Team within 48 hours of the Welcome Email."
          },
          {
            "type": "callout",
            "style": "info",
            "icon": "📨",
            "text": "**Your starting line is the Welcome Email.** The kit is in the mail, the client has been told to expect a follow-up call from their CA, and you are that CA. Follow-Up #1 is set on your queue by your supervisor about a week after the kit goes out."
          },
          {
            "type": "subheading",
            "text": "The five touchpoints you own"
          },
          {
            "type": "paragraph",
            "text": "While the account is yours, the client moves through **five experiences**. Each has its own cadence, its own conversations, and its own definition of done. Everything else in this pathway — what to say on the intro call, how to draft an attestation, how to handle a suspension — fits into one of these five buckets."
          },
          {
            "type": "image",
            "src": "[NEEDS ASSET: SVG diagram — horizontal flow of the five touchpoints as labeled boxes with cadence beneath each. Connected by arrows. Maya's avatar at the top left labeled 'CA I owns this stretch'. Brand palette: blues, sands, dark grey. The stretch ends with a handoff arrow to MS at the right.]",
            "alt": "Diagram of the five client touchpoints during CA I ownership",
            "caption": "Maya is the client's primary point of contact from kit-out through enrollment confirmation."
          },
          {
            "type": "paragraph",
            "text": "**1. Intro and Kit Outstanding** — The client knows you by name, knows what's coming, and the kit gets back to us. Weekly contact until the kit is in the door."
          },
          {
            "type": "paragraph",
            "text": "**2. Exposure Vetting and HP POP Generation** — You've gathered the client's exposure story in enough detail to draft the WTCHP Victim Attestation. Witnesses are identified. Two Third Party Attestations are sent out for signature. Weekly cadence on the SOP, daily in practice once the drafts are in motion."
          },
          {
            "type": "paragraph",
            "text": "**3. HP POP Return** — All three signed POP documents are back. This is the highest-tempo phase of the role; the statements are the last block before the WTCHP application can be submitted."
          },
          {
            "type": "paragraph",
            "text": "**4. Application Submitted, Awaiting Acceptance** — The fax is out, the client has heard from you within 24 hours of submission, and they know what the next 4–8 weeks look like. Follow-up at 4, 8, and 10 weeks."
          },
          {
            "type": "paragraph",
            "text": "**5. Enrollment Confirmed, Handing Off to MS** — The client is enrolled, knows their clinic, and understands what the Initial Health Evaluation is. You've walked them through completing the Medical Health Questionnaire and Exposure Form, reminded them to tell us their IHE date, and set a Pre-Appointment task for the Medical Specialist."
          },
          {
            "type": "subheading",
            "text": "What goes out: handoffs to MS and CA II"
          },
          {
            "type": "paragraph",
            "text": "Once the WTCHP application is accepted and the clinic is assigned, you set a **Pre-Appointment task for the Medical Specialist (MS)**. The MS takes over IHE preparation, medical records strategy, and the post-appointment sequence. You stay involved through enrollment confirmation, but the IHE-prep conversation is the MS's specialty."
          },
          {
            "type": "paragraph",
            "text": "Once the client is **certified** by the WTCHP, the account moves to **CA II ownership** for VCF claim building, POP collection, claim submission, and the long arc to award. You are not on the VCF side; CA II handles that."
          },
          {
            "type": "callout",
            "style": "warn",
            "icon": "⚠",
            "text": "**File notes are the handoff.** A CA II inheriting your file should be able to read your case comments and Pizza Tracker history and know exactly what was tried, what worked, and what's still open. A messy handoff costs the client time at the worst possible moment — right when their VCF claim is being built."
          }
        ]
      }
    },

    // ── Card 3: Quiz — Where Does the CA I Hand Off? ─────────────────
    {
      "id": "quiz-handoffs",
      "nav": "Check: Handoffs",
      "type": "quiz",
      "data": {
        "label": "Knowledge Check",
        "context": "A client just had their initial WTCHP application accepted. They've been assigned to a clinic and have an IHE scheduled in three weeks.",
        "question": "What is the CA I's correct next move?",
        "options": [
          "Take ownership through certification — the CA I owns the client until the WTCHP issues a Certification Letter.",
          "Set a Pre-Appointment task for the Medical Specialist and brief them on the client's situation; the MS owns the IHE-prep conversation.",
          "Hand the account off directly to the CA II, since the application has been submitted.",
          "Wait until the IHE actually happens; no action is needed before then."
        ],
        "correctIndex": 1,
        "feedbackCorrect": "Right. Once the application is accepted and a clinic is assigned, the CA I sets the Pre-Appointment task for MS. You don't disengage from the client — you stay involved through enrollment confirmation — but the IHE-prep conversation is the MS's specialty.",
        "feedbackIncorrect": "Re-read the handoff sequence. The CA II takes the file at certification, not at application submission. And the MS handles IHE-prep — that's their specialty.",
        "reviewCardIndex": 1,
        "retryQuestion": "When does the account move from CA I to CA II ownership?",
        "retryOptions": [
          "When the WTCHP application is faxed.",
          "When the client receives the Certification Letter from the WTCHP.",
          "When the IHE is completed.",
          "When the client signs the retainer."
        ],
        "retryCorrectIndex": 1,
        "retryFeedbackCorrect": "Correct. Certification is the trigger. CA I owns enrollment; CA II owns the VCF claim that follows.",
        "retryFeedbackIncorrect": "Certification — the Certification Letter from the WTCHP — is the trigger. Until then, the file stays with you."
      }
    },

    // ── Card 4: Content — IAKARF ─────────────────────────────────────
    {
      "id": "iakarf",
      "nav": "IAKARF",
      "type": "content",
      "data": {
        "title": "IAKARF: Your Morning Triage",
        "subtitle": "How to walk into 40 open tasks and know exactly what to do first",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Maya pins her **My Open Tasks** view at the start of every day. Some mornings there are 20 items, some mornings 60. The number is not the point — the order is."
          },
          {
            "type": "paragraph",
            "text": "**IAKARF** is the Health Program team's prioritization method. It is not the only way to triage a caseload, but it is the one supervisors will be looking at when they review your work, and it maps cleanly onto the firm's KPIs."
          },
          {
            "type": "image",
            "src": "[NEEDS ASSET: SVG visualization — vertical stack of six labeled bands, top to bottom: Inbound Correspondence (red, top of stack), Applications & Completed Kits (orange), Kit Follow-ups (yellow), Administrative Assignments (green), Resends (teal), Follow-ups non-KPI (blue, bottom). Each band labeled with the letter (I, A, K, A, R, F) on the left and a one-line description on the right. Visual implies 'work top-down'.]",
            "alt": "IAKARF priority stack diagram",
            "caption": "Top of the stack first. Work down."
          },
          {
            "type": "subheading",
            "text": "I — Inbound Correspondence"
          },
          {
            "type": "paragraph",
            "text": "Missed calls, Review Transmission tasks (routed by the Communications Team when a client contacts our general line), inbound emails, inbound texts. **All inbound gets a response within 24 hours**, full stop. Even if the response is just \"Got your message, I'll have an answer for you by tomorrow.\""
          },
          {
            "type": "callout",
            "style": "info",
            "icon": "📅",
            "text": "**Calendly is your friend here.** B&M has a Salesforce flow that generates a single-use Calendly link based on your role and the meeting type (general follow-up, document follow-up, draft statement, etc.). Pick the type, the template populates, you can edit it, and you send it via SMS, email, or both. Both is the default unless you know the client doesn't want one of those modalities. **Calendly links can only go to people listed as Related Contacts on the account** — for a living client that's primarily the client themself, but later in the workflow it lets you schedule witnesses too."
          },
          {
            "type": "subheading",
            "text": "A — Applications and Completed Kits"
          },
          {
            "type": "paragraph",
            "text": "Two flavors: a **WTCHP Application that's ready to submit** (POP is in, Designated Rep and HIPAA are signed, the application can be faxed today), or a **Kit that just came back in the mail** and needs to be processed. Both have a 24-hour turnaround target — these are KPI tasks."
          },
          {
            "type": "subheading",
            "text": "K — Kit Follow-ups"
          },
          {
            "type": "paragraph",
            "text": "Outstanding kits — clients who haven't returned their intake kit yet. Sub-prioritize: any kit follow-up marked High Priority first, then Follow-Up 1–4 (Tier 1 and Tier 2 together), then Follow-Up 5–8 (Tier 1 first because of the shorter latency on their illnesses), then Follow-Up 5–8 (Tier 2), then anything past Follow-Up 8."
          },
          {
            "type": "subheading",
            "text": "A — Administrative Assignments"
          },
          {
            "type": "paragraph",
            "text": "The non-follow-up internal work: **drafting HP POP statements**, **Needs Enrollment** processing, **Suspension/Denial resolution**. These move the client journey forward and are usually the most cognitively demanding tasks of your day."
          },
          {
            "type": "subheading",
            "text": "R — Resends"
          },
          {
            "type": "paragraph",
            "text": "Documents that need to go back out: kit documents that came in wrong, client account documents that need a new copy. Outstanding kit resends first, client account resends second."
          },
          {
            "type": "subheading",
            "text": "F — Follow-ups (non-KPI)"
          },
          {
            "type": "paragraph",
            "text": "Everything else. WTCHP Statements follow-ups, WTCHP Enrollment Status follow-ups, miscellaneous client account follow-ups. These matter — but they go after everything above on a normal day."
          },
          {
            "type": "callout",
            "style": "warn",
            "icon": "⚡",
            "text": "**Same-day escalations break the order.** Some kit-receipts require same-day processing regardless of where they fall on your list: Amendment Needed, already-Enrolled or already-Certified accounts, Expedite cases, and Recovered Accounts. If you see one of these, it jumps to the front."
          }
        ]
      }
    },

    // ── Card 5: Scenario — Tuesday Morning Triage ────────────────────
    {
      "id": "scenario-tuesday-morning",
      "nav": "Apply It: Tuesday Morning",
      "type": "scenario",
      "data": {
        "title": "Tuesday Morning: Maya's Triage",
        "subtitle": "Three things land in the queue between 9:00 and 9:30. What's the order?",
        "intro": "Maya logs in at 9:00 sharp. Her My Open Tasks view shows about thirty items from the previous days — most of them routine kit follow-ups and one Generate HP POP that's been waiting since Friday. Then, between 9:02 and 9:20, three new items appear. Walk through them in order.",
        "noteText": "9:02am  ▸  Inbound SMS from Roberto (Follow-Up #3, Tier 1): \"Got your message, can we talk later this week?\"\n9:15am  ▸  Kit Rcvd task — kit from Carmen arrived in yesterday afternoon's mailroom run, not yet processed.\n9:20am  ▸  Generate HP POP — Tomas. Kit was processed Monday; ready for HP POP drafting.",
        "steps": [
          {
            "text": "Three new items have appeared in Maya's queue this morning. The pre-existing thirty tasks are mostly routine kit follow-ups. Looking at IAKARF order, **which of the three new items should Maya handle first?**",
            "question": "Which item gets touched first?",
            "options": [
              "The 9:02 SMS from Roberto — inbound correspondence is the top of the IAKARF stack.",
              "The 9:15 Kit Rcvd from Carmen — newly received kits have a 24-hour KPI clock running.",
              "The 9:20 Generate HP POP for Tomas — drafting work is more cognitively demanding and should happen when she's fresh.",
              "The pre-existing follow-up tasks from Friday — anything that's been sitting longest goes first."
            ],
            "correctIndex": 0,
            "feedback": "Roberto first. **I — Inbound Correspondence** is the top of the IAKARF stack, and the 24-hour response clock is running from 9:02. Even a holding response (\"Got your message, sending you a Calendly link now\") satisfies the SLA. The Generate HP POP for Tomas is real work but it's 'A — Administrative Assignments,' four levels down. The Kit Rcvd is also KPI work but inbound trumps it."
          },
          {
            "text": "Maya pulls up Roberto's account. He's a returning client at Follow-Up #3 — they've been playing phone tag for two weeks. He's clearly trying to reach out; she just needs to make a connection happen.",
            "question": "What's the right response to Roberto's SMS?",
            "options": [
              "Call him back immediately, even though he asked for \"later this week.\"",
              "Text back \"Sounds good!\" and wait for him to follow up with a specific time.",
              "Generate a Calendly draft-statement link via the SF flow and send it via SMS *and* email, with a brief note that he can pick any time that works.",
              "Email him a list of times Maya has available."
            ],
            "correctIndex": 2,
            "feedback": "Calendly via SMS + email. Roberto asked for \"later this week\" — that's an explicit ask for asynchronous scheduling, not a callback. The single-use Calendly link gives him the agency to pick a time, removes the phone-tag problem, and the dual-channel send (SMS + email) is the team default. Calendly is a Salesforce flow — pick the role, pick the meeting type (likely 'general follow-up' or 'draft statement' depending on where Roberto is in the process), edit the template if needed, send. **All inbound is responded to within 24 hours; in practice, do it now and move on.**"
          },
          {
            "text": "Roberto's Calendly is sent. It's now 9:05. The Kit Rcvd for Carmen and the Generate HP POP for Tomas are both still open. There are also about thirty pre-existing tasks on the list, including five Follow-Up 5+ items on Tier 2 outstanding kits.",
            "question": "What's the right next move?",
            "options": [
              "Tackle the Kit Rcvd for Carmen — newly received kits have a 24-hour KPI clock and 'A — Applications and Completed Kits' is the next IAKARF tier after Inbound.",
              "Knock out the five Follow-Up 5+ items first — they've been waiting longest and are about to escalate.",
              "Start on Tomas's HP POP draft while Maya is fresh — drafting is the highest-cognitive-load work.",
              "Refresh the Mail Received report to see if anything else came in."
            ],
            "correctIndex": 0,
            "feedback": "Carmen's kit. **A — Applications and Completed Kits** is the second tier of IAKARF, and there's a 24-hour clock running on Carmen's kit from yesterday's mailroom run. Tomas's HP POP draft (a great instinct to want to do while fresh, but) is 'A — Administrative Assignments,' four levels down. The Tier 2 Follow-Up 5+ items are 'K — Kit Follow-ups' and are next after the kit processing is done. The IAKARF stack works because it lines up with where the firm's KPIs live: inbound responsiveness and same-day kit-processing are what reports flag first."
          }
        ]
      }
    },

    // ── Card 6: Content — The 24-Hour Standard ───────────────────────
    {
      "id": "twenty-four-hour-standard",
      "nav": "The 24-Hour Standard",
      "type": "content",
      "data": {
        "title": "The 24-Hour Standard",
        "subtitle": "What the SOP says, and what the firm expects",
        "blocks": [
          {
            "type": "paragraph",
            "text": "If you read the Client Onboarding SOP and the Mail Processing SOP, you'll see the phrase **\"1–2 business days\"** show up several times — for kit processing, for mail review, for inbound response. That language is technically correct: it's the floor."
          },
          {
            "type": "paragraph",
            "text": "**The firm's actual standard is 24 hours.** Inbound responses, kit processing, application submission once HP POP is in — the goal is always 24 hours. Reports flag accounts as out of compliance only past **48 hours**, which gives some breathing room for weekends and out-of-office days, but the 48-hour mark is the alarm, not the target."
          },
          {
            "type": "callout",
            "style": "info",
            "icon": "🎯",
            "text": "**24 hours is the goal. 48 hours is the floor.** If you're consistently working at the 48-hour mark, your reports look fine but your clients are waiting longer than they should be. The whole pathway works on this principle — every cadence in this module assumes you're meeting the 24-hour target on the things in front of you."
          },
          {
            "type": "subheading",
            "text": "Why this matters more than it sounds"
          },
          {
            "type": "paragraph",
            "text": "The clients on your caseload are dealing with **serious illnesses related to a 25-year-old trauma**. Some of them have been waiting decades for help. Some of them are in active treatment. Some of them are anxious by temperament; some are anxious because their cancer is progressing."
          },
          {
            "type": "paragraph",
            "text": "**Every hour they spend wondering whether anyone is working on their case is an hour of unnecessary worry.** The 24-hour standard isn't an arbitrary KPI — it's the firm's commitment to the client experience. The reports exist because the standard exists, not the other way around."
          },
          {
            "type": "paragraph",
            "text": "There will be days you can't hit it. A snow day, a sick day, a Friday afternoon kit that physically can't be processed until Monday. **48 hours absorbs those.** What 48 hours doesn't absorb is a pattern. If you're consistently at 36–48 hours on inbound responses, that's a problem to surface to your supervisor, not to ride."
          }
        ]
      }
    },

    // ── Card 7: Content — The Cadence Ramp ───────────────────────────
    {
      "id": "cadence-ramp",
      "nav": "The Cadence Ramp",
      "type": "content",
      "data": {
        "title": "The Cadence Ramp",
        "subtitle": "The rhythm gets faster as the client gets closer to submission",
        "blocks": [
          {
            "type": "paragraph",
            "text": "One of the things that surprises new CA I's is how the **tempo of the role changes** depending on where the client is in the journey. The intro and kit-outstanding phase is patient and weekly. By the time you're chasing signed Health Program Statements, you might be calling and texting daily."
          },
          {
            "type": "image",
            "src": "[NEEDS ASSET: SVG horizontal timeline visualization. Five labeled stages left to right: 'Kit Outstanding', 'HP POP Generation', 'Awaiting Statements', 'Application Submitted', 'Awaiting Enrollment'. Each stage shows its cadence as a visual frequency (e.g., dots representing follow-up attempts — sparse dots for weekly Tier 1, denser for daily). Color gradient from cool/calm (left) to hot/urgent (middle) back to cool (right) to convey the ramp shape.]",
            "alt": "Cadence ramp timeline showing follow-up frequency through the client journey",
            "caption": "Cadence is shaped like a wave: builds toward HP POP return, peaks there, settles back down post-submission."
          },
          {
            "type": "subheading",
            "text": "The cadence by stage"
          },
          {
            "type": "paragraph",
            "text": "**Kit Outstanding (Tier 1):** 1.5–2 weeks between follow-ups. Tier 1 clients have shorter illness latencies on their conditions, so we move a little faster."
          },
          {
            "type": "paragraph",
            "text": "**Kit Outstanding (Tier 2):** 2.5–3 weeks between follow-ups. Same protocol, longer breathing room."
          },
          {
            "type": "paragraph",
            "text": "**Generate HP POP (drafting through return):** 1 week minimum cadence per the SOP. **In practice, often daily** once drafts are with the client and witnesses — these statements are the last block before the application can go out, and clients respond well to the urgency. Maya texts twice and calls once on busy weeks. After 5+ unsuccessful HP POP attempts, the account flags as Inactive — Unresponsive (no statements mailed) or Inactive — Low Engagement (mailed but not returned)."
          },
          {
            "type": "paragraph",
            "text": "**Post-Application WTCHP Confirmation:** 4 weeks before the first follow-up — the WTCHP simply needs that long to process. Then **weekly** until enrollment is confirmed, suspended, or denied. After 3 unsuccessful attempts, supervisor initiates a LexisNexis search; after 5 consecutive unresponsive, the account is flagged for disengagement."
          },
          {
            "type": "callout",
            "style": "info",
            "icon": "🌊",
            "text": "**Why the wave shape?** The kit-out phase is patient because the client controls the timeline (they have to physically fill out and return paperwork). HP POP is urgent because **you** control the timeline (drafts go out, signatures come back, application goes in). Post-application is patient again because the **WTCHP** controls the timeline (we're waiting on a federal program). Knowing whose hands the ball is in tells you how often to check in."
          }
        ]
      }
    },

    // ── Card 8: Matching — Match the Cadence to the Stage ────────────
    {
      "id": "match-cadence",
      "nav": "Match: Cadence by Stage",
      "type": "matching",
      "data": {
        "label": "Interactive Exercise",
        "instruction": "Click a client situation on the left, then click its expected follow-up cadence on the right.",
        "pairs": [
          { "left": "Outstanding kit, Tier 1 client", "right": "1.5–2 weeks between follow-ups" },
          { "left": "Outstanding kit, Tier 2 client", "right": "2.5–3 weeks between follow-ups" },
          { "left": "HP POP drafted and out for signature", "right": "1 week SOP, often daily in practice" },
          { "left": "WTCHP application just submitted", "right": "4 weeks, then weekly until status known" },
          { "left": "Client engulfed in dust cloud, urgent kit follow-up flagged High Priority", "right": "Top of K-tier in IAKARF — every cycle" }
        ],
        "successMessage": "Matched. Notice the wave shape: patient → urgent → patient. The cadence isn't arbitrary — it tracks who controls the next move at each stage."
      }
    },

    // ── Card 9: Content — Task Naming ───────────────────────────────
    {
      "id": "task-naming",
      "nav": "Task Naming Conventions",
      "type": "content",
      "data": {
        "title": "Task Naming: Talking to Your Future Self",
        "subtitle": "Why what you call a task matters as much as what's in it",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Every task you set in Salesforce has three audiences: **you** (when you come back to it next week), **your supervisor** (during their weekly review), and **the next CA** (when an account is reassigned, or when a CA II inherits the file at certification). A good task name tells all three of them what's happening at a glance."
          },
          {
            "type": "subheading",
            "text": "The conventions, with examples"
          },
          {
            "type": "paragraph",
            "text": "**\"Follow Up #N — Tier #\"** — Set on PI outstanding kit accounts that need to mail back kit documents. The number tracks the attempt count; the tier tells the supervisor (and you) which cadence applies. Example: *Follow Up #3 — Tier 1*."
          },
          {
            "type": "paragraph",
            "text": "**\"Kit Rcvd / Process Kit\"** — Set when a kit comes in but you can't process it immediately. **Must be closed within 24 hours** (next business day at the latest). This is the first task name you'll learn to dread when it backs up."
          },
          {
            "type": "paragraph",
            "text": "**\"Resend [Doc Type]\"** — Set after kit processing reveals a document that came back wrong. Example: *Resend Exhibit A*. **Always contact the client before marking this task complete** — you're sending a new document, they need to know to expect it."
          },
          {
            "type": "paragraph",
            "text": "**\"Generate HP POP #N\"** — Set after kit processing, when you've confirmed the client needs WTCHP enrollment (i.e., they're not already enrolled or already certified). The number tracks attempts to draft and send the statements."
          },
          {
            "type": "paragraph",
            "text": "**\"Resolve Suspension/Denial\"** — Set after kit processing, when the client's WTCHP application was suspended or denied (often because they self-enrolled before retaining the firm). Different workflow from Generate HP POP."
          },
          {
            "type": "paragraph",
            "text": "**\"WTCHP Enrollment Request — READY\"** — Set when all three signed POP documents are back and the application can be submitted. Like Kit Rcvd, this **must be closed within 24 hours**."
          },
          {
            "type": "paragraph",
            "text": "**\"Follow Up — WTCHP\"** — Post-application, set 4–6 weeks after the application sent date. Tracks the slow-cadence wait for WTCHP to process."
          },
          {
            "type": "paragraph",
            "text": "**\"Pre-Appointment Call\"** — Set after enrollment confirmation, when the client has a clinic and an IHE scheduled. This is the **MS handoff** — you're flagging the file for a Medical Specialist to take over."
          },
          {
            "type": "paragraph",
            "text": "**\"Client Follow-Up #N — [Reason]\"** — Catch-all for client-account follow-ups that aren't WTCHP-enrollment-specific. The reason in brackets is what makes this name useful. Example: *Client Follow-Up #2 — Awaiting medical records release*."
          },
          {
            "type": "paragraph",
            "text": "**\"GCL\"** and **\"FNL\"** — Tasks you set **for your supervisor** (not yourself) after 4 unresponsive attempts (GCL — General Contact Letter) or 8 unresponsive attempts (FNL — Final Notification Letter). These trigger supervisor-level outreach and start the disengagement clock."
          },
          {
            "type": "paragraph",
            "text": "**\"Inactive — Unresponsive\"** and **\"Inactive — Low Engagement\"** — Self-set monthly tasks for accounts that have stalled at the HP POP phase. Unresponsive = HP POP never mailed (5+ failed contact attempts). Low Engagement = HP POP mailed but not returned (5+ Calendly links sent, no return)."
          },
          {
            "type": "callout",
            "style": "warn",
            "icon": "✏",
            "text": "**The goal is glanceability.** A supervisor reviewing thirty open tasks should be able to skim the names and know what's going on. \"Follow up\" alone tells them nothing. \"Follow Up #3 — Tier 1\" tells them this client is partway through the outstanding-kit cadence and not yet in escalation territory."
          }
        ]
      }
    },

    // ── Card 10: Quiz — Pick the Right Task Name ─────────────────────
    {
      "id": "quiz-task-name",
      "nav": "Check: Task Naming",
      "type": "quiz",
      "data": {
        "label": "Knowledge Check",
        "context": "Maya just finished a Generate HP POP call with Carmen — they walked through the exposure narrative, identified two witnesses, and Maya is going to draft the WVA and TPAs this afternoon. Carmen is a Tier 1 client.",
        "question": "Maya needs to set a follow-up task on Carmen's account for next week, to chase the signed statements. What's the right task name?",
        "options": [
          "Follow Up #1 — Tier 1",
          "Generate HP POP #2",
          "Client Follow-Up #1 — Awaiting signed POP statements",
          "WTCHP Enrollment Request — READY"
        ],
        "correctIndex": 1,
        "feedbackCorrect": "Generate HP POP #2. The convention is to keep the same task family (Generate HP POP) and increment the number — this tracks the attempt count cleanly and tells anyone reviewing the file that Carmen is at the HP POP phase, on attempt 2. \"Follow Up #1 — Tier 1\" is for outstanding kits, which Carmen has already returned. The catch-all \"Client Follow-Up\" name would work but loses the structural information. \"WTCHP Enrollment Request — READY\" is for after all three statements are back and the application can be submitted.",
        "feedbackIncorrect": "Look at the convention list again. Carmen has already returned her kit (so she's past Follow Up — Tier #) and her statements aren't back yet (so she's not at WTCHP Enrollment Request — READY). She's mid-HP POP, on her second attempt to chase the signed documents.",
        "reviewCardIndex": 8,
        "retryQuestion": "A different client, Daniel, just had his kit arrive in this morning's mailroom run. Maya has back-to-back Generate HP POP calls scheduled and won't be able to process Daniel's kit until tomorrow morning. What task should she set?",
        "retryOptions": [
          "Follow Up #1 — Tier 2",
          "Kit Rcvd / Process Kit (closed by EOD tomorrow)",
          "Generate HP POP #1",
          "Client Follow-Up #1 — New kit"
        ],
        "retryCorrectIndex": 1,
        "retryFeedbackCorrect": "Kit Rcvd / Process Kit. The 24-hour clock is running from when the kit arrived; setting a Kit Rcvd task that closes by end of day tomorrow keeps her inside the window without lying about completing today's work.",
        "retryFeedbackIncorrect": "The Kit Rcvd / Process Kit convention exists for exactly this situation — a kit that came in but can't be processed in the same hour. Setting that task name signals (to her, to her supervisor, to the system) that the 24-hour clock is acknowledged."
      }
    },

    // ── Card 11: Content — Escalation: GCL → FNL → No Case ───────────
    {
      "id": "escalation",
      "nav": "Escalation: GCL → FNL",
      "type": "content",
      "data": {
        "title": "When the Cadence Stops Working",
        "subtitle": "Unresponsive clients, supervisor escalation, and the path to disengagement",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Most clients respond. Some do not. The cadence is designed to **fail loudly** when it isn't working — there are explicit triggers at 4 unresponsive attempts, 8 unresponsive attempts, and again at the disengagement decision."
          },
          {
            "type": "subheading",
            "text": "The escalation ladder"
          },
          {
            "type": "image",
            "src": "[NEEDS ASSET: SVG flow diagram — vertical ladder showing Follow-Up 1-4 → GCL trigger → Follow-Up 5-8 → FNL trigger → Disengagement decision. Side branch off the FNL stage showing LexisNexis Search as supervisor-initiated. Each box labeled with the attempt count and the action that triggers.]",
            "alt": "Escalation ladder showing GCL and FNL triggers at 4 and 8 unresponsive attempts",
            "caption": "Most clients move forward before reaching FNL. The ones who don't, your supervisor takes over."
          },
          {
            "type": "paragraph",
            "text": "**After 4 unresponsive follow-up attempts:** You set a **GCL** task on your supervisor. GCL = General Contact Letter. The supervisor sends a letter that escalates the firm's outreach — same content as your follow-ups, but on letterhead, signed by the supervisor. This often shakes loose a response from clients who've been letting voicemails pile up."
          },
          {
            "type": "paragraph",
            "text": "**After 8 unresponsive follow-up attempts:** You set an **FNL** task on your supervisor. FNL = Final Notification Letter. This is the formal warning that the firm will move toward disengagement if there's no response. Around the same time, the supervisor may initiate a **LexisNexis search** to confirm the client's contact information hasn't changed (or, sometimes, that the client hasn't passed away)."
          },
          {
            "type": "paragraph",
            "text": "**After FNL with no response:** The account is either marked **\"No Case — Unresponsive\"** (for outstanding-kit accounts) or moved to disengagement per the Client Disengagement SOP."
          },
          {
            "type": "callout",
            "style": "info",
            "icon": "🔍",
            "text": "**Detective work happens between the GCL and FNL.** Check Salesforce for alternative phone numbers and emails. Reach out to the emergency contact in Related Contacts. Reach out to identified witnesses — they sometimes know how to reach the client. Google for an obituary. The LexisNexis search is the supervisor's tool, but the same instinct applies to you: when the cadence isn't working, ask whether the contact info is still right."
          },
          {
            "type": "callout",
            "style": "warn",
            "icon": "⚠",
            "text": "**Disengagement specifics — the actual paperwork, the wellness check-in, the inappropriate-interaction protocol — are covered in a later module.** For now, your job is to recognize the GCL and FNL triggers and set those tasks for your supervisor at the right times. The supervisor handles the rest."
          }
        ]
      }
    },

    // ── Card 12: Scenario — The Unresponsive Client ──────────────────
    {
      "id": "scenario-unresponsive",
      "nav": "Apply It: Unresponsive Client",
      "type": "scenario",
      "data": {
        "title": "An Unresponsive Client: Three Decision Points",
        "subtitle": "Maya works through the escalation ladder with one client over three months",
        "intro": "Eduardo retained the firm in early March. His kit went out March 8th. It is now mid-June. He has not returned the kit. Walk through three points in his cadence and decide what Maya should do at each.",
        "steps": [
          {
            "text": "It's April 21st. Maya has done **Follow-Ups 1, 2, 3, and 4** on Eduardo's outstanding kit — all attempted by phone, email, and text. Eduardo answered the phone briefly during Follow-Up 1 (\"yeah I'll send it back, sorry, busy week\") but has been silent since. He's a Tier 1 client.",
            "question": "What's Maya's correct next move?",
            "options": [
              "Continue the cadence — set Follow-Up #5 — Tier 1 for two weeks out.",
              "Set a GCL task for her supervisor; resume the cadence with Follow-Up #5 after the GCL goes out.",
              "Set an FNL task immediately, since Eduardo gave a verbal commitment he didn't keep.",
              "Mark the account \"No Case — Unresponsive\" and move on."
            ],
            "correctIndex": 1,
            "feedback": "Set a GCL task for the supervisor, then resume the cadence. The 4-attempt threshold is the GCL trigger — that's a hard rule, not a judgment call. The supervisor's letter often produces a response. Maya doesn't *stop* her own cadence while the GCL is in flight; she keeps Follow-Up #5 scheduled for two weeks out (Tier 1 cadence). FNL is the 8-attempt threshold, not the 4-attempt one. \"No Case — Unresponsive\" comes after FNL with no response."
          },
          {
            "text": "The GCL went out on April 23rd. Maya did Follow-Ups #5, 6, 7, and 8 over the following six weeks (Tier 1 cadence, 1.5–2 weeks each). It is now June 18th. Eduardo has not responded to the GCL or any of the four follow-ups. Maya checks Salesforce — his phone number and email haven't been updated since intake.",
            "question": "What does Maya do?",
            "options": [
              "Continue the cadence indefinitely — eventually he'll respond.",
              "Set an FNL task for her supervisor and flag the account for a LexisNexis search.",
              "Call the emergency contact listed on the account directly to ask about Eduardo.",
              "Email her supervisor a long memo about the case and wait for instructions."
            ],
            "correctIndex": 1,
            "feedback": "FNL task plus LexisNexis flag. Eight unresponsive attempts is the FNL trigger, full stop. The LexisNexis search is the supervisor's call to initiate but it's appropriate to flag it now — the contact info hasn't been updated and there may be something the firm doesn't know (a move, a hospitalization, a death). The emergency contact and witness outreach are good detective tactics, but they belong **between** GCL and FNL, not after FNL — and they're typically supervisor-coordinated to avoid the firm reaching out to the wrong people in the wrong order."
          },
          {
            "text": "Two weeks after the FNL, the LexisNexis search results come back. Eduardo's address and phone are unchanged from intake. There is no obituary. The supervisor has determined there's no valid reason to extend the cadence further.",
            "question": "What's the final step?",
            "options": [
              "Mark Eduardo's account \"No Case — Unresponsive\" — this is the standard outcome for an outstanding-kit account that exhausts the cadence with no response.",
              "Maya personally drives to Eduardo's address to do a wellness check.",
              "Reset the cadence to Follow-Up #1 and try again — sometimes timing changes things.",
              "Move the account to CA II for VCF claim building anyway."
            ],
            "correctIndex": 0,
            "feedback": "\"No Case — Unresponsive\" is the right outcome here. The cadence ran its course; the GCL and FNL went out; LexisNexis confirmed the contact info is still good (so it's not a missing-client problem); the client has chosen not to engage. Marking the account this way preserves the file (the client can re-engage later if they want) without keeping it as active work on Maya's caseload. The wellness-check approach belongs to a different protocol entirely (the inappropriate-interaction / wellness-check SOP, covered in a later module). Resetting the cadence indefinitely is a kindness in theory but a real cost in practice — it ties up Maya's bandwidth that should be going to clients who do respond."
          }
        ]
      }
    },

    // ── Card 13: Final Assessment ────────────────────────────────────
    {
      "id": "assessment",
      "nav": "Final Assessment",
      "type": "assessment",
      "data": {
        "title": "Final Assessment",
        "subtitle": "Five questions",
        "questions": [
          {
            "question": "It's 9:30 on a Tuesday morning. Maya's queue has: (a) an inbound email from a client at Follow-Up #2 asking when she'll get her clinic assignment, (b) a Generate HP POP task that was set yesterday and not yet started, (c) a Kit Rcvd task from this morning's mailroom run, (d) three Tier 2 outstanding-kit Follow-Up #3 tasks. Per IAKARF, what's the right order?",
            "options": [
              "(a) → (c) → (b) → (d)",
              "(c) → (a) → (b) → (d)",
              "(a) → (b) → (c) → (d)",
              "(d) → (c) → (a) → (b)"
            ],
            "correctIndex": 0,
            "feedback": "Inbound first (a), then completed kits (c), then administrative drafting (b), then routine kit follow-ups (d). IAKARF order in action: I → A (Apps/Kits) → A (Admin) → K → R → F. The Generate HP POP draft is hugely important work but it's the *fourth* tier of IAKARF, after inbound and completed kits."
          },
          {
            "question": "A client emails Maya at 4:55pm on a Friday with a question about their kit. Per the firm's response standards, by when should Maya respond?",
            "options": [
              "Same day — within an hour.",
              "Within 24 hours, so by Saturday at 5pm.",
              "Within 24 hours of the next business day — so end of day Monday.",
              "Within 48 hours of receipt — that's the floor and there's no harm in using it."
            ],
            "correctIndex": 2,
            "feedback": "End of day Monday. The 24-hour clock pauses for the weekend (Maya is off, the firm is closed) and resumes Monday morning. The 48-hour reporting floor catches accounts that go past the standard but absorbs weekends and OOO. The point isn't to use 48 hours as a target — it's there to catch genuine outliers."
          },
          {
            "question": "Maya is looking at a client's Salesforce account. The most recent task on file says \"Follow Up #5 — Tier 2\" and was completed two weeks ago. What does this tell her about the client's status, at a glance?",
            "options": [
              "The client has a Tier 2 illness and is still in the outstanding-kit phase, on attempt 5 of the cadence — a GCL has likely been sent.",
              "The client has had 5 phone conversations with the firm.",
              "The client is past the FNL trigger and disengagement is imminent.",
              "The task name doesn't carry enough information to draw conclusions."
            ],
            "correctIndex": 0,
            "feedback": "Tier 2 outstanding kit, attempt #5. By the team's conventions, Follow-Up #5 means the cadence is in its second cycle (1-4 then 5-8) and a GCL was triggered between #4 and #5. The task name is doing exactly what it's supposed to do: tell Maya the client's whole situation in five words. The clean naming pays off here."
          },
          {
            "question": "A client at Follow-Up #3 sends Maya an SMS asking to talk \"sometime later this week.\" What's the team's standard response?",
            "options": [
              "Call the client back immediately to nail down a time.",
              "Send a Calendly single-use link via SMS and email so the client can self-schedule.",
              "Reply by SMS with three time slots Maya is available.",
              "Do nothing until the client follows up with a specific time."
            ],
            "correctIndex": 1,
            "feedback": "Calendly via SMS + email. The Salesforce flow generates a single-use link based on role and meeting type. The dual-channel send is the team default unless there's a known preference. Calendly removes the phone-tag friction and gives the client agency to pick a time. The client can only receive a Calendly link if they're a Related Contact on the account, which they are (clients are the primary contact on living accounts)."
          },
          {
            "question": "Maya has just finished her 8th unresponsive follow-up attempt on an outstanding kit. The client is Tier 2 and last had real contact with the firm three months ago. What does Maya do now?",
            "options": [
              "Mark the account \"No Case — Unresponsive\" — eight attempts is the disengagement threshold.",
              "Set an FNL task for her supervisor and flag the account for a LexisNexis search.",
              "Set a GCL task for her supervisor — this is the first formal escalation.",
              "Continue the cadence — there's no automatic action at attempt #8."
            ],
            "correctIndex": 1,
            "feedback": "FNL task plus LexisNexis flag. The 8-attempt threshold is the FNL trigger; the supervisor's Final Notification Letter starts the formal disengagement clock. Marking the account \"No Case — Unresponsive\" comes *after* the FNL produces no response, not at the 8-attempt point itself. GCL was the 4-attempt trigger. The cadence does not run indefinitely — escalation is a feature, not an interruption."
          }
        ]
      }
    },

    // ── Card 14: Completion ─────────────────────────────────────────
    {
      "id": "complete",
      "nav": "Module Complete",
      "type": "completion",
      "data": {}
    }

  ]
};
