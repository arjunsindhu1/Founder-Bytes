import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '../types';
import { Search, X, Calendar, User, ArrowRight } from 'lucide-react';
import { formatISTDateTime } from '../utils/dateUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (slug: string) => void;
  onSelectAuthor: (authorSlug: string) => void;
  articles?: Article[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
  onSelectAuthor,
  articles = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce input by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return articles.filter((art) => {
      return (
        art.title.toLowerCase().includes(q) ||
        art.dek.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.author.name.toLowerCase().includes(q) ||
        art.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [debouncedQuery, articles]);

  const matchedAuthors = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    if ('arjun sindhu'.includes(q) || 'editor'.includes(q) || 'founder'.includes(q)) {
      return [
        {
          id: 'a925a3a4-abd9-4ebb-8966-b5fed4592371',
          name: 'Arjun Sindhu',
          slug: 'arjun-sindhu',
          role: 'Founder & Editor-in-Chief',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
      ];
    }
    return [];
  }, [debouncedQuery]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-neutral-300 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 bg-neutral-50">
          <Search className="w-5 h-5 text-neutral-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news, founders, companies, venture rounds..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none"
            aria-label="Search query"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono font-semibold uppercase text-neutral-500 hover:text-black px-2 py-1 bg-neutral-200/70 rounded-xs"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-neutral-100">
          {debouncedQuery === '' ? (
            <div className="py-8 text-center text-neutral-500">
              <p className="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-2">
                POPULAR TOPICS ACROSS FOUNDER BYTES
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['Electric Vehicles', 'Vernacular AI', 'Deeptech', 'Semiconductors', 'Venture Capital', 'OptoSAR'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchTerm(topic)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-700 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Header stats */}
              <div className="flex items-center justify-between pb-3 text-xs text-neutral-500 font-mono">
                <span>
                  FOUND {filteredArticles.length} ARTICLE{filteredArticles.length !== 1 ? 'S' : ''} FOR &ldquo;{debouncedQuery}&rdquo;
                </span>
              </div>

              {/* Matched Authors if any */}
              {matchedAuthors.length > 0 && (
                <div className="py-3 mb-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#DF9E00] font-bold mb-2">
                    AUTHORS & EDITORS
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedAuthors.map((author) => (
                      <div
                        key={author.id}
                        onClick={() => {
                          onClose();
                          onSelectAuthor(author.slug);
                        }}
                        className="flex items-center gap-3 p-2 bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors"
                      >
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-neutral-900">{author.name}</div>
                          <div className="text-[11px] text-neutral-500">{author.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Articles List */}
              {filteredArticles.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => {
                        onClose();
                        onSelectArticle(article.slug);
                      }}
                      className="group flex gap-4 cursor-pointer hover:bg-neutral-50 p-2 transition-colors"
                    >
                      <div className="w-20 h-16 sm:w-24 sm:h-20 bg-neutral-100 shrink-0 overflow-hidden">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-1">
                          <span className="font-bold text-neutral-900 uppercase tracking-wider">
                            {article.category}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatISTDateTime(article.publishedAt)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug line-clamp-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                          <User className="w-3 h-3 text-neutral-400" />
                          <span>By {article.author.name}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black self-center shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-500 text-sm">
                  No matching stories found for &ldquo;{debouncedQuery}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
