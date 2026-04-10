import { useState, useEffect } from "react";
import {
  BookOpen,
  UserCheck,
  ClipboardList,
  Cpu,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";
import { getAllModules, getJourneys } from "../services/contentService";
import { useUser } from "../context/UserContext";

// WARNING: VITE_ADMIN_PASSWORD is a client-side gate only. It prevents
// accidental editing by non-administrators, but is not a security boundary —
// the value is visible in the compiled JS bundle. Do not rely on it for
// protecting sensitive data.
const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD;

// ── Icon lookup ──────────────────────────────────────
const ICON_MAP = { BookOpen, UserCheck, ClipboardList, Cpu, Zap };

const ACTIVITIES = [
  {
    key: "jeopardy",
    label: "Activity",
    title: "Jeopardy Review",
    desc: "25 questions across two programs, proof of presence, intake documents, timing rules, and firm process. Best played with a group.",
    style: "jeopardy",
  },
  {
    key: "final-assessment",
    label: "Assessment",
    title: "Final Assessment",
    desc: "20 questions covering all six modules \u2014 two programs, qualified conditions, intake documents, proof of presence, claim lifecycle, complex cases, and firm process.",
    style: "assessment",
  },
];

/**
 * Check if a short-form module id has a completion record.
 * Completions use long-form keys (e.g. "module-2-foundational-concepts")
 * while journeys use short-form ids ("module-2"), so we bridge with startsWith.
 */
function isModuleComplete(shortId, completions) {
  if (!completions || !shortId) return false;
  if (completions[shortId]) return true;
  return Object.keys(completions).some((k) => k.startsWith(shortId + "-"));
}

export default function HomePage({
  onStartModule,
  onStartActivity,
  onViewJourney,
  editMode,
  onEnterEditMode,
  onExitEditMode,
}) {
  const { user: learner, moduleCompletions } = useUser();
  const [modules, setModules] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [showAllModules, setShowAllModules] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [authError, setAuthError] = useState("");
  const [moduleEdits, setModuleEdits] = useState({});

  // Load journey + module data from content service
  useEffect(() => {
    let cancelled = false;
    Promise.all([getJourneys(), getAllModules()]).then(([j, m]) => {
      if (cancelled) return;
      setJourneys(j || []);
      setModules(m || []);
    });
    return () => { cancelled = true; };
  }, []);

  // Scan localStorage for edits per available module
  const refreshEdits = () => {
    const edits = {};
    modules.forEach((m) => {
      try {
        const stored = localStorage.getItem(`bm-lms-edits-${m.id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          edits[m.id] = Object.keys(parsed).some(
            (k) => Object.keys(parsed[k] || {}).length > 0
          );
        }
      } catch {
        // ignore parse errors
      }
    });
    setModuleEdits(edits);
  };

  useEffect(refreshEdits, [editMode, modules]);

  const tryAuth = () => {
    if (!ADMIN_PW || ADMIN_PW.trim() === "") {
      setAuthError("No admin password configured (VITE_ADMIN_PASSWORD).");
      return;
    }
    if (adminPw === ADMIN_PW) {
      setShowAdminModal(false);
      setAdminPw("");
      setAuthError("");
      onEnterEditMode();
    } else {
      setAuthError("Incorrect password \u2014 try again.");
    }
  };

  const clearModuleEdits = (key) => {
    localStorage.removeItem(`bm-lms-edits-${key}`);
    refreshEdits();
  };

  const closeModal = () => {
    setShowAdminModal(false);
    setAdminPw("");
    setAuthError("");
  };

  // ── Journey progress helpers ─────────────────────────
  const journeyProgress = (j) => {
    if (!j.modules || j.modules.length === 0) return { done: 0, total: 0 };
    const total = j.modules.length;
    const done = j.modules.filter((m) => isModuleComplete(m.id, moduleCompletions)).length;
    return { done, total };
  };

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* Edit mode banner */}
      {editMode && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-10 text-xs font-semibold"
          style={{ background: "#fef3c7", color: "#92400e", borderBottom: "1px solid #fcd34d" }}
        >
          <span>&#9999;&#65039; Edit Mode &mdash; content changes are saved to browser storage</span>
          <button
            onClick={onExitEditMode}
            className="px-3 py-1 rounded text-xs font-bold cursor-pointer border-none"
            style={{ background: "#fde68a", border: "1px solid #f59e0b", color: "#78350f" }}
          >
            Exit Edit Mode
          </button>
        </div>
      )}

      {/* Header */}
      <div
        className="bg-brand-hdr shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
        style={{ marginTop: editMode ? 40 : 0 }}
      >
        <div className="max-w-[960px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-white rounded px-2 py-1 inline-flex items-center">
              <img src={bmLogo} alt="B&M" className="h-8"/>
            </div>
            <div className="w-px h-5 bg-white/15"/>
            <span className="text-sm font-bold text-white font-heading">Training Modules</span>
          </div>
          <div className="flex items-center gap-3">
            {editMode && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" }}
              >
                Editing
              </span>
            )}
            {learner && (
              <span className="text-xs text-white/40">Welcome, {learner.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Journey cards grid ────────────────────────────── */}
      <div className="max-w-[960px] mx-auto px-8 pt-10 pb-6">
        <h2 className="text-xs font-bold tracking-widest text-brand-tl mb-5">LEARNING JOURNEYS</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {journeys.map((j) => {
            const Icon = ICON_MAP[j.icon] || BookOpen;
            const soon = !!j.comingSoon;
            const { done, total } = journeyProgress(j);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div
                key={j.id}
                className="rounded-lg border bg-brand-ww border-brand-sand overflow-hidden flex"
                style={{ opacity: soon ? 0.5 : 1 }}
              >
                {/* Left accent */}
                <div className="w-1 shrink-0" style={{ background: j.color }} />

                <div className="flex-1 px-5 pt-5 pb-5 flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Icon circle */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${j.color}15` }}
                    >
                      <Icon size={20} color={j.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-bold font-heading text-brand-gray-dk truncate">{j.title}</h3>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          soon
                            ? "bg-gray-100 text-brand-tl border border-gray-200"
                            : "bg-brand-ok-bg text-brand-ok border border-[#b8d5c4]"
                        }`}
                      >
                        {soon ? "Coming Soon" : "Available"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-tm leading-relaxed mb-3 line-clamp-3">{j.description}</p>

                  {/* Time + progress */}
                  <div className="mt-auto">
                    <span className="text-[11px] text-brand-tl block mb-2">{j.estimatedTime}</span>

                    {!soon && total > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-brand-tm">
                            {done} of {total} modules complete
                          </span>
                          <span className="text-[11px] font-bold" style={{ color: j.color }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-brand-sand overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: j.color }}
                          />
                        </div>
                      </div>
                    )}

                    {!soon && (
                      <button
                        onClick={() => onViewJourney(j.id)}
                        className="w-full py-2.5 rounded-md text-sm font-bold text-white border-none cursor-pointer"
                        style={{ background: j.color }}
                      >
                        View Journey &rarr;
                      </button>
                    )}

                    {soon && (
                      <div className="w-full py-2.5 rounded-md text-sm font-semibold text-center text-brand-tl bg-gray-100 border border-gray-200">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Browse all modules (open catalog) ─────────────── */}
      <div className="max-w-[960px] mx-auto px-8 pb-6">
        <button
          onClick={() => setShowAllModules((v) => !v)}
          className="flex items-center gap-2 text-xs font-semibold cursor-pointer border-none bg-transparent text-brand-blue"
        >
          {showAllModules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showAllModules ? "Hide module catalog" : "Browse all modules"}
        </button>

        {showAllModules && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {modules.map((m) => {
              const available = m.status === "available";
              const hasEdits = !!moduleEdits[m.id];
              const complete = isModuleComplete(m.id, moduleCompletions);
              return (
                <div
                  key={m.id}
                  className={`rounded-lg border overflow-hidden flex flex-col ${
                    available
                      ? "bg-brand-ww border-brand-sand"
                      : "bg-white/60 border-brand-sand/50 opacity-60"
                  }`}
                >
                  <div className="px-5 pt-5 pb-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-widest text-brand-blue">
                          {m.number.toUpperCase()}
                        </span>
                        {hasEdits && (
                          <span
                            className="w-2 h-2 rounded-full inline-block shrink-0"
                            style={{ background: "#f59e0b" }}
                            title="This module has unsaved local edits"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {complete && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-ok-bg text-brand-ok border border-[#b8d5c4]">
                            Complete
                          </span>
                        )}
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
                    </div>
                    <h3 className="text-base font-bold font-heading text-brand-gray-dk mb-1.5">{m.title}</h3>
                    <p className="text-xs text-brand-tm leading-relaxed mb-3">{m.description}</p>
                    <span className="text-[11px] text-brand-tl">{m.time}</span>
                  </div>
                  <div className="px-5 pb-5 flex flex-col gap-2">
                    {available ? (
                      <button
                        onClick={() => onStartModule(m.id)}
                        className="w-full py-2.5 rounded-md text-sm font-bold text-white bg-brand-blue border-none cursor-pointer"
                      >
                        {editMode ? "Edit Module \u2192" : complete ? "Review Module \u2192" : "Begin Module \u2192"}
                      </button>
                    ) : (
                      <div className="w-full py-2.5 rounded-md text-sm font-semibold text-center text-brand-tl bg-gray-100 border border-gray-200">
                        Coming Soon
                      </div>
                    )}
                    {hasEdits && editMode && (
                      <button
                        onClick={() => clearModuleEdits(m.id)}
                        className="w-full py-1.5 rounded-md text-xs font-semibold cursor-pointer border-none"
                        style={{ background: "#fef9c3", border: "1px solid #fcd34d", color: "#92400e" }}
                      >
                        &#8634; Clear local edits
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Activities section ─────────────────────────────── */}
      <div className="max-w-[960px] mx-auto px-8 pb-12">
        <h2 className="text-xs font-bold tracking-widest text-brand-tl mb-4">ACTIVITIES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACTIVITIES.map((a) => {
            const isAssessment = a.style === "assessment";
            return (
              <div
                key={a.key}
                className="rounded-lg overflow-hidden flex flex-col"
                style={{
                  background: isAssessment ? "#009bdf" : "#1a3a8f",
                  border: `1px solid ${isAssessment ? "#0081ba" : "#2a4aaf"}`,
                }}
              >
                <div className="px-5 pt-5 pb-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[11px] font-bold tracking-widest"
                      style={{ color: isAssessment ? "rgba(255,255,255,0.6)" : "rgba(240,192,64,0.7)" }}
                    >
                      {a.label.toUpperCase()}
                    </span>
                    {!isAssessment && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(240,192,64,0.15)", color: "#f0c040", border: "1px solid rgba(240,192,64,0.3)" }}
                      >
                        Group Play
                      </span>
                    )}
                    {isAssessment && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                      >
                        20 Questions
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-base font-bold font-heading mb-1.5"
                    style={{ color: isAssessment ? "white" : "#f0c040" }}
                  >
                    {a.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {a.desc}
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <button
                    onClick={() => onStartActivity(a.key)}
                    className="w-full py-2.5 rounded-md text-sm font-bold border-none cursor-pointer"
                    style={{
                      background: isAssessment ? "white" : "#f0c040",
                      color: isAssessment ? "#009bdf" : "#1a1a1a",
                    }}
                  >
                    {isAssessment ? "Begin \u2192" : "Play \u2192"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin button — subtle fixed corner (hidden when already in edit mode) */}
      {!editMode && (
        <div className="fixed bottom-4 right-5">
          <button
            onClick={() => setShowAdminModal(true)}
            className="cursor-pointer border-none bg-transparent transition-colors"
            style={{ color: "rgba(0,0,0,0.18)", fontSize: "10px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.45)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.18)")}
            title="Admin access"
          >
            &#9881; Admin
          </button>
        </div>
      )}

      {/* Password modal */}
      {showAdminModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-xl p-8 w-80 shadow-2xl">
            <div className="text-lg font-bold mb-1 font-heading text-brand-gray-dk">Admin Access</div>
            <p className="text-xs text-brand-tl mb-5 leading-relaxed">
              Enter the administrator password to enable Edit Mode and make in-browser content changes.
            </p>
            <input
              type="password"
              value={adminPw}
              onChange={(e) => { setAdminPw(e.target.value); setAuthError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") tryAuth(); }}
              className="w-full rounded-md px-3 py-2 text-sm mb-1 focus:outline-none"
              style={{ border: `1.5px solid ${authError ? "#ef4444" : "#e2d9cc"}` }}
              placeholder="Password"
              autoFocus
            />
            {authError && (
              <p className="text-xs mb-3 mt-1" style={{ color: "#ef4444" }}>{authError}</p>
            )}
            {!authError && <div className="mb-3"/>}
            <div className="flex gap-2">
              <button
                onClick={tryAuth}
                className="flex-1 py-2 rounded-md text-sm font-bold text-white bg-brand-blue border-none cursor-pointer"
              >
                Enter Edit Mode
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md text-sm font-semibold cursor-pointer border-none"
                style={{ background: "#f5f0e8", color: "#6b6255" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
