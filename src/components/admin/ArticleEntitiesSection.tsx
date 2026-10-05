import React, { useState } from 'react';
import { Plus, X, Tag, Building, Users, MapPin, BookOpen, Layers } from 'lucide-react';
import { CMSArticle, CMSAuthor, CMSCategory } from '../../types/cms';

interface ArticleEntitiesSectionProps {
  article: CMSArticle;
  onChange: (updated: Partial<CMSArticle>) => void;
  authors: CMSAuthor[];
  categories: CMSCategory[];
}

export const ArticleEntitiesSection: React.FC<ArticleEntitiesSectionProps> = ({
  article,
  onChange,
  authors = [],
  categories = [],
}) => {
  const [newPerson, setNewPerson] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newPlace, setNewPlace] = useState('');
  const [newProductOrBook, setNewProductOrBook] = useState('');
  const [newTopic, setNewTopic] = useState('');

  const entities = article.entities || {};

  const addEntityItem = (
    key: 'people' | 'companies' | 'organizations' | 'places' | 'products_or_books' | 'topics',
    value: string,
    setter: (v: string) => void
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const currentList = entities[key] || [];
    if (!currentList.includes(trimmed)) {
      onChange({
        entities: {
          ...entities,
          [key]: [...currentList, trimmed],
        },
      });
    }
    setter('');
  };

  const removeEntityItem = (
    key: 'people' | 'companies' | 'organizations' | 'places' | 'products_or_books' | 'topics',
    itemToRemove: string
  ) => {
    const currentList = entities[key] || [];
    onChange({
      entities: {
        ...entities,
        [key]: currentList.filter((item) => item !== itemToRemove),
      },
    });
  };

  return (
    <div className="bg-white border border-neutral-300 p-5 space-y-6 font-mono text-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#DF9E00] rounded-full"></span>
          <h2 className="text-base font-black uppercase text-neutral-900 tracking-wider">
            Entities, Author Byline & Topical Knowledge Graph
          </h2>
        </div>
        <p className="text-neutral-500 font-sans text-xs mt-0.5">
          Explicit entity relationships powering semantic linking, Google Knowledge Graph, and cross-story clusters.
        </p>
      </div>

      {/* Row 1: Author & Category & News Source Type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Author selection */}
        <div>
          <label className="block font-bold text-neutral-800 mb-1">
            Author Byline
          </label>
          <select
            value={article.author_id}
            onChange={(e) => {
              const selectedAuth = authors.find((a) => a.id === e.target.value);
              if (selectedAuth) {
                onChange({
                  author_id: selectedAuth.id,
                  author_name: selectedAuth.name,
                  author_role: selectedAuth.role || (selectedAuth as any).designation || 'Contributing Writer',
                  author_avatar: selectedAuth.avatar || (selectedAuth as any).photo_url || '',
                });
              }
            }}
            className="w-full px-3 py-2 border border-neutral-300 text-xs bg-white font-bold"
          >
            {authors.length > 0 ? (
              authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role || (a as any).designation || 'Contributing Writer'})
                </option>
              ))
            ) : (
              <option value="a925a3a4-abd9-4ebb-8966-b5fed4592371">
                Arjun Sindhu (Founder & Editor-in-Chief)
              </option>
            )}
          </select>
        </div>

        {/* Source Type */}
        <div>
          <label className="block font-bold text-neutral-800 mb-1">
            Source & Reporting Type
          </label>
          <select
            value={article.source_type || 'Original Reporting'}
            onChange={(e) => onChange({ source_type: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 text-xs bg-white"
          >
            <option value="Original Reporting">Original Reporting</option>
            <option value="Press Release">Press Release</option>
            <option value="Company Announcement">Company Announcement</option>
            <option value="Interview">Exclusive Interview</option>
            <option value="Official Statement">Official Government / Regulatory Statement</option>
            <option value="Research">Research & Market Audit</option>
            <option value="Other">Verified Secondary Source</option>
          </select>
        </div>

        {/* Article Format Type */}
        <div>
          <label className="block font-bold text-neutral-800 mb-1">
            Article Editorial Format
          </label>
          <select
            value={article.article_type || 'News Wire'}
            onChange={(e) => onChange({ article_type: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 text-xs bg-white"
          >
            <option value="News Wire">News Wire (Real-time Report)</option>
            <option value="In-Depth Analysis">In-Depth Analysis</option>
            <option value="Deep Dive">Deep Dive Feature</option>
            <option value="Founder Profile">Founder Profile & Builder Focus</option>
            <option value="Funding Report">Venture & Deal Flow Report</option>
          </select>
        </div>
      </div>

      {/* Row 2: Location & Primary Sources */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-bold text-neutral-800 mb-1">
            Reporting Location / Dateline
          </label>
          <input
            type="text"
            value={article.location || ''}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="e.g. BENGALURU, MUMBAI, NEW DELHI"
            className="w-full px-3 py-2 border border-neutral-300 text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">
            Primary Source / Attribution Name
          </label>
          <input
            type="text"
            value={article.source_name || ''}
            onChange={(e) => onChange({ source_name: e.target.value })}
            placeholder="e.g. The Economic Times / MCA Filings"
            className="w-full px-3 py-2 border border-neutral-300 text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">
            Primary Source Citation URL
          </label>
          <input
            type="url"
            value={article.source_url || ''}
            onChange={(e) => onChange({ source_url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-neutral-300 text-xs"
          />
        </div>
      </div>

      {/* Entity Chips Grid */}
      <div className="border-t border-neutral-200 pt-4 space-y-4">
        <span className="font-black uppercase text-neutral-800 tracking-wider text-xs block">
          Entity Extraction & Topical Tags
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. People Mentioned */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800">
              <Users className="w-3.5 h-3.5 text-neutral-600" />
              <span>People Mentioned</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEntityItem('people', newPerson, setNewPerson))}
                placeholder="e.g. Arjun Sindhu"
                className="flex-1 px-2 py-1 border border-neutral-300 text-[11px] bg-white"
              />
              <button
                type="button"
                onClick={() => addEntityItem('people', newPerson, setNewPerson)}
                className="px-2 py-1 bg-neutral-900 text-white font-bold hover:bg-black rounded-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {(entities.people || []).map((p, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white border border-neutral-300 px-1.5 py-0.5 rounded-xs text-[10px] font-bold">
                  <span>{p}</span>
                  <button type="button" onClick={() => removeEntityItem('people', p)} className="text-neutral-400 hover:text-red-600">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 2. Companies Mentioned */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800">
              <Building className="w-3.5 h-3.5 text-neutral-600" />
              <span>Companies Mentioned</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEntityItem('companies', newCompany, setNewCompany))}
                placeholder="e.g. Brovate, Gravity"
                className="flex-1 px-2 py-1 border border-neutral-300 text-[11px] bg-white"
              />
              <button
                type="button"
                onClick={() => addEntityItem('companies', newCompany, setNewCompany)}
                className="px-2 py-1 bg-neutral-900 text-white font-bold hover:bg-black rounded-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {(entities.companies || []).map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white border border-neutral-300 px-1.5 py-0.5 rounded-xs text-[10px] font-bold">
                  <span>{c}</span>
                  <button type="button" onClick={() => removeEntityItem('companies', c)} className="text-neutral-400 hover:text-red-600">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 3. Organizations Mentioned */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800">
              <Layers className="w-3.5 h-3.5 text-neutral-600" />
              <span>Organizations / VCs</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={newOrg}
                onChange={(e) => setNewOrg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEntityItem('organizations', newOrg, setNewOrg))}
                placeholder="e.g. 3one4 Capital, SEBI"
                className="flex-1 px-2 py-1 border border-neutral-300 text-[11px] bg-white"
              />
              <button
                type="button"
                onClick={() => addEntityItem('organizations', newOrg, setNewOrg)}
                className="px-2 py-1 bg-neutral-900 text-white font-bold hover:bg-black rounded-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {(entities.organizations || []).map((o, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white border border-neutral-300 px-1.5 py-0.5 rounded-xs text-[10px] font-bold">
                  <span>{o}</span>
                  <button type="button" onClick={() => removeEntityItem('organizations', o)} className="text-neutral-400 hover:text-red-600">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 4. Places Mentioned */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800">
              <MapPin className="w-3.5 h-3.5 text-neutral-600" />
              <span>Places / Regions</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={newPlace}
                onChange={(e) => setNewPlace(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEntityItem('places', newPlace, setNewPlace))}
                placeholder="e.g. Bengaluru, Karnataka"
                className="flex-1 px-2 py-1 border border-neutral-300 text-[11px] bg-white"
              />
              <button
                type="button"
                onClick={() => addEntityItem('places', newPlace, setNewPlace)}
                className="px-2 py-1 bg-neutral-900 text-white font-bold hover:bg-black rounded-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {(entities.places || []).map((pl, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white border border-neutral-300 px-1.5 py-0.5 rounded-xs text-[10px] font-bold">
                  <span>{pl}</span>
                  <button type="button" onClick={() => removeEntityItem('places', pl)} className="text-neutral-400 hover:text-red-600">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 5. Books / Products Mentioned */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800">
              <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
              <span>Books / Products</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={newProductOrBook}
                onChange={(e) => setNewProductOrBook(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEntityItem('products_or_books', newProductOrBook, setNewProductOrBook))}
                placeholder="e.g. Your Twenties Blueprint"
                className="flex-1 px-2 py-1 border border-neutral-300 text-[11px] bg-white"
              />
              <button
                type="button"
                onClick={() => addEntityItem('products_or_books', newProductOrBook, setNewProductOrBook)}
                className="px-2 py-1 bg-neutral-900 text-white font-bold hover:bg-black rounded-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {(entities.products_or_books || []).map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white border border-neutral-300 px-1.5 py-0.5 rounded-xs text-[10px] font-bold">
                  <span>{b}</span>
                  <button type="button" onClick={() => removeEntityItem('products_or_books', b)} className="text-neutral-400 hover:text-red-600">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 6. Topics Mentioned */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800">
              <Tag className="w-3.5 h-3.5 text-neutral-600" />
              <span>Topics & Themes</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEntityItem('topics', newTopic, setNewTopic))}
                placeholder="e.g. Venture Capital, DeepTech"
                className="flex-1 px-2 py-1 border border-neutral-300 text-[11px] bg-white"
              />
              <button
                type="button"
                onClick={() => addEntityItem('topics', newTopic, setNewTopic)}
                className="px-2 py-1 bg-neutral-900 text-white font-bold hover:bg-black rounded-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {(entities.topics || []).map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white border border-neutral-300 px-1.5 py-0.5 rounded-xs text-[10px] font-bold">
                  <span>{t}</span>
                  <button type="button" onClick={() => removeEntityItem('topics', t)} className="text-neutral-400 hover:text-red-600">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
