import React from 'react';
import { Article } from '../types';
import { formatISTDateTime, getRelativeTime } from '../utils/dateUtils';
import { Clock } from 'lucide-react';

interface HeroSectionProps {
  leadArticle: Article;
  secondaryArticles: Article[];
  subLeadArticles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSelectAuthor: (authorSlug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadArticle,
  secondaryArticles,
  subLeadArticles,
  onSelectArticle,
  onSelectCategory,
  onSelectAuthor,
}) => {
  return (
    <section className="w-full py-6 bg-white border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT / CENTER: THE MAIN DOMINANT STORY + SUB-LEAD STORIES (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Primary Dominant Story */}
            <article
              onClick={() => onSelectArticle(leadArticle.slug)}
              className="group cursor-pointer pb-6 border-b border-neutral-300"
            >
              {/* Category & Timestamp kicker */}
              <div className="flex items-center gap-2 text-xs font-mono mb-2">
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-neutral-900 group-hover:text-neutral-700 leading-[1.12] tracking-tight mb-3">
                {leadArticle.title}
              </h1>

              {/* Large Real News Photography */}
              <div className="w-full aspect-[16/9] bg-neutral-100 overflow-hidden mb-3 relative">
                <img
                  src={leadArticle.featuredImage}
                  alt={leadArticle.title}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
                />
              </div>

              {/* Caption & Photo Credit */}
              {leadArticle.imageCaption && (
                <div className="text-[11px] text-neutral-500 font-serif italic mb-3 flex items-center justify-between">
                  <span>{leadArticle.imageCaption}</span>
                  {leadArticle.imageCredit && (
                    <span className="font-mono text-[10px] not-italic text-neutral-400 shrink-0 ml-2">
                      Photo: {leadArticle.imageCredit}
                    </span>
                  )}
                </div>
              )}

              {/* Excerpt / Dek */}
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-serif mb-3">
                {leadArticle.dek}
              </p>

              {/* Byline & Detailed Timestamp */}
              <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono pt-2 border-t border-neutral-100">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAuthor(leadArticle.author.slug);
                  }}
                  className="font-bold text-neutral-900 hover:underline"
                >
                  By {leadArticle.author.name}
                </span>
                <span>·</span>
                <span>{formatISTDateTime(leadArticle.publishedAt)}</span>
              </div>
            </article>

            {/* Sub-Lead 2-Column Stories beneath Main Story */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {subLeadArticles.slice(0, 2).map((story, idx) => (
                <article
                  key={story.id}
                  onClick={() => onSelectArticle(story.slug)}
                  className={`group cursor-pointer flex flex-col justify-between ${
                    idx === 0 ? 'sm:border-r sm:border-neutral-200 sm:pr-6' : ''
                  }`}
                >
                  <div>
                    <div className="w-full aspect-[16/10] bg-neutral-100 overflow-hidden mb-2.5">
                      <img
                        src={story.featuredImage}
                        alt={story.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 mb-1">
                      <span className="font-bold text-neutral-900 uppercase">{story.category}</span>
                      <span>·</span>
                      <span>{getRelativeTime(story.publishedAt)}</span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                      {story.dek}
                    </p>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-2 font-mono">
                    By {story.author.name}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT: DENSE VERTICAL NEWSPAPER FEED (4 cols on lg) */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-300 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-neutral-900">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#F5B800]"></span>
                <span>TOP DEVELOPMENTS</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                DESK DISPATCH
              </span>
            </div>

            {/* Vertical list of stories */}
            <div className="divide-y divide-neutral-200 flex-1 flex flex-col justify-between">
              {secondaryArticles.slice(0, 4).map((story) => (
                <article
                  key={story.id}
                  onClick={() => onSelectArticle(story.slug)}
                  className="group py-3.5 first:pt-0 last:pb-0 cursor-pointer flex gap-3.5 items-start"
                >
                  {/* Small Real Thumbnail */}
                  <div className="w-24 h-18 bg-neutral-100 shrink-0 overflow-hidden">
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
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                      {story.title}
                    </h3>
                    <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                      By {story.author.name}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Quick Market Sentiment / Pulse Box at base of column */}
            <div className="mt-6 p-3.5 bg-neutral-100 border border-neutral-300 font-mono text-xs">
              <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-1">
                VENTURE TRACKER · OCT 2026
              </div>
              <div className="text-sm font-black text-neutral-900">
                ₹1,480 Cr Deployed Across 14 Rounds
              </div>
              <div className="text-[11px] text-neutral-600 mt-0.5">
                Fintech & Deeptech lead 62% of week's transaction volume.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
