import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Input = ({ label, type = "text", value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col mb-4 relative">
      <label className="mb-1 font-semibold text-sm" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </label>
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="p-2.5 rounded-xl w-full focus:outline-none focus:ring-2 pr-10 text-sm"
        style={{
          backgroundColor: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
          focusRingColor: "var(--color-accent)",
        }}
      />
      {type === "password" && (
        <button
          type="button"
          className="absolute right-3 top-9"
          style={{ color: "var(--color-text-muted)" }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
};

export default Input;
