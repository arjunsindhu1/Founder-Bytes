export type SectorFilter =
  | 'All'
  | 'AI, Robotics & Tech'
  | 'SaaS & Digital Platforms'
  | 'FMCG & Global Exports'
  | 'Education & Research'
  | 'Real Estate, Design & Media';

export interface FounderMetaItem {
  label: string;
  value: string;
  href?: string;
}

export interface ThirtyUnderThirtyFounder {
  index: number;
  numberLabel: string;
  id: string;
  name: string;
  designation: string;
  company?: string;
  industry: string;
  shortLocation?: string;
  sectorTags: SectorFilter[];
  metadata: FounderMetaItem[];
  summary: string;
  paragraphs: string[];
  profileTheme: string;
  website?: string;
}

export const THIRTY_UNDER_THIRTY_META = {
  pageTitle: "30 Under 30 India 2026 | Founder Bytes – India's Business & Startup Magazine",
  metaDescription:
    'Meet the founders featured in Founder Bytes 30 Under 30 India 2026. Discover emerging entrepreneurs and business builders across technology, AI, SaaS, FMCG, education, real estate and more.',
  canonicalUrl: 'https://founderbytes.in/30-under-30-india-2026',
  coverImagePath: '/fb-30u30-cover-page.png',
  coverImageAbsoluteUrl: 'https://founderbytes.in/fb-30u30-cover-page.png',
  coverImageAlt:
    'Founder Bytes – 30 Under 30 India 2026 Official Magazine Cover, October 2026 Volume 01 Issue 01 – The Next Generation Building India',
  editionLabel: 'October 2026 · Volume 01 · Issue 01',
  magazineTitle: 'FOUNDER BYTES – THE FOUNDER MAGAZINE',
  magazineSubtitle: "India's Business & Startup Magazine",
};

export const SECTOR_FILTERS: SectorFilter[] = [
  'All',
  'AI, Robotics & Tech',
  'SaaS & Digital Platforms',
  'FMCG & Global Exports',
  'Education & Research',
  'Real Estate, Design & Media',
];

export const THIRTY_UNDER_THIRTY_INTRO = {
  kicker: 'FOUNDER BYTES – 30 UNDER 30 INDIA 2026',
  headline: 'The Next Generation Building India',
  paragraphs: [
    "India's next generation of entrepreneurs, innovators, business leaders and creators is not waiting for the future. They are building it.",
    'Founder Bytes – 30 Under 30 India 2026 brings together a diverse group of young founders and emerging leaders working across technology, artificial intelligence, robotics, SaaS, food and FMCG, real estate, education, branding, creative industries, exports, social impact and more.',
    'Their journeys reflect different ambitions, industries and approaches to building businesses. Some are developing technology-driven platforms, some are creating new consumer brands, some are making education more accessible, while others are building ventures around creativity, research, innovation and community impact.',
    "This edition celebrates the ideas, work, ambition and entrepreneurial journeys of the people contributing to India's evolving business landscape.",
  ],
  leadStatement: 'More than a list of names, this is a look at the people building what comes next.',
};

export const ABOUT_FOUNDER_BYTES = {
  heading: 'About Founder Bytes',
  paragraphs: [
    'Founder Bytes is an Indian business and startup media publication focused on founders, entrepreneurship, business developments, innovation and emerging opportunities.',
    "Through editorial features, founder stories, business coverage and industry insights, Founder Bytes aims to document the people and ideas shaping India's business ecosystem.",
  ],
  magazineTitle: 'FOUNDER BYTES – THE FOUNDER MAGAZINE',
  magazineTagline: "India's Business & Startup Magazine",
};

export const CLOSING_EDITORIAL = {
  heading: 'The Next Generation Is Already Building',
  paragraphs: [
    'Across cities, campuses, laboratories, design studios and growing enterprises, the founders featured in Founder Bytes – 30 Under 30 India 2026 represent the breadth of modern Indian entrepreneurship.',
    'Working across artificial intelligence, SaaS, immersive technology, robotics, real estate, research, packaged snacks, global exports, publishing, music, brand design and academic leadership, each profile reflects an individual path shaped by curiosity, execution and resilience.',
    "As Founder Bytes – The Founder Magazine launches its October 2026, Volume 01, Issue 01 edition, these stories stand as a record of emerging builders contributing to India's business and innovation landscape.",
  ],
  closingLine: 'The future is not simply something to watch. It is something to build.',
};

export const THIRTY_UNDER_THIRTY_FOUNDERS: ThirtyUnderThirtyFounder[] = [
  {
    index: 1,
    numberLabel: '01',
    id: 'founder-arjun-sindhu',
    name: 'Arjun Sindhu',
    designation: 'Founder, Brovate',
    company: 'Brovate',
    industry: 'SaaS, Artificial Intelligence and Technology',
    shortLocation: 'Gurugram, India',
    sectorTags: ['AI, Robotics & Tech', 'SaaS & Digital Platforms'],
    metadata: [
      { label: 'Industry', value: 'SaaS, Artificial Intelligence and Technology' },
      { label: 'Location', value: 'Gurugram, India' },
      { label: 'Company', value: 'Brovate' },
      { label: 'Founded', value: '2024' },
    ],
    summary:
      'Founder of Brovate, a Gurugram-based SaaS platform helping businesses build, grow and operate digitally through AI-powered tools.',
    paragraphs: [
      'Arjun Sindhu is the founder of Brovate, a SaaS platform focused on helping businesses build, grow and operate digitally through AI-powered tools.',
      'Founded in 2024 and based in Gurugram, India, Brovate aims to help businesses simplify operations, improve digital workflows and adopt artificial intelligence in practical, accessible ways.',
      'His work centres on developing technology products that address everyday operational needs for growing enterprises.',
    ],
    profileTheme: 'Building technology that solves real business problems.',
  },
  {
    index: 2,
    numberLabel: '02',
    id: 'founder-suhas-vahini-reddy',
    name: 'Suhas Vahini Reddy',
    designation: 'Founder & Director, LetzStepin Private Limited',
    company: 'LetzStepin Private Limited',
    industry: 'Immersive Technology, Digital Transformation and Growth',
    shortLocation: 'Pune, India',
    sectorTags: ['SaaS & Digital Platforms', 'AI, Robotics & Tech'],
    metadata: [
      { label: 'Industry', value: 'Immersive Technology, Digital Transformation and Growth' },
      { label: 'Company', value: 'LetzStepin Private Limited' },
      { label: 'Founded', value: 'December 2020' },
      { label: 'Headquarters', value: 'Bhumkar Nagar, Pune' },
      { label: 'Team', value: '36–81, including interns (as reported for 2025)' },
    ],
    summary:
      'Founder & Director of LetzStepin Private Limited, scaling immersive digital discovery across more than 14 Indian cities and 6 countries.',
    paragraphs: [
      'Suhas Vahini Reddy is the Founder & Director of LetzStepin Private Limited, an immersive technology, digital transformation and growth company founded in December 2020 and headquartered in Bhumkar Nagar, Pune.',
      'Built alongside founding member and Director Sumit Madhukar Bhumkar, LetzStepin helps businesses enhance visibility and customer engagement through interactive digital experiences.',
      'Operating with a team of 36–81 people including interns as reported for 2025, the company has established presence across more than 14 Indian cities and 6 countries.',
    ],
    profileTheme: 'Making businesses more discoverable through immersive experiences.',
  },
  {
    index: 3,
    numberLabel: '03',
    id: 'founder-niladri-banerjee',
    name: 'Niladri Banerjee',
    designation: 'Founder, Marktech Labs',
    company: 'Marktech Labs',
    industry: 'Artificial Intelligence, Robotics and Engineering',
    shortLocation: 'Kolkata, West Bengal, India',
    sectorTags: ['AI, Robotics & Tech'],
    metadata: [
      { label: 'Industry', value: 'Artificial Intelligence, Robotics and Engineering' },
      { label: 'Location', value: 'Kolkata, West Bengal, India' },
      { label: 'Company', value: 'Marktech Labs' },
      { label: 'Team', value: '10 members' },
    ],
    summary:
      'Founder of Kolkata-based Marktech Labs, leading a 10-member team across artificial intelligence, robotics and engineering.',
    paragraphs: [
      'Niladri Banerjee is the founder of Marktech Labs, an artificial intelligence, robotics and engineering venture based in Kolkata, West Bengal, India.',
      'Leading a team of 10 members, he works on developing intelligent systems and applied engineering solutions guided by practical utility and human-centred purpose.',
      'Through Marktech Labs, his focus lies in advancing robotics and AI capabilities aimed at meaningful real-world impact.',
    ],
    profileTheme: 'Building technology that serves humanity.',
  },
  {
    index: 4,
    numberLabel: '04',
    id: 'founder-dr-sravanthi-ellasiri',
    name: 'Dr. Sravanthi Ellasiri',
    designation: 'Founder, S-Infra Heights Pvt. Ltd.',
    company: 'S-Infra Heights Pvt. Ltd.',
    industry: 'Real Estate, Business Development and Branding',
    sectorTags: ['Real Estate, Design & Media'],
    metadata: [
      { label: 'Industry', value: 'Real Estate, Business Development and Branding' },
      { label: 'Company', value: 'S-Infra Heights Pvt. Ltd.' },
      { label: 'Other Ventures', value: 'BOXWISH and Toothwish 24/7 Dental Hospital' },
    ],
    summary:
      'Founder of S-Infra Heights Pvt. Ltd., whose entrepreneurial work bridges dentistry, real estate, business development and branding.',
    paragraphs: [
      'Dr. Sravanthi Ellasiri is the founder of S-Infra Heights Pvt. Ltd., operating across real estate, business development and branding.',
      'Her entrepreneurial journey bridges clinical dentistry and multi-sector enterprise, extending to other ventures including BOXWISH and Toothwish 24/7 Dental Hospital.',
      'As reported in the magazine edition, her contributions have received recognition including Youth Icon of Telangana (2021) and Women of Inspiration / Her Excellency recognition (2018).',
    ],
    profileTheme: 'From dentistry to business development and real estate entrepreneurship.',
  },
  {
    index: 5,
    numberLabel: '05',
    id: 'founder-dr-ishtiaq-ahmed',
    name: 'Dr. Ishtiaq Ahmed',
    designation: 'Founder / Entrepreneur, Researcher and Innovator',
    company: 'GODS I Innovation Lab Private Limited',
    industry: 'Advanced Materials, Research, Engineering, Robotics and Education',
    sectorTags: ['AI, Robotics & Tech', 'Education & Research'],
    metadata: [
      { label: 'Industry', value: 'Advanced Materials, Research, Engineering, Robotics and Education' },
      { label: 'Key Venture', value: 'GODS I Innovation Lab Private Limited' },
      { label: 'Philosophy', value: 'Conscious Engineering – beyond Industry 4.0' },
    ],
    summary:
      'Entrepreneur, researcher and innovator advancing conscious engineering through GODS I Innovation Lab, research publications and international patents.',
    paragraphs: [
      'Dr. Ishtiaq Ahmed is an entrepreneur, researcher and innovator working across advanced materials, research, engineering, robotics and education.',
      'Guided by the philosophy of "Conscious Engineering – beyond Industry 4.0", his key venture is GODS I Innovation Lab Private Limited.',
      'His broader work encompasses GODS I Innovation Lab Pvt. Ltd., QUGEN Research Science Pvt. Ltd., Indian State of Career Education, National Advance Research Lab (NAR), Namma Academy of Commerce and Quantum Tech Labs.',
      'Alongside venture building, he has authored 14+ research papers and holds patent grants across Indian, UK and US jurisdictions.',
    ],
    profileTheme: 'Creating innovation ecosystems through conscious engineering and research.',
  },
  {
    index: 6,
    numberLabel: '06',
    id: 'founder-mujahid-mohammed',
    name: 'Mujahid Mohammed',
    designation: 'Founder, Think Decor',
    company: 'Think Decor',
    industry: 'Home Improvement Technology and Software',
    shortLocation: 'Northampton, United Kingdom',
    sectorTags: ['SaaS & Digital Platforms'],
    metadata: [
      { label: 'Industry', value: 'Home Improvement Technology and Software' },
      { label: 'Company', value: 'Think Decor' },
      { label: 'Headquarters', value: 'Northampton, United Kingdom' },
    ],
    summary:
      'Bangalore-based entrepreneur and founder of UK-headquartered Think Decor, making home design and improvement accessible through software.',
    paragraphs: [
      'Mujahid Mohammed is a Bangalore-based entrepreneur and the founder of Think Decor, a home improvement technology and software company headquartered in Northampton, United Kingdom.',
      'Formerly the founder of Soilcane, he built Think Decor to simplify home design and improvement decisions through accessible digital software.',
      'Following its Android app launch in 2025, Think Decor has continued progressing toward further product milestones in 2026.',
    ],
    profileTheme: 'Making home design and improvement more accessible through technology.',
  },
  {
    index: 7,
    numberLabel: '07',
    id: 'founder-rahul-kumar-bishnoi',
    name: 'Rahul Kumar Bishnoi',
    designation: 'Co-Founder & Director, SponExus',
    company: 'SponExus Marketplace Private Limited',
    industry: 'Event Sponsorship Marketplace',
    shortLocation: 'Raisinghnagar, Rajasthan',
    sectorTags: ['SaaS & Digital Platforms'],
    metadata: [
      { label: 'Industry', value: 'Event Sponsorship Marketplace' },
      { label: 'Location', value: 'Raisinghnagar, Rajasthan' },
      { label: 'Company', value: 'SponExus Marketplace Private Limited' },
      { label: 'Website', value: 'sponexus.com', href: 'https://sponexus.com' },
    ],
    summary:
      'Co-Founder & Director of DPIIT-recognised SponExus Marketplace Private Limited, structuring event sponsorships from Raisinghnagar, Rajasthan.',
    paragraphs: [
      'Rahul Kumar Bishnoi is the Co-Founder & Director of SponExus (SponExus Marketplace Private Limited), an event sponsorship marketplace based in Raisinghnagar, Rajasthan and accessible at sponexus.com.',
      'Co-founded and directed by Rahul Kumar Bishnoi and Alka Yadav and incorporated in May 2026, the DPIIT-recognised company focuses on bringing transparency, accessibility and organisation to event sponsorships.',
      'SponExus has signed an MoU with GD Goenka University and entered active incubation at AVISHKAR Center of Innovation and Entrepreneurship on 4 November 2026.',
    ],
    profileTheme: 'Making event sponsorship more accessible and organised.',
    website: 'https://sponexus.com',
  },
  {
    index: 8,
    numberLabel: '08',
    id: 'founder-ali-mehdi-hemani',
    name: 'Ali Mehdi Hemani',
    designation: 'Founder & CEO, DIGITALIST (DIT)',
    company: 'DIGITALIST Institute',
    industry: 'Artificial Intelligence Education, Training and Entrepreneurship',
    shortLocation: 'Mumbai, Maharashtra, India',
    sectorTags: ['AI, Robotics & Tech', 'Education & Research'],
    metadata: [
      { label: 'Industry', value: 'Artificial Intelligence Education, Training and Entrepreneurship' },
      { label: 'Company', value: 'DIGITALIST Institute' },
      { label: 'Training Since', value: '2017' },
      { label: 'Headquarters', value: 'Mumbai, Maharashtra, India' },
      { label: 'Branch Presence', value: 'Across India and Dubai, UAE' },
      { label: 'Team', value: '10+' },
    ],
    summary:
      'Founder & CEO of DIGITALIST Institute, having trained over 100,000 learners in practical AI across India and Dubai, UAE.',
    paragraphs: [
      'Ali Mehdi Hemani is the Founder & CEO of DIGITALIST (DIT) and DIGITALIST Institute, dedicated to artificial intelligence education, training and entrepreneurship.',
      'Headquartered in Mumbai, Maharashtra, India, with branch presence across India and Dubai, UAE and a team of 10+, he has been active in training since 2017 and has trained more than 100,000 learners.',
      'A Smart India Hackathon 2017 Ministry of Railways challenge winner, his focus remains on making practical AI education accessible to students, professionals and founders.',
    ],
    profileTheme: 'Making practical AI education accessible.',
  },
  {
    index: 9,
    numberLabel: '09',
    id: 'founder-nirakar-patel',
    name: 'Nirakar Patel',
    designation: 'Founder & CEO, Ideazin Group of Technologies',
    company: 'Ideazin Group of Technologies',
    industry: 'Technology, SaaS and Entrepreneurship',
    shortLocation: 'Jharsuguda, Odisha',
    sectorTags: ['SaaS & Digital Platforms', 'AI, Robotics & Tech'],
    metadata: [
      { label: 'Industry', value: 'Technology, SaaS and Entrepreneurship' },
      { label: 'Location', value: 'Jharsuguda, Odisha' },
      { label: 'Company', value: 'Ideazin Group of Technologies' },
    ],
    summary:
      'Founder & CEO of Ideazin Group of Technologies in Jharsuguda, Odisha, who built Luk at 17 and launched IDZ at 19.',
    paragraphs: [
      'Nirakar Patel is the Founder & CEO of Ideazin Group of Technologies, working across technology, SaaS and entrepreneurship from Jharsuguda, Odisha.',
      'He began building early, creating Luk at age 17 (reported to have reached more than 1 million users) and launching the cryptocurrency IDZ at age 19.',
      'As highlighted in the magazine edition, his entrepreneurial work has been recognised with Young Entrepreneur of the Year 2026 and the National Pride and Excellence Award 2026.',
    ],
    profileTheme: 'Building ideas into ventures – from India to the world.',
  },
  {
    index: 10,
    numberLabel: '10',
    id: 'founder-daksh-shah',
    name: 'Daksh Shah',
    designation: 'Student Founder and Spices & Saffron Exporter',
    industry: 'Agriculture, Food Exports and International Trade',
    shortLocation: 'Mumbai, India',
    sectorTags: ['FMCG & Global Exports'],
    metadata: [
      { label: 'Industry', value: 'Agriculture, Food Exports and International Trade' },
      { label: 'Education', value: 'BBA, NMIMS Mumbai' },
      { label: 'Age', value: '21' },
    ],
    summary:
      '21-year-old student founder at NMIMS Mumbai building an export-focused enterprise in authentic Indian spices and saffron.',
    paragraphs: [
      'Daksh Shah is a 21-year-old student founder and spices & saffron exporter currently pursuing his BBA at NMIMS Mumbai.',
      'Working across agriculture, food exports and international trade, he focuses on connecting authentic Indian spices and saffron with global markets.',
      'Combining undergraduate business studies with international trade execution, his work reflects a practical approach to taking India’s agricultural heritage worldwide.',
    ],
    profileTheme: "Bringing India's authentic flavours to global markets.",
  },
  {
    index: 11,
    numberLabel: '11',
    id: 'founder-tejasvi-vashishtha',
    name: 'Tejasvi Vashishtha',
    designation: 'Founder, India Book of Achievements',
    company: 'India Book of Achievements',
    industry: 'Literature, Publishing, Entrepreneurship and Youth Empowerment',
    sectorTags: ['Education & Research', 'Real Estate, Design & Media'],
    metadata: [
      { label: 'Industry', value: 'Literature, Publishing, Entrepreneurship and Youth Empowerment' },
      { label: 'Company', value: 'India Book of Achievements' },
      { label: 'Other Initiative', value: 'Readice Publication' },
    ],
    summary:
      'Founder of India Book of Achievements and Readice Publication, mentoring more than 3,000 students across India.',
    paragraphs: [
      'Tejasvi Vashishtha is the founder of India Book of Achievements and leads Readice Publication, working across literature, publishing, entrepreneurship and youth empowerment.',
      'As reported in the magazine edition, his publishing and recognition work encompasses more than 130 books published and over 150 world-record recognitions.',
      'He has also mentored more than 3,000 students across India, encouraging young people to document achievements, write and pursue independent initiatives.',
    ],
    profileTheme: 'Recognising excellence and empowering young India.',
  },
  {
    index: 12,
    numberLabel: '12',
    id: 'founder-dhruv',
    name: 'Dhruv',
    designation: 'Founder & Director, KRUNCH KARO',
    company: 'KRUNCH KARO',
    industry: 'Packaged Snacks and FMCG',
    sectorTags: ['FMCG & Global Exports'],
    metadata: [
      { label: 'Industry', value: 'Packaged Snacks and FMCG' },
      { label: 'Brand', value: 'KRUNCH KARO' },
    ],
    summary:
      'Founder & Director of KRUNCH KARO, crafting a modern Indian packaged snacking lineup across six distinct crisp and crunch variants.',
    paragraphs: [
      'Dhruv is Founder & Director of KRUNCH KARO, a packaged snacks and FMCG brand built for India’s evolving consumer palate.',
      'KRUNCH KARO’s portfolio includes six snack variants: Cheesy Makhana Crisps, Creamy Beet Crunch, Ragi Desi Crunch, Millet Bhel Burst Crisps, Mint Spinach Crisps and Quinoa Fire Crisps.',
      'Through KRUNCH KARO, Dhruv is focused on shaping a distinct brand identity around contemporary Indian flavours and everyday snacking.',
    ],
    profileTheme: 'Building a new-age Indian snacking brand.',
  },
  {
    index: 13,
    numberLabel: '13',
    id: 'founder-soham-agarwal',
    name: 'Soham Agarwal',
    designation: 'Founder & Director, KRUNCH KARO',
    company: 'KRUNCH KARO',
    industry: 'Packaged Snacks and FMCG',
    sectorTags: ['FMCG & Global Exports'],
    metadata: [
      { label: 'Industry', value: 'Packaged Snacks and FMCG' },
      { label: 'Brand', value: 'KRUNCH KARO' },
    ],
    summary:
      'Founder & Director of KRUNCH KARO, driving growth, product innovation and overall business strategy in packaged snacks and FMCG.',
    paragraphs: [
      'Soham Agarwal is Founder & Director of KRUNCH KARO, where he drives growth, product innovation and overall business strategy in the packaged snacks and FMCG space.',
      'Working across KRUNCH KARO’s six product variants—Cheesy Makhana Crisps, Creamy Beet Crunch, Ragi Desi Crunch, Millet Bhel Burst Crisps, Mint Spinach Crisps and Quinoa Fire Crisps—he focuses on expanding the brand’s reach and product portfolio.',
      'His leadership combines disciplined business strategy with consumer-focused product development for modern Indian households.',
    ],
    profileTheme: 'Growing an Indian snacking brand through product innovation and strategy.',
  },
  {
    index: 14,
    numberLabel: '14',
    id: 'founder-dr-divnoor-singh-sethi',
    name: 'Dr. Divnoor Singh Sethi',
    designation: 'Founder & Managing Director, Divnoor Records',
    company: 'Divnoor Records',
    industry: 'Music, Literature, Entertainment, Fashion and Lifestyle',
    shortLocation: 'Delhi, India',
    sectorTags: ['Real Estate, Design & Media'],
    metadata: [
      { label: 'Industry', value: 'Music, Literature, Entertainment, Fashion and Lifestyle' },
      { label: 'Location', value: 'Delhi, India' },
      { label: 'Company', value: 'Divnoor Records' },
      { label: 'Founded', value: '2026' },
      { label: 'Team', value: '4' },
      { label: 'Age', value: '27' },
    ],
    summary:
      'Founder & Managing Director of Delhi-based Divnoor Records, combining music, published literature and voluntary blood donation advocacy.',
    paragraphs: [
      'Dr. Divnoor Singh Sethi is the 27-year-old Founder & Managing Director of Divnoor Records, founded in 2026 in Delhi, India, with a team of 4 operating across music, literature, entertainment, fashion and lifestyle.',
      'Writing lyrics since 2019, his creative work includes his book My Khaali Saah (released 20 June 2026), an album featuring 5 songs, 3 independent songs and Best Anthology Author recognition for Honey and Hurt.',
      'Beyond creative entrepreneurship, he has completed approximately 67–68 voluntary blood donations—earning the name "Little Donor Singh"—and received a doctorate for social service during COVID-19.',
    ],
    profileTheme: 'Blending music, literature, lifestyle and social impact.',
  },
  {
    index: 15,
    numberLabel: '15',
    id: 'founder-jayvir-singh-johal',
    name: 'Jayvir Singh Johal',
    designation: 'Founder & CEO, SpanTrace',
    company: 'SpanTrace',
    industry: 'Artificial Intelligence Security and Oversight',
    sectorTags: ['AI, Robotics & Tech'],
    metadata: [
      { label: 'Industry', value: 'Artificial Intelligence Security and Oversight' },
      { label: 'Company', value: 'SpanTrace' },
      { label: 'Work Began', value: '2026' },
      { label: 'Incorporation', value: 'Delaware, United States – in progress' },
      { label: 'Team', value: 'Approximately 5–6 people' },
    ],
    summary:
      '13-year-old Class 8 student and Founder & CEO of SpanTrace, leading a 5–6 member team focused on AI security and oversight.',
    paragraphs: [
      'Jayvir Singh Johal is the 13-year-old Founder & CEO of SpanTrace, studying in Class 8 while building in artificial intelligence security and oversight.',
      'With work beginning in 2026, he leads a team of approximately 5–6 people, while incorporation in Delaware, United States is in progress.',
      'SpanTrace centres on advancing oversight and reliability frameworks aimed at making artificial intelligence systems safer and more trustworthy.',
    ],
    profileTheme: 'Building safer and more trusted AI.',
  },
  {
    index: 16,
    numberLabel: '16',
    id: 'founder-ajay-ratre',
    name: 'Ajay Ratre',
    designation: "Founder, D'signo",
    company: "D'signo",
    industry: 'Brand Consultancy and Graphic Design',
    shortLocation: 'Bhilai, Chhattisgarh',
    sectorTags: ['Real Estate, Design & Media'],
    metadata: [
      { label: 'Industry', value: 'Brand Consultancy and Graphic Design' },
      { label: 'Location', value: 'Bhilai, Chhattisgarh' },
      { label: 'Company', value: "D'signo" },
    ],
    summary:
      "Founder of Bhilai-based brand consultancy and graphic design practice D'signo, blending visual identity with purposeful impact.",
    paragraphs: [
      "Ajay Ratre is the founder of D'signo, a brand consultancy and graphic design venture based in Bhilai, Chhattisgarh.",
      "He conceptualised India's Biggest Mask during COVID-19 in Bhilai, using visual creativity to spark public engagement and awareness.",
      'In September 2025, he was invited to IIT Bhilai to deliver a session on design and purposeful implementation.',
    ],
    profileTheme: "The mind behind D'signo – where creativity meets purpose.",
  },
  {
    index: 17,
    numberLabel: '17',
    id: 'founder-dr-madan-mohan-mishra',
    name: 'Dr. Madan Mohan Mishra',
    designation: 'Senior University Administrator',
    industry: 'Education, Academic Administration and Social Leadership',
    sectorTags: ['Education & Research'],
    metadata: [
      { label: 'Industry', value: 'Education, Academic Administration and Social Leadership' },
      { label: 'Experience', value: '26+ years' },
    ],
    summary:
      'Senior University Administrator with 26+ years of institutional leadership across TCS, KIIT University and National Law University Odisha.',
    paragraphs: [
      'Dr. Madan Mohan Mishra is a Senior University Administrator bringing more than 26 years of experience in education, academic administration and social leadership, alongside an honorary doctorate.',
      'His professional journey includes serving as Incharge Officer at TCS, Senior Supervisor and later Senior Officer at KIIT University, and former Assistant Registrar – General at National Law University Odisha.',
      'His academic qualifications span MA, M.Sc. (Economics), M.A. (Public Administration), M.A. (English), M.Com., L.L.B. and M.B.A. (HR), supported by additional certifications.',
    ],
    profileTheme: 'An educationist, administrator and social leader.',
  },
];

export function buildThirtyUnderThirtySchema(): Record<string, unknown> {
  const baseUrl = 'https://founderbytes.in';
  const canonicalUrl = THIRTY_UNDER_THIRTY_META.canonicalUrl;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'PublicationIssue',
        '@id': `${canonicalUrl}#issue`,
        name: 'Founder Bytes – 30 Under 30 India 2026',
        issueNumber: 'Volume 01, Issue 01',
        datePublished: '2026-10-01',
        isPartOf: {
          '@type': 'Periodical',
          name: 'Founder Bytes – The Founder Magazine',
          url: `${baseUrl}/magazine`,
        },
        image: THIRTY_UNDER_THIRTY_META.coverImageAbsoluteUrl,
        description: THIRTY_UNDER_THIRTY_META.metaDescription,
        url: canonicalUrl,
      },
      {
        '@type': 'Article',
        '@id': `${canonicalUrl}#article`,
        headline: 'Founder Bytes – 30 Under 30 India 2026: The Next Generation Building India',
        description: THIRTY_UNDER_THIRTY_META.metaDescription,
        image: [THIRTY_UNDER_THIRTY_META.coverImageAbsoluteUrl],
        datePublished: '2026-10-01',
        dateModified: '2026-10-31',
        inLanguage: 'en-IN',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        author: {
          '@type': 'Organization',
          name: 'Founder Bytes Team',
          url: `${baseUrl}/author/founder-bytes-team`,
        },
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'Founder Bytes',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/Founder Bytes Media Logo.png`,
            width: 2172,
            height: 724,
          },
        },
        isPartOf: {
          '@id': `${canonicalUrl}#issue`,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#founders-list`,
        name: 'Founders Featured in Founder Bytes – 30 Under 30 India 2026',
        numberOfItems: THIRTY_UNDER_THIRTY_FOUNDERS.length,
        itemListElement: THIRTY_UNDER_THIRTY_FOUNDERS.map((founder) => ({
          '@type': 'ListItem',
          position: founder.index,
          url: `${canonicalUrl}#${founder.id}`,
          item: {
            '@type': 'Person',
            name: founder.name,
            jobTitle: founder.designation,
            ...(founder.company
              ? {
                  worksFor: {
                    '@type': 'Organization',
                    name: founder.company,
                    ...(founder.website ? { url: founder.website } : {}),
                  },
                }
              : {}),
            description: founder.summary,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'The Founder Magazine',
            item: `${baseUrl}/magazine`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '30 Under 30 India 2026',
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}
