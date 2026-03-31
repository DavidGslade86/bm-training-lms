export const MODULE4 = {
  cards: [

    // ─── CARD 0: STORY ───
    {
      id: "m4-story",
      nav: "Two Files, Two Problems",
      type: "story",
      data: {
        character: "Marcus & Delores",
        portrait: "M",
        portraitColor: "#63656a",
        headline: "Not every file comes with a clear path to proof.",
        body: [
          "Yajaira had a specific address, a still-operating employer to contact, and former coworkers willing to talk. Her Proof of Presence package will take work — but the path is visible.",
          "Now meet Marcus and Delores. Same goal. Harder road.",
          "Marcus R. worked as a responder with a private debris cleanup crew starting September 13, 2001. He was a union member. His employer went out of business years ago. He has one former coworker he's stayed in touch with, his brother who worked the same site, a few old work badges, and a dispatch record he found in a box. He was recently diagnosed with non-Hodgkin lymphoma.",
          "Delores V. lived on Rector Street in Lower Manhattan from 1998 through 2004. She has her original lease agreement and old tax returns with her Rector Street address. She still knows a few people from the building — her son Daniel, who also lived there through 2003, a neighbor named Gloria who has lived in the building since 1995, and a younger neighbor named Jaylen who recently graduated from college and has lived in the building his whole life. She was diagnosed with chronic rhinosinusitis in 2005.",
          "Both need Proof of Presence. Neither has a straightforward path to primary evidence. Your job is to know how to think about it.",
        ],
        closing: "By the end of this module you'll understand what Proof of Presence is and why it matters, which clients don't need it at all, how to think about the two categories of POP evidence and what to submit in each situation, and the basic rules around witness statements.",
        objectives: [
          "Which clients don't need to prove presence — and why",
          "The difference between sufficient primary evidence and non-sufficient primary evidence",
          "What makes an EVL or TPV sufficient on its own",
          "When and why to submit non-sufficient primary evidence",
          "The rules around witness statements",
        ],
      },
    },

    // ─── CARD 1: NO POP NEEDED ───
    {
      id: "m4-no-pop",
      nav: "No POP Needed",
      type: "content",
      data: {
        title: "Before You Start — Some Clients Don't Need POP",
        subtitle: "Check these categories first",
        intro: "Before building any POP package, confirm whether your client actually needs one. For a specific group of clients, the VCF already has what it needs.",
        blocks: [
          {
            type: "subheading",
            text: "Employers with direct VCF relationships",
          },
          {
            type: "paragraph",
            text: "For clients employed by certain organizations, the VCF obtains presence information directly from the employer. No POP collection is needed. Examples include FDNY uniformed firefighters, Consolidated Edison, CWA Local 1101, Port Authority of New York and New Jersey, New York City Department of Sanitation, City of Albany Fire Department, Arlington County Fire Department, Shanksville Volunteer Fire Department, and New Rochelle Police Department, among others.",
          },
          {
            type: "paragraph",
            text: "If we happen to have POP on file for clients at these organizations, do not submit it unless the VCF specifically requests it.",
          },
          {
            type: "callout",
            style: "info",
            icon: "📋",
            text: "This is not a complete list. Before deciding how to approach POP for any client, check policies and procedures and the relevant entity account in Salesforce — both will tell you whether a specific employer has a direct relationship with the VCF and what, if anything, is needed.",
          },
          {
            type: "subheading",
            text: "VCF1 clients",
          },
          {
            type: "paragraph",
            text: "Claimants who received a VCF1 award generally do not need to re-prove presence for a VCF2 claim. Their presence was already established in the original proceeding. The VCF will contact us if any additional information is needed.",
          },
          {
            type: "callout",
            style: "warn",
            icon: "⚠️",
            text: "A VCF1 award does not mean the client is enrolled or certified in the WTCHP. They may still need to go through the Health Program enrollment and certification process for any new condition they are claiming — that process is separate from the presence question.",
          },
        ],
      },
    },

    // ─── CARD 2: THE TWO CATEGORIES ───
    {
      id: "m4-two-categories",
      nav: "The Two Categories",
      type: "content",
      data: {
        title: "Proof of Presence — The Two Categories",
        subtitle: "Sufficient primary evidence and non-sufficient primary evidence",
        intro: "Proof of Presence is the documentation we submit to establish that a claimant was in the 9/11 exposure zone during the exposure period. For the VCF, that window is September 11, 2001 through May 30, 2002, in the NYC exposure zone — south of Canal Street, west of Clinton Street, river to river. The WTCHP has a different, larger zone and a longer window; we covered those in Module 2.",
        blocks: [
          {
            type: "paragraph",
            text: "Not all POP documents carry the same weight. There are two categories that determine how you build every POP package.",
          },
          {
            type: "comparison-table",
            headers: ["", "Sufficient primary evidence", "Non-sufficient primary evidence"],
            rows: [
              ["What it is", "Documents from an authoritative source that directly attest to presence with specific dates and location", "Documents that show connection to a location — financial, employment, residential — without directly attesting to physical presence"],
              ["Examples", "EVL, TPV, certified school transcript, qualifying residence verification letter", "Tax returns, pay stubs, lease agreements, utility bills, work badges, union rosters without location detail, dispatch records, photos"],
              ["What you submit with it", "Nothing else required — sufficient on its own when properly executed and sent directly to VCF", "Two eyewitness Witness Presence Statements"],
              ["Still required for workers?", "Document EVL/TPV outreach attempt in cover letter", "Document EVL/TPV outreach attempt in cover letter"],
            ],
          },
          {
            type: "callout",
            style: "info",
            icon: "📌",
            text: "**The principle that governs all POP decisions:** Submit the strongest primary evidence available. If it is sufficient, submit it on its own. If it is not sufficient, submit it anyway with two eyewitness Witness Presence Statements — as long as it does not contradict other evidence already in the file or CMS. In either case, for clients who were workers, document your attempt to obtain an EVL or TPV before relying on anything else.",
          },
          {
            type: "subheading",
            text: "A note on workers",
          },
          {
            type: "paragraph",
            text: "For clients whose presence was based on employment, the VCF expects to see that we made an attempt to obtain an EVL or TPV from the employer before relying on witness statements. This applies even when the employer is defunct or unresponsive. Document every outreach attempt — call notes in Salesforce, email exchanges saved and uploaded — so we can show good faith effort. Without that documentation, witness-statement-only submissions from workers are more likely to generate Missing Information letters.",
          },
          {
            type: "subheading",
            text: "A note on residents",
          },
          {
            type: "paragraph",
            text: "For clients whose presence was based on residency, some form of primary evidence is also expected — a lease agreement, tax records, utility bills, official mail to the address in the exposure zone. These are non-sufficient on their own but establish the residential connection and should be collected and submitted alongside witness statements.",
          },
          {
            type: "subheading",
            text: "Supporting document status",
          },
          {
            type: "paragraph",
            text: "Once a document is confirmed sufficient and is on file in the CMS, close the supporting document record in Salesforce. A Closed status signals that the document has been received, reviewed, and is sufficient for its role in the claim — no further action needed. Don't leave supporting document records open after the document has done its job.",
          },
        ],
      },
    },

    // ─── CARD 3: SUFFICIENT PRIMARY EVIDENCE ───
    {
      id: "m4-sufficient",
      nav: "Sufficient Primary Evidence",
      type: "content",
      data: {
        title: "Sufficient Primary Evidence",
        subtitle: "What makes each document meet the standard",
        intro: "Several types of documents can be sufficient on their own when properly executed. Understanding what 'properly executed' means for each one is where mistakes get made.",
        blocks: [
          {
            type: "subheading",
            text: "Employment Verification Letter (EVL)",
          },
          {
            type: "paragraph",
            text: "A letter from an employer, on **company letterhead**, confirming the claimant's employment. To be sufficient it must: state the **specific address** where the claimant worked during the exposure period, confirm **dates of employment** that overlap with the VCF exposure window, come from someone with authority to attest to employment records, state either **full-time employment status or the hours worked at each location**, and be transmitted **directly to the VCF** at VCF.Thirdpartyverification@usdoj.gov with the subject line: Third Party Verification Form.",
          },
          {
            type: "callout",
            style: "info",
            icon: "📧",
            text: "**Our workflow:** We ask the employer to send the EVL to us first so we can review it for sufficiency. Once confirmed, we ask them to send directly to the VCF and CC us. We also include a copy in our submission — the VCF occasionally states they never received an EVL even when we were on the email chain. The document must also come directly from the employer. Sending it ourselves without the employer also transmitting it directly is not sufficient.",
          },
          {
            type: "subheading",
            text: "Third Party Verification Form (TPV)",
          },
          {
            type: "paragraph",
            text: "The VCF's standardized form, completed by an employer or organization. The same sufficiency standards apply — specific dates, specific location, full-time status or hours worked at each location, sent directly to VCF.Thirdpartyverification@usdoj.gov with the subject line: Third Party Verification Form. The same workflow applies: ask the organization to send to us first for review, then ask them to transmit directly to the VCF and CC us.",
          },
          {
            type: "subheading",
            text: "Union records",
          },
          {
            type: "paragraph",
            text: "Union work history records can be sufficient if the union submits them directly to the VCF and the record includes specific work location, dates, and is signed by someone with authority to attest to the member's work history. In practice, many union records don't include all of this — they may be general rosters without location detail. Check policies and procedures and the entity account in Salesforce before reaching out to a union, as many have specific processes and required forms. If what the union can provide doesn't meet the sufficiency standard, it is still worth collecting and submitting as non-sufficient primary evidence alongside witness statements, as long as it doesn't contradict the WPS.",
          },
          {
            type: "subheading",
            text: "Certified school transcript",
          },
          {
            type: "paragraph",
            text: "For claimants who were students during the exposure period. Must be certified by the school (official seal or registrar certification), and either sent directly to the VCF or submitted by us with a letter from the attorney confirming the document was received directly from the school and is unaltered. Must show enrollment at a school within the exposure zone during the exposure period.",
          },
          {
            type: "subheading",
            text: "Residence verification letter",
          },
          {
            type: "paragraph",
            text: "For residents, a letter from a building management company can be sufficient — but only if it specifically attests to physical presence during the exposure period, not just tenancy. A letter that confirms a lease existed is non-sufficient. A letter that explains how the management company knows the claimant was physically residing there during the exposure window is a different document. If the letter can't make that specific attestation, treat it as non-sufficient primary evidence.",
          },
          {
            type: "callout",
            style: "info",
            icon: "📋",
            text: "For any employer or organization, check policies and procedures and the Salesforce entity account before reaching out. Many have specific processes, preferred contacts, and required forms. The entity account is your first stop — it will tell you exactly how to proceed for that organization.",
          },
        ],
      },
    },

    // ─── CARD 4: NON-SUFFICIENT PRIMARY EVIDENCE ───
    {
      id: "m4-non-sufficient",
      nav: "Non-Sufficient Primary Evidence",
      type: "content",
      data: {
        title: "Non-Sufficient Primary Evidence",
        subtitle: "Submit it — just know its limits and never let it contradict",
        intro: "When sufficient primary evidence isn't available, we don't stop there. We collect the best evidence we can get and submit it — alongside witness statements where required. The goal is always to show the VCF the most complete and consistent picture possible.",
        blocks: [
          {
            type: "paragraph",
            text: "Non-sufficient primary evidence includes: tax returns showing an employer's name or a residential address, pay stubs, lease agreements, utility bills, official mail to an address in the exposure zone, work ID badges, dispatch records, union rosters without sufficient location detail, photos, and other contemporaneous documents.",
          },
          {
            type: "paragraph",
            text: "These documents support the story. A tax return showing the claimant's address on Rector Street doesn't prove they were physically present there — but it contributes to the picture. A work badge doesn't confirm hours or location in the way an EVL would — but it shows a real employment connection to the site. Collect everything. Submit the strongest available.",
          },
          {
            type: "subheading",
            text: "How to decide what to submit",
          },
          {
            type: "latency-list",
            items: [
              {
                time: "Sufficient primary evidence obtained",
                desc: "Submit the document on its own. For workers, include documentation of EVL/TPV outreach in the cover letter. Close the supporting document record.",
              },
              {
                time: "Non-sufficient primary evidence only",
                desc: "Submit it alongside two eyewitness WPS. For workers, include documentation of EVL/TPV outreach attempts. Make sure the documents and witness statements tell a consistent story.",
              },
              {
                time: "No primary evidence at all",
                desc: "Two eyewitness WPS with documented EVL/TPV outreach attempts for workers. Claims with only witness statements and no primary evidence are more likely to generate Missing Information letters given the VCF's current enforcement.",
              },
            ],
          },
          {
            type: "callout",
            style: "warn",
            icon: "⚠️",
            text: "**Never submit a document that contradicts other evidence already in the file or in the CMS.** An ID badge that places the claimant at a different location than the one in the witness statements, a tax record with a different address than the WPS, a union roster that conflicts with dates in the EVL — any of these creates a problem that is harder to resolve than a gap. If something contradicts, hold it. Everything else that is the strongest available goes in.",
          },
          {
            type: "callout",
            style: "info",
            icon: "📋",
            text: "Call attempts and follow-up outreach for EVL/TPV requests should be noted in Salesforce and referenced in the POP cover letter. Saved email exchanges — especially any refusals or indications that records don't exist — should be uploaded to the CMS. This documentation is what we show the VCF to demonstrate good faith effort.",
          },
        ],
      },
    },

    // ─── CARD 5: WITNESS STATEMENTS ───
    {
      id: "m4-witnesses",
      nav: "Witness Statements",
      type: "content",
      data: {
        title: "Getting Witnesses",
        subtitle: "The VPS, the WPS, and what makes a statement usable",
        intro: "When non-sufficient primary evidence is all we can get — or when witness statements are needed alongside primary evidence — the quality of those statements matters enormously. Here is how to approach the process and what the rules are.",
        blocks: [
          {
            type: "subheading",
            text: "The Victim Presence Statement (VPS) — alignment first",
          },
          {
            type: "paragraph",
            text: "Before contacting witnesses, speak with the client. The VPS is a document the client completes describing their own presence — location, dates, hours, activities — but its primary purpose in our workflow is alignment, not submission.",
          },
          {
            type: "paragraph",
            text: "The VPS call accomplishes several things: it establishes the story we expect witnesses to corroborate, it jogs the client's own memory (details they haven't thought about in years often surface during a structured conversation), and it gives us a baseline to use when speaking with witnesses — \"your colleague said they worked at 120 Broadway during this period, does that match what you remember?\" That kind of structured follow-up helps witnesses recall specifics without putting words in their mouths.",
          },
          {
            type: "paragraph",
            text: "We generally don't submit the VPS unless it's the only evidence available. If we have two strong WPS, the VPS stays in the file.",
          },
          {
            type: "callout",
            style: "info",
            icon: "📞",
            text: "**Ask the client to reach out to witnesses first.** If they're still in touch with someone, encourage them to make contact before we do and share our phone number — so witnesses know the call is coming from a legitimate source and not a scammer.",
          },
          {
            type: "subheading",
            text: "Witness Presence Statements (WPS) — the rules",
          },
          {
            type: "tier-cards",
            tiers: [
              {
                name: "Minimum age",
                label: "Must have been 18+ on 9/11/2001",
                color: "#009bdf",
                bg: "#e6f5fc",
                border: "#b3dcf2",
                items: [
                  "Witnesses must have been at least 18 years old on September 11, 2001",
                  "Only exception: high school classmates submitting WPS for each other",
                  "When a witness seems young, calculate their age on 9/11 — don't assume",
                ],
              },
              {
                name: "Family members",
                label: "Acceptable — with one requirement",
                color: "#63656a",
                bg: "#f0f0f1",
                border: "#d0d0d3",
                items: [
                  "Family members can serve as witnesses",
                  "At least one witness must be non-family",
                  "Note the familial relationship in the WPS and in the cover letter",
                  "Do not submit only family witnesses",
                ],
              },
              {
                name: "Form and signature",
                label: "Correct form, hand-signed",
                color: "#3d7a56",
                bg: "#edf5f0",
                border: "#b8d5c4",
                items: [
                  "Effective February 1, 2023: affidavits no longer accepted",
                  "All statements must use the current VCF Witness Presence Statement form",
                  "Must be hand-signed — a clear photo or scan of the signed statement is acceptable",
                  "Electronic signatures not accepted",
                ],
              },
            ],
          },
          {
            type: "subheading",
            text: "What makes a WPS sufficient",
          },
          {
            type: "paragraph",
            text: "A Witness Presence Statement needs enough specificity to be independently verifiable. The witness must describe: where exactly they saw the claimant (specific address or cross streets), when (dates or date range), what the claimant was doing there, and how the witness knows this — what their own connection to the location was. Vague statements are not sufficient. Specific statements that place the claimant at a named address doing a specific activity during a specific period are what the VCF needs.",
          },
          {
            type: "yajaira-check",
            text: "For Yajaira, we need to attempt to get an EVL or TPV from her former employer at West Broadway. If that's successful and the document meets the standard and is sent directly to the VCF, that may be all we need. If it isn't — employer no longer exists, can't provide sufficient detail, doesn't respond — we document the attempt and build a two-WPS package from former coworkers who can place her at that specific location during the exposure period.",
          },
        ],
      },
    },

    // ─── CARD 6: MATCHING ───
    {
      id: "m4-matching",
      nav: "Match: Sufficient or Not?",
      type: "matching",
      data: {
        label: "Interactive Exercise",
        instruction: "Click a document type on the left, then click its category on the right.",
        pairs: [
          {
            left: "EVL on company letterhead, specific address and dates, sent directly to VCF by employer",
            right: "Sufficient primary evidence",
          },
          {
            left: "Certified school transcript sent directly by the school registrar",
            right: "Sufficient primary evidence",
          },
          {
            left: "Residence verification letter attesting to physical presence during exposure period, sent directly by management company",
            right: "Sufficient primary evidence",
          },
          {
            left: "Pay stubs showing employer name and address in exposure zone",
            right: "Non-sufficient primary evidence",
          },
          {
            left: "Lease agreement from the exposure period",
            right: "Non-sufficient primary evidence",
          },
          {
            left: "Union roster showing member name and general assignment, no specific address",
            right: "Non-sufficient primary evidence",
          },
          {
            left: "Work ID badge from a site in the exposure zone",
            right: "Non-sufficient primary evidence",
          },
          {
            left: "Tax return showing residential address in the exposure zone",
            right: "Non-sufficient primary evidence",
          },
          {
            left: "Victim Presence Statement",
            right: "Non-sufficient primary evidence",
          },
        ],
        successMessage: "The dividing line is always the same — does this come directly from an authoritative source with specific location and date confirmation? If yes, it may be sufficient on its own. If it shows connection to a location without directly attesting to physical presence, it is non-sufficient primary evidence and should be submitted alongside witness statements. Note: two eyewitness Witness Presence Statements can be sufficient to establish presence — but witness statements are in a separate category from primary evidence entirely.",
      },
    },

    // ─── CARD 7: QUIZ ───
    {
      id: "m4-quiz",
      nav: "Check: POP Strategy",
      type: "quiz",
      data: {
        label: "Knowledge Check",
        context: "A client situation:",
        question: "A claimant worked for Verizon in the NYC exposure zone during the exposure period. She has two former coworkers willing to serve as witnesses. What is the right first step?",
        options: [
          "Contact the two coworkers immediately — getting witnesses lined up first avoids delays later.",
          "Check the Verizon entity account in Salesforce and policies and procedures for the correct process to request an EVL or TPV, then follow that process. The entity account shows: email a signed EVL release form to hr-verify-records@verizon.com and include the VCF Third Party Verification Form pre-filled with the claimant's name and VCF number.",
          "Send a blank TPV form to Verizon and ask them to complete and return it to us directly.",
          "Submit the claim with two coworker WPS — Verizon is a large company and EVL requests can take a long time.",
        ],
        correctIndex: 1,
        feedbackCorrect: "Right. Policies and procedures and the Salesforce entity account are your first stop before contacting any employer. Verizon has a specific documented process. Following it correctly — using the pre-filled TPV form and the correct email address — gives us the best shot at sufficient primary evidence. The witness statements are the backup plan, not the starting point.",
        feedbackIncorrect: "For workers, we always attempt to get an EVL or TPV before building a witness-statement-only package. The specific process for each employer is in policies and procedures and the Salesforce entity account. Start there before contacting witnesses or sending anything.",
        reviewCardIndex: 3,
        retryQuestion: "A claimant's employer closed several years ago. We emailed a former HR contact and received a reply stating the company no longer maintains employment records from that period. We have two former coworkers ready to complete WPS. How should we proceed?",
        retryOptions: [
          "Wait and try additional outreach channels before proceeding — one email response isn't sufficient documentation.",
          "The employer response is exactly the documentation we need. Save the email exchange, note the outreach in Salesforce, upload it to the CMS, and proceed with two eyewitness WPS as the primary submission. Reference the outreach documentation in the POP cover letter.",
          "Since the employer is defunct, a note in Salesforce is sufficient — no need to upload the email exchange.",
          "Proceed with WPS only and note the defunct employer in the cover letter without uploading any documentation — the VCF will understand.",
        ],
        retryCorrectIndex: 1,
        retryFeedbackCorrect: "Correct. A written response confirming records don't exist is exactly the documentation we need. Save it, upload it to the CMS, and reference it in the cover letter. The standard is documented good faith effort — this satisfies it. Proceed with witnesses.",
        retryFeedbackIncorrect: "The email exchange is your evidence of good faith effort. Save it and upload it to the CMS — don't just note it in Salesforce. The cover letter should reference what we tried and what the outcome was.",
      },
    },

    // ─── CARD 8: SCENARIO ───
    {
      id: "m4-scenario",
      nav: "Apply It: Delores",
      type: "scenario",
      data: {
        title: "Building Delores's POP Package",
        subtitle: "Apply what you've learned",
        intro: "You know the concepts. Now apply them to Delores. Read each step carefully — all the information you need is provided in each question.",
        steps: [
          {
            text: "**Delores V.** lived at **45 Rector Street, Apartment 6C**, from 1998 through 2004. She is claiming **chronic rhinosinusitis** diagnosed in 2005. Her presence is based on **residency** — she was not employed in the exposure zone. She has a signed lease agreement for 45 Rector Street dated 1999, and 2001 and 2002 federal tax returns showing 45 Rector Street as her home address.",
            question: "What do her lease and tax returns tell us about her POP situation?",
            options: [
              "The lease and tax returns are sufficient primary evidence — they confirm she was a resident of an address in the exposure zone during the exposure period.",
              "The lease and tax returns are non-sufficient primary evidence. They show she was financially connected to the address but don't directly establish physical presence. We need either a sufficient residence verification letter or eyewitness WPS alongside this documentation.",
              "Tax returns from a government source are sufficient primary evidence on their own. The lease is non-sufficient.",
              "Both documents are non-sufficient. For residents, primary evidence documents don't count — only witness statements establish presence.",
            ],
            correctIndex: 1,
            feedback: "Lease agreements and tax returns are non-sufficient primary evidence for residents — they establish financial connection to an address, not physical presence. They're worth collecting and submitting alongside witness statements. We should also attempt to get a residence verification letter from the building management company. If the management company can specifically attest that Delores was physically residing there during the exposure period — not just that she held a lease — that letter could be sufficient on its own. If it can only confirm the lease, it is non-sufficient and should still be submitted alongside WPS.",
          },
          {
            text: "The building management company confirms the lease but cannot specifically attest to physical presence during the exposure period. Their letter is non-sufficient. We now need witnesses. Delores has identified three potential witnesses: **Gloria T.** — a neighbor who has lived on the 4th floor since 1995, still lives in the building. **Daniel V.** — Delores's son, also lived at 45 Rector Street from 1998 through 2003. **Jaylen M.** — a neighbor who has lived in the building his entire life and recently graduated from college.",
            question: "Which of these three witnesses are eligible to submit a WPS?",
            options: [
              "All three — Gloria, Daniel, and Jaylen are all eligible.",
              "Gloria and Daniel only — Jaylen is not eligible. A recent college graduate in 2025 was born around 2002 or 2003. Witnesses must have been at least 18 years old on September 11, 2001.",
              "Gloria only — Daniel is not eligible because he is Delores's son and family members cannot serve as witnesses.",
              "Gloria and Jaylen only — Daniel is not eligible because his statement would be considered self-serving as a family member.",
            ],
            correctIndex: 1,
            feedback: "Jaylen recently graduated from college — which means he was born around 2002 or 2003, making him approximately negative one to two years old on September 11, 2001. Witnesses must have been at least 18 on 9/11. Jaylen is ineligible regardless of how long he has lived in the building. Daniel is a family member but is eligible — family members can serve as witnesses. At least one witness must be non-family, and Gloria satisfies that requirement.",
          },
          {
            text: "We have two eligible witnesses: **Gloria T.** (non-family neighbor, adult in 2001) and **Daniel V.** (Delores's son, also lived in the building). We have the **lease agreement**, two years of **tax returns**, and the **management company's non-sufficient letter**.",
            question: "What is the correct POP submission strategy for Delores?",
            options: [
              "Submit Gloria's WPS and Daniel's WPS as primary evidence, along with the lease, tax returns, and management company letter. Include a cover letter. Note Daniel's familial relationship in both the WPS and the cover letter.",
              "Submit Gloria's WPS only — one non-family witness is sufficient, and adding a family witness draws unnecessary attention to the relationship.",
              "Submit all documents but omit Daniel's WPS — the non-sufficient primary evidence is stronger than a family witness statement.",
              "Hold the lease and tax returns and submit only the WPS — non-sufficient primary evidence doesn't add anything when you have eyewitness statements.",
            ],
            correctIndex: 0,
            feedback: "Gloria and Daniel together constitute a sufficient witness combination — one non-family plus one family. Note the familial relationship clearly in both Daniel's WPS and in the cover letter; transparency is better practice than omission. The lease, tax returns, and management company letter are non-sufficient primary evidence — but they should be submitted because they contribute to the picture and don't contradict the WPS. Submit the strongest available evidence. The old practice was to hold non-sufficient documents if you had witness statements — the VCF's current emphasis on primary evidence means we submit everything that supports the story and doesn't create a contradiction. One additional note: Daniel also lived at 45 Rector Street during the same period — his own potential eligibility may be worth flagging.",
          },
        ],
      },
    },

    // ─── CARD 9: ASSESSMENT ───
    {
      id: "m4-assessment",
      nav: "Final Assessment",
      type: "assessment",
      data: {
        title: "Final Assessment",
        subtitle: "Five questions — answer correctly to move forward",
        questions: [
          {
            question: "A claimant worked for FDNY during the exposure period. What is the correct POP approach?",
            options: [
              "Request an EVL from FDNY Human Resources and have it sent directly to the VCF.",
              "Collect two eyewitness WPS from FDNY colleagues who can attest to the claimant's presence at the site.",
              "Check policies and procedures and the entity account — FDNY has a direct VCF relationship. No POP collection is needed; the VCF obtains the information directly.",
              "Request a certified work history from the FDNY union before attempting any other outreach.",
            ],
            correctIndex: 2,
          },
          {
            question: "An EVL from a claimant's current employer has been completed and mailed to our office. It includes the claimant's specific work address and dates of employment. Is this document sufficient primary evidence as submitted?",
            options: [
              "Yes — it contains specific address and dates, which is what makes an EVL sufficient.",
              "Yes — if the employer completed and mailed it themselves, that is sufficient transmission.",
              "No — for an EVL to be sufficient it must also be transmitted directly from the employer to the VCF. We review it for sufficiency, then ask the employer to send it directly to VCF.Thirdpartyverification@usdoj.gov. We may include a copy in our submission as well.",
              "It depends on whether the employer has a Salesforce entity account.",
            ],
            correctIndex: 2,
          },
          {
            question: "A claimant has a tax return with her former employer's name and work address in the exposure zone, and two eyewitness WPS from coworkers who place her at that address. She could not get an EVL — the employer closed and she has documented email correspondence confirming they have no records. What should be submitted?",
            options: [
              "The two WPS only — the tax return is non-sufficient and adds nothing when you have witness statements.",
              "The two WPS, the tax return, and documentation of the EVL outreach attempt. The tax return is non-sufficient but should be submitted as the strongest available primary evidence. The outreach documentation shows good faith effort.",
              "The EVL outreach documentation only — without sufficient primary evidence we cannot submit a POP package.",
              "The two WPS only — submitting non-sufficient documents alongside WPS creates unnecessary scrutiny.",
            ],
            correctIndex: 1,
          },
          {
            question: "A potential witness for a residential claimant recently graduated from college and has lived in the building their whole life. Are they eligible to submit a WPS?",
            options: [
              "Yes — personal knowledge of the claimant's presence is what matters, and they clearly have it.",
              "Yes — the age requirement only applies to witnesses in legal proceedings, not VCF WPS forms.",
              "No — a recent college graduate was likely born around 2002 or 2003, meaning they were not yet born or were an infant on September 11, 2001. Witnesses must have been at least 18 on 9/11. The only exception is high school classmates submitting WPS for each other.",
              "It depends on whether they can describe specific details about the claimant's presence.",
            ],
            correctIndex: 2,
          },
          {
            question: "A residential claimant has two strong eyewitness WPS, a lease agreement, and two years of tax returns all placing her at the same address in the exposure zone. The management company letter only confirms the lease. What should be submitted?",
            options: [
              "The two WPS only — they are sufficient and non-sufficient documents invite scrutiny.",
              "The two WPS, the lease, the tax returns, and the management company letter. All documents tell a consistent story — submit the strongest evidence available alongside witness statements. Non-sufficient primary evidence should be submitted when it supports the claim and doesn't contradict the WPS.",
              "The two WPS and the management company letter only — tax records and lease agreements are too generic to add value.",
              "All documents plus a request that the VCF confirm which they prefer to rely on.",
            ],
            correctIndex: 1,
          },
        ],
      },
    },

    // ─── CARD 10: COMPLETION ───
    {
      id: "m4-complete",
      nav: "Module Complete",
      type: "completion",
      data: {},
    },

  ],
};
