export const MODULE6 = {
  cards: [

    // ─── CARD 0: STORY ───
    {
      id: "m6-story",
      nav: "A Different Kind of Claim",
      type: "story",
      data: {
        character: "Victor",
        portrait: "V",
        portraitColor: "#63656a",
        headline: "Not every claim starts with a claimant who will complete the WTCHP certification process.",
        body: [
          "Most of what we've covered assumes a standard personal injury claim: a living claimant, WTCHP enrollment and certification, gathering Proof of Presence, and submitting the claim to the VCF. That path accounts for most of our work, but some cases cannot go through this standard process. We touched on these in the last module, but we will now go into those pathways in more depth.",
          "Meet Victor. Victor is a retired attorney and former teacher from South Harlem. His wife Veronique was an NYPD officer who responded to Ground Zero on September 11, 2001, and worked the site for two weeks — twelve-hour shifts, six days a week. She was diagnosed with lung cancer in 2018 and passed away in 2022. Veronique never enrolled in the WTCHP and never had a condition certified by a WTCHP clinic.",
          "Victor is able to file a claim on Veronique's behalf, but the journey will look different than Yajaira's.",
        ],
        closing: "This module covers case types that require a different approach: claims filed on behalf of living claimants who cannot obtain WTCHP certification, claims filed on behalf of deceased claimants, and claims for clients whose health or financial situation cannot wait for the standard timeline.",
        objectives: [
          "The FA claim — the Personal Representative appointment process and FA-specific requirements",
          "The Private Physician Process — when it's used and what it requires",
          "POP and illness documentation for uncertified claimants",
          "The Expedite pathway — what triggers an expedite escalation and the basics of the pathway",
          "Recognizing when a case requires an alternative pathway",
        ],
        objectivesLabel: "Topics covered",
      },
    },

    // ─── CARD 1: FAMILY ASSISTANCE CLAIMS ───
    {
      id: "m6-fa-claims",
      nav: "Family Assistance Claims",
      type: "content",
      data: {
        title: "Family Assistance Claims",
        subtitle: "Filing a VCF claim on behalf of a deceased claimant",
        intro: "A Family Assistance claim is a VCF claim filed on behalf of someone who has passed away. The process parallels a PI claim in many ways: evidence must support the claimant's qualified illness, exposure to 9/11 toxins, and presence in the VCF exposure area — but because the claimant has passed, someone must be appointed to act on behalf of the deceased victim. Evidence must be collected by the decedent's friends and family, or by Barasch & McGarry on behalf of those family members.",
        blocks: [
          {
            type: "subheading",
            text: "The Personal Representative",
          },
          {
            type: "paragraph",
            text: "Before a FA claim can proceed, the estate must have a court-appointed Personal Representative. This is the individual the VCF will recognize as having authority to file and manage the claim. In New York State, two types of court appointment cover this:",
          },
          {
            type: "paragraph",
            text: "**Letters Testamentary** — issued when the deceased left a will (a \"testate\" estate). The court confirms the executor named in the will.",
          },
          {
            type: "paragraph",
            text: "**Letters of Administration** — issued when there is no will (an \"intestate\" estate). In New York, the court appoints an administrator based on order of succession established by state law.",
          },
          {
            type: "latency-list",
            items: [
              { time: "1st", desc: "Surviving Spouse" },
              { time: "2nd", desc: "Children" },
              { time: "3rd", desc: "Grandchildren" },
              { time: "4th", desc: "Parents" },
              { time: "5th", desc: "Siblings" },
              { time: "6th", desc: "Other relations or interested parties" },
            ],
          },
          {
            type: "paragraph",
            text: "In New York State, the Surrogates team at B&M handles the PR appointment process.",
          },
          {
            type: "callout",
            style: "info",
            icon: "📋",
            text: "**A note on medical records before appointment.** In New York State, the PR does not need to be formally appointed as administrator before we can request medical records on the decedent's behalf. A **Distributee** — someone who may benefit from the estate, usually someone in the state line of succession — can provide an affidavit granting us permission to request the deceased victim's medical records. This allows medical record collection to begin before the surrogate's court process is complete.",
          },
          {
            type: "subheading",
            text: "The FA intake kit",
          },
          {
            type: "paragraph",
            text: "The FA intake kit includes everything in the PI kit plus additional documents specific to the deceased claim: information about the decedent's family and household, and a general HIPAA release so we can begin requesting medical records on the estate's behalf.",
          },
          {
            type: "paragraph",
            text: "For the VCF Signature Page in an FA claim, the Personal Representative section that living PI claimants leave blank must be completed.",
          },
          {
            type: "subheading",
            text: "Wrongful death vs. continued PI claim",
          },
          {
            type: "paragraph",
            text: "The cause of death determines how the FA claim is characterized. If the claimant's death was caused by a 9/11-related physical condition (or complications from one), the claim can be filed as a **wrongful death** claim. A wrongful death claim allows for additional lines of compensation, including compensation for funeral expenses, lost domestic services, and specific awards for surviving spouses or dependent family members.",
          },
          {
            type: "paragraph",
            text: "If the death was unrelated to any certified 9/11 condition, the claim can continue and has the same compensation avenues as a standard PI claim — but the claim cannot be reviewed until the Personal Representative of the deceased victim has been appointed.",
          },
          {
            type: "callout",
            style: "info",
            icon: "📋",
            text: "When a PI client passes during the claim process, it is generally converted to an FA claim. An FA claim has a different VCF identification number and is filed by the Personal Representative — the PR is our client. Some of the work done during the PI claim process, especially if the client was able to get certified by the WTCHP, can help the FA team more easily submit the claim. But every FA conversion is vetted for viability by an FA Client Acquisition Team member or attorney, and additional documents — including all new authorization documents with the new VCF number, signed by the PR — must be collected through the FA Kit process.",
          },
        ],
      },
    },

    // ─── CARD 2: FA POP ───
    {
      id: "m6-fa-pop",
      nav: "FA POP and Uncertified Claims",
      type: "content",
      data: {
        title: "POP and Illness Documentation for FA Claims",
        subtitle: "When the claimant can't speak for themselves",
        intro: "POP requirements for FA claims follow the same hierarchy as PI claims — the same preference for primary evidence, the same EVL/TPV standard, the same witness rules. The practical challenge is different: the person who was there isn't available to describe their own presence, complete a Victim Attestation, or confirm witness contact information.",
        blocks: [
          {
            type: "subheading",
            text: "POP for FA claims in practice",
          },
          {
            type: "paragraph",
            text: "The PR helps identify and contact witnesses who knew the decedent and can attest to their presence. The FA CA reaches out to those witnesses directly, just as the PI CA would. An EVL, TPV, certified transcript, or letter of residence remains the preferred primary evidence, and outreach attempts need to be documented when attempting to obtain primary evidence.",
          },
          {
            type: "paragraph",
            text: "The WTCHP is designed to provide healthcare for claimants with certifiable 9/11-related conditions. Deceased victims do not receive healthcare and thus cannot be certified by the WTCHP. The PPP is typically the path for establishing illness in FA cases. Proof of Presence — whether primary evidence or witness statements — must also demonstrate hours of exposure when seeking illness verification through the PPP.",
          },
          {
            type: "callout",
            style: "warn",
            icon: "⚠️",
            text: "In FA claims, a Victim Presence Statement from the decedent would only exist if it was collected before the victim passed. Even if it was collected and signed during the claimant's lifetime, it is not considered viable POP for VCF purposes.",
          },
        ],
      },
    },

    // ─── CARD 3: SCENARIO — VICTOR'S CLAIM ───
    {
      id: "m6-scenario-victor",
      nav: "Apply It: Victor's Claim",
      type: "scenario",
      data: {
        title: "What Does Victor's Claim Need?",
        subtitle: "Apply the FA framework to a real situation",
        intro: "Veronique was an NYPD officer who worked at Ground Zero from September 12, 2001 through September 24, 2001 — twelve-hour shifts, six days a week. She was diagnosed with lung cancer in 2018 and passed away in 2022. She had a will naming Victor as executor. She was never enrolled in the WTCHP and was never certified for any condition. Victor has provided medical records showing the initial lung cancer diagnosis in 2018.",
        steps: [
          {
            text: "Victor needs to be recognized as the legal representative of Veronique's estate before the VCF will process the claim.",
            question: "What does this require?",
            options: [
              "Victor can file immediately as the surviving spouse — no court appointment is needed.",
              "Victor needs Letters Testamentary from the surrogate's court, confirming his appointment as executor of Veronique's estate. Because Veronique left a will naming him as executor, the estate is testate — Letters Testamentary, not Letters of Administration, are what he needs.",
              "Victor needs Letters of Administration because the estate is being administered by a surviving spouse.",
              "A notarized statement from Victor confirming he is the surviving spouse and executor is sufficient.",
            ],
            correctIndex: 1,
            feedback: "Because Veronique left a will naming Victor as executor, the estate is testate. In New York State, the surrogate's court confirms the executor named in the will and issues Letters Testamentary. The Surrogates team at B&M handles New York State Personal Representative appointments, but this process can take months — even with a will.",
          },
          {
            text: "Veronique was an NYPD officer and has a Notice of Participation signed in 2007. Victor is still in contact with two of Veronique's former colleagues who responded with her.",
            question: "What is the POP strategy?",
            options: [
              "The 2007 NOP is sufficient primary evidence on its own — no witnesses needed.",
              "The 2007 NOP is a pre-2011 NYPD NOP, which is equivalent to one non-family eye-witness WPS. Because we are submitting a PPP for this claim, we should also look for witness statements that speak to Veronique's hours of exposure — a NOP alone doesn't contain hours information. Contact one or both colleagues and collect WPS that address not just presence but hours worked at the site.",
              "Two full eyewitness WPS are needed — the NOP is only supplemental for FA claims.",
              "NYPD has a direct VCF relationship — no POP needed.",
            ],
            correctIndex: 1,
            feedback: "The pre-2011 NOP carries the weight of one non-family eye-witness WPS. However, because we are using the PPP to establish Veronique's illness — and the PPP requires exposure hours — we should collect WPS from her colleagues that speak specifically to the hours she was on-site each day. The NOP establishes presence and responder status; the witness statements fill in the hours detail the PPP needs.",
          },
          {
            text: "Veronique was never certified by the WTCHP and cannot enroll now. The medical records Victor provided show her lung cancer diagnosis in 2018.",
            question: "What pathway is needed to establish her illness for the VCF claim?",
            options: [
              "The VCF will accept medical records directly for FA claims — no additional process is needed.",
              "The Private Physician Process (PPP). Because Veronique was never certified by the WTCHP and cannot enroll, the PPP is the mechanism for establishing her illness. The PPP requires specific forms and medical records demonstrating that her condition meets the VCF's latency and eligibility requirements. This is the most common scenario in which the PPP is used.",
              "The claim cannot proceed without WTCHP certification — no exceptions apply to deceased claimants.",
              "Victor can request emergency WTCHP enrollment on Veronique's behalf as the PR.",
            ],
            correctIndex: 1,
            feedback: "The Private Physician Process is used precisely for this situation — a deceased claimant who was never certified by the WTCHP and cannot enroll. Veronique's case will be a challenging one: with no EVL easily available and the PPP requiring exposure hours, collecting detailed witness statements from her colleagues is critical. Any other documentation showing she was in the area — toll records, parking records, anything establishing her presence near the site — should also be gathered.",
          },
        ],
      },
    },

    // ─── CARD 4: THE PRIVATE PHYSICIAN PROCESS ───
    {
      id: "m6-ppp",
      nav: "The Private Physician Process",
      type: "content",
      data: {
        title: "The Private Physician Process",
        subtitle: "Establishing illness when WTCHP certification isn't available",
        intro: "The Private Physician Process is the mechanism the VCF uses to evaluate a claimant's condition when WTCHP certification is not available. It is not a workaround — it is a defined VCF process with specific requirements. It is used in limited circumstances, and the uncertified deceased claimant is the most common one.",
        blocks: [
          {
            type: "subheading",
            text: "When the PPP applies",
          },
          {
            type: "latency-list",
            items: [
              { time: "FA claims", desc: "A deceased claimant who was never certified by the WTCHP for the claimed condition" },
              { time: "Foreign residents", desc: "A claimant who lives outside the country and cannot access the WTCHP" },
              { time: "Ineligible for WTCHP", desc: "A claimant who does not qualify for WTCHP enrollment" },
              { time: "Hardship", desc: "A claimant who cannot travel to a WTCHP clinic without significant hardship" },
              { time: "Pentagon/Shanksville", desc: "Survivors eligible for the VCF but not the WTCHP" },
              { time: "Extremis", desc: "Cases where the standard certification timeline is too slow" },
            ],
          },
          {
            type: "subheading",
            text: "What the PPP requires",
          },
          {
            type: "doc-cards",
            cards: [
              {
                abbr: "Cover Sheet",
                color: "#009bdf",
                desc: "The Private Physician Cover Sheet — the VCF's form summarizing the claim basis for PPP review.",
                notes: [],
              },
              {
                abbr: "Appendix C or D",
                color: "#3d7a56",
                desc: "The exposure information form. Captures where the claimant was, when, for how long, and what their activities were.",
                notes: [
                  "This is where the hours and location detail that would otherwise come from a WTCHP certification are documented.",
                  "Any POP documents listing hours of exposure — EVLs or TPVs stating full-time or hours worked, and/or WPS that mention hours — should be consistent with the hours claimed on this form.",
                ],
              },
              {
                abbr: "TPIF + Medicals",
                color: "#63656a",
                desc: "The Treating Physician Information Form, attached to relevant medical records demonstrating the condition meets the VCF's latency period or MTI requirements.",
                notes: [
                  "For wrongful death claims, additional treatment records leading up to the claimant's passing may be needed to demonstrate a connection between their illness and cause of death.",
                ],
              },
            ],
          },
          {
            type: "subheading",
            text: "Pentagon workers and the PPP",
          },
          {
            type: "paragraph",
            text: "Pentagon workers are eligible for the VCF but not the WTCHP and require a PPP. The hour requirements for certification through the PPP are different for claimants with Pentagon exposure. For details, see the CDC WTCHP Private Physician Certification document: https://www.cdc.gov/wtc/pdfs/policies/WTCHPPPCertPhysDetFINAL20Feb2015-508.pdf",
          },
        ],
      },
    },

    // ─── CARD 5: THE EXPEDITE PATHWAY ───
    {
      id: "m6-expedite",
      nav: "The Expedite Pathway",
      type: "content",
      data: {
        title: "The Expedite Pathway",
        subtitle: "When the standard timeline is not an option",
        intro: "The standard VCF claim process takes time — enrollment and certification can take months, VCF review and award can take another one to two years. For most clients, that timeline is manageable. For some, it isn't. The Expedite pathway exists to move claims forward as quickly as possible for clients who cannot wait.",
        blocks: [
          {
            type: "subheading",
            text: "The three expedite triggers",
          },
          {
            type: "tier-cards",
            tiers: [
              {
                name: "Terminal prognosis",
                label: "Prognosis of less than 12 months",
                color: "#b03030",
                bg: "#fdf0f0",
                border: "#e8c0c0",
                items: [
                  "The goal is to ensure the client receives compensation before they pass",
                  "If a client mentions any indication of declining health — new diagnoses, spread of a known cancer, a doctor's conversation about prognosis — note it and escalate immediately",
                ],
              },
              {
                name: "Active treatment or major surgery",
                label: "Acute medical distress",
                color: "#9a6b1a",
                bg: "#fdf5e6",
                border: "#e8d5b0",
                items: [
                  "A claimant currently undergoing active treatment for their illness",
                  "A claimant about to have a major surgery",
                  "The expedite team assesses each case individually",
                ],
              },
              {
                name: "Financial hardship",
                label: "Severe, documented hardship",
                color: "#3d7a56",
                bg: "#edf5f0",
                border: "#b8d5c4",
                items: [
                  "Housing instability or eviction",
                  "Loss of essential services — electricity, heat",
                  "Food instability",
                  "Requires documentation of the hardship",
                ],
              },
            ],
          },
          {
            type: "subheading",
            text: "What expedite actually means",
          },
          {
            type: "paragraph",
            text: "For living claimants who are already WTCHP-enrolled, expedite primarily means accelerated VCF review and priority processing once the claim is submitted. The WTCHP may also prioritize certification for terminal clients.",
          },
          {
            type: "paragraph",
            text: "For terminal clients who are not yet certified and whose health may not allow them to wait for the WTCHP certification process, the PPP may be used to establish the illness for VCF purposes without waiting for WTCHP certification. The claimant may still pursue enrollment and certification through the WTCHP so they can receive treatment coverage — but that would be a parallel process to the VCF claim and would require a specific case escalation in Salesforce.",
          },
          {
            type: "subheading",
            text: "Your role in identifying expedite situations",
          },
          {
            type: "paragraph",
            text: "The expedite team can only act on situations they know about. CAs and CA IIs are often the first — and sometimes the only — people who hear about a client's declining health. When you hear anything that sounds like significant health deterioration, note it in Salesforce and escalate to your supervisor or team attorney. The expedite team will assess whether the situation qualifies.",
          },
          {
            type: "callout",
            style: "warn",
            icon: "⚠️",
            text: "These conversations are hard. A client who is terminal is often frightened, exhausted, and uncertain about what the process looks like for their family after they're gone. Approach these calls with patience and care. Your job is to gather the information needed to prepare the client and their family for whatever may occur next, and to make the client feel that someone is in their corner. Gathering a few pieces of information — an emergency contact, or whether the claimant has considered a will — can help the expedite or FA team progress a claim if the claimant's health deteriorates.",
          },
        ],
      },
    },

    // ─── CARD 6: QUIZ ───
    {
      id: "m6-quiz",
      nav: "Check: Recognize the Pathway",
      type: "quiz",
      data: {
        label: "Knowledge Check",
        context: "A new account:",
        question: "A Client Advocate receives a new account. The client is the widower of an NYPD detective who worked at Ground Zero from September 2001 through November 2001. She was diagnosed with esophageal cancer in 2010 and passed away in 2021. She was enrolled in the WTCHP and was certified for esophageal cancer before her death. Her widower has been appointed administrator of the estate by the surrogate's court. Which of the following describes this claim correctly?",
        options: [
          "This is an FA claim. Because she was certified by the WTCHP before her death, the PPP is not needed — the certification establishes the eligible condition. The widower has Letters of Administration since he was appointed administrator (intestate estate). Depending on cause of death, this may be characterizable as a wrongful death claim.",
          "This is a standard PI claim — the WTCHP certification means the process is the same as for any living claimant.",
          "This is an FA claim that requires the PPP because the claimant is deceased.",
          "This claim cannot proceed because the claimant is deceased and her certification expired at death.",
        ],
        correctIndex: 0,
        feedbackCorrect: "This is an FA claim — the claimant is deceased and the widower is the court-appointed PR with Letters of Administration. The critical distinction is certification: she was certified by the WTCHP before her death, which means the PPP is not needed. The certification remains valid for VCF purposes. Whether this qualifies as wrongful death depends on whether esophageal cancer was the cause of death — worth confirming from the death certificate.",
        feedbackIncorrect: "The claimant is deceased — this is an FA claim, not a standard PI claim. Review the distinctions between PI and FA claims, and between claims that require the PPP and those that do not. The key question is always: was the claimant certified by the WTCHP before they passed?",
        reviewCardIndex: 0,
        retryQuestion: "A CA is following up with an existing client — a living PI claimant with a certified solid cancer. During the call, the client mentions that his oncologist told him last week that the cancer has spread and that \"we're looking at maybe six to eight months.\" The claim has been submitted and is under VCF review. What should the CA do?",
        retryOptions: [
          "Note the update in Salesforce and reach out to the client's clinic to confirm details.",
          "Ask the client if they'd like to amend the claim to add the spread as a new certified condition before escalating.",
          "Advise the client to contact the VCF helpline directly to request priority review.",
          "Escalate immediately to the expedite team or supervising attorney — a six-to-eight month prognosis is a terminal situation and an expedite trigger that requires immediate action.",
        ],
        retryCorrectIndex: 3,
        retryFeedbackCorrect: "This is an expedite situation. \"Six to eight months\" is a terminal prognosis. Escalate to the expedite team or supervising attorney as soon as the call ends. Note the details in Salesforce as well, but escalation is the immediate priority.",
        retryFeedbackIncorrect: "A terminal prognosis is an immediate escalation trigger. Note it in Salesforce, then escalate to the expedite team or supervising attorney right away. Don't wait for a clinic confirmation or a scheduled update.",
      },
    },

    // ─── CARD 7: TRANSCRIPT ───
    {
      id: "m6-transcript",
      nav: "Apply It: A Call Comes In",
      type: "transcript",
      data: {
        title: "A Call About Victor",
        subtitle: "Route the situation correctly",
        intro: "Three months after Victor's FA claim is resolved, a woman calls B&M's intake line. Read the call and answer the decision point.",
        calls: [
          {
            callTitle: "Diane's Call",
            lines: [
              {
                type: "ca",
                speaker: "Call Center",
                text: "Thank you for calling Barasch & McGarry. How can I help you?",
              },
              {
                type: "client",
                speaker: "Diane",
                text: "Hi, my name is Diane. My father is Victor Reyes. He filed a claim for my mother a couple of years ago and received a settlement. I'm calling because my dad was just diagnosed with prostate cancer. His doctor says it's 9/11 related — he was at Ground Zero helping my mom with equipment and transportation for about three weeks after the attacks.",
              },
              {
                type: "ca",
                speaker: "Call Center",
                text: "I'm sorry to hear about your father's diagnosis. Let me ask a few questions. You said he was driving equipment in and out of the area — do you know roughly where he was and for how long each day?",
              },
              {
                type: "client",
                speaker: "Diane",
                text: "He was driving in and out of lower Manhattan, near the site. He said he was doing it basically every day for about three weeks, maybe eight or nine hours a day.",
              },
              {
                type: "ca",
                speaker: "Call Center",
                text: "And was this as part of a job, or was he doing it voluntarily?",
              },
              {
                type: "client",
                speaker: "Diane",
                text: "He was retired by then. He was doing it to help — he had a truck and he just showed up and they put him to work.",
              },
              {
                type: "decision",
                question: "Based on this conversation, how should the call center route this call, and what initial assessment is appropriate?",
                options: [
                  "Route to the FA team — because Victor's wife had an FA claim, any future claims from the family go through the FA team.",
                  "This call cannot proceed — Victor already received compensation through Veronique's claim and is not eligible for a separate claim.",
                  "Route to standard intake for further assessment. Note this may be a responder claim — Victor was driving equipment in and out of the lower Manhattan area near the site as a volunteer for approximately three weeks at 8–9 hours per day. This will be a challenging claim with no EVL to pursue. Eyewitnesses who can confirm he was there are critical, as is any documentation showing his presence in the area — toll records, parking records, anything establishing he was driving near the site. Prostate cancer has a 4-year minimum latency — confirm the diagnosis date relative to September 2001.",
                  "This is a standard PI claim — route directly to the PI team without any special notation.",
                ],
                correctIndex: 2,
                feedback: "Victor's prior involvement in Veronique's FA claim has no bearing on his own potential eligibility — they are entirely separate. Route to standard intake and note the key details: volunteer responder, lower Manhattan, approximately three weeks at 8–9 hours per day, prostate cancer. This will be a challenging claim — no employer to contact for an EVL, and the case will depend heavily on eyewitnesses and any contemporaneous documentation of his presence driving in the area.",
              },
            ],
          },
        ],
      },
    },

    // ─── CARD 8: ASSESSMENT ───
    {
      id: "m6-assessment",
      nav: "Final Assessment",
      type: "assessment",
      data: {
        title: "Final Assessment",
        subtitle: "Five questions — answer correctly to move forward",
        questions: [
          {
            question: "A deceased claimant left no will. Her surviving son has been appointed by the surrogate's court to file a VCF claim on her behalf. What type of document confirms his legal authority to act as Personal Representative?",
            options: [
              "A notarized affidavit of next-of-kin, valid indefinitely.",
              "Letters of Administration — issued by the surrogate's court when there is no will, appointing an administrator from the state line of succession.",
              "Letters Testamentary — issued by the surrogate's court confirming an executor named in a will.",
              "A Distributee affidavit, which grants authority to file the VCF claim directly.",
            ],
            correctIndex: 1,
          },
          {
            question: "A deceased claimant was never enrolled in the WTCHP and was never certified for any condition before her death. Her estate is filing a VCF claim for lung cancer. What mechanism is used to establish her illness for the VCF?",
            options: [
              "The VCF accepts medical records directly for FA claims — no additional process is required.",
              "The claim cannot proceed without WTCHP certification — no exceptions apply.",
              "The Private Physician Process. The PPP allows the VCF to evaluate the illness through the claimant's own physician and medical records. It requires the Private Physician Cover Sheet, Appendix C or D, and the Treating Physician Information Form attached to relevant medical records demonstrating the condition meets latency requirements.",
              "The PR can enroll the deceased claimant in the WTCHP retroactively.",
            ],
            correctIndex: 2,
          },
          {
            question: "A Pentagon contractor was present at the Pentagon from September 11 through October 2001 during cleanup operations. He has been diagnosed with colon cancer and is not eligible for the WTCHP. An EVL from his former employer states he worked full-time at the Pentagon site during that period. What does this EVL accomplish for his PPP submission?",
            options: [
              "It establishes presence only — he still needs separate exposure documentation submitted by witnesses.",
              "A sufficient EVL stating full-time employment at the eligible location during the exposure period satisfies both the presence and the exposure components of the PPP.",
              "Two eyewitness WPS are still required alongside the EVL — it cannot satisfy the PPP on its own.",
              "The EVL is not accepted for Pentagon claims — a TPV on the VCF's form is required instead.",
            ],
            correctIndex: 1,
          },
          {
            question: "During a routine status update call, a client with a submitted VCF claim mentions that his doctor told him he has \"maybe a year left.\" He asks if there's anything that can be done. What is the correct response?",
            options: [
              "Explain that once a claim is submitted, the VCF controls the timeline and there's nothing B&M can do to accelerate it.",
              "Note the update in Salesforce and reach out to the client's clinic to confirm details.",
              "Escalate to the expedite team or supervising attorney immediately — a prognosis of approximately one year is an expedite trigger. Note it in Salesforce and escalate without delay.",
              "Advise the client to contact the VCF helpline directly to request priority review.",
            ],
            correctIndex: 2,
          },
          {
            question: "A living PI claimant who was never WTCHP-certified contacts B&M. She lives in Spain and has been diagnosed with thyroid cancer. She cannot travel to a WTCHP clinic. She was present in the VCF NYC exposure zone during the exposure period as a resident. Which pathway applies?",
            options: [
              "She cannot file a VCF claim — WTCHP certification is required for all living claimants without exception.",
              "She qualifies for the Private Physician Process as a foreign resident who cannot access the WTCHP. The PPP allows the VCF to verify her condition through her own physician and medical records. Her thyroid cancer must meet the minimum latency period of 2.5 years from first exposure.",
              "She should attempt to travel to a WTCHP clinic — no exceptions apply for foreign residents.",
              "She qualifies for the Expedite pathway because of the difficulty in accessing the WTCHP from abroad.",
            ],
            correctIndex: 1,
          },
        ],
      },
    },

    // ─── CARD 9: COMPLETION ───
    {
      id: "m6-complete",
      nav: "Module Complete",
      type: "completion",
      data: {},
    },

  ],
};
