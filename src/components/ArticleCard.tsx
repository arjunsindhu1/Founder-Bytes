import React, { useState } from 'react';
import { Article } from '../types';
import { formatISTDateTime, getRelativeTime } from '../utils/dateUtils';
import { Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'lead' | 'secondary' | 'compact' | 'horizontal' | 'trending';
  rank?: number;
  onSelectArticle: (slug: string) => void;
  onSelectCategory?: (categorySlug: string) => void;
  onSelectAuthor?: (authorSlug: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'secondary',
  rank,
  onSelectArticle,
  onSelectCategory,
  onSelectAuthor,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectArticle(article.slug);
  };

  // Trending minimal variant
  if (variant === 'trending' && rank !== undefined) {
    return (
      <article
        onClick={handleCardClick}
        className="group flex items-start gap-3.5 py-3 border-b border-neutral-200 last:border-0 cursor-pointer"
      >
        <span className="font-mono text-2xl font-black text-neutral-300 group-hover:text-[#F5B800] transition-colors tabular-nums shrink-0 w-7 text-right">
          {String(rank).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mb-0.5">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory?.(article.categorySlug);
              }}
              className="font-bold text-neutral-900 hover:text-[#DF9E00] uppercase tracking-wider"
            >
              {article.category}
            </span>
            <span>·</span>
            <span>{getRelativeTime(article.publishedAt)}</span>
          </div>
          <h4 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
            {article.title}
          </h4>
        </div>
      </article>
    );
  }

  // Compact text-first variant (sidebar or lists)
  if (variant === 'compact') {
    return (
      <article
        onClick={handleCardClick}
        className="group py-3 border-b border-neutral-200 last:border-0 cursor-pointer"
      >
        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mb-1">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory?.(article.categorySlug);
            }}
            className="font-bold text-neutral-900 hover:text-[#DF9E00] uppercase tracking-wider"
          >
            {article.category}
          </span>
          <span>·</span>
          <span>{getRelativeTime(article.publishedAt)}</span>
          {article.isSponsored && (
            <>
              <span>·</span>
              <span className="text-[#DF9E00] font-bold">SPONSORED</span>
            </>
          )}
        </div>
        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug">
          {article.title}
        </h3>
      </article>
    );
  }

  // Horizontal variant (image beside text, clean newspaper divider)
  if (variant === 'horizontal') {
    return (
      <article
        onClick={handleCardClick}
        className="group flex flex-col sm:flex-row gap-4 py-4 border-b border-neutral-200 last:border-0 cursor-pointer"
      >
        <div className="sm:w-1/3 aspect-[16/10] bg-neutral-100 overflow-hidden relative shrink-0">
          {!imageError ? (
            <img
              src={article.featuredImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-104"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-3 text-center">
              <span className="text-xs uppercase tracking-widest text-[#F5B800] font-semibold">Founder Bytes</span>
              <span className="text-[10px] text-neutral-300 mt-1 line-clamp-2">{article.category}</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mb-1">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory?.(article.categorySlug);
                }}
                className="font-bold text-neutral-900 hover:text-[#DF9E00] uppercase tracking-wider"
              >
                {article.category}
              </span>
              <span>·</span>
              <span>{article.readingTimeMinutes} min read</span>
              {article.isSponsored && (
                <>
                  <span>·</span>
                  <span className="text-[#DF9E00] font-bold">SPONSORED</span>
                </>
              )}
            </div>
            <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug mb-1.5">
              {article.title}
            </h3>
            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
              {article.dek}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 mt-2 pt-2 border-t border-neutral-100">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelectAuthor?.(article.author.slug);
              }}
              className="font-medium text-neutral-800 hover:underline"
            >
              By {article.author.name}
            </span>
            <span>·</span>
            <span>{getRelativeTime(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  // Lead / Large hero article card
  if (variant === 'lead') {
    return (
      <article
        onClick={handleCardClick}
        className="group cursor-pointer flex flex-col"
      >
        {/* Dominant Headline Above or Below Image */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory?.(article.categorySlug);
            }}
            className="font-black text-neutral-900 hover:text-[#DF9E00] uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <span className="w-2 h-2 bg-[#F5B800]"></span>
            {article.category}
          </span>
          <span>·</span>
          <span>{article.readingTimeMinutes} min read</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            {getRelativeTime(article.publishedAt)}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 group-hover:text-neutral-700 leading-[1.12] mb-3">
          {article.title}
        </h2>

        <div className="aspect-[16/9] bg-neutral-100 overflow-hidden relative mb-3">
          {!imageError ? (
            <img
              src={article.featuredImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              loading="eager"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 text-white p-6">
              <span className="text-sm uppercase tracking-widest text-[#F5B800] font-bold">Founder Bytes Lead</span>
              <span className="text-xs text-neutral-400 mt-2">{article.category}</span>
            </div>
          )}
        </div>

        <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-serif mb-3 line-clamp-3">
          {article.dek}
        </p>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 pt-2 border-t border-neutral-200">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelectAuthor?.(article.author.slug);
            }}
            className="font-bold text-neutral-900 hover:underline"
          >
            By {article.author.name}
          </span>
          <span>·</span>
          <span>{formatISTDateTime(article.publishedAt)}</span>
        </div>
      </article>
    );
  }

  // Default secondary card (editorial news column item)
  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col h-full"
    >
      <div className="aspect-[16/10] bg-neutral-100 overflow-hidden relative mb-2.5">
        {!imageError ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-104"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-4">
            <span className="text-xs uppercase tracking-widest text-[#F5B800] font-semibold">Founder Bytes</span>
            <span className="text-xs text-neutral-400 mt-1">{article.category}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mb-1">
        <span
          onClick={(e) => {
            e.stopPropagation();
            onSelectCategory?.(article.categorySlug);
          }}
          className="font-bold text-neutral-900 hover:text-[#DF9E00] uppercase tracking-wider"
        >
          {article.category}
        </span>
        <span>·</span>
        <span>{article.readingTimeMinutes} min read</span>
      </div>

      <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug mb-1.5 line-clamp-2">
        {article.title}
      </h3>

      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-2 font-sans">
        {article.dek}
      </p>

      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mt-auto pt-2 border-t border-neutral-100">
        <span
          onClick={(e) => {
            e.stopPropagation();
            onSelectAuthor?.(article.author.slug);
          }}
          className="font-medium text-neutral-800 hover:underline"
        >
          By {article.author.name}
        </span>
        <span>·</span>
        <span>{getRelativeTime(article.publishedAt)}</span>
      </div>
    </article>
  );
};
