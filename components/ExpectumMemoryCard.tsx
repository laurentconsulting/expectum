import type { ReactNode } from "react";

type ExpectumMemoryCardProps = {
  label?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function ExpectumMemoryCard({
  label,
  children,
  className = "",
  contentClassName = "whitespace-pre-line text-base leading-relaxed text-[#6d655d] md:text-lg",
}: ExpectumMemoryCardProps) {
  return (
    <div
      className={`rounded-[2rem] border border-[#eadcc7] bg-white/45 px-8 py-8 text-center backdrop-blur-[1px] ${className}`}
    >
      {label && (
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[#b78a4a]">
          {label}
        </p>
      )}

      <div className={contentClassName}>{children}</div>
    </div>
  );
}
