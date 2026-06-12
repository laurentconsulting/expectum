import type { ComponentProps, ReactNode } from "react";
import ExpectumSymbol from "@/components/ExpectumSymbol";

type ExpectumSymbolName = ComponentProps<typeof ExpectumSymbol>["name"];

type ExpectumSectionProps = {
  symbol?: ExpectumSymbolName;
  label?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
};

export default function ExpectumSection({
  symbol,
  label,
  title,
  intro,
  children,
  className = "",
}: ExpectumSectionProps) {
  return (
    <section className={`mx-auto max-w-4xl text-center ${className}`}>
      {label && (
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          {symbol && <ExpectumSymbol name={symbol} size="header" />}
          <span>{label}</span>
        </p>
      )}

      <h1 className="mb-6 text-4xl font-light md:text-6xl">
        {title}
      </h1>

      {intro && (
        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          {intro}
        </p>
      )}

      {children}
    </section>
  );
}