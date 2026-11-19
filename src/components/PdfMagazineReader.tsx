import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  RectangleVertical,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

// Configure PDF.js worker served statically from /public/pdf.worker.min.mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfMagazineReaderProps {
  pdfUrl: string;
  title: string;
  issueLabel?: string;
  mode?: 'embedded' | 'modal';
  onClose?: () => void;
  onExpandModal?: () => void;
}

export const PdfMagazineReader: React.FC<PdfMagazineReaderProps> = ({
  pdfUrl,
  title,
  issueLabel = 'VOL 01 · ISSUE 01 · OCT 2026',
  mode = 'embedded',
  onClose,
  onExpandModal,
}) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(38);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  const [viewMode, setViewMode] = useState<'single' | 'spread'>('single');
  const [zoom, setZoom] = useState<number>(1);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoadingDoc, setIsLoadingDoc] = useState<boolean>(true);
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTasksRef = useRef<pdfjsLib.RenderTask[]>([]);
  const [stageWidth, setStageWidth] = useState<number>(900);

  // Automatically pick 2-page spread on wide desktop viewports in modal mode
  useEffect(() => {
    if (mode === 'modal' && typeof window !== 'undefined' && window.innerWidth >= 1100) {
      setViewMode('spread');
    }
  }, [mode]);

  // Observe reader stage width for responsive canvas scaling
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateWidth = () => {
      const next = el.clientWidth;
      if (next > 0) setStageWidth(next);
    };
    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(el);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Load PDF document via PDF.js
  useEffect(() => {
    let cancelled = false;
    let activeDoc: pdfjsLib.PDFDocumentProxy | null = null;

    setIsLoadingDoc(true);
    setLoadError(null);
    setLoadProgress(0);

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      disableRange: false,
      disableStream: false,
    });

    loadingTask.onProgress = (progressData: { loaded: number; total?: number }) => {
      if (cancelled) return;
      if (progressData.total && progressData.total > 0) {
        const pct = Math.min(99, Math.round((progressData.loaded / progressData.total) * 100));
        setLoadProgress(pct);
      }
    };

    loadingTask.promise
      .then((doc) => {
        if (cancelled) {
          doc.cleanup().catch(() => {});
          return;
        }
        activeDoc = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setPageInput('1');
        setLoadProgress(100);
        setIsLoadingDoc(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('PDF Magazine Reader load error:', err);
        setLoadError('Unable to stream the magazine inline in this browser. You can open or download the full 38-page PDF directly below.');
        setIsLoadingDoc(false);
      });

    return () => {
      cancelled = true;
      loadingTask.destroy().catch(() => {});
      if (activeDoc) {
        activeDoc.cleanup().catch(() => {});
      }
    };
  }, [pdfUrl]);

  // Compute visible page numbers (real magazine pagination: cover 1 solo, then 2-3, 4-5, ..., back cover solo)
  const visiblePages = React.useMemo(() => {
    if (viewMode === 'single' || stageWidth < 780) {
      return [currentPage];
    }
    if (currentPage === 1) return [1];
    const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
    const rightPage = leftPage + 1;
    if (rightPage <= numPages) {
      return [leftPage, rightPage];
    }
    return [leftPage];
  }, [currentPage, numPages, viewMode, stageWidth]);

  // Render active page(s) to high-DPI canvas
  useEffect(() => {
    if (!pdfDoc) return;

    // Cancel previous renders
    for (const task of renderTasksRef.current) {
      try {
        task.cancel();
      } catch {
        // ignore
      }
    }
    renderTasksRef.current = [];

    let cancelled = false;
    setIsRenderingPage(true);

    const renderPageToCanvas = async (
      pageNum: number,
      canvas: HTMLCanvasElement | null,
      maxWidth: number
    ) => {
      if (!canvas || cancelled) return;
      const page = await pdfDoc.getPage(pageNum);
      if (cancelled) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const fitScale = Math.max(0.4, maxWidth / baseViewport.width);
      const effectiveScale = fitScale * zoom;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const cssViewport = page.getViewport({ scale: effectiveScale });
      const renderViewport = page.getViewport({ scale: effectiveScale * dpr });

      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${Math.floor(cssViewport.width)}px`;
      canvas.style.height = `${Math.floor(cssViewport.height)}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const renderTask = page.render({
        canvasContext: ctx,
        viewport: renderViewport,
        canvas,
      });
      renderTasksRef.current.push(renderTask);

      try {
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('PDF page render error:', err);
        }
      }
    };

    const horizontalPadding = mode === 'modal' ? 96 : 48;
    const availableWidth = Math.max(280, stageWidth - horizontalPadding);
    const isTwoPage = visiblePages.length === 2;
    const targetPageWidth = isTwoPage
      ? Math.min(540, Math.floor((availableWidth - 12) / 2))
      : Math.min(mode === 'modal' ? 680 : 720, availableWidth);

    Promise.all([
      renderPageToCanvas(visiblePages[0], leftCanvasRef.current, targetPageWidth),
      isTwoPage
        ? renderPageToCanvas(visiblePages[1], rightCanvasRef.current, targetPageWidth)
        : Promise.resolve(),
    ]).finally(() => {
      if (!cancelled) {
        setIsRenderingPage(false);
      }
    });

    return () => {
      cancelled = true;
      for (const task of renderTasksRef.current) {
        try {
          task.cancel();
        } catch {
          // ignore
        }
      }
      renderTasksRef.current = [];
    };
  }, [pdfDoc, visiblePages, zoom, stageWidth, mode]);

  const goToPage = useCallback(
    (target: number) => {
      const clamped = Math.max(1, Math.min(numPages, target));
      setCurrentPage(clamped);
      setPageInput(String(clamped));
    },
    [numPages]
  );

  const handleNext = useCallback(() => {
    if (visiblePages.length === 2) {
      goToPage(visiblePages[1] + 1);
    } else if (viewMode === 'spread' && stageWidth >= 780 && currentPage === 1 && numPages > 1) {
      goToPage(2);
    } else {
      goToPage(currentPage + 1);
    }
  }, [visiblePages, viewMode, stageWidth, currentPage, numPages, goToPage]);

  const handlePrev = useCallback(() => {
    if (visiblePages.length === 2) {
      const prevTarget = visiblePages[0] <= 2 ? 1 : visiblePages[0] - 2;
      goToPage(prevTarget);
    } else if (viewMode === 'spread' && stageWidth >= 780 && currentPage > 1) {
      const prevTarget = currentPage <= 2 ? 1 : currentPage - 2;
      goToPage(prevTarget);
    } else {
      goToPage(currentPage - 1);
    }
  }, [visiblePages, viewMode, stageWidth, currentPage, goToPage]);

  // Keyboard navigation in modal mode
  useEffect(() => {
    if (mode !== 'modal') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, handleNext, handlePrev, onClose]);

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current
        ?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!Number.isNaN(parsed)) {
      goToPage(parsed);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const canGoPrev = visiblePages[0] > 1;
  const canGoNext = visiblePages[visiblePages.length - 1] < numPages;
  const pageLabelText =
    visiblePages.length === 2
      ? `${visiblePages[0]}–${visiblePages[1]} / ${numPages}`
      : `${visiblePages[0]} / ${numPages}`;

  const wrapperClasses =
    mode === 'modal'
      ? 'fixed inset-0 z-50 bg-[#0A0A0A] text-white flex flex-col overflow-hidden'
      : 'w-full bg-[#0E0E0E] text-white border border-neutral-800 flex flex-col overflow-hidden shadow-xl';

  return (
    <div ref={containerRef} className={wrapperClasses}>
      {/* Top Reader Toolbar */}
      <div className="bg-[#151515] border-b border-neutral-800 px-3 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shrink-0">
        {/* Left: Title & Edition */}
        <div className="flex items-center gap-2.5 min-w-0">
          {mode === 'modal' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Close Reader (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Close</span>
            </button>
          )}
          <span className="px-2 py-0.5 bg-[#F5B800] text-black font-extrabold text-[10px] uppercase tracking-wider shrink-0">
            {issueLabel}
          </span>
          <span className="font-bold text-neutral-100 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
            {title}
          </span>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev || isLoadingDoc}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white transition-colors cursor-pointer"
            aria-label="Previous page"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <form onSubmit={handlePageSubmit} className="flex items-center gap-1.5">
            <label htmlFor={`pdf-page-input-${mode}`} className="sr-only">
              Jump to page number
            </label>
            <input
              id={`pdf-page-input-${mode}`}
              type="text"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(String(currentPage))}
              className="w-11 px-1.5 py-1 bg-neutral-900 border border-neutral-700 focus:border-[#F5B800] focus:outline-none text-center text-white font-bold tabular-nums"
            />
            <span className="text-neutral-400 tabular-nums">/ {numPages}</span>
          </form>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext || isLoadingDoc}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white transition-colors cursor-pointer"
            aria-label="Next page"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Layout, Zoom, Fullscreen, Download */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Single vs 2-Page Spread Toggle (Desktop) */}
          <div className="hidden md:flex items-center bg-neutral-900 border border-neutral-800 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-2 py-1 inline-flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-[#F5B800] text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Single page view"
            >
              <RectangleVertical className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase">1P</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('spread')}
              className={`px-2 py-1 inline-flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'spread'
                  ? 'bg-[#F5B800] text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Two-page magazine spread view"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase">2P</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-bold text-neutral-300 tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2, Number((z + 0.15).toFixed(2))))}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoom !== 1 && (
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="p-1 text-neutral-400 hover:text-[#F5B800] cursor-pointer"
                title="Reset zoom"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Expand to Modal or Browser Fullscreen */}
          {mode === 'embedded' && onExpandModal ? (
            <button
              type="button"
              onClick={onExpandModal}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Fullscreen Reader"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#F5B800]" />
              <span className="hidden sm:inline text-[11px]">Fullscreen</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleBrowserFullscreen}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white hidden sm:inline-flex transition-colors cursor-pointer"
              title="Toggle browser fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Download PDF */}
          <a
            href={pdfUrl}
            download="FounderBytes-30-Under-30-India-2026-Magazine.pdf"
            className="px-2.5 py-1.5 bg-[#F5B800] hover:bg-[#DF9E00] text-black font-extrabold inline-flex items-center gap-1.5 transition-colors"
            title="Download full 38-page PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">PDF</span>
          </a>
        </div>
      </div>

      {/* Main Magazine Canvas Stage */}
      <div
        ref={stageRef}
        className={`relative flex-1 flex items-center justify-center overflow-auto bg-[#0B0B0B] ${
          mode === 'modal' ? 'p-4 sm:p-6' : 'min-h-[540px] sm:min-h-[680px] lg:min-h-[760px] p-4 sm:p-8'
        }`}
      >
        {/* Floating Previous Page Button */}
        {!isLoadingDoc && !loadError && (
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Previous magazine page"
            className="fixed md:absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-black/80 hover:bg-[#F5B800] text-white hover:text-black border border-neutral-700 hover:border-[#F5B800] disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Loading State */}
        {isLoadingDoc ? (
          <div className="max-w-md w-full text-center px-6 py-12">
            <div className="w-12 h-12 mx-auto mb-5 border border-neutral-700 bg-[#141414] flex items-center justify-center font-serif text-2xl font-bold text-white">
              <span>F</span>
              <span className="text-[#F5B800]">.</span>
            </div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#F5B800] font-bold">
              Loading Digital Edition
            </div>
            <p className="font-serif text-lg text-white mt-2">{title}</p>
            <div className="w-full h-1.5 bg-neutral-800 mt-5 overflow-hidden">
              <div
                className="h-full bg-[#F5B800] transition-all duration-200"
                style={{ width: `${Math.max(12, loadProgress)}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mt-2.5 tabular-nums">
              {loadProgress > 0 ? `Streaming 38-page edition · ${loadProgress}%` : 'Connecting to magazine issue...'}
            </p>
          </div>
        ) : loadError ? (
          <div className="max-w-md w-full text-center px-6 py-12 border border-neutral-800 bg-[#141414]">
            <BookOpen className="w-8 h-8 text-[#F5B800] mx-auto mb-3" />
            <p className="text-sm text-neutral-200 leading-relaxed">{loadError}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5B800] hover:bg-[#DF9E00] text-black font-mono text-xs font-extrabold uppercase tracking-wider"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open PDF in Browser</span>
              </a>
              <a
                href={pdfUrl}
                download="FounderBytes-30-Under-30-India-2026-Magazine.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-bold uppercase tracking-wider"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center gap-2 sm:gap-3 my-auto">
            {/* Left / Single Page Canvas */}
            <div className="relative bg-black border border-neutral-800 shadow-[0_24px_65px_rgba(0,0,0,0.85)]">
              <canvas ref={leftCanvasRef} className="block" />
            </div>

            {/* Right Page Canvas (2-Page Spread Mode) */}
            {visiblePages.length === 2 && (
              <div className="relative bg-black border border-neutral-800 shadow-[0_24px_65px_rgba(0,0,0,0.85)]">
                <canvas ref={rightCanvasRef} className="block" />
              </div>
            )}

            {/* Subtle Page Render Indicator */}
            {isRenderingPage && (
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/85 border border-neutral-700 text-[10px] font-mono text-[#F5B800] uppercase tracking-wider">
                Rendering Page {pageLabelText}
              </div>
            )}
          </div>
        )}

        {/* Floating Next Page Button */}
        {!isLoadingDoc && !loadError && (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next magazine page"
            className="fixed md:absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-black/80 hover:bg-[#F5B800] text-white hover:text-black border border-neutral-700 hover:border-[#F5B800] disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom Scrubber & Page Quick-Jump Bar */}
      <div className="bg-[#151515] border-t border-neutral-800 px-3 sm:px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-[11px] shrink-0">
        <div className="flex items-center gap-2 text-neutral-300 shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-[#F5B800]" />
          <span className="font-bold uppercase tracking-wider">
            Page {pageLabelText}
          </span>
        </div>

        {/* Range Slider Scrubber for effortless 38-page navigation */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <span className="text-neutral-500 tabular-nums">01</span>
          <input
            type="range"
            min={1}
            max={numPages}
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            aria-label="Scrub through magazine pages"
            className="w-full accent-[#F5B800] cursor-pointer"
          />
          <span className="text-neutral-500 tabular-nums">{String(numPages).padStart(2, '0')}</span>
        </div>

        <div className="flex items-center gap-3 text-neutral-400 shrink-0">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-[#F5B800] transition-colors"
          >
            <span>Open PDF</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          {mode === 'modal' && (
            <span className="hidden lg:inline text-neutral-500">
              ← / → keys to flip
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
