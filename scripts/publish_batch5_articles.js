import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import batch5 from './articles_data_batch5.js';

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

if (!url || !key) {
  console.error('Missing Supabase credentials in environment.');
  process.exit(1);
}

const supabase = createClient(url, key);

const AUTHOR_ID = 'a925a3a4-abd9-4ebb-8966-b5fed4592371'; // Founder Bytes Team

const CATEGORIES = {
  startups: '1304fcf1-2f6c-4e28-ae33-82b05db082c5',
  business: '7a883a48-8317-4a46-816d-948ea37262ae',
  tech: '12ca2ddf-a03c-4ad5-ad25-b759076402f8',
  ai: '388fa40b-9196-40a0-aa06-d5af0088a950',
  founders: '485f6526-d2f8-458d-839d-794a5cf29665',
  funding: '700b85c5-7c84-42a4-8520-ffa52f3079bd',
  innovation: 'f8b966f2-d0e5-488a-b55d-44c6776e6f7d',
  latest: 'ebeed716-12b8-4801-88e3-b5bf10b2c8d7',
};

async function run() {
  console.log(`Loaded ${batch5.length} curated articles for Batch 5.`);

  console.log('=== SIGNING IN AS ADMIN ===');
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@founderbytes.in',
    password: 'Admin@founderbytes123'
  });

  if (authErr) {
    console.warn('Admin sign-in warning:', authErr.message);
  } else {
    console.log('Authenticated as admin:', authData.user.email);
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < batch5.length; i++) {
    const art = batch5[i];
    const catId = CATEGORIES[art.category_key] || CATEGORIES.business;

    // Verify image HTTP status
    try {
      const imgRes = await fetch(art.featured_image, { method: 'HEAD' });
      if (!imgRes.ok) {
        console.warn(`[WARNING] Image not returning 200 for ${art.slug}: ${imgRes.status}`);
      }
    } catch(e) {
      console.warn(`[WARNING] Image check error for ${art.slug}:`, e.message);
    }

    // Check if article already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('slug', art.slug)
      .maybeSingle();

    const articlePayload = {
      title: art.title,
      slug: art.slug,
      subtitle: art.subtitle,
      excerpt: art.subtitle,
      category_id: catId,
      author_id: AUTHOR_ID,
      featured_image_url: art.featured_image,
      featured_image_alt: art.featured_image_alt,
      featured_image_caption: art.image_caption,
      featured_image_credit: art.image_credit,
      status: 'published',
      is_featured: Boolean(art.is_featured),
      is_trending: Boolean(art.is_trending),
      published_at: art.published_at,
      reading_time: art.reading_time || 5,
      seo_title: art.seo_title,
      seo_description: art.seo_description,
      source_name: art.source_name,
      source_url: art.source_url,
      updated_at: art.published_at || new Date().toISOString()
    };

    if (existing?.id) {
      articlePayload.id = existing.id;
    }

    const { data: savedArt, error: saveErr } = await supabase
      .from('articles')
      .upsert(articlePayload, { onConflict: 'slug' })
      .select('id')
      .single();

    if (saveErr) {
      console.error(`[${i + 1}/${batch5.length}] Error saving article: ${art.slug}`, saveErr.message);
      failCount++;
      continue;
    }

    const articleId = savedArt.id;

    // Clear old blocks for this article
    await supabase.from('article_blocks').delete().eq('article_id', articleId);

    // Prepare metadata embed object
    const metaPayload = {
      focus_keyword: art.focus_keyword || '',
      secondary_keywords: art.secondary_keywords || [],
      canonical_url: `https://founderbytes.in/${art.slug}`,
      robots_meta: 'index, follow, max-image-preview:large',
      og_title: art.seo_title,
      og_description: art.seo_description,
      og_image: art.featured_image,
      twitter_title: art.seo_title,
      twitter_description: art.seo_description,
      twitter_image: art.featured_image,
      schema_type: 'NewsArticle',
      source_type: 'Original Reporting',
      location: 'India',
      article_type: 'News Wire'
    };

    // Insert block 0 (full article rich body) and block 1 (embed metadata)
    const blocksToInsert = [
      {
        article_id: articleId,
        block_type: 'paragraph',
        content: art.article_body,
        display_order: 0
      },
      {
        article_id: articleId,
        block_type: 'embed',
        embed_url: 'fb_metadata',
        content: JSON.stringify(metaPayload),
        display_order: 9999
      }
    ];

    const { error: blockErr } = await supabase.from('article_blocks').insert(blocksToInsert);
    if (blockErr) {
      console.warn(`[${i + 1}/${batch5.length}] Warning on blocks:`, blockErr.message);
    }

    successCount++;
    console.log(`[${i + 1}/${batch5.length}] Published: ${art.title.slice(0, 50)}...`);
  }

  console.log(`\n=== INSERTION COMPLETE: ${successCount} SUCCEEDED, ${failCount} FAILED ===`);

  // Query all published articles from Supabase to rebuild dynamic sitemaps
  console.log('\n=== REGENERATING DYNAMIC SITEMAPS ===');
  const { data: allPublished, error: fetchErr } = await supabase
    .from('articles')
    .select('title, slug, published_at, updated_at, status')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (fetchErr || !allPublished) {
    console.error('Failed to query published articles for sitemap:', fetchErr);
    return;
  }

  console.log(`Total live published articles in Supabase: ${allPublished.length}`);

  const staticRoutes = [
    { path: '', changefreq: 'hourly', priority: '1.0' },
    { path: 'magazine', changefreq: 'weekly', priority: '0.9' },
    { path: 'nominations', changefreq: 'weekly', priority: '0.9' },
    { path: 'news', changefreq: 'hourly', priority: '0.9' },
    { path: 'latest', changefreq: 'hourly', priority: '0.9' },
    { path: 'startups', changefreq: 'hourly', priority: '0.9' },
    { path: 'business', changefreq: 'hourly', priority: '0.9' },
    { path: 'tech', changefreq: 'hourly', priority: '0.9' },
    { path: 'ai', changefreq: 'hourly', priority: '0.9' },
    { path: 'founders', changefreq: 'hourly', priority: '0.9' },
    { path: 'funding', changefreq: 'hourly', priority: '0.9' },
    { path: 'innovation', changefreq: 'hourly', priority: '0.9' },
    { path: 'author/founder-bytes-team', changefreq: 'daily', priority: '0.8' },
    { path: 'about', changefreq: 'monthly', priority: '0.6' },
    { path: 'editorial-policy', changefreq: 'monthly', priority: '0.6' },
    { path: 'corrections-policy', changefreq: 'monthly', priority: '0.6' },
    { path: 'ethics-policy', changefreq: 'monthly', priority: '0.6' },
    { path: 'contact', changefreq: 'monthly', priority: '0.6' },
    { path: 'authors', changefreq: 'monthly', priority: '0.6' },
    { path: 'advertise', changefreq: 'monthly', priority: '0.6' },
    { path: 'privacy-policy', changefreq: 'monthly', priority: '0.4' },
    { path: 'terms', changefreq: 'monthly', priority: '0.4' },
    { path: 'cookie-policy', changefreq: 'monthly', priority: '0.4' }
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticRoutes.forEach(r => {
    const loc = r.path ? `https://founderbytes.in/${r.path}` : `https://founderbytes.in/`;
    sitemapXml += `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
  });

  allPublished.forEach(a => {
    const mod = a.updated_at || a.published_at || new Date().toISOString();
    sitemapXml += `  <url>\n    <loc>https://founderbytes.in/${a.slug}</loc>\n    <lastmod>${mod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  sitemapXml += `</urlset>\n`;
  fs.writeFileSync('public/sitemap.xml', sitemapXml, 'utf8');

  // Google News sitemap
  let newsXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  allPublished.forEach(a => {
    const safeTitle = (a.title || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    newsXml += `  <url>\n    <loc>https://founderbytes.in/${a.slug}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>Founder Bytes</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${a.published_at}</news:publication_date>\n      <news:title>${safeTitle}</news:title>\n    </news:news>\n  </url>\n`;
  });

  newsXml += `</urlset>\n`;
  fs.writeFileSync('public/news-sitemap.xml', newsXml, 'utf8');

  console.log('Updated public/sitemap.xml and public/news-sitemap.xml successfully!');
  console.log(`Total URLs in sitemap: ${staticRoutes.length + allPublished.length}`);
}

run().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
