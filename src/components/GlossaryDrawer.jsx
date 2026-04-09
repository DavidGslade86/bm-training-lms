import { useState, useEffect, useRef } from "react";
import { B } from "../data/brand";
import { GLOSSARY as STATIC_GLOSSARY, CAT_COLOR } from "../data/glossary";
import { useEditableGlossary, entryKey } from "../hooks/useEditableGlossary";

const ALL_CATS = [
  "All",
  "B&M GENERAL VOCABULARY",
  "FORM AND DOCUMENT ACRONYMS",
  "MEDICAL TERMS/CONDITIONS",
  "DEPARTMENTS AND TITLES",
  "FA VOCABULARY",
  "AWARD/REVIEW TERMS",
  "GOVERNMENT PROGRAMS/AGENCIES",
];

const CAT_SHORT = {
  "All": "All",
  "B&M GENERAL VOCABULARY": "B&M Vocab",
  "FORM AND DOCUMENT ACRONYMS": "Forms & Docs",
  "MEDICAL TERMS/CONDITIONS": "Medical",
  "DEPARTMENTS AND TITLES": "Departments",
  "FA VOCABULARY": "Family Assist.",
  "AWARD/REVIEW TERMS": "Awards",
  "GOVERNMENT PROGRAMS/AGENCIES": "Programs",
};

// Categories the "Add" form can pick from
const EDITABLE_CATS = ALL_CATS.filter((c) => c !== "All");

export default function GlossaryDrawer({ open, onClose, editMode = false }) {
  const editCtx = useEditableGlossary();
  // Use the merged glossary if the provider is mounted, otherwise the static one
  const glossary = editCtx?.glossary || STATIC_GLOSSARY;

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [editingKey, setEditingKey] = useState(null); // key of entry currently being edited
  const [showAddForm, setShowAddForm] = useState(false);
  const [addDraft, setAddDraft] = useState({ cat: "B&M GENERAL VOCABULARY", abbr: "", term: "", def: "", ex: "" });
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ(""); setCat("All"); setExpanded(null);
      setEditingKey(null); setShowAddForm(false);
      setTimeout(()=>inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const lq = q.trim().toLowerCase();
  const filtered = glossary.filter(e => {
    if (cat !== "All" && e.cat !== cat) return false;
    if (!lq) return true;
    return (
      (e.term || "").toLowerCase().includes(lq) ||
      (e.abbr || "").toLowerCase().includes(lq) ||
      (e.def  || "").toLowerCase().includes(lq)
    );
  });

  const handleAdd = () => {
    if (!addDraft.term && !addDraft.abbr) {
      alert("Please provide a term or abbreviation.");
      return;
    }
    if (!addDraft.def) {
      alert("Please provide a definition.");
      return;
    }
    editCtx?.addEntry(addDraft);
    setAddDraft({ cat: "B&M GENERAL VOCABULARY", abbr: "", term: "", def: "", ex: "" });
    setShowAddForm(false);
  };

  const handleResetGloss = () => {
    if (window.confirm("Reset all in-browser glossary edits? This will discard new entries, edits, and deletions made in this browser.")) {
      editCtx?.resetGlossary();
    }
  };

  if (!open) return null;

  const showEditUI = editMode && !!editCtx;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/45 z-[10000] backdrop-blur-sm"/>

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] z-[10001] bg-brand-ww flex flex-col shadow-[-6px_0_40px_rgba(0,0,0,0.2)]">

        {/* Header */}
        <div className="bg-brand-hdr px-5 py-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-brand-blue text-[10px] font-bold tracking-[1.2px] uppercase mb-[3px]">BMSP GLOSSARY</div>
              <div className="text-white text-base font-bold font-heading">
                {filtered.length} of {glossary.length} terms
                {showEditUI && editCtx?.hasEdits && (
                  <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#fef3c7", color: "#92400e" }}>
                    {editCtx.editCount} edit{editCtx.editCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="bg-white/[0.08] border-none text-white/60 rounded-md w-8 h-8 cursor-pointer text-lg flex items-center justify-center">✕</button>
          </div>
          <input
            ref={inputRef}
            value={q}
            onChange={e=>{setQ(e.target.value); setExpanded(null);}}
            placeholder="Search terms, abbreviations, definitions…"
            className="w-full px-3 py-[9px] rounded-md border-none bg-white/10 text-white text-[13px] outline-none box-border"
          />
        </div>

        {/* Category tabs */}
        <div className="bg-brand-side px-3 py-2 flex gap-1.5 flex-wrap shrink-0 border-b border-white/[0.06]">
          {ALL_CATS.map(c => {
            const cc = CAT_COLOR[c] || B.blue;
            const active = cat === c;
            return (
              <button key={c} onClick={()=>{setCat(c); setExpanded(null);}}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer border-none tracking-[0.4px] transition-all duration-150"
                style={{background:active?cc:"rgba(255,255,255,0.07)",color:active?"white":"rgba(255,255,255,0.45)"}} /* dynamic: active category color */>
                {CAT_SHORT[c] || c}
              </button>
            );
          })}
        </div>

        {/* Edit-mode toolbar */}
        {showEditUI && (
          <div className="px-4 py-2 flex items-center justify-between gap-2 border-b" style={{ background: "#fffbeb", borderColor: "#fcd34d" }}>
            <button
              onClick={() => { setShowAddForm((v) => !v); setExpanded(null); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer border"
              style={{ background: showAddForm ? "#fcd34d" : "white", borderColor: "#fcd34d", color: "#92400e" }}
            >
              {showAddForm ? "✕ Cancel" : "+ Add new term"}
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={editCtx.exportGlossary}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer border"
                style={{ background: "white", borderColor: "#fcd34d", color: "#92400e" }}
                title="Download glossary.js with all changes baked in"
              >
                ⬇ Export .js
              </button>
              <button
                onClick={handleResetGloss}
                disabled={!editCtx.hasEdits}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer border disabled:opacity-40 disabled:cursor-default"
                style={{ background: editCtx.hasEdits ? "#fee2e2" : "transparent", borderColor: "#fca5a5", color: "#b91c1c" }}
              >
                ↺ Reset
              </button>
            </div>
          </div>
        )}

        {/* Add new entry form */}
        {showEditUI && showAddForm && (
          <div className="px-4 py-3 border-b text-xs" style={{ background: "#fffbeb", borderColor: "#fcd34d" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#92400e" }}>
              ✏️ New glossary entry
            </div>
            <div className="space-y-2">
              <label className="block">
                <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">Category</span>
                <select
                  value={addDraft.cat}
                  onChange={(e) => setAddDraft({ ...addDraft, cat: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
                  style={{ borderColor: "#fcd34d", background: "white" }}
                >
                  {EDITABLE_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">Abbreviation (optional)</span>
                  <input
                    value={addDraft.abbr}
                    onChange={(e) => setAddDraft({ ...addDraft, abbr: e.target.value })}
                    placeholder="e.g. POP"
                    className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
                    style={{ borderColor: "#fcd34d", background: "white" }}
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">Term</span>
                  <input
                    value={addDraft.term}
                    onChange={(e) => setAddDraft({ ...addDraft, term: e.target.value })}
                    placeholder="e.g. Proof of Presence"
                    className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
                    style={{ borderColor: "#fcd34d", background: "white" }}
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">Definition</span>
                <textarea
                  value={addDraft.def}
                  onChange={(e) => setAddDraft({ ...addDraft, def: e.target.value })}
                  rows={3}
                  className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
                  style={{ borderColor: "#fcd34d", background: "white" }}
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">See also (optional)</span>
                <input
                  value={addDraft.ex}
                  onChange={(e) => setAddDraft({ ...addDraft, ex: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
                  style={{ borderColor: "#fcd34d", background: "white" }}
                />
              </label>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 rounded text-[11px] font-bold cursor-pointer border"
                  style={{ background: "white", borderColor: "#d1d5db", color: "#6b7280" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-3 py-1 rounded text-[11px] font-bold cursor-pointer border"
                  style={{ background: "#10b981", borderColor: "#059669", color: "white" }}
                >
                  Save entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Term list */}
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-brand-tl text-[13px]">
              No terms match <strong>"{q}"</strong>
            </div>
          )}
          {filtered.map((e, idx) => {
            const k = entryKey(e);
            const key = `${k}|${idx}`;
            const isOpen = expanded === key;
            const isEditing = showEditUI && editingKey === k;
            const cc = CAT_COLOR[e.cat] || B.gray;
            const label = e.abbr ? e.abbr : e.term;
            const sub   = e.abbr ? e.term : null;
            return (
              <div key={key}
                onClick={()=>{ if (!isEditing) setExpanded(isOpen ? null : key); }}
                className="border-b border-brand-sand transition-colors duration-100"
                style={{padding:isOpen||isEditing?"12px 20px 14px":"10px 20px",background:isOpen||isEditing?B.blueLt:"transparent",cursor:isEditing?"default":"pointer"}} /* dynamic: expanded-state padding + bg */>

                {/* Compact row (collapsed view) */}
                {!isEditing && (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-bold text-[13px] text-brand-gray-dk">{label}</span>
                          {sub && <span className="text-[11px] text-brand-tl italic">{sub}</span>}
                        </div>
                        {!isOpen && e.def && (
                          <div className="text-[11px] text-brand-tl mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-[360px]">
                            {e.def}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] px-[7px] py-[2px] rounded-[10px] font-bold uppercase tracking-[0.5px] whitespace-nowrap"
                          style={{background:cc+"22",color:cc}} /* dynamic: category color with hex opacity suffix */>
                          {CAT_SHORT[e.cat] || e.cat}
                        </span>
                        <span className="text-brand-tl text-xs">{isOpen?"▲":"▼"}</span>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="mt-2.5">
                        {e.def && <p className="text-[13px] text-brand-tm leading-relaxed mb-1.5">{e.def}</p>}
                        {e.ex && <p className="text-[11px] text-brand-tl italic m-0">See also: {e.ex}</p>}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="text-[10px] font-bold uppercase tracking-[0.6px]" style={{color:cc}} /* dynamic: category color */>{e.cat}</div>
                          {showEditUI && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(ev) => { ev.stopPropagation(); setEditingKey(k); }}
                                className="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border"
                                style={{ background: "white", borderColor: "#fcd34d", color: "#92400e" }}
                              >
                                ✎ Edit
                              </button>
                              <button
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  if (window.confirm(`Delete glossary entry "${label}"?`)) {
                                    editCtx.deleteEntry(e);
                                  }
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border"
                                style={{ background: "white", borderColor: "#fca5a5", color: "#b91c1c" }}
                              >
                                ✕ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Inline edit form */}
                {isEditing && (
                  <EntryEditForm
                    entry={e}
                    onCancel={() => setEditingKey(null)}
                    onSave={(patch) => {
                      editCtx.updateEntry(e, patch);
                      setEditingKey(null);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2.5 bg-brand-ww border-t border-brand-sand text-[11px] text-brand-tl shrink-0">
          {showEditUI
            ? <span><strong>Edit mode:</strong> Add, edit, or delete glossary entries. Changes live in your browser until you Export.</span>
            : <span>Hover over <span className="border-b border-dotted border-brand-blue text-brand-tm">underlined terms</span> anywhere in the module to see definitions inline.</span>
          }
        </div>
      </div>
    </>
  );
}

// ─── Inline edit form for an existing entry ──────────
function EntryEditForm({ entry, onCancel, onSave }) {
  const [draft, setDraft] = useState({
    cat: entry.cat || "B&M GENERAL VOCABULARY",
    abbr: entry.abbr || "",
    term: entry.term || "",
    def: entry.def || "",
    ex: entry.ex || "",
  });
  return (
    <div onClick={(e) => e.stopPropagation()} className="text-xs">
      <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#92400e" }}>
        ✏️ Editing entry
      </div>
      <div className="space-y-2">
        <label className="block">
          <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">Category</span>
          <select
            value={draft.cat}
            onChange={(e) => setDraft({ ...draft, cat: e.target.value })}
            className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
            style={{ borderColor: "#fcd34d", background: "white" }}
          >
            {EDITABLE_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">Abbreviation</span>
            <input
              value={draft.abbr}
              onChange={(e) => setDraft({ ...draft, abbr: e.target.value })}
              className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
              style={{ borderColor: "#fcd34d", background: "white" }}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">Term</span>
            <input
              value={draft.term}
              onChange={(e) => setDraft({ ...draft, term: e.target.value })}
              className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
              style={{ borderColor: "#fcd34d", background: "white" }}
            />
          </label>
        </div>
        <label className="block">
          <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">Definition</span>
          <textarea
            value={draft.def}
            onChange={(e) => setDraft({ ...draft, def: e.target.value })}
            rows={4}
            className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
            style={{ borderColor: "#fcd34d", background: "white" }}
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold text-brand-tl block mb-0.5">See also (optional)</span>
          <input
            value={draft.ex}
            onChange={(e) => setDraft({ ...draft, ex: e.target.value })}
            className="w-full border rounded px-2 py-1 text-xs focus:outline-none"
            style={{ borderColor: "#fcd34d", background: "white" }}
          />
        </label>
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-3 py-1 rounded text-[11px] font-bold cursor-pointer border"
            style={{ background: "white", borderColor: "#d1d5db", color: "#6b7280" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            className="px-3 py-1 rounded text-[11px] font-bold cursor-pointer border"
            style={{ background: "#10b981", borderColor: "#059669", color: "white" }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
