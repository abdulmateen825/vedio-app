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
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
        <Input label="Email" placeholder="you@example.com" />
        <Button className="w-full">Send reset link</Button>
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
