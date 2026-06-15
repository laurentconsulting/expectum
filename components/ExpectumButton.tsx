import type { ReactNode } from "react";

type ExpectumButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "soft";
  disabled?: boolean;
  className?: string;
};

export default function ExpectumButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: ExpectumButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-full border px-8 py-4 text-center text-sm uppercase tracking-[0.25em] transition duration-500 disabled:opacity-50";

  const variantClass =
    variant === "primary"
      ? "border-[#c9a36a] text-[#8b642f] hover:bg-[#efe2ce]/70"
      : "border-[#eadcc7] text-[#6d655d] hover:bg-white/45";

  const classes = `${baseClass} ${variantClass} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}