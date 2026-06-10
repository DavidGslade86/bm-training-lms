import { useState, useRef, useCallback } from "react";
import "./LatencySpectrumDiagram.css";

const AXIS_MAX = 12;

const CANCERS = [
  { id: "blood",     label: "Blood cancers",                    years: 5 / 12, display: "~5 months" },
  { id: "childhood", label: "All childhood cancers",            years: 1,      display: "1 year" },
  { id: "thyroid",   label: "All thyroid cancers",              years: 2.5,    display: "2.5 years" },
  { id: "solid",     label: "All other covered solid cancers",  years: 4,      display: "4 years" },
  { id: "meso",      label: "All mesotheliomas",                years: 11,     display: "11 years" },
];

const NONCANCERS = [
  {
    id: "oad",
    label: "COPD / emphysema, ILDs, upper-airway hyperactivity, chronic laryngitis",
    short: "COPD, Emphysema, and ILDs",
    max: null,
    display: "No maximum",
  },
  {
    id: "urd",
    label: "Upper respiratory — rhinosinusitis, sinusitis",
    short: "Upper respiratory",
    max: 5,
    display: "5 years",
  },
  {
    id: "gerd-co",
    label: "GERD co-occurring with an OAD, URD, or ILD condition",
    short: "GERD with another WTC condition",
    max: 5,
    display: "5 years",
  },
  {
    id: "gerd-iso",
    label: "Isolated GERD — no other diagnosed WTC-related condition",
    short: "Isolated GERD",
    max: 1,
    display: "1 year",
  },
];

const GRID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function pct(years, max) {
  return Math.max(0, Math.min(100, (years / max) * 100));
}

function fmtTime(years) {
  if (years < 1) {
    const m = Math.round(years * 12);
    return m + (m === 1 ? " month" : " months");
  }
  const rounded = Math.round(years * 10) / 10;
  const label = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return label + (rounded === 1 ? " year" : " years");
}

export default function LatencySpectrumDiagram() {
  const [head, setHead] = useState(2.5);
  const overlayRef = useRef(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX) => {
    const el = overlayRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = (clientX - r.left) / r.width;
    setHead(Math.max(0, Math.min(AXIS_MAX, ratio * AXIS_MAX)));
  }, []);

  const onDown = useCallback((e) => {
    dragging.current = true;
    overlayRef.current.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  }, [setFromClientX]);

  const onMove = useCallback((e) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  }, [setFromClientX]);

  const onUp = useCallback((e) => {
    dragging.current = false;
    overlayRef.current?.releasePointerCapture?.(e.pointerId);
  }, []);

  const onKey = useCallback((e) => {
    const step = e.shiftKey ? 1 : 0.25;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setHead((h) => Math.min(AXIS_MAX, h + step));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setHead((h) => Math.max(0, h - step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setHead(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHead(AXIS_MAX);
    }
  }, []);

  const eligibleCancers = CANCERS.filter((c) => head >= c.years).length;
  const openWindows = NONCANCERS.filter((n) => n.max === null || head <= n.max).length;

  return (
    <div className="c2">
      <div className="c2-wrap">
        <div className="c2-head">
          <div className="c2-eyebrow">Latency vs. maximum time interval</div>
          <h2>How long after 9/11 a condition can be linked</h2>
          <p>
            Latency is the <b>minimum</b> time that passes before a cancer is
            recognized as 9/11-related. A maximum time interval (MTI) is the{" "}
            <b>maximum</b> time a non-cancer condition can take to appear. They run
            in opposite directions — drag the marker to feel the difference.
          </p>
        </div>

        <div className="c2-legend">
          <div className="c2-rule" data-k="cancer">
            <div className="glyph">
              <span className="stop" />
            </div>
            <div className="rtext">
              <div className="rk">Cancer latency — a floor</div>
              <div className="rd">
                Counts only once enough time has passed. Eligibility opens at the
                marker and continues onward.
              </div>
            </div>
          </div>
          <div className="c2-rule" data-k="non">
            <div className="glyph">
              <span className="box" />
              <span className="cap" />
            </div>
            <div className="rtext">
              <div className="rk">Non-cancer MTI — a ceiling</div>
              <div className="rd">
                Counts only within the window from exposure. Past the cap, the
                window closes.
              </div>
            </div>
          </div>
        </div>

        <div className="c2-chart">
          <div className="c2-band c2-band--cancer">
            <span className="swatch" style={{ background: "var(--cancer)" }} />
            Cancers &middot; minimum latency before eligibility
            <span className="sub">Eligible at or after the marker</span>
          </div>
          {CANCERS.map((c) => {
            const on = head >= c.years;
            return (
              <div className="c2-row" data-k="cancer" data-state={on ? "on" : "off"} key={c.id}>
                <div className="c2-rowlabel">
                  <span className="nm">{c.label}</span>
                  <span className="val">{c.display}</span>
                </div>
                <div className="c2-track">
                  <div className="c2-trackpad">
                    <div
                      className="c2-bar c2-bar--cancer"
                      style={{ left: pct(c.years, AXIS_MAX) + "%", right: 0 }}
                    />
                    <div className="c2-marker" style={{ left: pct(c.years, AXIS_MAX) + "%" }} />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="c2-axisrow">
            <div className="axlabel">Time since exposure →</div>
            <div className="c2-axisticks">
              {GRID.map((g) => (
                <div className="c2-tick" key={g} style={{ left: pct(g, AXIS_MAX) + "%" }}>
                  <span>{g === AXIS_MAX ? "11+ yr" : g + (g === 1 ? " yr" : "")}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c2-band c2-band--non">
            <span className="swatch" style={{ background: "var(--noncancer)" }} />
            Non-cancers &middot; maximum time interval (MTI)
            <span className="sub">In window at or before the cap</span>
          </div>
          {NONCANCERS.map((n) => {
            const on = n.max === null || head <= n.max;
            const isOpen = n.max === null;
            return (
              <div className="c2-row" data-k="non" data-state={on ? "on" : "off"} key={n.id}>
                <div className="c2-rowlabel">
                  <span className="nm">{n.short}</span>
                  <span className="val">{n.display}</span>
                </div>
                <div className="c2-track">
                  <div className="c2-trackpad">
                    <div
                      className={"c2-bar c2-bar--non" + (isOpen ? " is-open" : "")}
                      style={{ width: isOpen ? "100%" : pct(n.max, AXIS_MAX) + "%" }}
                    >
                      {isOpen && <span className="inf">No cap →</span>}
                    </div>
                    {!isOpen && (
                      <div className="c2-cap" style={{ left: pct(n.max, AXIS_MAX) + "%" }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            className="c2-overlay"
            ref={overlayRef}
            role="slider"
            tabIndex={0}
            aria-label="Time since exposure, in years"
            aria-valuemin={0}
            aria-valuemax={AXIS_MAX}
            aria-valuenow={Math.round(head * 10) / 10}
            aria-valuetext={fmtTime(head) + " since exposure"}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
          >
            {GRID.map((g) => (
              <div className="gl" key={g} style={{ left: pct(g, AXIS_MAX) + "%" }} />
            ))}
            <div className="c2-playhead" style={{ left: pct(head, AXIS_MAX) + "%" }}>
              <div className="c2-knob">
                <span className="grip">{fmtTime(head)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="c2-readout">
          <div className="c2-stat" data-k="cancer">
            <span className="big">
              {eligibleCancers}
              <span style={{ fontSize: "16px", color: "var(--ink-faint)" }}>/{CANCERS.length}</span>
            </span>
            <span className="lab">
              cancer types have <b>passed</b> their latency at {fmtTime(head)}
            </span>
            <span className="arrow">opens →</span>
          </div>
          <div className="c2-stat" data-k="non">
            <span className="big">
              {openWindows}
              <span style={{ fontSize: "16px", color: "var(--ink-faint)" }}>/{NONCANCERS.length}</span>
            </span>
            <span className="lab">
              non-cancer windows are <b>still open</b> at {fmtTime(head)}
            </span>
            <span className="arrow">← closes</span>
          </div>
        </div>

        <div className="c2-foot">
          <span>Drag the marker, or focus it and use</span>
          <kbd>←</kbd><kbd>→</kbd>
          <span>(hold Shift for whole years).</span>
        </div>
      </div>
    </div>
  );
}
