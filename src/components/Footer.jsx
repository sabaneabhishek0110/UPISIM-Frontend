import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Logo from "./Logo";

const Footer = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <footer
      className="border-t py-8 mt-auto"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Logo size={28} />
              <span className="font-bold" style={{ color: "var(--color-text)" }}>
              UPI<span style={{ color: "var(--color-accent)" }}>Grid</span>
            </span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Send money instantly to any UPI ID with bank-grade security.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3" style={{ color: "var(--color-text)" }}>
              Explore
            </h4>
            <div className="space-y-2">
              <Link to="/architecture" className="block text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
                Architecture
              </Link>
              <Link to="/about" className="block text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
                About
              </Link>
              {!isLoggedIn && (
                <Link to="/login" className="block text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
                  Login
                </Link>
              )}
            </div>
          </div>


        </div>

        <div
          className="mt-8 pt-4 border-t text-center text-xs"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          UPIGrid &mdash; Digital Payments Platform
        </div>
      </div>
    </footer>
  );
};

export default Footer;
