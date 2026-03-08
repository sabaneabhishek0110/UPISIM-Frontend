import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Smartphone, Network, Landmark, Building2, Lock, Package, RefreshCw, Building } from "lucide-react";
import PageTransition from "../components/PageTransition";


// â”€â”€ Node definitions (index order matters for animation logic) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NODE_DEFS = [
  { id: "psp",      label: "PSP",           sub: "Payment Service Provider", color: "#6366f1", Icon: Smartphone },
  { id: "npci",     label: "NPCI",          sub: "Central Switch",           color: "#f59e0b", Icon: Network    },
  { id: "sender",   label: "Sender Bank",   sub: "Payer's Bank",             color: "#22c55e", Icon: Landmark   },
  { id: "receiver", label: "Receiver Bank", sub: "Payee's Bank",             color: "#3b82f6", Icon: Building2  },
];

// â”€â”€ Flow step sequences â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SUCCESS_STEPS = [
  { from: 0, to: 1, label: "Payment initiation",    detail: "PSP signs payload and sends transfer request to NPCI" },
  { from: 1, to: 2, label: "Debit request",          detail: "NPCI resolves payer VPA and sends signed debit request to sender bank" },
  { from: 2, to: 1, label: "Debit response",         detail: "Sender bank verifies PIN, debits amount, and responds to NPCI" },
  { from: 1, to: 3, label: "Credit request",         detail: "NPCI forwards signed credit request to receiver bank" },
  { from: 3, to: 1, label: "Credit response",        detail: "Receiver bank credits amount and responds to NPCI" },
  { from: 1, to: 0, label: "Success callback",       detail: "NPCI sends final SUCCESS status callback to PSP" },
];

const FAILURE_STEPS = [
  { from: 0,  to: 1,  label: "Payment initiation",    detail: "PSP signs payload and sends transfer request to NPCI" },
  { from: 1,  to: -1, label: "NPCI CRASHES!",          detail: "NPCI goes down before completing the transaction", crash: true },
  { from: -1, to: 1,  label: "Crash Recovery",         detail: "NPCI restarts — reads pending transactions from the outbox table", recovery: true },
  { from: 1,  to: 2,  label: "Resume: Debit request",  detail: "Recovered transaction resumes - debit sent to sender bank" },
  { from: 2,  to: 1,  label: "Debit response",         detail: "Sender bank verifies and debits amount" },
  { from: 1,  to: 3,  label: "Credit request",         detail: "NPCI sends credit request to receiver bank" },
  { from: 3,  to: 1,  label: "Credit response",        detail: "Receiver bank credits and responds" },
  { from: 1,  to: 0,  label: "Success callback",       detail: "NPCI sends final SUCCESS callback to PSP after recovery" },
];

// Static background connector pairs [a, b] â€” a < b always
const CONNECTIONS = [[0, 1], [1, 2], [1, 3]];
// Color to use on each line when active
const LINE_COLORS  = { "0-1": "#6366f1", "1-2": "#22c55e", "1-3": "#3b82f6" };

// â”€â”€ Glassy card style helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const glass = (alpha = 0.08) => ({
  backgroundColor: `rgba(255,255,255,${alpha})`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
});

// â”€â”€ NodeCard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NodeCard = ({ node, state, nodeRef }) => {
  const isActive   = state === "active";
  const crashed    = state === "crashed";
  const recovering = state === "recovering";
  const { Icon, label, sub, color } = node;
  const accent = crashed ? "#ef4444" : recovering ? "#f59e0b" : color;

  return (
    <motion.div
      ref={nodeRef}
      animate={{
        scale: isActive ? 1.06 : 1,
        boxShadow: crashed
          ? "0 0 40px rgba(239,68,68,0.65)"
          : recovering
            ? "0 0 36px rgba(245,158,11,0.65)"
            : isActive
              ? `0 0 30px ${color}55`
              : "0 0 0px transparent",
      }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl px-3 py-4 sm:px-5 sm:py-5 text-center select-none"
      style={{
        ...glass(0.14),
        borderColor: (isActive || crashed || recovering) ? accent : "rgba(255,255,255,0.1)",
        borderWidth: "1.5px",
        borderStyle: "solid",
        minWidth: 96,
      }}
    >
      {/* Icon box */}
      <div className="flex justify-center mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}20`, border: `1px solid ${accent}44` }}
        >
          <Icon size={17} color={accent} />
        </div>
      </div>

      {/* Status pulse dot */}
      <div
        className="w-2 h-2 rounded-full mx-auto mb-1.5"
        style={{
          backgroundColor: accent,
          opacity: (isActive || crashed || recovering) ? 1 : 0.25,
          boxShadow: (isActive || crashed || recovering) ? `0 0 7px ${accent}` : "none",
        }}
      />
      <p className="font-bold text-xs sm:text-sm" style={{ color: "var(--color-text)" }}>
        {label}
      </p>
      <p
        className="text-[9px] sm:text-[11px] mt-0.5 hidden sm:block"
        style={{ color: "var(--color-text-muted)" }}
      >
        {sub}
      </p>

      {/* Crash badge */}
      {crashed && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: "#ef4444", boxShadow: "0 0 14px rgba(239,68,68,0.7)" }}
        >
          !
        </motion.div>
      )}

      {/* Recovery outbox badge */}
      {recovering && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
          style={{
            backgroundColor: "rgba(245,158,11,0.18)",
            color: "#f59e0b",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          Outbox Table
        </motion.div>
      )}
    </motion.div>
  );
};

// â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ArchitecturePage = () => {
  const [scenario, setScenario]         = useState("success");
  const [currentStep, setCurrentStep]   = useState(-1);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [svgPts, setSvgPts]             = useState([]);   // measured centers for SVG lines

  const nodesRef     = useRef([]);
  const dotsRef      = useRef([null, null, null]);        // 3 trailing dot <circle> elements
  const timelineRef  = useRef(null);
  const containerRef = useRef(null);
  const scenarioRef  = useRef(scenario);

  // Keep scenarioRef in sync so the memoized runAnimation can read latest value
  useEffect(() => { scenarioRef.current = scenario; }, [scenario]);

  const steps = scenario === "success" ? SUCCESS_STEPS : FAILURE_STEPS;

  // â”€â”€ Measure node centers relative to diagram container â”€â”€
  const measurePts = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cR = c.getBoundingClientRect();
    setSvgPts(
      nodesRef.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - cR.left + r.width / 2, y: r.top - cR.top + r.height / 2 };
      })
    );
  }, []);

  useLayoutEffect(() => {
    const t = setTimeout(measurePts, 160);
    const ro = new ResizeObserver(measurePts);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [measurePts]);

  // â”€â”€ Live center reader â€” always reads DOM directly for GSAP accuracy â”€â”€
  const getLive = useCallback((idx) => {
    const el = nodesRef.current[idx];
    const c  = containerRef.current;
    if (!el || !c) return { x: 0, y: 0 };
    const cR = c.getBoundingClientRect();
    const r  = el.getBoundingClientRect();
    return { x: r.left - cR.left + r.width / 2, y: r.top - cR.top + r.height / 2 };
  }, []);

  // â”€â”€ Core animation runner â”€â”€
  const runAnimation = useCallback(() => {
    if (timelineRef.current) timelineRef.current.kill();
    dotsRef.current.forEach((d) => { if (d) d.setAttribute("opacity", 0); });

    const stepsToRun = scenarioRef.current === "success" ? SUCCESS_STEPS : FAILURE_STEPS;

    // â”€â”€ Dot-trail helper defined inside runAnimation so it closes over getLive â”€â”€
    const addDots = (tl, fromIdx, toIdx) => {
      tl.addLabel("ds"); // dotStart
      const N = 3, DUR = 0.72, STAGGER = 0.18;

      for (let i = 0; i < N; i++) {
        const dotEl  = dotsRef.current[i];
        if (!dotEl) continue;
        const delay   = i * STAGGER;
        const opacity = +(1 - i * 0.28).toFixed(2);
        const proxy   = { p: 0 };

        // Snap dot to start position before its window begins
        tl.call(() => {
          if (!dotEl) return;
          const s = getLive(fromIdx);
          dotEl.setAttribute("cx", s.x);
          dotEl.setAttribute("cy", s.y);
          dotEl.setAttribute("opacity", opacity);
        }, null, `ds+=${delay}`);

        // Animate proxy 0â†’1, translate to arc position on each update
        tl.to(proxy, {
          p: 1,
          duration: DUR,
          ease: "power2.inOut",
          onUpdate: () => {
            if (!dotEl) return;
            const s = getLive(fromIdx);
            const e = getLive(toIdx);
            dotEl.setAttribute("cx", s.x + (e.x - s.x) * proxy.p);
            dotEl.setAttribute(
              "cy",
              s.y + (e.y - s.y) * proxy.p - Math.sin(proxy.p * Math.PI) * 26
            );
          },
          onComplete: () => { if (dotEl) dotEl.setAttribute("opacity", 0); },
        }, `ds+=${delay}`);
      }

      // Advance playhead past the last dot finishing: DUR + (N-1)*STAGGER + small buffer
      tl.to({}, { duration: 0.05 }, `ds+=${DUR + (N - 1) * STAGGER + 0.08}`);
    };

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentStep(-1);
        setTimeout(
          () => setScenario((p) => (p === "success" ? "failure" : "success")),
          2000
        );
      },
    });
    timelineRef.current = tl;

    stepsToRun.forEach((step, idx) => {
      tl.call(() => setCurrentStep(idx));

      if (step.crash) {
        // Shake NPCI
        tl.to(nodesRef.current[1], {
          x: -8, duration: 0.04, yoyo: true, repeat: 9, ease: "power1.inOut",
          onComplete: () => gsap.set(nodesRef.current[1], { x: 0 }),
        });
        tl.to({}, { duration: 1.0 });
      } else if (step.recovery) {
        // Amber glow pulse on NPCI
        tl.fromTo(
          nodesRef.current[1],
          { boxShadow: "0 0 0px rgba(245,158,11,0)" },
          { boxShadow: "0 0 42px rgba(245,158,11,0.9)", duration: 0.9, yoyo: true, repeat: 1 }
        );
        tl.to({}, { duration: 0.5 });
      } else {
        addDots(tl, step.from, step.to);
        // Pulse destination node
        tl.to(nodesRef.current[step.to], {
          scale: 1.07, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut",
        });
      }
      tl.to({}, { duration: 0.4 }); // gap between steps
    });

    tl.to({}, { duration: 1.5 }); // linger at end
  }, [getLive]);

  // â”€â”€ Auto-restart when scenario changes while playing â”€â”€
  useEffect(() => {
    if (isPlaying) {
      setCurrentStep(-1);
      dotsRef.current.forEach((d) => { if (d) d.setAttribute("opacity", 0); });
      const t = setTimeout(runAnimation, 300);
      return () => clearTimeout(t);
    }
  }, [scenario, isPlaying, runAnimation]);

  useEffect(() => () => { if (timelineRef.current) timelineRef.current.kill(); }, []);

  const handlePlay = () => { setIsPlaying(true); setCurrentStep(-1); runAnimation(); };
  const handleStop = () => {
    setIsPlaying(false);
    if (timelineRef.current) timelineRef.current.kill();
    setCurrentStep(-1);
    dotsRef.current.forEach((d) => { if (d) d.setAttribute("opacity", 0); });
  };

  const currentStepData =
    currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;

  // Which static line is active?
  const activeLP =
    currentStepData && !currentStepData.crash && !currentStepData.recovery
      ? [currentStepData.from, currentStepData.to]
      : null;
  const isLineActive = (a, b) =>
    activeLP &&
    ((activeLP[0] === a && activeLP[1] === b) || (activeLP[0] === b && activeLP[1] === a));

  // Per-node visual state
  const nodeState = (i) => {
    if (!currentStepData) return "idle";
    if (currentStepData.crash    && i === 1) return "crashed";
    if (currentStepData.recovery && i === 1) return "recovering";
    if (
      !currentStepData.crash && !currentStepData.recovery &&
      (currentStepData.from === i || currentStepData.to === i)
    ) return "active";
    return "idle";
  };

  const dotFill = scenario === "success" ? "#6366f1" : "#f59e0b";

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">

        {/* â”€â”€ Header â”€â”€ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }}
          >
            System Design
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--color-text)" }}>
            UPI Payment Flow
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Watch how a payment travels across four microservices in real time — including crash recovery.
          </p>
        </motion.div>

        {/* â”€â”€ Controls â”€â”€ */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {["success", "failure"].map((s) => (
            <button
              key={s}
              onClick={() => { if (isPlaying) handleStop(); setScenario(s); setCurrentStep(-1); }}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                ...glass(scenario === s ? 0.18 : 0.06),
                color: scenario === s
                  ? (s === "success" ? "var(--color-success)" : "var(--color-danger)")
                  : "var(--color-text-secondary)",
                boxShadow: scenario === s
                  ? `0 0 20px ${s === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`
                  : "none",
              }}
            >
              {s === "success" ? "✓ Success Flow" : "✗ Crash Recovery"}
            </button>
          ))}
          <button
            onClick={isPlaying ? handleStop : handlePlay}
            className="ml-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all"
            style={{
              background: isPlaying
                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                : "linear-gradient(135deg,#4f46e5,#6366f1)",
            }}
          >
            {isPlaying ? "■ Stop" : "▶ Play"}
          </button>
        </div>

        {/* â”€â”€ Diagram â”€â”€ */}
        <div
          ref={containerRef}
          className="relative rounded-2xl p-6 sm:p-10 mb-10"
          style={{ ...glass(0.06), minHeight: 240 }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: scenario === "success"
                ? "radial-gradient(ellipse at 50% 110%, rgba(99,102,241,0.07) 0%, transparent 65%)"
                : "radial-gradient(ellipse at 50% 110%, rgba(239,68,68,0.06) 0%, transparent 65%)",
            }}
          />

          {/* SVG layer â€” connector lines + animated dot trail â”€â”€ */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
            style={{ zIndex: 1, overflow: "visible" }}
          >
            <defs>
              {/* Soft glow for dots */}
              <filter id="dotGlow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Softer glow for active lines */}
              <filter id="lineGlow" x="-20%" y="-200%" width="140%" height="500%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Static connector lines (faint dashes when idle, glow when active) */}
            {svgPts.length === 4 &&
              CONNECTIONS.map(([a, b]) => {
                const active = isLineActive(a, b);
                const key    = `${Math.min(a, b)}-${Math.max(a, b)}`;
                const lColor = active ? (LINE_COLORS[key] || "#6366f1") : "rgba(255,255,255,0.08)";
                const pa     = svgPts[a];
                const pb     = svgPts[b];
                return (
                  <line
                    key={key}
                    x1={pa.x} y1={pa.y}
                    x2={pb.x} y2={pb.y}
                    stroke={lColor}
                    strokeWidth={active ? 1.5 : 0.8}
                    strokeDasharray={active ? "7 5" : "4 8"}
                    filter={active ? "url(#lineGlow)" : undefined}
                    style={{ transition: "stroke 0.35s, stroke-width 0.35s" }}
                  />
                );
              })}

            {/* Three trailing animated dots */}
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                ref={(el) => (dotsRef.current[i] = el)}
                r={i === 0 ? 5 : i === 1 ? 3.5 : 2}
                cx={0}
                cy={0}
                opacity={0}
                fill={dotFill}
                filter="url(#dotGlow)"
              />
            ))}
          </svg>

          {/* â”€â”€ 3-column node grid: PSP | NPCI | Banks (stacked vertically) â”€â”€ */}
          <div
            className="relative grid items-center gap-4 sm:gap-8"
            style={{ gridTemplateColumns: "1fr 1fr 1fr", zIndex: 2 }}
          >
            {/* Col 1 â€” PSP */}
            <div className="flex justify-center">
              <NodeCard
                node={NODE_DEFS[0]}
                state={nodeState(0)}
                nodeRef={(el) => (nodesRef.current[0] = el)}
              />
            </div>

            {/* Col 2 â€” NPCI */}
            <div className="flex justify-center">
              <NodeCard
                node={NODE_DEFS[1]}
                state={nodeState(1)}
                nodeRef={(el) => (nodesRef.current[1] = el)}
              />
            </div>

            {/* Col 3 â€” Sender Bank (top) + Receiver Bank (bottom) */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <NodeCard
                node={NODE_DEFS[2]}
                state={nodeState(2)}
                nodeRef={(el) => (nodesRef.current[2] = el)}
              />
              <NodeCard
                node={NODE_DEFS[3]}
                state={nodeState(3)}
                nodeRef={(el) => (nodesRef.current[3] = el)}
              />
            </div>
          </div>
        </div>

        {/* â”€â”€ Current step label â”€â”€ */}
        <div className="min-h-[96px] mb-12">
          <AnimatePresence mode="wait">
            {currentStepData && (
              <motion.div
                key={currentStep + scenario}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl p-4 sm:p-5 max-w-2xl mx-auto text-center"
                style={{
                  ...glass(0.1),
                  borderLeft: `3px solid ${
                    currentStepData.crash ? "#ef4444" : currentStepData.recovery ? "#f59e0b" : "var(--color-accent)"
                  }`,
                }}
              >
                <p
                  className="font-bold text-base mb-1"
                  style={{
                    color: currentStepData.crash
                      ? "var(--color-danger)"
                      : currentStepData.recovery
                        ? "#f59e0b"
                        : "var(--color-text)",
                  }}
                >
                  {currentStepData.crash ? "⚠ " : currentStepData.recovery ? "↻ " : ""}
                  {currentStepData.label}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {currentStepData.detail}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!currentStepData && !isPlaying && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm py-8"
              style={{ color: "var(--color-text-muted)" }}
            >
              Press <strong>Play</strong> to watch the{" "}
              {scenario === "success" ? "payment success" : "crash recovery"} flow
            </motion.p>
          )}
        </div>

        {/* â”€â”€ Step legend â”€â”€ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--color-text)" }}>
            {scenario === "success" ? "Success Flow Steps" : "Crash Recovery Steps"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl p-4 flex gap-3 items-start transition-all duration-200"
                style={{
                  ...glass(currentStep === i ? 0.18 : 0.06),
                  borderLeft: currentStep === i
                    ? `3px solid ${s.crash ? "#ef4444" : s.recovery ? "#f59e0b" : "var(--color-accent)"}`
                    : "3px solid transparent",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                  style={{
                    background: s.crash
                      ? "#ef4444"
                      : s.recovery
                        ? "#f59e0b"
                        : "linear-gradient(135deg,#4f46e5,#6366f1)",
                  }}
                >
                  {s.crash ? "!" : s.recovery ? "↺" : i + 1}
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{
                      color: s.crash ? "var(--color-danger)" : s.recovery ? "#f59e0b" : "var(--color-text)",
                    }}
                  >
                    {s.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                    {s.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* â”€â”€ Architecture highlights â”€â”€ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl p-6 sm:p-8 text-center"
          style={glass(0.06)}
        >
          <h3 className="font-bold text-lg mb-6" style={{ color: "var(--color-text)" }}>
            Architecture Highlights
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { Icon: Lock,      title: "Signed Requests",  desc: "RSA digital signatures on every inter-service call" },
              { Icon: Package,   title: "Outbox Pattern",   desc: "NPCI persists events to survive crashes" },
              { Icon: RefreshCw, title: "Async Processing", desc: "202 Accepted + callback for non-blocking flow" },
              { Icon: Building,  title: "Multi-Bank",       desc: "HDFC & ICICI run as independent microservices" },
            ].map((h) => (
              <div key={h.title} className="rounded-xl p-4" style={glass(0.08)}>
                <div className="flex justify-center mb-2"><h.Icon size={22} style={{ color: "var(--color-accent)" }} /></div>
                <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{h.title}</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </PageTransition>
  );
};

export default ArchitecturePage;
