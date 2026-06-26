/**
 * Brand logo for MisaElectro (display) — domain reads as misaelectro.ro in SEO metadata.
 * Two-color refined wordmark + glyph: indigo gradient base with a warm orange bolt.
 */
export function MisaElectroMark({ size = 28 }: { size?: number }) {
  const id = `misaelectro-logo-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3A6F" />
          <stop offset="55%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id={`${id}-bolt`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${id}-bg)`} />
      <path
        d="M23.5 5.5L11 22.4c-0.6 0.8 0 1.9 1 1.9h7.3l-2.5 10.6c-0.3 1.3 1.3 2.1 2.1 1.1L30.5 18.2c0.6-0.8 0-1.9-1-1.9h-7.1L24 6.8c0.3-1.3-1.3-2.1-2.1-1.1L23.5 5.5z"
        fill={`url(#${id}-bolt)`}
      />
    </svg>
  );
}

export function MisaElectroLogo({ size = 28 }: { size?: number }) {
  return <MisaElectroMark size={size} />;
}
