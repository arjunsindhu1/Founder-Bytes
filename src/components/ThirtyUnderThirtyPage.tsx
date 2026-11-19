import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';
import {
  ABOUT_FOUNDER_BYTES,
  CLOSING_EDITORIAL,
  SECTOR_FILTERS,
  SectorFilter,
  THIRTY_UNDER_THIRTY_FOUNDERS,
  THIRTY_UNDER_THIRTY_INTRO,
  THIRTY_UNDER_THIRTY_META,
} from '../data/thirtyUnderThirty2026';
import { THIRTY_UNDER_THIRTY_PDF_URL } from '../constants/magazine';
import { PdfMagazineReader } from './PdfMagazineReader';
import { PolicyPageType } from './PolicyPage';

interface ThirtyUnderThirtyPageProps {
  onNavigateHome: () => void;
  onNavigateMagazine: () => void;
  onNavigateNominations: () => void;
  onNavigatePolicy: (policy: PolicyPageType) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const ThirtyUnderThirtyPage: React.FC<ThirtyUnderThirtyPageProps> = ({
  onNavigateHome,
  onNavigateMagazine,
  onNavigateNominations,
  onNavigatePolicy,
  onSelectCategory,
}) => {
  const [selectedSector, setSelectedSector] = useState<SectorFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [readerModalOpen, setReaderModalOpen] = useState(false);

  const sectorCounts = useMemo(() => {
    const counts: Record<SectorFilter, number> = {
      All: THIRTY_UNDER_THIRTY_FOUNDERS.length,
      'AI, Robotics & Tech': 0,
      'SaaS & Digital Platforms': 0,
      'FMCG & Global Exports': 0,
      'Education & Research': 0,
      'Real Estate, Design & Media': 0,
    };

    for (const founder of THIRTY_UNDER_THIRTY_FOUNDERS) {
      for (const tag of founder.sectorTags) {
        counts[tag] += 1;
      }
    }
    return counts;
  }, []);

  const filteredDirectory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return THIRTY_UNDER_THIRTY_FOUNDERS.filter((founder) => {
      const matchesSector =
        selectedSector === 'All' || founder.sectorTags.includes(selectedSector);
      if (!matchesSector) return false;
      if (!query) return true;

      const haystack = [
        founder.name,
        founder.designation,
        founder.company || '',
        founder.industry,
        founder.shortLocation || '',
        founder.profileTheme,
        ...founder.metadata.map((m) => `${m.label} ${m.value}`),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [selectedSector, searchQuery]);

  const scrollToElement = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full bg-white text-[#111111]">
      {readerModalOpen && (
        <PdfMagazineReader
          pdfUrl={THIRTY_UNDER_THIRTY_PDF_URL}
          title="Founder Bytes – 30 Under 30 India 2026"
          issueLabel="VOL 01 · ISSUE 01 · OCT 2026"
          mode="modal"
          onClose={() => setReaderModalOpen(false)}
        />
      )}
      {/* ===================================================================== */}
      {/* 1. HERO SECTION — EDITORIAL MAGAZINE COVER & INTRODUCTION             */}
      {/* ===================================================================== */}
      <section
        aria-labelledby="edition-hero-title"
        className="w-full bg-[#0A0A0A] text-white border-b border-neutral-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-14 lg:pt-10 lg:pb-20">
          {/* Breadcrumb Trail */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-8 lg:mb-10"
          >
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-neutral-600">/</span>
            <button
              type="button"
              onClick={onNavigateMagazine}
              className="hover:text-white transition-colors cursor-pointer"
            >
              The Founder Magazine
            </button>
            <span className="text-neutral-600">/</span>
            <span className="text-[#F5B800] font-semibold">30 Under 30 India 2026</span>
          </nav>

          {/* 12-Column Editorial Hero Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Editorial Narrative (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Edition Kicker */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono uppercase tracking-[0.2em] text-[#F5B800] font-bold mb-4">
                  <span>{THIRTY_UNDER_THIRTY_META.editionLabel}</span>
                  <span className="text-neutral-600">|</span>
                  <span className="text-neutral-300">Official Digital Edition</span>
                </div>

                {/* Single Clear Page H1 */}
                <h1
                  id="edition-hero-title"
                  className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.06] text-white"
                >
                  Founder Bytes – 30 Under 30 India 2026
                </h1>

                {/* Editorial Deck */}
                <p className="font-serif italic text-xl sm:text-2xl lg:text-[1.75rem] text-[#F5B800] mt-3 leading-snug">
                  {THIRTY_UNDER_THIRTY_INTRO.headline}
                </p>

                <div className="w-16 h-px bg-[#F5B800] my-7" />

                {/* Full Introduction Copy */}
                <div className="space-y-4 text-[15px] sm:text-base lg:text-[17px] leading-[1.78] text-neutral-200 max-w-2xl font-sans">
                  {THIRTY_UNDER_THIRTY_INTRO.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Featured Lead Statement (Hairline Rules, Zero Left Accent Bar) */}
                <div className="mt-7 py-5 border-t border-b border-neutral-800 max-w-2xl">
                  <p className="font-serif text-lg sm:text-xl font-medium text-white leading-relaxed">
                    {THIRTY_UNDER_THIRTY_INTRO.leadStatement}
                  </p>
                </div>

                {/* Edition Index Facts (Clean Unboxed Typographic Bar) */}
                <dl className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl text-xs font-mono">
                  <div>
                    <dt className="text-neutral-500 uppercase tracking-widest mb-1">Publication</dt>
                    <dd className="text-neutral-100 font-semibold">The Founder Magazine</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 uppercase tracking-widest mb-1">Edition</dt>
                    <dd className="text-neutral-100 font-semibold">Oct 2026 · Vol 01, Issue 01</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 uppercase tracking-widest mb-1">Featured Profiles</dt>
                    <dd className="text-[#F5B800] font-bold tabular-nums">
                      {THIRTY_UNDER_THIRTY_FOUNDERS.length} Individual Profiles
                    </dd>
                  </div>
                </dl>

                {/* Primary Hero Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => setReaderModalOpen(true)}
                    className="inline-flex items-center gap-2.5 bg-[#F5B800] hover:bg-[#DF9E00] text-[#111111] font-mono text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read 38-Page Magazine PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToElement('founders-directory')}
                    className="inline-flex items-center gap-2.5 bg-transparent hover:bg-neutral-900 text-white border border-neutral-700 hover:border-neutral-500 font-mono text-xs font-bold uppercase tracking-wider px-6 py-3.5 transition-colors cursor-pointer"
                  >
                    <span>Explore Founders Directory</span>
                    <ArrowDown className="w-3.5 h-3.5 text-[#F5B800]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Supplied Official Cover Art (5 Columns — Exact Uncropped Original) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
              <figure className="w-full max-w-[440px]">
                <div
                  onClick={() => setReaderModalOpen(true)}
                  className="border border-neutral-800 bg-black p-2 shadow-[0_28px_70px_rgba(0,0,0,0.75)] cursor-pointer group transition-transform hover:-translate-y-0.5"
                  title="Click to read the full 38-page magazine"
                >
                  <img
                    src={THIRTY_UNDER_THIRTY_META.coverImagePath}
                    alt={THIRTY_UNDER_THIRTY_META.coverImageAlt}
                    className="w-full h-auto block"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
                  <span>Official Cover · Click to Read 38-Page Edition</span>
                  <span className="text-[#F5B800] shrink-0">VOL 01 · ISSUE 01</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. ABOUT FOUNDER BYTES — EDITORIAL MASTHEAD SECTION                   */}
      {/* ===================================================================== */}
      <section
        id="about-edition"
        aria-labelledby="about-founder-bytes-heading"
        className="w-full bg-[#F9F7F2] border-b border-neutral-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Publication Mark & Heading */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3.5 mb-5">
                <div
                  aria-hidden="true"
                  className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center font-serif text-3xl font-bold leading-none select-none shrink-0"
                >
                  <span>F</span>
                  <span className="text-[#F5B800]">.</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9A6B00] font-bold">
                    Publication Dossier
                  </div>
                  <div className="text-sm font-black uppercase tracking-wider text-neutral-900">
                    {ABOUT_FOUNDER_BYTES.magazineTitle}
                  </div>
                  <div className="text-xs font-serif italic text-neutral-600">
                    {ABOUT_FOUNDER_BYTES.magazineTagline}
                  </div>
                </div>
              </div>

              <h2
                id="about-founder-bytes-heading"
                className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950"
              >
                {ABOUT_FOUNDER_BYTES.heading}
              </h2>
            </div>

            {/* Publication Narrative & Internal Links */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-4 font-serif text-lg leading-[1.78] text-neutral-800">
                {ABOUT_FOUNDER_BYTES.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-5 border-t border-neutral-300/80 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-mono uppercase tracking-wider">
                <button
                  type="button"
                  onClick={onNavigateMagazine}
                  className="inline-flex items-center gap-1.5 font-bold text-neutral-900 hover:text-[#9A6B00] transition-colors cursor-pointer"
                >
                  <span>The Founder Magazine</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-neutral-300">|</span>
                <button
                  type="button"
                  onClick={onNavigateNominations}
                  className="inline-flex items-center gap-1.5 font-bold text-neutral-900 hover:text-[#9A6B00] transition-colors cursor-pointer"
                >
                  <span>Submit a Nomination</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-neutral-300">|</span>
                <button
                  type="button"
                  onClick={() => onNavigatePolicy('about')}
                  className="inline-flex items-center gap-1.5 font-semibold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  <span>Editorial Standards</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. FOUNDERS DIRECTORY & SECTOR FILTER                                 */}
      {/* ===================================================================== */}
      <section
        id="founders-directory"
        aria-labelledby="founders-directory-heading"
        className="w-full bg-white border-b border-neutral-200 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b-2 border-neutral-950">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9A6B00] font-bold mb-2">
                Directory & Sector Index · October 2026 Edition
              </div>
              <h2
                id="founders-directory-heading"
                className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-neutral-950"
              >
                Featured Founders Directory
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl">
                Explore the founders and leaders featured in Founder Bytes – 30 Under 30 India 2026 by industry sector, or select any card to jump directly to their complete editorial profile.
              </p>
            </div>

            {/* Directory Search Input */}
            <div className="w-full lg:w-80">
              <label htmlFor="directory-founder-search" className="sr-only">
                Filter founders by name, company, city or industry
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="directory-founder-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search founder, company, city..."
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#FAF9F6] border border-neutral-300 focus:border-neutral-950 focus:bg-white focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear founder search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Sector Filter Bar */}
          <div
            role="group"
            aria-label="Filter featured founders by industry sector"
            className="py-5 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              {SECTOR_FILTERS.map((sector) => {
                const isActive = selectedSector === sector;
                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => setSelectedSector(sector)}
                    aria-pressed={isActive}
                    className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-[#111111] text-white border-[#111111] font-bold'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900 hover:text-neutral-950'
                    }`}
                  >
                    <span>{sector}</span>
                    <span
                      className={`ml-2 tabular-nums ${
                        isActive ? 'text-[#F5B800]' : 'text-neutral-400'
                      }`}
                    >
                      ({sectorCounts[sector]})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono text-neutral-500 tabular-nums">
              Showing {filteredDirectory.length} of {THIRTY_UNDER_THIRTY_FOUNDERS.length} featured profiles
            </div>
          </div>

          {/* Architectural Hairline Catalogue Grid */}
          {filteredDirectory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-neutral-200">
              {filteredDirectory.map((founder) => (
                <div
                  key={founder.id}
                  className="group border-r border-b border-neutral-200 p-6 sm:p-7 flex flex-col justify-between bg-white hover:bg-[#FBF9F4] transition-colors"
                >
                  <div>
                    {/* Index & Location Line (Zero Pills) */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-neutral-100 text-[11px] font-mono">
                      <span className="font-bold text-[#9A6B00] tracking-[0.18em] tabular-nums">
                        NO. {founder.numberLabel}
                      </span>
                      {founder.shortLocation && (
                        <span className="text-neutral-500 truncate">
                          {founder.shortLocation}
                        </span>
                      )}
                    </div>

                    {/* Founder Identity */}
                    <h3 className="font-serif text-2xl font-bold text-neutral-950 tracking-tight leading-snug group-hover:text-black">
                      <a
                        href={`#${founder.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToElement(founder.id);
                        }}
                        className="hover:underline decoration-[#F5B800] decoration-2 underline-offset-4"
                      >
                        {founder.name}
                      </a>
                    </h3>

                    <p className="text-sm font-semibold text-neutral-800 mt-1">
                      {founder.designation}
                    </p>

                    <p className="text-xs font-mono text-neutral-500 mt-2 leading-relaxed">
                      {founder.industry}
                    </p>

                    <p className="text-sm text-neutral-700 mt-3.5 leading-relaxed">
                      {founder.summary}
                    </p>
                  </div>

                  {/* Theme & Anchor Link */}
                  <div className="mt-6 pt-4 border-t border-neutral-200/80">
                    <p className="font-serif italic text-xs text-neutral-600 leading-relaxed mb-3">
                      “{founder.profileTheme}”
                    </p>
                    <a
                      href={`#${founder.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToElement(founder.id);
                      }}
                      className="inline-flex items-center justify-between w-full text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 group-hover:text-[#9A6B00] transition-colors"
                    >
                      <span>Read Full Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 px-6 text-center border-x border-b border-neutral-200 bg-[#FAF9F6]">
              <p className="font-serif text-xl text-neutral-900">
                No featured founders match your current filter.
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                Reset the sector filter or clear the search field to browse all 17 profiles.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSector('All');
                  setSearchQuery('');
                }}
                className="mt-5 px-5 py-2.5 bg-[#111111] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Show All 17 Founders
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. INDIVIDUAL DETAILED FOUNDER PROFILE SECTIONS (ALL 17 IN FULL HTML) */}
      {/* ===================================================================== */}
      <section
        id="founder-profiles"
        aria-labelledby="detailed-profiles-heading"
        className="w-full bg-white scroll-mt-16"
      >
        {/* Profiles Section Masthead */}
        <div className="w-full bg-[#F9F7F2] border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9A6B00] font-bold mb-2">
                  Complete Editorial Profiles · 01 — 17
                </div>
                <h2
                  id="detailed-profiles-heading"
                  className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-neutral-950"
                >
                  The Featured Founders
                </h2>
              </div>
              <p className="text-sm text-neutral-600 max-w-md md:text-right">
                Each profile is presented individually as documented in the October 2026, Volume 01, Issue 01 digital edition of Founder Bytes – The Founder Magazine.
              </p>
            </div>

            {/* Quick Numbered Jump Strip */}
            <nav
              aria-label="Quick jump to founder profile"
              className="mt-7 pt-5 border-t border-neutral-300/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono"
            >
              <span className="text-neutral-500 uppercase tracking-wider font-bold mr-1">
                Jump To:
              </span>
              {THIRTY_UNDER_THIRTY_FOUNDERS.map((founder) => (
                <a
                  key={founder.id}
                  href={`#${founder.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToElement(founder.id);
                  }}
                  className="text-neutral-700 hover:text-[#9A6B00] transition-colors whitespace-nowrap"
                >
                  <span className="text-neutral-400 tabular-nums mr-1">{founder.numberLabel}.</span>
                  <span className="font-semibold">{founder.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* All 17 Individual Crawlable Profile Articles */}
        <div className="divide-y divide-neutral-200">
          {THIRTY_UNDER_THIRTY_FOUNDERS.map((founder, idx) => {
            const isTintedBand = idx % 2 === 1;
            return (
              <article
                key={founder.id}
                id={founder.id}
                aria-labelledby={`${founder.id}-name`}
                className={`w-full scroll-mt-20 ${
                  isTintedBand ? 'bg-[#FBF9F5]' : 'bg-white'
                }`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    {/* Left Column: Editorial Numbering & Accession Metadata Dossier (4 cols) */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-24">
                      <div className="flex items-baseline justify-between border-b border-neutral-900 pb-4 mb-6">
                        <span
                          aria-hidden="true"
                          className="font-serif text-5xl sm:text-6xl font-light tracking-tight text-neutral-950 tabular-nums leading-none"
                        >
                          {founder.numberLabel}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#9A6B00] font-bold">
                          30 Under 30 · 2026
                        </span>
                      </div>

                      <dl className="divide-y divide-neutral-200/90 text-sm">
                        {founder.metadata.map((item) => (
                          <div key={item.label} className="py-3 first:pt-0">
                            <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500 font-bold mb-1">
                              {item.label}
                            </dt>
                            <dd className="text-neutral-900 font-medium leading-snug">
                              {item.href ? (
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-neutral-950 underline decoration-[#F5B800] decoration-2 underline-offset-4 hover:text-[#9A6B00] transition-colors"
                                >
                                  <span>{item.value}</span>
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                </a>
                              ) : (
                                item.value
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </aside>

                    {/* Right Column: Full Founder Editorial Profile (8 cols) */}
                    <div className="lg:col-span-8">
                      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-2">
                        Featured Profile {founder.numberLabel} of {THIRTY_UNDER_THIRTY_FOUNDERS.length}
                      </div>

                      <h3
                        id={`${founder.id}-name`}
                        className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-neutral-950 tracking-tight leading-tight"
                      >
                        {founder.name}
                      </h3>

                      <p className="text-base sm:text-lg font-semibold text-neutral-700 mt-1.5">
                        {founder.designation}
                      </p>

                      <div className="w-12 h-0.5 bg-[#F5B800] my-6" />

                      {/* Editorial Body Paragraphs */}
                      <div className="space-y-4 font-serif text-[17px] sm:text-[18.5px] leading-[1.82] text-neutral-800 max-w-3xl">
                        {founder.paragraphs.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>

                      {/* Profile Theme Statement (Top & Bottom Hairline Rules) */}
                      <div className="mt-8 py-5 border-t border-b border-neutral-300/80 max-w-3xl">
                        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9A6B00] font-bold mb-1.5">
                          Profile Theme
                        </div>
                        <p className="font-serif italic text-lg sm:text-xl text-neutral-950 leading-relaxed">
                          “{founder.profileTheme}”
                        </p>
                      </div>

                      {/* Subtle Profile Navigation Footer */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 max-w-3xl text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => scrollToElement('founders-directory')}
                          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-950 uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>Back to Directory</span>
                        </button>

                        {idx < THIRTY_UNDER_THIRTY_FOUNDERS.length - 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              scrollToElement(THIRTY_UNDER_THIRTY_FOUNDERS[idx + 1].id)
                            }
                            className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-[#9A6B00] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <span>
                              Next: {THIRTY_UNDER_THIRTY_FOUNDERS[idx + 1].name}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. EDITORIAL CLOSING SECTION                                          */}
      {/* ===================================================================== */}
      <section
        aria-labelledby="closing-editorial-heading"
        className="w-full bg-[#0A0A0A] text-white border-t border-neutral-800"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#F5B800] font-bold mb-4">
            {THIRTY_UNDER_THIRTY_META.editionLabel}
          </div>

          <h2
            id="closing-editorial-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            {CLOSING_EDITORIAL.heading}
          </h2>

          <div className="mt-8 space-y-4 text-[15px] sm:text-base lg:text-[17px] leading-[1.82] text-neutral-300 max-w-3xl mx-auto">
            {CLOSING_EDITORIAL.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Closing Signature Quote */}
          <div className="mt-10 py-7 border-t border-b border-neutral-800 max-w-2xl mx-auto">
            <p className="font-serif italic text-xl sm:text-2xl lg:text-[1.7rem] text-[#F5B800] leading-snug">
              {CLOSING_EDITORIAL.closingLine}
            </p>
          </div>

          {/* Official Publication Sign-Off */}
          <div className="mt-10 flex flex-col items-center">
            <div
              aria-hidden="true"
              className="w-12 h-12 border border-neutral-700 bg-[#111111] text-white flex items-center justify-center font-serif text-3xl font-bold leading-none mb-4 select-none"
            >
              <span>F</span>
              <span className="text-[#F5B800]">.</span>
            </div>
            <div className="text-sm sm:text-base font-black uppercase tracking-[0.16em] text-white">
              {THIRTY_UNDER_THIRTY_META.magazineTitle}
            </div>
            <div className="text-xs sm:text-sm font-serif italic text-neutral-400 mt-1">
              {THIRTY_UNDER_THIRTY_META.magazineSubtitle}
            </div>
            <a
              href="https://founderbytes.in"
              className="mt-3 text-xs font-mono text-[#F5B800] hover:text-white underline underline-offset-4 transition-colors"
            >
              https://founderbytes.in
            </a>
          </div>

          {/* Internal Editorial Navigation Links */}
          <div className="mt-12 pt-8 border-t border-neutral-800/90 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onNavigateNominations}
              className="inline-flex items-center gap-2 bg-[#F5B800] hover:bg-[#DF9E00] text-[#111111] font-mono text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 transition-colors cursor-pointer"
            >
              <span>Nominate for Upcoming Editions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onNavigateMagazine}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-neutral-900 text-white border border-neutral-700 font-mono text-xs font-bold uppercase tracking-wider px-5 py-3.5 transition-colors cursor-pointer"
            >
              <span>Explore The Founder Magazine</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('founders')}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 font-mono text-xs font-bold uppercase tracking-wider px-5 py-3.5 transition-colors cursor-pointer"
            >
              <span>More Founder Stories</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
