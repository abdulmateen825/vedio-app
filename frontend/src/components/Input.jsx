import { cn } from "../utils/cn.js";

const Input = ({ label, className, ...props }) => {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-600">
      {label}
      <input
        className={cn(
          "h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20",
          className
        )}
        {...props}
      />
    </label>
  );
};

export default Input;
