import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";

const MODULES = [
  {
    key: "module-2",
    number: "Module 2",
    title: "Foundational Concepts",
    desc: "The two federal programs, qualified illnesses, timing rules, and proof of presence.",
    time: "~45 min",
    status: "available",
  },
  {
    key: "module-3",
    number: "Module 3",
    title: "From Sign-Up to Submitted",
    desc: "The intake process, authorization documents, document integrity, and WTCHP enrollment.",
    time: "~40 min",
    status: "available",
  },
  {
    key: "module-4",
    number: "Module 4",
    title: "Proof of Presence Deep Dive",
    desc: "POP hierarchy, EVLs, TPVs, and special cases.",
    time: "Coming soon",
    status: "coming-soon",
  },
  {
    key: "module-5",
    number: "Module 5",
    title: "Eligibility & Compensation",
    desc: "Registration deadlines, NEL vs EL, VCF1 amendments, and the PPP.",
    time: "Coming soon",
    status: "coming-soon",
  },
  {
    key: "module-6",
    number: "Module 6",
    title: "Complex Cases",
    desc: "Deceased claims, Personal Representatives, and economic loss.",
    time: "Coming soon",
    status: "coming-soon",
  },
];

export default function HomePage({ learner, onStartModule }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-hdr shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <div className="max-w-[960px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-white rounded px-2 py-1 inline-flex items-center">
              <img src={bmLogo} alt="B&M" className="h-8"/>
            </div>
            <div className="w-px h-5 bg-white/15"/>
            <span className="text-sm font-bold text-white font-heading">Training Modules</span>
          </div>
          {learner && (
            <span className="text-xs text-white/40">Welcome, {learner.name}</span>
          )}
        </div>
      </div>

      {/* Module grid */}
      <div className="max-w-[960px] mx-auto px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m) => {
            const available = m.status === "available";
            return (
              <div
                key={m.key}
                className={`rounded-lg border overflow-hidden flex flex-col ${
                  available
                    ? "bg-brand-ww border-brand-sand"
                    : "bg-white/60 border-brand-sand/50 opacity-60"
                }`}
              >
                <div className="px-5 pt-5 pb-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-widest text-brand-blue">{m.number.toUpperCase()}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        available
                          ? "bg-brand-ok-bg text-brand-ok border border-[#b8d5c4]"
                          : "bg-gray-100 text-brand-tl border border-gray-200"
                      }`}
                    >
                      {available ? "Available" : "Coming Soon"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-heading text-brand-gray-dk mb-1.5">{m.title}</h3>
                  <p className="text-xs text-brand-tm leading-relaxed mb-3">{m.desc}</p>
                  <span className="text-[11px] text-brand-tl">{m.time}</span>
                </div>
                <div className="px-5 pb-5">
                  {available ? (
                    <button
                      onClick={() => onStartModule(m.key)}
                      className="w-full py-2.5 rounded-md text-sm font-bold text-white bg-brand-blue border-none cursor-pointer"
                    >
                      Begin Module →
                    </button>
                  ) : (
                    <div className="w-full py-2.5 rounded-md text-sm font-semibold text-center text-brand-tl bg-gray-100 border border-gray-200">
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
