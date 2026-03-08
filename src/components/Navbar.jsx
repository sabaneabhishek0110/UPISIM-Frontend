import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import useThemeStore from "../store/themeStore";
import useAuthStore from "../store/authStore";
import Logo from "./Logo";

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { isLoggedIn, user, logoutUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const navLinks = isLoggedIn
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/transactions", label: "Transactions" },
        { to: "/profile", label: "Profile" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/architecture", label: "Architecture" },
        { to: "/about", label: "About" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: theme === "dark" ? "rgba(11,17,32,0.85)" : "rgba(248,250,252,0.85)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-bold text-lg" style={{ color: "var(--color-text)" }}>
              UPI<span style={{ color: "var(--color-accent)" }}>Grid</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive(link.to) ? "var(--color-accent)" : "var(--color-text-secondary)",
                  backgroundColor: isActive(link.to) ? "var(--color-accent-light)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-accent-light)",
              }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {isLoggedIn && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: "var(--color-danger)",
                  backgroundColor: "var(--color-danger-light)",
                }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium"
                  style={{
                    color: isActive(link.to) ? "var(--color-accent)" : "var(--color-text-secondary)",
                    backgroundColor: isActive(link.to) ? "var(--color-accent-light)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium"
                  style={{ color: "var(--color-danger)" }}
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
