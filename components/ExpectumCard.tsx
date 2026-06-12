import type { ReactNode } from "react";

type ExpectumCardProps = {
  label?: string;
  children: ReactNode;
  className?: string;
};

export default function ExpectumCard({
  label,
  children,
  className = "",
}: ExpectumCardProps) {
  return (
    <div
      className={`rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left ${className}`}
    >
      {label && (
        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
          {label}
        </p>
      )}

      <div className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
        {children}
      </div>
    </div>
  );
}