import React from 'react';
import { Article } from '../types';
import { formatISTTimeOnly, getRelativeTime } from '../utils/dateUtils';
import { ArrowRight, Flame, Clock } from 'lucide-react';

interface LatestAndTrendingSectionProps {
  latestArticles: Article[];
  trendingArticles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const LatestAndTrendingSection: React.FC<LatestAndTrendingSectionProps> = ({
  latestArticles,
  trendingArticles,
  onSelectArticle,
  onSelectCategory,
}) => {
  return (
    <section className="w-full py-8 bg-neutral-50/50 border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: LATEST NEWS STREAM (Newspaper-style dense feed, 7 cols on lg) */}
          <div className="lg:col-span-7">
            {/* Header with clean rule */}
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-neutral-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
                <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  LATEST NEWS WIRE
                </h2>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>REAL-TIME EDITORIAL UPDATES</span>
              </span>
            </div>

            {/* Dense stories feed */}
            <div className="divide-y divide-neutral-200">
              {latestArticles.slice(0, 5).map((article) => (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article.slug)}
                  className="group py-3.5 first:pt-1 last:pb-1 cursor-pointer flex items-start gap-4"
                >
                  {/* Timestamp in bold monospace */}
                  <div className="shrink-0 w-20 text-left pt-0.5">
                    <span className="font-mono text-xs font-bold text-neutral-800 tabular-nums block">
                      {formatISTTimeOnly(article.publishedAt)}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(article.categorySlug);
                      }}
                      className="text-[10px] font-mono uppercase tracking-wider text-[#DF9E00] font-bold hover:underline block mt-0.5"
                    >
                      {article.category}
                    </span>
                  </div>

                  {/* Headline & Summary */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-neutral-600 line-clamp-1 mt-1 leading-relaxed">
                      {article.dek}
                    </p>
                    <div className="text-[10px] text-neutral-400 font-mono mt-1">
                      By {article.author.name} · {article.readingTimeMinutes}m read
                    </div>
                  </div>

                  {/* Thumbnail on right */}
                  <div className="w-16 h-12 sm:w-20 sm:h-14 bg-neutral-200 shrink-0 overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT: TRENDING SECTION (Large subtle numbers, 5 cols on lg) */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-300 pt-6 lg:pt-0 lg:pl-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-neutral-900">
              <div className="flex items-center gap-2">
                <span className="p-0.5 bg-[#111111] text-[#F5B800]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </span>
                <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  TRENDING STORIES
                </h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                MOST READ ACROSS INDIA
              </span>
            </div>

            {/* Numbered list with large subtle numerals */}
            <div className="divide-y divide-neutral-200">
              {trendingArticles.slice(0, 5).map((article, idx) => (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article.slug)}
                  className="group py-3 first:pt-1 last:pb-1 cursor-pointer flex items-start gap-4"
                >
                  {/* Big subtle rank number */}
                  <span className="font-mono text-2xl sm:text-3xl font-black text-neutral-300 group-hover:text-[#F5B800] transition-colors tabular-nums shrink-0 w-8 text-right">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mb-0.5">
                      <span className="font-bold text-neutral-900 uppercase">
                        {article.category}
                      </span>
                      <span>·</span>
                      <span>{getRelativeTime(article.publishedAt)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug">
                      {article.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>

            {/* In-depth Magazine Callout link */}
            <div className="mt-6 pt-4 border-t border-neutral-300 flex items-center justify-between text-xs">
              <span className="font-serif italic text-neutral-600">
                Quarterly Print Archive Available
              </span>
              <button
                onClick={() => onSelectCategory('magazine')}
                className="font-mono font-bold uppercase tracking-wider text-black hover:text-[#DF9E00] inline-flex items-center gap-1"
              >
                <span>Read Magazine</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
