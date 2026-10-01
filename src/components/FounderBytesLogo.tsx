import React from 'react';

interface FounderBytesLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'responsive';
}

export const FounderBytesLogo: React.FC<FounderBytesLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'responsive',
}) => {
  // Color configuration matching official identity
  // Warm yellow / gold: #F5B800, Black: #111111, White: #FFFFFF
  const primaryText = variant === 'light' ? '#FFFFFF' : '#111111';
  const yellowColor = '#F5B800';
  const dividerColor = variant === 'light' ? '#444444' : '#111111';

  // Responsive dimension styles
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-14 w-auto',
    responsive: 'h-9 sm:h-10 md:h-11 w-auto',
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`} title="Founder Bytes — India's Business & Startup Magazine">
      <svg
        viewBox="0 0 460 110"
        className={`${sizeClasses} max-w-full`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Founder Bytes: Business | Startups | Innovation"
        role="img"
      >
        {/* Left Monogram: Bodoni / Didot style Serif Capital 'F' */}
        <g id="brand-monogram">
          {/* Main vertical serif stem and top/middle arms of 'F' */}
          <path
            d="M 22 28 L 22 36 L 37 36 L 37 78 L 20 78 L 20 86 L 56 86 L 56 78 L 47 78 L 47 60 L 61 60 L 61 54 L 47 54 L 47 36 L 70 36 L 71 47 L 77 47 L 76 28 Z"
            fill={primaryText}
          />
          {/* Warm Yellow Circular Dot nestled at lower right of 'F' */}
          <circle cx="68" cy="74" r="12.5" fill={yellowColor} />
        </g>

        {/* Crisp Vertical Hairline Divider Bar */}
        <line
          x1="94"
          y1="25"
          x2="94"
          y2="89"
          stroke={dividerColor}
          strokeWidth="1.75"
        />

        {/* Wordmark Right Block */}
        <g id="brand-wordmark">
          {/* Top Line: FOUNDER (Black) + BYTES (Yellow) */}
          <text
            x="110"
            y="61"
            fill={primaryText}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="43"
            letterSpacing="-0.025em"
          >
            FOUNDER
          </text>
          <text
            x="320"
            y="61"
            fill={yellowColor}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="43"
            letterSpacing="-0.025em"
          >
            BYTES
          </text>

          {/* Bottom Line: Subtitle BUSINESS | STARTUPS | INNOVATION */}
          <text
            x="112"
            y="85"
            fill={primaryText}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="500"
            fontSize="12.5"
            letterSpacing="0.22em"
          >
            BUSINESS &nbsp;|&nbsp; STARTUPS &nbsp;|&nbsp; INNOVATION
          </text>
        </g>
      </svg>
    </div>
  );
};
