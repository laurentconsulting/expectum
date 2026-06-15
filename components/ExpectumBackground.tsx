export default function ExpectumBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[#faf7f2]" />

      <div className="expectum-background-breath absolute left-[-12%] top-[-18%] h-[520px] w-[520px] rounded-full bg-[#eadcc7]/35 blur-3xl" />

      <div className="expectum-background-breath-delayed absolute bottom-[-18%] right-[-12%] h-[560px] w-[560px] rounded-full bg-[#f1e6d8]/45 blur-3xl" />
    </div>
  );
}