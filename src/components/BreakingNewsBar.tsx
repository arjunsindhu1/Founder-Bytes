import React, { useState, useEffect } from 'react';
import { ContentService } from '../services/contentService';
import { CMSBreakingNews } from '../types/cms';
import { ChevronRight, ChevronLeft, Zap } from 'lucide-react';

interface BreakingNewsBarProps {
  onSelectArticle: (slug: string) => void;
}

export const BreakingNewsBar: React.FC<BreakingNewsBarProps> = ({ onSelectArticle }) => {
  const [activeItems, setActiveItems] = useState<CMSBreakingNews[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchBreaking = async () => {
    const items = await ContentService.getBreakingNews();
    const now = new Date().toISOString();
    const active = items
      .filter((i) => {
        if (!i.is_active) return false;
        if (i.start_date && i.start_date > now) return false;
        if (i.end_date && i.end_date < now) return false;
        return true;
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    setActiveItems(active);
    if (currentIndex >= active.length) {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    fetchBreaking();
    const unsubscribe = ContentService.subscribe(fetchBreaking);
    return () => unsubscribe();
  }, []);

  // Automatic rotation if multiple breaking stories exist
  useEffect(() => {
    if (activeItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeItems.length]);

  if (activeItems.length === 0) {
    return null;
  }

  const currentStory = activeItems[currentIndex] || activeItems[0];

  return (
    <aside
      className="w-full bg-[#FAFAFA] border-b border-neutral-300 py-2 px-4 sm:px-6 lg:px-8 transition-colors select-none"
      aria-label="Breaking News Alert"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Breaking News Label */}
          <div className="inline-flex items-center gap-1.5 bg-red-600 text-white font-mono font-black text-[10px] tracking-wider uppercase px-2 py-0.5 shrink-0 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>BREAKING</span>
          </div>

          {/* Headline Link */}
          <div
            onClick={() => onSelectArticle(currentStory.link)}
            className="font-bold text-neutral-900 hover:text-red-700 hover:underline cursor-pointer truncate transition-colors font-serif text-sm sm:text-base flex-1"
          >
            {currentStory.headline}
          </div>
        </div>

        {/* Story Rotation Controls & Action */}
        <div className="flex items-center gap-3 shrink-0">
          {activeItems.length > 1 && (
            <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-400">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length)}
                className="p-1 hover:text-black cursor-pointer"
                title="Previous Breaking Item"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-neutral-700 font-bold tabular-nums">
                {currentIndex + 1}/{activeItems.length}
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % activeItems.length)}
                className="p-1 hover:text-black cursor-pointer"
                title="Next Breaking Item"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => onSelectArticle(currentStory.link)}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase text-neutral-700 hover:text-black bg-neutral-200/80 hover:bg-neutral-300 px-2 py-1 transition-colors cursor-pointer"
          >
            <span>Read Story</span>
            <ChevronRight className="w-3 h-3 text-neutral-500" />
          </button>
        </div>
      </div>
    </aside>
  );
};
