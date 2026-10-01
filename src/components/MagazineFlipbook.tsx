import React, { useState, useEffect } from 'react';
import { CMSMagazineIssue } from '../types/cms';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  BookOpen, 
  Download, 
  FileText,
  Sparkles,
  Share2
} from 'lucide-react';

interface MagazineFlipbookProps {
  issue: CMSMagazineIssue;
  onClose: () => void;
}

export const MagazineFlipbook: React.FC<MagazineFlipbookProps> = ({ issue, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToc, setShowToc] = useState(false);

  // Digital editorial spreads for high-fidelity flipbook rendering
  const digitalPages = [
    {
      pageNumber: 1,
      title: issue.title,
      type: 'cover',
      isCover: true,
      imageUrl: issue.cover_image,
    },
    {
      pageNumber: 2,
      title: "Letter from the Editor",
      author: "Arjun Sindhu",
      type: 'editorial',
      content: [
        "Welcome to this landmark edition of The Founder Magazine.",
        "Over the past eighteen months, India's entrepreneurial landscape has shifted from vanity valuations to uncompromising operating rigor. The founders featured across these pages are not merely building companies; they are institutionalizing technological sovereignty across semiconductors, clean mobility, autonomous agritech, and foundation AI models.",
        "Through exhaustive reporting and direct access to production lines in Bengaluru, Pune, Hosur, and Gurugram, our editorial team brings you the unfiltered mechanics of high-growth leadership.",
        "We invite you to read deeply, examine the financial filings, and join us in documenting India's most ambitious decade."
      ],
      signature: "Arjun Sindhu\nFounder & Editor-in-Chief, Founder Bytes"
    },
    {
      pageNumber: 3,
      title: "Table of Contents & Executive Summary",
      type: 'toc',
      items: issue.table_of_contents && issue.table_of_contents.length > 0 ? issue.table_of_contents : [
        { section: "Cover Story", title: "100 Startups Powering Bharat's Global Ambition", author: "Arjun Sindhu", page: "04" },
        { section: "Hardware & Mobility", title: "Ather Energy: The Architecture of Electric Precision", author: "Arjun Sindhu", page: "08" },
        { section: "Enterprise AI", title: "The Sovereign LLM Playbook: Sarvam & Krutrim", author: "Arjun Sindhu", page: "12" },
        { section: "Agritech Deep Dive", title: "KisanGrid and the Autonomous Tractor Revolution", author: "Arjun Sindhu", page: "14" },
      ]
    },
    {
      pageNumber: 4,
      title: "THE NEXT INDIAN DECADE",
      subtitle: "100 Startups Redefining the Continental Economy",
      type: 'feature',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      content: [
        "From fabless micro-processing tape-outs in Bengaluru to air-gapped multilingual tokenizers running regional cooperative banks, India's venture class is generating durable free cash flow.",
        "A rigorous breakdown of capital allocation, capital efficiency ratios, and audited patent output across enterprise SaaS, robotics, space commercialization, and deep technology."
      ]
    },
    {
      pageNumber: 5,
      title: "Ather Energy: Software-Defined Mobility",
      subtitle: "Operating at Megawatt Scale in Hosur",
      type: 'profile',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      content: [
        "Tarun Mehta reflects on the decade-long journey of designing a ground-up high-performance EV platform in Tamil Nadu.",
        "Why vertical hardware integration and proprietary thermal cooling algorithms create a defensive moat against legacy global automotive conglomerates."
      ]
    },
    {
      pageNumber: 6,
      title: "Fabless Silicon & Sovereign SpaceTech",
      subtitle: "Indian Constellations Scanning the Globe",
      type: 'feature',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      content: [
        "Private launch systems and hyperspectral orbital sensors are transforming aerospace from academic experiments to commercial export operations.",
        "Inside the cleanrooms of Peenya and Sriharikota, engineers are testing sovereign components capable of operating in low Earth orbit."
      ]
    },
    {
      pageNumber: 7,
      title: "30 Under 30: The Architects of Tomorrow",
      subtitle: "Recognizing Early-Stage Technical Pioneers",
      type: 'founders',
      founders: issue.featured_founders || [
        { name: "Tarun Mehta", company: "Ather Energy", valuationOrMetric: "Market Leader", storyHeadline: "Software-Defined Hardware" },
        { name: "Ananya Deshmukh", company: "KisanGrid", valuationOrMetric: "12 States", storyHeadline: "Precision Agriculture" },
      ]
    },
    {
      pageNumber: 8,
      title: "The Founder Magazine Archive",
      subtitle: "Published by Founder Bytes Media",
      type: 'backcover',
      isBackCover: true,
      imageUrl: issue.cover_image,
    }
  ];

  const totalPages = digitalPages.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const activePage = digitalPages[currentPage];

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F0F] text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Controls Toolbar */}
      <header className="h-14 bg-[#181818] border-b border-neutral-800 px-4 sm:px-6 flex items-center justify-between font-mono text-xs z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
            title="Exit Reader (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
          <div className="h-4 w-px bg-neutral-700 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-[#F5B800] text-black font-bold text-[10px] uppercase">
              {issue.issue_number}
            </span>
            <span className="font-bold text-neutral-200 truncate max-w-[200px] sm:max-w-xs">
              {issue.title}
            </span>
          </div>
        </div>

        {/* Center: Page indicator */}
        <div className="hidden md:flex items-center gap-2 text-neutral-400">
          <span>PAGE</span>
          <span className="text-white font-bold">{currentPage + 1}</span>
          <span>OF</span>
          <span>{totalPages}</span>
        </div>

        {/* Right Tools: Zoom, PDF, Fullscreen */}
        <div className="flex items-center gap-2">
          {issue.pdf_link && (
            <a
              href={issue.pdf_link}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xs transition-colors hidden sm:flex items-center gap-1"
              title="Download Original Issue PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px]">PDF</span>
            </a>
          )}

          <div className="flex items-center bg-neutral-800 rounded-xs p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
              className="p-1 hover:text-white text-neutral-400"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-bold text-neutral-300">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
              className="p-1 hover:text-white text-neutral-400"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xs transition-colors hidden sm:inline-flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Flipbook Canvas */}
      <main className="flex-1 relative flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Previous page arrow button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="absolute left-2 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white border border-neutral-700 disabled:opacity-20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Digital Magazine Spread / Page Display */}
        <div
          style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
          className="relative max-w-4xl w-full max-h-[85vh] aspect-[3/4] sm:aspect-[4/3] bg-white text-neutral-900 shadow-2xl rounded-xs overflow-hidden flex flex-col md:flex-row border border-neutral-700"
        >
          {/* Cover Page */}
          {activePage.type === 'cover' ? (
            <div className="w-full h-full relative bg-neutral-900 flex items-center justify-center overflow-hidden">
              <img
                src={activePage.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 p-8 sm:p-12 flex flex-col justify-between text-white">
                <div className="text-center">
                  <div className="inline-block px-3 py-1 bg-[#F5B800] text-black font-mono font-black text-xs uppercase tracking-widest mb-3">
                    {issue.issue_number} · {issue.season}
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight uppercase">
                    THE FOUNDER
                  </h1>
                  <p className="text-xs sm:text-sm font-mono tracking-widest text-[#F5B800] uppercase mt-1">
                    India’s Business & Startup Magazine
                  </p>
                </div>

                <div className="space-y-4 max-w-lg">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                    {issue.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                    {issue.dek}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleNextPage}
                      className="px-4 py-2 bg-[#F5B800] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-white transition-colors"
                    >
                      <span>Open Issue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activePage.type === 'editorial' ? (
            /* Editorial Note Page Spread */
            <div className="w-full h-full p-8 sm:p-12 bg-[#FCFAF7] flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="border-b border-neutral-300 pb-4">
                  <span className="text-[10px] font-mono tracking-widest text-[#DF9E00] uppercase font-bold">
                    THE FOUNDER MAGAZINE · EDITORIAL DISPATCH
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 mt-1">
                    {activePage.title}
                  </h2>
                  <div className="text-xs font-mono text-neutral-500 mt-1">
                    BY {activePage.author} · FOUNDER & EDITOR-IN-CHIEF
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm font-serif leading-relaxed text-neutral-800">
                  {activePage.content?.map((par, i) => (
                    <p key={i} className={i === 0 ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2' : ''}>
                      {par}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span className="font-serif italic font-bold text-neutral-800">Founder Bytes Publishing House</span>
                <span>Page {activePage.pageNumber}</span>
              </div>
            </div>
          ) : (
            /* Standard Feature Story Spread */
            <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-[#FCFAF7]">
              {/* Left Column: Visual Asset */}
              <div className="md:w-1/2 h-48 md:h-full relative bg-neutral-900 shrink-0">
                <img
                  src={activePage.imageUrl || issue.cover_image}
                  alt={activePage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex items-end">
                  <span className="text-[10px] font-mono text-[#F5B800] uppercase font-bold">
                    THE FOUNDER ARCHIVE · EXCLUSIVE REPORTING
                  </span>
                </div>
              </div>

              {/* Right Column: Editorial Text */}
              <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#DF9E00]">
                      ISSUE {issue.issue_number}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-neutral-900 mt-1">
                      {activePage.title}
                    </h3>
                    {activePage.subtitle && (
                      <p className="text-xs font-mono text-neutral-600 mt-1">
                        {activePage.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm font-serif leading-relaxed text-neutral-700">
                    {activePage.content?.map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}
                  </div>

                  {activePage.founders && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                        HONORED BUILDERS IN THIS SECTOR:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activePage.founders.map((f, i) => (
                          <div key={i} className="p-2 bg-neutral-100 border border-neutral-300 text-xs font-mono">
                            <div className="font-bold text-neutral-900">{f.name}</div>
                            <div className="text-[10px] text-neutral-600">{f.company} · {f.valuationOrMetric}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Founder Bytes · The Founder Magazine</span>
                  <span>Page {activePage.pageNumber}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next page arrow button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="absolute right-2 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white border border-neutral-700 disabled:opacity-20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
          aria-label="Next Page"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </main>

      {/* Bottom Page Scrubbing Navigation */}
      <footer className="h-14 bg-[#181818] border-t border-neutral-800 px-4 sm:px-6 flex items-center justify-between font-mono text-xs z-30 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#F5B800]" />
          <span className="text-neutral-300 font-bold uppercase">Digital Magazine Reader</span>
        </div>

        {/* Page Thumbnail Jumper */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {digitalPages.map((page, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-7 h-7 text-[10px] font-bold border transition-all cursor-pointer ${
                currentPage === idx
                  ? 'bg-[#F5B800] text-black border-[#F5B800]'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white hover:border-neutral-500'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-neutral-400 hidden sm:block">
          Use <kbd className="px-1 bg-neutral-800 border border-neutral-700 rounded-xs">←</kbd> <kbd className="px-1 bg-neutral-800 border border-neutral-700 rounded-xs">→</kbd> arrow keys to turn pages
        </div>
      </footer>
    </div>
  );
};
