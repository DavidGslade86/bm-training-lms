import { useState } from "react";
import { B } from "../data/brand";
import bmLogo from "../assets/Barasch_McGarry_Logo_2020_RGB.png";

const ROLES = [
  "CA I — Health Program",
  "CA II — VCF Claims",
  "FA CA — Family Assistance",
  "CAT / Intake",
  "Supervisor / Attorney",
  "Other",
];

export default function RegistrationScreen({ onStart, onGuestReview, onPlayJeopardy }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    const trimName = name.trim();
    if (!trimName) e.name = "Please enter your full name.";
    else if (trimName.split(/\s+/).length < 2) e.name = "Please enter first and last name.";
    if (!email.trim()) e.email = "Please enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Please enter a valid email address.";
    if (!role) e.role = "Please select your role.";
    return e;
  };

  const handleStart = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    onStart({ name: name.trim(), email: email.trim().toLowerCase(), role });
  };

  /* dynamic: form input/label/error styles use rgba whites on dark bg + conditional error borders */
  const F = {
    label:   { fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.8px", display:"block", marginBottom:6 },
    input:   { width:"100%", padding:"10px 14px", borderRadius:6, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.07)", color:"white", fontSize:14, outline:"none", boxSizing:"border-box" },
    inputErr:{ border:"1px solid #e05a5a" },
    err:     { fontSize:11, color:"#e08080", marginTop:5 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="w-full max-w-[480px] mx-auto px-5">
        <div className="bg-brand-hdr rounded-xl overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.25)]">
          {/* Header */}
          <div className="px-9 pt-8 pb-7 border-b border-white/[0.07]">
            <img src={bmLogo} alt="Barasch & McGarry" className="h-9 mb-6"/>
            <div className="text-[22px] font-bold text-white font-heading mb-1.5">
              B&M Training Portal
            </div>
            <div className="text-[13px] text-white/45">
              Please enter your information before beginning. Your completion data will be recorded.
            </div>
          </div>

          {/* Form */}
          <div className="px-9 pt-7 pb-8">
            {/* Name */}
            <div className="mb-5">
              <label style={F.label} /* dynamic: F.label uses rgba white text */>Full Name</label>
              <input
                type="text" value={name} placeholder="First Last"
                onChange={e=>{setName(e.target.value); setErrors(prev=>({...prev,name:undefined}));}}
                onKeyDown={e=>e.key==="Enter"&&handleStart()}
                style={{...F.input,...(errors.name?F.inputErr:{})}} /* dynamic: conditional error border */
              />
              {errors.name && <div style={F.err} /* dynamic: error styling */>{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label style={F.label} /* dynamic: F.label uses rgba white text */>Work Email</label>
              <input
                type="email" value={email} placeholder="you@barashmcgarry.com"
                onChange={e=>{setEmail(e.target.value); setErrors(prev=>({...prev,email:undefined}));}}
                onKeyDown={e=>e.key==="Enter"&&handleStart()}
                style={{...F.input,...(errors.email?F.inputErr:{})}} /* dynamic: conditional error border */
              />
              {errors.email && <div style={F.err} /* dynamic: error styling */>{errors.email}</div>}
            </div>

            {/* Role */}
            <div className="mb-7">
              <label style={F.label} /* dynamic: F.label uses rgba white text */>Role / Department</label>
              <select
                value={role}
                onChange={e=>{setRole(e.target.value); setErrors(prev=>({...prev,role:undefined}));}}
                style={{
                  ...F.input,...(errors.role?F.inputErr:{}),
                  appearance:"none",
                  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:36,
                  color: role ? "white" : "rgba(255,255,255,0.3)",
                }} /* dynamic: custom select arrow SVG + conditional error + role-dependent placeholder color */>
                <option value="" disabled className="bg-brand-hdr">Select your role…</option>
                {ROLES.map(r=><option key={r} value={r} className="bg-brand-hdr text-white">{r}</option>)}
              </select>
              {errors.role && <div style={F.err} /* dynamic: error styling */>{errors.role}</div>}
            </div>

            {/* Submit */}
            <button
              onClick={handleStart}
              disabled={submitting}
              className="w-full py-[13px] rounded-[7px] border-none text-white text-[15px] font-bold transition-colors duration-150"
              style={{background: submitting ? "#555" : B.blue, cursor: submitting ? "default" : "pointer"}} /* dynamic: submitting-state bg + cursor */>
              {submitting ? "Starting…" : "Log in →"}
            </button>
            {onGuestReview && (
              <button
                onClick={onGuestReview}
                className="w-full py-[11px] rounded-[7px] border-none text-[14px] font-semibold transition-colors duration-150 mt-2.5 cursor-pointer"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                Review Material
              </button>
            )}
            <p className="text-[11px] text-white/25 text-center mt-3.5">
              Your name, email, and performance data will be recorded for training tracking purposes.
            </p>
            {onPlayJeopardy && (
              <p className="text-[11px] text-center mt-3">
                <button
                  onClick={onPlayJeopardy}
                  className="border-none bg-transparent cursor-pointer underline"
                  style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  Play Jeopardy without signing in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
