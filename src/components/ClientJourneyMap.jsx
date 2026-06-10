import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "./ClientJourneyMap.css";

// ─── Journey data ─────────────────────────────────────────────────────────────
const PHASES = [
  { id: "client-interest",  name: "Client Interest",                              duration: "Same Day",      color: "#3FA9BE" },
  { id: "signup-intake",    name: "Sign-Up & Intake",                             duration: "2–3 Days",      color: "#5793C8" },
  { id: "kit-enrollment",   name: "Kit Collection & WTCHP Enrollment",            duration: "5–12 Weeks",    color: "#5277B4" },
  { id: "attorney-review",  name: "Attorney Review",                              duration: "6–8 Weeks",     color: "#3F5C9C" },
  { id: "ihe-cert-vcfpop",  name: "IHE Scheduling / Cert Confirmation / VCF POP",duration: "4–8 Months",    color: "#344C86" },
  { id: "award-review",     name: "Post-Submission Follow-Up / Award Review",     duration: "12–24 Months",  color: "#22366A" },
];

const STAGES = [
  {
    id: "initial-contact", name: "Initial Client Contact", phase: "client-interest",
    owner: "Call Center / Chat Bot", timeline: "Same-day response",
    clientExperience: "Client reaches out by phone, email, or website chatbot. They're engaged immediately and asked about illness and exposure, then told someone will follow up soon (within 24 hours).",
    bmSteps: "Same-day response to inbound contact across phone, email, and website chatbot channels.",
  },
  {
    id: "sign-up", name: "Sign-Up", phase: "signup-intake",
    owner: "CAT / Attorney", timeline: "Within 24 hrs of initial contact",
    clientExperience: "Client speaks to an Onboarding Coordinator. Exposure/illness info is confirmed and the client is given an overview of the WTCHP and VCF processes and timelines. Trust and basis of expertise is established.",
    bmSteps: "Within 24 hours of initial contact.",
  },
  {
    id: "welcome-eretainer", name: "Welcome Email / E-Retainer", phase: "signup-intake",
    owner: "Desa Murray", timeline: "Within 24 hrs of lead conversion",
    clientExperience: "An E-Retainer is sent and next steps are communicated via a Welcome E-Mail.",
    bmSteps: "Within 24 hours of lead conversion.",
  },
  {
    id: "send-intake-kit", name: "Send Intake Kit", phase: "signup-intake",
    owner: "Desa Murray", timeline: "48 hrs after welcome email",
    clientExperience: "Client receives important forms for the WTCHP and VCF processes along with a written document instructing them to complete and return the included forms to B&M.",
    bmSteps: "48 hours after the welcome email.",
  },
  {
    id: "kit-follow-up", name: "Kit Follow-Up", phase: "kit-enrollment",
    owner: "CA I", timeline: "7-day cadence until returned",
    clientExperience: "Client is introduced to CA I as their new point of contact, offered help with the Intake Kit, and given a brief overview of the WTCHP process. After initial contact, the client receives follow-up every week until the kit is returned.",
    bmSteps: "Within 7 days of Kit sent date, and every 7 days until contact or disengagement.",
  },
  {
    id: "generate-hp-pop", name: "Generate HP POP", phase: "kit-enrollment",
    owner: "CA I", timeline: "Within 7 days of Kit received",
    clientExperience: "Client is informed that the WTCHP needs proof of exposure for enrollment and is asked about activities and exposure on and after 9/11. Client is asked to locate and send medical records related to their illness.",
    bmSteps: "HP POP call within 7 days of Kit Received Date. Mail VA and TPAs same day.",
  },
  {
    id: "hp-pop-follow-up", name: "HP POP Follow-Up", phase: "kit-enrollment",
    owner: "CA I", timeline: "7-day cadence until returned",
    clientExperience: "Client is contacted within 7 days of sending HP POP documents and asked if they need help finding affiants or returning documents to B&M. Client receives additional outreach until documents are returned.",
    bmSteps: "Follow-up within 7 days of sending HP POP, and every 7 days until returned.",
  },
  {
    id: "confirm-pop-receipt", name: "Confirm POP Receipt / HP App", phase: "kit-enrollment",
    owner: "CA I", timeline: "Submit app within 24 hrs",
    clientExperience: "Client receives an email/text confirming HP POP receipt. Within 24 hours they receive outreach confirming app submission, the processing timeline (4–8 weeks), and next steps for certification.",
    bmSteps: "Confirm HP POP returned to B&M. Submit WTCHP app within the following 24 hours.",
  },
  {
    id: "check-enrollment-status", name: "Check Enrollment Status", phase: "kit-enrollment",
    owner: "CA I", timeline: "4 wks, then biweekly",
    clientExperience: "Client is contacted at 4–8–10 weeks to check on enrollment status. If the client is anxious or 4 weeks have passed, the CA offers to conference call the HP. Once enrolled, the client is asked about clinic and guided on completing clinic health history and exposure forms, and told to contact us with their IHE date.",
    bmSteps: "Follow-up to check enrollment status after 4 weeks. Repeat follow-up every two weeks.",
  },
  {
    id: "eligibility-ready-call", name: "Eligibility Ready Call", phase: "attorney-review",
    owner: "Reviewing Attorney", timeline: "Within 6–8 wks of enrollment",
    clientExperience: "Client speaks to a B&M attorney who confirms documents on file, IHE date (if pending), Cert status (if IHE complete), VCF POP needs, and any basis for non-standard NEL claims (severity, economic loss, replacement services). The attorney communicates the timeline for the VCF claim and requests what's needed.",
    bmSteps: "Within 6–8 weeks of enrollment confirmation (currently no CA follow-up before ER).",
  },
  {
    id: "pre-ihe-med-call", name: "Pre-IHE Med Specialist Call", phase: "ihe-cert-vcfpop",
    owner: "Depends on IHE timing", timeline: "~1 wk before IHE appt",
    clientExperience: "Client is contacted by a B&M medical specialist who confirms whether medicals on file are sufficient for certification and prepares the client for what to expect at the IHE. The specialist informs the client that they will fax relevant medical records to the assigned clinic.",
    bmSteps: "At least one week prior to the IHE appointment (contingent on B&M knowing the appt date).",
  },
  {
    id: "cert-status-vcfpop-analysis", name: "Cert Status / VCF POP Analysis", phase: "ihe-cert-vcfpop",
    owner: "CA II", timeline: "Biweekly until contact",
    clientExperience: "Client is introduced to CA II as their new point of contact. Client is reminded that the WTCHP cert timeline is usually 6–8 months, but told that B&M will collect VCF POP while awaiting cert. CA confirms possible avenues of VCF POP and requests necessary outstanding documents for EL/Sev.",
    bmSteps: "Within 2 weeks of ER Call, and every 2 weeks until contact.",
  },
  {
    id: "vcfpop-collection-update", name: "VCF POP Collection / Update", phase: "ihe-cert-vcfpop",
    owner: "CA II", timeline: "Updated every 8 wks",
    clientExperience: "Client is kept in the loop about VCF POP progress and proactively asked about cert status every 8 weeks. If any documents are still outstanding, the client is given advice on how to obtain them and/or asked if B&M can attempt to obtain them on their behalf.",
    bmSteps: "As needed for POP collection. Client updated every 8 weeks until cert confirmation.",
  },
  {
    id: "vcf-claim-ready-update", name: "VCF Claim Ready Update", phase: "ihe-cert-vcfpop",
    owner: "CA II", timeline: "Within 24 hrs of cert",
    clientExperience: "Client is told their VCF claim is ready for submission and is given an outline of the timeline for review and award (12–24 months). Client is told to disregard the autogenerated VCF letter and that they'll be updated every 90 days on claim status.",
    bmSteps: "Within 24 hours of Certification Confirmation.",
  },
  {
    id: "post-submission-status", name: "Post-Submission Status Update", phase: "award-review",
    owner: "CA II", timeline: "Every 90 days",
    clientExperience: "Client is given an update on any VCF claim status changes every 90 days until eligibility is determined. Client is contacted within 7 days of determination and given a timeline for award determination (2–12 months).",
    bmSteps: "Every 90 days until the VCF eligibility decision is reached.",
  },
  {
    id: "award-confirmation", name: "Award Confirmation", phase: "award-review",
    owner: "CA II", timeline: "Within 24 hrs of award",
    clientExperience: "Client continues to receive outreach every 90 days with status updates. Within 24 hours of award determination, the client is told the VCF has determined an award amount and that it will be reviewed by an attorney who will be in touch within 48 hours.",
    bmSteps: "Status updates every 90 days. Outreach within 24 hours of VCF award determination.",
  },
  {
    id: "award-review-call", name: "Award Review Call", phase: "award-review",
    owner: "CA II", timeline: "Within 48 hrs of award",
    clientExperience: "Client is contacted by an attorney who gives a detailed explanation of the award, collateral offsets, the award amount, and whether the attorney deems the award “fair”. Client is told they have 30 days from the award date to accept or appeal, and given a timeline for funds transfer if they accept.",
    bmSteps: "Within 48 hours of award determination.",
  },
  {
    id: "post-case-follow-up", name: "Post Case Follow-Up", phase: "award-review",
    owner: "CA II", timeline: "2 wks after award",
    clientExperience: "Client receives thank-you outreach and a post-experience survey. Client is reminded of our referral program and receives periodic marketing materials specific to the post-award community, reminding them of amendment rights and referral opportunities.",
    bmSteps: "Follow-up 2 weeks after award. Continue to engage through marketing and referral reminder auto-updates.",
  },
];

// ─── ClientJourneyMap ─────────────────────────────────────────────────────────
const SPLIT_AFTER_PHASE = "kit-enrollment";

export default function ClientJourneyMap() {
  const phaseById = useMemo(
    () => Object.fromEntries(PHASES.map((p) => [p.id, p])),
    []
  );

  const [openId, setOpenId] = useState(null);
  const chevRefs = useRef({});

  // group stages by phase, preserving order
  const groups = useMemo(() => {
    const out = [];
    PHASES.forEach((p) => {
      const items = STAGES.filter((s) => s.phase === p.id);
      if (items.length) out.push({ phase: p, items });
    });
    return out;
  }, []);

  // split the journey into two stacked lines
  // line 1 = Intake → Kit/Enrollment · line 2 = Attorney Review → Close (9 / 9)
  const lines = useMemo(() => {
    const cut = groups.findIndex((g) => g.phase.id === SPLIT_AFTER_PHASE) + 1 || 4;
    return [groups.slice(0, cut), groups.slice(cut)];
  }, [groups]);

  const toggle = useCallback(
    (id) => setOpenId((cur) => (cur === id ? null : id)),
    []
  );

  // keep the opened chevron comfortably in view (within its own row)
  useEffect(() => {
    if (!openId) return;
    const el = chevRefs.current[openId];
    if (!el) return;
    const rail = el.closest(".cjm__rail");
    if (!rail) return;
    const pad = 40;
    const left = el.offsetLeft - pad;
    const right = el.offsetLeft + el.offsetWidth + pad;
    if (left < rail.scrollLeft) rail.scrollTo({ left, behavior: "smooth" });
    else if (right > rail.scrollLeft + rail.clientWidth)
      rail.scrollTo({ left: right - rail.clientWidth, behavior: "smooth" });
  }, [openId]);

  // keyboard: Esc closes, arrows step
  const onKey = useCallback(
    (e) => {
      if (e.key === "Escape") setOpenId(null);
      if (!openId) return;
      const idx = STAGES.findIndex((s) => s.id === openId);
      if (e.key === "ArrowRight" && idx < STAGES.length - 1) {
        e.preventDefault();
        setOpenId(STAGES[idx + 1].id);
      }
      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        setOpenId(STAGES[idx - 1].id);
      }
    },
    [openId]
  );

  // suppress the unused phaseById lint warning — kept for future use
  void phaseById;

  const total = STAGES.length;

  return (
    <div className="cjm" onKeyDown={onKey}>
      <header className="cjm__head">
        <h1 className="cjm__title">
          <b>PI Client Journey Map</b> <span>Intake → Close</span>
        </h1>
      </header>

      <div className="cjm__rail">
        {lines.map((lineGroups, li) => (
          <div className="cjm__track" key={li}>
            {lineGroups.map((g) => (
              <section className="phase" key={g.phase.id}>
                <div
                  className="phase__band"
                  style={{ background: g.phase.color }}
                >
                  <span className="phase__name">{g.phase.name}</span>
                  <span className="phase__dur">{g.phase.duration}</span>
                </div>
                <div className="phase__chevs">
                  {g.items.map((s) => {
                    const globalIdx = STAGES.findIndex((x) => x.id === s.id);
                    const isFirst = g === lineGroups[0] && s === g.items[0];
                    const lastGroup = lineGroups[lineGroups.length - 1];
                    const isLast =
                      g === lastGroup && s === g.items[g.items.length - 1];
                    const open = openId === s.id;
                    const dim = openId && !open;
                    return (
                      <Chevron
                        key={s.id}
                        stage={s}
                        phase={g.phase}
                        num={globalIdx + 1}
                        total={total}
                        first={isFirst}
                        last={isLast}
                        open={open}
                        dim={dim}
                        onToggle={toggle}
                        refCb={(el) => (chevRefs.current[s.id] = el)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ))}
      </div>

      <div className="cjm__foot">
        <span className="cjm__hint">
          <span className="cjm__kbd">←</span>
          <span className="cjm__kbd">→</span> step through stages
        </span>
        <span className="cjm__hint">
          <span className="cjm__kbd">Esc</span> collapse
        </span>
      </div>
    </div>
  );
}

// ─── Chevron ──────────────────────────────────────────────────────────────────
function Chevron({ stage, phase, num, total, first, last, open, dim, onToggle, refCb }) {
  const cls =
    "chev" +
    (first ? " chev--first" : "") +
    (last ? " chev--last" : "") +
    (open ? " chev--open" : "") +
    (dim ? " chev--dim" : "");
  return (
    <div
      role="button"
      tabIndex={0}
      ref={refCb}
      className={cls}
      style={{ "--c": phase.color }}
      aria-expanded={open}
      aria-label={stage.name}
      onClick={() => onToggle(stage.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(stage.id);
        }
      }}
    >
      <span className="chev__face" />
      {!open && (
        <>
          <span className="chev__num">{String(num).padStart(2, "0")}</span>
          <span className="chev__label">{stage.name}</span>
        </>
      )}
      {open && (
        <div className="detail" onClick={(e) => e.stopPropagation()}>
          <div className="detail__top">
            <div>
              <div className="detail__num">
                STAGE {String(num).padStart(2, "0")} / {total} · {phase.name.toUpperCase()}
              </div>
              <h2 className="detail__name">{stage.name}</h2>
            </div>
            <button
              type="button"
              className="detail__close"
              aria-label="Collapse"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(stage.id);
              }}
            >
              ×
            </button>
          </div>
          <div className="detail__body">
            <div className="field--row">
              <div className="field">
                <div className="field__label">Owner</div>
                <span className="field__chip">{stage.owner}</span>
              </div>
              <div className="field">
                <div className="field__label">Timeline</div>
                <span className="field__chip">{stage.timeline}</span>
              </div>
            </div>
            <div className="field">
              <div className="field__label">Client Experience</div>
              <div className="field__value">{stage.clientExperience}</div>
            </div>
            <div className="field field--steps">
              <div className="field__label">B&amp;M Cadence</div>
              <div className="field__value">{stage.bmSteps}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
