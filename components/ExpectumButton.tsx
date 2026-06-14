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
    "rounded-full border px-8 py-4 text-sm uppercase tracking-[0.25em] transition disabled:opacity-50";

  const variantClass =
    variant === "primary"
      ? "border-[#c9a36a] text-[#8b642f] hover:bg-[#efe2ce]"
      : "border-[#d8d1c7] text-[#6d655d] hover:bg-[#f1ebe3]";

  const classes = `${baseClass} ${variantClass} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}