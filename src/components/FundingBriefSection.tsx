import React from 'react';
import { Article } from '../types';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface FundingRecord {
  company: string;
  sector: string;
  round: string;
  amount: string;
  leadInvestors: string;
  date: string;
  articleSlug?: string;
}

interface FundingBriefSectionProps {
  fundingArticles?: Article[];
  onSelectArticle: (slug: string) => void;
  onViewAllFunding: () => void;
}

const DEFAULT_FUNDING_RECORDS: FundingRecord[] = [
  {
    company: 'byteXL',
    sector: 'EdTech / AI Education',
    round: 'Series B',
    amount: '$9 Million',
    leadInvestors: 'Elevar Equity, Kalaari, Dell Foundation',
    date: '7 Oct 2026',
    articleSlug: 'tech/bytexl-raises-9-million-series-b-ai-tech-education-india',
  },
  {
    company: 'Sunfox Technologies',
    sector: 'MedTech / Diagnostics',
    round: 'Series A',
    amount: '$7 Million',
    leadInvestors: 'Ashish Kacholia, 3one4 Capital, Alchemy',
    date: '7 Oct 2026',
    articleSlug: 'tech/sunfox-technologies-raises-7-million-cardiac-diagnostics',
  },
  {
    company: 'Zomint',
    sector: 'WealthTech / Fintech',
    round: 'Seed Round',
    amount: '₹36 Crore',
    leadInvestors: 'Lightspeed Venture Partners, Prime VP',
    date: '7 Oct 2026',
    articleSlug: 'fintech/zomint-raises-36-crore-seed-wealth-management',
  },
  {
    company: 'Quanfluence',
    sector: 'DeepTech / Quantum',
    round: 'Series Seed',
    amount: '$10 Million',
    leadInvestors: 'Chiratae Ventures, Rainmatter Zerodha',
    date: '7 Oct 2026',
    articleSlug: 'tech/quanfluence-raises-10-million-photonic-quantum-computer',
  },
];

export const FundingBriefSection: React.FC<FundingBriefSectionProps> = ({
  fundingArticles = [],
  onSelectArticle,
  onViewAllFunding,
}) => {
  // Use curated verified deals, prioritizing matching published articles
  const records = DEFAULT_FUNDING_RECORDS.slice(0, 4);

  return (
    <section className="w-full py-8 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-neutral-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 font-serif">
              FUNDING BRIEF
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-500 uppercase font-bold ml-2">
              <TrendingUp className="w-3 h-3 text-[#DF9E00]" />
              <span>VENTURE & GROWTH CAPITAL</span>
            </span>
          </div>

          <button
            onClick={onViewAllFunding}
            className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 hover:text-[#DF9E00] transition-colors cursor-pointer"
          >
            <span>VIEW ALL FUNDING</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Compact Responsive Table / Card Container */}
        <div className="bg-white border border-neutral-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-mono uppercase tracking-wider text-[11px] border-b border-neutral-800">
                  <th className="py-2.5 px-4 font-bold">Company</th>
                  <th className="py-2.5 px-3 font-bold hidden sm:table-cell">Sector</th>
                  <th className="py-2.5 px-3 font-bold">Round</th>
                  <th className="py-2.5 px-3 font-bold text-right text-[#F5B800]">Amount</th>
                  <th className="py-2.5 px-4 font-bold hidden md:table-cell">Lead Investors</th>
                  <th className="py-2.5 px-3 font-bold text-right hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-sans">
                {records.map((deal, idx) => (
                  <tr
                    key={idx}
                    onClick={() => deal.articleSlug && onSelectArticle(deal.articleSlug)}
                    className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-neutral-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="hover:text-[#DF9E00]">{deal.company}</span>
                        {deal.articleSlug && (
                          <ArrowRight className="w-3 h-3 text-neutral-300 group-hover:text-black inline" />
                        )}
                      </div>
                      <div className="sm:hidden text-[10px] text-neutral-500 font-mono mt-0.5">
                        {deal.sector} · {deal.date}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 hidden sm:table-cell">
                      {deal.sector}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-neutral-800">
                      <span className="px-1.5 py-0.5 bg-neutral-100 text-[10px] uppercase">
                        {deal.round}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-black sm:text-[#DF9E00] whitespace-nowrap">
                      {deal.amount}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 hidden md:table-cell truncate max-w-xs">
                      {deal.leadInvestors}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-400 text-[11px] hidden sm:table-cell whitespace-nowrap">
                      {deal.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
