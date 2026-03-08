import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";

const ProfileCard = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <p style={{ color: "var(--color-text-muted)" }}>Loading profile...</p>;
  }

  if (!user) {
    return <p style={{ color: "var(--color-danger)" }}>User not logged in</p>;
  }

  const fields = [
    { label: "Name", value: user.name },
    { label: "Phone", value: user.phone },
    { label: "UPI ID", value: user.vpa },
    { label: "Bank", value: user.bank },
    { label: "Account", value: user.accountNumber || "-" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 w-full max-w-md shadow-lg"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
        >
          {user.name?.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>{user.name}</h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{user.vpa}</p>
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex justify-between items-center py-2 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{f.label}</span>
            <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{f.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileCard;
