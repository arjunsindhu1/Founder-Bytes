import { MagazineIssue } from '../types';

export const DEFAULT_MAGAZINE_ISSUE: MagazineIssue = {
  issueNumber: 'ISSUE 01',
  season: 'FALL 2026 EDITION',
  title: 'THE NEXT INDIAN DECADE',
  dek: 'Inside the visionary founders, deeptech builders, and generational enterprises scaling India into a global technological superpower.',
  coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
  coverStorySlug: 'startups/simple-energy-raises-1750-crore-series-c-electric-scooters',
  theme: 'Sovereignty, Silicon & Sustainable Capital',
  publishedDate: 'October 2026',
  featuredFounders: [
    {
      name: 'Suhas Rajkumar',
      company: 'Simple Energy',
      valuationOrMetric: '₹1,750 Cr Series C · 25,000 Units/Month',
      storyHeadline: 'Scaling Indian EV Manufacturing with Vertical Powertrain Ownership',
      slug: 'startups/simple-energy-raises-1750-crore-series-c-electric-scooters',
    },
    {
      name: 'Saurabh Jain',
      company: 'Gravity',
      valuationOrMetric: '$15M Capital from 3one4 & Info Edge',
      storyHeadline: 'Unifying the B2B Interior Design Supply Chain',
      slug: 'funding/gravity-secures-15m-home-interiors-3one4-capital',
    },
    {
      name: 'Suyash Singh',
      company: 'GalaxEye',
      valuationOrMetric: '₹63.8 Cr DST Support · OptoSAR',
      storyHeadline: 'Hybrid All-Weather Earth Observation Space Sensors',
      slug: 'tech/galaxeye-secures-63-crore-rdi-support-optosar-satellite',
    },
  ],
  tableOfContents: [
    { section: 'Cover Story', title: 'The Next Indian Decade: 100 Builders Powering Bharat', author: 'Arjun Sindhu', page: '42' },
    { section: 'Deep Dive', title: 'The Fabless Revolution: Inside India’s Chip Architecture Renaissance', author: 'Arjun Sindhu', page: '64' },
    { section: 'Markets', title: 'The ₹10,000 Crore IPO Class of 2026: Profitability Audited', author: 'Arjun Sindhu', page: '88' },
    { section: 'Frontier Deeptech', title: 'GalaxEye, SiMa.ai & Sovereign Silicon Foundations', author: 'Arjun Sindhu', page: '112' },
  ],
};
