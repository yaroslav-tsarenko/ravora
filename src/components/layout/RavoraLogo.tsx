/**
 * Ravora wordmark — editorial letter-spaced serif in the brand's warm colour.
 *
 * No icon, no monogram badge. A single confident wordmark inspired by the
 * mastheads of premium fashion editorial (Céline, COS, Aritzia): all caps,
 * generous letter-spacing, medium-weight serif. Sizes fluidly via the `size`
 * prop which maps to font-size (px).
 */
export function RavoraLogo({ size = 24 }: { size?: number }) {
  return (
    <span
      className="inline-block font-serif font-medium uppercase leading-none"
      style={{ fontSize: size, letterSpacing: "0.3em" }}
    >
      Ravora
    </span>
  );
}

// Legacy alias — kept so old imports don't break during the transition.
export const RavoraMark = RavoraLogo;
