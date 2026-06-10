import { useState, useRef, useEffect, useCallback } from "react";
import "./ProgramComparisonWidget.css";

const PROGRAMS = {
  wtchp: {
    short: "WTCHP",
    name: "World Trade Center Health Program",
  },
  vcf: {
    short: "VCF",
    name: "Victim Compensation Fund",
  },
};

const DIMENSIONS = [
  {
    id: "admin",
    label: "Administered by",
    wtchp: { value: "Health and Human Services (CDC / NIOSH)" },
    vcf:   { value: "Department of Justice" },
  },
  {
    id: "purpose",
    label: "Purpose",
    wtchp: { value: "Provide health care for conditions certified to be 9/11 related." },
    vcf:   { value: "Provide financial compensation to those affected by 9/11 illness." },
  },
  {
    id: "area",
    label: "Eligibility area",
    wtchp: {
      value: "Two zones, both 9/11/2001 – 7/31/2002",
      breakdown: [
        { tag: "Responders", text: "South of Canal St. / west of Clinton St. — 9/11/2001 – 7/31/2002" },
        { tag: "Survivors",  text: "South of Houston St., 1.5-mile radius — 9/11/2001 – 7/31/2002" },
      ],
    },
    vcf: {
      value: "South of Canal St. & west of Clinton St. in Manhattan and other approved satellite locations — 9/11/2001 through 5/30/2002",
    },
  },
  {
    id: "proof",
    label: "Proof needed",
    wtchp: {
      value: "Victim and two third-party statements showing hours and location(s) of exposure. Diagnostic medical records for the covered condition.",
    },
    vcf: {
      value: "Documents and/or eyewitness statements showing the claimant was in the 9/11 exposure zone.",
    },
  },
  {
    id: "gets",
    label: "What the claimant gets",
    wtchp: {
      value: "Free treatment for covered conditions",
      extra: "Free monitoring for 9/11 responders",
    },
    vcf: {
      value: "Compensation for pain and suffering, lost income (if applicable), and additional awards for wrongful death (if applicable).",
    },
  },
];

const SHARED = { label: "Open through", value: "2090", note: "Both programs" };

const SEQUENCE =
  "In a typical case, the claimant first enrolls in the WTCHP and gets their " +
  "illness certified. That certification letter is then submitted as part of " +
  "the VCF claim. WTCHP certification is a prerequisite for most living " +
  "claimants, though there are alternative paths we’ll cover in later modules.";

function CSide({ prog, side }) {
  return (
    <div className={"tC-side tC-side--" + (prog === "wtchp" ? "w" : "v")} data-prog={prog}>
      <div className="val">{side.value}</div>
      {side.extra && <div className="extra">+ {side.extra}</div>}
      {side.breakdown && (
        <div className="bk">
          {side.breakdown.map((b, i) => (
            <div className="tC-bk-card" key={i}>
              <div className="tag">{b.tag}</div>
              <div className="txt">{b.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProgramComparisonWidget() {
  const W = PROGRAMS.wtchp;
  const V = PROGRAMS.vcf;
  const [shown, setShown] = useState(0);
  const [anim, setAnim] = useState("");
  const [auto, setAuto] = useState(true);
  const swap = useRef(null);

  const goTo = useCallback(
    (i) => {
      if (i === shown) return;
      clearTimeout(swap.current);
      setAnim("out");
      swap.current = setTimeout(() => {
        setShown(i);
        setAnim("");
      }, 280);
    },
    [shown]
  );

  const d = DIMENSIONS[shown];

  useEffect(() => {
    if (!auto) return;
    let alive = true;
    const id = setInterval(() => {
      if (!alive) return;
      setAnim("out");
      setTimeout(() => {
        if (!alive) return;
        setShown((s) => (s + 1) % DIMENSIONS.length);
        setAnim("");
      }, 280);
    }, 2800);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [auto]);

  return (
    <div className="c1">
      <div className="tC">
        <div className="tC-top">
          <div>
            <div className="eyebrow">Compare on one dimension at a time</div>
            <h2>WTCHP vs. VCF</h2>
          </div>
        </div>

        <div className="tC-board">
          <div className="tC-heads">
            <div className="tC-phead tC-phead--w" data-prog="wtchp">
              <div className="code">{W.short}</div>
              <div className="name">{W.name}</div>
            </div>
            <div className="tC-vs">VS</div>
            <div className="tC-phead tC-phead--v" data-prog="vcf">
              <div className="code">{V.short}</div>
              <div className="name">{V.name}</div>
            </div>
          </div>

          <div className="tC-dimlabel">
            <div className="v">{d.label}</div>
          </div>

          <div className="tC-stage" data-anim={anim}>
            <CSide prog="wtchp" side={d.wtchp} />
            <div className="tC-mid" aria-hidden="true" />
            <CSide prog="vcf" side={d.vcf} />
          </div>
        </div>

        <div className="tC-rail">
          {DIMENSIONS.map((dim, i) => (
            <button
              key={dim.id}
              type="button"
              className="tC-tab"
              data-on={i === shown ? "1" : "0"}
              onClick={() => {
                setAuto(false);
                goTo(i);
              }}
            >
              <span className="dot" />
              {dim.label}
            </button>
          ))}
        </div>

        <div className="tC-foot">
          <div className="shared">
            <span className="k">
              {SHARED.label}
              <br />
              {SHARED.note}
            </span>
            <span className="v">{SHARED.value}</span>
          </div>
          <div className="seq">
            <span className="k">The order</span>
            <p>{SEQUENCE}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
