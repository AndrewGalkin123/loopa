/** Loopa logo: a magnifying glass ("lupa"). Size comes from the .brand-mark CSS. */
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <circle cx="10" cy="10" r="6.5" />
        <path d="M15 15l6 6" />
      </svg>
    </span>
  );
}
