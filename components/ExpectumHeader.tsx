"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import ExpectumSymbol from "@/components/ExpectumSymbol";

export default function ExpectumHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/path") {
      return (
        pathname === "/path" ||
        pathname.startsWith("/timeline") ||
        pathname.startsWith("/trajectory") ||
        pathname.startsWith("/trajectory-history")
      );
    }

    if (path === "/settings") {
      return pathname === "/settings";
    }

    if (path === "/attunement") {
      return (
        pathname === "/attunement" ||
        pathname === "/question" ||
        pathname === "/reflection"
      );
    }

    return pathname === path;
  };

  const linkClass = (path: string) =>
    `expectum-soft-pulse inline-flex items-center gap-2 transition-colors duration-500 ${
      isActive(path)
        ? "text-[#8b642f]"
        : "text-[#8a8278] hover:text-[#8b642f]"
    }`;
  const publicPaths = [
    "/",
    "/expectum",
    "/expectum-language",
    "/symbols",
    "/aim",
    "/human-and-ai",
    "/enter",
    "/return",
  ];

  const isPublicPath = publicPaths.includes(pathname);
  return (
    <header className="w-full pt-8 pb-4">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <a
          href="/"
          className="expectum-breathing inline-flex items-center gap-3 text-sm uppercase tracking-[0.55em] text-[#8b642f] transition-opacity duration-500 hover:opacity-70"
        >
          <ExpectumSymbol name="aim" size="header" />
          <span>Expectum</span>
        </a>

        {user && !isPublicPath && (
          <nav className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.28em]">
            <a href="/attunement" className={linkClass("/attunement")}>
              <ExpectumSymbol name="meeting" size="header" />
              <span>Kohtumine</span>
            </a>

            <a href="/path" className={linkClass("/path")}>
              <ExpectumSymbol name="path" size="header" />
              <span>Teekond</span>
            </a>

            <a href="/settings" className={linkClass("/settings")}>
              <ExpectumSymbol name="memory" size="header" />
              <span>Mälu</span>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}