import React from 'react';
import { Author, Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { Mail, ArrowLeft, Twitter, Linkedin, CheckCircle } from 'lucide-react';

interface AuthorPageProps {
  author: Author;
  articles: Article[];
  onNavigateBack: () => void;
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const AuthorPage: React.FC<AuthorPageProps> = ({
  author,
  articles,
  onNavigateBack,
  onSelectArticle,
  onSelectCategory,
}) => {
  return (
    <div className="w-full bg-white min-h-screen pb-16">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to coverage</span>
        </button>
      </div>

      {/* Author Profile Masthead */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-neutral-200">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-neutral-900 shadow-md shrink-0"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                {author.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 border border-neutral-200">
                <CheckCircle className="w-3 h-3 text-[#DF9E00]" />
                VERIFIED EDITORIAL BYLINE
              </span>
            </div>

            <div className="text-sm font-semibold text-neutral-700 mt-1">
              {author.role} · {author.organization}
            </div>

            <p className="text-sm text-neutral-600 max-w-2xl mt-3 leading-relaxed">
              {author.bio}
            </p>

            {/* Social & Contact */}
            <div className="flex items-center gap-3 mt-4 text-xs">
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-black font-medium"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>X / Twitter</span>
                </a>
              )}
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-black font-medium"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-black font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Newsroom</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Author's Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-neutral-900">
          <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900">
            Reporting & Features by {author.name}
          </h2>
          <span className="text-xs font-mono text-neutral-400">
            {articles.length} ARTICLE{articles.length !== 1 ? 'S' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="secondary"
              onSelectArticle={onSelectArticle}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
