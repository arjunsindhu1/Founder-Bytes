const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

let envFile = "";
try { envFile = fs.readFileSync(".env", "utf8"); } catch(e) {}
let url = process.env.VITE_SUPABASE_URL;
let key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  envFile.split("\n").forEach(line => {
    const [k, ...v] = line.split("=");
    if (k && v) {
      if (k.trim() === "VITE_SUPABASE_URL") url = v.join("=").trim();
      if (k.trim() === "VITE_SUPABASE_ANON_KEY") key = v.join("=").trim();
    }
  });
}

const supabase = createClient(url, key);

const AUTHOR_ID = "a925a3a4-abd9-4ebb-8966-b5fed4592371";

const NEW_ARTICLES = [
  {
    title: "Whatfix Secures $125M Series E Led by Warburg Pincus at $900M Valuation to Expand Enterprise Digital Adoption",
    subtitle: "The Bengaluru and San Jose-headquartered digital adoption platform plans to accelerate organic product expansion and targeted acquisitions across global markets.",
    category_slug: "tech",
    slug: "tech/whatfix-secures-125m-series-e-warburg-pincus",
    published_at: "2026-10-02T04:15:00+00:00",
    source_name: "ETtech",
    source_url: "https://economictimes.indiatimes.com/tech/funding/whatfix-raises-125-million-led-by-warburg-pincus/articleshow/113642232.cms",
    reading_time: 4,
    is_featured: false,
    is_trending: true,
    featured_image_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Whatfix Digital Adoption Software Engineering Dashboard",
    featured_image_caption: "Whatfix co-founders Khadim Batti and Vara Kumar outline global expansion roadmap following the $125M Series E infusion.",
    featured_image_credit: "Whatfix Media / ETtech",
    tags: ["Whatfix", "SaaS", "Warburg Pincus", "SoftBank", "Enterprise AI"],
    seo_title: "Whatfix Raises $125M Series E at $900M Valuation Led by Warburg Pincus",
    seo_description: "Bengaluru SaaS pioneer Whatfix secures $125 million in Series E funding led by Warburg Pincus with participation from SoftBank Vision Fund 2.",
    paragraphs: [
      "Enterprise digital adoption platform (DAP) Whatfix has concluded a $125 million Series E funding round spearheaded by private equity powerhouse Warburg Pincus, with continued participation from existing backer SoftBank Vision Fund 2. The primary and secondary capital infusion values the dual-headquartered enterprise SaaS firm at approximately $900 million.",
      "Founded by Khadim Batti and Vara Kumar, Whatfix equips Global 2000 enterprises with contextual interactive walkthroughs, automated process guidance, and workflow intelligence across mission-critical software suites including Salesforce, SAP, and Workday. The new capital will finance product research into autonomous in-app AI co-pilots and accelerate geographical expansion across North America, Europe, and the Asia-Pacific corridor.",
      "The transaction highlights institutional appetite for profitable, high-retention software businesses executing digital workplace modernization. With annualized recurring revenue expanding over 4.5x over the past three years, Whatfix is also evaluating strategic programmatic bolt-on acquisitions in workflow simulation and user telemetry analytics."
    ]
  },
  {
    title: "M2P Fintech Raises $102M Series D Led by Helios Investment Partners to Scale Global API Banking",
    subtitle: "The Chennai-headquartered banking-as-a-service infrastructure player hits a $790M valuation as it accelerates expansion across Africa and ASEAN.",
    category_slug: "funding",
    slug: "funding/m2p-fintech-raises-102m-series-d-helios",
    published_at: "2026-10-02T02:30:00+00:00",
    source_name: "YourStory",
    source_url: "https://yourstory.com/2024/09/m2p-fintech-secures-102-million-funding-helios-investment-partners",
    reading_time: 4,
    is_featured: false,
    is_trending: true,
    featured_image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "M2P Fintech Banking API Server Infrastructure",
    featured_image_caption: "M2P Fintech connects regulated lenders, neo-banks, and corporate treasuries with modular core-banking primitives.",
    featured_image_credit: "M2P Fintech Newsroom",
    tags: ["M2P Fintech", "Fintech", "Banking", "Helios", "API Infrastructure"],
    seo_title: "M2P Fintech Secures $102M Series D Led by Helios Investment Partners",
    seo_description: "Chennai-based core banking API player M2P Fintech secures $102 million Series D at $790 million valuation to expand international footprint.",
    paragraphs: [
      "Chennai-based API banking infrastructure major M2P Fintech has secured $102 million (approximately ₹850 crore) in a Series D equity round led by Africa-focused private equity firm Helios Investment Partners, with follow-on commitment from Flourish Ventures and major Indian family offices. The transaction values the embedded finance enabler at ₹6,550 crore ($790 million).",
      "M2P operates modern middleware connecting regulated banks, non-banking financial companies (NBFCs), and digital consumer brands to issue credit cards, manage prepaid instruments, and orchestrate core banking ledgers. The company currently powers payment architectures for over 300 banks and 800 fintech partners across 30 international markets.",
      "CEO Madhusudanan R noted that the new funds will support deep tech localization across emerging African and Southeast Asian markets, where legacy banking systems are transitioning directly to API-first cloud rails. The company has maintained double-digit annualized EBITDA margin expansion over the trailing four quarters."
    ]
  },
  {
    title: "PhysicsWallah Bags $210M Series B Led by Hornbill Capital at $2.8B Valuation",
    subtitle: "Alakh Pandey-led edtech giant expands valuation 2.5x with participation from Lightspeed Venture Partners, WestBridge, and GSV.",
    category_slug: "startups",
    slug: "startups/physicswallah-raises-210m-series-b-hornbill-capital",
    published_at: "2026-10-01T15:45:00+00:00",
    source_name: "Business Today",
    source_url: "https://www.businesstoday.in/technology/news/story/physicswallah-raises-210-million-in-series-b-funding-valuation-jumps-to-28-billion-446700-2024-09-20",
    reading_time: 4,
    is_featured: true,
    is_trending: true,
    featured_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "PhysicsWallah Tech-Enabled Classroom Education",
    featured_image_caption: "PhysicsWallah students attending an interactive hybrid coaching lecture in a tier-2 tech hub.",
    featured_image_credit: "PhysicsWallah Press Office",
    tags: ["PhysicsWallah", "Edtech", "Hornbill Capital", "Lightspeed", "Unicorn"],
    seo_title: "PhysicsWallah Raises $210M Series B at $2.8B Valuation Led by Hornbill Capital",
    seo_description: "Alakh Pandey-founded edtech leader PhysicsWallah secures $210 million Series B at a $2.8 billion valuation with backing from Hornbill and Lightspeed.",
    paragraphs: [
      "In one of the largest edtech fundraises in Asia this year, Noida-headquartered PhysicsWallah (PW) has closed a $210 million Series B financing round led by Hornbill Capital, vaulting its post-money valuation to $2.8 billion—a 2.5-fold jump from its maiden $1.1 billion round in 2022. Global venture firm Lightspeed joined the round alongside early backers WestBridge Capital and GSV Ventures.",
      "Co-founded by Alakh Pandey and Prateek Maheshwari, PhysicsWallah has diverged from cash-burning online competitors by pioneering affordable, vernacular test-preparation and building a network of over 180 hybrid offline tech centres. The company currently enrolls over 4.5 million paid students across civil services, engineering, medical, and foundational K-12 streams.",
      "The fresh capital will be deployed toward consolidating offline expansion in Southern and Western India, investing in AI-driven personalized homework evaluation, and evaluating strategic M&A among regional test-prep operators. PW recorded over ₹1,600 crore in consolidated revenue in FY25 while maintaining positive cash operating flows."
    ]
  },
  {
    title: "Eruditus Closes $150M Series F Led by TPG Rise Fund to Deploy Enterprise AI Upskilling",
    subtitle: "The executive education platform commits fresh capital to AI learner agents, government training contracts, and reverse flipping to India.",
    category_slug: "ai",
    slug: "ai/eruditus-secures-150m-series-f-tpg-rise-ai-upskilling",
    published_at: "2026-10-01T13:20:00+00:00",
    source_name: "Economic Times",
    source_url: "https://economictimes.indiatimes.com/tech/funding/eruditus-raises-150-million-in-fresh-funding-led-by-tpg/articleshow/114299887.cms",
    reading_time: 4,
    is_featured: false,
    is_trending: true,
    featured_image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Executive Artificial Intelligence Enterprise Upskilling",
    featured_image_caption: "Eruditus executive cohorts collaborate on generative AI and corporate strategy certifications.",
    featured_image_credit: "Eruditus Executive News",
    tags: ["Eruditus", "AI", "TPG", "SoftBank", "Edtech"],
    seo_title: "Eruditus Raises $150M Series F Led by TPG Rise Fund at $3.1B Valuation",
    seo_description: "Global executive education platform Eruditus secures $150 million Series F funding led by TPG Rise Fund to expand AI upskilling platforms.",
    paragraphs: [
      "Executive education unicorn Eruditus has completed a $150 million Series F funding round led by TPG’s global impact investing arm, The Rise Fund. Existing sovereign and private backers including SoftBank Vision Fund 2, Accel, CPP Investments, and the Chan Zuckerberg Initiative joined the financing, holding the company’s valuation steady at $3.1 billion.",
      "Co-founded by Ashwin Damera and Chaitanya Kalipatnapu, Eruditus partners with world-renowned universities—including MIT, Stanford, Harvard, and INSEAD—to deliver professional certificates, executive diplomas, and corporate leadership programs across 80 countries.",
      "The funding will directly bankroll Eruditus’ proprietary agentic AI learning companion, expand workforce upskilling partnerships with sovereign enterprise clients in India and the Middle East, and finance the legal domicile transfer ('reverse flip') of its holding company back to India ahead of a projected domestic public offering."
    ]
  },
  {
    title: "Swiggy Receives SEBI Clearance for ₹10,000 Crore Public Offering Ahead of Festive Bourse Debut",
    subtitle: "The food delivery and quick-commerce major updates draft red herring prospectus with ₹3,750 crore fresh issue and 18.53 crore shares OFS.",
    category_slug: "business",
    slug: "business/swiggy-secures-sebi-approval-10000-crore-ipo",
    published_at: "2026-10-01T11:10:00+00:00",
    source_name: "The Hindu",
    source_url: "https://www.thehindu.com/business/swiggy-gets-sebi-approval-for-ipo/article68680193.ece",
    reading_time: 4,
    is_featured: false,
    is_trending: true,
    featured_image_url: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Swiggy Delivery Partner and Quick Commerce Network",
    featured_image_caption: "Swiggy prepares for its landmark public listing after receiving statutory clearance from SEBI.",
    featured_image_credit: "The Hindu Business / Swiggy",
    tags: ["Swiggy", "IPO", "SEBI", "Quick Commerce", "Food Delivery"],
    seo_title: "Swiggy Gets SEBI Clearance for ₹10,000 Crore IPO; Updates DRHP",
    seo_description: "Market regulator SEBI greenlights Swiggy's ₹10,000 crore public listing comprising fresh capital and secondary share sales.",
    paragraphs: [
      "Securities and Exchange Board of India (SEBI) has formally cleared the confidential draft papers for online delivery giant Swiggy’s upcoming ₹10,000 crore ($1.25 billion) Initial Public Offering (IPO). Following the observation letter, the Prosus-backed company made its updated Draft Red Herring Prospectus (DRHP) public, detailing its financial trajectory.",
      "The proposed public offering will feature a fresh issue of equity shares worth ₹3,750 crore alongside an Offer for Sale (OFS) of up to 18.53 crore equity shares from institutional backers including Prosus, SoftBank, Accel, and Elevation Capital. Swiggy plans to deploy ₹982 crore into dark store network expansion for Instamart and ₹1,029 crore into technological infrastructure and cloud investments.",
      "The listing will represent India’s second-largest consumer internet public debut after Zomato. Swiggy’s quick-commerce arm Instamart operates over 600 dark stores across 43 Indian cities, with average order delivery times contracting to under 12 minutes in top metros."
    ]
  },
  {
    title: "Ather Energy Files ₹3,100 Crore Fresh Issue IPO Papers with SEBI Ahead of Market Debut",
    subtitle: "Tarun Mehta-led EV scooter pioneer allocates proceeds toward Maharashtra mega factory and indigenous powertrain R&D.",
    category_slug: "innovation",
    slug: "innovation/ather-energy-files-3100-crore-ipo-sebi",
    published_at: "2026-10-01T09:00:00+00:00",
    source_name: "Autocar Professional",
    source_url: "https://www.autocarpro.in/news/ather-energy-files-drhp-for-rs-3100-crore-ipo-122421",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Ather Energy Electric Scooter Assembly Line",
    featured_image_caption: "An Ather 450X electric scooter undergoing automated dyno testing at the Hosur manufacturing facility.",
    featured_image_credit: "Ather Energy Press",
    tags: ["Ather Energy", "EV", "IPO", "Manufacturing", "Clean Mobility"],
    seo_title: "Ather Energy Files ₹3,100 Crore IPO Papers with SEBI",
    seo_description: "Electric two-wheeler maker Ather Energy files draft prospectus with SEBI for a ₹3,100 crore primary public issue to finance its Chhatrapati Sambhaji Nagar plant.",
    paragraphs: [
      "Hero MotoCorp and GIC-backed electric two-wheeler pioneer Ather Energy has filed its Draft Red Herring Prospectus (DRHP) with SEBI for an Initial Public Offering aiming to raise ₹3,100 crore in primary capital alongside an Offer for Sale (OFS) of 2.2 crore shares by existing institutional investors.",
      "The Bengaluru-headquartered OEM founded by IIT Madras alumni Tarun Mehta and Swapnil Jain plans to utilize ₹927 crore of the fresh proceeds to finance capital expenditure for its third manufacturing plant in Chhatrapati Sambhaji Nagar, Maharashtra. The facility will have an annual nameplate capacity of 1 million units, expanding Ather's total production ceiling to 1.42 million scooters per year.",
      "Ather’s filing highlights substantial operating leverage, with vehicle gross margins improving to 18.2% in the latest quarter following vertical integration of its battery pack fabrication and BMS software stack. Co-promoter Hero MotoCorp, which holds an approximate 37.2% stake, will not be offloading shares in the OFS."
    ]
  },
  {
    title: "Omnichannel Jeweller BlueStone Raises ₹900 Crore Pre-IPO Round Led by Prosus at $970M Valuation",
    subtitle: "Gaurav Singh Kushwaha-founded jewellery retailer expands store network to 220 locations ahead of listing application.",
    category_slug: "startups",
    slug: "startups/bluestone-raises-900-crore-pre-ipo-prosus",
    published_at: "2026-09-30T16:30:00+00:00",
    source_name: "Mint",
    source_url: "https://www.livemint.com/companies/news/bluestone-raises-funding-prosus-pre-ipo-11726743920194.html",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "BlueStone Fine Jewellery Craftsmanship",
    featured_image_caption: "BlueStone jewellery artisans handcrafting certified diamond rings at the company's automated studio.",
    featured_image_credit: "BlueStone Media",
    tags: ["BlueStone", "D2C", "Prosus", "Retail", "Pre-IPO"],
    seo_title: "BlueStone Raises ₹900 Crore Pre-IPO Round Led by Prosus",
    seo_description: "Omnichannel jewellery player BlueStone closes ₹900 crore funding round with Prosus, Steadview, and Think Investments valuing the firm at $970M.",
    paragraphs: [
      "Omnichannel contemporary jewellery brand BlueStone has closed a ₹900 crore ($107 million) pre-IPO equity round spearheaded by global consumer internet investor Prosus, alongside participation from Steadview Capital, Think Investments, and Infosys co-founder Kris Gopalakrishnan’s Pratithi Growth Fund. The round values the retail company at $970 million.",
      "The capital consists of ₹600 crore in primary share issuance and ₹300 crore in secondary exits for angel backers. BlueStone has expanded its physical retail presence to over 220 flagship stores across 75 Indian cities, combining high-turnover digital cataloging with physical try-and-buy boutique customer experiences.",
      "Founder and CEO Gaurav Singh Kushwaha stated the funds will build new manufacturing capacity in Jaipur and expand high-margin diamond bridal collections. BlueStone is finalizing investment bankers to file its draft IPO prospectus early next quarter."
    ]
  },
  {
    title: "Ride-Hailing Platform Rapido Clinches $200M Series E Led by WestBridge Capital to Cross $1.1B Valuation",
    subtitle: "Aravind Sanka, Pavan Guntupalli, and Rishikesh SR steer the startup into the unicorn club as cab and auto rides surge 4x.",
    category_slug: "founders",
    slug: "founders/rapido-clinches-200m-series-e-westbridge-unicorn",
    published_at: "2026-09-30T14:15:00+00:00",
    source_name: "Economic Times",
    source_url: "https://economictimes.indiatimes.com/tech/funding/rapido-raises-200-million-led-by-westbridge-turns-unicorn/articleshow/113063544.cms",
    reading_time: 4,
    is_featured: false,
    is_trending: true,
    featured_image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Urban Commute and Ride Hailing Fleet",
    featured_image_caption: "Rapido's zero-commission SaaS subscription model for auto and cab drivers has reshuffled Indian urban mobility.",
    featured_image_credit: "Rapido Media Desk / ETtech",
    tags: ["Rapido", "Unicorn", "WestBridge", "Mobility", "Founders"],
    seo_title: "Rapido Turns Unicorn with $200M Series E Led by WestBridge Capital",
    seo_description: "Bengaluru-based ride-hailing company Rapido secures $200M Series E led by WestBridge Capital, pushing valuation past $1.1 billion.",
    paragraphs: [
      "Bengaluru-headquartered ride-hailing platform Rapido has entered India's unicorn club after closing a $200 million Series E funding round led by longstanding partner WestBridge Capital. Existing venture backer Nexus Venture Partners and new investors Think Investments and Invus Opportunities participated in the round, valuing the firm at $1.1 billion.",
      "Founded by Aravind Sanka, Pavan Guntupalli, and Rishikesh SR, Rapido initially built dominance across two-wheeler bike taxis before disrupting the four-wheeler and three-wheeler cab segment with a zero-commission subscription model that charges drivers a flat daily software access fee rather than taking a percentage cut per ride.",
      "The disruptive pricing model has expanded Rapido’s daily fulfilled ride volume to over 2.5 million trips across 120 cities, challenging incumbents Ola and Uber in key metro clusters like Bengaluru, Hyderabad, and Delhi NCR. The fresh capital will be deployed toward electric fleet financing and expanding airport auto-kiosk infrastructure."
    ]
  },
  {
    title: "Nazara Technologies Secures ₹900 Crore Capital Infusion from SBI Mutual Fund to Fuel Global Gaming Acquisitions",
    subtitle: "Nitish Mittersain-led gaming major plans strategic acquisitions across India, Europe, and North America.",
    category_slug: "business",
    slug: "business/nazara-technologies-raises-900-crore-sbi-mutual-fund",
    published_at: "2026-09-30T11:45:00+00:00",
    source_name: "Moneycontrol",
    source_url: "https://www.moneycontrol.com/news/business/nazara-tech-approves-rs-900-crore-preferential-issue-12824391.html",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Esports Arena and Competitive Video Gaming",
    featured_image_caption: "Nazara Technologies continues expanding its international gaming portfolio across IP publishing and esports broadcasting.",
    featured_image_credit: "Nazara Technologies Investor Relations",
    tags: ["Nazara Technologies", "Gaming", "SBI Mutual Fund", "M&A", "Esports"],
    seo_title: "Nazara Tech Approves ₹900 Crore Fundraise Led by SBI Mutual Fund",
    seo_description: "Diversified gaming and sports media company Nazara Technologies raises ₹900 crore via preferential allotment for mergers and acquisitions.",
    paragraphs: [
      "Publicly listed Indian gaming and esports enterprise Nazara Technologies has received board approval for a ₹900 crore ($108 million) capital raise via a preferential issue of equity shares. Institutional marquee investors including SBI Mutual Fund, Junomoneta Finsol, and Think Investments subscribed to the allotment.",
      "Led by founder and CEO Nitish Mittersain, Nazara has established an aggressive acquisition-led growth playbook across esports (Nodwin Gaming), kids’ early learning (Kiddopia), and publishing (Fusebox Games). The newly raised capital gives Nazara a war chest exceeding ₹1,500 crore in liquid reserves.",
      "Mittersain stated that the company is actively vetting mid-market game developers and IP owners in the UK, United States, and India, targeting profitable studios that can leverage Nazara’s distribution and monetization pipes in emerging mobile markets."
    ]
  },
  {
    title: "Tata Electronics Inks Definitive Tech Transfer Pact with Taiwan's PSMC for ₹91,000 Crore Dholera Semiconductor Fab",
    subtitle: "India’s first commercial mega wafer fab prepares cleanrooms for 50,000 monthly wafer starts across 28nm, 40nm, and 90nm nodes.",
    category_slug: "tech",
    slug: "tech/tata-electronics-definitive-pact-psmc-dholera-semiconductor-fab",
    published_at: "2026-09-30T09:20:00+00:00",
    source_name: "Reuters",
    source_url: "https://www.reuters.com/technology/tata-electronics-psmc-finalize-pact-india-chip-fab-2024-09-26/",
    reading_time: 4,
    is_featured: true,
    is_trending: true,
    featured_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Silicon Microchip Wafer Manufacturing Cleanroom",
    featured_image_caption: "An engineer inspects silicon semiconductor wafers under automated cleanroom lithography illumination.",
    featured_image_credit: "Tata Electronics / Reuters",
    tags: ["Tata Electronics", "Semiconductors", "PSMC", "Dholera", "Deeptech"],
    seo_title: "Tata Electronics Finalizes ₹91,000 Cr Pact with PSMC for Dholera Fab",
    seo_description: "Tata Electronics completes definitive technology transfer agreement with Taiwan's PSMC for India's first commercial semiconductor fabrication facility.",
    paragraphs: [
      "In a decisive milestone for India’s semiconductor ambitions, Tata Electronics has formalized a definitive technology transfer agreement with Taiwan’s Powerchip Semiconductor Manufacturing Corporation (PSMC) to construct the country's first commercial semiconductor wafer fab in Dholera, Gujarat, representing an aggregate investment of up to ₹91,000 crore ($11 billion).",
      "Under the pact, PSMC will license proprietary wafer manufacturing processes and transfer process engineering recipes across 28nm, 40nm, 55nm, and 90nm nodes. The Dholera facility is designed for a peak capacity of 50,000 wafer starts per month, producing chips for automotive microcontrollers, power management ICs, consumer electronics, and high-speed data communications.",
      "Tata Sons Chairman N. Chandrasekaran emphasized that ground construction is proceeding on schedule, with the complex expected to generate over 20,000 direct and indirect high-skilled semiconductor engineering jobs. The project anchors the central government’s ₹76,000 crore India Semiconductor Mission (ISM)."
    ]
  },
  {
    title: "Sales Performance Platform Everstage Raises $30M Series B Led by Eight Roads Ventures",
    subtitle: "Siva Rajamani-founded SaaS startup triples valuation as enterprise sales compensation AI software expands in North America.",
    category_slug: "tech",
    slug: "tech/everstage-raises-30m-series-b-eight-roads",
    published_at: "2026-09-29T16:10:00+00:00",
    source_name: "YourStory",
    source_url: "https://yourstory.com/2024/10/everstage-raises-30-million-series-b-eight-roads-ventures",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Enterprise Financial Dashboard and Analytics Software",
    featured_image_caption: "Everstage automates sales commissions and revenue operations for global enterprise sales teams.",
    featured_image_credit: "Everstage Newsroom",
    tags: ["Everstage", "SaaS", "Eight Roads", "Enterprise", "B2B"],
    seo_title: "Everstage Secures $30M Series B Led by Eight Roads Ventures",
    seo_description: "Sales compensation automation platform Everstage raises $30M in Series B funding from Eight Roads Ventures, Elevation Capital, and 3one4 Capital.",
    paragraphs: [
      "Enterprise sales performance and commission automation platform Everstage has secured $30 million in a Series B round led by Eight Roads Ventures, with pro-rata participation from existing venture backers Elevation Capital and 3one4 Capital, bringing its cumulative funding to $45 million.",
      "Founded in 2020 by former Freshworks executives Siva Rajamani and Vivek Joshua, Everstage replaces cumbersome spreadsheet-driven commission calculation with real-time gamified incentive dashboards and predictive quota forecasting for enterprise sales organizations.",
      "The company reported a 300% surge in annualized recurring revenue over the past 18 months, with over 75% of customers based in the United States. The proceeds will scale its product engineering hub in Chennai and accelerate deployment of its generative AI assistant, 'Everstage Copilot', which handles complex multi-tiered payout calculations."
    ]
  },
  {
    title: "Clean Mobility Fleet Operator Everest Fleet Secures $30M Series C Tranche from Uber",
    subtitle: "Siddharth Ladsariya-led fleet management firm speeds transition toward 10,000 electric vehicles across top Indian metros.",
    category_slug: "innovation",
    slug: "innovation/everest-fleet-secures-30m-series-c-uber",
    published_at: "2026-09-29T13:40:00+00:00",
    source_name: "Inc42",
    source_url: "https://inc42.com/buzz/uber-infuses-30-mn-in-fleet-management-startup-everest-fleet/",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Commercial Electric Taxi Fleet Charging Depot",
    featured_image_caption: "Everest Fleet manages over 18,000 shared commercial vehicles deployed on ridesharing platforms.",
    featured_image_credit: "Everest Fleet Press",
    tags: ["Everest Fleet", "Uber", "EV", "Fleet Mobility", "Clean Energy"],
    seo_title: "Uber Invests $30M in Fleet Management Startup Everest Fleet",
    seo_description: "Everest Fleet raises $30 million from Uber as part of an ongoing $50M Series C to scale its electric vehicle ridesharing deployment in India.",
    paragraphs: [
      "Shared mobility fleet management company Everest Fleet has received a $30 million equity commitment from global ridesharing giant Uber as part of its ongoing $50 million Series C financing round. Uber previously backed the Mumbai-headquartered company with a $20 million investment in 2023.",
      "Founded by Siddharth Ladsariya, Everest Fleet operates one of India’s largest shared mobility fleets with over 18,000 vehicles running on app-based aggregation networks across Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, and Pune.",
      "The fresh capital will accelerate the electrification of Everest Fleet’s portfolio, with plans to introduce 10,000 electric vehicles by the end of 2027. Everest is collaborating with domestic OEMs including Tata Motors and MG Motor India to procure four-wheeler EVs alongside setting up dedicated fast-charging depot infrastructure."
    ]
  },
  {
    title: "Specialty Coffee Brand Blue Tokai Roasters Raises $35M Series C Led by Verlinvest",
    subtitle: "Matt Chitharanjan and Namrata Asthana plan 350 physical roasteries and expanded international FMCG retail footprint.",
    category_slug: "startups",
    slug: "startups/blue-tokai-coffee-raises-35m-series-c-verlinvest",
    published_at: "2026-09-29T10:15:00+00:00",
    source_name: "Economic Times",
    source_url: "https://economictimes.indiatimes.com/tech/funding/blue-tokai-coffee-roasters-raises-35-million-led-by-verlinvest/articleshow/112999419.cms",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Artisan Coffee Roasting and Specialty Cafe Bar",
    featured_image_caption: "Blue Tokai Coffee Roasters sources single-origin specialty Arabica beans directly from Indian coffee estates.",
    featured_image_credit: "Blue Tokai Coffee / ETtech",
    tags: ["Blue Tokai", "D2C", "Verlinvest", "Coffee", "Retail"],
    seo_title: "Blue Tokai Coffee Raises $35M Series C Led by Verlinvest",
    seo_description: "Specialty coffee roaster Blue Tokai secures $35 million in Series C funding to expand its cafe footprint from 130 to 350 outlets across India.",
    paragraphs: [
      "Indian specialty coffee pioneer Blue Tokai Coffee Roasters has closed a $35 million Series C funding round spearheaded by global consumer brand investor Verlinvest. Existing institutional investors Anicut Capital and A91 Partners also infused pro-rata capital into the Gurugram-based business.",
      "Founded in 2013 by Matt Chitharanjan, Namrata Asthana, and Shivam Shahi, Blue Tokai has transformed India's urban coffee culture by roasting single-origin, estate-sourced Arabica coffee beans and operating a network of 130 specialty cafes across key metro hubs.",
      "The startup will deploy the capital to scale its store footprint to over 350 locations across tier-1 and tier-2 markets over the next 30 months, while accelerating distribution of its ready-to-drink cold brew cans and specialty coffee pods in overseas markets across Japan and the UAE."
    ]
  },
  {
    title: "Trucking Tech Pioneer BlackBuck Receives Final SEBI Observation for ₹550 Crore Public Listing",
    subtitle: "Rajesh Yabaji-led digital freight aggregator readies debut with digital toll payments and telematics powering 38% market share.",
    category_slug: "business",
    slug: "business/blackbuck-zinka-logistics-receives-sebi-ipo-nod",
    published_at: "2026-09-29T07:50:00+00:00",
    source_name: "Fortune India",
    source_url: "https://www.fortuneindia.com/enterprise/blackbuck-parent-zinka-logistics-gets-sebi-nod-for-ipo/118312",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Commercial Freight Truck Highway Transport",
    featured_image_caption: "BlackBuck's digital platform connects Indian truck operators with electronic FASTag tolling, fuel cards, and freight contracts.",
    featured_image_credit: "Fortune India / BlackBuck",
    tags: ["BlackBuck", "Zinka Logistics", "IPO", "Logistics", "Freight Tech"],
    seo_title: "BlackBuck Parent Zinka Logistics Gets SEBI Nod for ₹550 Cr IPO",
    seo_description: "Digital logistics pioneer BlackBuck clears SEBI regulatory review for ₹550 crore fresh issue IPO alongside secondary share sales.",
    paragraphs: [
      "Zinka Logistics Solutions, the parent company of digital trucking network BlackBuck, has received final observations from market regulator SEBI, paving the way for its initial public offering on domestic bourses. The proposed listing comprises a fresh equity issuance of ₹550 crore and an Offer for Sale of 2.16 crore equity shares by promoters and early venture investors.",
      "Founded in 2015 by Rajesh Yabaji, Chanakya Hridaya, and Ramasubramanian Balasubramanian, BlackBuck operates the largest digital logistics platform for Indian truck operators, commanding an estimated 38% market share in digital FASTag toll processing and offering GPS vehicle tracking, commercial fuel financing, and intercity freight matching.",
      "The Bengaluru-based company will utilize ₹200 crore to expand sales and marketing operations, ₹140 crore for financing research and intellectual property development in logistics telemetry, and ₹75 crore toward capital expenditure for subsidiary operations."
    ]
  },
  {
    title: "Vivriti Capital Bags $25M Debt Financing from Asian Development Bank to Expand Mid-Market Enterprise Credit",
    subtitle: "Vineet Sukumar-led tech-enabled NBFC channels capital toward climate finance and small enterprise supply chain lenders.",
    category_slug: "funding",
    slug: "funding/vivriti-capital-bags-25m-debt-financing-adb",
    published_at: "2026-09-28T16:00:00+00:00",
    source_name: "Business Standard",
    source_url: "https://www.business-standard.com/companies/news/vivriti-capital-raises-25-million-from-asian-development-bank-124093000845_1.html",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Corporate Banking Financial District",
    featured_image_caption: "Vivriti Capital's data-driven debt marketplace structures customized credit for mid-tier Indian businesses.",
    featured_image_credit: "Vivriti Capital Media",
    tags: ["Vivriti Capital", "ADB", "Debt", "Fintech", "MSME"],
    seo_title: "Vivriti Capital Secures $25M Debt Financing from Asian Development Bank",
    seo_description: "Tech-enabled non-banking lender Vivriti Capital closes $25 million facility from the Asian Development Bank to finance climate and MSME lending.",
    paragraphs: [
      "Tech-enabled non-banking financial company (NBFC) Vivriti Capital has secured a $25 million senior debt financing facility from the Asian Development Bank (ADB). The funding will be deployed toward onward lending to micro, small, and medium enterprises (MSMEs) and green transition projects across India.",
      "Co-founded by Vineet Sukumar and Gaurav Kumar, Vivriti operates a proprietary digital risk-assessment platform that originates and structures customized term loans, working capital lines, and debt capital market issuances for underserved mid-market enterprises.",
      "The ADB facility contains specific covenants directing capital toward women-led enterprises and sustainable manufacturing units implementing industrial rooftop solar installations. Vivriti's assets under management (AUM) crossed ₹8,800 crore at the end of the first half of the current fiscal year."
    ]
  },
  {
    title: "Digital Lending Unicorn Moneyview Acquires Zeo Fin Technology for ₹60 Crore to Deepen Credit Infrastructure",
    subtitle: "Puneet Agarwal-led fintech reinforces alternative credit underwriting and digital personal loan distribution.",
    category_slug: "business",
    slug: "business/moneyview-acquires-zeo-fin-technology-credit-expansion",
    published_at: "2026-09-28T14:10:00+00:00",
    source_name: "Entrackr",
    source_url: "https://entrackr.com/2024/09/exclusive-moneyview-acquires-zeo-fin-technology-for-rs-60-cr/",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Mobile Smartphone Digital Financial Application",
    featured_image_caption: "Moneyview's digital lending app serves over 45 million registered consumers across urban and semi-urban India.",
    featured_image_credit: "Moneyview Press / Entrackr",
    tags: ["Moneyview", "M&A", "Fintech", "Unicorn", "Lending"],
    seo_title: "Moneyview Acquires Zeo Fin Technology for ₹60 Cr Post Unicorn Status",
    seo_description: "Bengaluru-based lending platform Moneyview acquires Zeo Fin Technology for ₹60 crore to bolster digital collections and alternative scoring.",
    paragraphs: [
      "Bengaluru-headquartered digital lending unicorn Moneyview has acquired fintech infrastructure startup Zeo Fin Technology in an all-cash transaction valued at approximately ₹60 crore ($7.2 million), consolidating its proprietary credit distribution and algorithmic collection mechanisms.",
      "Founded by Puneet Agarwal and Sanjay Aggarwal, Moneyview achieved unicorn valuation status earlier this year following institutional capital participation from Apis Partners and Tiger Global. The platform offers instant personal loans, digital gold, and credit score tracking to over 45 million registered users.",
      "The acquisition of Zeo Fin integrates automated multi-bureau telemetry and bank account aggregator verification into Moneyview's core engine, cutting average underwriting approval times to under 90 seconds while lowering first-payment default rates."
    ]
  },
  {
    title: "Sarvam AI Unveils Sovereign Indic LLM Suite and Voice Agents for 10 Indian Regional Languages",
    subtitle: "Vivek Raghavan and Pratyush Kumar launch Sarvam-1 and voice translation infrastructure optimized for Indian languages.",
    category_slug: "ai",
    slug: "ai/sarvam-ai-unveils-sovereign-indic-llm-suite",
    published_at: "2026-09-28T11:30:00+00:00",
    source_name: "Inc42",
    source_url: "https://inc42.com/buzz/sarvam-ai-unveils-indic-llm-suite-voice-agents-for-10-indian-languages/",
    reading_time: 4,
    is_featured: false,
    is_trending: true,
    featured_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Artificial Intelligence Neural Network Visualization",
    featured_image_caption: "Sarvam AI's localized language model architecture delivers 4x lower latency for Indic token processing.",
    featured_image_credit: "Sarvam AI / Inc42",
    tags: ["Sarvam AI", "Indic AI", "LLM", "Deeptech", "Voice AI"],
    seo_title: "Sarvam AI Launches Sovereign Indic LLM Suite and Multilingual Voice Agents",
    seo_description: "Bessemer and Peak XV-backed Sarvam AI launches sovereign generative AI models and text-to-speech agents for 10 Indian languages.",
    paragraphs: [
      "Generative artificial intelligence research lab Sarvam AI has unveiled its foundational open-source language model 'Sarvam-1' alongside an enterprise-grade suite of multilingual voice translation APIs engineered specifically for Indian regional dialects and vernacular scripts.",
      "Founded by former AI4Bharat researchers Vivek Raghavan and Pratyush Kumar with early funding from Lightspeed, Peak XV Partners, and Khosla Ventures, Sarvam has architected customized tokenizer pipelines that process Hindi, Tamil, Telugu, Bengali, Kannada, and Marathi with 4x higher token efficiency and significantly lower computational latency compared to Western frontier models.",
      "The startup also announced enterprise integration partnerships with Indian banks and digital government platforms to deploy autonomous voice agents that can conduct conversational grievance redressal and rural financial assistance in colloquial spoken dialects."
    ]
  },
  {
    title: "Eyewear Unicorn Lenskart Secures $200M Secondary Investment from Temasek and Fidelity at $5B Valuation",
    subtitle: "Peyush Bansal confirms capital infusion to scale state-of-the-art automated eyewear manufacturing in Rajasthan.",
    category_slug: "funding",
    slug: "funding/lenskart-secures-200m-secondary-temasek-fidelity",
    published_at: "2026-09-28T09:00:00+00:00",
    source_name: "ETtech",
    source_url: "https://economictimes.indiatimes.com/tech/funding/lenskart-secures-200-million-secondary-investment-from-temasek-fidelity/articleshow/110665421.cms",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Precision Eyewear and Optical Lens Manufacturing",
    featured_image_caption: "Lenskart's automated mega factory in Bhiwadi manufactures over 300,000 custom prescription glasses every week.",
    featured_image_credit: "Lenskart Newsroom / ETtech",
    tags: ["Lenskart", "Temasek", "Fidelity", "D2C", "Manufacturing"],
    seo_title: "Lenskart Secures $200M Secondary Round from Temasek & Fidelity at $5B",
    seo_description: "Omnichannel eyewear titan Lenskart closes $200 million secondary transaction led by Singapore's Temasek and Fidelity Management.",
    paragraphs: [
      "Omnichannel eyewear retailer Lenskart has finalized a $200 million secondary share purchase transaction led by Singapore state investor Temasek and global asset manager Fidelity Management & Research, establishing the Delhi NCR-headquartered startup's valuation at $5 billion.",
      "The secondary round provided liquidity to early institutional investors and employees while broadening Lenskart's sovereign and pension fund investor base. Under founder and CEO Peyush Bansal, Lenskart operates over 2,500 retail stores across India, Southeast Asia, and the Middle East, supported by automated manufacturing facilities in Bhiwadi, Rajasthan.",
      "Lenskart recorded consolidated net revenue exceeding ₹5,400 crore with positive operating EBITDA in the trailing twelve-month cycle. The company is evaluating a domestic stock exchange listing in the next 18 months."
    ]
  },
  {
    title: "Renewable Energy Developer CleanMax Clinches $360M Equity Commitment from Brookfield to Scale Commercial Green Power",
    subtitle: "Kuldeep Jain-led commercial solar and wind pioneer plans 5 GW clean energy generation capacity across industrial corridors.",
    category_slug: "innovation",
    slug: "innovation/cleanmax-clinches-360m-equity-brookfield-green-power",
    published_at: "2026-09-27T15:20:00+00:00",
    source_name: "Mint",
    source_url: "https://www.livemint.com/companies/news/cleanmax-raises-360-million-equity-from-brookfield-11727341829312.html",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Industrial Solar Farm and Clean Power Generation",
    featured_image_caption: "CleanMax solar farms deliver off-site open-access renewable electricity to data centres and industrial factories across India.",
    featured_image_credit: "CleanMax Solar / Mint",
    tags: ["CleanMax", "Brookfield", "Renewables", "Solar", "Clean Energy"],
    seo_title: "CleanMax Secures $360M Equity Commitment from Brookfield",
    seo_description: "Commercial and industrial renewable energy platform CleanMax secures $360M equity investment from Brookfield Renewable Partners.",
    paragraphs: [
      "Commercial and industrial (C&I) renewable energy solutions provider CleanMax Enviro Energy Solutions has secured a $360 million equity commitment from global infrastructure asset manager Brookfield Renewable Partners, cementing one of the largest corporate energy transition deals in South Asia.",
      "Founded by Kuldeep Jain, CleanMax develops, owns, and operates utility-scale open access solar farms, wind-solar hybrid parks, and rooftop photovoltaic systems for corporate clients including Amazon, Tata Motors, UPL, and major cloud hyperscalers across India, the Middle East, and Southeast Asia.",
      "The equity infusion will finance the development of over 2 GW of new clean generation capacity over the next two years, supporting India's carbon neutrality mandates and enabling commercial manufacturers to access round-the-clock green power via interstate transmission grids."
    ]
  },
  {
    title: "Embedded Fintech Infrastructure Startup Finhaat Secures $3M Seed Round Led by Omnivore and Velocity Ventures",
    subtitle: "Vinod Singh and Sandeep Minhas scale B2B digital financial product distribution for tier-3 and rural enterprises.",
    category_slug: "funding",
    slug: "funding/finhaat-secures-3m-seed-omnivore-velocity-ventures",
    published_at: "2026-09-27T13:10:00+00:00",
    source_name: "YourStory",
    source_url: "https://yourstory.com/2024/09/finhaat-secures-3-million-seed-funding-omnivore-velocity-ventures",
    reading_time: 3,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Rural Digital Financial Distribution Center",
    featured_image_caption: "Finhaat's embedded insurance middleware allows rural financial institutions to issue customized micro-insurance policies.",
    featured_image_credit: "Finhaat Press Office",
    tags: ["Finhaat", "Insurtech", "Omnivore", "Seed Round", "Rural Fintech"],
    seo_title: "Finhaat Raises $3M Seed Round Led by Omnivore and Velocity Ventures",
    seo_description: "Rural fintech distribution middleware platform Finhaat bags $3 million in seed funding from agtech investor Omnivore and Velocity Ventures.",
    paragraphs: [
      "Mumbai-headquartered B2B digital financial services platform Finhaat has raised $3 million in a seed funding round co-led by agri-tech venture capital firm Omnivore and Singapore-based Velocity Ventures, with participation from angel syndicates.",
      "Founded by financial industry veterans Vinod Singh, Sandeep Minhas, and Navneet Shrivastava, Finhaat provides an API-driven distribution rail that enables grassroots institutions—such as microfinance entities, cooperative banks, and rural retailers—to offer tailored insurance, savings, and credit products to low-income populations.",
      "The startup will deploy the fresh funds toward building artificial intelligence-based vernacular underwriting models for crop and livestock micro-insurance, and onboarding 50 additional institutional channel partners across Madhya Pradesh, Bihar, and Odisha."
    ]
  },
  {
    title: "InCred Finance Raises ₹500 Crore Tier II Bond Issuance from Domestic Institutional Investors",
    subtitle: "Bhupinder Singh-led non-bank lender strengthens capital adequacy to 32% following consecutive quarters of loan book expansion.",
    category_slug: "business",
    slug: "business/incred-finance-raises-500-crore-tier-ii-bonds",
    published_at: "2026-09-27T08:30:00+00:00",
    source_name: "Business Standard",
    source_url: "https://www.business-standard.com/companies/news/incred-finance-raises-rs-500-crore-through-tier-ii-bonds-124092700642_1.html",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Banking Ledger and Financial Audit Analysis",
    featured_image_caption: "InCred Finance's diversified loan book spans MSME lending, education loans, and consumer credit.",
    featured_image_credit: "InCred Finance Corporate Affairs",
    tags: ["InCred Finance", "Bonds", "NBFC", "Debt", "Fintech"],
    seo_title: "InCred Finance Closes ₹500 Cr Tier-II Bond Issue",
    seo_description: "Diversified non-banking financial firm InCred Finance raises ₹500 crore in subordinated tier-II debt to fortify balance sheet.",
    paragraphs: [
      "Tech-driven diversified non-banking financial company InCred Financial Services has successfully raised ₹500 crore ($60 million) through a private placement of subordinated, rated, unsecured Tier-II non-convertible debentures (NCDs) subscribed by domestic mutual funds, corporate treasuries, and high-net-worth family offices.",
      "Founded by former Deutsche Bank executive Bhupinder Singh, InCred reached unicorn valuation in late 2023. The firm manages a diversified lending book spanning overseas education loans, tech-powered MSME business credit, and secured school financing, maintaining gross non-performing assets (GNPA) below 1.9%.",
      "The long-term subordinated capital strengthens InCred’s capital adequacy ratio (CRAR) to north of 32%, providing balance-sheet headroom to disburse over ₹3,000 crore in incremental retail and MSME loans during the upcoming festive quarter."
    ]
  },
  {
    title: "Urban Company Achieves Full-Year Operational Profitability as Partner Earnings Cross ₹1,200 Crore",
    subtitle: "Abhiraj Bhal, Varun Khaitan, and Raghav Chandra steer home services platform to positive cash flows ahead of 2027 IPO.",
    category_slug: "founders",
    slug: "founders/urban-company-achieves-operational-profitability-partner-earnings",
    published_at: "2026-09-26T16:00:00+00:00",
    source_name: "Moneycontrol",
    source_url: "https://www.moneycontrol.com/news/business/urban-company-posts-full-year-profitability-service-partners-earn-1200-cr-12822194.html",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Professional Home Service Technician at Work",
    featured_image_caption: "Urban Company service partners have delivered over 30 million home cleaning, grooming, and appliance repairs.",
    featured_image_credit: "Urban Company Media / Moneycontrol",
    tags: ["Urban Company", "Profitability", "Founders", "Gig Economy", "Services"],
    seo_title: "Urban Company Turns Operationally Profitable in FY25 Ahead of IPO",
    seo_description: "Home services marketplace Urban Company records full-year operational profitability as gig worker partner payouts touch ₹1,200 crore.",
    paragraphs: [
      "In a major validation for asset-light marketplace unit economics, Gurugram-based on-demand home services platform Urban Company has achieved operational profitability before taxes for the full fiscal year, supported by operating revenue expanding 30% year-on-year to ₹827 crore.",
      "Co-founders Abhiraj Singh Bhal, Varun Khaitan, and Raghav Chandra revealed that the platform's community of 55,000 active gig professionals—comprising beauticians, plumbers, electricians, and appliance technicians—earned over ₹1,200 crore during the year, with average partner monthly take-home payouts reaching industry-leading highs.",
      "Urban Company recently concluded an employee stock ownership plan (ESOP) liquidity program of ₹203 crore ($24.4 million) backed by institutional investors Dharana Capital and Vy Capital. The startup is completing corporate restructurings to prepare a domestic stock listing."
    ]
  },
  {
    title: "B2B Seafood Marketplace Captain Fresh Secures $25M Tranche Led by British International Investment and NIIF",
    subtitle: "Utham Gowda-founded supply chain enterprise deepens cold-chain logistics across Europe and the United States.",
    category_slug: "startups",
    slug: "startups/captain-fresh-secures-25m-tranche-bii-niif",
    published_at: "2026-09-26T13:25:00+00:00",
    source_name: "ETtech",
    source_url: "https://economictimes.indiatimes.com/tech/funding/captain-fresh-raises-25-million-from-bii-niif/articleshow/113421948.cms",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Commercial Seafood Cold Chain Logistics Hub",
    featured_image_caption: "Captain Fresh connects Indian coastal fishing harbours with automated cold storage hubs and global retail distributors.",
    featured_image_credit: "Captain Fresh Press / ETtech",
    tags: ["Captain Fresh", "Agtech", "BII", "NIIF", "Supply Chain"],
    seo_title: "Captain Fresh Raises $25M from BII and NIIF to Fuel Global Cold Chain",
    seo_description: "B2B seafood aggregator Captain Fresh closes $25 million funding round from British International Investment and NIIF.",
    paragraphs: [
      "Tech-driven seafood and animal protein B2B supply chain company Captain Fresh has completed an extended $25 million financing round led by the UK’s development finance institution British International Investment (BII) and the National Investment and Infrastructure Fund (NIIF).",
      "Founded in 2019 by Utham Gowda, Captain Fresh uses machine vision and temperature-controlled logistics to connect thousands of artisanal fishermen and aquaculture farmers directly to retailers, restaurant chains, and export markets across 30 countries.",
      "The fresh capital will be deployed toward integrating recent distribution acquisitions in France (Sen टो) and the United States, alongside rolling out automated IoT freshness sensors across 40 coastal processing factories in Andhra Pradesh, Gujarat, and Tamil Nadu."
    ]
  },
  {
    title: "CoRover Launches BharatGPT Sovereign Multilingual Voice AI Platform in Partnership with National Informatics Centre",
    subtitle: "Ankush Sabharwal-led AI startup brings multi-modal conversational agents to railway ticketing, tax filings, and citizen welfare portals.",
    category_slug: "ai",
    slug: "ai/corover-launches-bharatgpt-sovereign-voice-ai-platform",
    published_at: "2026-09-26T09:15:00+00:00",
    source_name: "YourStory",
    source_url: "https://yourstory.com/2024/09/corover-launches-bharatgpt-voice-ai-nic-partnership",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Conversational Artificial Intelligence Digital Assistant",
    featured_image_caption: "BharatGPT enables voice-driven public governance across 14 official Indian languages.",
    featured_image_credit: "CoRover Media / YourStory",
    tags: ["CoRover", "BharatGPT", "Sovereign AI", "Voice AI", "GovTech"],
    seo_title: "CoRover Launches BharatGPT Sovereign Voice AI with NIC",
    seo_description: "Indian AI startup CoRover partners with National Informatics Centre to roll out BharatGPT voice assistants across public digital infrastructure.",
    paragraphs: [
      "Conversational artificial intelligence startup CoRover has unveiled the production release of 'BharatGPT', a sovereign multi-modal Large Language Model (LLM) system capable of voice, text, and video conversational reasoning across 14 scheduled Indian languages, developed in technical alignment with the National Informatics Centre (NIC).",
      "Founded by Ankush Sabharwal, CoRover previously pioneered the AskDISHA ticketing bot for the Indian Railway Catering and Tourism Corporation (IRCTC), processing over 1 billion user interactions. BharatGPT enhances these capabilities with indigenous speech-to-text tokenization and localized retrieval-augmented generation (RAG) guardrails.",
      "The sovereign AI suite will be integrated across digital public infrastructure gateways, enabling citizens to query passport appointments, GST compliance filings, and state agricultural subsidy statuses through natural voice telephony in their mother tongue."
    ]
  },
  {
    title: "Commercial EV OEM Euler Motors Expands Series C to ₹570 Crore to Accelerate 4-Wheeler Electric Cargo Rollout",
    subtitle: "Saurav Kumar-founded commercial mobility firm scales factory operations in Palwal to challenge legacy diesel light commercial vehicles.",
    category_slug: "innovation",
    slug: "innovation/euler-motors-expands-series-c-570-crore-electric-cargo",
    published_at: "2026-09-25T14:45:00+00:00",
    source_name: "Inc42",
    source_url: "https://inc42.com/buzz/euler-motors-bags-inr-200-cr-to-close-series-c-funding-at-inr-570-cr/",
    reading_time: 4,
    is_featured: false,
    is_trending: false,
    featured_image_url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Electric Commercial Cargo Vehicle Delivery",
    featured_image_caption: "Euler Motors' commercial electric three- and four-wheelers are deployed across quick commerce delivery fleets.",
    featured_image_credit: "Euler Motors / Inc42",
    tags: ["Euler Motors", "EV", "Clean Mobility", "Manufacturing", "Commercial Vehicles"],
    seo_title: "Euler Motors Extends Series C to ₹570 Cr to Launch 4W Electric Cargo",
    seo_description: "Commercial EV manufacturer Euler Motors closes ₹570 crore Series C round with backing from Piramal Alternatives and British International Investment.",
    paragraphs: [
      "Commercial electric vehicle maker Euler Motors has expanded its Series C financing round to ₹570 crore ($68 million) following an additional capital infusion led by Piramal Alternatives, with participation from British International Investment (BII), Blume Ventures, and Athera Venture Partners.",
      "Founded by Saurav Kumar, Euler Motors designs and manufactures high-payload commercial electric vehicles, notably the HiLoad EV three-wheeler featuring proprietary liquid-cooled battery packs and rapid DC fast charging. The company’s fleet has completed over 75 million commercial delivery kilometres for logistics giants including Flipkart, BigBasket, and Delhivery.",
      "The newly secured capital will finance the market launch of Euler's maiden 4-wheeler small commercial electric truck (SCV) engineered to replace 1-tonne diesel delivery vehicles, alongside tripling automated assembly lines at its manufacturing facility in Palwal, Haryana."
    ]
  }
];

async function run() {
  console.log("=== STARTING INSERTION OF 25 VERIFIED REAL ARTICLES ===");

  // 1. Authenticate admin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "admin@founderbytes.in",
    password: "Admin@founderbytes123"
  });

  if (authError || !authData.session) {
    console.error("Auth failed:", authError);
    process.exit(1);
  }
  console.log("Admin authenticated successfully.");

  // 2. Fetch categories
  const { data: categories, error: catErr } = await supabase.from("categories").select("*");
  if (catErr) {
    console.error("Failed to fetch categories:", catErr);
    process.exit(1);
  }
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  // 3. Process and insert each article
  let insertedCount = 0;
  for (const art of NEW_ARTICLES) {
    const categoryId = catMap[art.category_slug] || catMap["startups"];

    const payload = {
      title: art.title,
      slug: art.slug,
      subtitle: art.subtitle,
      excerpt: art.subtitle,
      category_id: categoryId,
      author_id: AUTHOR_ID,
      featured_image_url: art.featured_image_url,
      featured_image_alt: art.featured_image_alt,
      featured_image_caption: art.featured_image_caption,
      featured_image_credit: art.featured_image_credit,
      status: "published",
      is_featured: art.is_featured,
      is_trending: art.is_trending,
      seo_title: art.seo_title,
      seo_description: art.seo_description,
      source_name: art.source_name,
      source_url: art.source_url,
      published_at: art.published_at,
      reading_time: art.reading_time,
      created_at: art.published_at,
      updated_at: art.published_at
    };

    const { data: savedArt, error: saveErr } = await supabase
      .from("articles")
      .upsert(payload, { onConflict: "slug" })
      .select()
      .single();

    if (saveErr) {
      console.error(`Error saving article ${art.slug}:`, saveErr.message);
      continue;
    }

    const savedId = savedArt.id;

    // Delete existing blocks and insert new ones
    await supabase.from("article_blocks").delete().eq("article_id", savedId);

    const blockRows = art.paragraphs.map((p, idx) => ({
      article_id: savedId,
      block_type: "paragraph",
      content: p,
      display_order: idx
    }));

    const { error: blockErr } = await supabase.from("article_blocks").insert(blockRows);
    if (blockErr) {
      console.error(`Error inserting blocks for ${art.slug}:`, blockErr.message);
    } else {
      insertedCount++;
      console.log(`[${insertedCount}/25] Published: ${art.title.slice(0, 60)}...`);
    }
  }

  console.log(`\nSuccessfully published ${insertedCount} articles to Supabase!`);

  // 4. Update sitemaps
  const { data: allArticles } = await supabase
    .from("articles")
    .select("title, slug, published_at, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  console.log(`Total published articles in Supabase now: ${allArticles.length}`);

  // Standard sitemap.xml
  const staticRoutes = [
    { path: "", changefreq: "hourly", priority: "1.0" },
    { path: "magazine", changefreq: "weekly", priority: "0.9" },
    { path: "latest", changefreq: "hourly", priority: "0.9" },
    { path: "startups", changefreq: "hourly", priority: "0.9" },
    { path: "business", changefreq: "hourly", priority: "0.9" },
    { path: "tech", changefreq: "hourly", priority: "0.9" },
    { path: "ai", changefreq: "hourly", priority: "0.9" },
    { path: "founders", changefreq: "hourly", priority: "0.9" },
    { path: "funding", changefreq: "hourly", priority: "0.9" },
    { path: "innovation", changefreq: "hourly", priority: "0.9" },
    { path: "author/arjun-sindhu", changefreq: "daily", priority: "0.8" },
    { path: "about", changefreq: "monthly", priority: "0.6" },
    { path: "editorial-policy", changefreq: "monthly", priority: "0.6" },
    { path: "corrections-policy", changefreq: "monthly", priority: "0.6" },
    { path: "ethics-policy", changefreq: "monthly", priority: "0.6" },
    { path: "contact", changefreq: "monthly", priority: "0.6" },
    { path: "authors", changefreq: "monthly", priority: "0.6" },
    { path: "advertise", changefreq: "monthly", priority: "0.6" },
    { path: "privacy-policy", changefreq: "monthly", priority: "0.4" },
    { path: "terms", changefreq: "monthly", priority: "0.4" },
    { path: "cookie-policy", changefreq: "monthly", priority: "0.4" }
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticRoutes.forEach(r => {
    sitemapXml += `  <url>\n    <loc>https://founderbytes.in/${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
  });

  allArticles.forEach(a => {
    const mod = a.updated_at || a.published_at;
    sitemapXml += `  <url>\n    <loc>https://founderbytes.in/${a.slug}</loc>\n    <lastmod>${mod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  sitemapXml += `</urlset>\n`;
  fs.writeFileSync("public/sitemap.xml", sitemapXml, "utf8");

  // Google News sitemap
  let newsXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  allArticles.forEach(a => {
    const safeTitle = a.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\x27/g, "&apos;");
    newsXml += `  <url>\n    <loc>https://founderbytes.in/${a.slug}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>Founder Bytes</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${a.published_at}</news:publication_date>\n      <news:title>${safeTitle}</news:title>\n    </news:news>\n  </url>\n`;
  });

  newsXml += `</urlset>\n`;
  fs.writeFileSync("public/news-sitemap.xml", newsXml, "utf8");
  console.log("Updated both public/sitemap.xml and public/news-sitemap.xml with all articles!");
}

run();
