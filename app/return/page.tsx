import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

export default function ReturnRoom() {
  return (
    <ExpectumPage className="bg-[#f7f1e8]">
      <section className="mx-auto w-full max-w-3xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="meeting" size="header" />
          <span>Eemaldus</span>
        </p>

        <h1 className="mb-10 text-4xl font-light leading-tight md:text-6xl">
          Liikumine jätkub ka siis, kui sõnad peatuvad.
        </h1>

        <p className="mb-12 text-lg leading-relaxed text-[#5f574f] md:text-2xl">
          Oled alati oodatud tagasi.
        </p>

        <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-lg leading-relaxed text-[#4f4942]">
          <p>
            Mõni küsimus avaneb hiljem.
          </p>
        </div>

        <div className="mt-12 flex flex-col justify-center gap-4 md:flex-row">
          <a
            href="/attunement"
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Ava häälestus
          </a>

          <a
            href="/"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
          >
            Algusesse
          </a>
        </div>

        <p className="mt-20 text-sm text-[#8a8278]">
          Kohtumine jääb avatuks.
        </p>
      </section>
    </ExpectumPage>
  );
}