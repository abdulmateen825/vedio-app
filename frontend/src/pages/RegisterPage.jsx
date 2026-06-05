import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { apiClient } from "../utils/api.js";
import { useToast } from "../context/ToastContext.jsx";

const RegisterPage = () => {
  const [values, setValues] = useState({
    fullname: "",
    username: "",
    email: "",
    password: ""
  });
  const [files, setFiles] = useState({ avatar: null, coverImage: null });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const { name, files: selected } = event.target;
    setFiles((prev) => ({ ...prev, [name]: selected?.[0] || null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!files.avatar) {
      showToast("Avatar is required.", "error");
      return;
    }

    const payload = new FormData();
    payload.append("fullname", values.fullname);
    payload.append("username", values.username);
    payload.append("email", values.email);
    payload.append("password", values.password);
    payload.append("avatar", files.avatar);
    if (files.coverImage) payload.append("coverImage", files.coverImage);

    try {
      setLoading(true);
      await apiClient.post("/users/register", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      showToast("Account created successfully");
      navigate("/auth/login");
    } catch (error) {
      showToast("Registration failed. Try a different email.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">Create your account</h2>
        <p className="mt-2 text-sm text-slate-500">
          Start streaming and building your audience.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft"
      >
        <Input
          label="Full name"
          name="fullname"
          value={values.fullname}
          onChange={handleChange}
          placeholder="Alex Romero"
        />
        <Input
          label="Username"
          name="username"
          value={values.username}
          onChange={handleChange}
          placeholder="alexromero"
        />
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
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-600">
          Avatar
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-ink shadow-sm"
          />
        </label>
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-600">
          Cover image (optional)
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-ink shadow-sm"
          />
        </label>
        <Button className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-brand">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
