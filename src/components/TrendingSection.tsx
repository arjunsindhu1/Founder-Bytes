import React from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { TrendingUp } from 'lucide-react';

interface TrendingSectionProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
}) => {
  return (
    <section className="w-full py-6 sm:py-8 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#111111] text-[#F5B800]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900">
              Trending Across Founder Bytes
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            MOST READ TODAY
          </span>
        </div>

        {/* 4-column numbered trending grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((article, index) => (
            <div key={article.id} className="bg-white p-4 border border-neutral-200 shadow-2xs">
              <ArticleCard
                article={article}
                variant="trending"
                rank={index + 1}
                onSelectArticle={onSelectArticle}
                onSelectCategory={onSelectCategory}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
