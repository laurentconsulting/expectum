import type { ReactNode } from "react";
import ExpectumHeader from "@/components/ExpectumHeader";
import ExpectumFooter from "@/components/ExpectumFooter";
import type { ExpectumFooterLink } from "@/lib/expectumTypes";

type ExpectumPageProps = {
  children: ReactNode;
  className?: string;
  footerLinks?: ExpectumFooterLink[];
};

export default function ExpectumPage({
  children,
  className = "",
  footerLinks,
}: ExpectumPageProps) {
  return (
    <main
      className={`h-screen overflow-hidden bg-[#f8f3eb] text-[#2d2a26] ${className}`}
    >
      <div className="flex h-full flex-col px-6">
        <ExpectumHeader />

        <div className="min-h-0 flex-1 overflow-y-auto py-10">
          {children}
        </div>

        <ExpectumFooter links={footerLinks} />
      </div>
    </main>
  );
}