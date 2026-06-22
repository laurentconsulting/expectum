import type { ReactNode } from "react";

type ExpectumCardProps = {
  label?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  href?: string;
  surface?: "default" | "custom";
};

export default function ExpectumCard({
  label,
  children,
  className = "",
  contentClassName = "",
  href,
  surface = "default",
}: ExpectumCardProps) {
  const surfaceClassName =
    surface === "default"
      ? "rounded-[2rem] border border-[#efe6d9] bg-white/55 px-8 py-10 text-left backdrop-blur-[1px]"
      : "";

  const cardClassName = `${surfaceClassName} ${className}`;
  const content = (
    <>
      {label && (
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[#b78a4a]">
          {label}
        </p>
      )}

      <div
        className={`whitespace-pre-line text-lg leading-loose text-[#4f4942] ${contentClassName}`}
      >
        {children}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cardClassName}>
        {content}
      </a>
    );
  }

  return (
    <div className={cardClassName}>{content}</div>
  );
}
