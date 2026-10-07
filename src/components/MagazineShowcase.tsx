import React from 'react';
import { MagazineIssue } from '../types';
import { ArrowRight, Sparkles, BookOpen, Award, Compass } from 'lucide-react';

interface MagazineShowcaseProps {
  issue: MagazineIssue;
  onNavigateMagazine: () => void;
  onSelectArticle: (slug: string) => void;
  onOpenFlipbook?: () => void;
}

export const MagazineShowcase: React.FC<MagazineShowcaseProps> = ({
  issue,
  onNavigateMagazine,
  onSelectArticle,
  onOpenFlipbook,
}) => {
  return (
    <section className="w-full py-12 bg-[#111111] text-white border-b border-neutral-800 relative overflow-hidden">
      {/* Editorial backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Magazine Kicker Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-8 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F5B800] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ARCHIVAL PRINT & DIGITAL MAGAZINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
              THE FOUNDER MAGAZINE
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-sans">
              India’s Business & Startup Magazine · Quarterly Issue 01 (Fall 2026 Edition)
            </p>
          </div>

          {/* Quick links to special packages */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateMagazine}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-[#F5B800] transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#F5B800]" />
              <span>30 Under 30</span>
            </button>
            <span className="text-neutral-700">|</span>
            <button
              onClick={onNavigateMagazine}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-[#F5B800] transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#F5B800]" />
              <span>Founders to Watch</span>
            </button>
            <span className="text-neutral-700">|</span>
            <button
              onClick={onNavigateMagazine}
              className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-[#F5B800] hover:text-white transition-colors group"
            >
              <span>Explore All Issues</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Magazine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cover Presentation (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onClick={onOpenFlipbook || onNavigateMagazine}
              className="group relative cursor-pointer max-w-sm w-full transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] bg-neutral-900 shadow-2xl border border-neutral-700 overflow-hidden">
                <img
                  src={issue.coverImage}
                  alt={`${issue.title} Cover`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />

                {/* Magazine Masthead Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/85 p-6 flex flex-col justify-between">
                  <div className="text-center pt-2">
                    <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#F5B800] font-bold">
                      {issue.issueNumber} · {issue.season}
                    </div>
                    <div className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white mt-0.5">
                      THE FOUNDER
                    </div>
                    <div className="text-[9px] font-sans tracking-[0.2em] text-neutral-300 uppercase">
                      INDIA’S BUSINESS & STARTUP MAGAZINE
                    </div>
                  </div>

                  <div className="pb-1">
                    <div className="inline-block bg-[#F5B800] text-black font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 mb-1.5 font-mono">
                      COVER FEATURE
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                      {issue.dek}
                    </p>
                  </div>
                </div>

                {/* Spine sheen */}
                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
              </div>

              <div className="mt-2.5 text-center">
                <span className="text-xs text-neutral-400 group-hover:text-[#F5B800] font-mono transition-colors">
                  [ Click to read digital edition / view table of contents ]
                </span>
              </div>
            </div>
          </div>

          {/* Issue Highlights & Founder Features (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-neutral-800 pb-3">
              <span className="text-[11px] font-mono text-[#F5B800] uppercase tracking-widest font-bold">
                CURATED EDITORIAL DOSSIER
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                {issue.theme}
              </h3>
            </div>

            {/* Featured Founder Stories */}
            <div className="space-y-3">
              {issue.featuredFounders.map((founder) => (
                <div
                  key={founder.name}
                  onClick={() => onSelectArticle(founder.slug)}
                  className="group p-3.5 bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-[#F5B800] transition-colors">
                        {founder.name}
                      </span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-xs text-neutral-300 font-medium">{founder.company}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#F5B800] tabular-nums font-semibold">
                      {founder.valuationOrMetric}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-1 group-hover:text-neutral-200 transition-colors">
                    {founder.storyHeadline}
                  </p>
                </div>
              ))}
            </div>

            {/* Table of contents snapshot */}
            <div className="pt-1">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2 font-bold">
                TABLE OF CONTENTS HIGHLIGHTS:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                {issue.tableOfContents.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-neutral-950 border border-neutral-850">
                    <span className="truncate pr-2 font-medium">{item.title}</span>
                    <span className="font-mono text-neutral-500 shrink-0">p. {item.page}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateMagazine}
                className="px-5 py-2.5 bg-[#F5B800] hover:bg-[#E0A700] text-black font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 font-mono"
              >
                <BookOpen className="w-4 h-4" />
                <span>EXPLORE THE MAGAZINE</span>
              </button>
              <button
                onClick={onNavigateMagazine}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-neutral-700 transition-colors font-mono"
              >
                Print Hardcover Inquiries
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
