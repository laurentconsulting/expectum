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
      className={`rounded-[2rem] border border-[#efe6d9] bg-white/55 px-8 py-10 text-left backdrop-blur-[1px] ${className}`}
    >
      {label && (
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[#b78a4a]">
          {label}
        </p>
      )}

      <div className="whitespace-pre-line text-lg leading-loose text-[#4f4942]">
        {children}
      </div>
    </div>
  );
}