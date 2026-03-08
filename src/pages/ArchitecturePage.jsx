import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import PageTransition from "../components/PageTransition";

const services = [
  {
    name: "PSP (Payment Service Provider)",
    color: "#6366f1",
    desc: "User-facing gateway. Handles authentication, payment initiation, status polling, and transaction history. Acts as the bridge between the frontend and NPCI.",
    endpoints: [
      "POST /api/user/register, /login, /logout",
      "GET  /api/user/me, /api/user?vpa=",
      "POST /api/payment/initiate",
      "GET  /api/payment/status/{txnId}",
      "POST /api/account/balance",
      "GET  /api/account/transactions",
    ],
    tech: ["Spring Boot", "JWT Cookies", "Digital Signatures", "PostgreSQL"],
  },
  {
    name: "NPCI (National Payments Corporation)",
    color: "#f59e0b",
    desc: "Central switch that routes payments. Receives signed requests from PSP, resolves VPAs to banks, orchestrates debit/credit, and sends async callbacks.",
    endpoints: [
      "POST /api/payment/initiate (async, returns 202)",
      "POST /api/account/balance",
      "GET  /api/payment/status/{txnId}",
    ],
    tech: ["Outbox Pattern", "Async Event Processing", "Signature Verification", "Bank Registry"],
  },
  {
    name: "HDFC Bank",
    color: "#22c55e",
    desc: "Simulated bank with its own account ledger. Handles debit, credit, and reversal operations after verifying NPCI-signed requests.",
    endpoints: [
      "POST /api/bank/debit",
      "POST /api/bank/credit",
      "POST /api/bank/reversal",
      "POST /api/account/balance",
    ],
    tech: ["Account Ledger", "PIN Hashing", "Signature Verification", "PostgreSQL"],
  },
  {
    name: "ICICI Bank",
    color: "#3b82f6",
    desc: "Second simulated bank, structurally identical to HDFC but running independently. Enables cross-bank transfers through NPCI.",
    endpoints: [
      "POST /api/bank/debit",
      "POST /api/bank/credit",
      "POST /api/bank/reversal",
      "POST /api/account/balance",
    ],
    tech: ["Account Ledger", "PIN Hashing", "Signature Verification", "PostgreSQL"],
  },
];

const flowSteps = [
  { step: 1, title: "User initiates payment", detail: "Frontend sends payment request with PIN to PSP." },
  { step: 2, title: "PSP signs & forwards", detail: "PSP creates a transaction, signs the payload, and sends to NPCI." },
  { step: 3, title: "NPCI acknowledges", detail: "NPCI returns 202 ACKNOWLEDGED and queues the transaction for async processing." },
  { step: 4, title: "NPCI resolves VPAs", detail: "NPCI looks up payer and payee banks from the VPA registry." },
  { step: 5, title: "Debit payer bank", detail: "NPCI sends signed debit request to payer's bank. Bank verifies PIN and debits." },
  { step: 6, title: "Credit payee bank", detail: "On successful debit, NPCI sends signed credit request to payee's bank." },
  { step: 7, title: "Callback to PSP", detail: "NPCI sends final status (SUCCESS/FAILED) to PSP via callback." },
  { step: 8, title: "Frontend gets result", detail: "Frontend polls PSP status endpoint until it receives the final outcome." },
];

const ArchitecturePage = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".arch-node",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }
      );
    }, diagramRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }}
          >
            System Design
          </span>
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            Architecture Overview
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Four independent Spring Boot microservices communicating via REST with
            cryptographic request signing.
          </p>
        </motion.div>

        {/* Visual Diagram */}
        <div ref={diagramRef} className="mb-20">
          <div className="flex flex-col items-center gap-4">
            {/* Frontend → PSP */}
            <div className="arch-node flex flex-col items-center">
              <div
                className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
              >
                React Frontend
              </div>
              <div className="w-px h-8" style={{ backgroundColor: "var(--color-border)" }} />
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>HTTPS + JWT Cookie</span>
              <div className="w-px h-8" style={{ backgroundColor: "var(--color-border)" }} />
            </div>

            {/* PSP */}
            <div className="arch-node">
              <div
                className="px-8 py-4 rounded-xl font-semibold text-white text-sm text-center"
                style={{ backgroundColor: "#6366f1" }}
              >
                PSP Service
                <div className="text-xs opacity-80 font-normal mt-1">Port 8083</div>
              </div>
            </div>

            <div className="arch-node w-px h-8" style={{ backgroundColor: "var(--color-border)" }} />
            <span className="arch-node text-xs" style={{ color: "var(--color-text-muted)" }}>
              Signed REST Requests
            </span>
            <div className="arch-node w-px h-8" style={{ backgroundColor: "var(--color-border)" }} />

            {/* NPCI */}
            <div className="arch-node">
              <div
                className="px-8 py-4 rounded-xl font-semibold text-white text-sm text-center"
                style={{ backgroundColor: "#f59e0b" }}
              >
                NPCI Service
                <div className="text-xs opacity-80 font-normal mt-1">Central Switch</div>
              </div>
            </div>

            {/* Banks */}
            <div className="arch-node w-px h-8" style={{ backgroundColor: "var(--color-border)" }} />
            <div className="arch-node flex gap-8">
              <div
                className="px-6 py-3 rounded-xl font-semibold text-white text-sm text-center"
                style={{ backgroundColor: "#22c55e" }}
              >
                HDFC Bank
              </div>
              <div
                className="px-6 py-3 rounded-xl font-semibold text-white text-sm text-center"
                style={{ backgroundColor: "#3b82f6" }}
              >
                ICICI Bank
              </div>
            </div>
          </div>
        </div>

        {/* Payment Flow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "var(--color-text)" }}>
            Payment Flow
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {flowSteps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 items-start"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                    {s.title}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                    {s.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Service Details */}
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "var(--color-text)" }}>
          Microservices
        </h2>
        <div className="space-y-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: svc.color }}
                />
                <h3 className="font-semibold" style={{ color: "var(--color-text)" }}>
                  {svc.name}
                </h3>
              </div>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
                {svc.desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>
                    KEY ENDPOINTS
                  </p>
                  <div className="space-y-1">
                    {svc.endpoints.map((ep) => (
                      <code
                        key={ep}
                        className="block text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: "var(--color-bg)",
                          color: "var(--color-accent)",
                        }}
                      >
                        {ep}
                      </code>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>
                    TECHNOLOGIES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {svc.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-md font-medium"
                        style={{
                          backgroundColor: "var(--color-accent-light)",
                          color: "var(--color-accent)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default ArchitecturePage;
