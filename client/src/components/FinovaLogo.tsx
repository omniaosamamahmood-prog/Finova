type FinovaLogoProps = {
  compact?: boolean;
  className?: string;
};

function FiLigature() {
  return (
    <g fill="var(--app-primary)">
      {/* F stem */}
      <rect x="0" y="0" width="12" height="64" />
      {/* F top bar */}
      <rect x="0" y="0" width="38" height="12" />
      {/* F middle bar that drives into the I */}
      <rect x="0" y="26" width="44" height="12" />
      {/* Arrow formed in the FI join, like EX in EXPONAX */}
      <polygon points="38,18 56,32 38,46" />
      {/* I stem, overlapping the arrow */}
      <rect x="50" y="0" width="12" height="64" />
    </g>
  );
}

function NovaLetters() {
  return (
    <g fill="var(--app-fg)">
      {/* N */}
      <rect x="76" y="0" width="12" height="64" />
      <rect x="110" y="0" width="12" height="64" />
      <polygon points="88,0 102,0 122,64 108,64" />

      {/* O */}
      <path
        fillRule="evenodd"
        d="M147 0c12.15 0 22 10.3 22 23v18c0 12.7-9.85 23-22 23s-22-10.3-22-23V23C125 10.3 134.85 0 147 0Zm0 13c-5.52 0-10 5.15-10 11.5v15c0 6.35 4.48 11.5 10 11.5s10-5.15 10-11.5v-15c0-6.35-4.48-11.5-10-11.5Z"
      />

      {/* V */}
      <polygon points="178,0 192,0 207,52 222,0 236,0 214,64 200,64" />

      {/* A */}
      <polygon points="216,64 229,64 241,0 254,0" />
      <polygon points="254,0 267,0 279,64 266,64" />
      <rect x="233" y="32" width="29" height="11" />
    </g>
  );
}

function FinovaLogo({ compact = false, className = "" }: FinovaLogoProps) {
  if (compact) {
    return (
      <svg
        viewBox="-2 -2 70 68"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <FiLigature />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 282 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Finova"
    >
      <title>Finova</title>
      <FiLigature />
      <NovaLetters />
    </svg>
  );
}

export default FinovaLogo;
