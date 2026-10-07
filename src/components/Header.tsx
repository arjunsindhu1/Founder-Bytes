import React, { useState, useEffect } from 'react';
import { FounderBytesLogo } from './FounderBytesLogo';
import { getCurrentISTDate } from '../utils/dateUtils';
import { Search, Menu, X, ArrowUpRight, TrendingUp, Twitter, Linkedin, Instagram } from 'lucide-react';
import { PolicyPageType } from './PolicyPage';

interface HeaderProps {
  currentCategory?: string;
  onSelectCategory: (categorySlug: string) => void;
  onOpenSearch: () => void;
  onOpenSubscribe: () => void;
  onNavigateHome: () => void;
  onNavigateMagazine: () => void;
  onNavigatePolicy: (policy: PolicyPageType) => void;
  onNavigateNominations?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenSubscribe,
  onNavigateHome,
  onNavigateMagazine,
  onNavigatePolicy,
  onNavigateNominations,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [istDate, setIstDate] = useState(getCurrentISTDate());

  // Update IST date dynamically
  useEffect(() => {
    setIstDate(getCurrentISTDate());
    const interval = setInterval(() => {
      setIstDate(getCurrentISTDate());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'HOME', slug: '', isHome: true },
    { label: 'NEWS', slug: 'news' },
    { label: 'LATEST', slug: 'latest' },
    { label: 'STARTUPS', slug: 'startups' },
    { label: 'BUSINESS', slug: 'business' },
    { label: 'TECH', slug: 'tech' },
    { label: 'AI', slug: 'ai' },
    { label: 'FOUNDERS', slug: 'founders' },
    { label: 'FUNDING', slug: 'funding' },
    { label: 'MARKETS', slug: 'markets' },
    { label: 'INNOVATION', slug: 'innovation' },
    { label: 'MAGAZINE', slug: 'magazine', isMagazine: true },
  ];

  return (
    <header className="w-full bg-white z-40">
      {/* 1. TOP UTILITY BAR (Very thin dark strip) */}
      <div className="w-full bg-[#111111] text-neutral-300 text-[11px] py-1 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono">
          {/* Left: Dynamic Date & Edition */}
          <div className="flex items-center gap-2.5">
            <span className="text-[#F5B800] font-bold uppercase tracking-wider">EDITION: INDIA</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-200">
              {istDate.dayName.toUpperCase()}, {istDate.formattedDate.toUpperCase()}
            </span>
          </div>

          {/* Center: Publication Core Mission Notice */}
          <div className="hidden lg:flex items-center gap-3 text-neutral-400">
            <span className="text-[#F5B800] font-bold">THE FOUNDER MAGAZINE</span>
            <span className="text-neutral-700">·</span>
            <span className="text-neutral-300">INDIA’S BUSINESS & STARTUP MAGAZINE</span>
          </div>

          {/* Right: Operational utility links & social */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigatePolicy('advertise')}
              className="hover:text-[#F5B800] transition-colors hidden sm:inline"
            >
              Advertise
            </button>
            <span className="text-neutral-700 hidden sm:inline">|</span>
            <button
              onClick={onNavigateNominations}
              className="text-[#F5B800] hover:text-white font-bold transition-colors hidden sm:inline"
            >
              Nominations
            </button>
            <span className="text-neutral-700 hidden sm:inline">|</span>
            <button
              onClick={() => onNavigatePolicy('contact')}
              className="hover:text-[#F5B800] transition-colors hidden sm:inline"
            >
              Contact
            </button>
            <span className="text-neutral-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-2 text-neutral-400">
              <a
                href="https://x.com/founderbytes"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
                aria-label="Founder Bytes on X"
              >
                <Twitter className="w-3 h-3" />
              </a>
              <a
                href="https://linkedin.com/company/founderbytes"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
                aria-label="Founder Bytes on LinkedIn"
              >
                <Linkedin className="w-3 h-3" />
              </a>
              <a
                href="https://instagram.com/founderbytes"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
                aria-label="Founder Bytes on Instagram"
              >
                <Instagram className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND MASTHEAD (Prominent News Logo centered / full presence) */}
      <div className="w-full border-b border-neutral-200 py-4 sm:py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Sub-kicker / Tagline */}
            <div className="hidden md:block w-1/4 text-left">
              <div className="text-[10px] font-mono tracking-widest text-[#DF9E00] uppercase font-bold">
                EST. 2024 · BENGALURU & MUMBAI
              </div>
              <div className="text-xs text-neutral-500 font-serif italic mt-0.5">
                India’s Business & Startup Publication
              </div>
            </div>

            {/* Center: The Official Founder Bytes Logo */}
            <div
              onClick={onNavigateHome}
              className="cursor-pointer text-center flex justify-center flex-1"
              role="button"
              tabIndex={0}
              aria-label="Founder Bytes Homepage"
            >
              <FounderBytesLogo size="lg" />
            </div>

            {/* Right: Quick Subscribe / E-Paper Callout */}
            <div className="hidden md:flex flex-col items-end w-1/4">
              <button
                onClick={onOpenSubscribe}
                className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold font-mono uppercase tracking-wider px-3.5 py-1.5 transition-colors"
              >
                <span>Subscribe Free</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F5B800]" />
              </button>
              <span className="text-[10px] text-neutral-400 font-mono mt-1">
                Executive 8:00 AM Dispatch
              </span>
            </div>

            {/* Mobile Hamburger & Search (Visible on small screens) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onOpenSearch}
                className="p-1.5 text-neutral-700 hover:text-black"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-neutral-900"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY NEWSPAPER NAVIGATION BAR */}
      <div className="w-full bg-white border-b-2 border-neutral-900 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-extrabold tracking-wider uppercase text-neutral-900 overflow-x-auto no-scrollbar py-2">
              {navItems.map((item) => {
                const isActive = item.isHome ? !currentCategory : currentCategory === item.slug;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.isHome) onNavigateHome();
                      else if (item.isMagazine) onNavigateMagazine();
                      else onSelectCategory(item.slug);
                    }}
                    className={`px-2.5 py-1 transition-colors relative hover:text-black shrink-0 ${
                      isActive ? 'text-black bg-neutral-100 font-black' : 'text-neutral-700 hover:bg-neutral-50'
                    } ${item.isMagazine ? 'text-neutral-950 font-black flex items-center gap-1.5' : ''}`}
                  >
                    {item.isMagazine && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B800]"></span>
                    )}
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5B800]"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile / Tablet Horizontal Overflow Nav */}
            <div className="lg:hidden flex items-center space-x-2 overflow-x-auto no-scrollbar py-2 text-xs font-bold tracking-wider uppercase">
              {navItems.slice(0, 7).map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.isHome) onNavigateHome();
                    else if (item.isMagazine) onNavigateMagazine();
                    else onSelectCategory(item.slug);
                  }}
                  className={`px-2 py-0.5 shrink-0 whitespace-nowrap ${
                    (item.isHome && !currentCategory) || currentCategory === item.slug
                      ? 'text-black border-b-2 border-[#F5B800] font-black'
                      : 'text-neutral-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Search Trigger (Right) */}
            <div className="hidden lg:flex items-center pl-4 border-l border-neutral-200">
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 py-1 px-2.5 text-xs text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors font-medium"
                aria-label="Search stories"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px] uppercase">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <span className="font-black text-sm uppercase tracking-wider">FOUNDER BYTES</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <div className="py-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item.isHome) onNavigateHome();
                      else if (item.isMagazine) onNavigateMagazine();
                      else onSelectCategory(item.slug);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Transparency Pages links */}
              <div className="pt-4 border-t border-neutral-200 space-y-1 text-xs text-neutral-600">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigatePolicy('about');
                  }}
                  className="block py-1 hover:text-black"
                >
                  About Founder Bytes
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigatePolicy('editorial-policy');
                  }}
                  className="block py-1 hover:text-black"
                >
                  Editorial Policy
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigatePolicy('corrections-policy');
                  }}
                  className="block py-1 hover:text-black"
                >
                  Corrections Policy
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigatePolicy('contact');
                  }}
                  className="block py-1 hover:text-black"
                >
                  Contact Desk
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateNominations?.();
                  }}
                  className="block py-1 font-bold text-[#DF9E00]"
                >
                  Magazine Nominations
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSubscribe();
                }}
                className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider"
              >
                Subscribe to Daily Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
