import { motion } from "framer-motion";

const Button = ({ children, onClick, type = "button", variant = "primary", disabled = false }) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
    style={{
      background: variant === "primary" ? "linear-gradient(135deg, #4f46e5, #6366f1)" : "transparent",
      color: variant === "primary" ? "#ffffff" : "var(--color-text-secondary)",
      border: variant === "primary" ? "none" : "1px solid var(--color-border)",
    }}
  >
    {children}
  </motion.button>
);

export default Button;
