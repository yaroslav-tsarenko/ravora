export function AvontLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="#0072CE" />
      <path
        d="M22.5 6L12 22h7.5L17.5 34 28 18h-7.5L22.5 6Z"
        fill="#FFD600"
        stroke="#FFD600"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
