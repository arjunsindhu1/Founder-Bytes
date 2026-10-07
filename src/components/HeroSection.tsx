import React from 'react';
import { Article } from '../types';
import { getRelativeTime } from '../utils/dateUtils';
import { Clock } from 'lucide-react';

interface HeroSectionProps {
  leadArticle: Article;
  supportingArticles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSelectAuthor: (authorSlug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadArticle,
  supportingArticles,
  onSelectArticle,
  onSelectCategory,
  onSelectAuthor,
}) => {
  // Take exactly 3 supporting stories
  const displaySupporting = supportingArticles.slice(0, 3);

  return (
    <section className="w-full py-6 sm:py-8 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT: 1 LARGE FEATURED STORY (8 cols on lg) */}
          <article
            onClick={() => onSelectArticle(leadArticle.slug)}
            className="lg:col-span-8 group cursor-pointer flex flex-col"
          >
            {/* Category & Timestamp kicker */}
            <div className="flex items-center gap-2 text-xs font-mono mb-2.5">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(leadArticle.categorySlug);
                }}
                className="font-bold text-neutral-900 hover:text-[#DF9E00] uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <span className="w-2 h-2 bg-[#F5B800]"></span>
                {leadArticle.category}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                {getRelativeTime(leadArticle.publishedAt)}
              </span>
              <span className="text-neutral-400 hidden sm:inline">·</span>
              <span className="text-neutral-500 hidden sm:inline">{leadArticle.readingTimeMinutes} min read</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 group-hover:text-neutral-700 leading-tight tracking-tight mb-3 font-serif">
              {leadArticle.title}
            </h1>

            {/* Large Real News Photography */}
            <div className="w-full aspect-[16/9] bg-neutral-100 overflow-hidden mb-3 relative border border-neutral-200">
              <img
                src={leadArticle.featuredImage}
                alt={leadArticle.title}
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            </div>

            {/* Excerpt / Dek */}
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-serif line-clamp-2 mb-2">
              {leadArticle.dek}
            </p>

            {/* Byline */}
            <div className="text-xs text-neutral-500 font-mono pt-1">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAuthor(leadArticle.author.slug);
                }}
                className="font-bold text-neutral-900 hover:underline"
              >
                By {leadArticle.author.name}
              </span>
            </div>
          </article>

          {/* RIGHT: 3 SMALLER SUPPORTING STORIES (4 cols on lg) */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-neutral-900">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#F5B800]"></span>
                <span>TOP STORIES</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                DESK DISPATCH
              </span>
            </div>

            <div className="divide-y divide-neutral-200">
              {displaySupporting.map((story) => (
                <article
                  key={story.id}
                  onClick={() => onSelectArticle(story.slug)}
                  className="group py-3.5 first:pt-1 last:pb-1 cursor-pointer flex gap-3.5 items-start"
                >
                  {/* Real Thumbnail Image */}
                  <div className="w-24 sm:w-28 aspect-[16/11] bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200">
                    <img
                      src={story.featuredImage}
                      alt={story.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Story Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mb-0.5">
                      <span className="font-bold text-neutral-900 uppercase">
                        {story.category}
                      </span>
                      <span>·</span>
                      <span>{getRelativeTime(story.publishedAt)}</span>
                    </div>
                    <h2 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                      {story.title}
                    </h2>
                    <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                      By {story.author.name}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
