/**
 * Decorative editorial markers:
 * crop marks, rule lines, page numbers, etc.
 * All aria-hidden. Pure presentation.
 */
export function HeroCropMarks() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      {/* top-left */}
      <svg
        className="absolute top-3 left-3"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="var(--ghost)"
        strokeWidth="1"
      >
        <path d="M0 7 L8 7 M7 0 L7 8" />
      </svg>
      {/* top-right */}
      <svg
        className="absolute top-3 right-3"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="var(--ghost)"
        strokeWidth="1"
      >
        <path d="M14 7 L6 7 M7 0 L7 8" />
      </svg>
      {/* bottom-left */}
      <svg
        className="absolute bottom-3 left-3"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="var(--ghost)"
        strokeWidth="1"
      >
        <path d="M0 7 L8 7 M7 14 L7 6" />
      </svg>
      {/* bottom-right */}
      <svg
        className="absolute bottom-3 right-3"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="var(--ghost)"
        strokeWidth="1"
      >
        <path d="M14 7 L6 7 M7 14 L7 6" />
      </svg>
    </div>
  );
}

export function HeroRuleLines() {
  return (
    <>
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "20vh",
          height: "1px",
          backgroundColor: "var(--ghost)",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "80vh",
          height: "1px",
          backgroundColor: "var(--ghost)",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />
    </>
  );
}

export function HeroAcidBar() {
  return (
    <div
      className="absolute pointer-events-none z-10 hidden md:block"
      style={{
        right: "30%",
        top: "30vh",
        width: "1px",
        height: "40vh",
        backgroundColor: "var(--acid)",
        opacity: 0.8,
      }}
      aria-hidden="true"
    />
  );
}
