import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import useAuthStore from "../store/authStore";

const cards = [
  { to: "/profile", icon: "👤", title: "Profile", desc: "View your UPI profile details" },
  { to: "/balance", icon: "💰", title: "Check Balance", desc: "View your linked account balance" },
  { to: "/pay", icon: "💸", title: "Pay", desc: "Send money using UPI ID", accent: true },
  { to: "/transactions", icon: "📜", title: "Transactions", desc: "View your transaction history" },
];

function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mb-10" style={{ color: "var(--color-text-secondary)" }}>
          What would you like to do today?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(c.to)}
              className="cursor-pointer rounded-xl p-6 border transition-shadow hover:shadow-lg"
              style={{
                backgroundColor: c.accent ? undefined : "var(--color-bg-card)",
                borderColor: c.accent ? "transparent" : "var(--color-border)",
                ...(c.accent && { background: "linear-gradient(135deg, #4f46e5, #6366f1)" }),
              }}
            >
              <h2
                className="text-lg font-semibold mb-1"
                style={{ color: c.accent ? "#fff" : "var(--color-text)" }}
              >
                {c.icon} {c.title}
              </h2>
              <p
                className="text-sm"
                style={{ color: c.accent ? "rgba(255,255,255,0.85)" : "var(--color-text-secondary)" }}
              >
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

export default Dashboard;
