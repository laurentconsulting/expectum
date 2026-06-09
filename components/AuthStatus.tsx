"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type AuthStatusProps = {
  onUserChange?: (user: User | null) => void;
};

export default function AuthStatus({ onUserChange }: AuthStatusProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const isReturnPage = pathname === "/return";

  useEffect(() => {
    async function loadUser() {
      if (isReturnPage) {
        await supabase.auth.signOut();
        setUser(null);
        onUserChange?.(null);
        return;
      }

      const { data } = await supabase.auth.getUser();

      setUser(data.user);
      onUserChange?.(data.user);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;

        setUser(currentUser);
        onUserChange?.(currentUser);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [isReturnPage, onUserChange]);

  async function signOut() {
    setUser(null);
    onUserChange?.(null);

    await supabase.auth.signOut();

    window.location.replace("/return");
  }

  if (!user || isReturnPage) {
    return (
      <a
        href="/enter"
        className="expectum-soft-pulse inline-flex items-center gap-2 text-[#8a8278] transition-colors duration-500 hover:text-[#8b642f]"
      >
        <span>Ava kohtumine</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="expectum-soft-pulse inline-flex items-center gap-2 text-[#8a8278] transition-colors duration-500 hover:text-[#8b642f]"
    >
      Välju
    </button>
  );
}