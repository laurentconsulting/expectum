"use client";

import { useState } from "react";

type SharedInsight = {
  id: string;
  question: string;
  text: string;
  created_at: string;
  approved: boolean;
};

export default function AdminSharedInsights() {
  const [adminKey, setAdminKey] = useState("");
  const [insights, setInsights] = useState<SharedInsight[]>([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  async function loadInsights() {
    const response = await fetch("/api/admin/shared-insights", {
      headers: {
        "x-admin-key": adminKey,
      },
    });

    if (!response.ok) {
      setMessage("Ligipääs puudub või võti on vale.");
      return;
    }

    const data = await response.json();
    setInsights(data.insights || []);
    setMessage("");
  }

  async function updateInsight(id: string, approved: boolean) {
    const response = await fetch("/api/admin/shared-insights", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ id, approved }),
    });

    if (!response.ok) {
      setMessage("Muutmist ei saanud salvestada.");
      return;
    }

    setInsights((items) =>
      items.map((item) =>
        item.id === id ? { ...item, approved } : item
      )
    );
  }

  async function deleteInsight(id: string) {
    const response = await fetch("/api/admin/shared-insights", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setMessage("Kustutamine ebaõnnestus.");
      return;
    }

    setInsights((items) => items.filter((item) => item.id !== id));
  }
const visibleInsights = insights.filter((item) => {
  if (filter === "pending") return !item.approved;
  if (filter === "approved") return item.approved;
  return true;
});
  return (
    <main className="min-h-screen bg-[#f8f3eb] text-[#2d2a26] px-6 py-16">
      <section className="max-w-5xl mx-auto">
        <p className="tracking-[0.4em] text-xs uppercase text-[#b78a4a] mb-10">
          Admin
        </p>

        <h1 className="text-4xl md:text-6xl font-light mb-10">
          Jagatud Kaja
        </h1>

        <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-6 mb-10">
          <input
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Admin võti"
            className="w-full rounded-2xl border border-[#d7b985] bg-white/60 p-4 mb-4 outline-none"
          />

          <button
            onClick={loadInsights}
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f]"
          >
            Lae äratundmised
          </button>

          {message && (
            <p className="mt-4 text-[#8b642f]">
              {message}
            </p>
          )}
        </div>

<div className="mb-8 flex flex-col md:flex-row gap-4">
  <button
    onClick={() => setFilter("pending")}
    className={`rounded-full border px-6 py-3 text-sm uppercase tracking-[0.25em] ${
      filter === "pending"
        ? "border-[#c9a36a] bg-[#efe2ce] text-[#8b642f]"
        : "border-[#d8d1c7] text-[#6d655d]"
    }`}
  >
    Ootel
  </button>

  <button
    onClick={() => setFilter("approved")}
    className={`rounded-full border px-6 py-3 text-sm uppercase tracking-[0.25em] ${
      filter === "approved"
        ? "border-[#c9a36a] bg-[#efe2ce] text-[#8b642f]"
        : "border-[#d8d1c7] text-[#6d655d]"
    }`}
  >
    Kinnitatud
  </button>

  <button
    onClick={() => setFilter("all")}
    className={`rounded-full border px-6 py-3 text-sm uppercase tracking-[0.25em] ${
      filter === "all"
        ? "border-[#c9a36a] bg-[#efe2ce] text-[#8b642f]"
        : "border-[#d8d1c7] text-[#6d655d]"
    }`}
  >
    Kõik
  </button>
</div>

<div className="space-y-8">

{visibleInsights.map((item) => (
                <div
              key={item.id}
              className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
            >
              <p className="text-sm text-[#8a8278] mb-6">
                {new Date(item.created_at).toLocaleDateString("et-EE")} ·{" "}
                {item.approved ? "Kinnitatud" : "Ootel"}
              </p>

              <p className="text-xs uppercase tracking-[0.25em] text-[#b78a4a] mb-3">
                Küsimus
              </p>

              <p className="text-lg leading-relaxed mb-8">
                {item.question}
              </p>

              <p className="text-xs uppercase tracking-[0.25em] text-[#b78a4a] mb-3">
                Äratundmine
              </p>

              <p className="text-xl leading-relaxed whitespace-pre-line mb-8">
                {item.text}
              </p>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => updateInsight(item.id, true)}
                  className="rounded-full border border-[#c9a36a] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#8b642f]"
                >
                  Kinnita
                </button>

                <button
                  onClick={() => updateInsight(item.id, false)}
                  className="rounded-full border border-[#d8d1c7] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#6d655d]"
                >
                  Peida
                </button>

                <button
                  onClick={() => deleteInsight(item.id)}
                  className="rounded-full border border-[#d8d1c7] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#6d655d]"
                >
                  Kustuta
                </button>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/settings"
          className="inline-block mt-12 rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f]"
        >
          Tagasi mällu
        </a>
      </section>
    </main>
  );
}