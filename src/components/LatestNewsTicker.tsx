import React, { useState, useEffect } from 'react';
import { ContentService } from '../services/contentService';
import { formatISTTimeOnly } from '../utils/dateUtils';
import { Zap } from 'lucide-react';

interface LatestNewsTickerProps {
  onSelectArticle: (slug: string) => void;
}

export const LatestNewsTicker: React.FC<LatestNewsTickerProps> = ({ onSelectArticle }) => {
  const [tickerItems, setTickerItems] = useState<{ id: string; slug: string; time: string; category: string; headline: string }[]>(() => {
    const cached = ContentService.getCachedArticles();
    if (cached && cached.length > 0) {
      return cached.slice(0, 12).map((art) => ({
        id: art.id,
        slug: art.slug,
        time: formatISTTimeOnly(art.published_at),
        category: art.category_name,
        headline: art.title,
      }));
    }
    return [];
  });

  useEffect(() => {
    const loadTickerStories = async () => {
      try {
        const articles = await ContentService.getArticles({ status: 'published', limit: 12 });
        if (articles.length > 0) {
          setTickerItems(
            articles.map((art) => ({
              id: art.id,
              slug: art.slug,
              time: formatISTTimeOnly(art.published_at),
              category: art.category_name,
              headline: art.title,
            }))
          );
        }
      } catch (err) {
        // Fallback to cached items if network fails
        const cached = ContentService.getCachedArticles();
        if (cached && cached.length > 0) {
          setTickerItems(
            cached.slice(0, 12).map((art) => ({
              id: art.id,
              slug: art.slug,
              time: formatISTTimeOnly(art.published_at),
              category: art.category_name,
              headline: art.title,
            }))
          );
        }
      }
    };

    loadTickerStories();
    const unsubscribe = ContentService.subscribe(loadTickerStories);
    return () => unsubscribe();
  }, []);

  if (tickerItems.length === 0) {
    return null;
  }

  // Duplicate items internally to ensure an uninterrupted, seamless infinite loop
  const repeatedItems = [...tickerItems, ...tickerItems];

  return (
    <div
      className="w-full bg-[#111111] text-white border-b border-neutral-800 flex items-stretch overflow-hidden select-none"
      role="region"
      aria-label="Latest News Ticker"
    >
      {/* Static Left Badge - Stays locked on left */}
      <div className="z-20 bg-[#111111] border-r border-neutral-800 px-3 sm:px-4 py-2 flex items-center gap-1.5 shrink-0 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#F5B800] animate-ping"></span>
        <span className="text-[11px] font-mono font-black tracking-wider uppercase text-[#F5B800] flex items-center gap-1">
          <Zap className="w-3 h-3 fill-current hidden sm:inline" />
          <span>LATEST</span>
        </span>
      </div>

      {/* Infinite Automatic Marquee Stream */}
      <div className="flex-1 overflow-hidden relative py-2 flex items-center">
        {/* Soft edge fade masks */}
        <div className="absolute left-0 inset-y-0 w-6 bg-gradient-to-r from-[#111111] to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#111111] to-transparent pointer-events-none z-10"></div>

        {/* Ticker Track with pure CSS infinite loop */}
        <div className="animate-fb-ticker flex items-center">
          {repeatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => onSelectArticle(item.slug)}
              className="inline-flex items-center gap-2.5 px-4 cursor-pointer hover:text-[#F5B800] transition-colors shrink-0 group text-xs text-neutral-300"
            >
              <span className="font-mono text-[10px] text-neutral-400 group-hover:text-white tabular-nums font-semibold">
                {item.time}
              </span>
              <span className="text-neutral-600">·</span>
              <span className="font-bold text-[10px] tracking-wider uppercase text-[#F5B800]">
                {item.category}
              </span>
              <span className="text-neutral-200 group-hover:text-[#F5B800] group-hover:underline font-medium">
                {item.headline}
              </span>
              <span className="text-neutral-600 pl-3">/</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
