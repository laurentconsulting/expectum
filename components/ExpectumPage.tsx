import type { ReactNode } from "react";
import ExpectumHeader from "@/components/ExpectumHeader";
import ExpectumFooter from "@/components/ExpectumFooter";
import ExpectumBackground from "@/components/ExpectumBackground";
import type { ExpectumFooterLink } from "@/lib/expectumTypes";

type ExpectumPageProps = {
  children: ReactNode;
  footerLinks?: ExpectumFooterLink[];
  className?: string;
};

export default function ExpectumPage({
  children,
  footerLinks = [],
  className = "",
}: ExpectumPageProps) {
  return (
    <main
      className={`relative h-screen overflow-hidden px-6 text-[#4f4942] ${className}`}
    >
      <ExpectumBackground />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col">
        <ExpectumHeader />

        <div className="flex min-h-0 flex-1 items-center overflow-y-auto py-10">
          <div className="w-full">{children}</div>
        </div>

        <ExpectumFooter links={footerLinks} />
      </div>
    </main>
  );
}
