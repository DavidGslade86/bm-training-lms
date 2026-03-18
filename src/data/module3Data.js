import { B } from "./brand";

// ═══════════════════════════════════════════════════════
//  MODULE 3 — From Sign-Up to Submitted
// ═══════════════════════════════════════════════════════
export const MODULE3 = {
  cards: [
    // ─── CARD 0: STORY ───
    {
      id: "m3-story",
      nav: "The File Lands",
      type: "story",
      data: {
        character: "Yajaira",
        portrait: "Y",
        portraitColor: "#009bdf",
        headline: "Yajaira said yes. Now the work starts.",
        body: [
          "The Client Acquisition team did their job. They spoke with Yajaira, confirmed that her breast cancer is a Tier 1 illness, that she worked on West Broadway from 1997 through 2005, and that she has former coworkers who can serve as witnesses. She has a case. She signed up.",
          "A welcome letter goes out. An e-retainer follows. Within 48 hours of the welcome letter, the intake kit is sent \u2014 automatically on the PI side. If Yajaira signed the e-retainer electronically, the kit goes alone. If she didn\u2019t, a physical copy of the retainer goes with it.",
          "Yajaira is now an account, not a lead. She has a Client Advocate. That Client Advocate is you.",
          "The intake kit isn\u2019t just paperwork. Each document in it does something specific \u2014 and if any of them come back incomplete, incorrectly signed, or with information that doesn\u2019t match her records, the process slows down. Your job right now is to understand what you\u2019re asking her to sign, and why.",
        ],
        closing: "By the end of this module, you\u2019ll know what the kit documents do and why each one matters, what document integrity is and what\u2019s at stake when it\u2019s violated, how B&M helps clients enroll in the WTCHP and what that process looks like in practice, and how to navigate the complications that come up \u2014 unconfirmed enrollment status, enrollment challenges, and communicating with the Health Program and affiliated clinics.",
        objectives: [
          "The purpose of every document in the intake kit",
          "Document integrity rules \u2014 and why violating them is fraud",
          "The WTCHP enrollment path and B&M\u2019s role at each step",
          "How to check enrollment status and what to do when it\u2019s unclear",
        ],
      },
    },
    // ─── CARD 1: VCF AUTHORIZATION FORMS ───
    {
      id: "m3-vcf-docs",
      nav: "VCF Authorization Forms",
      type: "content",
      data: {
        title: "The Intake Kit \u2014 VCF Authorization Forms",
        subtitle: "These documents require original signatures and must be returned before the claim can move forward",
        intro: "The intake kit contains three types of documents: VCF Authorization Forms, WTCHP Authorization Forms, and Internal Intake Information Forms. We\u2019ll cover all three in this module. We\u2019re starting with the authorization forms because they govern what B&M and the VCF can do on the client\u2019s behalf \u2014 and they have strict requirements you need to know.",
        blocks: [
          {
            type: "callout", style: "warn", icon: "\u270d\ufe0f",
            text: "**All authorization documents must be hand-signed. Originals must be returned.** This applies to every VCF and WTCHP authorization form without exception. Electronic signatures are not accepted by the VCF, the WTCHP, or most third-party entities. A typed name, a DocuSign certificate, or a scanned image of a typed name will cause a document to be rejected. We will discuss the only exception \u2014 EVLs and TPVs sent directly by third parties to the VCF \u2014 when we cover Proof of Presence in Module 4.",
          },
          {
            type: "doc-cards",
            cards: [
              {
                abbr: "Signature Page",
                color: "#009bdf",
                desc: "The client\u2019s formal consent to the VCF process \u2014 authorizes the DOJ to collect and share their information, authorizes B&M to act on their behalf, and waives their right to file future 9/11-related civil lawsuits.",
                notes: [
                  "Requires initials on multiple lines \u2014 every line except the Personal Representative section, which must be left blank for living claimants.",
                  "The PR section is the only line you do NOT initial. It is easy to miss because it looks like every other line on the form.",
                  "If a client mentions a prior 9/11-related lawsuit at any point, flag it to your supervisor or team attorney via Chatter.",
                ],
              },
              {
                abbr: "Exhibit A",
                color: "#63656a",
                desc: "Permits the VCF to obtain the client\u2019s WTCHP certification information directly from the Health Program, and authorizes the release of medical records for claim evaluation.",
                notes: [
                  "Contains a field where the client must initial to acknowledge that records may include mental health information.",
                  "This field is required for all claimants \u2014 not only those with a mental health diagnosis.",
                  "A blank initial field is one of the most common reasons Exhibit A is rejected during preliminary review.",
                ],
              },
              {
                abbr: "CIRF",
                color: "#3d7a56",
                desc: "Verifies the client\u2019s identity for the VCF\u2019s Claim Management System \u2014 name, date of birth, Social Security number, and VCF claim number.",
                notes: [
                  "The VCF uses the CIRF as their source of truth for who this person is within the CMS.",
                  "Every field must match the CMS exactly \u2014 name format, date format (MM/DD/YYYY), and VCF claim number (always 7 digits after \u2018VCF\u2019).",
                  "A mismatch between the CIRF and the CMS will trigger a discrepancy that stalls the claim.",
                ],
              },
              {
                abbr: "CPA",
                color: "#6b4fa0",
                desc: "Authorizes the VCF to deposit any award directly into B&M\u2019s attorney trust account, from which B&M disburses payment to the client.",
                notes: [
                  "Must be signed with an original signature and must include a date.",
                  "Includes a section for B&M to attest that we\u2019ve reviewed the form and confirmed it matches the CMS.",
                  "Completed during intake but not active until an award is approved \u2014 which happens much later in the process.",
                ],
              },
            ],
          },
          {
            type: "yajaira-check",
            text: "All four VCF authorization forms are required for Yajaira\u2019s claim. Her Signature Page should show initials on every line except the Personal Representative section, which must be blank. Her Exhibit A must include the mental health initials. Her CIRF must match her CMS account exactly \u2014 including her full legal name as it appears on government records.",
          },
        ],
      },
    },
    // ─── CARD 2: WTCHP AUTH + INTERNAL FORMS ───
    {
      id: "m3-wtchp-docs",
      nav: "WTCHP & Internal Forms",
      type: "content",
      data: {
        title: "The Intake Kit \u2014 WTCHP Authorization Forms",
        subtitle: "Three documents that authorize B&M to support the client\u2019s Health Program enrollment",
        intro: "The WTCHP authorization forms give B&M the legal authority to communicate with the Health Program on the client\u2019s behalf. All three must be signed and returned before we can take any formal action with the WTCHP on a client\u2019s behalf. Like the VCF documents, all must be hand-signed \u2014 originals returned.",
        blocks: [
          {
            type: "doc-cards",
            cards: [
              {
                abbr: "WTCHP App Signature",
                color: "#009bdf",
                desc: "The client\u2019s formal application to the World Trade Center Health Program \u2014 signing it declares intent to apply and attests that the client has answered questions honestly.",
                notes: [
                  "Must be hand-signed and uploaded with the online application \u2014 it cannot be mailed or faxed separately.",
                  "Can only be signed by the applicant or a court-appointed legal guardian.",
                  "If a client is unable to sign for any reason, escalate to a supervisor before submitting the application.",
                ],
              },
              {
                abbr: "Designated Rep Form",
                color: "#63656a",
                desc: "Appoints a specific individual to act on the client\u2019s behalf in all WTCHP matters \u2014 receiving information, making requests, and handling appeals.",
                notes: [
                  "B&M has one Designated Representative for the entire firm: Ryah Mesch. Her information is pre-filled on the form.",
                  "The WTCHP recognizes only one Designated Representative per client at a time.",
                  "Must be submitted together with the HIPAA Authorization \u2014 neither is sufficient alone.",
                ],
              },
              {
                abbr: "HIPAA Auth (DR)",
                color: "#9a6b1a",
                desc: "Grants the Designated Representative permission to access the client\u2019s protected health information held by the WTCHP.",
                notes: [
                  "Must be submitted together with the Designated Representative Appointment Form.",
                  "Both are required before any Salesforce Case requesting Ryah\u2019s involvement can be submitted.",
                  "Valid until the WTCHP closes (currently 2090) unless revoked in writing by the client.",
                ],
              },
            ],
          },
          {
            type: "callout", style: "info", icon: "\ud83d\udccb",
            text: "**When to involve the Designated Representative.** Ryah\u2019s role is to communicate with B&M\u2019s NIOSH contact on behalf of clients when the client and Client Advocate cannot resolve a WTCHP issue through the normal process \u2014 including situations where the client cannot communicate verbally due to health or other circumstances. Before submitting a Salesforce Case requesting her involvement, you must have: a sufficient Victim Attestation on file, witness names and contact information documented in Salesforce, and a prior conference call attempt with the WTCHP with the client on the line. Her contact with NIOSH is a limited resource \u2014 use it when it\u2019s genuinely needed.",
          },
          {
            type: "subheading",
            text: "Internal Intake Information Forms",
          },
          {
            type: "paragraph",
            text: "These forms are for our information. They don\u2019t go to the VCF or WTCHP, and missing information here wouldn\u2019t technically stall the claim if we can collect it verbally. Collecting them in writing gives us a more reliable record and reduces follow-up calls needed later.",
          },
          {
            type: "doc-cards",
            cards: [
              {
                abbr: "Exposure Form",
                color: "#3d7a56",
                desc: "Captures the client\u2019s location during 9/11, hours at each location, activities, and dust exposure level \u2014 used by B&M to complete the Health Program application on the client\u2019s behalf.",
                notes: [
                  "The client\u2019s self-reported exposure level is especially important: it informs the hours submitted with the WTCHP application.",
                  "The client will also complete a separate exposure form at their WTCHP clinic \u2014 that one is used for certification and determines the hours required.",
                ],
              },
              {
                abbr: "Witness Contact Form",
                color: "#63656a",
                desc: "Collects names and contact information for potential witnesses \u2014 both for WTCHP attestations and VCF Proof of Presence.",
                notes: [
                  "PI (living claimant) kits request both eyewitnesses and individuals with general knowledge of the client\u2019s presence.",
                  "FA kits request only eyewitnesses.",
                ],
              },
              {
                abbr: "Medical History Form",
                color: "#9a6b1a",
                desc: "Lists the client\u2019s claimed conditions and asks whether they have been certified by the WTCHP.",
                notes: [
                  "Helps us understand what medical records to request early.",
                  "Gives the attorney context for the claim roadmap.",
                ],
              },
              {
                abbr: "Contact Form",
                color: "#1a7a8a",
                desc: "Collects the client\u2019s preferred contact information and an emergency contact.",
                notes: [
                  "The emergency contact is someone we can notify if we learn the claimant has passed during the claim process.",
                ],
              },
            ],
          },
          {
            type: "callout", style: "info", icon: "\ud83d\udcc1",
            text: "**FA kits include additional forms** specific to deceased claims \u2014 information about the decedent\u2019s family, household, and a general HIPAA release to begin requesting medical records. We\u2019ll cover those in Module 5.",
          },
          {
            type: "subheading",
            text: "Open Docs, Closed Docs, and DNU",
          },
          {
            type: "paragraph",
            text: "Once documents come back, their status in Salesforce matters. A document is **Open** when an acceptable version has not yet been received and reviewed. A document is **Closed** when an acceptable version is on file, has been reviewed, and the status has been updated with the received date and closed date.",
          },
          {
            type: "paragraph",
            text: "Closing supporting documents properly is one of the most important workflow habits to develop. Some documents open automatically in Salesforce \u2014 part of your job is identifying which open documents aren\u2019t applicable to a particular client and closing them according to your team\u2019s guidelines. Unnecessary open documents create confusion and can make a file look incomplete when it isn\u2019t.",
          },
          {
            type: "paragraph",
            text: "A document marked **DNU (Do Not Use)** stays on file but won\u2019t be submitted \u2014 because it\u2019s insufficient, inaccurate, or superseded. Never delete a document. If it shouldn\u2019t be used, mark it DNU.",
          },
        ],
      },
    },
    // ─── CARD 3: DOCUMENT INTEGRITY ───
    {
      id: "m3-doc-integrity",
      nav: "Document Integrity",
      type: "content",
      data: {
        title: "Document Integrity",
        subtitle: "Accuracy matters \u2014 and tampering has legal consequences",
        intro: "Document integrity means the content of a document is accurate, unaltered, and authentically signed. This matters for two reasons: practically, a document with wrong information causes delays, Missing Information letters, and denials. Legally, altering a document \u2014 in any way, for any reason \u2014 is fraud.",
        blocks: [
          {
            type: "callout", style: "info", icon: "\ud83d\udda5\ufe0f",
            text: "**What is the CMS?** The CMS \u2014 Claim Management System \u2014 is the VCF\u2019s online portal for managing every claim. B&M, as the client\u2019s legal representative, has access to the CMS on the client\u2019s behalf. Every document we upload to a client\u2019s CMS account lives there permanently \u2014 documents cannot be deleted or retrieved once uploaded. The VCF takes CMS integrity seriously: uploading a document with incorrect PII \u2014 the wrong name, Social Security number, or address \u2014 is treated as a data breach. **Before uploading any document, verify that the information it contains matches what is on the CMS account.**",
          },
          {
            type: "subheading",
            text: "Four Rules",
          },
          {
            type: "subheading",
            text: "Rule 1 \u2014 Every update requires a new signature",
          },
          {
            type: "paragraph",
            text: "If any information on a document changes after the client has signed it \u2014 a spelling correction, an updated address, a corrected VCF claim number \u2014 the entire document must be re-signed with a new date. Not initialed. Not annotated. Re-signed.",
          },
          {
            type: "subheading",
            text: "Rule 2 \u2014 Superimposing a prior signature is fraud",
          },
          {
            type: "paragraph",
            text: "Cutting and pasting a client\u2019s signature from a previous version of a document onto a new one \u2014 in a PDF editor, in Word, or by any other means \u2014 is document fraud. It does not matter how minor the change was or whether the client verbally authorized it. This puts B&M at serious legal risk and can compromise the client\u2019s claim entirely.",
          },
          {
            type: "subheading",
            text: "Rule 3 \u2014 Documents must match the CMS",
          },
          {
            type: "paragraph",
            text: "Every piece of identifying information on every document we submit must match exactly what the VCF has on file. Pay particular attention to names. A client who goes by a middle name may be registered under a different legal name in government records and in the CMS. The CIRF is the VCF\u2019s source of truth: if the CMS has the wrong name, we submit a corrected CIRF \u2014 but only after confirming what the correct legal name actually is.",
          },
          {
            type: "subheading",
            text: "Rule 4 \u2014 Templates must be clean of PII",
          },
          {
            type: "paragraph",
            text: "Using a prior client\u2019s document or cover letter as a template is one of the most common ways incorrect PII ends up in a submission. Any template you use should be reviewed and approved by a supervisor or senior staff member, and must contain no PII from a prior client. If you\u2019re not sure whether a template is clean, ask before using it.",
          },
          {
            type: "callout", style: "warn", icon: "\u270d\ufe0f",
            text: "**WPS and HP Attestations must also be hand-signed.** Unlike the authorization documents, we don\u2019t need originals returned \u2014 a clear photo or scan of the signed signature page is acceptable. The content of the full statement still needs to be legible, but for these documents we work with scanned copies in practice.",
          },
          {
            type: "subheading",
            text: "When a client pushes back on re-signing",
          },
          {
            type: "paragraph",
            text: "Clients sometimes push back when asked to sign the same form again \u2014 especially if they don\u2019t understand what changed or why it matters. Offer options: mail with a return envelope, email the blank form so they can print, sign, and scan back, or arrange a WeTransfer. Document every attempt in Salesforce. What you cannot do is submit the prior version with a correction written in.",
          },
        ],
      },
    },
    // ─── CARD 4: DOCUMENT REVIEW ───
    {
      id: "m3-spot-the-problem",
      nav: "Spot the Problem",
      type: "document-review",
      data: {
        title: "What\u2019s Wrong With This Document?",
        subtitle: "Find every error before you can submit",
        instructions: "Below are completed documents from a client intake kit. Each has errors that would cause problems during preliminary review. Click on a highlighted section to identify the problem. Find all errors to continue.",
        documents: [
          {
            name: "CIRF \u2014 Claim Information Resolution Form",
            errors: [
              {
                id: "cirf-1",
                zone: "VCF Claim Number",
                displayed: "VCF12345",
                options: [
                  "The claim number should not include the \u2018VCF\u2019 prefix",
                  "VCF claim numbers are always 7 digits after \u2018VCF\u2019 \u2014 this has only 5",
                  "The claim number field should be left blank until the VCF assigns one",
                  "This claim number format is correct",
                ],
                correctOption: 1,
                feedback: "VCF claim numbers are always 7 digits after \u2018VCF.\u2019 This form would be flagged immediately during preliminary review and a corrected CIRF would be required.",
              },
              {
                id: "cirf-2",
                zone: "Victim Date of Birth",
                displayed: "03/15/1968 \u2014 this is today\u2019s date, not the client\u2019s birthday",
                options: [
                  "The date format should be MM-DD-YYYY, not MM/DD/YYYY",
                  "The date of birth field appears to contain today\u2019s date instead of the client\u2019s actual birth date",
                  "The year should be written in two digits, not four",
                  "This date is correct",
                ],
                correctOption: 1,
                feedback: "This is a common error \u2014 today\u2019s date and the client\u2019s date of birth are different fields, and it\u2019s easy to fill in the current date by habit. The DOB field requires the client\u2019s actual birth date. A document with the wrong DOB will create an identity discrepancy in the CMS.",
              },
              {
                id: "cirf-3",
                zone: "Victim Full Legal Name",
                displayed: "Yajaira Diaz \u2014 but the document header (pre-filled from CMS) shows Maria Yajaira Diaz",
                options: [
                  "The name on the CIRF is acceptable \u2014 the client goes by Yajaira",
                  "The CIRF must reflect the full legal name. This discrepancy signals we need to confirm the correct legal name and whether the CMS also needs to be corrected",
                  "The client\u2019s preferred name should be used on all documents",
                  "Only the last name needs to match the CMS",
                ],
                correctOption: 1,
                feedback: "Yajaira\u2019s legal name appears to be Maria Yajaira Diaz. The CIRF must reflect the full legal name as it appears on government records and in the CMS. This also signals we should verify whether the CMS itself shows the correct name \u2014 if it shows \u2018Yajaira Diaz,\u2019 a corrected CIRF may be needed to prompt the VCF to update their records.",
              },
              {
                id: "cirf-4",
                zone: "Personal Representative section \u2014 initialed",
                displayed: "The PR section has been initialed by the living claimant",
                options: [
                  "The PR section can be initialed by living claimants to indicate they have no PR",
                  "The PR section must be left completely blank for living claimants \u2014 initialing it creates a legal ambiguity about who is authorized to act on this claim",
                  "The initial is acceptable as long as the PR name field is blank",
                  "Only the PR signature line needs to be blank \u2014 initials on other PR fields are fine",
                ],
                correctOption: 1,
                feedback: "The Personal Representative section is only completed when the victim is deceased. For a living claimant, every line of the Signature Page is initialed \u2014 except the PR section, which must be left completely blank. It\u2019s an easy mistake because it looks like every other line on the form. A new Signature Page is required.",
              },
              {
                id: "cirf-5",
                zone: "Signature date",
                displayed: "Signature present \u2014 date field blank",
                options: [
                  "A signature without a date is acceptable if the form was recently returned",
                  "The date can be added by the Client Advocate based on when the form was received",
                  "Both signature and date are required \u2014 a signature without a date is insufficient and a new signed form must be obtained",
                  "The date is optional if the signature is present",
                ],
                correctOption: 2,
                feedback: "Both signature and date are required. The VCF needs the date to verify the form was signed after the most recent version was issued. The client must sign a new form \u2014 the date cannot be added after the fact.",
              },
            ],
          },
          {
            name: "Exhibit A \u2014 Authorization for Release of Medical Records",
            errors: [
              {
                id: "exa-1",
                zone: "Mental health initials field",
                displayed: "Field left blank",
                options: [
                  "The mental health field only applies if the client has a diagnosed mental health condition \u2014 it can be left blank otherwise",
                  "The mental health initials field is required for all claimants regardless of diagnosis \u2014 a blank field requires a new signed Exhibit A",
                  "The Client Advocate can initial this field on the client\u2019s behalf with verbal authorization",
                  "The VCF will waive this requirement with a written explanation",
                ],
                correctOption: 1,
                feedback: "The mental health initials field is required for all claimants. It cannot be added to an already-signed form. The client must sign a new Exhibit A with all fields complete \u2014 including this one.",
              },
              {
                id: "exa-2",
                zone: "Client name \u2014 Section 2",
                displayed: "Shows \u2018Yajaira Diaz\u2019 \u2014 should be \u2018Maria Yajaira Diaz\u2019",
                options: [
                  "The name on Exhibit A can differ from the CMS if the client uses a preferred name",
                  "This mirrors the CIRF error \u2014 all documents must reflect the client\u2019s full legal name, and both forms need to be corrected and re-signed once the correct name is confirmed",
                  "Exhibit A uses the preferred name while the CIRF uses the legal name",
                  "Only the last name needs to be consistent across documents",
                ],
                correctOption: 1,
                feedback: "The same name discrepancy from the CIRF appears here. All documents must reflect the client\u2019s full legal name as confirmed from government records. Both the CIRF and Exhibit A need to be corrected and re-signed once the correct name is confirmed.",
              },
            ],
          },
        ],
        completionMessage: "You found all seven errors. In practice, these would all need to be corrected before anything is uploaded to the CMS. A rejected document triggers a Missing Information letter and adds processing time to the claim. Catching errors before upload is always faster than correcting them after.",
      },
    },
    // ─── CARD 5: QUIZ ───
    {
      id: "m3-quiz-integrity",
      nav: "Check: Document Rules",
      type: "quiz",
      data: {
        label: "Knowledge Check",
        context: "A client situation:",
        question: "A Client Advocate receives a signed Witness Presence Statement from a witness. After the attorney reviews it, they note that the witness wrote \u20182011\u2019 instead of \u20182001\u2019 for the exposure year. The witness lives out of state. What should the Client Advocate do?",
        options: [
          "Correct the year directly on the document in a PDF editor \u2014 it\u2019s a clear typo and the intent is obvious.",
          "Contact the witness to explain the error and arrange for a new signed statement with the corrected year, offering to email the blank form for print, sign, and scan return.",
          "White out the error, write the correct year, and have the attorney initial the correction to authorize it.",
          "Submit the document as-is with a cover letter explaining the obvious typo \u2014 the VCF has been known to accept minor corrections with an explanation.",
        ],
        correctIndex: 1,
        feedbackCorrect: "Right. Any change to a signed document \u2014 even a single digit \u2014 requires a fresh signature from the original signer. The Client Advocate should contact the witness, explain the issue, and offer a convenient way to return a corrected version. A photo or scan of the signed statement is acceptable; the witness doesn\u2019t need to mail the original.",
        feedbackIncorrect: "Review the document integrity rules. The rule about re-signing applies regardless of how minor the correction appears, and regardless of who requests or authorizes it. The only acceptable path is a new signature from the witness.",
        reviewCardIndex: 3,
        retryQuestion: "A client\u2019s CIRF was signed and returned last week. During review, the Client Advocate notices that the client\u2019s name on the CIRF is \u2018Yajaira Diaz\u2019 but the CMS account shows \u2018Maria Yajaira Diaz.\u2019 The client is frustrated about having to sign another form. What is the correct next step?",
        retryOptions: [
          "Submit the CIRF as signed and add a note to the file explaining the discrepancy \u2014 the VCF can determine the correct name from other documents.",
          "Write \u2018AKA Maria Yajaira Diaz\u2019 on the CIRF next to the existing name, and have the supervisor initial the addition to authorize it.",
          "Confirm the client\u2019s full legal name from a government document, then obtain a new signed CIRF with the correct legal name. Check whether the CMS account also needs to be corrected.",
          "Ask the client to initial next to the correct name on the existing signed form \u2014 initialing a correction is sufficient for name changes.",
        ],
        retryCorrectIndex: 2,
        retryFeedbackCorrect: "Correct. The CIRF is the VCF\u2019s source of truth for the client\u2019s identity, and the name must match government records and the CMS exactly. Before getting a new form signed, confirm the correct legal name. If the CMS is also wrong, the corrected CIRF can be submitted to prompt the VCF to update their records.",
        retryFeedbackIncorrect: "Any change requires a new signature \u2014 annotating, initialing, or adding text to a signed document is not acceptable. Submitting a document with a name that doesn\u2019t match the CMS will trigger a discrepancy that slows the claim down.",
      },
    },
    // ─── CARD 6: CLIENT JOURNEY ───
    {
      id: "m3-client-journey",
      nav: "Kit Out, Kit Back",
      type: "content",
      data: {
        title: "Between Kit Sent and Kit Returned",
        subtitle: "Your job isn\u2019t to wait \u2014 it\u2019s to follow up",
        intro: "The intake kit going out doesn\u2019t mean your work pauses. This period \u2014 from kit sent to kit returned \u2014 is when you establish your relationship with the client, set expectations, and collect the information you\u2019ll need for the next step. It\u2019s also when the first complications tend to surface.",
        blocks: [
          {
            type: "subheading",
            text: "Step 1 \u2014 The intro call",
          },
          {
            type: "paragraph",
            text: "When the kit goes out, your first task is to call the client and introduce yourself. This call confirms they received the kit, explains what\u2019s in it and why each document matters, and sets the expectation that signed authorization documents need to be returned before anything can move forward. It also starts the relationship \u2014 for many clients, you will be the most consistent human contact they have with B&M during the enrollment period.",
          },
          {
            type: "subheading",
            text: "Step 2 \u2014 Follow-up until the kit is returned",
          },
          {
            type: "paragraph",
            text: "Clients don\u2019t always return kits quickly. B&M uses **Service Level Agreements (SLAs)** \u2014 defined timelines that govern how often we follow up at each stage of the process \u2014 to make sure no client falls through the cracks. You\u2019ll follow your team\u2019s SLA guidelines for the follow-up cadence.",
          },
          {
            type: "paragraph",
            text: "You can start asking about medical records during follow-up calls, even before the kit is fully returned. The most important records are original diagnostic records \u2014 the biopsy, the initial pathology report, the imaging that first identified the condition. Ask the client where they were when they were first diagnosed, whether that\u2019s different from where they\u2019re currently being treated, and whether they\u2019d be comfortable sharing patient portal access at either facility so we can retrieve records directly. They can change their password afterward.",
          },
          {
            type: "subheading",
            text: "Step 3 \u2014 The kit review call",
          },
          {
            type: "paragraph",
            text: "When the kit comes back, review every document before calling the client. Check for errors before the call \u2014 that way you can address them in one conversation rather than going back multiple times. On the review call, confirm the contents, flag any documents that need to be re-signed or corrected, and begin collecting the information you\u2019ll need for the Health Program attestations.",
          },
          {
            type: "subheading",
            text: "What you\u2019re collecting on the review call",
          },
          {
            type: "paragraph",
            text: "When you get the client on the phone after the kit is returned, you need to gather the information that will go into their Health Program attestations \u2014 the Victim Attestation from the client and Third Party Attestations from witnesses. These describe the client\u2019s presence in the 9/11 exposure zone and must be specific:",
          },
          {
            type: "latency-list",
            items: [
              { time: "Where", desc: "Exact address and cross streets \u2014 not \u2018Broadway\u2019 or \u2018lower Manhattan\u2019" },
              { time: "When", desc: "Specific date range at each location" },
              { time: "Activity", desc: "What they were doing there \u2014 working, living, attending school \u2014 and in what capacity" },
              { time: "Hours", desc: "How many hours per day and on which days" },
            ],
          },
          {
            type: "paragraph",
            text: "On the question of dust and smoke exposure: when you speak to a client \u2014 especially a responder who worked around Ground Zero \u2014 ask them to describe what their environment was like. Was there visible dust? Debris in the air? Did they work in areas that had been recently disturbed? You\u2019re not making a determination for them, but you want to draw out the full picture of what their exposure actually was.",
          },
          {
            type: "callout", style: "info", icon: "\ud83d\udccb",
            text: "**A note on the intake exposure form.** B&M uses the information on the client\u2019s intake exposure form to complete the Health Program application on their behalf. The client will also complete a separate exposure form at their WTCHP clinic \u2014 that one is used for certification. When the client fills out their clinic form, the exposure tier they select (heavy, medium, or light dust) determines the number of hours required for their illness to be certified. This is not something we complete for clients, but it is worth explaining clearly: if their exposure included visible dust and debris, especially close to the site, they should reflect that accurately when they complete their clinic paperwork.",
          },
        ],
      },
    },
    // ─── CARD 7: ENROLLMENT PATH ───
    {
      id: "m3-enrollment",
      nav: "Enrollment & What Follows",
      type: "content",
      data: {
        title: "Enrollment, What Follows, and Why Timelines Matter",
        subtitle: "The process from application to Attorney Review \u2014 and why it\u2019s less linear than it looks",
        intro: "Once the authorization documents are in, B&M submits the client\u2019s WTCHP application. From there, the process follows a sequence \u2014 but in practice, different clients reach you at different stages of it. Understanding the intended sequence and where things get messy is equally important.",
        blocks: [
          {
            type: "subheading",
            text: "The intended sequence",
          },
          {
            type: "paragraph",
            text: "**Application submitted.** Once the signed WTCHP application signature form is returned, B&M submits the enrollment application on the client\u2019s behalf using the information from their intake exposure form. You cannot submit without the signed form.",
          },
          {
            type: "paragraph",
            text: "**Clinic assigned.** The WTCHP assigns the client to a Clinical Center of Excellence in the New York metro area, or to a Nationwide Provider Network provider if they live outside the area. The clinic assignment is not something B&M controls.",
          },
          {
            type: "paragraph",
            text: "**Medical Health Questionnaire (MHQ).** After clinic assignment, the client must complete the MHQ \u2014 a detailed health history form. We do not complete the MHQ with clients. We explain what it is and encourage them to use their clinic\u2019s online portal, or to schedule time with their clinic to complete it by phone or in person. The IHE cannot be scheduled until the MHQ is on file.",
          },
          {
            type: "callout", style: "warn", icon: "\u26a0\ufe0f",
            text: "**The exposure form at the clinic matters for certification.** The form the client completes at their WTCHP clinic determines whether they are categorized as heavy, medium, or light dust exposure. This categorization determines the number of hours required for their illness to be certified. This is not something we complete for clients, but it is worth explaining clearly: if their exposure included visible dust and debris, they should reflect that accurately. The highest tier that honestly applies to their situation is in their interest.",
          },
          {
            type: "paragraph",
            text: "**Initial Health Evaluation (IHE).** The IHE is the client\u2019s first appointment at their assigned clinic \u2014 a clinical evaluation where the WTCHP physician examines the client and reviews their history. **When a client tells you they have scheduled their IHE, flag it immediately.** This is the trigger for a Medical Specialist call \u2014 a B&M Medical Specialist will speak with the client before the appointment to help them prepare, and will follow up to assist with medical record submission to the Health Program. Tell clients explicitly: call us when you schedule your IHE.",
          },
          {
            type: "paragraph",
            text: "**Attorney Review.** Approximately one month after the client is enrolled, the account moves to Attorney Review. An attorney reviews the claim, creates a roadmap for next steps, and schedules a call with the client. After that call, the client is assigned to a CA II, who will handle the VCF claim process.",
          },
          {
            type: "subheading",
            text: "Where it gets messy \u2014 and why that\u2019s okay",
          },
          {
            type: "paragraph",
            text: "The sequence above is the intended path. In practice, by the time a CA II inherits a client, that client may have already attended their IHE, may still be waiting to schedule it, or may even have received their certification letter. The attorney review call may happen before or after the IHE. During the attorney review period, clients often continue calling their CA I \u2014 because the attorney is now the account owner but hasn\u2019t yet spoken to the client.",
          },
          {
            type: "paragraph",
            text: "This is a reality of the current workflow. What it means for you as a Client Advocate is this: **don\u2019t assume where a client is in the process \u2014 always check.** When you speak to a client, your first job is to figure out exactly where they stand, and from wherever they are, identify what\u2019s next and move it forward.",
          },
          {
            type: "subheading",
            text: "What the client should expect",
          },
          {
            type: "paragraph",
            text: "Certification typically takes **two to seven months** from the time of the IHE, depending on the condition, the clinic\u2019s workload, and whether medical records have been submitted. Clients often want to know \u2018how long will this take?\u2019 \u2014 give them a realistic range and explain that the main things in their control are completing the MHQ promptly, attending the IHE, and providing medical records when asked.",
          },
          {
            type: "callout", style: "info", icon: "\ud83d\udccb",
            text: "**Prior lawsuits.** If a client mentions having filed a prior 9/11-related lawsuit at any point in your conversations, flag it to your supervisor or team attorney via Chatter. This doesn\u2019t come up often, but when it does it requires attorney eyes.",
          },
        ],
      },
    },
    // ─── CARD 8: TRANSCRIPT ───
    {
      id: "m3-transcript",
      nav: "Apply It: Three Calls",
      type: "transcript",
      data: {
        title: "Three Calls, Three Decisions",
        subtitle: "Each call reaches a moment where you need to make the right call",
        intro: "You\u2019ll read three short call transcripts. Each one reaches a decision point. At that point, you need to identify the right next step. These situations come up regularly \u2014 there are right and wrong answers, and the consequences matter.",
        calls: [
          {
            callTitle: "Call 1 \u2014 Marcus",
            lines: [
              {
                type: "ca",
                speaker: "Client Advocate",
                text: "Thanks for calling, Marcus. I\u2019m going over your intake documents and I want to flag something before we go any further. In your intake notes from the Client Acquisition team, it says you mentioned a prior lawsuit \u2014 can you tell me a little more about that?",
              },
              {
                type: "client",
                speaker: "Marcus",
                text: "Yeah \u2014 I was part of a group lawsuit back in 2006. My attorney at the time said it settled. I think I got around $40,000. That was a long time ago.",
              },
              {
                type: "ca",
                speaker: "Client Advocate",
                text: "Got it. And was this related to 9/11 \u2014 your time at the site?",
              },
              {
                type: "client",
                speaker: "Marcus",
                text: "Yeah, it was. My whole crew was in it.",
              },
              {
                type: "decision",
                question: "What is the right next step?",
                options: [
                  "Continue with intake \u2014 the lawsuit was settled and closed years ago, so it no longer affects the claim.",
                  "Escalate to your supervisor or team attorney via Chatter immediately. A prior 9/11 lawsuit that was settled needs attorney review before proceeding.",
                  "Have Marcus sign the Signature Page now and add a note to the file flagging the lawsuit for the attorney to review later.",
                  "Ask Marcus to gather his settlement documents and submit them with the intake kit \u2014 this can be assessed during preliminary review without attorney involvement.",
                ],
                correctIndex: 1,
                feedback: "Marcus\u2019s prior 9/11 lawsuit must be reviewed by an attorney before proceeding. Whether his settlement meets the VCF\u2019s specific date and release requirements is a legal question, not a paperwork question. Additionally, depending on the settlement amount relative to the maximum possible VCF award, prior payments may affect whether Marcus would receive any additional compensation from the VCF even if eligible. Escalate to your supervisor or team attorney via Chatter now.",
              },
            ],
          },
          {
            callTitle: "Call 2 \u2014 Patricia",
            lines: [
              {
                type: "ca",
                speaker: "Client Advocate",
                text: "Hi Patricia, I got your Exhibit A back \u2014 thank you for returning it so quickly. I noticed one field was left blank: the initials for the mental health information section. I wanted to check in before we move forward.",
              },
              {
                type: "client",
                speaker: "Patricia",
                text: "Oh \u2014 I wasn\u2019t sure about that one. I don\u2019t have any mental health issues related to 9/11, at least nothing diagnosed. Does it matter if I initial it if it doesn\u2019t apply to me?",
              },
              {
                type: "decision",
                question: "What do you tell Patricia?",
                options: [
                  "Tell her the field only applies to clients with a diagnosed mental health condition \u2014 she can leave it blank.",
                  "Explain that the mental health initials field is required for all claimants regardless of diagnosis. She\u2019ll need to sign a new Exhibit A with all fields complete. Offer to email the blank form so she can print, sign, and scan it back.",
                  "Initial the field on her behalf and note in the file that she gave verbal authorization.",
                  "Submit the form as-is with a cover letter explaining that the field was left blank because the client has no mental health history.",
                ],
                correctIndex: 1,
                feedback: "The mental health initials field is required for every claimant. Patricia cannot simply add an initial to the already-signed form \u2014 she needs to sign a fresh Exhibit A with the field completed. Offer a convenient way for her to return the corrected form.",
              },
            ],
          },
          {
            callTitle: "Call 3 \u2014 Robert",
            lines: [
              {
                type: "ca",
                speaker: "Client Advocate",
                text: "Robert, I\u2019m reviewing your file and I see a note that you believe you\u2019re already enrolled in the Health Program \u2014 can you tell me what you remember about that?",
              },
              {
                type: "client",
                speaker: "Robert",
                text: "Yeah, I think so. I got some paperwork from them maybe two years ago. I went in, they took my blood pressure, asked me a bunch of questions. I haven\u2019t really heard from them since.",
              },
              {
                type: "ca",
                speaker: "Client Advocate",
                text: "Did you get any letter from them after the appointment \u2014 something saying your condition was approved or certified?",
              },
              {
                type: "client",
                speaker: "Robert",
                text: "I don\u2019t think so. I might have thrown some stuff out. I\u2019m honestly not sure.",
              },
              {
                type: "decision",
                question: "What is the right next step?",
                options: [
                  "Assume Robert is enrolled based on the appointment he described and move forward toward the Eligibility Ready stage.",
                  "Check Salesforce for documentation of Robert\u2019s enrollment status. If it\u2019s unclear, conference call the WTCHP at (888) 982-4748 with Robert on the line to confirm his enrollment and certification status before taking any next steps.",
                  "Submit Robert\u2019s WTCHP application as if he were a new enrollee \u2014 better to re-apply than to risk missing a step.",
                  "Ask Robert to contact his clinic in person and bring back whatever paperwork they give him.",
                ],
                correctIndex: 1,
                feedback: "What Robert described sounds like an Initial Health Evaluation \u2014 but an IHE is not the same as enrollment confirmation or certification. Before any next steps, check Salesforce. If that\u2019s inconclusive, conference call the WTCHP with Robert on the line \u2014 he must be present and consent before the WTCHP will share any information. Never assume where a client is in the process; always confirm.",
              },
            ],
          },
        ],
      },
    },
    // ─── CARD 9: ASSESSMENT ───
    {
      id: "m3-assessment",
      nav: "Final Assessment",
      type: "assessment",
      data: {
        title: "Final Assessment",
        subtitle: "Five questions \u2014 answer correctly to move forward",
        questions: [
          {
            question: "A client returns their Signature Page with every line initialed \u2014 including the Personal Representative section. The client is a living claimant. What do you do?",
            options: [
              "Submit the form \u2014 having too many initials is not an error.",
              "White out the PR initial and submit with a cover note explaining it was initialed in error.",
              "Obtain a new signed Signature Page with the PR section left completely blank. For living claimants, the PR section must not be initialed.",
              "Ask the attorney to review the form and determine whether to submit as-is.",
            ],
            correctIndex: 2,
          },
          {
            question: "Which of the following best describes why the CIRF must match the CMS exactly?",
            options: [
              "The CIRF is what the VCF uses to determine the client\u2019s award amount.",
              "The CIRF is the VCF\u2019s source of truth for the client\u2019s identity in their Claim Management System \u2014 any discrepancy triggers a hold on the claim.",
              "The CIRF is the document that authorizes B&M to act on the client\u2019s behalf with the VCF.",
              "The CIRF is optional \u2014 it\u2019s only required if the VCF contacts us about a discrepancy.",
            ],
            correctIndex: 1,
          },
          {
            question: "A client calls to say they\u2019ve just scheduled their Initial Health Evaluation for next week. What should the Client Advocate do?",
            options: [
              "Congratulate the client and note it in Salesforce \u2014 no immediate action is required until after the appointment.",
              "Transfer the client to the attorney, who handles all communication after the IHE is scheduled.",
              "Ask the client to bring copies of their medical records to the IHE and the clinic will handle submission to the WTCHP.",
              "Flag the IHE immediately \u2014 this is the trigger for scheduling a Medical Specialist call with the client before the appointment, and for confirming the status of medical record collection.",
            ],
            correctIndex: 3,
          },
          {
            question: "Which document in the WTCHP intake kit can only be signed by the applicant themselves or a court-appointed legal guardian?",
            options: [
              "The HIPAA Authorization for Designated Representatives",
              "The Designated Representative Appointment Form",
              "The WTCHP Online Application Signature Form",
              "Both the Designated Representative Appointment Form and the HIPAA Authorization",
            ],
            correctIndex: 2,
          },
          {
            question: "A client mentions they aren\u2019t sure whether their kit documents need to be originals or if scanned copies will work. Which of the following is accurate?",
            options: [
              "Scanned copies are acceptable for all documents in the intake kit.",
              "VCF and WTCHP authorization forms require original hand-signed documents to be returned. For Witness Presence Statements and Health Program attestations, a clear photo or scan of the signed page is acceptable.",
              "Original documents are only required for the Signature Page and CPA \u2014 all other forms can be scanned.",
              "Electronic signatures are acceptable for all documents as long as they are accompanied by a photo ID.",
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    // ─── CARD 10: COMPLETION ───
    {
      id: "m3-complete",
      nav: "Module Complete",
      type: "completion",
      data: {},
    },
  ],
};
