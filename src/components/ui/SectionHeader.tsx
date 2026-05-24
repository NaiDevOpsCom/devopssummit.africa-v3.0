import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  pill?: string;
  light?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  pill,
  light,
  className = "",
}) => (
  <div className={`text-center mb-12 ${className}`}>
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className={`h-[1px] flex-1 max-w-[100px] ${light ? "bg-white/30" : "bg-primary/30"}`} />
      <h2
        className={`text-3xl md:text-5xl font-bold font-heading tracking-tight ${light ? "text-pure-white" : "text-pure-black"}`}
      >
        {title}
      </h2>
      <div className={`h-[1px] flex-1 max-w-[100px] ${light ? "bg-white/30" : "bg-primary/30"}`} />
    </div>

    {pill && (
      <div className="flex items-center justify-center mb-6 relative">
        <div
          className={`h-[2px] flex-1 ${light ? "bg-white/30" : "bg-primary/30"} hidden sm:block`}
        />

        <span className="mx-4 sm:mx-6 z-10 inline-flex items-center px-4 sm:px-6 py-1.5 rounded-full bg-primary text-pure-white text-sm font-bold uppercase tracking-wider">
          {pill}
        </span>

        <div
          className={`h-[2px] flex-1 ${light ? "bg-white/30" : "bg-primary/30"} hidden sm:block`}
        />

        {/* Small-screen fallback: show shorter lines either side */}
        <div
          className={`w-full flex items-center justify-between sm:hidden absolute left-0 right-0`}
        >
          <div className={`h-[1px] w-1/4 ${light ? "bg-white/30" : "bg-primary/30"}`} />
          <div className={`h-[1px] w-1/4 ${light ? "bg-white/30" : "bg-primary/30"}`} />
        </div>
      </div>
    )}

    {subtitle && (
      <p
        className={`text-base md:text-lg max-w-3xl mx-auto leading-relaxed ${light ? "text-white/80" : "text-pure-black/70"}`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default React.memo(SectionHeader);
