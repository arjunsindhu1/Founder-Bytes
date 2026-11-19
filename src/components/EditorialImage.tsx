import React, { useState, useEffect } from 'react';

interface EditorialImageProps {
  src?: string | null;
  alt: string;
  category?: string;
  title?: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  category = 'FOUNDER BYTES',
  title,
  className = '',
  containerClassName = '',
  aspectRatioClass = 'aspect-[16/10]',
  loading = 'lazy',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset state if src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Clean & normalize source URL
  const normalizedSrc = React.useMemo(() => {
    if (!src || typeof src !== 'string' || src.trim() === '') return null;
    const trimmed = src.trim();
    // If it's a relative path, ensure it starts with /
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    }
    return trimmed;
  }, [src]);

  const showFallback = hasError || !normalizedSrc;

  return (
    <div
      className={`relative w-full ${aspectRatioClass} overflow-hidden bg-neutral-900 ${containerClassName}`}
    >
      {!showFallback ? (
        <>
          {/* Subtle loading placeholder background */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
              <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                {category}
              </span>
            </div>
          )}

          <img
            src={normalizedSrc!}
            alt={alt || title || 'Founder Bytes Editorial'}
            loading={priority ? 'eager' : loading}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
          />
        </>
      ) : (
        /* Editorial Founder Bytes Branded Fallback Placeholder */
        <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white select-none border border-neutral-800">
          {/* Top kicker */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider text-[#F5B800]">
              <span className="w-1.5 h-1.5 bg-[#F5B800] rounded-none"></span>
              <span>{category}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block px-1.5 py-0.5 bg-[#F5B800] text-black font-black text-[9px] font-mono tracking-wider uppercase">
                FB
              </span>
            </div>
          </div>

          {/* Middle: Brand mark & Optional title */}
          <div className="my-auto py-2">
            <div className="font-serif font-extrabold text-sm sm:text-base text-neutral-100 line-clamp-2 leading-snug">
              {title || alt || 'Founder Bytes Intelligence'}
            </div>
          </div>

          {/* Bottom attribution */}
          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-widest border-t border-neutral-800/80 pt-2">
            <span>FOUNDER BYTES</span>
            <span className="text-neutral-300 font-semibold">NEWS BUREAU</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorialImage;
