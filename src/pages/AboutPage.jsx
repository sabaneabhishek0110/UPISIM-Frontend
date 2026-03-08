import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

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
            About UPIGrid
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            A fast, secure, and reliable way to send and receive money using UPI &mdash; built on a real microservices backbone.
          </p>
        </motion.div>

        {/* What is UPIGrid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 mb-8"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            What is UPIGrid?
          </h2>
          <div className="space-y-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              UPIGrid is a digital payments platform built on India's Unified Payments Interface (UPI).
              Send money instantly to any UPI ID, check your balance, and track every transaction &mdash;
              all from a single app.
            </p>
            <p>
              Payments on UPIGrid are processed through a distributed network of services: your PSP app
              communicates with NPCI (the central payments switch), which in turn coordinates with your
              bank and the recipient's bank to complete the transfer in seconds.
            </p>
            <p>
              Every request is cryptographically signed end-to-end, your PIN never leaves your device in
              plain text, and failed transactions are automatically reversed so your money is always safe.
            </p>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 mb-8"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
            How a Payment Works
          </h2>
          <div className="space-y-5">
            {[
              { step: "1", title: "You enter the UPI ID & amount", desc: "UPIGrid looks up the recipient's UPI address and confirms their name before you proceed." },
              { step: "2", title: "You authorise with your PIN", desc: "Your 4-digit UPI PIN is hashed on-device and sent securely — it is never stored or transmitted in plain text." },
              { step: "3", title: "NPCI orchestrates the transfer", desc: "The central switch sends a debit request to your bank. Once your bank confirms the debit, NPCI sends a credit request to the recipient's bank." },
              { step: "4", title: "Funds arrive instantly", desc: "The recipient's bank credits their account and NPCI sends a final confirmation back to UPIGrid — your transaction is complete." },
              { step: "5", title: "Automatic protection", desc: "If any step fails, UPIGrid automatically initiates a reversal so no money is lost in transit." },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-4 items-start"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  {step}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-text)" }}>{title}</p>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What you can do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            What You Can Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Send money to any UPI ID instantly",
              "Check your account balance in real time",
              "View detailed transaction history",
              "Know exactly where a payment stands",
              "Your UPI ID is tied to your phone number",
              "PIN-protected — only you can authorise payments",
              "Instant reversal if a payment fails mid-way",
              "Supports multiple banks (HDFC & ICICI)",
            ].map((feature, i) => (
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
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
