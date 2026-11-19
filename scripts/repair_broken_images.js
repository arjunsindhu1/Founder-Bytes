import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
let envFile = '';
try { envFile = fs.readFileSync('.env', 'utf8'); } catch(e) {}
let url = process.env.VITE_SUPABASE_URL;
let key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  envFile.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v) {
      if (k.trim() === 'VITE_SUPABASE_URL') url = v.join('=').trim();
      if (k.trim() === 'VITE_SUPABASE_ANON_KEY') key = v.join('=').trim();
    }
  });
}

const supabase = createClient(url, key);

const REPAIRS = [
  {
    id: 'd52dacce-41c9-42dd-9caf-e033973afef2',
    slug: 'business/waaree-energies-surges-66-percent-on-market-debut-after-4321-crore-ipo',
    title: 'Waaree Energies Surges 66% on Dalal Street Debut Following Massive 76x Subscription for ₹4,321 Crore Public Issue',
    featured_image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Industrial solar photovoltaic module arrays under bright sunlight',
    featured_image_caption: 'Waaree Energies commands over 12GW of solar module manufacturing capacity across India and global export markets.',
    featured_image_credit: 'Unsplash / Solar PV Industry'
  },
  {
    id: '53e6ce02-593c-4dfd-9b6b-0ad422ead5cb',
    slug: 'business/inox-clean-energy-files-10000-crore-ipo-sebi',
    title: 'Inox Clean Energy Files for India\'s Largest Renewable Energy IPO Seeking ₹10,000 Crore Valuation Boost',
    featured_image_url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Renewable energy wind turbine generators against blue sky',
    featured_image_caption: 'INOXGFL group arm plans an integrated 9.29 GW renewable power and wind-solar energy portfolio.',
    featured_image_credit: 'Unsplash / Clean Energy'
  },
  {
    id: '3e65bed3-52a8-4dae-997e-8b399477f3c3',
    slug: 'business/afcons-infrastructure-launches-5430-crore-ipo-from-shapoorji-pallonji-group',
    title: 'Shapoorji Pallonji Flagship Afcons Infrastructure Opens ₹5,430 Crore IPO with Marquee Anchor Book',
    featured_image_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Large-scale suspension bridge and marine civil engineering project',
    featured_image_caption: 'Afcons Infrastructure executes landmark marine engineering, tunnel, and highway projects across Asia and the Middle East.',
    featured_image_credit: 'Unsplash / Civil Infrastructure'
  },
  {
    id: '3fb7f72c-8c37-4601-8350-fc97e8f4a115',
    slug: 'startups/razorpay-completes-singapore-to-india-cross-border-merger',
    title: 'Fintech Unicorn Razorpay Secures Regulatory Clearance to Relocate Global Parent Entity to Bengaluru',
    featured_image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Digital payments and mobile fintech transactions infrastructure',
    featured_image_caption: 'Razorpay powers over 10 million Indian businesses with full-stack digital payments, payroll, and banking rails.',
    featured_image_credit: 'Unsplash / Fintech Payments'
  },
  {
    id: '557c101a-284b-47be-a53a-c7126de53518',
    slug: 'ai/spacex-40-billion-financing-nvidia-ai-chips',
    title: 'SpaceX Reportedly Seeks $40 Billion Financing to Buy Nvidia AI Chips',
    featured_image_url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Orbital space rocket launch with high-power booster engines',
    featured_image_caption: 'SpaceX is seeking multi-billion-dollar financing to deploy AI compute clusters for orbital and satellite networks.',
    featured_image_credit: 'Unsplash / Aerospace Technology'
  },
  {
    id: 'a926971e-72dc-4c27-9832-700e811085fd',
    slug: 'startups/refit-global-raises-1-million-refurbished-electronics',
    title: 'ReFit Global Raises $1 Million to Scale Refurbished Electronics Across India',
    featured_image_url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Electronics technician diagnosing mobile phone hardware on workbench',
    featured_image_caption: 'ReFit Global operates a certified diagnostic testing and retail grid for renewed mobile devices across India.',
    featured_image_credit: 'Unsplash / Electronics Repair'
  },
  {
    id: '055d4f20-6128-4311-b574-3f3a72f062f5',
    slug: 'business/india-10000-crore-sme-growth-fund',
    title: 'India Approves ₹10,000 Crore SME Growth Fund to Back the Next Generation of Businesses',
    featured_image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Advanced manufacturing facility and industrial engineering robotics',
    featured_image_caption: 'The Union Cabinet\'s ₹10,000 crore fund injects long-term growth equity into high-potential MSMEs and manufacturers.',
    featured_image_credit: 'Unsplash / Smart Manufacturing'
  },
  {
    id: '7ffa3b0e-f0c1-462f-8a10-3012c4fa6a13',
    slug: 'innovation/yohan-michelle-poonawalla-invest-in-optimized-solutions-defense',
    title: 'Yohan and Michelle Poonawalla Enter Defense & Aerospace with Strategic Stake in Optimized Solutions Ltd',
    featured_image_url: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Satellite dish telemetry and defense aerospace communication systems',
    featured_image_caption: 'Optimized Solutions supplies mission-critical telemetry, optics, and radar sub-systems to ISRO and DRDO.',
    featured_image_credit: 'Unsplash / Defense Telemetry'
  },
  {
    id: '80576c19-4f86-4be5-aa04-1a78d84da3d2',
    slug: 'innovation/karnataka-government-first-scheme-25-crore-100-startups',
    title: 'Karnataka Govt Launches ₹25 Crore \'Government First\' Scheme to Deploy 100 Startups Across State Departments',
    featured_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Grand Indian civic administrative building architecture',
    featured_image_caption: 'Karnataka\'s ELEVATE policy bridges government procurement with innovative tech startups across municipal and state departments.',
    featured_image_credit: 'Unsplash / Civic Architecture'
  },
  {
    id: '28dcb742-3f9a-4a79-bcba-66786935a4b5',
    slug: 'tech/adani-family-office-backs-nudge-ai-consumer-intelligence',
    title: 'Adani Family Office Backs AI-Native Consumer Intelligence Platform Nudge Across Consecutive Rounds',
    featured_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'AI analytics dashboard displaying real-time predictive charts and metrics',
    featured_image_caption: 'Nudge converts granular retail receipt scans into item-level predictive insights for consumer packaged goods brands.',
    featured_image_credit: 'Unsplash / Data Analytics'
  },
  {
    id: 'cf192c80-ee51-4cc1-b86b-44ed067e0fe9',
    slug: 'innovation/balwaan-krishi-secures-100-crore-series-b',
    title: 'Balwaan Krishi Secures ₹100 Crore Series B to Modernize Smallholder Farm Mechanization',
    featured_image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    featured_image_alt: 'Modern agricultural mechanization and farm implements across agricultural farmland',
    featured_image_caption: 'Balwaan Krishi manufactures lightweight power weeders, sprayers, and IoT farm equipment tailored for smallholder farmers.',
    featured_image_credit: 'Unsplash / Agri Mechanization'
  }
];

async function run() {
  console.log('=== SIGNING IN AS ADMIN ===');
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@founderbytes.in',
    password: 'Admin@founderbytes123'
  });
  if (authErr) console.warn('Auth notice:', authErr.message);

  console.log(`Starting repair of ${REPAIRS.length} broken article images...`);

  for (const item of REPAIRS) {
    // 1. Verify URL is live
    const res = await fetch(item.featured_image_url, { method: 'HEAD' });
    if (!res.ok) {
      console.error(`URL failed verification (${res.status}): ${item.featured_image_url}`);
      continue;
    }

    // 2. Update articles table
    const { error: updateErr } = await supabase
      .from('articles')
      .update({
        featured_image_url: item.featured_image_url,
        featured_image_alt: item.featured_image_alt,
        featured_image_caption: item.featured_image_caption,
        featured_image_credit: item.featured_image_credit,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.id);

    if (updateErr) {
      console.error(`Failed to update article ${item.slug}:`, updateErr.message);
      continue;
    }

    // 3. Update metadata block in article_blocks if present
    const { data: metaBlocks } = await supabase
      .from('article_blocks')
      .select('id, content')
      .eq('article_id', item.id)
      .eq('block_type', 'embed')
      .eq('embed_url', 'fb_metadata');

    if (metaBlocks && metaBlocks.length > 0) {
      for (const mb of metaBlocks) {
        try {
          const parsed = JSON.parse(mb.content);
          parsed.og_image = item.featured_image_url;
          parsed.twitter_image = item.featured_image_url;
          await supabase
            .from('article_blocks')
            .update({ content: JSON.stringify(parsed) })
            .eq('id', mb.id);
        } catch(e) {}
      }
    }

    console.log(`[SUCCESS] Repaired image for "${item.title.slice(0, 40)}..."`);
  }

  console.log('\n=== RE-CHECKING ALL 144 ARTICLES IMAGE HEALTH ===');
  const { data: allArticles } = await supabase
    .from('articles')
    .select('id, title, slug, featured_image_url')
    .eq('status', 'published');

  let brokenCount = 0;
  for (const a of allArticles) {
    if (!a.featured_image_url) {
      brokenCount++;
      console.log('Broken (empty):', a.slug);
      continue;
    }
    if (a.featured_image_url.startsWith('/')) {
      const p = 'public' + a.featured_image_url;
      if (!fs.existsSync(p)) {
        brokenCount++;
        console.log('Broken (local file missing):', a.slug, a.featured_image_url);
      }
      continue;
    }
    try {
      const testRes = await fetch(a.featured_image_url, { method: 'HEAD' });
      if (!testRes.ok) {
        const getRes = await fetch(a.featured_image_url, { method: 'GET', headers: { 'Range': 'bytes=0-10' } });
        if (!getRes.ok) {
          brokenCount++;
          console.log('Broken (HTTP ' + getRes.status + '):', a.slug, a.featured_image_url);
        }
      }
    } catch(err) {
      brokenCount++;
      console.log('Broken (network error):', a.slug, err.message);
    }
  }

  console.log(`\nFinal Audit: ${allArticles.length - brokenCount} / ${allArticles.length} articles have 100% verified live images. (${brokenCount} broken)`);
}

run().catch(console.error);
