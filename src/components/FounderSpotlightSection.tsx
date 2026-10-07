import React from 'react';
import { FounderSpotlight } from '../types/cms';
import { ArrowRight, Sparkles, Building, ExternalLink } from 'lucide-react';

interface FounderSpotlightSectionProps {
  spotlights: FounderSpotlight[];
  onSelectFounder: (slug: string) => void;
  onViewAllFounders: () => void;
}

export const FounderSpotlightSection: React.FC<FounderSpotlightSectionProps> = ({
  spotlights,
  onSelectFounder,
  onViewAllFounders,
}) => {
  if (!spotlights || spotlights.length === 0) {
    return null;
  }

  // Maximum 3 active featured founders
  const displaySpotlights = spotlights.slice(0, 3);

  return (
    <section className="w-full py-8 sm:py-10 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-neutral-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 font-serif">
              FOUNDER SPOTLIGHT
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[9px] font-mono uppercase tracking-widest font-bold ml-2">
              <Sparkles className="w-2.5 h-2.5 text-[#DF9E00]" />
              <span>FEATURED EDITORIAL</span>
            </span>
          </div>

          <button
            onClick={onViewAllFounders}
            className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 hover:text-[#DF9E00] transition-colors cursor-pointer"
          >
            <span>VIEW ALL FOUNDERS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-Column Responsive Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displaySpotlights.map((founder) => (
            <article
              key={founder.id}
              onClick={() => onSelectFounder(founder.slug)}
              className="group cursor-pointer flex flex-col justify-between p-4 bg-neutral-50/70 border border-neutral-200 hover:border-black transition-all hover:shadow-sm"
            >
              <div>
                {/* Founder Photograph */}
                <div className="w-full aspect-[4/3] bg-neutral-200 overflow-hidden mb-3.5 relative border border-neutral-300">
                  <img
                    src={founder.founder_photo}
                    alt={founder.founder_name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 bg-black/90 text-[#F5B800] text-[9px] font-mono uppercase font-bold tracking-wider">
                      {founder.industry}
                    </span>
                  </div>
                </div>

                {/* Founder Name */}
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 group-hover:text-[#DF9E00] font-serif transition-colors leading-tight">
                  {founder.founder_name}
                </h3>

                {/* Designation & Company */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-700 mt-1">
                  <Building className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span className="truncate">{founder.designation}</span>
                  <span>·</span>
                  <span className="font-bold text-black truncate">{founder.company_name}</span>
                </div>

                {/* Short Intro */}
                <p className="text-xs text-neutral-600 mt-2.5 font-serif line-clamp-3 leading-relaxed">
                  {founder.short_bio}
                </p>
              </div>

              {/* Action / CTA */}
              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-neutral-900 group-hover:text-[#DF9E00] transition-colors inline-flex items-center gap-1">
                  <span>{founder.cta_text || 'View Spotlight'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
                {founder.website_url && (
                  <span className="text-[10px] text-neutral-400 font-normal">
                    {founder.website_url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
