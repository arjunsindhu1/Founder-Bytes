import React from 'react';
import { Article } from '../types';
import { getRelativeTime } from '../utils/dateUtils';
import { ArrowRight, Clock } from 'lucide-react';

interface LatestNewsSectionProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onViewAllNews: () => void;
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
  onViewAllNews,
}) => {
  // Take 6 to 8 stories
  const displayArticles = articles.slice(0, 8);

  return (
    <section className="w-full py-8 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-neutral-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 font-serif">
              LATEST NEWS
            </h2>
            <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline ml-2 uppercase">
              STARTUPS · BUSINESS · TECH · AI
            </span>
          </div>

          <button
            onClick={onViewAllNews}
            className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 hover:text-[#DF9E00] transition-colors cursor-pointer"
          >
            <span>VIEW ALL NEWS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Compact Responsive 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayArticles.map((story) => (
            <article
              key={story.id}
              onClick={() => onSelectArticle(story.slug)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="w-full aspect-[16/10] bg-neutral-100 overflow-hidden mb-2.5 relative border border-neutral-200">
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(story.categorySlug);
                      }}
                      className="px-1.5 py-0.5 bg-black/85 text-[#F5B800] text-[9px] font-mono uppercase font-bold tracking-wider hover:bg-black"
                    >
                      {story.category}
                    </span>
                  </div>
                </div>

                {/* Time & Read Time */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mb-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{getRelativeTime(story.publishedAt)}</span>
                  <span>·</span>
                  <span>{story.readingTimeMinutes} min</span>
                </div>

                {/* Headline */}
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                  {story.title}
                </h3>

                {/* Minimal Excerpt */}
                <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed font-serif">
                  {story.dek}
                </p>
              </div>

              {/* Byline */}
              <div className="text-[10px] font-mono text-neutral-400 mt-3 pt-2 border-t border-neutral-100">
                By {story.author.name}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
