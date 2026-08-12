import React from "react";

// Text-based SVN MAKİNA logo. `variant`: "light" (for red/dark bg) or "dark".
const Logo = ({ variant = "dark", className = "" }) => {
  const isLight = variant === "light";
  const svnColor = isLight ? "text-white" : "text-brand";
  const makinaColor = isLight ? "text-white" : "text-neutral-900";
  return (
    <div className={`flex items-center leading-none select-none ${className}`}>
      <div className="flex items-baseline gap-1">
        <span className={`font-display font-extrabold text-2xl md:text-[26px] tracking-tight italic ${svnColor}`}>
          SVN
        </span>
        <span className={`font-display font-extrabold text-2xl md:text-[26px] tracking-tight ${makinaColor}`}>
          MAKİNA
        </span>
      </div>
    </div>
  );
};

export default Logo;
