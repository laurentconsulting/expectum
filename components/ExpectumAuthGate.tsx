"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type ExpectumAuthGateProps = {
  children: React.ReactNode;
};

export default function ExpectumAuthGate({ children }: ExpectumAuthGateProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/enter");
        return;
      }

      setUser(data.user);
      setChecking(false);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.push("/enter");
          return;
        }

        setUser(session.user);
        setChecking(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="mx-auto max-w-3xl text-center text-[#6d655d]">
        Mälu avanemine...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}