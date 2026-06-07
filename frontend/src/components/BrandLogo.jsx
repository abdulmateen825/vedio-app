import { Link } from "react-router-dom";
import { cn } from "../utils/cn.js";

const BrandMark = ({ className }) => (
  <span
    className={cn(
      "grid h-10 w-10 place-items-center rounded-xl bg-brand text-white shadow-lift",
      className
    )}
  >
    <span className="ml-0.5 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-white" />
  </span>
);

const BrandLogo = ({ to = "/", className, textClassName }) => {
  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandMark />
      <span className={cn("font-display text-xl font-semibold text-ink", textClassName)}>
        CineNest
      </span>
    </span>
  );

  if (!to) return content;

  return (
    <Link to={to} aria-label="CineNest home">
      {content}
    </Link>
  );
};

export default BrandLogo;
