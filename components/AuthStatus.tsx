"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type AuthStatusProps = {
  onUserChange?: (user: User | null) => void;
};

export default function AuthStatus({ onUserChange }: AuthStatusProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const isReturnPage = pathname === "/return";

  useEffect(() => {
    async function loadUser() {
      if (isReturnPage) {
        setSigningOut(true);
        await supabase.auth.signOut();
        setUser(null);
        onUserChange?.(null);
        setSigningOut(false);
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
    if (signingOut) return;

    setSigningOut(true);
    setUser(null);
    onUserChange?.(null);

    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/return");
      setSigningOut(false);
    }
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
      disabled={signingOut}
      className="expectum-soft-pulse inline-flex items-center gap-2 text-[#8a8278] transition-colors duration-500 hover:text-[#8b642f]"
    >
      Välju
    </button>
  );
}
