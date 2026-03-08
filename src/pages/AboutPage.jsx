import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const techStack = [
  { category: "Frontend", items: ["React 19", "Vite", "Zustand", "Tailwind CSS v4", "Framer Motion", "GSAP"] },
  { category: "Backend", items: ["Spring Boot 3", "Spring Security", "Spring Data JPA", "REST APIs"] },
  { category: "Database", items: ["PostgreSQL (per service)", "JPA / Hibernate"] },
  { category: "Security", items: ["JWT (HttpOnly Cookies)", "RSA Digital Signatures", "PIN Hashing (BCrypt)"] },
  { category: "Architecture", items: ["Microservices", "Outbox Pattern", "Async Processing", "Event-Driven"] },
];

const AboutPage = () => {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-16">
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
            About
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "var(--color-text)" }}>
            About This Project
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            An educational full-stack project that simulates India's Unified Payments Interface (UPI) ecosystem.
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 mb-12"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            What is UPI Simulator?
          </h2>
          <div className="space-y-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              This project replicates the real-world UPI payment architecture using four independent
              microservices &mdash; a PSP (like PhonePe/GPay), NPCI (the central switch), and two
              banks (HDFC & ICICI).
            </p>
            <p>
              Each service runs independently with its own database, communicates over REST APIs with
              digitally signed payloads, and handles failures through reversals &mdash; just like the
              real UPI system.
            </p>
            <p>
              The frontend is a modern React SPA that provides a complete payment experience: user
              registration, UPI ID lookup, payment with PIN entry, real-time status polling, balance
              checks, and full transaction history.
            </p>
          </div>
        </motion.div>

        {/* Key Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 mb-12"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            Key Concepts Demonstrated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Microservice architecture with independent databases",
              "Inter-service communication with digital signatures",
              "Async payment processing with outbox pattern",
              "Two-phase transaction flow (debit → credit → callback)",
              "Automatic reversal on partial failures",
              "Frontend polling for real-time payment status",
              "JWT authentication with HttpOnly cookies",
              "VPA (Virtual Payment Address) resolution",
            ].map((concept, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 items-start"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  ✓
                </div>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{concept}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "var(--color-text)" }}>
          Tech Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--color-text)" }}>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2 py-1 rounded-md font-medium"
                    style={{
                      backgroundColor: "var(--color-accent-light)",
                      color: "var(--color-accent)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
