import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";

export default function JeopardyGame({ learner, onBack }) {
  return (
    <div className="flex flex-col" style={{ height: "100vh", background: "#0a1a4a" }}>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-2 shrink-0"
        style={{ background: "#0d1f5c", borderBottom: "1px solid rgba(240,192,64,0.2)", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-white rounded px-2 py-1 inline-flex items-center border-none cursor-pointer"
          >
            <img src={bmLogo} alt="B&M" className="h-8" />
          </button>
          <div className="w-px h-5 bg-white/15" />
          <span className="text-xs font-semibold" style={{ color: "rgba(240,192,64,0.8)" }}>
            Jeopardy Review
          </span>
        </div>
        <div className="flex items-center gap-3">
          {learner && (
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {learner.name}
            </span>
          )}
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer border-none"
            style={{ background: "rgba(240,192,64,0.12)", color: "#f0c040", border: "1px solid rgba(240,192,64,0.3)" }}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Game */}
      <iframe
        src="/JeopardyGame.html"
        title="Jeopardy Review"
        style={{ flex: 1, width: "100%", border: "none", display: "block" }}
      />

    </div>
  );
}
