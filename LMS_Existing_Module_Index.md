# LMS Existing Module Index

---

## Module: Foundational Concepts

**Path:** `src/data/module2Data.js`
**Audience:** New hires at Barasch & McGarry (New Hire Pathway)
**Length:** unknown
**Depth:** applied

### Topics taught
- WTCHP purpose and administering agency — HHS/CDC/NIOSH; certifies illness, provides healthcare
- VCF purpose and administering agency — Department of Justice; provides financial compensation
- Two-program sequence — WTCHP certification is prerequisite for most living VCF claimants; programs are separate
- Illness tier classification (internal B&M) — Tier 1 solid/blood cancers, Tier 2 ILDs and non-melanoma skin, Tier 3 aerodigestive; internal use only
- Qualified illness categories — specific conditions listed per tier including cancer sub-types and aerodigestive conditions
- Cancer minimum latency periods — five specific periods: ~5 months (blood), 1 yr (childhood), 2.5 yr (thyroid), 4 yr (most solid), 11 yr (mesothelioma)
- Non-cancer maximum time intervals — no MTI for COPD/emphysema/ILDs; 5 yr upper respiratory; 1 yr GERD alone; 5 yr GERD co-occurring with respiratory
- WTCHP exposure zone (survivor) — south of Houston, 1.5-mile radius from Ground Zero, through 7/31/2002
- WTCHP exposure zone (responder) — south of Canal/west of Clinton, through 7/31/2002
- WTCHP enrollment hour minimums — specific thresholds by category (responder/survivor) and time window; dust-cloud exception
- Special occupational 4-hour threshold — vehicle maintenance, medical examiners' staff, active FDNY/NYPD, heavy-dust workers
- WTCHP certification exposure tiers — Tier 1/2/3 (heavy/medium/light exposure) with distinct hour requirements; relationship to enrollment
- Enrollment vs. certification distinction — meeting enrollment hours does not guarantee certification hours
- VCF exposure zone — south of Canal/west of Clinton; window 9/11/2001–5/30/2002; 10am start on 9/11
- WTCHP vs. VCF zone boundary difference — different geographic and date boundaries explicitly compared
- WTCHP POP evidence standard — claimant attestation plus two third-party attestations showing hours and location; family witnesses accepted
- VCF POP evidence hierarchy — EVL and TPV as primary; certified transcript, letter of residence; WPS as secondary
- WTCHP vs. VCF witness standard — WTCHP: awareness of exposure; VCF: direct eye-witness; at least one VCF witness must be non-family
- VCF recent enforcement change on primary evidence — EVL/TPV or documented attempt required before VCF will rely on WPS alone
- Address specificity requirement — cross streets or exact address needed; street name alone insufficient for WTCHP attestation
- Medical records retention risk — NY facilities may only retain records 7 years; old diagnosis dates may be unprovable

### Topics referenced but not taught
- EVL (Employment Verification Letter) — named as primary VCF POP evidence; sufficiency criteria not covered
- TPV (Third Party Verification) — named as primary VCF POP evidence; process not covered
- WPS (Witness Presence Statement) — named as VCF witness form; content or collection process not covered
- Authorization forms (Signature Page, Exhibit A) — listed as required VCF claim components; content and process not covered
- WTCHP enrollment process — existence noted, steps not covered
- VCF claim submission process — referenced as the endpoint; steps not covered
- Alternative paths to VCF without WTCHP certification — mentioned as existing; not covered
- Non-economic loss (NEL) — appears as a term in assessment answer options; not defined or taught
- Economic loss — not mentioned
- Severity — not mentioned
- CPA, CIRF — appear in assessment wrong-answer options; not defined or taught
- Inland/satellite WTCHP locations — mentioned in passing in exposure zone description; not detailed

### Assessments
- Knowledge-check quiz after two-programs card — tests WTCHP/VCF as separate programs; includes retry variant on WTCHP-first sequencing rule
- Matching exercise — match seven illness/condition types to correct latency or MTI value
- Knowledge-check quiz after exposure card — tests survivor zone eligibility and enrollment hour calculation; includes retry variant on enrollment-vs-certification gap
- Knowledge-check quiz after VCF POP card — tests WTCHP vs. VCF witness standard distinction; includes retry variant on eye-witness definition
- Scenario (3 steps, new client "Denise") — applies zone eligibility check, MTI edge-case judgment, and defunct-employer POP strategy
- Final assessment (5 questions) — VCF administering agency; required VCF claim components; GERD MTI calculation; WTCHP vs. VCF witness distinction; VCF POP strategy for an active employer

### Notes for authoring
- All foundational vocabulary (WTCHP, VCF, latency, MTI, POP, tiers) is established here — later modules assume this without re-introduction
- EVL, TPV, WPS, and authorization forms are named but not explained — a learner who only completed Module 2 cannot collect or evaluate these documents
- No compensation concepts taught (NEL, EL, award amounts, severity) — first introduced in later modules
- No claims process steps taught (intake, retainer, sign-up) — Module 3 covers these
- The "alternative paths" note in the two-programs card explicitly defers PPP, amendment, and expedite pathways to later modules
- Scenario step 3 introduces defunct-employer POP strategy as a concept; the detailed workflow is not taught here
- Illness tiers are marked internal-only; the module explicitly instructs learners never to discuss tiers with clients

---

## Module: From Sign-Up to Submitted

**Path:** `src/data/module3Data.js`
**Audience:** New hires at Barasch & McGarry (New Hire Pathway)
**Length:** unknown
**Depth:** applied

### Topics taught
- Retainer Agreement — purpose, 10% fee (statutory maximum), VCF-only power of attorney scope, fiduciary obligation
- E-retainer vs. physical retainer — timing (within 24 hours of sign-up), when physical copy goes in kit
- Signature Page — authorizes DOJ/B&M, waives civil lawsuit rights; every line initialed for living claimants except PR section, which must be blank
- Exhibit A — permits VCF to obtain WTCHP certification; mental health initials required for all claimants regardless of diagnosis
- CIRF — source of truth for PII in VCF CMS; must match CMS exactly; used to correct CMS errors
- CPA — authorizes VCF to pay into B&M trust account; requires signature, date, and B&M countersignature
- WTCHP Application Signature Form — formal WTCHP enrollment application; client-only signature; escalate if client cannot sign
- Designated Representative Form — appoints Ryah Mesch as B&M's WTCHP representative; must be submitted with HIPAA Auth
- HIPAA Authorization (DR) — grants Designated Rep access to WTCHP health information; submit together with Designated Rep Form
- Internal intake forms — Exposure Form (for WTCHP application), Witness Contact Form (PI vs. FA variants), Medical History Form, Contact Form — purpose of each
- Salesforce document status — Open, Closed (requires received date and closed date), DNU (Do Not Use); never delete a document
- CMS — what it is, document permanence, PII mismatch treated as data breach
- Document integrity — four rules: any change requires new signature, superimposing prior signature is fraud, documents must match CMS, templates must be free of prior-client PII
- Original signature requirement — authorization docs require originals returned; attestations and WPS acceptable as clear photo/scan
- Kit workflow — intro call sequence, follow-up cadence per SLA, kit review call; review all documents before the review call
- WTCHP attestation content requirements — exact address and cross streets, specific date range, activity and capacity, hours per day
- WTCHP enrollment sequence — application → clinic assignment → MHQ and Exposure Form → IHE → Attorney Review
- IHE as workflow trigger — scheduling the IHE triggers a Medical Specialist call; learner must flag IHE immediately
- Enrollment vs. IHE distinction — an IHE appointment is not enrollment confirmation; must verify from primary source (WTCHP call or documentation)
- WTCHP communicates with client only — enrollment confirmations go to client, not B&M
- Certification timeline — 2–7 months from IHE
- WTCHP verification call — conference call at (888) 982-4748; client must be present and consent before WTCHP shares any account information
- Prior 9/11 lawsuits — document and Chatter supervisor; settlement date, amount, and case status all matter; does not automatically disqualify

### Topics referenced but not taught
- FA (Fatal Accident) claims — separate kit forms exist; explicitly deferred to Module 5
- Attorney review call — described as a post-enrollment step; call content not covered
- Medical Specialist role — mentioned as receiving IHE trigger; role and responsibilities not detailed
- CA I vs. CA II distinction — mentioned in enrollment narrative; role definitions not taught here
- Eligibility Ready stage — named as a downstream status; not defined
- Medical records collection — mentioned (original diagnostics, patient portal access); collection process not taught
- SLA follow-up timelines — existence noted; specific timelines not provided ("follow your team's guidelines")
- Designated Rep SOP — cross-referenced to SharePoint; not covered in module
- Clinical Centers of Excellence and Nationwide Provider Network — named as clinic assignment options; not detailed
- Health Program certification letter — referenced as documentation to look for; process not covered
- Prior lawsuit settlement offset on VCF awards — mentioned as a factor; mechanics not explained
- Chatter — named as communication channel for supervisor escalation; not explained

### Assessments
- Document-review exercise (image-review mode, 7 errors) — CIRF claim number format, CIRF date-of-birth error, CIRF name mismatch; Signature Page PR section initialed by living claimant, Signature Page undated; Exhibit A mental health field blank, Exhibit A name mismatch
- Knowledge-check quiz after document integrity — tests re-signing rule on witness statement typo; retry on CIRF name mismatch workflow
- Transcript with 3 decision points — prior lawsuit handling (Marcus), Exhibit A mental health field re-sign (Patricia), enrollment status verification from primary source (Robert)
- Final assessment (5 questions) — Signature Page PR section rule, CMS name mismatch resolution, IHE trigger action, WTCHP form signing requirements (client-only), original vs. scan rules

### Notes for authoring
- Assumes all Module 2 vocabulary (VCF, WTCHP, POP, two-program sequence, tiers) without re-introduction
- EVL and TPV are mentioned once (as the exception to the electronic signature rule for third-party submissions) but not explained — Module 4 covers them
- Module ends at the enrollment stage; VCF claim building, POP document collection, and submission are not covered
- The WTCHP phone number (888) 982-4748 is embedded in transcript feedback — the only place in the LMS where a real operational phone number appears in content
- SLA cadences are referenced but not specified; learners are directed to team guidelines, implying this is team-specific operational detail outside the LMS
- CA I and CA II as distinct roles are implied but not defined; a new-hire reader would benefit from a role-definition reference before or alongside this module

---

## Module: Proof of Presence: Building the Case

**Path:** `src/data/module4Data.js`
**Audience:** New hires at Barasch & McGarry (New Hire Pathway)
**Length:** unknown
**Depth:** applied

### Topics taught
- Who does not need to submit POP — employers with direct VCF relationships (FDNY, NYPD pre-2008 NOP, Port Authority, ConEdison, and others named in firm resources); VCF1 claimants
- NYPD NOP distinction — officers who submitted a NOP before 2008 are exempt; those who did not must submit standard POP
- Two categories of primary evidence — sufficient vs. non-sufficient
- EVL sufficiency criteria — specific address, specific dates, HR or legal signatory, working phone number, direct transmission to VCF third-party verification email address
- TPV as sufficient primary evidence — same transmission standard as EVL
- Union records as sufficient — when meeting the TPV standard with specific address and dates
- Certified school transcript as sufficient — must be sent directly by the school registrar, not given to the claimant
- Residence verification letter as sufficient — for residents; specific address and dates; sent directly by the managing entity
- Non-sufficient primary evidence types — tax returns, pay stubs, lease agreements, work ID badges, dispatch records, photos
- Three-path decision framework — sufficient alone → submit alone; non-sufficient → submit with two WPS; no primary evidence → two WPS with documented outreach
- Non-sufficient primary evidence submission practice — submit alongside WPS when consistent; withholding non-sufficient documents when WPS are available is explicitly identified as outdated practice
- Contradiction rule — non-sufficient evidence that contradicts the WPS must not be submitted
- VPS — named; module teaches it is not typically submitted (brief treatment only)
- WPS age eligibility — witness must have been at least 18 years old on September 11, 2001
- WPS family member rule — at least one witness must be non-family; one close family member acceptable as a second witness
- WPS form requirements — witness identifiers: DOB, phone number, VCF number if applicable; form must be signed
- WPS specificity requirements — exact address and cross streets, specific date range, daily hours, capacity and activity
- Dust WPS content requirements — witness encountered client on or about 9/11/2001; saw client covered in dust; color, amount, and location of dust; when and where seen; what client said about where they were engulfed; client's demeanor at the time
- Supervisor statement as valid WPS — supervisor who dispatched claimant to the exposure area and has knowledge the claimant reported there; VCF Policies and Procedures §1.8 cited
- Cover letter language for supervisor WPS — VCF P&P §1.8 language quoted verbatim as required language for submission cover letter
- Salesforce entity account as first resource — check entity account and P&P for documented EVL/TPV request process before contacting any employer
- Documented EVL/TPV outreach for defunct employers — email exchange confirming no records constitutes good-faith documentation; upload to CMS; reference in cover letter
- Familial relationship disclosure — note in both the WPS and the cover letter

### Topics referenced but not taught
- Dust affiant — introduced as a distinct witness category; explicitly deferred to a later module
- VCF1 claim mechanics — VCF1 clients named as exempt from standard POP; what VCF1 is and how those claims are handled not covered
- NYPD NOP form and submission process — the pre/post-2008 distinction is tested but the NOP form and process are not explained
- Cover letter format and content requirements — referenced as required for non-standard submissions (supervisor WPS, defunct employer outreach, familial witnesses) but structure and required content not taught
- Salesforce entity account navigation — introduced as a first-step resource; what entity accounts are and how to use them not explained
- VPS purpose and usage — named as a form that is not typically submitted; when or why it would be submitted not covered
- Employer-specific EVL/TPV submission protocols — Verizon cited as an example with a documented process; process for other employers not generalized beyond "check entity account"
- POP for amendment or expedite pathways — not mentioned

### Assessments
- Document-review exercise (find-errors mode) — EVL with 4 errors: vague location description, no specific dates, Operations Manager signatory (not HR or legal), wrong transmission path (sent to office, not directly to VCF)
- Sufficiency-quiz block (8 items, inside content card) — classify each document type as sufficient or non-sufficient primary evidence; items include pay stubs, compliant EVL, lease agreement, certified school transcript, work ID badge, union roster without specific address, residence verification letter, tax return
- Knowledge-check quiz — Verizon claimant: check Salesforce entity account first; retry on defunct employer with email confirmation of no records → upload email exchange, proceed with two WPS
- Transcript with 1 decision point — Robert Figueroa's witnesses: identify Danny as ineligible due to age (~born 2002–2004); Marco as eligible family member (brother-in-law); Eddie as eligible non-family satisfying the non-family requirement
- Scenario (3 steps, "Delores") — lease and tax returns classified as non-sufficient; witness eligibility applied (Jaylen ineligible by age, Daniel eligible as family, Gloria eligible as non-family); full POP submission strategy assembled from all consistent documents
- Final assessment (5 questions) — FDNY direct VCF relationship; EVL transmission requirement (must go directly from employer to VCF); defunct employer three-document submission; recent college graduate witness age ineligibility; consistent non-sufficient documents strategy

### Notes for authoring
- Assumes all Module 2 vocabulary (VCF, WTCHP, POP, exposure zone) and Module 3 vocabulary (CMS, EVL, TPV, WPS) without re-introduction
- Yajaira (introduced in a prior module) is referenced in a yajaira-check block at the end of the witnesses section; Marcus and Delores are new characters introduced in the story card; Robert appears only in the transcript card
- Dust affiant is named and deferred — a learner who completes this module knows the category exists but cannot handle one
- VCF1 exemption is noted but unexplained — a learner cannot identify or handle a VCF1 claim after this module beyond knowing the exemption exists
- Cover letter is invoked repeatedly as the mechanism for contextualizing non-standard POP packages (supervisor WPS, defunct employer, familial witnesses) but its format and content requirements are never taught
- The correction of the "withhold non-sufficient docs when WPS are available" practice appears in both the Delores scenario feedback and the final assessment — notable instructional emphasis suggesting this is a common error among new hires
- Salesforce entity accounts are introduced as a required first step but their structure and navigation are not covered here

---

## Module: From Certification to Close

**Path:** `src/data/module5Data.js`
**Audience:** New hires at Barasch & McGarry (New Hire Pathway)
**Length:** unknown
**Depth:** applied

### Topics taught
- CA I to CA II handoff — CA I creates Salesforce escalation and moves case to Attorney Review status after enrollment; account ownership transfers to a CA II
- ER Call (Eligibility Ready Call) — occurs within 30 days of enrollment escalation; attorney confirms documents on file, VCF POP needs, and any basis for non-standard NEL; generates the ER Note
- ER Note — attorney-authored Salesforce note; contains certified conditions, NEL/severity flag, POP requirements, document status; roadmap for CA II submission
- WTCHP certification confirmation — must be confirmed by calling the clinic with the client on the line; clinic will not share account information without the client present
- Mental health certification does not yield VCF compensation — WTCHP can certify psychological conditions; the VCF cannot compensate for them; at least one certified physical condition required
- NEL (Non-Economic Loss) — compensation for pain and suffering; every eligible certified physical condition qualifies; illness tier determines base award level; severity can increase the award within the tier range; never discuss tiers or promise specific award amounts with clients
- Severity — basis for increased NEL; supported by medical records showing functional impairment; factors include frequency of treatment, specialist involvement, surgical history, documented functional limitations
- Prostate cancer severity triggers — metastasis, recurrence, additional surgeries beyond initial treatment, or ED/urinary issues not resolved by medication persisting two years after treatment
- EL (Economic Loss) — lost income from a disabling 9/11-related condition; requires official disability determination (Social Security Disability, union, or private insurer); documentation of onset, duration, and cause required
- Exhibit 1 (SSA Consent Form) — required for EL claims; named as part of required EL documentation
- FDNY EL documentation — cited as an example requiring employer-specific documents; check policies and procedures for requirements
- CA II role in identifying severity and EL — probing questions when client mentions worsening condition, new treatment, or potential disability
- VCF claim package — five required categories: Authorization (Signature Page + Exhibit A), Certification, Proof of Presence, Medical Records with cover letter and EL documentation, CPA
- Authorization submission rules — no electronic signatures accepted; CMS document type selection matters; missing Signature Page or Exhibit A triggers Denied status before review
- CPA submission requirements — properly executed and countersigned; VCF claim number must match CMS exactly; countersignature is an internal B&M step
- Preliminary VCF review — confirms authorization documents present; contacts WTCHP to verify at least one certified physical condition; issues MI letter if anything is missing
- Substantive VCF review — confirms timely registration, eligible certified condition, sufficient POP, resolution of prior lawsuits; issues eligibility decision letter; up to 12 months from submission
- MI letter (Missing Information letter) — VCF issues during review; B&M receives before the client; must respond within timeline stated in letter; failure to respond results in decision on file as-is
- Eligibility decision letter — lists conditions found eligible; basis for award calculation; is not the award
- Award determination timeline — 2 to 12 months after eligibility confirmation; VCF sends automated correspondence during review
- LCL (Loss Calculation Letter) — VCF's award determination; every LCL undergoes attorney review at B&M before any response is given to the VCF
- Award call — attorney reviews LCL, assesses whether it is fair, gives client a clear recommendation; 30-day acceptance window from award date; accept or appeal
- Appeal — available within 30-day window; goes before a VCF hearing officer; delays payment; attorney advises on likelihood of different outcome
- Award payment — VCF deposits full award into B&M trust account; B&M disburses client portion (gross award minus 10% fee) within 30 days of receipt
- Collateral offset — LCL may include offset for prior 9/11-related lawsuit settlement; reduces the amount on which the fee is calculated (tested in assessment: $250K award − $50K offset × 90% = $180K to client)
- 90-day proactive status updates — CA II contacts client proactively every 90 days regardless of whether there is substantive news
- Parallel POP track strategy — run EVL/TPV outreach and WPS collection simultaneously; do not wait for EVL before contacting witnesses
- Do not submit WPS alongside a sufficient EVL — adds scrutiny and can generate unnecessary MI letters; WPS remain in file in case needed later
- Pre-submission document verification — verify all documents against CMS before submission; close document records in Salesforce once confirmed
- Expedite pathway — for terminal clients (prognosis less than 12 months), those in active treatment, or facing severe financial hardship; terminal prognosis is an immediate escalation trigger to the expedite team or supervising attorney
- Amendment pathway — for clients who received a prior VCF award but have developed a new certified condition, experienced a substantially worsened condition, or have a new basis for EL; prior award does not preclude additional compensation
- FA (Family Assistance) pathway — for deceased claimants; court-appointed Personal Representative required before claim can proceed; 9/11-related cause of death → wrongful death claim; cause of death unrelated to certified condition → claim continues for certified conditions
- B&M FA team and Surrogates team — handle PR designation process for deceased clients; CA II connects the family to these teams

### Topics referenced but not taught
- PPP (Pre-Presumptive Process) — named as the exception to the "no certification → pre-screen denial" rule; process and eligibility criteria not covered
- Medical Specialist role — referenced as a pre-ER-Call step for uncertified clients; role not defined here
- Amendment submission mechanics — pathway explained at the concept and trigger level; actual amendment workflow not covered
- Expedite pathway mechanics — trigger and escalation step covered; expedite team process not covered
- FA/wrongful death claim mechanics — pathway explained at the concept and trigger level; PR designation process and FA-specific workflow not covered
- Exhibit 1 / SSA Consent Form — named as required for EL; contents and collection process not described
- B&M EL Documents resource — referenced as the source for employer-specific EL document requirements; not described
- POP cover letter format — referenced as required for all POP packages; structure and content requirements not taught
- Collateral offset rule — offset is applied in an assessment calculation; the rule governing when and how offsets are applied is not taught
- VCF automated correspondence content — clients advised not to act on it and to contact B&M instead; what specific letters look like is not covered
- B&M trust account and disbursement process — mentioned in the award call; mechanics not detailed

### Assessments
- Document-review (action-items mode) — Yajaira's ER Note; 4 sections: certification confirmation call (with client on line), standard NEL requires no immediate action, parallel POP tracks, internal CPA countersignature
- Scenario (3 steps, "Robert's ER Note") — severity record collection for aerodigestive conditions; defunct employer plus single family witness POP plan including second-witness search; invalid CPA and stale Exhibit A remediation
- Multi-select-scenarios (5 scenarios, inside content card) — categorize compensation type for each situation: NEL baseline, NEL severity, and/or EL lost income
- Scenario (3 steps, "Pre-Submission Check: Yajaira") — verify auth documents against CMS and close records; keep both POP tracks active; submit EVL alone once it meets the sufficiency standard
- Transcript with 1 decision point — Yajaira's award call: confirm the call accurately reflects the attorney's role in reviewing the LCL and making a recommendation
- Scenario (3 steps with pathwayBoxes, "Three Paths") — identify Amendment (Patricia: prior award, new lung cancer), FA (Robert: deceased, non-9/11 cause of death), and Expedite (Marcus: prognosis under 12 months)
- Final assessment (5 questions) — required authorization documents; VCF automated correspondence handling; LCL math with collateral offset and 10% fee; terminal prognosis escalation; amendment pathway for new certified condition

### Notes for authoring
- Assumes Module 2–4 vocabulary throughout; first module to define NEL, severity, and EL in full
- CA I / CA II role distinction is applied operationally here for the first time — CA I owns enrollment; CA II owns post-certification through submission
- PPP is named as an exception in the certification card but is not taught; a learner cannot handle a PPP submission after completing this module
- Collateral offset calculation is tested in the final assessment but the rule governing when offsets apply is never explained
- Exhibit 1 and B&M's EL Documents resource are both named as required parts of an EL submission; a learner cannot independently process an EL claim after this module
- Amendment, expedite, and FA pathways are taught at the recognition and escalation level only — learners can identify which pathway applies and know who to escalate to, but cannot execute the workflows
- Module follows Yajaira as the primary character (story through award call); Robert appears in the ER Note scenario; Marcus appears in the Three Paths scenario
- The "do not submit WPS alongside a sufficient EVL" rule is explicitly taught in the pre-submission scenario and reinforced in the assessment — marks a shift from a more-is-better submission instinct to a targeted-evidence approach

---

## Module: Complex Cases

**Path:** `src/data/module6Data.js`
**Audience:** New hires at Barasch & McGarry (New Hire Pathway)
**Length:** unknown
**Depth:** applied

### Topics taught
- FA claim definition — filed on behalf of a deceased claimant by a court-appointed Personal Representative; same evidence requirements as a PI claim; the PR is B&M's client
- PR requirement — court-appointed before VCF will process an FA claim
- Letters Testamentary — issued by surrogate's court for testate (will-exists) estates; confirms the executor named in the will
- Letters of Administration — issued by surrogate's court for intestate (no-will) estates; appoints an administrator from the state line of succession
- NY state intestate succession order — Surviving Spouse, Children, Grandchildren, Parents, Siblings, Other relations or interested parties
- B&M Surrogates team — handles NY state PR appointment process; takes months even with a will
- Distributee affidavit — allows medical record collection before formal PR appointment in NY state; Distributee is a person who may benefit from the estate and is typically in the line of succession
- FA intake kit — includes everything in the PI kit plus documents for the deceased claim: decedent family and household information, general HIPAA release
- FA Signature Page — PR section must be completed (contrast with PI claims where the PR section is left blank)
- Wrongful death characterization — applies when a 9/11-related condition or its complications caused the death; allows additional compensation: funeral expenses, lost domestic services, awards for surviving spouse and dependent family members
- Non-wrongful-death FA — claim continues for certified conditions with the same compensation avenues as a standard PI claim
- PI-to-FA conversion — vetted by FA Client Acquisition Team for viability; new VCF number assigned; all authorization documents re-collected with new VCF number signed by PR; prior work (especially WTCHP certification) can assist the FA team
- FA POP — same hierarchy as PI (EVL/TPV preferred; same witness eligibility rules); PR helps identify and contact witnesses; FA CA conducts witness outreach directly
- Victim Presence Statement in FA claims — not considered viable POP for VCF purposes even if signed during the victim's lifetime
- PPP requirement for uncertified deceased claimants — deceased claimants cannot be certified by the WTCHP; PPP is the standard path for establishing illness in FA cases
- PPP and exposure hours — PPP requires exposure hours; POP documents (EVLs, TPVs, WPS) must address hours, not just presence
- WTCHP certification survives death — a deceased claimant who was certified before death does not require the PPP; certification remains valid for VCF purposes
- PPP definition — defined VCF process for evaluating a claimant's condition when WTCHP certification is unavailable; not a workaround
- Six PPP use cases — FA claims with uncertified deceased claimants; foreign residents who cannot access the WTCHP; claimants ineligible for WTCHP enrollment; claimants who cannot travel without significant hardship; Pentagon and Shanksville survivors; extremis cases
- PPP required documents — Private Physician Cover Sheet (VCF form summarizing claim basis); Appendix C or D (exposure information form: location, dates, duration, activities); TPIF (Treating Physician Information Form) attached to medical records demonstrating the condition meets VCF latency or MTI requirements
- PPP wrongful death addition — treatment records showing the connection between the illness and cause of death may be required
- Pentagon PPP — Pentagon survivors are VCF-eligible but not WTCHP-eligible and require PPP; hour requirements differ from standard; details deferred to external CDC document
- EVL in PPP context — a sufficient EVL stating full-time work at the eligible location during the exposure period satisfies both the presence and exposure components of the PPP
- Pre-2011 NYPD NOP — carries the weight of one non-family eyewitness WPS; does not supply hours detail; WPS that address hours must be collected separately when PPP is also required
- Expedite pathway — for clients who cannot wait for the standard claim timeline
- Three expedite triggers — terminal prognosis (less than 12 months); active treatment or major surgery; severe documented financial hardship
- Financial hardship examples — housing instability or eviction; loss of essential services (electricity, heat); food instability; requires documentation of the hardship
- Expedite for enrolled clients — accelerated VCF review; WTCHP may prioritize certification for terminal clients
- PPP as expedite tool — terminal non-certified clients can use PPP to establish illness without waiting for WTCHP certification; WTCHP enrollment can run as a parallel process via a separate Salesforce escalation
- CA/CA II role in expedite identification — CAs are often the first to hear about declining health; any indication of health deterioration should be noted in Salesforce and escalated to the supervising attorney or expedite team immediately; team assesses qualification
- Compassionate approach to terminal clients — gather emergency contact; ask whether the client has considered a will; these details help the expedite or FA team if the client's health deteriorates
- Independent eligibility — a family member's prior involvement in a deceased relative's FA claim has no bearing on their own eligibility for a separate PI claim

### Topics referenced but not taught
- FA Client Acquisition Team — named as the team that vets PI-to-FA conversions for viability; role and vetting process not described
- FA-specific authorization forms beyond the Signature Page — module notes "all new authorization documents with the new VCF number, signed by the PR" are required; specific FA forms other than the Signature Page PR section not detailed
- Appendix C vs. Appendix D distinction — both named as the PPP exposure information form; the difference between them is not explained
- TPIF (Treating Physician Information Form) — named as a required PPP document; content and collection process not explained
- Pentagon PPP hour requirements — different from standard; deferred to external CDC WTCHP document
- Surrogates court process timeline and mechanics — handled by B&M's Surrogates team; process not described
- Wrongful death compensation amounts and calculation — funeral expenses, lost domestic services, and dependent awards named; how amounts are determined not covered
- Amendment pathway mechanics — referenced briefly (prior award factored into amendment compensation); amendment workflow not covered here
- VCF claim number assignment for FA conversions — new number is mentioned; how it is obtained not explained

### Assessments
- Scenario (3 steps, "Victor's Claim") — Letters Testamentary for testate estate; pre-2011 NYPD NOP plus hours-focused WPS for PPP; PPP as the illness-establishment pathway for an uncertified deceased claimant
- Knowledge-check quiz — FA claim where deceased was WTCHP-certified before death (PPP not needed); Letters of Administration for intestate estate; retry on terminal prognosis during routine call → immediate escalation to expedite team
- Transcript with 1 decision point — route Victor's new prostate cancer (PI) claim to standard intake, not FA team; note as potential responder claim with no EVL and challenging POP; confirm 4-year latency for prostate cancer
- Final assessment (5 questions) — Letters of Administration for intestate estate; PPP for uncertified deceased (three required documents); EVL satisfying both presence and exposure for Pentagon PPP; terminal prognosis immediate escalation; PPP for living foreign resident (thyroid cancer, 2.5-year minimum latency)

### Notes for authoring
- Assumes Module 2–5 vocabulary throughout; directly expands on FA and expedite pathways introduced at the recognition level in Module 5
- The Appendix C vs. D distinction is untaught — a learner cannot independently determine which form to use after completing this module
- The TPIF is named as a required PPP document but neither its content nor its collection process is taught here
- Pre-2011 NYPD NOP rule is applied in the Victor scenario (2007 NOP = one non-family WPS equivalent) in a slightly different framing than the Module 4 treatment of the NOP (pre/post-2008 exemption vs. NOP as WPS equivalent) — these appear to be two separate provisions; the relationship between them is not explained in either module
- The module uses Victor across two contexts: Module 6 follows his role as Veronique's PR in an FA claim, then the transcript card reintroduces him as an independent PI claimant — a structural choice that models the distinction between a family member's representative role and their own eligibility
- No document-review card and no matching card; the module's assessment activities are concentrated in three scenario/quiz/transcript exercises plus the final assessment

---

## Module: Salesforce Basics

**Path:** `src/components/SalesforceBasicsModule.jsx` (shell); content in `src/components/salesforce/ThemedContainers.jsx` (Data Model) and `src/components/salesforce/ReportingModule.jsx` (Exercises 1–3)
**Audience:** All B&M staff (Tech Stack journey)
**Length:** ~30 min (per module metadata)
**Depth:** applied

**Note on structure:** This module does not use the standard data-file + card architecture. Content is embedded directly in JSX components. The module has five sections with sequential unlock: Data Model → Exercise 1 → Exercise 2 → Exercise 3 → Complete. There is no scored assessment; completion is triggered when the learner reaches the "Try It" stage of Exercise 3.

### Topics taught
- Salesforce objects — themed containers for specific kinds of data; each object has a distinct identity and purpose
- Specific objects used in the module: Lead, Account, Contact, CMS Claim Submission, Call, Case, Supporting Document
- Fields — each object has its own set of fields defining what data it accepts; objects of the same type share the same fields
- Records — each record is one entry with actual field values; the same object type holds many records (e.g. Jane Doe and John Smith are two separate Contact records)
- Master-Detail relationship — parent-child; child object lives inside the parent; removing the parent removes the child; example: Claim Submission inside Account
- Re-parenting — a child record can be transferred to a different parent but always requires one
- Lookup relationship — a field on one object that references a record in another object; both objects exist independently; example: Account's Primary Contact field pointing to a Contact record; Salesforce calls this a Lookup relationship
- Report type selection rule — filter fields determine the report type; all filters on one object → use that object's single-object report type; filters span multiple objects → use a combined report type that includes all needed objects
- Fields ribbon in Report Builder — how to verify that the fields you need exist on a chosen report type before building; required step in each exercise before Start Report is enabled
- Building a single-object report (Exercise 1) — Leads report type; Employer = FDNY filter on Lead object; Show Me = All Leads; Save & Run
- Building a cross-object report (Exercise 2) — Accounts with CMS Claim Submissions report type; Status = Claim Submission filter on Account; Submitted Date ≤ date filter on CMS Claim Submission; Show Me = All Accounts; Save & Run
- Show Me — scopes report to All Accounts (firm-wide) vs. My Accounts (records where learner is the Account Owner); switching Show Me to My Accounts applies an Account Owner = you filter without adding an explicit filter
- Grouping (Summary reports) — Outline tab; drag a field to Group Rows; produces grouped view with subtotals and grand total; Exercise 3 groups by Status
- Account Record Type vs. Type distinction — Type = Client misses pre-retainer accounts; use Account Record Type to scope to PI (VCF Victim) or Estate specifically; embedded as a contextual tip in Exercise 3
- Accounts with CMS Claim Submissions — custom report type that spans Account and CMS Claim Submission objects; used when filtering on fields from both objects simultaneously

### Topics referenced but not taught
- Cases object — appears as a report category (Customer Support Reports) and in the report type list; B&M use of Cases not explained
- Account Owner field — underlies Show Me = My Accounts; how accounts are assigned to owners not covered
- Account Sub-Status, Victim State/Province, Last Activity, Last Modified Date — visible as Account fields in the module; not explained
- Report folders (Public Reports, Private Reports, Shared with Me) — visible in the Reports tab UI; not explained
- Report sharing and permissions — not covered
- Other available report types (Accounts and Client Journey, Contacts & Accounts, Accounts with Supporting Documents, etc.) — visible in the Create Report picker; not explained beyond their names

### Assessments
- No quiz, scenario, or assessment cards — the interactive report-building exercises serve as the assessment mechanism
- Exercise 1: learner must select the correct report type (Leads), verify fields, add one filter, and reach Save & Run
- Exercise 2: learner must select the correct cross-object report type (Accounts with CMS Claim Submissions), verify fields, add two filters across two objects, and reach Save & Run
- Exercise 3: learner must change Show Me from All Accounts to My Accounts and add Status grouping via the Outline tab, then reach Save & Run
- Completion is triggered on reaching the "Try It" stage of Exercise 3; no score is recorded (assessScore and assessTotal are always 0 in the completion payload)

### Notes for authoring
- This module does not follow the standard card-based architecture — it cannot be described in terms of card types, block types, or the standard data-file format documented in LMS_Module_Format_Spec.md
- Content is hard-coded in JSX; edits require modifying component files directly; the Edit Mode / admin override system used by Modules 2–6 does not apply here
- Module metadata (title, description, time) exists in contentService.js MODULE_METADATA but the module is absent from MODULE_MAP — calling getModule("salesforce-basics") throws; the module routes through ModuleDispatcher directly to SalesforceBasicsModule.jsx
- No assessment score is produced; journey progress tracking is based on the two-phase completion lifecycle (markComplete fires when Ex3 is done; recordCompletion fires on explicit Submit button click)
- The "Account Record Type vs. Type" tip in Exercise 3 is the only piece of B&M-specific operational guidance in the module; everything else is generic Salesforce concepts
- The module uses B&M-specific objects and field names (CMS Claim Submission, VCF #, Claim No, Sub-Status) but does not explain what those fields mean or how they are used operationally
