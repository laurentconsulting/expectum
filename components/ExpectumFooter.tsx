import Link from "next/link";
import AuthStatus from "@/components/AuthStatus";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import type { ExpectumFooterLink } from "@/lib/expectumTypes";

type ExpectumFooterProps = {
  links?: ExpectumFooterLink[];
};

const defaultLinks: ExpectumFooterLink[] = [
  {
    href: "/expectum",
    label: "Expectum",
    symbol: "aim",
  },
];

export default function ExpectumFooter({
  links = defaultLinks,
}: ExpectumFooterProps) {
  return (
    <footer className="py-5">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div />

        <nav className="flex flex-wrap items-center justify-center gap-8">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8a8278] transition hover:text-[#8b642f]"
            >
              {link.symbol && (
                <ExpectumSymbol name={link.symbol} size="footer" />
              )}

              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex justify-center md:justify-end">
          <div className="text-xs uppercase tracking-[0.25em]">
            <AuthStatus />
          </div>
        </div>
      </div>
    </footer>
  );
}
