"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type AuthStatusProps = {
  onUserChange?: (user: User | null) => void;
};

export default function AuthStatus({ onUserChange }: AuthStatusProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
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
  }, [onUserChange]);

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "/return";
}

  if (!user) {
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
    Puhka
  </button>
);
}