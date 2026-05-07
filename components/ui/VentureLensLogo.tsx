interface VentureLensLogoProps {
  /** Size of the icon in px (square). Default: 36 */
  size?: number
  /** Show the wordmark next to the icon. Default: true */
  showText?: boolean
  className?: string
}

/**
 * VentureLens brand logo.
 * Inline SVG — transparent background, works on any dark surface.
 */
export function VentureLensLogo({ size = 36, showText = true, className = "" }: VentureLensLogoProps) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Magnifying glass ring */}
        <circle cx="17" cy="17" r="11" stroke="#ffb000" strokeWidth="3.2" fill="none" />
        {/* Handle */}
        <line x1="25" y1="25" x2="35" y2="35" stroke="#ffb000" strokeWidth="3.5" strokeLinecap="round" />
        {/* Trend chart line inside lens */}
        <polyline
          points="9,20 13,15 17,18 21,10 25,13"
          stroke="#315cff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Arrow tip (growth) */}
        <polyline
          points="21,10 25,8 27,12"
          stroke="#00d47e"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span className="text-lg font-black tracking-tight whitespace-nowrap leading-none">
          <span className="text-btn">Venture</span>
          <span className="text-accent-yellow">Lens</span>
        </span>
      )}
    </span>
  )
}
