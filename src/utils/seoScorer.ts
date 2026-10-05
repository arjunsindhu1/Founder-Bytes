import { extractPlainTextFromHtml, countWords, analyzeHeadings } from './articleBodyUtils';

export interface SEOCheckResult {
  id: string;
  label: string;
  status: 'good' | 'improvement' | 'problem';
  message: string;
  pointsEarned: number;
  maxPoints: number;
}

export interface SEOAnalysis {
  score: number; // 0 to 100
  rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';
  checks: SEOCheckResult[];
}

export interface SEOInputData {
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  articleBody: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  authorId?: string;
  categorySlug?: string;
}

export function calculateSEOScore(data: SEOInputData): SEOAnalysis {
  const checks: SEOCheckResult[] = [];
  const keyword = (data.focusKeyword || '').trim().toLowerCase();
  const title = (data.seoTitle || data.title || '').trim().toLowerCase();
  const metaDesc = (data.metaDescription || '').trim().toLowerCase();
  const plainText = extractPlainTextFromHtml(data.articleBody).toLowerCase();
  const words = countWords(data.articleBody);
  const { headings, hasH1InBody, hierarchyIssues } = analyzeHeadings(data.articleBody);

  // 1. Keyword in SEO Title (10 pts)
  if (!keyword) {
    checks.push({
      id: 'kw-title',
      label: 'Focus keyword in SEO title',
      status: 'problem',
      message: 'Set a focus keyword to evaluate keyword presence in your headline.',
      pointsEarned: 0,
      maxPoints: 10,
    });
  } else if (title.includes(keyword)) {
    checks.push({
      id: 'kw-title',
      label: 'Focus keyword in SEO title',
      status: 'good',
      message: `Focus keyword "${data.focusKeyword}" is present in the title.`,
      pointsEarned: 10,
      maxPoints: 10,
    });
  } else {
    checks.push({
      id: 'kw-title',
      label: 'Focus keyword in SEO title',
      status: 'problem',
      message: `Focus keyword "${data.focusKeyword}" was not found in the SEO title.`,
      pointsEarned: 0,
      maxPoints: 10,
    });
  }

  // 2. Keyword in Meta Description (10 pts)
  if (!keyword) {
    checks.push({
      id: 'kw-desc',
      label: 'Focus keyword in meta description',
      status: 'problem',
      message: 'Add a focus keyword to verify meta description optimization.',
      pointsEarned: 0,
      maxPoints: 10,
    });
  } else if (!metaDesc) {
    checks.push({
      id: 'kw-desc',
      label: 'Focus keyword in meta description',
      status: 'problem',
      message: 'Meta description is currently empty. Add 140–160 characters describing the story.',
      pointsEarned: 0,
      maxPoints: 10,
    });
  } else if (metaDesc.includes(keyword)) {
    checks.push({
      id: 'kw-desc',
      label: 'Focus keyword in meta description',
      status: 'good',
      message: 'Focus keyword appears naturally in the meta description.',
      pointsEarned: 10,
      maxPoints: 10,
    });
  } else {
    checks.push({
      id: 'kw-desc',
      label: 'Focus keyword in meta description',
      status: 'improvement',
      message: 'Meta description exists, but does not mention your focus keyword.',
      pointsEarned: 5,
      maxPoints: 10,
    });
  }

  // 3. Keyword in Introduction (first 120 words) (10 pts)
  const introWords = plainText.split(/\s+/).slice(0, 120).join(' ');
  if (!keyword) {
    checks.push({
      id: 'kw-intro',
      label: 'Keyword in introduction',
      status: 'problem',
      message: 'Define a focus keyword to check introductory placement.',
      pointsEarned: 0,
      maxPoints: 10,
    });
  } else if (introWords.includes(keyword)) {
    checks.push({
      id: 'kw-intro',
      label: 'Keyword in introduction',
      status: 'good',
      message: 'Focus keyword is established early in the opening paragraphs.',
      pointsEarned: 10,
      maxPoints: 10,
    });
  } else {
    checks.push({
      id: 'kw-intro',
      label: 'Keyword in introduction',
      status: 'improvement',
      message: 'Consider introducing your focus topic in the opening paragraph for reader context.',
      pointsEarned: 4,
      maxPoints: 10,
    });
  }

  // 4. Natural keyword usage (10 pts)
  if (!keyword) {
    checks.push({
      id: 'kw-density',
      label: 'Natural keyword coverage',
      status: 'problem',
      message: 'No focus keyword set.',
      pointsEarned: 0,
      maxPoints: 10,
    });
  } else {
    // Count occurrences
    const escapedKw = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = plainText.match(new RegExp(`\\b${escapedKw}\\b`, 'gi')) || [];
    const count = matches.length;
    const density = words > 0 ? (count / words) * 100 : 0;

    if (count === 0) {
      checks.push({
        id: 'kw-density',
        label: 'Natural keyword coverage',
        status: 'problem',
        message: 'The focus keyword does not appear in the body text.',
        pointsEarned: 2,
        maxPoints: 10,
      });
    } else if (density > 3.0) {
      checks.push({
        id: 'kw-density',
        label: 'Natural keyword coverage',
        status: 'improvement',
        message: `Keyword appears ${count} times (${density.toFixed(1)}%). Consider synonyms to avoid repetitive keyword stuffing.`,
        pointsEarned: 6,
        maxPoints: 10,
      });
    } else {
      checks.push({
        id: 'kw-density',
        label: 'Natural keyword coverage',
        status: 'good',
        message: `Keyword appears ${count} time(s) (${density.toFixed(1)}%), reflecting organic, topical relevance.`,
        pointsEarned: 10,
        maxPoints: 10,
      });
    }
  }

  // 5. Secondary Keyword Coverage (10 pts)
  const secondaryKws = data.secondaryKeywords || [];
  if (secondaryKws.length === 0) {
    checks.push({
      id: 'sec-kw',
      label: 'Secondary keywords coverage',
      status: 'improvement',
      message: 'Add 2–4 secondary keywords to strengthen semantic entity coverage.',
      pointsEarned: 4,
      maxPoints: 10,
    });
  } else {
    const foundSecondary = secondaryKws.filter((kw) => plainText.includes(kw.toLowerCase().trim()));
    if (foundSecondary.length === secondaryKws.length) {
      checks.push({
        id: 'sec-kw',
        label: 'Secondary keywords coverage',
        status: 'good',
        message: `All ${secondaryKws.length} secondary keyword(s) are woven into the text.`,
        pointsEarned: 10,
        maxPoints: 10,
      });
    } else if (foundSecondary.length > 0) {
      checks.push({
        id: 'sec-kw',
        label: 'Secondary keywords coverage',
        status: 'improvement',
        message: `${foundSecondary.length} of ${secondaryKws.length} secondary keywords found in article.`,
        pointsEarned: 7,
        maxPoints: 10,
      });
    } else {
      checks.push({
        id: 'sec-kw',
        label: 'Secondary keywords coverage',
        status: 'problem',
        message: 'None of the specified secondary keywords were found in the text.',
        pointsEarned: 2,
        maxPoints: 10,
      });
    }
  }

  // 6. Proper H2 / H3 Structure (10 pts)
  const h2Count = headings.filter((h) => h.level === 2).length;
  if (hasH1InBody) {
    checks.push({
      id: 'headings',
      label: 'Heading hierarchy',
      status: 'problem',
      message: 'Remove H1 tags from the body. The story title is already H1; use H2 and H3.',
      pointsEarned: 3,
      maxPoints: 10,
    });
  } else if (hierarchyIssues.length > 0) {
    checks.push({
      id: 'headings',
      label: 'Heading hierarchy',
      status: 'improvement',
      message: hierarchyIssues[0],
      pointsEarned: 6,
      maxPoints: 10,
    });
  } else if (words > 250 && h2Count === 0) {
    checks.push({
      id: 'headings',
      label: 'Heading hierarchy',
      status: 'improvement',
      message: 'Break longer content into readable sub-sections using H2 headings.',
      pointsEarned: 5,
      maxPoints: 10,
    });
  } else {
    checks.push({
      id: 'headings',
      label: 'Heading hierarchy',
      status: 'good',
      message: `Clean heading hierarchy detected with ${h2Count} H2 section(s).`,
      pointsEarned: 10,
      maxPoints: 10,
    });
  }

  // 7. Article Length (10 pts)
  if (words >= 450) {
    checks.push({
      id: 'length',
      label: 'Article length',
      status: 'good',
      message: `Thorough reporting (${words} words). Meets in-depth editorial standards.`,
      pointsEarned: 10,
      maxPoints: 10,
    });
  } else if (words >= 200) {
    checks.push({
      id: 'length',
      label: 'Article length',
      status: 'good',
      message: `Standard news wire length (${words} words). Good for concise market updates.`,
      pointsEarned: 8,
      maxPoints: 10,
    });
  } else if (words >= 80) {
    checks.push({
      id: 'length',
      label: 'Article length',
      status: 'improvement',
      message: `Short brief (${words} words). Consider adding background context or quote.`,
      pointsEarned: 5,
      maxPoints: 10,
    });
  } else {
    checks.push({
      id: 'length',
      label: 'Article length',
      status: 'problem',
      message: `Very short draft (${words} words). Add substantial editorial content.`,
      pointsEarned: 2,
      maxPoints: 10,
    });
  }

  // 8. Internal Links (10 pts)
  // Match href to founderbytes.in or /slug or relative urls
  const internalLinkRegex = /href=["'](https?:\/\/founderbytes\.in\/[^"']+|\/[^"']+)["']/gi;
  const internalMatches = data.articleBody.match(internalLinkRegex) || [];
  if (internalMatches.length >= 1) {
    checks.push({
      id: 'internal-links',
      label: 'Internal links',
      status: 'good',
      message: `${internalMatches.length} internal link(s) found, fostering topical clusters.`,
      pointsEarned: 10,
      maxPoints: 10,
    });
  } else {
    checks.push({
      id: 'internal-links',
      label: 'Internal links',
      status: 'improvement',
      message: 'Add an internal link to a related Founder Bytes story to boost topical authority.',
      pointsEarned: 3,
      maxPoints: 10,
    });
  }

  // 9. External Links (5 pts)
  const externalLinkRegex = /href=["']https?:\/\/(?!founderbytes\.in)[^"']+["']/gi;
  const externalMatches = data.articleBody.match(externalLinkRegex) || [];
  if (externalMatches.length >= 1) {
    checks.push({
      id: 'external-links',
      label: 'External source link',
      status: 'good',
      message: 'Authoritative external citation/filing link present.',
      pointsEarned: 5,
      maxPoints: 5,
    });
  } else {
    checks.push({
      id: 'external-links',
      label: 'External source link',
      status: 'improvement',
      message: 'Adding a link to the primary regulatory filing, exchange release, or source reinforces E-E-A-T.',
      pointsEarned: 2,
      maxPoints: 5,
    });
  }

  // 10. Featured Image & Alt Text (10 pts)
  const hasImage = Boolean(data.featuredImage && data.featuredImage.startsWith('http'));
  const hasAlt = Boolean(data.featuredImageAlt && data.featuredImageAlt.trim().length > 3);
  if (hasImage && hasAlt) {
    checks.push({
      id: 'featured-image',
      label: 'Featured image & alt text',
      status: 'good',
      message: 'Featured photograph and descriptive alt text are fully configured.',
      pointsEarned: 10,
      maxPoints: 10,
    });
  } else if (hasImage && !hasAlt) {
    checks.push({
      id: 'featured-image',
      label: 'Featured image & alt text',
      status: 'problem',
      message: 'Featured image is uploaded, but missing required Alt Text before publishing.',
      pointsEarned: 5,
      maxPoints: 10,
    });
  } else {
    checks.push({
      id: 'featured-image',
      label: 'Featured image & alt text',
      status: 'problem',
      message: 'Featured image is missing. Upload a 16:9 news image.',
      pointsEarned: 0,
      maxPoints: 10,
    });
  }

  // 11. Canonical URL & Category (5 pts)
  if (data.canonicalUrl && data.categorySlug) {
    checks.push({
      id: 'metadata-hygiene',
      label: 'Canonical URL & category mapping',
      status: 'good',
      message: 'Canonical URL and editorial category are assigned.',
      pointsEarned: 5,
      maxPoints: 5,
    });
  } else {
    checks.push({
      id: 'metadata-hygiene',
      label: 'Canonical URL & category mapping',
      status: 'improvement',
      message: 'Ensure canonical URL and category are set.',
      pointsEarned: 2,
      maxPoints: 5,
    });
  }

  // Compute final score
  const totalEarned = checks.reduce((sum, c) => sum + c.pointsEarned, 0);
  const totalMax = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const score = Math.round((totalEarned / totalMax) * 100);

  let rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor' = 'Needs Improvement';
  if (score >= 85) rating = 'Excellent';
  else if (score >= 70) rating = 'Good';
  else if (score >= 50) rating = 'Needs Improvement';
  else rating = 'Poor';

  return {
    score,
    rating,
    checks,
  };
}
