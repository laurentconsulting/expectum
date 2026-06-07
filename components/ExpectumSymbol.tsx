type ExpectumSymbolName =
  | "meeting"
  | "echo"
  | "theme"
  | "direction"
  | "path"
  | "memory"
  | "aim";

type ExpectumSymbolSize = "header" | "card" | "hero";

type ExpectumSymbolProps = {
  name: ExpectumSymbolName;
  size?: ExpectumSymbolSize;
  className?: string;
};

type ExpectumSymbolConfig = {
  symbol: string;
  ratio: number;
  balance: string;
};

const baseSizes: Record<ExpectumSymbolSize, number> = {
  header: 1,
  card: 1.9,
  hero: 4,
};

const widths: Record<ExpectumSymbolSize, string> = {
  header: "w-[1.25rem]",
  card: "w-12",
  hero: "w-20",
};

const symbolConfig: Record<ExpectumSymbolName, ExpectumSymbolConfig> = {
  meeting: {
    symbol: "○",
    ratio: 1.23,
    balance: "scale-[1.03]",
  },

  echo: {
    symbol: "◐",
    ratio: 0.84,
    balance: "scale-[0.93]",
  },

  theme: {
    symbol: "✦",
    ratio: 0.93,
    balance: "scale-[0.94]",
  },

  direction: {
    symbol: "△",
    ratio: 0.86,
    balance: "scale-[0.94]",
  },

  path: {
    symbol: "∞",
    ratio: 1,
    balance: "scale-[0.96]",
  },

  memory: {
    symbol: "□",
    ratio: 1,
    balance: "scale-[0.96]",
  },

  aim: {
    symbol: "✧",
    ratio: 0.95,
    balance: "scale-[0.94]",
  },
};

function getSymbolSize(size: ExpectumSymbolSize, ratio: number) {
  return `${baseSizes[size] * ratio}rem`;
}

export default function ExpectumSymbol({
  name,
  size = "hero",
  className = "",
}: ExpectumSymbolProps) {
  const item = symbolConfig[name];

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        leading-none
        text-[#b78a4a]
        ${widths[size]}
        ${item.balance}
        ${className}
      `}
      style={{
        fontSize: getSymbolSize(size, item.ratio),
      }}
      aria-hidden="true"
    >
      {item.symbol}
    </span>
  );
}