import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, Shield, Zap, Database, Globe } from "lucide-react";
import PageTransition from "../components/PageTransition";

const features = [
  {
    icon: <Shield size={24} />,
    title: "Secure Transactions",
    desc: "End-to-end signed payloads between PSP, NPCI, and banks with public-key cryptography.",
  },
  {
    icon: <Zap size={24} />,
    title: "Async Processing",
    desc: "NPCI uses an outbox pattern with background event processing for reliable payment orchestration.",
  },
  {
    icon: <Database size={24} />,
    title: "Multi-Database",
    desc: "Each microservice (PSP, NPCI, HDFC, ICICI) has its own PostgreSQL database for true isolation.",
  },
  {
    icon: <Globe size={24} />,
    title: "Real UPI Flow",
    desc: "Simulates the actual UPI payment flow: PSP → NPCI → Payer Bank → Payee Bank → Callback.",
  },
];

const LandingPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-gradient",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.15, duration: 2, ease: "power3.out" }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden py-24 sm:py-32">
        {/* Background glow */}
        <div
          className="hero-gradient absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #4f46e5, #1e1b4b)" }}
        />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6"
              style={{
                backgroundColor: "var(--color-accent-light)",
                color: "var(--color-accent)",
              }}
            >
              Educational Project
            </span>

            <h1
              className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6"
              style={{ color: "var(--color-text)" }}
            >
              UPI Payment{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Simulator
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10"
              style={{ color: "var(--color-text-secondary)" }}
            >
              A full-stack distributed systems project that replicates India's UPI
              payment infrastructure with microservices, async processing, and
              cryptographic signing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/architecture"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  View Architecture
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center mb-12"
            style={{ color: "var(--color-text)" }}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-6 transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: "var(--color-accent-light)",
                    color: "var(--color-accent)",
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                  {f.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Overview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-8"
            style={{ color: "var(--color-text)" }}
          >
            Payment Flow
          </motion.h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {["User", "PSP", "NPCI", "Payer Bank", "Payee Bank"].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    background: i === 0 ? "linear-gradient(135deg, #4f46e5, #6366f1)" : "var(--color-bg-card)",
                    color: i === 0 ? "#fff" : "var(--color-text)",
                    border: i === 0 ? "none" : "1px solid var(--color-border)",
                  }}
                >
                  {step}
                </div>
                {i < 4 && (
                  <ArrowRight size={16} style={{ color: "var(--color-text-muted)" }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default LandingPage;
