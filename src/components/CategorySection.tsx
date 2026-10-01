import React from 'react';
import { Article } from '../types';
import { formatISTDateTime, getRelativeTime } from '../utils/dateUtils';
import { ArrowRight, TrendingUp, DollarSign } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  categorySlug: string;
  articles: Article[];
  layout?: 'startup-split' | 'market-dense' | 'founders-mosaic' | 'tech-grid' | 'funding-table' | 'grid-3' | 'horizontal-list';
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSelectAuthor: (authorSlug: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  categorySlug,
  articles,
  layout = 'startup-split',
  onSelectArticle,
  onSelectCategory,
  onSelectAuthor,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="w-full py-8 bg-white border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with newspaper styling */}
        <div className="flex items-center justify-between pb-2 mb-6 border-b-2 border-neutral-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-900">
              {title}
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory(categorySlug)}
            className="group inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 hover:text-black transition-colors"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#DF9E00]" />
          </button>
        </div>

        {/* LAYOUT 1: STARTUP NEWS SPLIT (Large Story Left + 2 Stacked Right + 3 Bottom Columns) */}
        {layout === 'startup-split' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Dominant Feature (7 cols on lg) */}
              <div className="lg:col-span-7">
                <article
                  onClick={() => onSelectArticle(articles[0].slug)}
                  className="group cursor-pointer"
                >
                  <div className="w-full aspect-[16/10] bg-neutral-100 overflow-hidden mb-3">
                    <img
                      src={articles[0].featuredImage}
                      alt={articles[0].title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
                    <span className="font-bold text-neutral-900 uppercase">
                      {articles[0].category}
                    </span>
                    <span>·</span>
                    <span>{getRelativeTime(articles[0].publishedAt)}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 group-hover:text-neutral-700 leading-snug mb-2">
                    {articles[0].title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-serif leading-relaxed line-clamp-3">
                    {articles[0].dek}
                  </p>
                </article>
              </div>

              {/* Right Stacked Stories (5 cols on lg) */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-6 lg:pt-0 lg:pl-8 divide-y divide-neutral-200 flex flex-col justify-between">
                {articles.slice(1, 3).map((story) => (
                  <article
                    key={story.id}
                    onClick={() => onSelectArticle(story.slug)}
                    className="group cursor-pointer py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      <div className="w-28 sm:w-32 aspect-[16/11] bg-neutral-100 shrink-0 overflow-hidden">
                        <img
                          src={story.featuredImage}
                          alt={story.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono text-neutral-500 mb-0.5 uppercase">
                          {story.category} · {getRelativeTime(story.publishedAt)}
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                          {story.title}
                        </h4>
                        <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                          {story.dek}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Bottom 3-Column Newspaper Sub-Row */}
            {articles.length > 3 && (
              <div className="pt-6 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {articles.slice(3, 6).map((subStory) => (
                  <article
                    key={subStory.id}
                    onClick={() => onSelectArticle(subStory.slug)}
                    className="group cursor-pointer border-t sm:border-t-0 pt-4 sm:pt-0"
                  >
                    <div className="text-[10px] font-mono text-neutral-500 mb-1 uppercase">
                      {subStory.category} · {getRelativeTime(subStory.publishedAt)}
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                      {subStory.title}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                      {subStory.dek}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LAYOUT 2: BUSINESS & ENTERPRISE (Dense editorial context + stories) */}
        {layout === 'market-dense' && (
          <div>
            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
              {articles.slice(0, 3).map((story, i) => (
                <article
                  key={story.id}
                  onClick={() => onSelectArticle(story.slug)}
                  className={`group cursor-pointer ${i !== 0 ? 'pt-4 md:pt-0 md:pl-6' : ''}`}
                >
                  <div className="aspect-[16/10] bg-neutral-100 overflow-hidden mb-2.5">
                    <img
                      src={story.featuredImage}
                      alt={story.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 mb-1 uppercase">
                    {story.category} · {getRelativeTime(story.publishedAt)}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                    {story.dek}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* LAYOUT 3: FOUNDER STORIES (Diverse real photography: factory, speaking, candid, lab) */}
        {layout === 'founders-mosaic' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((story, index) => (
              <article
                key={story.id}
                onClick={() => onSelectArticle(story.slug)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Portrait with varied crops & genuine editorial presence */}
                  <div className={`w-full overflow-hidden mb-3 bg-neutral-100 ${
                    index === 0 ? 'aspect-[4/3]' : index === 1 ? 'aspect-[16/10]' : 'aspect-[5/4]'
                  }`}>
                    <img
                      src={story.featuredImage}
                      alt={story.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mb-1">
                    <span className="font-bold text-[#DF9E00] uppercase tracking-wider">
                      FOUNDER INTERVIEW
                    </span>
                    <span>·</span>
                    <span>{story.readingTimeMinutes} min read</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug mb-1">
                    {story.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-serif line-clamp-3 leading-relaxed">
                    {story.dek}
                  </p>
                </div>
                <div className="pt-2 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
                  <span>By {story.author.name}</span>
                  <span className="text-[#DF9E00] font-bold group-hover:underline">Read Profile →</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* LAYOUT 4: TECH & AI GRID */}
        {layout === 'tech-grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((story) => (
              <article
                key={story.id}
                onClick={() => onSelectArticle(story.slug)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] bg-neutral-100 overflow-hidden mb-2.5">
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-104"
                  />
                </div>
                <div className="text-[10px] font-mono text-neutral-500 mb-1 uppercase">
                  {story.category} · {getRelativeTime(story.publishedAt)}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                  {story.dek}
                </p>
              </article>
            ))}
          </div>
        )}

        {/* LAYOUT 5: FUNDING DEALS TABLE + STORIES */}
        {layout === 'funding-table' && (
          <div className="space-y-6">
            {/* High-Density Venture Deals Table */}
            <div className="overflow-x-auto border border-neutral-300">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3">Round / Stage</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Lead Investors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  <tr className="hover:bg-neutral-50 cursor-pointer" onClick={() => onSelectArticle(articles[0].slug)}>
                    <td className="py-2.5 px-3 font-bold text-neutral-900">Param Silicon Labs</td>
                    <td className="py-2.5 px-3 text-neutral-600">DeepTech / AI Silicon</td>
                    <td className="py-2.5 px-3 text-neutral-800">Series B</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#DF9E00]">$180M</td>
                    <td className="py-2.5 px-3 hidden sm:table-cell text-neutral-500">Sovereign Syndicate, Peak XV</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 cursor-pointer" onClick={() => onSelectArticle(articles[0].slug)}>
                    <td className="py-2.5 px-3 font-bold text-neutral-900">AeroVolt Dynamics</td>
                    <td className="py-2.5 px-3 text-neutral-600">Clean Energy Storage</td>
                    <td className="py-2.5 px-3 text-neutral-800">Growth Equity</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#DF9E00]">₹540 Cr</td>
                    <td className="py-2.5 px-3 hidden sm:table-cell text-neutral-500">Temasek, Vertex Capital</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 cursor-pointer" onClick={() => onSelectArticle(articles[0].slug)}>
                    <td className="py-2.5 px-3 font-bold text-neutral-900">KisanGrid Robotics</td>
                    <td className="py-2.5 px-3 text-neutral-600">Agricultural Autonomy</td>
                    <td className="py-2.5 px-3 text-neutral-800">Series A</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#DF9E00]">$24M</td>
                    <td className="py-2.5 px-3 hidden sm:table-cell text-neutral-500">Omnivore, Blume Ventures</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Featured Funding Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {articles.slice(0, 2).map((story) => (
                <article
                  key={story.id}
                  onClick={() => onSelectArticle(story.slug)}
                  className="group cursor-pointer flex gap-4 p-3 bg-neutral-50 border border-neutral-200"
                >
                  <div className="w-28 aspect-[16/10] bg-neutral-200 shrink-0 overflow-hidden">
                    <img
                      src={story.featuredImage}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-neutral-500 mb-0.5">
                      {story.category} · {getRelativeTime(story.publishedAt)}
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                      {story.title}
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        {/* LAYOUT 6: 3-COLUMN GRID */}
        {layout === 'grid-3' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((story) => (
              <article
                key={story.id}
                onClick={() => onSelectArticle(story.slug)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] bg-neutral-100 overflow-hidden mb-2.5">
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-104"
                  />
                </div>
                <div className="text-[10px] font-mono text-neutral-500 mb-1 uppercase">
                  {story.category} · {getRelativeTime(story.publishedAt)}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                  {story.dek}
                </p>
              </article>
            ))}
          </div>
        )}

        {/* LAYOUT 7: HORIZONTAL FEATURE ROWS */}
        {layout === 'horizontal-list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.slice(0, 4).map((story) => (
              <article
                key={story.id}
                onClick={() => onSelectArticle(story.slug)}
                className="group cursor-pointer flex gap-4 p-3 bg-neutral-50 border border-neutral-200"
              >
                <div className="w-28 sm:w-32 aspect-[16/10] bg-neutral-200 shrink-0 overflow-hidden">
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-neutral-500 mb-0.5">
                    {story.category} · {getRelativeTime(story.publishedAt)}
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                    {story.title}
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                    {story.dek}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
