"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumCard from "@/components/ExpectumCard";
import ExpectumSection from "@/components/ExpectumSection";

type SharedInsight = {
  id: string;
  question: string;
  text: string;
  created_at: string;
  approved: boolean;
};

export default function SharedInsightsAdmin() {
  const [adminKey, setAdminKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [items, setItems] = useState<SharedInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const existingKey = localStorage.getItem("expectum_admin_key") || "";

    if (existingKey) {
      setAdminKey(existingKey);
      setSavedKey(existingKey);
      loadItems(existingKey);
    }
  }, []);

  async function loadItems(key = savedKey) {
    if (!key.trim()) {
      setMessage("Sisesta admini võti.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/shared-insights", {
        headers: {
          "x-admin-key": key,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setItems([]);
        setMessage(data.error || "Jagatud Kaja ei saanud avada.");
        return;
      }

      setItems(data.insights || []);
      setSavedKey(key);
      localStorage.setItem("expectum_admin_key", key);
    } catch (error) {
      console.error(error);
      setMessage("Jagatud Kaja ei saanud avada.");
    } finally {
      setLoading(false);
    }
  }

  async function approveItem(id: string) {
    await updateItem(id, true);
  }

  async function hideItem(id: string) {
    await updateItem(id, false);
  }

  async function updateItem(id: string, approved: boolean) {
    setMessage("");

    try {
      const response = await fetch("/api/admin/shared-insights", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey,
        },
        body: JSON.stringify({
          id,
          approved,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Kaja olekut ei saanud muuta.");
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, approved } : item
        )
      );

      setMessage(approved ? "Kaja kinnitati." : "Kaja peideti.");
    } catch (error) {
      console.error(error);
      setMessage("Kaja olekut ei saanud muuta.");
    }
  }

  async function removeItem(id: string) {
    const confirmed = window.confirm("Kas soovid selle Kaja eemaldada?");

    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch("/api/admin/shared-insights", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey,
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Kaja ei saanud eemaldada.");
        return;
      }

      setItems((current) => current.filter((item) => item.id !== id));
      setMessage("Kaja eemaldati.");
    } catch (error) {
      console.error(error);
      setMessage("Kaja ei saanud eemaldada.");
    }
  }

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          {
            href: "/shared-insights",
            label: "Jagatud Kaja",
            symbol: "echo",
          },
          {
            href: "/settings",
            label: "Mälu",
            symbol: "memory",
          },
          {
            href: "/expectum",
            label: "Expectum",
            symbol: "aim",
          },
        ]}
      >
        <ExpectumSection
          symbol="echo"
          label="Jagatud Kaja"
          title="Kaja kinnitamine"
          intro="Siin saab vaadata Kaja, mille osaline on lubanud ühisesse ruumi liikuda."
        >
          <ExpectumCard label="Admini võti">
            <input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              className="mb-6 w-full rounded-2xl border border-[#d7b985] bg-white/60 p-4 outline-none transition focus:border-[#b78a4a] focus:bg-white"
              placeholder="Sisesta admini võti"
            />

            <button
              type="button"
              onClick={() => loadItems(adminKey)}
              disabled={loading}
              className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce] disabled:opacity-50"
            >
              {loading ? "Avan..." : "Ava kinnitamine"}
            </button>
          </ExpectumCard>

          {message && <p className="mt-8 text-[#8b642f]">{message}</p>}

          <div className="mt-10 space-y-8">
            {items.length === 0 && !loading ? (
              <ExpectumCard>
                Ühtegi Kaja ei ole kinnitamiseks nähtaval.
              </ExpectumCard>
            ) : (
              items.map((item) => (
                <ExpectumCard
                  key={item.id}
                  label={item.approved ? "Kinnitatud Kaja" : "Ootel Kaja"}
                >
                  <p className="mb-4 text-sm text-[#8a8278]">
                    {new Date(item.created_at).toLocaleDateString("et-EE")}
                  </p>

                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Küsimus
                  </p>

                  <p className="mb-8">{item.question}</p>

                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Kaja
                  </p>

                  <p className="mb-8 whitespace-pre-line text-xl leading-relaxed">
                    {item.text}
                  </p>

                  <div className="flex flex-col gap-4 md:flex-row">
                    {!item.approved ? (
                      <button
                        type="button"
                        onClick={() => approveItem(item.id)}
                        className="rounded-full border border-[#c9a36a] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
                      >
                        Kinnita Kaja
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => hideItem(item.id)}
                        className="rounded-full border border-[#d8d1c7] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
                      >
                        Peida Kaja
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-full border border-[#d8d1c7] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
                    >
                      Eemalda Kaja
                    </button>
                  </div>
                </ExpectumCard>
              ))
            )}
          </div>
        </ExpectumSection>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}