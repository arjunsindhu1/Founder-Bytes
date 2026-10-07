import React from 'react';
import { FounderBytesLogo } from './FounderBytesLogo';
import { getCurrentISTDate } from '../utils/dateUtils';
import { PolicyPageType } from './PolicyPage';
import { ArrowUpRight, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (categorySlug: string) => void;
  onNavigatePolicy: (policyType: PolicyPageType) => void;
  onNavigateHome: () => void;
  onNavigateMagazine: () => void;
  onNavigateNominations?: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigatePolicy,
  onNavigateHome,
  onNavigateMagazine,
  onNavigateNominations,
  onOpenAdminLogin,
}) => {
  const { year } = getCurrentISTDate();

  return (
    <footer className="w-full bg-[#111111] text-white border-t-2 border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* Brand Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          <div>
            <div
              onClick={onNavigateHome}
              className="cursor-pointer inline-block"
              role="button"
              tabIndex={0}
              aria-label="Founder Bytes Home"
            >
              <FounderBytesLogo variant="light" size="md" />
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-2 font-mono tracking-wider uppercase">
              Business • Startups • Innovation • Technology • Founders
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F5B800]"></span>
              <span>VERIFIED INDIAN JOURNALISM</span>
            </span>
            <span>·</span>
            <span>PUBLISHED IN BENGALURU & MUMBAI</span>
          </div>
        </div>

        {/* 5-Column News Publication Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 border-b border-neutral-800 text-xs">
          {/* Column 1: Company */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#F5B800] font-bold mb-3">
              COMPANY
            </div>
            <ul className="space-y-2.5 text-neutral-400 font-sans">
              <li>
                <button
                  onClick={() => onNavigatePolicy('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About Founder Bytes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePolicy('editorial-policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Editorial Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePolicy('corrections-policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Corrections Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePolicy('ethics-policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Ethics Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePolicy('authors')}
                  className="hover:text-white transition-colors text-left"
                >
                  Authors & Masthead
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Categories */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#F5B800] font-bold mb-3">
              CATEGORIES
            </div>
            <ul className="space-y-2.5 text-neutral-400 font-sans">
              <li>
                <button onClick={() => onSelectCategory('startups')} className="hover:text-white transition-colors">
                  Startups
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('business')} className="hover:text-white transition-colors">
                  Business
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('tech')} className="hover:text-white transition-colors">
                  Technology
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('ai')} className="hover:text-white transition-colors">
                  AI
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('founders')} className="hover:text-white transition-colors">
                  Founders
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('funding')} className="hover:text-white transition-colors">
                  Funding
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('markets')} className="hover:text-white transition-colors">
                  Markets
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Magazine */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#F5B800] font-bold mb-3">
              MAGAZINE
            </div>
            <ul className="space-y-2.5 text-neutral-400 font-sans">
              <li>
                <button onClick={onNavigateMagazine} className="hover:text-white transition-colors text-left font-semibold text-neutral-200">
                  The Founder Magazine
                </button>
              </li>
              <li>
                <button onClick={onNavigateNominations} className="hover:text-white transition-colors text-left text-[#F5B800] font-semibold flex items-center gap-1.5">
                  <span>Magazine Nominations</span>
                  <span className="text-[9px] font-mono bg-[#F5B800] text-black font-bold px-1 py-0.2 uppercase">Open</span>
                </button>
              </li>
              <li>
                <button onClick={onNavigateMagazine} className="hover:text-white transition-colors text-left">
                  30 Under 30 Class of 2026
                </button>
              </li>
              <li>
                <button onClick={onNavigateMagazine} className="hover:text-white transition-colors text-left">
                  Founders to Watch
                </button>
              </li>
              <li>
                <button onClick={onNavigateMagazine} className="hover:text-white transition-colors text-left">
                  Print Hardcover Inquiries
                </button>
              </li>
              <li>
                <button onClick={onNavigateMagazine} className="hover:text-white transition-colors text-left">
                  Archival Issues (01–03)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#F5B800] font-bold mb-3">
              CONTACT
            </div>
            <ul className="space-y-2.5 text-neutral-400 font-sans">
              <li>
                <button onClick={() => onNavigatePolicy('advertise')} className="hover:text-white transition-colors text-left">
                  Advertise With Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('contact')} className="hover:text-white transition-colors text-left">
                  Newsroom Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('contact')} className="hover:text-white transition-colors text-left">
                  Collaborations & Syndication
                </button>
              </li>
              <li>
                <a href="mailto:tips@founderbytes.in" className="hover:text-white transition-colors text-left block">
                  Confidential News Tips
                </a>
              </li>
              <li>
                <a href="mailto:founders@founderbytes.in" className="hover:text-white transition-colors text-left block">
                  Pitch a Founder Story
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Social */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#F5B800] font-bold mb-3">
              LEGAL & SOCIAL
            </div>
            <ul className="space-y-2.5 text-neutral-400 font-sans">
              <li>
                <button onClick={() => onNavigatePolicy('privacy-policy')} className="hover:text-white transition-colors text-left">
                  Privacy Policy (DPDP)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('terms')} className="hover:text-white transition-colors text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('cookie-policy')} className="hover:text-white transition-colors text-left">
                  Cookie Policy
                </button>
              </li>
            </ul>

            {/* Social Icons Strip */}
            <div className="flex items-center gap-3 pt-4 text-neutral-400">
              <a href="https://x.com/founderbytes" target="_blank" rel="noreferrer" className="hover:text-white" aria-label="X (Twitter)">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/founderbytes" target="_blank" rel="noreferrer" className="hover:text-white" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/founderbytes" target="_blank" rel="noreferrer" className="hover:text-white" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@founderbytes" target="_blank" rel="noreferrer" className="hover:text-white" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-3 text-[10px] font-mono text-neutral-500">
              <a href="/sitemap.xml" target="_blank" className="hover:underline">Sitemap</a>
              <span className="mx-1">·</span>
              <a href="/news-sitemap.xml" target="_blank" className="hover:underline">News Sitemap</a>
            </div>
          </div>
        </div>

        {/* Dynamic Year Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <div>
            © {year} Founder Bytes. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <div>founderbytes.in · India’s Business & Startup Magazine</div>
            {onOpenAdminLogin && (
              <>
                <span className="text-neutral-700">|</span>
                <button
                  onClick={onOpenAdminLogin}
                  className="text-neutral-500 hover:text-[#F5B800] uppercase text-[10px] tracking-widest font-bold transition-colors"
                >
                  Admin Access
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
