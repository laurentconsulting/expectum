import type { ReactNode } from "react";
import ExpectumHeader from "@/components/ExpectumHeader";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumBackground from "@/components/ExpectumBackground";

type FooterLink = {
  href: string;
  label: string;
  symbol?: "meeting" | "echo" | "theme" | "direction" | "path" | "memory" | "aim";
};

type ExpectumPageProps = {
  children: ReactNode;
  footerLinks?: FooterLink[];
  className?: string;
};

export default function ExpectumPage({
  children,
  footerLinks = [],
  className = "",
}: ExpectumPageProps) {
  return (
    <main
      className={`relative h-screen overflow-hidden text-[#4f4942] ${className}`}
    >
      <ExpectumBackground />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-6">
        <ExpectumHeader />

        <div className="min-h-0 flex-1 overflow-y-auto py-10">
          <div className="flex min-h-full">
            <div className="my-auto w-full">{children}</div>
          </div>
        </div>

        <footer className="mt-auto flex flex-col items-center justify-between gap-6 border-t border-[#eadcc7] py-8 text-xs uppercase tracking-[0.25em] text-[#8a8278] md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 transition hover:text-[#8b642f]"
              >
                {link.symbol && (
                  <ExpectumSymbol name={link.symbol} size="header" />
                )}
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <a href="/return" className="transition hover:text-[#8b642f]">
            Välju
          </a>
        </footer>
      </div>
    </main>
  );
}