import React, { useState, useEffect } from 'react';
import { CMSAdvertisement, AdPageType } from '../types/cms';
import { ContentService } from '../services/contentService';
import { ExternalLink } from 'lucide-react';

interface AdSlotProps {
  pageType?: AdPageType | string;
  placement?: string;
  position?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  pageType,
  placement,
  position,
  className = '',
}) => {
  const [ad, setAd] = useState<CMSAdvertisement | null>(null);
  const targetPlacement = placement || position || '';

  useEffect(() => {
    let isMounted = true;

    const fetchAd = async () => {
      const activeAds = await ContentService.getAdvertisements(
        targetPlacement || undefined,
        pageType || undefined,
        false
      );
      if (!isMounted) return;

      const now = Date.now();
      const valid = activeAds.filter((a) => {
        if (!a.is_active) return false;

        // Check start date
        if (a.start_date) {
          const startTime = new Date(a.start_date).getTime();
          if (!isNaN(startTime) && startTime > now) return false;
        }

        // Check end date: If empty, treat as no expiry date
        if (a.end_date && a.end_date.trim()) {
          const endTime = new Date(a.end_date).getTime();
          if (!isNaN(endTime) && endTime < now) return false;
        }

        return true;
      });

      if (valid.length > 0) {
        setAd(valid[0]);
      } else {
        setAd(null);
      }
    };

    fetchAd();
    const unsubscribe = ContentService.subscribe(fetchAd);
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [pageType, targetPlacement]);

  // If there is no active advertisement, collapse completely!
  // Requirement: "If there is no active advertisement: collapse the slot. Do NOT leave a giant empty white area."
  if (!ad) {
    return null;
  }

  return (
    <aside
      className={`w-full my-6 flex flex-col items-center justify-center ${className}`}
      role="complementary"
      aria-label={`Advertisement: ${ad.name}`}
    >
      <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
        {/* Editorial Marker */}
        <div className="w-full flex items-center justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#DF9E00]"></span>
            <span className="font-bold text-neutral-500">ADVERTISEMENT</span>
          </div>
          <span>SPONSORED BY {(ad.advertiser || 'SPONSOR').toUpperCase()}</span>
        </div>

        {/* Ad Container */}
        <a
          href={ad.destination_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group block relative w-full overflow-hidden border border-neutral-300 bg-neutral-100 hover:border-black transition-colors"
        >
          <div className="w-full aspect-[728/90] min-h-[70px] max-h-36 flex items-center justify-center overflow-hidden bg-neutral-900">
            <img
              src={ad.image_url}
              alt={ad.image_alt || ad.name}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform"
              loading="lazy"
            />
          </div>

          {/* Sponsored Visit hover label */}
          <div className="absolute bottom-1 right-1 bg-black/85 text-white text-[9px] font-mono px-2 py-0.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Learn More</span>
            <ExternalLink className="w-2.5 h-2.5 text-[#F5B800]" />
          </div>
        </a>
      </div>
    </aside>
  );
};
