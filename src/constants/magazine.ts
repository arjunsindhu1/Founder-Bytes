import { MagazineIssue } from '../types';
import { CMSMagazineIssue } from '../types/cms';

export const THIRTY_UNDER_THIRTY_PDF_URL =
  '/magazines/30-under-30-india-2026.pdf';

export const THIRTY_UNDER_THIRTY_MAGAZINE_CMS: CMSMagazineIssue = {
  id: 'founderbytes-30-under-30-india-2026',
  issue_number: 'VOL 01 · ISSUE 01',
  season: 'OCTOBER 2026 EDITION',
  title: '30 UNDER 30 INDIA 2026',
  dek: 'The Next Generation Building India — Official 38-page digital edition spotlighting young founders, innovators, and emerging leaders across AI, SaaS, robotics, FMCG, real estate, exports, education, and design.',
  cover_image: '/fb-30u30-cover-page.png',
  published_date: 'October 2026',
  theme: 'The Next Generation Building India',
  is_featured: true,
  is_published: true,
  pdf_link: THIRTY_UNDER_THIRTY_PDF_URL,
  pdf_file_name: '30-under-30-india-2026.pdf',
  pdf_size_bytes: 3550392,
  page_count: 38,
  featured_founders: [
    {
      name: 'Arjun Sindhu',
      company: 'Brovate',
      valuationOrMetric: 'SaaS & AI · Gurugram',
      storyHeadline: 'Building technology that solves real business problems',
      slug: '30-under-30-india-2026',
    },
    {
      name: 'Suhas Vahini Reddy',
      company: 'LetzStepin Private Limited',
      valuationOrMetric: '14+ Cities · 6 Countries',
      storyHeadline: 'Making businesses more discoverable through immersive experiences',
      slug: '30-under-30-india-2026',
    },
    {
      name: 'Niladri Banerjee',
      company: 'Marktech Labs',
      valuationOrMetric: 'AI & Robotics · Kolkata',
      storyHeadline: 'Building technology that serves humanity',
      slug: '30-under-30-india-2026',
    },
  ],
  table_of_contents: [
    {
      section: 'Opening Essay',
      title: 'The Next Generation Building India',
      author: 'Founder Bytes Team',
      page: '02',
    },
    {
      section: 'AI, SaaS & Robotics',
      title: 'Arjun Sindhu, Suhas Vahini Reddy, Niladri Banerjee & Jayvir Singh Johal',
      author: 'Founder Bytes Team',
      page: '06',
    },
    {
      section: 'Research & Innovation',
      title: 'Dr. Ishtiaq Ahmed, Ali Mehdi Hemani, Mujahid Mohammed & Rahul Kumar Bishnoi',
      author: 'Founder Bytes Team',
      page: '14',
    },
    {
      section: 'Consumer, Exports & FMCG',
      title: 'Daksh Shah, Dhruv & Soham Agarwal (KRUNCH KARO) and Nirakar Patel',
      author: 'Founder Bytes Team',
      page: '22',
    },
    {
      section: 'Real Estate, Design, Media & Education',
      title: "Dr. Sravanthi Ellasiri, Tejasvi Vashishtha, Dr. Divnoor Singh Sethi, Ajay Ratre & Dr. Madan Mohan Mishra",
      author: 'Founder Bytes Team',
      page: '30',
    },
  ],
};

export const DEFAULT_MAGAZINE_ISSUE: MagazineIssue = {
  issueNumber: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.issue_number,
  season: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.season,
  title: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.title,
  dek: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.dek,
  coverImage: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.cover_image,
  coverStorySlug: '30-under-30-india-2026',
  theme: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.theme,
  publishedDate: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.published_date,
  featuredFounders: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.featured_founders,
  tableOfContents: THIRTY_UNDER_THIRTY_MAGAZINE_CMS.table_of_contents,
};
