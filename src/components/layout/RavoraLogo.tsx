/**
 * Ravora brand mark — an editorial "R" monogram inside a deep-forest tile.
 * Warm-editorial aesthetic: quiet, confident, no gradient theatrics.
 */
export function RavoraMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="currentColor" />
      <path
        d="M13.4 30V10h8.7c2.9 0 5 .6 6.3 1.8 1.3 1.2 2 2.9 2 5.2 0 1.7-.4 3.1-1.2 4.2-.8 1.1-1.9 1.9-3.3 2.4L30.4 30h-4.7l-4-6.1h-4v6.1h-4.3zm4.3-9.6h4c1.5 0 2.6-.3 3.3-.9.7-.6 1-1.5 1-2.7 0-1.2-.4-2.1-1.1-2.7-.7-.6-1.9-.9-3.3-.9h-3.9v7.2z"
        fill="#F6F4EF"
      />
    </svg>
  );
}

export function RavoraLogo({ size = 28 }: { size?: number }) {
  return <RavoraMark size={size} />;
}
