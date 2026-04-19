import { useState, useEffect } from "react";

const STEPS = [
  {
    id: "objects",
    title: "Objects Are Themed Containers",
    subtitle: "Same structure, different purpose — each one holds a specific kind of data",
  },
  {
    id: "fields",
    title: "Fields Define What Goes In",
    subtitle: "Objects all hold data, but the data they hold is specific to the kind of container, or object type",
  },
  {
    id: "records",
    title: "Records Hold the Data",
    subtitle: "Each record is one entry — the reference point for that individual's field data",
  },
  {
    id: "parent-child",
    title: "Container Inside a Container",
    subtitle: "Some objects need others — remove the parent, and the child goes too",
  },
  {
    id: "lookup",
    title: "Lookup: A Field That Points Elsewhere",
    subtitle: "A lookup field on one object references a record in another object",
  },
  {
    id: "reporting",
    title: "Reporting: Which Object Has My Data?",
    subtitle: "Pick your path between the objects to find what you need",
  },
  {
    id: "picking-report",
    title: "Picking the Right Report Type",
    subtitle: "Your filter fields tell you which objects you need to reach into",
  },
];

/* ─── Themed container SVGs ─── */

function AccountContainer({ x, y, scale = 1, mini, children, dimmed, wide }) {
  const width = wide ? 400 : 140;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={dimmed ? 0.35 : 1}>
      <ellipse cx={width / 2} cy={148} rx={width * 0.42} ry={8} fill="#2a4a6a" opacity={0.14} />
      {/* Body — substantial, file-drawer feel */}
      <rect x={4} y={24} width={width - 8} height={120} rx={12} fill="#4A7FA8" stroke="#2a4a6a" strokeWidth={2.2} />
      <rect x={10} y={30} width={width - 20} height={108} rx={8} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
      {/* Nameplate strip */}
      <rect x={14} y={50} width={width - 28} height={14} rx={3} fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />
      {/* Rim — heavier, like a drawer front */}
      <rect x={0} y={14} width={width} height={18} rx={9} fill="#5B92BC" stroke="#2a4a6a" strokeWidth={2} />
      <rect x={4} y={17} width={width - 8} height={12} rx={6} fill="rgba(255,255,255,0.22)" />
      {/* Handle pull */}
      <rect x={width / 2 - 12} y={20} width={24} height={5} rx={2.5} fill="rgba(0,0,0,0.25)" />
      {/* Building/house icon */}
      {!wide && (
        <g>
          <path d={`M ${width / 2 - 18} 92 L ${width / 2} 78 L ${width / 2 + 18} 92 L ${width / 2 + 18} 112 L ${width / 2 - 18} 112 Z`}
            fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
          <rect x={width / 2 - 4} y={100} width={8} height={12} fill="rgba(255,255,255,0.45)" />
        </g>
      )}
      <text x={width / 2} y={8} textAnchor="middle" fill="#1e3a5c" fontSize={mini ? 11 : 13} fontWeight={700} fontFamily="'Georgia',serif">
        Account
      </text>
      {children}
    </g>
  );
}

function ContactContainer({ x, y, scale = 1, mini, children, dimmed }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={dimmed ? 0.35 : 1}>
      <ellipse cx={70} cy={148} rx={58} ry={8} fill="#9a4a5c" opacity={0.12} />
      {/* Body — rounded rolodex/address-book feel */}
      <rect x={4} y={24} width={132} height={120} rx={16} fill="#D88896" stroke="#9a4a5c" strokeWidth={2.2} />
      <rect x={10} y={30} width={120} height={108} rx={12} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      {/* Rim */}
      <rect x={0} y={14} width={140} height={18} rx={9} fill="#E09FAC" stroke="#9a4a5c" strokeWidth={2} />
      <rect x={4} y={17} width={132} height={12} rx={6} fill="rgba(255,255,255,0.25)" />
      {/* Person silhouette */}
      <circle cx={70} cy={68} r={12} fill="rgba(255,255,255,0.35)" />
      <circle cx={70} cy={63} r={5} fill="rgba(255,255,255,0.55)" />
      <ellipse cx={70} cy={76} rx={7.5} ry={5} fill="rgba(255,255,255,0.5)" />
      {/* Small contact lines below */}
      <rect x={36} y={96} width={68} height={3} rx={1.5} fill="rgba(255,255,255,0.35)" />
      <rect x={44} y={104} width={52} height={3} rx={1.5} fill="rgba(255,255,255,0.28)" />
      <text x={70} y={8} textAnchor="middle" fill="#7a3444" fontSize={mini ? 11 : 13} fontWeight={700} fontFamily="'Georgia',serif">
        Contact
      </text>
      {children}
    </g>
  );
}

function ClaimSubmissionContainer({ x, y, scale = 1, mini, children, dimmed }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={dimmed ? 0.35 : 1}>
      <ellipse cx={70} cy={148} rx={58} ry={8} fill="#4a6a3a" opacity={0.12} />
      {/* Body — official form feel */}
      <rect x={4} y={24} width={132} height={120} rx={8} fill="#7AAE5E" stroke="#4a6a3a" strokeWidth={2.2} />
      <rect x={10} y={30} width={120} height={108} rx={5} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
      {/* Folder-like tab */}
      <rect x={14} y={14} width={46} height={14} rx={4} ry={4} fill="#8CBF70" stroke="#4a6a3a" strokeWidth={1.8} />
      {/* Rim */}
      <rect x={0} y={22} width={140} height={14} rx={7} fill="#8CBF70" stroke="#4a6a3a" strokeWidth={2} />
      <rect x={4} y={25} width={132} height={8} rx={4} fill="rgba(255,255,255,0.22)" />
      {/* Form/document icon */}
      <rect x={34} y={54} width={72} height={58} rx={3} fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <rect x={40} y={62} width={60} height={2.5} rx={1} fill="rgba(255,255,255,0.5)" />
      <rect x={40} y={70} width={48} height={2.5} rx={1} fill="rgba(255,255,255,0.42)" />
      <rect x={40} y={78} width={56} height={2.5} rx={1} fill="rgba(255,255,255,0.42)" />
      <rect x={40} y={86} width={40} height={2.5} rx={1} fill="rgba(255,255,255,0.35)" />
      <rect x={40} y={94} width={52} height={2.5} rx={1} fill="rgba(255,255,255,0.35)" />
      {/* Stamp/seal mark */}
      <circle cx={94} cy={102} r={7} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.3} />
      <text x={94} y={105} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={6} fontFamily="'Courier New',monospace">VCF</text>
      <text x={70} y={8} textAnchor="middle" fill="#3a5a2a" fontSize={mini ? 10 : 12} fontWeight={700} fontFamily="'Georgia',serif">
        Claim Submission
      </text>
      {children}
    </g>
  );
}

function CallContainer({ x, y, scale = 1, mini, children, dimmed }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={dimmed ? 0.35 : 1}>
      <ellipse cx={70} cy={148} rx={58} ry={8} fill="#6a4a2a" opacity={0.12} />
      <rect x={4} y={24} width={132} height={120} rx={12} fill="#E8A948" stroke="#a07030" strokeWidth={2.2} />
      <rect x={10} y={30} width={120} height={108} rx={8} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
      <rect x={0} y={14} width={140} height={18} rx={9} fill="#F0BE68" stroke="#a07030" strokeWidth={2} />
      <rect x={4} y={17} width={132} height={12} rx={6} fill="rgba(255,255,255,0.22)" />
      {/* Phone icon */}
      <path d="M 50 70 Q 50 60 60 60 L 66 60 Q 70 60 71 64 L 73 72 Q 74 76 70 78 L 66 80 Q 72 92 84 98 L 86 94 Q 88 90 92 91 L 100 93 Q 104 94 104 98 L 104 104 Q 104 114 94 114 Q 64 114 50 84 Q 50 80 50 70 Z"
        fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.55)" strokeWidth={1.2} strokeLinejoin="round" />
      <text x={70} y={8} textAnchor="middle" fill="#7a5a20" fontSize={mini ? 11 : 13} fontWeight={700} fontFamily="'Georgia',serif">
        Call
      </text>
      {children}
    </g>
  );
}

function CaseContainer({ x, y, scale = 1, mini, children, dimmed }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={dimmed ? 0.35 : 1}>
      <ellipse cx={70} cy={148} rx={58} ry={8} fill="#2a5a52" opacity={0.12} />
      {/* Body */}
      <rect x={4} y={24} width={132} height={120} rx={10} fill="#7DAFA5" stroke="#3a6a60" strokeWidth={2.2} />
      <rect x={10} y={30} width={120} height={108} rx={7} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
      {/* Rim */}
      <rect x={0} y={14} width={140} height={18} rx={9} fill="#94C0B5" stroke="#3a6a60" strokeWidth={2} />
      <rect x={4} y={17} width={132} height={12} rx={6} fill="rgba(255,255,255,0.22)" />
      {/* Medical cross icon (WTCHP) */}
      <rect x={58} y={52} width={24} height={56} rx={3} fill="rgba(255,255,255,0.55)" />
      <rect x={44} y={66} width={52} height={28} rx={3} fill="rgba(255,255,255,0.55)" />
      <text x={70} y={8} textAnchor="middle" fill="#2a5a52" fontSize={mini ? 11 : 13} fontWeight={700} fontFamily="'Georgia',serif">
        Case
      </text>
      {children}
    </g>
  );
}

function SupportingDocContainer({ x, y, scale = 1, mini, children, dimmed }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={dimmed ? 0.35 : 1}>
      <ellipse cx={70} cy={148} rx={58} ry={8} fill="#5a4a6a" opacity={0.12} />
      {/* Body — paperclip/attachment feel */}
      <rect x={4} y={24} width={132} height={120} rx={10} fill="#8E7EB8" stroke="#5a4a6a" strokeWidth={2.2} />
      <rect x={10} y={30} width={120} height={108} rx={7} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
      {/* Rim */}
      <rect x={0} y={14} width={140} height={18} rx={9} fill="#A294C8" stroke="#5a4a6a" strokeWidth={2} />
      <rect x={4} y={17} width={132} height={12} rx={6} fill="rgba(255,255,255,0.22)" />
      {/* Document + paperclip icon */}
      <rect x={40} y={54} width={48} height={58} rx={3} fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
      <rect x={46} y={62} width={36} height={2.5} rx={1} fill="rgba(255,255,255,0.55)" />
      <rect x={46} y={70} width={28} height={2.5} rx={1} fill="rgba(255,255,255,0.45)" />
      <rect x={46} y={78} width={32} height={2.5} rx={1} fill="rgba(255,255,255,0.45)" />
      {/* Paperclip */}
      <path d="M 96 48 L 96 92 Q 96 104 86 104 Q 76 104 76 92 L 76 58 Q 76 52 82 52 Q 88 52 88 58 L 88 88"
        fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeLinecap="round" />
      <text x={70} y={8} textAnchor="middle" fill="#3a2a4a" fontSize={mini ? 9 : 11} fontWeight={700} fontFamily="'Georgia',serif">
        Supporting Doc
      </text>
      {children}
    </g>
  );
}

function FieldTag({ x, y, text, color = "#fffbe6", border = "#c9a84c", textColor = "#6b5c2e" }) {
  const w = text.length * 7 + 20;
  return (
    <g>
      <rect x={x} y={y} width={w} height={22} rx={11} fill={color} stroke={border} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + 15} textAnchor="middle" fill={textColor} fontSize={10.5} fontFamily="'Courier New',monospace" fontWeight={600}>
        {text}
      </text>
    </g>
  );
}

function RecordCard({ x, y, fields, values, accent = "#4A7FA8" }) {
  const w = 132;
  const h = fields.length * 19 + 16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#fffef7" stroke={accent} strokeWidth={1.3} />
      <rect x={x} y={y} width={w} height={14} rx={6} fill={accent} opacity={0.18} />
      {fields.map((f, i) => (
        <text key={i} x={x + 8} y={y + 26 + i * 19} fill="#4a4030" fontSize={10} fontFamily="'Courier New',monospace">
          <tspan fontWeight={700}>{f}:</tspan>{" "}
          <tspan fill="#8b6914">{values[i]}</tspan>
        </text>
      ))}
    </g>
  );
}

function Handle({ x, y, width = 28 }) {
  return <rect x={x} y={y} width={width} height={14} rx={5} fill="none" stroke="#8b6c42" strokeWidth={2.5} strokeLinecap="round" />;
}

function StringConn({ x1, y1, x2, y2 }) {
  const midX = (x1 + x2) / 2;
  const sag = Math.max(y1, y2) + 35;
  return (
    <path d={`M ${x1} ${y1} Q ${midX} ${sag} ${x2} ${y2}`}
      fill="none" stroke="#a08050" strokeWidth={2.5} strokeDasharray="7,5" strokeLinecap="round" />
  );
}

function MagnifyingGlass({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <circle cx={0} cy={0} r={18} fill="rgba(74,127,168,0.12)" stroke="#2a4a6a" strokeWidth={2.8} />
      <line x1={13} y1={13} x2={26} y2={26} stroke="#2a4a6a" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M -7,-7 Q 0,-13 7,-7" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.8} />
    </g>
  );
}

function Caption({ x, y, lines }) {
  return lines.map((line, i) => (
    <text key={i} x={x} y={y + i * 20} textAnchor="middle" fill="#5c4e28" fontSize={13}
      fontFamily="'Georgia',serif" fontStyle="italic">
      {line}
    </text>
  ));
}

/* ─── Scenes ─── */

function SceneObjects() {
  return (
    <svg viewBox="0 0 700 320" style={{ width: "100%", height: "auto" }}>
      <AccountContainer x={30} y={50} />
      <ContactContainer x={200} y={50} />
      <ClaimSubmissionContainer x={370} y={50} />
      <CallContainer x={540} y={50} />
      <Caption x={350} y={270} lines={[
        "Every container, or Object, is similar — they all hold information,",
        "but each one has its own identity and purpose in our system."
      ]} />
    </svg>
  );
}

function SceneFields() {
  return (
    <svg viewBox="0 0 700 400" style={{ width: "100%", height: "auto" }}>
      <AccountContainer x={40} y={50}>
        <FieldTag x={22} y={88} text="Account Name" />
        <FieldTag x={22} y={114} text="Account Type" />
      </AccountContainer>
      <ContactContainer x={220} y={50}>
        <FieldTag x={22} y={88} text="First Name" />
        <FieldTag x={22} y={114} text="Email" />
      </ContactContainer>
      <ClaimSubmissionContainer x={400} y={50}>
        <FieldTag x={22} y={88} text="Claim #" />
        <FieldTag x={22} y={114} text="Status" />
      </ClaimSubmissionContainer>
      <CallContainer x={540} y={50} dimmed />
      <Caption x={350} y={270} lines={[
        "Each object has its own set of fields — its own vocabulary for the data it accepts.",
        "An Account's fields describe the client. A Call's fields describe the conversation.",
        "",
        "Some objects will show data from the same fields. That means these objects are",
        "connected, but objects can be connected in different ways, which we'll discuss a little later."
      ]} />
    </svg>
  );
}

function SceneRecords() {
  return (
    <svg viewBox="0 0 700 340" style={{ width: "100%", height: "auto" }}>
      <ContactContainer x={30} y={40}>
        <RecordCard x={18} y={90} fields={["Name", "Phone"]} values={["Jane Doe", "555-0101"]} accent="#D88896" />
      </ContactContainer>
      <ContactContainer x={210} y={40}>
        <RecordCard x={18} y={90} fields={["Name", "Phone"]} values={["John Smith", "555-0202"]} accent="#D88896" />
      </ContactContainer>
      <text x={280} y={36} textAnchor="middle" fill="#7a3444" fontSize={11} fontWeight={600} fontFamily="'Georgia',serif">
        (same object type, different people)
      </text>
      <ClaimSubmissionContainer x={420} y={40}>
        <RecordCard x={18} y={90} fields={["Claim #", "Status"]} values={["CLAIM-4401", "Active"]} accent="#7AAE5E" />
      </ClaimSubmissionContainer>
      <Caption x={350} y={275} lines={[
        "An Object defines the category of container. Fields define what can go inside.",
        "Each Record is one entry — it contains the actual field data values for that",
        "individual. Jane Doe is one Contact record, John Smith is another."
      ]} />
    </svg>
  );
}

function SceneParentChild() {
  return (
    <svg viewBox="0 0 700 530" style={{ width: "100%", height: "auto" }}>
      {/* Parent label */}
      <text x={350} y={36} textAnchor="middle" fill="#1e3a5c" fontSize={15} fontWeight={700} fontFamily="'Georgia',serif">
        Account (Parent)
      </text>
      {/* Parent Account — large enough to fully contain children */}
      <ellipse cx={350} cy={372} rx={230} ry={10} fill="#2a4a6a" opacity={0.14} />
      {/* Body */}
      <rect x={120} y={64} width={460} height={300} rx={14} fill="#4A7FA8" stroke="#2a4a6a" strokeWidth={2.5} />
      <rect x={128} y={72} width={444} height={284} rx={10} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
      {/* Rim */}
      <rect x={114} y={50} width={472} height={22} rx={11} fill="#5B92BC" stroke="#2a4a6a" strokeWidth={2.2} />
      <rect x={120} y={54} width={460} height={14} rx={7} fill="rgba(255,255,255,0.22)" />
      {/* Handle pull on rim */}
      <rect x={338} y={56} width={24} height={5} rx={2.5} fill="rgba(0,0,0,0.25)" />
      {/* Nameplate inside parent */}
      <rect x={260} y={88} width={180} height={20} rx={4} fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth={0.8} />
      <text x={350} y={102} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize={11} fontFamily="'Courier New',monospace" fontWeight={600}>
        John Doe
      </text>

      {/* Children: one Claim Submission, one Case */}
      <ClaimSubmissionContainer x={170} y={180} scale={0.8} mini>
        <text x={70} y={128} textAnchor="middle" fill="#3a5a2e" fontSize={10} fontFamily="'Georgia',serif">#CLAIM-4401</text>
      </ClaimSubmissionContainer>
      <SupportingDocContainer x={395} y={180} scale={0.8} mini>
        <text x={70} y={128} textAnchor="middle" fill="#3a2a4a" fontSize={10} fontFamily="'Georgia',serif">Medical Record</text>
      </SupportingDocContainer>

      <Caption x={350} y={395} lines={[
        "Some objects need others. Think of it as one container inside another:",
        "remove the big container, and the one inside goes too.",
        "",
        "The Claim and Supporting Document objects live inside an Account.",
        "Remove the Account, its children go too.",
        "Salesforce calls this a \"Master-Detail\" relationship."
      ]} />
    </svg>
  );
}

function SceneReparent() {
  return (
    <svg viewBox="0 0 700 400" style={{ width: "100%", height: "auto" }}>
      <defs>
        <marker id="arrowhead" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill="#8b6c42" />
        </marker>
      </defs>
      {/* Old Account - faded */}
      <g opacity={0.32}>
        <rect x={40} y={60} width={200} height={160} rx={12} fill="#4A7FA8" stroke="#2a4a6a" strokeWidth={2} />
        <rect x={34} y={48} width={212} height={18} rx={9} fill="#5B92BC" stroke="#2a4a6a" strokeWidth={2} />
        <text x={140} y={42} textAnchor="middle" fill="#1e3a5c" fontSize={12} fontWeight={700} fontFamily="'Georgia',serif">
          Old Account
        </text>
        <rect x={72} y={100} width={115} height={100} rx={8} fill="none" stroke="#2a4a6a" strokeWidth={1.5} strokeDasharray="6,4" opacity={0.55} />
        <text x={129} y={155} textAnchor="middle" fill="#2a4a6a" fontSize={10} fontFamily="'Georgia',serif" fontStyle="italic">
          (was here)
        </text>
      </g>

      {/* Arc arrow showing movement */}
      <path d="M 260 160 C 320 100 380 100 440 140" fill="none" stroke="#8b6c42" strokeWidth={2.2} strokeDasharray="6,4" markerEnd="url(#arrowhead)" />
      <text x={350} y={100} textAnchor="middle" fill="#8b6c42" fontSize={12} fontWeight={600} fontFamily="'Georgia',serif">
        transferred to a new parent
      </text>

      {/* New Account */}
      <rect x={420} y={60} width={240} height={200} rx={12} fill="#4A7FA8" stroke="#2a4a6a" strokeWidth={2.5} />
      <rect x={414} y={48} width={252} height={18} rx={9} fill="#5B92BC" stroke="#2a4a6a" strokeWidth={2.2} />
      <rect x={528} y={54} width={24} height={5} rx={2.5} fill="rgba(0,0,0,0.25)" />
      <text x={540} y={42} textAnchor="middle" fill="#1e3a5c" fontSize={13} fontWeight={700} fontFamily="'Georgia',serif">
        New Account
      </text>

      {/* The relocated Claim Submission */}
      <ClaimSubmissionContainer x={460} y={110} scale={0.8} mini>
        <text x={70} y={128} textAnchor="middle" fill="#3a5a2e" fontSize={10} fontFamily="'Georgia',serif">#CLAIM-4401</text>
      </ClaimSubmissionContainer>

      <Caption x={350} y={330} lines={[
        "If needed, a child record can be transferred to a different parent.",
        "It always needs a parent — but it can change which one."
      ]} />
    </svg>
  );
}

function SceneLookup() {
  return (
    <svg viewBox="0 0 700 400" style={{ width: "100%", height: "auto" }}>
      <defs>
        <marker id="lookup-arrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill="#b87a2a" />
        </marker>
      </defs>

      {/* Account on left showing its fields */}
      <AccountContainer x={40} y={60}>
        <FieldTag x={22} y={88} text="Name" />
        {/* Highlighted lookup field */}
        <g>
          <rect x={22} y={114} width={108} height={22} rx={11} fill="#ffefd6" stroke="#b87a2a" strokeWidth={1.8} />
          <text x={76} y={129} textAnchor="middle" fill="#8a5a1a" fontSize={10.5} fontFamily="'Courier New',monospace" fontWeight={700}>
            Primary Contact
          </text>
        </g>
      </AccountContainer>

      {/* Contact on right showing its record */}
      <ContactContainer x={480} y={60}>
        <RecordCard x={18} y={88} fields={["Name", "Role"]} values={["John Doe", "Claimant"]} accent="#D88896" />
      </ContactContainer>

      {/* Arrow from the lookup field to the Contact */}
      <line x1={180} y1={136} x2={478} y2={136} stroke="#b87a2a" strokeWidth={2.2} markerEnd="url(#lookup-arrow)" />

      {/* Label on the connection */}
      <rect x={252} y={108} width={148} height={22} rx={4} fill="#fffef7" stroke="#b87a2a" strokeWidth={1} opacity={0.9} />
      <text x={326} y={123} textAnchor="middle" fill="#8a5a1a" fontSize={10} fontFamily="'Courier New',monospace" fontStyle="italic">
        this field points to →
      </text>

      <Caption x={350} y={290} lines={[
        "A lookup is a field on one object that points to a record in another object.",
        "The Account's \"Primary Contact\" field links to John Doe's Contact record.",
        "Both objects exist independently — the field is just a reference, not ownership.",
        "Salesforce calls this a \"Lookup\" relationship."
      ]} />
    </svg>
  );
}

function SceneReporting() {
  return (
    <svg viewBox="0 0 700 360" style={{ width: "100%", height: "auto" }}>
      {/* Account (wide, parent) */}
      <g transform="translate(60, 40) scale(0.8)">
        <rect x={0} y={24} width={280} height={110} rx={10} fill="#4A7FA8" stroke="#2a4a6a" strokeWidth={2} />
        <rect x={0} y={14} width={280} height={16} rx={8} fill="#5B92BC" stroke="#2a4a6a" strokeWidth={2} />
        <rect x={128} y={18} width={24} height={5} rx={2.5} fill="rgba(0,0,0,0.25)" />
        <text x={140} y={8} textAnchor="middle" fill="#1e3a5c" fontSize={13} fontWeight={700} fontFamily="'Georgia',serif">
          Account (Parent)
        </text>
        {/* One Claim Submission inside */}
        <g transform="translate(90, 40)">
          <rect x={0} y={0} width={100} height={80} rx={6} fill="#7AAE5E" stroke="#4a6a3a" strokeWidth={1.5} />
          <rect x={0} y={0} width={100} height={10} rx={5} fill="#8CBF70" />
          <text x={50} y={45} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize={10} fontWeight={600} fontFamily="'Courier New',monospace">#CLAIM-4401</text>
        </g>
      </g>

      {/* Path highlight */}
      <rect x={80} y={200} width={380} height={38} rx={19} fill="#4A7FA8" opacity={0.12} stroke="#2a4a6a" strokeWidth={1.5} strokeDasharray="4,3" />
      <text x={270} y={224} textAnchor="middle" fill="#1e3a5c" fontSize={12.5} fontWeight={600} fontFamily="'Courier New',monospace">
        Report Type: Accounts with Claim Submissions
      </text>

      {/* Question being asked */}
      <rect x={290} y={148} width={260} height={48} rx={12} fill="#fffef7" stroke="#c9a84c" strokeWidth={1.3} />
      <text x={420} y={167} textAnchor="middle" fill="#5c4e28" fontSize={10.5} fontWeight={600} fontFamily="'Georgia',serif" fontStyle="italic">
        "What are all my accounts with
      </text>
      <text x={420} y={183} textAnchor="middle" fill="#5c4e28" fontSize={10.5} fontWeight={600} fontFamily="'Georgia',serif" fontStyle="italic">
        claims submitted in March?"
      </text>

      {/* Magnifying glass */}
      <MagnifyingGlass x={540} y={218} scale={1.6} />

      <Caption x={350} y={290} lines={[
        "Salesforce looks for data in a particular object.",
        "If you need data from multiple objects, you need a report type that",
        "looks in all the objects where the data you need lives."
      ]} />
    </svg>
  );
}

function ScenePickingReport() {
  // Shared mini container helpers scoped to this scene
  const MiniAccount = ({ x, y, highlight, label = "Account" }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={0} y={8} width={110} height={62} rx={8}
        fill="#4A7FA8" stroke={highlight ? "#e8a948" : "#2a4a6a"} strokeWidth={highlight ? 3 : 1.5} />
      <rect x={0} y={0} width={110} height={14} rx={7}
        fill="#5B92BC" stroke={highlight ? "#e8a948" : "#2a4a6a"} strokeWidth={highlight ? 3 : 1.5} />
      <rect x={49} y={4} width={12} height={4} rx={2} fill="rgba(0,0,0,0.25)" />
      <text x={55} y={46} textAnchor="middle" fill="rgba(255,255,255,0.95)"
        fontSize={11} fontWeight={700} fontFamily="'Georgia',serif">{label}</text>
    </g>
  );

  const MiniLead = ({ x, y, highlight, label = "Lead" }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={0} y={8} width={110} height={62} rx={8}
        fill="#C97B3A" stroke={highlight ? "#e8a948" : "#7a4a1a"} strokeWidth={highlight ? 3 : 1.5} />
      <rect x={0} y={0} width={110} height={14} rx={7}
        fill="#D99450" stroke={highlight ? "#e8a948" : "#7a4a1a"} strokeWidth={highlight ? 3 : 1.5} />
      <text x={55} y={46} textAnchor="middle" fill="rgba(255,255,255,0.95)"
        fontSize={11} fontWeight={700} fontFamily="'Georgia',serif">{label}</text>
    </g>
  );

  const MiniClaim = ({ x, y, highlight, label = "Claim Submission" }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={0} y={0} width={110} height={62} rx={6}
        fill="#7AAE5E" stroke={highlight ? "#e8a948" : "#4a6a3a"} strokeWidth={highlight ? 3 : 1.5} />
      <rect x={0} y={0} width={110} height={12} rx={6}
        fill="#8CBF70" stroke={highlight ? "#e8a948" : "#4a6a3a"} strokeWidth={highlight ? 3 : 1.5} />
      <text x={55} y={42} textAnchor="middle" fill="rgba(255,255,255,0.95)"
        fontSize={10} fontWeight={700} fontFamily="'Georgia',serif">{label}</text>
    </g>
  );

  const FilterBox = ({ x, y, lines, source }) => (
    <g>
      <rect x={x} y={y} width={230} height={80} rx={8} fill="#fffef7" stroke="#c9a84c" strokeWidth={1.3} />
      <text x={x + 12} y={y + 20} fill="#8b6914" fontSize={9.5} fontWeight={700} fontFamily="'Courier New',monospace" letterSpacing={1}>
        FILTER
      </text>
      {lines.map((line, i) => (
        <text key={i} x={x + 12} y={y + 38 + i * 14} fill="#4a4030" fontSize={11} fontFamily="'Georgia',serif">
          {line}
        </text>
      ))}
      <text x={x + 12} y={y + 72} fill="#8b6914" fontSize={9} fontFamily="'Courier New',monospace" fontStyle="italic">
        {source}
      </text>
    </g>
  );

  const ReportBox = ({ x, y, title, titleLines, highlight }) => {
    const lines = titleLines || [title];
    return (
      <g>
        <rect x={x} y={y} width={200} height={80} rx={8}
          fill={highlight ? "#fdf2d8" : "#eef5f0"}
          stroke={highlight ? "#c9a84c" : "#4a6a3a"}
          strokeWidth={highlight ? 2 : 1.3} />
        <text x={x + 12} y={y + 20} fill="#5c4e28" fontSize={9.5} fontWeight={700} fontFamily="'Courier New',monospace" letterSpacing={1}>
          REPORT TYPE
        </text>
        {lines.map((line, i) => (
          <text key={i} x={x + 12} y={y + 42 + i * 16} fill="#3a3226"
            fontSize={lines.length > 1 ? 10.5 : 11} fontWeight={700} fontFamily="'Georgia',serif">
            {line}
          </text>
        ))}
      </g>
    );
  };

  const Arrow = ({ x, y }) => (
    <text x={x} y={y} fontSize={22} fill="#8b6c42" fontFamily="'Georgia',serif">→</text>
  );

  return (
    <svg viewBox="0 0 700 560" style={{ width: "100%", height: "auto" }}>
      {/* ── Scenario 1: Data only from Lead ── */}
      <g transform="translate(0, 10)">
        <FilterBox x={15} y={0} source="(lives on Lead)"
          lines={["Employer = FDNY"]} />
        <Arrow x={253} y={48} />
        <g transform="translate(285, 10)">
          <MiniLead x={0} y={0} highlight />
        </g>
        <Arrow x={418} y={48} />
        <ReportBox x={450} y={0} title="Leads" />
      </g>

      {/* ── Scenario 2: Data only from Account ── */}
      <g transform="translate(0, 110)">
        <FilterBox x={15} y={0} source="(lives on Account)"
          lines={["Status = Claim Submission"]} />
        <Arrow x={253} y={48} />
        <g transform="translate(285, 6)">
          <MiniAccount x={0} y={0} highlight />
        </g>
        <Arrow x={418} y={48} />
        <ReportBox x={450} y={0} title="Accounts" />
      </g>

      {/* ── Scenario 3: Data from BOTH objects ── */}
      <g transform="translate(0, 220)">
        {/* Filter box is taller for three lines */}
        <rect x={15} y={0} width={230} height={120} rx={8} fill="#fffef7" stroke="#c9a84c" strokeWidth={1.3} />
        <text x={27} y={20} fill="#8b6914" fontSize={9.5} fontWeight={700} fontFamily="'Courier New',monospace" letterSpacing={1}>
          FILTER
        </text>
        <text x={27} y={38} fill="#4a4030" fontSize={11} fontFamily="'Georgia',serif">Status = Claim Submission</text>
        <text x={27} y={50} fill="#8b6914" fontSize={9} fontFamily="'Courier New',monospace" fontStyle="italic">(on Account)</text>
        <text x={27} y={68} fill="#4a4030" fontSize={11} fontFamily="'Georgia',serif">Sub-status = Submitted</text>
        <text x={27} y={80} fill="#8b6914" fontSize={9} fontFamily="'Courier New',monospace" fontStyle="italic">(on Account)</text>
        <text x={27} y={98} fill="#4a4030" fontSize={11} fontFamily="'Georgia',serif">Submitted Date &lt; Jan 1</text>
        <text x={27} y={110} fill="#8b6914" fontSize={9} fontFamily="'Courier New',monospace" fontStyle="italic">(on Claim Submission)</text>

        <Arrow x={253} y={68} />

        {/* Account (parent) with Claim Submission (child) nested */}
        <g transform="translate(275, 10)">
          <rect x={0} y={16} width={140} height={100} rx={10} fill="#4A7FA8" stroke="#e8a948" strokeWidth={3} />
          <rect x={0} y={6} width={140} height={16} rx={8} fill="#5B92BC" stroke="#e8a948" strokeWidth={3} />
          <rect x={64} y={10} width={12} height={4} rx={2} fill="rgba(0,0,0,0.25)" />
          <text x={70} y={2} textAnchor="middle" fill="#1e3a5c" fontSize={11} fontWeight={700} fontFamily="'Georgia',serif">
            Account
          </text>
          {/* nested Claim Submission */}
          <g transform="translate(18, 40)">
            <rect x={0} y={0} width={104} height={62} rx={6} fill="#7AAE5E" stroke="#e8a948" strokeWidth={3} />
            <rect x={0} y={0} width={104} height={12} rx={6} fill="#8CBF70" stroke="#e8a948" strokeWidth={3} />
            <text x={52} y={42} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize={10} fontWeight={700} fontFamily="'Georgia',serif">
              Claim Submission
            </text>
          </g>
        </g>

        <Arrow x={432} y={68} />
        <ReportBox x={460} y={20} titleLines={["Accounts with", "CMS Claim Submissions"]} highlight />
      </g>

      {/* Divider + caption */}
      <line x1={60} y1={370} x2={640} y2={370} stroke="#c9a84c" strokeWidth={1} strokeDasharray="3,4" opacity={0.6} />
      <Caption x={350} y={395} lines={[
        "The rule: your filter fields decide the report type.",
        "All filters on one object → use that object's report.",
        "Filters span multiple objects → use a combined",
        "\"[Object A] with [Object B]\" or \"[Object A] with [Object B], [Object C] and...\" report.",
      ]} />
    </svg>
  );
}

const SCENES = {
  objects: SceneObjects,
  fields: SceneFields,
  records: SceneRecords,
  "parent-child": SceneParentChild,
  lookup: SceneLookup,
  reporting: SceneReporting,
  "picking-report": ScenePickingReport,
};

export default function ThemedContainers({ onComplete, onNext, nextLabel } = {}) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Scene = SCENES[current.id];

  // Fire onComplete the first time the learner reaches the final step.
  // The LMS wrapper uses this to mark the "Data Model" sidebar section
  // done and unlock the first reporting exercise.
  const onLastStep = step === STEPS.length - 1;
  useEffect(() => { if (onLastStep && onComplete) onComplete(); }, [onLastStep, onComplete]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(155deg, #faf5ea 0%, #f2ead6 35%, #e8dfc8 100%)",
      fontFamily: "'Georgia','Times New Roman',serif",
      color: "#3a3226",
      padding: "20px 14px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{
          display: "inline-block", background: "#3a3226", color: "#faf5ea",
          padding: "4px 18px", borderRadius: 20, fontSize: 10.5,
          letterSpacing: 2.5, textTransform: "uppercase",
          fontFamily: "'Courier New',monospace", marginBottom: 6,
        }}>
          Salesforce Data Model
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 400, margin: "6px 0 0", letterSpacing: -0.5 }}>
          Objects: Containers for Data
        </h1>
        <p style={{ fontSize: 12.5, opacity: 0.45, margin: "2px 0 0", fontStyle: "italic" }}>
          Understanding your data
        </p>
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, margin: "14px 0" }}>
        {STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setStep(i)}
            style={{
              width: i === step ? 26 : 9, height: 9, borderRadius: 5,
              border: "1.5px solid #3a3226",
              background: i === step ? "#3a3226" : "transparent",
              cursor: "pointer", transition: "all 0.3s ease", padding: 0,
            }}
            aria-label={s.title}
          />
        ))}
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 3px" }}>{current.title}</h2>
        <p style={{ fontSize: 13, fontStyle: "italic", opacity: 0.65, margin: 0 }}>{current.subtitle}</p>
      </div>

      {/* Scene */}
      <div style={{
        background: "rgba(255,255,255,0.5)", borderRadius: 16,
        border: "1px solid rgba(58,50,38,0.08)", padding: "12px 6px",
        maxWidth: 740, margin: "0 auto 16px",
        boxShadow: "0 4px 28px rgba(58,50,38,0.05)",
      }}>
        <Scene />
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, maxWidth: 380, margin: "0 auto" }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          style={{
            flex: 1, padding: "11px 18px",
            background: step === 0 ? "rgba(58,50,38,0.07)" : "#3a3226",
            color: step === 0 ? "rgba(58,50,38,0.25)" : "#faf5ea",
            border: "none", borderRadius: 10, fontSize: 13.5,
            fontFamily: "'Georgia',serif", cursor: step === 0 ? "default" : "pointer",
            fontWeight: 600, transition: "all 0.2s ease",
          }}>
          ← Back
        </button>
        {/* On the final step, if the LMS wrapper passed an onNext
            handler, replace the disabled "Next →" with a live button
            that advances to the next module section (e.g. Exercise 1).
            Otherwise fall back to the original disabled-at-end UX. */}
        {onLastStep && onNext ? (
          <button onClick={onNext}
            style={{
              flex: 1, padding: "11px 18px",
              background: "#0176d3", color: "white",
              border: "none", borderRadius: 10, fontSize: 13.5,
              fontFamily: "'Georgia',serif", cursor: "pointer",
              fontWeight: 700, transition: "all 0.2s ease",
            }}>
            {nextLabel || "Continue →"}
          </button>
        ) : (
          <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1}
            style={{
              flex: 1, padding: "11px 18px",
              background: step === STEPS.length - 1 ? "rgba(58,50,38,0.07)" : "#3a3226",
              color: step === STEPS.length - 1 ? "rgba(58,50,38,0.25)" : "#faf5ea",
              border: "none", borderRadius: 10, fontSize: 13.5,
              fontFamily: "'Georgia',serif",
              cursor: step === STEPS.length - 1 ? "default" : "pointer",
              fontWeight: 600, transition: "all 0.2s ease",
            }}>
            Next →
          </button>
        )}
      </div>
      <p style={{ textAlign: "center", fontSize: 11.5, opacity: 0.35, marginTop: 10, fontFamily: "'Courier New',monospace" }}>
        {step + 1} of {STEPS.length}
      </p>
    </div>
  );
}
