import Image from "next/image";

/**
 * InstitutionCard
 *
 * Props:
 *  - name          {string}   Full institution name
 *  - abbreviation  {string}   Short code / abbreviation
 *  - logoSrc       {string?}  Path to the logo image (optional)
 *  - tagline       {string?}  Optional tag shown at the top of the card
 *  - isFeatured    {boolean}  Renders with a gradient accent border (like the middle card)
 *  - isSelected    {boolean}
 *  - onSelect      {function}
 */
export function InstitutionCard({
  name,
  abbreviation,
  logoSrc,
  tagline,
  isFeatured = false,
  isSelected,
  onSelect,
}) {
  return (
    <div
      className={`institution-card-wrapper${isFeatured ? " institution-card-featured" : ""}${isSelected ? " institution-card-selected" : ""}`}
    >
      {/* Gradient accent border ring (featured or selected) */}
      {(isFeatured || isSelected) && (
        <span className="institution-card-ring" aria-hidden="true" />
      )}

      {/* Top badge */}
      {tagline && (
        <div className="institution-card-badge">
          <span>{tagline}</span>
        </div>
      )}

      <button
        type="button"
        onClick={onSelect}
        className="institution-card-btn"
        aria-pressed={isSelected}
        id={`institution-card-${abbreviation.toLowerCase()}`}
      >
        {/* Logo / background */}
        <div className="institution-card-logo-area">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={`${name} logo`}
              fill
              className="institution-card-logo-img"
              sizes="160px"
            />
          ) : (
            <span className="institution-card-abbr-placeholder">
              {abbreviation}
            </span>
          )}
          {/* Frosted overlay so the text remains legible */}
          <div className="institution-card-logo-overlay" aria-hidden="true" />
        </div>

        {/* Text */}
        <div className="institution-card-body">
          <p className="institution-card-abbr">{abbreviation}</p>
          <p className="institution-card-name">{name}</p>
        </div>

        {/* Selection indicator dot */}
        <div
          className={`institution-card-dot${isSelected ? " institution-card-dot-active" : ""}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
