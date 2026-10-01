import React from 'react';
import { ArrowLeft, Shield, Mail, FileText, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { AUTHORS } from '../data/mockData';

export type PolicyPageType =
  | 'about'
  | 'editorial-policy'
  | 'corrections-policy'
  | 'ethics-policy'
  | 'contact'
  | 'authors'
  | 'advertise'
  | 'privacy-policy'
  | 'terms'
  | 'cookie-policy';

interface PolicyPageProps {
  pageType: PolicyPageType;
  onNavigateBack: () => void;
  onSelectAuthor?: (authorSlug: string) => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({
  pageType,
  onNavigateBack,
  onSelectAuthor,
}) => {
  const contentConfig: Record<PolicyPageType, { title: string; subtitle: string; date: string }> = {
    about: {
      title: 'About Founder Bytes',
      subtitle: 'India’s Business & Startup Magazine · Documenting Bharat’s Global Builders',
      date: 'Updated October 2026',
    },
    'editorial-policy': {
      title: 'Editorial Standards & Verification Policy',
      subtitle: 'Guidelines governing our newsroom independence, source vetting, and journalistic integrity',
      date: 'Published in accordance with Google News Transparency Guidelines',
    },
    'corrections-policy': {
      title: 'Corrections & Retractions Policy',
      subtitle: 'Our commitment to prompt, transparent factual rectification across all digital channels',
      date: 'Permanent Newsroom Operating Protocol',
    },
    'ethics-policy': {
      title: 'Code of Ethics & Conflict of Interest',
      subtitle: 'Financial disclosures, independence from commercial partnerships, and gift bans',
      date: 'Adopted January 2024 · Current Version 2026',
    },
    contact: {
      title: 'Contact the Newsroom & Publisher',
      subtitle: 'Direct bureau contacts, editorial masthead, press inquiries, and physical offices',
      date: 'Bengaluru · Mumbai · New Delhi',
    },
    authors: {
      title: 'Founder Bytes Editorial Masthead & Bylines',
      subtitle: 'Meet the reporters, editors, and researchers driving our coverage',
      date: 'Verified Editorial Team',
    },
    advertise: {
      title: 'Partner with Founder Bytes',
      subtitle: 'High-intent brand features, executive newsletters, and print magazine sponsorships',
      date: 'Media Kit 2026',
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      subtitle: 'Data governance in compliance with the Digital Personal Data Protection (DPDP) Act of India',
      date: 'Effective 2026',
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Rules governing readership, syndication, and intellectual property usage',
      date: 'Founder Bytes Media',
    },
    'cookie-policy': {
      title: 'Cookie & Tracking Policy',
      subtitle: 'How Founder Bytes uses session tokens and essential functional cookies',
      date: 'Transparent Data Standards',
    },
  };

  const current = contentConfig[pageType] || contentConfig['about'];

  return (
    <div className="w-full bg-white min-h-screen pb-16">
      {/* Top back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* Policy Page Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 py-8 border-b border-neutral-200">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#DF9E00] font-bold mb-2">
          FOUNDER BYTES · EDITORIAL TRANSPARENCY
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
          {current.title}
        </h1>
        <p className="text-base text-neutral-600 mt-2 font-serif leading-relaxed">
          {current.subtitle}
        </p>
        <div className="text-xs font-mono text-neutral-400 mt-4">
          {current.date}
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-neutral-800 space-y-8 text-sm sm:text-base leading-relaxed">
        {pageType === 'about' && (
          <div className="space-y-6">
            <p className="text-lg text-neutral-900 font-medium">
              FOUNDER BYTES (founderbytes.in) is India’s premier digital business, venture capital, and startup media publication, and the home of <em>The Founder Magazine</em>.
            </p>
            <p>
              We cover the transformative companies, technologies, and entrepreneurs redefining the Indian economy. From early-stage venture funding and sovereign artificial intelligence initiatives to manufacturing corridors and public market listings, our newsroom provides rigorous, factual analysis without superficial sensationalism.
            </p>
            <h2 className="text-xl font-bold text-neutral-900 pt-4 border-t border-neutral-200">
              Our Publishing Mandate
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Zero Clickbait:</strong> Headlines report verified reality, never manufactured curiosity gaps.</li>
              <li><strong>Multi-Source Verification:</strong> We require independent corroboration from regulatory filings, audited disclosures, or primary on-record interviews.</li>
              <li><strong>Strict Separation of Editorial & Commercial:</strong> Sponsored articles and partner features are conspicuously identified and never mimic news reporting.</li>
              <li><strong>Permanent Digital Archive:</strong> Canonical URLs, clear publication timestamps, and permanent correction notices protect reader trust.</li>
            </ul>
          </div>
        )}

        {pageType === 'editorial-policy' && (
          <div className="space-y-6">
            <div className="p-4 bg-neutral-50 border border-neutral-200 flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#DF9E00] shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-700">
                <span className="font-bold block text-neutral-900 uppercase">Google News Transparency Standard:</span>
                Founder Bytes operates as an independent news media organization. Our editorial staff makes coverage decisions independent of investors, advertisers, or corporate partners.
              </div>
            </div>

            <h2 className="text-lg font-bold text-neutral-900">1. Verification Standard</h2>
            <p>
              Before publishing any corporate transaction, funding round, acquisition, or executive appointment, our reporters verify facts using primary documentation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Corporate registry filings with the Ministry of Corporate Affairs (MCA / RoC).</li>
              <li>Securities disclosures filed with the Securities and Exchange Board of India (SEBI), NSE, or BSE.</li>
              <li>On-the-record statements from corporate officers or authorized legal representatives.</li>
            </ul>

            <h2 className="text-lg font-bold text-neutral-900">2. Timestamp Transparency</h2>
            <p>
              Every article displays its initial publication date and time in India Standard Time (Asia/Kolkata). We never artificially modify published timestamps to simulate freshness. When articles receive substantive new information or corrections, an explicit &ldquo;Updated: [Date/Time]&rdquo; line is added alongside an editor's note.
            </p>

            <h2 className="text-lg font-bold text-neutral-900">3. Anonymous Sources</h2>
            <p>
              Founder Bytes permits anonymous sourcing solely when the information is of critical public or financial import, the source faces professional retaliation, and the reporting is corroborated by at least one independent primary document or secondary source.
            </p>
          </div>
        )}

        {pageType === 'corrections-policy' && (
          <div className="space-y-6">
            <p>
              Factual precision is paramount. When Founder Bytes makes an error in fact, transcription, or context, we correct it promptly and conspicuously.
            </p>
            <h2 className="text-lg font-bold text-neutral-900">How Corrections Are Displayed</h2>
            <p>
              Corrections appear at the top or conclusion of the corrected article, detailing what was altered, the date and time of the modification, and the correct information.
            </p>
            <div className="p-4 bg-neutral-100 font-mono text-xs text-neutral-800 border-l-4 border-[#F5B800]">
              Example: &ldquo;Correction (Oct 1, 2026, 9:02 PM IST): An earlier version of this article misstated the total valuation of the Series B syndicate. The round closed at $180M, not $150M. The story has been updated accordingly.&rdquo;
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Submitting a Correction</h2>
            <p>
              Readers, founders, or company representatives who identify an error are requested to email our corrections desk at:
              <br />
              <a href="mailto:corrections@founderbytes.in" className="text-[#DF9E00] font-bold hover:underline">
                corrections@founderbytes.in
              </a>
            </p>
          </div>
        )}

        {pageType === 'ethics-policy' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-neutral-900">1. Financial Independence</h2>
            <p>
              Editorial staff are prohibited from owning shares, options, or debt instruments in private startups they actively cover. For publicly listed equities, reporters must disclose personal holdings when reporting on relevant market shifts.
            </p>
            <h2 className="text-lg font-bold text-neutral-900">2. Gifts and Hospitality</h2>
            <p>
              Founder Bytes journalists do not accept gifts, cash considerations, paid travel accommodations, or equity favors from companies, venture capital syndicates, or PR agencies.
            </p>
            <h2 className="text-lg font-bold text-neutral-900">3. Sponsored Content Demarcation</h2>
            <p>
              Under no circumstance will commercial content be published under an editorial byline or disguised as independent reporting. Sponsored stories are unmistakably badged with &ldquo;SPONSORED&rdquo; or &ldquo;PARTNER CONTENT&rdquo;.
            </p>
          </div>
        )}

        {pageType === 'contact' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2">
                  <Mail className="w-4 h-4 text-[#DF9E00]" />
                  <span>Newsroom Editorial Desks</span>
                </div>
                <div className="text-xs space-y-2 text-neutral-700">
                  <div><strong>News Tips & Leaks:</strong> tips@founderbytes.in</div>
                  <div><strong>Press Releases:</strong> press@founderbytes.in</div>
                  <div><strong>Corrections Desk:</strong> corrections@founderbytes.in</div>
                  <div><strong>Founder Inquiries:</strong> founders@founderbytes.in</div>
                </div>
              </div>

              <div className="p-5 bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2">
                  <MapPin className="w-4 h-4 text-[#DF9E00]" />
                  <span>Physical Newsroom & Bureaus</span>
                </div>
                <div className="text-xs text-neutral-700 space-y-1">
                  <div className="font-semibold">Founder Bytes Media Pvt. Ltd.</div>
                  <div>Indiranagar 100ft Road Tech Corridor,</div>
                  <div>Bengaluru, Karnataka 560038, India</div>
                  <div className="text-neutral-500 pt-2 font-mono">GST / Corporate ID: Verified MCA</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {pageType === 'authors' && (
          <div className="space-y-6">
            <p>
              Every article on Founder Bytes is penned by a professional editor or subject-matter specialist with public credentials and verified journalistic background.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {Object.values(AUTHORS).map((author) => (
                <div
                  key={author.id}
                  onClick={() => onSelectAuthor?.(author.slug)}
                  className="p-5 bg-neutral-50 border border-neutral-200 cursor-pointer hover:border-black transition-colors"
                >
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover mb-3"
                  />
                  <h3 className="text-base font-bold text-neutral-900">{author.name}</h3>
                  <div className="text-xs text-neutral-600 font-semibold">{author.role}</div>
                  <p className="text-xs text-neutral-600 mt-2 line-clamp-3">{author.bio}</p>
                  <div className="mt-3 text-xs font-mono text-[#DF9E00] font-bold">
                    View Stories ({author.totalArticles}) →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pageType === 'advertise' && (
          <div className="space-y-6">
            <p>
              Connect your brand with India’s most influential audience of founders, venture capital general partners, angel investors, and enterprise executives.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 bg-neutral-50 border border-neutral-200">
                <h3 className="font-bold text-neutral-900">The Founder Magazine</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Full-page, premium double-spread print insertions in our archival quarterly edition distributed across venture capitals and incubators.
                </p>
              </div>
              <div className="p-5 bg-neutral-50 border border-neutral-200">
                <h3 className="font-bold text-neutral-900">Executive Newsletter</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Exclusive single-sponsor daily dispatches delivered to over 48,000 verified founder and investor inboxes at 8:00 AM IST.
                </p>
              </div>
              <div className="p-5 bg-neutral-50 border border-neutral-200">
                <h3 className="font-bold text-neutral-900">Partner Features</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Deep-dive technical whitepapers and architecture breakdowns with conspicuous commercial disclosure.
                </p>
              </div>
            </div>
            <div className="p-4 bg-neutral-900 text-white text-center mt-6">
              <span className="text-xs font-mono text-[#F5B800] uppercase block">Direct Inquiries</span>
              <p className="text-sm font-bold mt-1">Email advertise@founderbytes.in to request our 2026 Media Kit.</p>
            </div>
          </div>
        )}

        {pageType === 'privacy-policy' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <p>
              Founder Bytes values reader privacy. In accordance with the Digital Personal Data Protection Act (DPDP), 2023, we collect only minimal functional data required to distribute news briefings and maintain site performance.
            </p>
            <p>
              We never sell or distribute subscriber email addresses to third-party data brokers. Readers can request data erasure or unsubscribe from communications at any time.
            </p>
          </div>
        )}

        {pageType === 'terms' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <p>
              All reporting, original graphics, and magazine content published under Founder Bytes and The Founder Magazine are protected by international copyright laws.
            </p>
            <p>
              Fair use quotations of up to 100 words are permitted provided prominent textual credit and an active canonical hyperlink to founderbytes.in is included.
            </p>
          </div>
        )}

        {pageType === 'cookie-policy' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <p>
              Founder Bytes utilizes strict session cookies to remember subscription preferences, search states, and ensure secure TLS transmission. We do not deploy deceptive tracking pixels.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
