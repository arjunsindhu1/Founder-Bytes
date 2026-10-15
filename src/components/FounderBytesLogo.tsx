import React from 'react';

interface FounderBytesLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'responsive';
}

/**
 * Official Founder Bytes Media Logo
 * Aspect ratio 2172 x 724 (~3:1)
 * Used across the entire site for brand identity, headers, modals, and footer.
 */
export const FounderBytesLogo: React.FC<FounderBytesLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'responsive',
}) => {
  // Height classes preserving the official ~3:1 aspect ratio
  const sizeClasses = {
    sm: 'h-7 sm:h-8 w-auto',
    md: 'h-9 sm:h-10 w-auto',
    lg: 'h-12 sm:h-14 md:h-16 lg:h-20 w-auto',
    responsive: 'h-8 sm:h-10 md:h-12 w-auto',
  }[size];

  // For dark backgrounds (such as the footer), use the white-text variant
  // For standard light backgrounds (header masthead, modals), use the transparent official logo
  const logoSrc = variant === 'light'
    ? '/founder-bytes-logo-white.png'
    : '/founder-bytes-logo-transparent.png';

  const originalFallback = '/Founder Bytes Media Logo.png';

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      title="Founder Bytes — India's Business & Startup Magazine"
    >
      <img
        src={logoSrc}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== originalFallback) {
            target.src = originalFallback;
          }
        }}
        alt="Founder Bytes — Business | Startups | Innovation"
        className={`${sizeClasses} object-contain transition-opacity duration-200`}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </div>
  );
};
