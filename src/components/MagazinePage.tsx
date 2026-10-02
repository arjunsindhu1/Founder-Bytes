import React, { useState, useEffect } from 'react';
import { DEFAULT_MAGAZINE_ISSUE } from '../constants/magazine';
import { ContentService } from '../services/contentService';
import { CMSMagazineIssue } from '../types/cms';
import { MagazineFlipbook } from './MagazineFlipbook';
import { AdSlot } from './AdSlot';
import { BookOpen, Sparkles, Check, ArrowRight, Download, Award } from 'lucide-react';

interface MagazinePageProps {
  onSelectArticle: (slug: string) => void;
  onNavigateHome: () => void;
}

export const MagazinePage: React.FC<MagazinePageProps> = ({
  onSelectArticle,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'founders' | '30-under-30' | 'issues'>('current');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [issues, setIssues] = useState<CMSMagazineIssue[]>([]);
  const [showFlipbook, setShowFlipbook] = useState(false);

  useEffect(() => {
    const loadIssues = async () => {
      const data = await ContentService.getMagazineIssues();
      const published = data.filter((i) => i.is_published);
      setIssues(published);
    };
    loadIssues();
    const unsubscribe = ContentService.subscribe(loadIssues);
    return () => unsubscribe();
  }, []);

  const issue: CMSMagazineIssue = issues[0] || {
    id: 'issue-01',
    issue_number: DEFAULT_MAGAZINE_ISSUE.issueNumber,
    season: DEFAULT_MAGAZINE_ISSUE.season,
    title: DEFAULT_MAGAZINE_ISSUE.title,
    dek: DEFAULT_MAGAZINE_ISSUE.dek,
    cover_image: DEFAULT_MAGAZINE_ISSUE.coverImage,
    published_date: DEFAULT_MAGAZINE_ISSUE.publishedDate,
    theme: DEFAULT_MAGAZINE_ISSUE.theme,
    is_featured: true,
    is_published: true,
    featured_founders: DEFAULT_MAGAZINE_ISSUE.featuredFounders,
    table_of_contents: DEFAULT_MAGAZINE_ISSUE.tableOfContents,
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail) return;
    setInquirySubmitted(true);
    setInquiryEmail('');
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16">
      {/* Magazine Flipbook Modal */}
      {showFlipbook && (
        <MagazineFlipbook
          issue={issue}
          onClose={() => setShowFlipbook(false)}
        />
      )}
      {/* Magazine Hero Masthead */}
      <div className="w-full bg-[#111111] text-white border-b border-neutral-800 pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors">
              HOME
            </button>
            <span>/</span>
            <span className="text-[#F5B800]">THE FOUNDER MAGAZINE</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F5B800] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE QUARTERLY PRINT & DIGITAL COMPILATION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white mb-4">
              THE FOUNDER MAGAZINE
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 font-sans leading-relaxed">
              India’s Business & Startup Magazine. In-depth quarterly profiles, investigative corporate essays, and generational founder histories.
            </p>
          </div>

          {/* Magazine Sub-Navigation Tabs */}
          <div className="flex items-center gap-3 sm:gap-6 mt-8 pt-6 border-t border-neutral-800 overflow-x-auto no-scrollbar text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'current', label: 'Current Issue (01)' },
              { id: 'founders', label: 'Featured Founders' },
              { id: '30-under-30', label: '30 Under 30 List' },
              { id: 'issues', label: 'Archive & Upcoming' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#F5B800] text-white font-extrabold bg-neutral-900/60'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {activeTab === 'current' && (
          <div className="space-y-12">
            {/* Primary Cover Presentation Card */}
            <div className="bg-white border border-neutral-200 shadow-sm p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* 3:4 Cover Art */}
                <div className="lg:col-span-5 flex justify-center">
                  <div 
                    onClick={() => setShowFlipbook(true)}
                    className="relative aspect-[3/4] max-w-sm w-full bg-neutral-900 shadow-2xl border border-neutral-200 overflow-hidden cursor-pointer group hover:scale-[1.01] transition-transform"
                    title="Click to open digital flipbook"
                  >
                    <img
                      src={issue.cover_image || (issue as any).coverImage}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/85 p-6 flex flex-col justify-between">
                      <div className="text-center pt-2">
                        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#F5B800] font-bold">
                          {issue.issue_number || (issue as any).issueNumber} · {issue.season}
                        </div>
                        <div className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white mt-1">
                          THE FOUNDER
                        </div>
                        <div className="text-[9px] font-sans tracking-[0.2em] text-neutral-300 uppercase">
                          INDIA’S BUSINESS & STARTUP MAGAZINE
                        </div>
                      </div>

                      <div>
                        <div className="inline-block bg-[#F5B800] text-black font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 mb-2">
                          COVER STORY
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                          {issue.title}
                        </h2>
                        <p className="text-xs text-neutral-300 mt-2 line-clamp-3">
                          {issue.dek}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Story Details */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DF9E00]">
                      {issue.issue_number} · PUBLISHED {(issue.published_date || '').toUpperCase()}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1">
                      {issue.title}
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
                      {issue.dek}
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-50 border border-neutral-200">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-2">
                      Cover Story Highlights
                    </h3>
                    <ul className="text-xs text-neutral-600 space-y-1.5 list-disc pl-4">
                      <li>Exclusive audits of 100 high-growth Indian technology champions</li>
                      <li>How Tier-2 manufacturing clusters are surpassing legacy corridors</li>
                      <li>The venture capital shift from blitzscaling to audited free cash flow</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setShowFlipbook(true)}
                      className="px-6 py-3 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <BookOpen className="w-4 h-4 text-[#F5B800]" />
                      <span>Open Digital Flipbook</span>
                    </button>
                    <button
                      onClick={() => onSelectArticle((issue as any).coverStorySlug || 'startups/simple-energy-raises-1750-crore-series-c-electric-scooters')}
                      className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Read Cover Feature</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Magazine Page Advertisement Slot */}
            <AdSlot pageType="magazine" placement="magazine-primary" />

            {/* Complete Table of Contents */}
            <div className="bg-white border border-neutral-200 p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-neutral-900">
                <h3 className="text-lg font-black uppercase tracking-tight text-neutral-900">
                  Issue 01 Table of Contents
                </h3>
                <span className="text-xs font-mono text-neutral-400">148 PAGES · PRINT & DIGITAL</span>
              </div>

              <div className="divide-y divide-neutral-100">
                {(issue.table_of_contents || []).map((item: any, idx: number) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#DF9E00] font-bold">
                        {item.section}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 hover:text-[#DF9E00] cursor-pointer transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-xs text-neutral-500">By {item.author}</span>
                    </div>
                    <div className="font-mono text-xs font-bold text-neutral-400 sm:text-right shrink-0">
                      PAGE {item.page}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'founders' && (
          <div className="bg-white border border-neutral-200 p-6 sm:p-10 space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase text-neutral-900">
                Featured Founders — Issue 01
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                The operators behind India's fastest-growing deeptech and infrastructure enterprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(issue.featured_founders || []).map((founder: any) => (
                <div key={founder.name} className="p-5 bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#DF9E00] font-bold">
                      LEADERSHIP PROFILE
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-1">{founder.name}</h3>
                    <div className="text-xs font-semibold text-neutral-700">{founder.company}</div>
                    <div className="text-xs font-mono text-neutral-500 mt-1">{founder.valuationOrMetric}</div>
                    <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
                      {founder.storyHeadline}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectArticle(founder.slug || 'startups/simple-energy-raises-1750-crore-series-c-electric-scooters')}
                    className="mt-4 pt-3 border-t border-neutral-200 text-xs font-bold uppercase tracking-wider text-black hover:text-[#DF9E00] flex items-center justify-between"
                  >
                    <span>Read Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === '30-under-30' && (
          <div className="bg-white border border-neutral-200 p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-[#F5B800]" />
              <h2 className="text-2xl font-black uppercase text-neutral-900">
                The Founder 30 Under 30 · Class of 2026
              </h2>
            </div>
            <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
              Honoring 30 young Indian builders redefining foundational engineering across artificial intelligence, aerospace propulsion, semiconductor fabrication, and biotechnology.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {[
                { name: 'Dr. Siddharth Nair', age: '28', company: 'QuantaFab Silicon', sector: 'Semiconductors' },
                { name: 'Ritika Goel', age: '27', company: 'Brahma Aerospace', sector: 'Suborbital Rockets' },
                { name: 'Aditya Vardhan', age: '29', company: 'IndicCore Systems', sector: 'Enterprise AI' },
                { name: 'Meghna Roy', age: '26', company: 'Vayu Biofuels', sector: 'Clean Energy' },
                { name: 'Kabir Sen', age: '28', company: 'DronaLogistics', sector: 'Autonomous Heavy Cargo' },
                { name: 'Tanvi Kulkarni', age: '25', company: 'Nirvana HealthTech', sector: 'Diagnostic Genomics' },
              ].map((nominee, idx) => (
                <div key={idx} className="p-4 border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-1">
                    <span>INDEX #{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-[#DF9E00] font-bold">AGE {nominee.age}</span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">{nominee.name}</h4>
                  <div className="text-xs text-neutral-700 font-medium">{nominee.company}</div>
                  <div className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wide">
                    {nominee.sector}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="bg-white border border-neutral-200 p-6 sm:p-10 space-y-6">
            <h2 className="text-2xl font-black uppercase text-neutral-900">
              Publication Schedule & Archives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 border-2 border-neutral-900 bg-neutral-50">
                <span className="text-xs font-mono font-bold text-[#DF9E00]">IN CIRCULATION</span>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">Issue 01 (Fall 2026)</h3>
                <p className="text-xs text-neutral-600 mt-1">The Next Indian Decade: 100 Startups</p>
              </div>
              <div className="p-5 border border-dashed border-neutral-300 bg-white opacity-80">
                <span className="text-xs font-mono font-bold text-neutral-400">UPCOMING · WINTER 2026</span>
                <h3 className="text-lg font-bold text-neutral-800 mt-1">Issue 02 (Winter 2026)</h3>
                <p className="text-xs text-neutral-500 mt-1">The Sovereign Cloud & Defense Tech</p>
              </div>
              <div className="p-5 border border-dashed border-neutral-300 bg-white opacity-60">
                <span className="text-xs font-mono font-bold text-neutral-400">UPCOMING · SPRING 2027</span>
                <h3 className="text-lg font-bold text-neutral-800 mt-1">Issue 03 (Spring 2027)</h3>
                <p className="text-xs text-neutral-500 mt-1">The Great Indian Manufacturing Renaissance</p>
              </div>
            </div>
          </div>
        )}

        {/* Print Order / Corporate Library Inquiry Box */}
        <div id="print-inquiry" className="mt-12 p-8 bg-[#111111] text-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-xs font-mono uppercase tracking-widest text-[#F5B800] mb-2 font-bold">
              PRINT EDITION INQUIRIES
            </div>
            <h3 className="text-2xl font-bold font-serif">
              Order The Founder Magazine for your Office or Library
            </h3>
            <p className="text-xs text-neutral-400 mt-2">
              Hardcover archival print editions distributed to venture capital firms, executive boardrooms, accelerators, and university libraries across India.
            </p>

            {inquirySubmitted ? (
              <div className="mt-4 p-3 bg-neutral-900 border border-emerald-500/50 text-emerald-400 text-xs font-medium flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you. Our distribution desk will reach out with bulk print order options.</span>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="flex gap-2 max-w-md mx-auto mt-6">
                <input
                  type="email"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Enter executive email"
                  required
                  className="flex-1 px-4 py-2.5 bg-neutral-900 text-white placeholder-neutral-500 text-xs border border-neutral-700 focus:outline-none focus:border-[#F5B800]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#F5B800] hover:bg-[#DF9E00] text-black font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
                >
                  Inquire
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
