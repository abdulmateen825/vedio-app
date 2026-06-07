import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { getApiErrorMessage } from "../utils/api.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.email || !values.password) {
      showToast("Email and password are required.", "error");
      return;
    }

    try {
      setLoading(true);
      await login(values);
      showToast("Welcome back!");
      navigate("/home");
    } catch (error) {
      showToast(getApiErrorMessage(error, "Login failed."), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage your channel.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft"
      >
        <Input
          label="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <div className="flex items-center justify-between text-sm text-slate-500">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-slate-300" />
            Remember me
          </label>
          <Link to="/auth/forgot" className="text-brand">
            Forgot password?
          </Link>
        </div>
        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="text-sm text-slate-500">
        New here?{" "}
        <Link to="/auth/register" className="text-brand">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
