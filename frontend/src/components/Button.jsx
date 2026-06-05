import { cn } from "../utils/cn.js";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand/40";
  const variants = {
    primary: "bg-brand text-white hover:brightness-110 shadow-soft",
    ghost: "bg-white text-ink hover:bg-slate-100 border border-slate-200",
    subtle: "bg-slate-100 text-ink hover:bg-slate-200"
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base"
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
