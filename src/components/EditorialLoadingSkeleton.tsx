import React from 'react';
import { Clock } from 'lucide-react';

export const EditorialLoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full" aria-busy="true" aria-label="Loading latest stories">
      {/* 1. Subtle Editorial Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F5B800] rounded-full animate-ping"></span>
            <span className="text-xs font-mono font-black tracking-wider uppercase text-neutral-800">
              LATEST STORIES
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
            <Clock className="w-3 h-3 text-neutral-400 animate-spin" />
            <span className="uppercase">Connecting to live Supabase newsroom dispatch...</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section Skeleton */}
      <section className="w-full py-6 bg-white border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left 8 cols: Dominant story placeholder */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="pb-6 border-b border-neutral-200">
                {/* Category & Time Kicker */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3.5 w-24 bg-neutral-200 animate-pulse rounded-xs"></div>
                  <span className="text-neutral-300">·</span>
                  <div className="h-3.5 w-16 bg-neutral-200 animate-pulse rounded-xs"></div>
                  <span className="text-neutral-300 hidden sm:inline">·</span>
                  <div className="h-3.5 w-20 bg-neutral-200 animate-pulse rounded-xs hidden sm:inline"></div>
                </div>

                {/* Dominant Headline */}
                <div className="space-y-2.5 mb-4">
                  <div className="h-8 sm:h-10 bg-neutral-200 animate-pulse w-11/12 rounded-xs"></div>
                  <div className="h-8 sm:h-10 bg-neutral-200 animate-pulse w-4/5 rounded-xs"></div>
                </div>

                {/* Large Photo Skeleton */}
                <div className="w-full aspect-[16/9] bg-neutral-200 animate-pulse mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>

                {/* Dek / Excerpt */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-neutral-200 animate-pulse w-full rounded-xs"></div>
                  <div className="h-4 bg-neutral-200 animate-pulse w-11/12 rounded-xs"></div>
                  <div className="h-4 bg-neutral-200 animate-pulse w-3/4 rounded-xs"></div>
                </div>

                {/* Byline */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <div className="h-3 w-28 bg-neutral-200 animate-pulse rounded-xs"></div>
                  <span className="text-neutral-300">·</span>
                  <div className="h-3 w-36 bg-neutral-200 animate-pulse rounded-xs"></div>
                </div>
              </div>

              {/* Sub-Lead Cards Grid (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                {[1, 2].map((idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="w-full aspect-[16/10] bg-neutral-200 animate-pulse rounded-xs"></div>
                    <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded-xs"></div>
                    <div className="h-5 bg-neutral-200 animate-pulse w-full rounded-xs"></div>
                    <div className="h-5 bg-neutral-200 animate-pulse w-3/4 rounded-xs"></div>
                    <div className="h-3 w-24 bg-neutral-200 animate-pulse rounded-xs"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 cols: Secondary Desk Wire Stories */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-300 pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-neutral-900">
                <div className="h-4 w-32 bg-neutral-300 animate-pulse rounded-xs"></div>
                <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded-xs"></div>
              </div>

              <div className="divide-y divide-neutral-200">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded-xs"></div>
                      <span className="text-neutral-300">·</span>
                      <div className="h-3 w-12 bg-neutral-200 animate-pulse rounded-xs"></div>
                    </div>
                    <div className="h-4 bg-neutral-200 animate-pulse w-11/12 rounded-xs"></div>
                    <div className="h-4 bg-neutral-200 animate-pulse w-4/5 rounded-xs"></div>
                    <div className="h-3 w-24 bg-neutral-200 animate-pulse rounded-xs"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Latest News Wire Skeleton */}
      <section className="w-full py-8 bg-neutral-50/50 border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 7 cols: Wire Stream */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-neutral-900">
                <div className="h-4 w-40 bg-neutral-300 animate-pulse rounded-xs"></div>
                <div className="h-3 w-28 bg-neutral-200 animate-pulse rounded-xs"></div>
              </div>

              <div className="divide-y divide-neutral-200">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="py-3.5 flex items-start gap-4">
                    <div className="w-20 space-y-1.5 pt-0.5 shrink-0">
                      <div className="h-3 w-14 bg-neutral-200 animate-pulse rounded-xs"></div>
                      <div className="h-2.5 w-10 bg-neutral-200 animate-pulse rounded-xs"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-200 animate-pulse w-full rounded-xs"></div>
                      <div className="h-4 bg-neutral-200 animate-pulse w-3/4 rounded-xs"></div>
                      <div className="h-3 bg-neutral-100 animate-pulse w-1/2 rounded-xs"></div>
                    </div>
                    <div className="w-16 h-12 sm:w-20 sm:h-14 bg-neutral-200 animate-pulse rounded-xs shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Trending List */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-300 pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-neutral-900">
                <div className="h-4 w-36 bg-neutral-300 animate-pulse rounded-xs"></div>
              </div>

              <div className="divide-y divide-neutral-200">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="py-3.5 flex items-start gap-4">
                    <span className="font-mono text-2xl font-black text-neutral-300">
                      {String(num).padStart(2, '0')}
                    </span>
                    <div className="flex-1 space-y-1.5 pt-1">
                      <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded-xs"></div>
                      <div className="h-4 bg-neutral-200 animate-pulse w-full rounded-xs"></div>
                      <div className="h-4 bg-neutral-200 animate-pulse w-2/3 rounded-xs"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
