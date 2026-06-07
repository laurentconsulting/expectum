import ExpectumPage from "@/components/ExpectumPage";

export default function Home() {
  return (
    <ExpectumPage>
      <section className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center text-center">
        <h1 className="mb-8 text-5xl font-light leading-tight md:text-7xl">
          Sa ei pea siin kiirustama.
        </h1>

        <p className="mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-[#5f574f] md:text-2xl">
          Mõni küsimus kujuneb alles siis,
          kui talle antakse aega.
        </p>

        <div className="flex flex-col flex-wrap justify-center gap-4 md:flex-row">
          <a
            href="/attunement"
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-center text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Häälestu kohtumiseks
          </a>

        </div>

        <p className="mt-20 text-sm text-[#8a8278]">
          Alustada võib sellest, mis Sind puudutab.
        </p>
      </section>
    </ExpectumPage>
  );
}