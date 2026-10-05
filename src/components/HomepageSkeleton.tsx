import React from 'react';

export const HomepageSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-pulse" aria-label="Loading latest stories" role="status">
      {/* Visual Status Indicator Bar */}
      <div className="w-full bg-neutral-50 border-b border-neutral-200 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F5B800] animate-ping"></span>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-600">
              DISPATCHES WIRE · LIVE NEWSROOM CONNECTING
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            LOADING REAL-TIME FEEDS...
          </span>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="w-full py-6 border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column: Dominant Lead Story (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="pb-6 border-b border-neutral-300">
                {/* Category & Timestamp Kicker */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-20 h-3 bg-neutral-200"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-200"></div>
                  <div className="w-16 h-3 bg-neutral-200"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-200"></div>
                  <div className="w-20 h-3 bg-neutral-200"></div>
                </div>

                {/* Dominant Headline */}
                <div className="space-y-2.5 mb-4">
                  <div className="h-8 sm:h-10 bg-neutral-200 w-full"></div>
                  <div className="h-8 sm:h-10 bg-neutral-200 w-11/12"></div>
                  <div className="h-8 sm:h-10 bg-neutral-200 w-3/4"></div>
                </div>

                {/* 16:9 Featured Image Placeholder */}
                <div className="w-full aspect-[16/9] bg-neutral-100 border border-neutral-200 mb-3 flex items-center justify-center">
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                    FOUNDER BYTES DISPATCH PHOTOGRAPHY
                  </div>
                </div>

                {/* Caption Skeleton */}
                <div className="w-1/2 h-3 bg-neutral-200 mb-4"></div>

                {/* Dek / Summary Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-neutral-200 w-full"></div>
                  <div className="h-4 bg-neutral-200 w-5/6"></div>
                  <div className="h-4 bg-neutral-200 w-2/3"></div>
                </div>

                {/* Byline */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <div className="w-28 h-3 bg-neutral-200"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-200"></div>
                  <div className="w-32 h-3 bg-neutral-200"></div>
                </div>
              </div>

              {/* Sub-Lead Stories Underneath (2-col grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                {[1, 2].map((idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="w-16 h-3 bg-neutral-200 mb-2"></div>
                    <div className="space-y-1.5 mb-3">
                      <div className="h-5 bg-neutral-200 w-full"></div>
                      <div className="h-5 bg-neutral-200 w-4/5"></div>
                    </div>
                    <div className="w-full aspect-[16/10] bg-neutral-100 border border-neutral-200 mb-2"></div>
                    <div className="h-3.5 bg-neutral-200 w-full mb-1"></div>
                    <div className="h-3.5 bg-neutral-200 w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: News Wire / Fast Intelligence (4 cols) */}
            <div className="lg:col-span-4 border-l border-neutral-200 pl-0 lg:pl-8">
              <div className="pb-3 border-b border-neutral-900 mb-4 flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-neutral-900">
                  LATEST STORIES WIRE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#F5B800]"></span>
              </div>

              <div className="divide-y divide-neutral-200">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="py-3.5 first:pt-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-14 h-2.5 bg-neutral-200"></div>
                      <div className="w-1 h-1 rounded-full bg-neutral-200"></div>
                      <div className="w-12 h-2.5 bg-neutral-200"></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-4 bg-neutral-200 w-full"></div>
                      <div className="h-4 bg-neutral-200 w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section Skeleton */}
      <section className="w-full py-8 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-900 mb-6">
            <div className="w-40 h-4 bg-neutral-200"></div>
            <div className="w-24 h-3 bg-neutral-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="w-full aspect-[16/10] bg-neutral-100 border border-neutral-200 mb-3"></div>
                <div className="w-16 h-3 bg-neutral-200 mb-2"></div>
                <div className="h-5 bg-neutral-200 w-full mb-1.5"></div>
                <div className="h-5 bg-neutral-200 w-3/4 mb-2"></div>
                <div className="h-3.5 bg-neutral-200 w-full mb-1"></div>
                <div className="h-3.5 bg-neutral-200 w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
