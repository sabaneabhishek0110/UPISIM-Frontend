import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import PageTransition from "../components/PageTransition.jsx";
import useAuthStore from "../store/authStore.js";
import TestBanner from "../components/TestBanner.jsx";

const Login = () => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(phone, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, []);

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <TestBanner variant="login" />
          <Card>
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: "var(--color-text)" }}>
            Login to UPIGrid
          </h2>
          <form onSubmit={handleLogin}>
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            {error && (
              <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ color: "var(--color-danger)", backgroundColor: "var(--color-danger-light)" }}>
                {error}
              </p>
            )}
            <Button type="submit">Login</Button>
          </form>

          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
