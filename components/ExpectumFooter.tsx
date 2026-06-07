import Link from "next/link";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import type { ExpectumFooterLink } from "@/lib/expectumTypes";

type ExpectumFooterProps = {
  links?: ExpectumFooterLink[];
};

const defaultLinks: ExpectumFooterLink[] = [
  {
    href: "/expectum",
    label: "Expectum?",
    symbol: "aim",
  },
];

export default function ExpectumFooter({
  links = defaultLinks,
}: ExpectumFooterProps) {
  return (
    <footer className="py-5">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8">
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8a8278] transition hover:text-[#8b642f]"
          >
            {link.symbol && (
              <ExpectumSymbol name={link.symbol} size="header" />
            )}

            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}