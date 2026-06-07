import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

const ForgotPasswordPage = () => {
  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">Reset password</h2>
        <p className="mt-2 text-sm text-slate-500">
          We will send a reset link to your email.
        </p>
      </div>
      <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
        <Input label="Email" placeholder="you@example.com" disabled />
        <Button className="w-full" disabled>
          Reset endpoint unavailable
        </Button>
        <p className="text-xs text-slate-500">
          Password reset needs a backend email/reset-token endpoint before this
          form can be enabled.
        </p>
      </div>
      <p className="text-sm text-slate-500">
        Remember your password?{" "}
        <Link to="/auth/login" className="text-brand">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
