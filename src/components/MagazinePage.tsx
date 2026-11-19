import React, { useState, useEffect } from 'react';
import {
  THIRTY_UNDER_THIRTY_MAGAZINE_CMS,
  THIRTY_UNDER_THIRTY_PDF_URL,
} from '../constants/magazine';
import { ContentService } from '../services/contentService';
import { CMSMagazineIssue } from '../types/cms';
import { MagazineFlipbook } from './MagazineFlipbook';
import { PdfMagazineReader } from './PdfMagazineReader';
import { AdSlot } from './AdSlot';
import {
  BookOpen,
  Sparkles,
  Check,
  ArrowRight,
  Download,
  Award,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import {
  THIRTY_UNDER_THIRTY_FOUNDERS,
  THIRTY_UNDER_THIRTY_META,
} from '../data/thirtyUnderThirty2026';

interface MagazinePageProps {
  onSelectArticle: (slug: string) => void;
  onNavigateHome: () => void;
  onNavigateThirtyUnderThirty?: () => void;
}

export const MagazinePage: React.FC<MagazinePageProps> = ({
  onSelectArticle,
  onNavigateHome,
  onNavigateThirtyUnderThirty,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'founders' | '30-under-30' | 'issues'>('current');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [cmsIssues, setCmsIssues] = useState<CMSMagazineIssue[]>([]);
  const [activeIssue, setActiveIssue] = useState<CMSMagazineIssue>(THIRTY_UNDER_THIRTY_MAGAZINE_CMS);
  const [showFlipbook, setShowFlipbook] = useState(false);

  useEffect(() => {
    const loadIssues = async () => {
      const data = await ContentService.getMagazineIssues();
      const published = data.filter((i) => i.is_published);
      setCmsIssues(published);
    };
    loadIssues();
    const unsubscribe = ContentService.subscribe(loadIssues);
    return () => unsubscribe();
  }, []);

  // Merge the official 30 Under 30 India 2026 38-page PDF edition first alongside any additional published CMS issues
  const allPublishedIssues: CMSMagazineIssue[] = [
    THIRTY_UNDER_THIRTY_MAGAZINE_CMS,
    ...cmsIssues.filter(
      (i) =>
        i.id !== THIRTY_UNDER_THIRTY_MAGAZINE_CMS.id &&
        !i.title.toLowerCase().includes('30 under 30')
    ),
  ];

  const issue = activeIssue;
  const activePdfUrl = issue.pdf_link || THIRTY_UNDER_THIRTY_PDF_URL;
  const activeCoverUrl = issue.cover_image || THIRTY_UNDER_THIRTY_META.coverImagePath;
  const isOfficialThirtyUnderThirty =
    issue.id === THIRTY_UNDER_THIRTY_MAGAZINE_CMS.id ||
    issue.title.toLowerCase().includes('30 under 30');

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail) return;
    setInquirySubmitted(true);
    setInquiryEmail('');
  };

  const scrollToReader = () => {
    const el = document.getElementById('magazine-pdf-reader');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16">
      {/* Fullscreen Digital Magazine Reader Modal */}
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
            <button onClick={onNavigateHome} className="hover:text-white transition-colors cursor-pointer">
              HOME
            </button>
            <span>/</span>
            <span className="text-[#F5B800]">THE FOUNDER MAGAZINE</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F5B800] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL PRINT & DIGITAL MAGAZINE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white mb-4">
              THE FOUNDER MAGAZINE
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 font-sans leading-relaxed">
              India’s Business & Startup Magazine. Read our complete digital editions online, explore founder features, and browse the official Founder Bytes – 30 Under 30 India 2026 issue.
            </p>
          </div>

          {/* Magazine Sub-Navigation Tabs */}
          <div className="flex items-center gap-3 sm:gap-6 mt-8 pt-6 border-t border-neutral-800 overflow-x-auto no-scrollbar text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'current', label: 'Current Issue (30 Under 30)' },
              { id: '30-under-30', label: '30 Under 30 Directory' },
              { id: 'founders', label: 'Featured Founders' },
              { id: 'issues', label: `All Editions (${allPublishedIssues.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
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
          <div className="space-y-10">
            {/* Primary Cover Presentation Card */}
            <div className="bg-white border border-neutral-200 shadow-sm p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Official Magazine Cover Art (Exact Uncropped Original) */}
                <div className="lg:col-span-5 flex justify-center">
                  <div
                    onClick={() => setShowFlipbook(true)}
                    className="relative max-w-sm w-full bg-black p-2 shadow-2xl border border-neutral-800 cursor-pointer group transition-transform hover:-translate-y-0.5"
                    title="Click to read full magazine in fullscreen"
                  >
                    <img
                      src={activeCoverUrl}
                      alt={
                        isOfficialThirtyUnderThirty
                          ? THIRTY_UNDER_THIRTY_META.coverImageAlt
                          : issue.title
                      }
                      className="w-full h-auto block"
                    />
                    <div className="mt-2.5 flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      <span className="text-[#F5B800] font-bold">
                        {issue.page_count || 38} PAGES · DIGITAL EDITION
                      </span>
                      <span className="group-hover:text-white transition-colors">
                        Click to Expand →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cover Story Details & Actions */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9A6B00]">
                      {issue.issue_number} · {(issue.published_date || 'October 2026').toUpperCase()} · {issue.page_count || 38} PAGES
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-neutral-950 tracking-tight mt-1.5">
                      {isOfficialThirtyUnderThirty
                        ? 'Founder Bytes – 30 Under 30 India 2026'
                        : issue.title}
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-700 mt-3 leading-relaxed">
                      {issue.dek}
                    </p>
                  </div>

                  <div className="p-5 bg-[#FAF9F6] border border-neutral-200">
                    <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-neutral-900 mb-2.5">
                      Inside This Edition
                    </h3>
                    <ul className="text-xs sm:text-sm text-neutral-700 space-y-2 list-disc pl-4 leading-relaxed">
                      <li>Complete 38-page digital edition of Founder Bytes – The Founder Magazine (October 2026, Volume 01, Issue 01)</li>
                      <li>17 individual founder profiles across AI, SaaS, robotics, immersive tech, FMCG, exports, real estate, publishing, music, design, and academic leadership</li>
                      <li>Read directly online below in single-page or 2-page print spread mode, or download the full PDF</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={scrollToReader}
                      className="px-5 py-3 bg-[#F5B800] hover:bg-[#DF9E00] text-black font-mono text-xs font-extrabold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Magazine Below ({issue.page_count || 38} Pages)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowFlipbook(true)}
                      className="px-5 py-3 bg-[#111111] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#F5B800]" />
                      <span>Fullscreen Reader</span>
                    </button>

                    <a
                      href={activePdfUrl}
                      download="FounderBytes-30-Under-30-India-2026-Magazine.pdf"
                      className="px-5 py-3 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>

                    {isOfficialThirtyUnderThirty && onNavigateThirtyUnderThirty && (
                      <button
                        type="button"
                        onClick={onNavigateThirtyUnderThirty}
                        className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                      >
                        <span>Read Web Profiles</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* EMBEDDED LIVE PUBLIC MAGAZINE READER (38-PAGE INTERACTIVE PDF) */}
            <section
              id="magazine-pdf-reader"
              aria-labelledby="live-reader-heading"
              className="scroll-mt-20 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#9A6B00]">
                    Interactive Digital Reader · Public Access
                  </div>
                  <h2
                    id="live-reader-heading"
                    className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 mt-0.5"
                  >
                    Read {isOfficialThirtyUnderThirty ? 'Founder Bytes – 30 Under 30 India 2026' : issue.title}
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <a
                    href={activePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-black font-semibold underline underline-offset-4"
                  >
                    <span>Open Original PDF</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <PdfMagazineReader
                pdfUrl={activePdfUrl}
                title={
                  isOfficialThirtyUnderThirty
                    ? 'Founder Bytes – 30 Under 30 India 2026'
                    : issue.title
                }
                issueLabel={`${issue.issue_number} · ${issue.published_date || 'October 2026'}`}
                mode="embedded"
                onExpandModal={() => setShowFlipbook(true)}
              />
            </section>

            {/* Primary Magazine Page Advertisement Slot */}
            <AdSlot pageType="magazine" placement="magazine-primary" />

            {/* Complete Table of Contents */}
            <div className="bg-white border border-neutral-200 p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-neutral-900">
                <h3 className="text-lg font-black uppercase tracking-tight text-neutral-900">
                  {issue.issue_number} Table of Contents
                </h3>
                <span className="text-xs font-mono text-neutral-500">
                  {issue.page_count || 38} PAGES · PRINT & DIGITAL
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {(issue.table_of_contents || []).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={scrollToReader}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer group"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A6B00] font-bold">
                        {item.section}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 group-hover:text-[#9A6B00] transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-xs text-neutral-500">By {item.author}</span>
                    </div>
                    <div className="font-mono text-xs font-bold text-neutral-500 sm:text-right shrink-0">
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-neutral-950">
                  Featured Founders — Volume 01, Issue 01
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  Explore all 17 entrepreneurs, innovators, researchers, and leaders featured in Founder Bytes – 30 Under 30 India 2026.
                </p>
              </div>
              {onNavigateThirtyUnderThirty && (
                <button
                  type="button"
                  onClick={onNavigateThirtyUnderThirty}
                  className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Full Editorial Profiles</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5B800]" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {THIRTY_UNDER_THIRTY_FOUNDERS.map((founder) => (
                <div
                  key={founder.id}
                  className="p-5 bg-neutral-50 border border-neutral-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A6B00] font-bold tabular-nums">
                      PROFILE {founder.numberLabel} · 30 UNDER 30
                    </span>
                    <h3 className="text-lg font-serif font-bold text-neutral-950 mt-1">
                      {founder.name}
                    </h3>
                    <div className="text-xs font-semibold text-neutral-800">{founder.designation}</div>
                    <div className="text-[11px] font-mono text-neutral-500 mt-1">{founder.industry}</div>
                    <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
                      {founder.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onNavigateThirtyUnderThirty || (() => setShowFlipbook(true))}
                    className="mt-4 pt-3 border-t border-neutral-200 text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-[#9A6B00] flex items-center justify-between cursor-pointer"
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
          <div className="bg-white border border-neutral-200 p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-neutral-200">
              <div className="lg:col-span-4 flex justify-center">
                <div
                  onClick={() => setShowFlipbook(true)}
                  className="w-full max-w-[280px] border border-neutral-800 bg-black p-1.5 shadow-lg cursor-pointer"
                >
                  <img
                    src={THIRTY_UNDER_THIRTY_META.coverImagePath}
                    alt={THIRTY_UNDER_THIRTY_META.coverImageAlt}
                    className="w-full h-auto block"
                  />
                </div>
              </div>
              <div className="lg:col-span-8 space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#9A6B00]">
                  {THIRTY_UNDER_THIRTY_META.editionLabel} · 38 PAGES
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-[#F5B800] shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-950">
                    Founder Bytes – 30 Under 30 India 2026
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-2xl">
                  The Next Generation Building India. Read the complete 38-page PDF magazine edition online or explore the full web directory of all 17 featured founders.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFlipbook(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5B800] hover:bg-[#DF9E00] text-black font-mono text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read 38-Page Magazine PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={onNavigateThirtyUnderThirty}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Open Web Feature Page</span>
                    <ArrowRight className="w-4 h-4 text-[#F5B800]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {THIRTY_UNDER_THIRTY_FOUNDERS.map((founder) => (
                <div
                  key={founder.id}
                  onClick={onNavigateThirtyUnderThirty}
                  className="p-4 border border-neutral-200 bg-neutral-50/50 hover:bg-[#FBF9F4] hover:border-neutral-400 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-1.5">
                    <span className="font-bold text-[#9A6B00] tabular-nums">NO. {founder.numberLabel}</span>
                    {founder.shortLocation && <span className="truncate ml-2">{founder.shortLocation}</span>}
                  </div>
                  <h3 className="text-base font-serif font-bold text-neutral-950">{founder.name}</h3>
                  <div className="text-xs text-neutral-800 font-semibold mt-0.5">{founder.designation}</div>
                  <div className="text-[11px] text-neutral-500 mt-1.5 leading-snug">
                    {founder.industry}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="bg-white border border-neutral-200 p-6 sm:p-10 space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-neutral-950">
                Published Editions & Upcoming Schedule
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Select any published issue below to open and read the full digital edition.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allPublishedIssues.map((ed) => (
                <div
                  key={ed.id}
                  className="p-5 border-2 border-neutral-900 bg-[#FAF9F6] flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="mb-4 bg-black p-1.5 border border-neutral-800">
                      <img
                        src={ed.cover_image || THIRTY_UNDER_THIRTY_META.coverImagePath}
                        alt={ed.title}
                        className="w-full h-auto block"
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#9A6B00] uppercase">
                      AVAILABLE NOW · {ed.page_count || 38} PAGES
                    </span>
                    <h3 className="text-lg font-serif font-bold text-neutral-950 mt-1">
                      {ed.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-500 mt-0.5">
                      {ed.issue_number} · {ed.published_date}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveIssue(ed);
                        setActiveTab('current');
                        setShowFlipbook(true);
                      }}
                      className="flex-1 px-4 py-2.5 bg-[#111111] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Read Edition
                    </button>
                    {ed.pdf_link && (
                      <a
                        href={ed.pdf_link}
                        download
                        className="px-3 py-2.5 bg-[#F5B800] hover:bg-[#DF9E00] text-black font-mono text-xs font-bold uppercase inline-flex items-center"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              <div className="p-5 border border-dashed border-neutral-300 bg-white flex flex-col justify-center">
                <span className="text-xs font-mono font-bold text-neutral-400">UPCOMING · VOLUME 01, ISSUE 02</span>
                <h3 className="text-lg font-serif font-bold text-neutral-800 mt-1">Next Quarterly Edition</h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Editorial nominations and founder profiles are currently under review by the Founder Bytes team.
                </p>
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
                  className="px-5 py-2.5 bg-[#F5B800] hover:bg-[#DF9E00] text-black font-bold text-xs uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
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
