import React from 'react';
import { FounderSpotlight } from '../types/cms';
import { SEOHead } from './SEOHead';
import { 
  Building, 
  ExternalLink, 
  ArrowLeft, 
  Quote, 
  Share2, 
  Check, 
  Sparkles,
  Award
} from 'lucide-react';

interface FounderProfilePageProps {
  founder: FounderSpotlight;
  onNavigateHome: () => void;
  onNavigateFounders?: () => void;
}

export const FounderProfilePage: React.FC<FounderProfilePageProps> = ({
  founder,
  onNavigateHome,
  onNavigateFounders,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="min-h-screen bg-white text-neutral-900 pb-20">
      <SEOHead
        title={`${founder.founder_name} — Founder Spotlight | Founder Bytes`}
        description={founder.short_bio}
        canonicalUrl={`https://founderbytes.in/founders/${founder.slug}`}
      />

      {/* Top Breadcrumb & Editorial Header */}
      <div className="w-full bg-[#111111] text-white py-10 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F5B800]">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6 uppercase tracking-wider">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#F5B800] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>FRONT PAGE</span>
            </button>
            <span>/</span>
            {onNavigateFounders ? (
              <button
                onClick={onNavigateFounders}
                className="hover:text-[#F5B800] transition-colors cursor-pointer"
              >
                FOUNDERS
              </button>
            ) : (
              <span>FOUNDERS</span>
            )}
            <span>/</span>
            <span className="text-[#F5B800] font-bold truncate max-w-[200px] sm:max-w-none">
              {founder.founder_name.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-800 text-[#F5B800] text-[10px] font-mono uppercase tracking-widest font-bold mb-3 border border-neutral-700">
                <Sparkles className="w-3 h-3 text-[#F5B800]" />
                <span>FOUNDER BYTES SPOTLIGHT DOSSIER</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-serif leading-none">
                {founder.founder_name}
              </h1>
              <div className="flex items-center gap-2 text-sm sm:text-base font-mono text-neutral-300 mt-3">
                <span className="font-bold text-white">{founder.designation}</span>
                <span>·</span>
                <span className="text-[#F5B800] font-bold">{founder.company_name}</span>
                <span className="hidden sm:inline">·</span>
                <span className="text-neutral-400 text-xs hidden sm:inline uppercase">
                  {founder.industry}
                </span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="self-start md:self-end px-4 py-2 bg-neutral-900 border border-neutral-700 text-white hover:border-[#F5B800] hover:text-[#F5B800] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>COPIED DOSSIER LINK</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>SHARE SPOTLIGHT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* LEFT COLUMN: Large Founder Portrait & Quick Factsheet (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Large Founder Photograph */}
            <div className="aspect-[4/5] bg-neutral-100 border-2 border-black overflow-hidden relative shadow-md">
              <img
                src={founder.founder_photo}
                alt={founder.founder_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest bg-[#F5B800] text-black px-2 py-0.5 font-bold">
                  {founder.industry}
                </span>
              </div>
            </div>

            {/* Quick Factsheet Dossier */}
            <div className="border border-neutral-300 p-5 bg-neutral-50 space-y-3 font-mono text-xs">
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 pb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#DF9E00]" />
                <span>VENTURE FACTSHEET</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Founder:</span>
                <span className="font-bold text-neutral-900">{founder.founder_name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Enterprise:</span>
                <span className="font-bold text-neutral-900">{founder.company_name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Role:</span>
                <span className="font-bold text-neutral-900">{founder.designation}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Domain:</span>
                <span className="font-bold text-neutral-900">{founder.industry}</span>
              </div>

              {/* External Links */}
              <div className="pt-2 flex flex-col gap-2">
                {founder.website_url && (
                  <a
                    href={founder.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white border border-neutral-300 hover:border-black font-bold text-neutral-900 flex items-center justify-between text-xs transition-colors"
                  >
                    <span>Visit Company Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {founder.linkedin_url && (
                  <a
                    href={founder.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white border border-neutral-300 hover:border-[#0A66C2] text-neutral-800 hover:text-[#0A66C2] font-bold flex items-center justify-between text-xs transition-colors"
                  >
                    <span>LinkedIn Executive Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {founder.instagram_url && (
                  <a
                    href={founder.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white border border-neutral-300 hover:border-pink-600 text-neutral-800 hover:text-pink-600 font-bold flex items-center justify-between text-xs transition-colors"
                  >
                    <span>Instagram Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Primary CTA */}
              {founder.cta_url && (
                <div className="pt-2">
                  <a
                    href={founder.cta_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-black text-white hover:bg-[#DF9E00] hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <span>{founder.cta_text || 'Connect With Founder'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Editorial Story & Pull Quote (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Executive Bio */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-2">
                EXECUTIVE SUMMARY
              </div>
              <p className="text-lg sm:text-xl font-serif text-neutral-900 leading-relaxed font-medium">
                {founder.short_bio}
              </p>
            </div>

            {/* Featured Quote */}
            {founder.featured_quote && (
              <div className="p-6 sm:p-8 bg-neutral-900 text-white border-l-4 border-[#F5B800] relative">
                <Quote className="w-8 h-8 text-[#F5B800] opacity-40 absolute top-4 right-4" />
                <p className="text-lg sm:text-2xl font-serif italic font-bold leading-relaxed relative z-10">
                  "{founder.featured_quote}"
                </p>
                <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-mono text-neutral-400">
                  — <span className="text-white font-bold">{founder.founder_name}</span>, {founder.designation} of {founder.company_name}
                </div>
              </div>
            )}

            {/* Full Founder Story */}
            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold border-b border-neutral-200 pb-1">
                VENTURE ORIGIN & ARCHITECTURE
              </div>
              <div className="font-serif text-base sm:text-lg text-neutral-800 leading-relaxed whitespace-pre-line space-y-4">
                {founder.founder_story}
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="p-6 bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-bold uppercase text-neutral-500">
                  FOUNDER BYTES EDITORIAL NETWORK
                </div>
                <div className="text-sm font-serif text-neutral-800 font-bold mt-0.5">
                  Explore other high-growth Indian founders and venture creators.
                </div>
              </div>
              <button
                onClick={onNavigateHome}
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
              >
                Back to Front Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
