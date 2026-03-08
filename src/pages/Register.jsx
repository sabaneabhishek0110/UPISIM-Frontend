import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import PageTransition from "../components/PageTransition.jsx";
import useAuthStore from "../store/authStore.js";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    if (pwd.length < 8 || pwd.length > 16) return "Password must be between 8-16 characters";
    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/.test(pwd))
      return "Password must include at least 1 number and 1 special character (!@#$%^&*)";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) { setError("Passwords do not match!"); return; }
      const passError = validatePassword(password);
      if (passError) { setError(passError); return; }
      setError("");
      await register(phone, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card>
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: "var(--color-text)" }}>
            Register for UPIGrid
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            <p className="text-xs -mt-2 mb-2" style={{ color: "var(--color-text-muted)" }}>
              (8-16 characters, at least 1 number & 1 special character)
            </p>
            <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
            {error && (
              <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ color: "var(--color-danger)", backgroundColor: "var(--color-danger-light)" }}>
                {error}
              </p>
            )}
            <Button type="submit">Register</Button>
          </form>
          <p className="mt-4 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Already have an account?{" "}
            <Link className="font-semibold" style={{ color: "var(--color-accent)" }} to="/login">Login</Link>
          </p>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Register;
