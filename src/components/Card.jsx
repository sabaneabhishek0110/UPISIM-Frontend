import { motion } from "framer-motion";

const Card = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="shadow-xl rounded-2xl p-8 w-full max-w-md mx-auto mt-12"
    style={{
      backgroundColor: "var(--color-bg-card)",
      border: "1px solid var(--color-border)",
    }}
  >
    {children}
  </motion.div>
);

export default Card;
