import React, { useState, useEffect } from 'react';
import { 
  CMSArticle, 
  CMSSection, 
  CMSBreakingNews, 
  CMSAdvertisement, 
  CMSMagazineIssue, 
  CMSAuthor, 
  CMSCategory, 
  CMSSiteSettings,
  ArticleBlock,
  BlockType,
  RealtimeStatus
} from '../../types/cms';
import { ContentService } from '../../services/contentService';
import { isSupabaseConfigured, updateSupabaseCredentials } from '../../lib/supabase';
import { FounderBytesLogo } from '../FounderBytesLogo';
import { ArticlePage } from '../ArticlePage';
import { MediaUploader } from './MediaUploader';
import { FullArticleBodyEditor } from './FullArticleBodyEditor';
import { ArticleSEOSection } from './ArticleSEOSection';
import { ArticleEntitiesSection } from './ArticleEntitiesSection';
import { convertBlocksToArticleBody, extractPlainTextFromHtml } from '../../utils/articleBodyUtils';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Zap, 
  BookOpen, 
  Megaphone, 
  Users, 
  FolderTree, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Eye, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Upload, 
  Clock, 
  Flame, 
  Star,
  Copy,
  ArrowLeft,
  Lock,
  KeyRound,
  Radio,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onViewPublicArticle?: (slug: string) => void;
}

// Navigation structure matching Requirement 23
type AdminTab = 
  | 'overview' 
  | 'articles' 
  | 'article-editor' 
  | 'homepage-builder' 
  | 'breaking-news' 
  | 'magazine' 
  | 'ads' 
  | 'media'
  | 'authors' 
  | 'categories' 
  | 'settings';

// Page-specific ad placements map (Requirement 13 & 14)
const PAGE_PLACEMENTS_MAP: Record<string, { id: string; label: string; width: number; height: number; ratio: string }[]> = {
  all: [
    { id: 'top', label: 'Top Header Banner (Global)', width: 728, height: 90, ratio: '728:90' },
    { id: 'footer', label: 'Footer Banner (Global)', width: 728, height: 90, ratio: '728:90' },
  ],
  news: [
    { id: 'news-primary', label: 'News Feed Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  startups: [
    { id: 'startups-primary', label: 'Startups Section Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  business: [
    { id: 'business-primary', label: 'Business Section Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  technology: [
    { id: 'tech-primary', label: 'Technology Section Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  ai: [
    { id: 'ai-primary', label: 'AI & DeepTech Section Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  founders: [
    { id: 'founders-primary', label: 'Founders Section Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  funding: [
    { id: 'funding-primary', label: 'Venture & Funding Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  markets: [
    { id: 'markets-primary', label: 'Markets Section Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  innovation: [
    { id: 'innovation-primary', label: 'Innovation Section Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  magazine: [
    { id: 'magazine-primary', label: 'The Founder Magazine Primary Ad Banner', width: 728, height: 90, ratio: '728:90' },
  ],
  article: [
    { id: 'article-middle', label: 'Article In-Body Ad Placement', width: 728, height: 90, ratio: '728:90' },
  ],
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onViewPublicArticle,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [breakingNews, setBreakingNews] = useState<CMSBreakingNews[]>([]);
  const [ads, setAds] = useState<CMSAdvertisement[]>([]);
  const [magazineIssues, setMagazineIssues] = useState<CMSMagazineIssue[]>([]);
  const [authors, setAuthors] = useState<CMSAuthor[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [settings, setSettings] = useState<CMSSiteSettings | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>('LOCAL');

  // Search & filter states
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Currently editing article
  const [editingArticle, setEditingArticle] = useState<CMSArticle | null>(null);
  const [previewArticle, setPreviewArticle] = useState<CMSArticle | null>(null);

  // New section modal state
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionSlug, setNewSectionSlug] = useState('');
  const [newSectionLayout, setNewSectionLayout] = useState<any>('startup-split');
  const [newSectionCategory, setNewSectionCategory] = useState('startups');

  // New ad modal state
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [editingAd, setEditingAd] = useState<CMSAdvertisement | null>(null);
  const [newAdName, setNewAdName] = useState('');
  const [newAdAdvertiser, setNewAdAdvertiser] = useState('');
  const [newAdImage, setNewAdImage] = useState('');
  const [newAdUrl, setNewAdUrl] = useState('');
  const [newAdPage, setNewAdPage] = useState<string>('news');
  const [newAdPlacement, setNewAdPlacement] = useState<string>('news-primary');
  const [newAdStartDate, setNewAdStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [newAdEndDate, setNewAdEndDate] = useState('');
  const [newAdActive, setNewAdActive] = useState(true);

  // New magazine issue modal state
  const [showAddMagazineModal, setShowAddMagazineModal] = useState(false);
  const [newIssueNumber, setNewIssueNumber] = useState('Issue 02');
  const [newIssueSeason, setNewIssueSeason] = useState('Winter 2026');
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDek, setNewIssueDek] = useState('');
  const [newIssueCoverImage, setNewIssueCoverImage] = useState('');
  const [newIssuePdfLink, setNewIssuePdfLink] = useState('');
  const [newIssueTheme, setNewIssueTheme] = useState('Industrial Scale & Technical Moats');
  const [newIssuePublished, setNewIssuePublished] = useState(true);

  // New breaking news state
  const [newBreakingHeadline, setNewBreakingHeadline] = useState('');
  const [newBreakingLink, setNewBreakingLink] = useState('');

  // Category management modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CMSCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  // Status feedback toast
  const [notification, setNotification] = useState<string | null>(null);

  // Admin password management state
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [revealActivePassword, setRevealActivePassword] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Load all content on mount and subscribe to changes
  const loadAllData = async () => {
    const [arts, secs, bn, advertisements, issues, auths, cats, siteSet] = await Promise.all([
      ContentService.getArticles(),
      ContentService.getSections(),
      ContentService.getBreakingNews(),
      ContentService.getAdvertisements(),
      ContentService.getMagazineIssues(),
      ContentService.getAuthors(),
      ContentService.getCategories(),
      ContentService.getSettings(),
    ]);

    setArticles(arts);
    setSections(secs);
    setBreakingNews(bn);
    setAds(advertisements);
    setMagazineIssues(issues);
    setAuthors(auths);
    setCategories(cats);
    setSettings(siteSet);
  };

  useEffect(() => {
    loadAllData();
    const unsubscribeContent = ContentService.subscribe(() => {
      loadAllData();
    });
    const unsubscribeStatus = ContentService.subscribeStatus((status) => {
      setRealtimeStatus(status);
    });
    return () => {
      unsubscribeContent();
      unsubscribeStatus();
    };
  }, []);

  // Quick stats
  const totalArticlesCount = articles.length;
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftsCount = articles.filter((a) => a.status === 'draft').length;
  const scheduledCount = articles.filter((a) => a.status === 'scheduled').length;
  const trendingCount = articles.filter((a) => a.is_trending).length;
  const activeAdsCount = ads.filter((a) => a.is_active).length;

  // Article filter logic
  const filteredArticles = articles.filter((a) => {
    const matchesSearch = 
      !articleSearchQuery ||
      a.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(articleSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || a.category_slug === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Start new article with Arjun Sindhu as default author
  const handleStartNewArticle = () => {
    const newArt: CMSArticle = {
      id: `art-${Date.now()}`,
      slug: `news/story-${Date.now().toString().slice(-6)}`,
      title: '',
      subtitle: '',
      category_id: categories[0]?.id || 'cat-startups',
      category_name: categories[0]?.name || 'Startups',
      category_slug: categories[0]?.slug || 'startups',
      author_id: 'author-arjun-sindhu',
      author_name: 'Arjun Sindhu',
      author_role: 'Founder & Editor-in-Chief',
      author_avatar: authors[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      featured_image: '',
      featured_image_alt: '',
      featured_image_source_url: '',
      image_caption: '',
      image_credit: 'Founder Bytes',
      article_body: '',
      content_blocks: [],
      raw_paragraphs: [''],
      status: 'draft',
      published_at: new Date().toISOString(),
      reading_time_minutes: 3,
      tags: [],
      is_featured: false,
      is_trending: false,
      is_breaking: false,
      is_editor_pick: false,
      priority: 0,
      seo_title: '',
      seo_description: '',
      focus_keyword: '',
      secondary_keywords: [],
      canonical_url: '',
      robots_meta: 'index, follow',
      schema_type: 'NewsArticle',
      entities: {
        people: [],
        companies: [],
        organizations: [],
        places: [],
        products_or_books: [],
        topics: [],
      },
    };
    setEditingArticle(newArt);
    setActiveTab('article-editor');
  };

  // Edit existing article
  const handleEditArticle = (art: CMSArticle) => {
    const cloned: CMSArticle = JSON.parse(JSON.stringify(art));
    // Safely migrate existing blocks or raw paragraphs into unified article_body
    if (!cloned.article_body && cloned.content_blocks && cloned.content_blocks.length > 0) {
      cloned.article_body = convertBlocksToArticleBody(cloned.content_blocks);
    }
    if (!cloned.article_body && cloned.raw_paragraphs && cloned.raw_paragraphs.length > 0) {
      cloned.article_body = cloned.raw_paragraphs.map((p) => `<p>${p}</p>`).join('\n');
    }
    setEditingArticle(cloned);
    setActiveTab('article-editor');
  };

  // Save article
  const handleSaveArticle = async (statusOverride?: 'draft' | 'published') => {
    if (!editingArticle) return;
    if (!editingArticle.title.trim()) {
      showToast('Error: Headline title is required.');
      return;
    }

    const targetStatus = statusOverride || editingArticle.status;

    // Requirement 5: Featured Image Alt Text MUST be required before publishing
    if (targetStatus === 'published' && editingArticle.featured_image && !editingArticle.featured_image_alt?.trim()) {
      showToast('Error: Featured Image Alt Text is strictly required before publishing story.');
      return;
    }

    try {
      const bodyHtml = editingArticle.article_body || convertBlocksToArticleBody(editingArticle.content_blocks) || `<p>${editingArticle.subtitle || editingArticle.title}</p>`;
      const plainText = extractPlainTextFromHtml(bodyHtml);
      const paragraphs = plainText ? plainText.split(/\n+/).filter(Boolean) : [editingArticle.subtitle || editingArticle.title];

      const artToSave: CMSArticle = {
        ...editingArticle,
        article_body: bodyHtml,
        status: targetStatus,
        author_id: editingArticle.author_id || 'author-arjun-sindhu',
        author_name: editingArticle.author_name || 'Arjun Sindhu',
        author_role: editingArticle.author_role || 'Founder & Editor-in-Chief',
        raw_paragraphs: paragraphs,
        updated_at: new Date().toISOString(),
      };

      await ContentService.saveArticle(artToSave);
      setEditingArticle(artToSave);
      showToast(targetStatus === 'published' ? 'Story published live successfully.' : 'Draft saved successfully.');
      loadAllData();
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not save article.'}`);
    }
  };

  // Delete article
  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Delete this news story permanently from the database?')) return;
    try {
      await ContentService.deleteArticle(id);
      showToast('Deleted successfully.');
      loadAllData();
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not delete.'}`);
    }
  };

  // Toggle article status (Publish / Unpublish immediately) - Requirement 33
  const handleToggleArticleStatus = async (art: CMSArticle) => {
    const nextStatus = art.status === 'published' ? 'draft' : 'published';
    const updated: CMSArticle = {
      ...art,
      status: nextStatus,
      published_at: nextStatus === 'published' ? new Date().toISOString() : art.published_at,
    };
    try {
      await ContentService.saveArticle(updated);
      showToast(nextStatus === 'published' ? 'Article published live.' : 'Article moved to draft (unpublished).');
      loadAllData();
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not update status.'}`);
    }
  };

  // Reorder homepage section
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const orderedIds = newSections.map((s) => s.id);
    await ContentService.reorderSections(orderedIds);
    setSections(newSections);
    showToast('Updated successfully.');
  };

  // Toggle section visibility
  const handleToggleSectionVisible = async (sec: CMSSection) => {
    const updated = { ...sec, is_visible: !sec.is_visible };
    await ContentService.saveSection(updated);
    showToast('Updated successfully.');
    loadAllData();
  };

  // Delete homepage section
  const handleDeleteSection = async (id: string) => {
    if (!window.confirm('Remove this section from the homepage?')) return;
    await ContentService.deleteSection(id);
    showToast('Deleted successfully.');
    loadAllData();
  };

  // Create homepage section
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName) return;

    const newSec: CMSSection = {
      id: `sec-${Date.now()}`,
      name: newSectionName,
      slug: newSectionSlug || newSectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      section_type: 'category',
      category_slug: newSectionCategory,
      display_order: sections.length + 1,
      is_visible: true,
      story_count: 4,
      layout_type: newSectionLayout,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await ContentService.saveSection(newSec);
    setShowAddSectionModal(false);
    setNewSectionName('');
    setNewSectionSlug('');
    showToast('Created successfully.');
    loadAllData();
  };

  // Breaking news management
  const handleAddBreakingNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBreakingHeadline.trim()) return;

    const newItem: CMSBreakingNews = {
      id: `bn-${Date.now()}`,
      headline: newBreakingHeadline.trim(),
      link: newBreakingLink.trim() || 'news/latest',
      is_active: true,
      priority: breakingNews.length + 1,
      display_order: breakingNews.length + 1,
      created_at: new Date().toISOString(),
    };

    await ContentService.saveBreakingNews(newItem);
    setNewBreakingHeadline('');
    setNewBreakingLink('');
    showToast('Published successfully.');
    loadAllData();
  };

  const handleToggleBreakingActive = async (item: CMSBreakingNews) => {
    const updated = { ...item, is_active: !item.is_active };
    await ContentService.saveBreakingNews(updated);
    showToast('Updated successfully.');
    loadAllData();
  };

  const handleDeleteBreaking = async (id: string) => {
    await ContentService.deleteBreakingNews(id);
    showToast('Deleted successfully.');
    loadAllData();
  };

  // Open Ad Modal for Create / Edit
  const handleOpenAdModal = (adToEdit?: CMSAdvertisement) => {
    if (adToEdit) {
      setEditingAd(adToEdit);
      setNewAdName(adToEdit.name);
      setNewAdAdvertiser(adToEdit.advertiser);
      setNewAdImage(adToEdit.image_url);
      setNewAdUrl(adToEdit.destination_url);
      setNewAdPage(adToEdit.page || 'news');
      setNewAdPlacement(adToEdit.placement);
      setNewAdStartDate(adToEdit.start_date ? adToEdit.start_date.slice(0, 10) : new Date().toISOString().slice(0, 10));
      setNewAdEndDate(adToEdit.end_date ? adToEdit.end_date.slice(0, 10) : '');
      setNewAdActive(adToEdit.is_active);
    } else {
      setEditingAd(null);
      setNewAdName('');
      setNewAdAdvertiser('');
      setNewAdImage('');
      setNewAdUrl('');
      setNewAdPage('news');
      setNewAdPlacement('news-primary');
      setNewAdStartDate(new Date().toISOString().slice(0, 10));
      setNewAdEndDate('');
      setNewAdActive(true);
    }
    setShowAddAdModal(true);
  };

  // Ad Save / Update
  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdName || !newAdAdvertiser) {
      showToast('Error: Name and advertiser are required.');
      return;
    }

    const adToSave: CMSAdvertisement = {
      id: editingAd ? editingAd.id : `ad-${Date.now()}`,
      name: newAdName.trim(),
      advertiser: newAdAdvertiser.trim(),
      image_url: newAdImage || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      destination_url: newAdUrl.trim() || 'https://founderbytes.in/advertise',
      page: newAdPage,
      placement: newAdPlacement,
      ad_type: 'banner',
      start_date: newAdStartDate ? new Date(newAdStartDate).toISOString() : new Date().toISOString(),
      end_date: newAdEndDate ? new Date(newAdEndDate).toISOString() : undefined,
      is_active: newAdActive,
    };

    await ContentService.saveAdvertisement(adToSave);
    setShowAddAdModal(false);
    showToast(editingAd ? 'Updated successfully.' : 'Published successfully.');
    loadAllData();
  };

  const handleToggleAdActive = async (ad: CMSAdvertisement) => {
    const updated = { ...ad, is_active: !ad.is_active };
    await ContentService.saveAdvertisement(updated);
    showToast('Updated successfully.');
    loadAllData();
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm('Delete this advertisement campaign?')) return;
    await ContentService.deleteAdvertisement(id);
    showToast('Deleted successfully.');
    loadAllData();
  };

  // Magazine Issue Save
  const handleSaveMagazineIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle) {
      showToast('Error: Issue title is required.');
      return;
    }

    const newIssue: CMSMagazineIssue = {
      id: `issue-${Date.now()}`,
      issue_number: newIssueNumber,
      season: newIssueSeason,
      title: newIssueTitle,
      dek: newIssueDek || "India's Business & Startup Magazine Quarterly Dossier",
      cover_image: newIssueCoverImage || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
      published_date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      theme: newIssueTheme,
      is_featured: true,
      is_published: newIssuePublished,
      pdf_link: newIssuePdfLink || undefined,
      featured_founders: [],
      table_of_contents: [
        { section: 'Cover Story', title: newIssueTitle, author: 'Arjun Sindhu', page: '04' }
      ]
    };

    await ContentService.saveMagazineIssue(newIssue);
    setShowAddMagazineModal(false);
    showToast('Published successfully.');
    loadAllData();
  };

  const handleToggleMagazinePublished = async (issue: CMSMagazineIssue) => {
    const updated = { ...issue, is_published: !issue.is_published };
    await ContentService.saveMagazineIssue(updated);
    showToast('Updated successfully.');
    loadAllData();
  };

  const handleDeleteMagazineIssue = async (id: string) => {
    if (!window.confirm('Delete this magazine issue?')) return;
    await ContentService.deleteMagazineIssue(id);
    showToast('Deleted successfully.');
    loadAllData();
  };

  // Category Handlers (Requirement 28)
  const handleOpenCategoryModal = (catToEdit?: CMSCategory) => {
    if (catToEdit) {
      setEditingCategory(catToEdit);
      setNewCategoryName(catToEdit.name);
      setNewCategorySlug(catToEdit.slug);
      setNewCategoryDescription(catToEdit.description || '');
    } else {
      setEditingCategory(null);
      setNewCategoryName('');
      setNewCategorySlug('');
      setNewCategoryDescription('');
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast('Category name is required.');
      return;
    }
    const slug = newCategorySlug.trim() || newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categoryToSave: CMSCategory = {
      id: editingCategory ? editingCategory.id : `cat-${slug}`,
      name: newCategoryName.trim(),
      slug,
      description: newCategoryDescription.trim(),
      display_order: editingCategory ? editingCategory.display_order : categories.length + 1,
      is_visible: true,
    };
    await ContentService.saveCategory(categoryToSave);
    setShowCategoryModal(false);
    showToast(editingCategory ? 'Category updated.' : 'Category created.');
    loadAllData();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    await ContentService.deleteCategory(id);
    showToast(`Category "${name}" deleted.`);
    loadAllData();
  };

  // Current page placements available
  const availablePlacements = PAGE_PLACEMENTS_MAP[newAdPage] || PAGE_PLACEMENTS_MAP.all;

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-neutral-900 flex flex-col font-sans">
      {/* Toast Feedback Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#111111] text-white px-4 py-2.5 font-mono text-xs border border-[#F5B800] shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5B800]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Top Utility Bar */}
      <header className="bg-[#111111] text-white border-b border-neutral-800 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-4">
          <FounderBytesLogo size="sm" variant="dark" />
          <div className="h-4 w-px bg-neutral-700 hidden sm:block"></div>
          <span className="hidden sm:inline font-bold text-neutral-300">NEWSROOM EDITORIAL CONSOLE</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Realtime Status Indicator (Requirement 29) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-[11px] rounded-xs font-bold">
            <Radio className={`w-3.5 h-3.5 ${
              realtimeStatus === 'LIVE' 
                ? 'text-emerald-400 animate-pulse' 
                : realtimeStatus === 'RECONNECTING' 
                ? 'text-amber-400 animate-spin' 
                : 'text-neutral-400'
            }`} />
            <span className={realtimeStatus === 'LIVE' ? 'text-emerald-300 font-black tracking-wider' : 'text-neutral-300'}>
              {realtimeStatus === 'LIVE' 
                ? 'LIVE SYNC ACTIVE · CONNECTED TO SUPABASE' 
                : realtimeStatus === 'RECONNECTING' 
                ? 'RECONNECTING TO SUPABASE...' 
                : 'LIVE SYNC (READY) · LOCAL BUS ACTIVE'}
            </span>
          </div>

          <button
            onClick={onExitAdmin}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1 rounded-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#F5B800]" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar Navigation Matching Requirement 23 */}
        <nav className="w-full md:w-60 bg-white border border-neutral-300 p-3 shadow-2xs shrink-0 font-mono text-xs space-y-4">
          {/* Main Dashboard item */}
          <div>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2 flex items-center gap-2 font-bold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-black text-white'
                  : 'text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#F5B800]" />
              <span>DASHBOARD</span>
            </button>
          </div>

          {/* CONTENT GROUP */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 pb-1">
              CONTENT
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setActiveTab('articles');
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'articles' && statusFilter === 'all'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>All News</span>
                <span className="ml-auto text-[10px] text-neutral-400">{articles.length}</span>
              </button>

              <button
                onClick={handleStartNewArticle}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-neutral-700 hover:bg-neutral-100 cursor-pointer font-bold text-[#DF9E00]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add News</span>
              </button>

              <button
                onClick={() => {
                  setStatusFilter('draft');
                  setActiveTab('articles');
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'articles' && statusFilter === 'draft'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>· Drafts</span>
                <span className="ml-auto text-[10px] text-neutral-400">{draftsCount}</span>
              </button>

              <button
                onClick={() => {
                  setStatusFilter('scheduled');
                  setActiveTab('articles');
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'articles' && statusFilter === 'scheduled'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>· Scheduled</span>
                <span className="ml-auto text-[10px] text-neutral-400">{scheduledCount}</span>
              </button>

              <button
                onClick={() => {
                  setStatusFilter('published');
                  setActiveTab('articles');
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'articles' && statusFilter === 'published'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>· Published</span>
                <span className="ml-auto text-[10px] text-neutral-400">{publishedCount}</span>
              </button>
            </div>
          </div>

          {/* HOMEPAGE GROUP */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 pb-1">
              HOMEPAGE
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('homepage-builder')}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'homepage-builder'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#F5B800]" />
                <span>Homepage Builder</span>
              </button>

              <button
                onClick={() => setActiveTab('breaking-news')}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'breaking-news'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-red-500" />
                <span>Breaking News</span>
              </button>

              <button
                onClick={() => {
                  setStatusFilter('all');
                  setActiveTab('articles');
                }}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Featured & Trending</span>
              </button>
            </div>
          </div>

          {/* MAGAZINE GROUP */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 pb-1">
              MAGAZINE
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('magazine')}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'magazine'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#F5B800]" />
                <span>Issues & Digital</span>
                <span className="ml-auto text-[10px] text-neutral-400">{magazineIssues.length}</span>
              </button>

              <button
                onClick={() => setShowAddMagazineModal(true)}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-neutral-700 hover:bg-neutral-100 cursor-pointer text-[#DF9E00]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Issue</span>
              </button>
            </div>
          </div>

          {/* ADVERTISEMENT GROUP */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 pb-1">
              ADVERTISEMENT
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('ads')}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'ads'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5 text-[#F5B800]" />
                <span>Ads & Campaigns</span>
                <span className="ml-auto text-[10px] text-neutral-400">{ads.length}</span>
              </button>

              <button
                onClick={() => handleOpenAdModal()}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-neutral-700 hover:bg-neutral-100 cursor-pointer text-[#DF9E00]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Advertisement</span>
              </button>
            </div>
          </div>

          {/* AUTHORS, CATEGORIES & SETTINGS */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 pb-1">
              ORGANIZATION
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('authors')}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'authors'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-neutral-500" />
                <span>Authors</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5 text-neutral-500" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-neutral-500" />
                <span>Site Settings</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Content Workspace Area */}
        <main className="flex-1 bg-white border border-neutral-300 p-6 shadow-2xs min-w-0">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase text-neutral-900">
                    Newsroom Overview
                  </h1>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Live operational metrics and rapid publishing controls
                  </p>
                </div>
                <button
                  onClick={handleStartNewArticle}
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F5B800]" />
                  <span>Add News</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <div className="text-[10px] text-neutral-500 uppercase">Total Articles</div>
                  <div className="text-2xl font-black text-neutral-900 mt-1">{totalArticlesCount}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{publishedCount} Published</div>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <div className="text-[10px] text-neutral-500 uppercase">Drafts & Scheduled</div>
                  <div className="text-2xl font-black text-neutral-900 mt-1">{draftsCount + scheduledCount}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{draftsCount} Drafts</div>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <div className="text-[10px] text-neutral-500 uppercase">Trending on Site</div>
                  <div className="text-2xl font-black text-[#DF9E00] mt-1">{trendingCount}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Active in wire</div>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <div className="text-[10px] text-neutral-500 uppercase">Homepage Sections</div>
                  <div className="text-2xl font-black text-neutral-900 mt-1">{sections.length}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{sections.filter((s) => s.is_visible).length} Visible</div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono">
                <button
                  onClick={handleStartNewArticle}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold border border-neutral-300 cursor-pointer"
                >
                  + Add News Article
                </button>
                <button
                  onClick={() => setShowAddSectionModal(true)}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold border border-neutral-300 cursor-pointer"
                >
                  + Add Homepage Section
                </button>
                <button
                  onClick={() => setActiveTab('breaking-news')}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold border border-neutral-300 cursor-pointer"
                >
                  + Add Breaking Alert
                </button>
                <button
                  onClick={() => handleOpenAdModal()}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold border border-neutral-300 cursor-pointer"
                >
                  + Create Advertisement
                </button>
              </div>

              {/* Recent Articles Table */}
              <div className="pt-4">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-300 font-mono text-xs">
                  <span className="font-bold uppercase text-neutral-900">Recent Stories in Desk</span>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="text-[#DF9E00] font-bold hover:underline cursor-pointer"
                  >
                    View All ({articles.length}) →
                  </button>
                </div>

                <div className="divide-y divide-neutral-200 text-xs">
                  {articles.slice(0, 5).map((art) => (
                    <div key={art.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 mb-0.5">
                          <span className="uppercase text-[#DF9E00] font-bold">{art.category_name}</span>
                          <span>·</span>
                          <span>{new Date(art.published_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-neutral-900 truncate hover:text-[#DF9E00] cursor-pointer" onClick={() => handleEditArticle(art)}>
                          {art.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold ${
                          art.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {art.status}
                        </span>
                        <button
                          onClick={() => handleEditArticle(art)}
                          className="p-1 hover:text-black text-neutral-400 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ARTICLES LIST TAB */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-900">
                <div>
                  <h1 className="text-xl font-black uppercase text-neutral-900">
                    Newsroom Articles
                  </h1>
                  <p className="text-xs text-neutral-500 font-mono">
                    Filter, edit, and publish verified editorial stories
                  </p>
                </div>
                <button
                  onClick={handleStartNewArticle}
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F5B800]" />
                  <span>Add News</span>
                </button>
              </div>

              {/* Filters bar */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 flex flex-wrap gap-3 font-mono text-xs items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    placeholder="Search by headline or keyword..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-neutral-300 text-xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                    <option value="scheduled">Scheduled</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-neutral-300 text-xs"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Articles Table */}
              <div className="overflow-x-auto border border-neutral-200 font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Headline</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Author</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3 px-3 max-w-xs sm:max-w-md">
                          <div className="font-bold text-neutral-900 truncate hover:text-[#DF9E00] cursor-pointer" onClick={() => handleEditArticle(art)}>
                            {art.title}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono truncate">{art.slug}</div>
                        </td>
                        <td className="py-3 px-3 uppercase text-[10px] font-bold text-neutral-600">
                          {art.category_name}
                        </td>
                        <td className="py-3 px-3 text-neutral-700">
                          {art.author_name}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => handleToggleArticleStatus(art)}
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors cursor-pointer rounded-xs ${
                              art.status === 'published'
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                            }`}
                            title={art.status === 'published' ? 'Click to unpublish story (move to draft)' : 'Click to publish story live'}
                          >
                            {art.status}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-neutral-500 text-[10px] whitespace-nowrap">
                          {new Date(art.published_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditArticle(art)}
                              className="p-1 hover:text-black text-neutral-500 cursor-pointer"
                              title="Edit Story"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1 hover:text-red-600 text-neutral-400 cursor-pointer"
                              title="Delete Story"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ARTICLE EDITOR (Requirements 7, 8, 9, 17, 18, 27) */}
          {activeTab === 'article-editor' && editingArticle && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-900 font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                    title="Back to list"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h1 className="text-lg font-black uppercase text-neutral-900">
                    {editingArticle.title ? 'Edit Story' : 'New Article Draft'}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewArticle(editingArticle)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleSaveArticle('draft')}
                    className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSaveArticle('published')}
                    className="px-4 py-1.5 bg-[#F5B800] hover:bg-[#E0A700] text-black text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Story</span>
                  </button>
                </div>
              </div>

              {/* Meta Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Headline (Title)</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    placeholder="Enter factual editorial headline..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 font-sans text-sm font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Permanent Slug</label>
                  <input
                    type="text"
                    value={editingArticle.slug}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    placeholder="news/your-story-slug"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-neutral-700 mb-1">Subtitle / Dek (Summary)</label>
                  <textarea
                    rows={2}
                    value={editingArticle.subtitle}
                    onChange={(e) => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                    placeholder="Short 1-2 sentence lead summary..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 font-sans text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Category</label>
                  <select
                    value={editingArticle.category_slug}
                    onChange={(e) => {
                      const selectedCat = categories.find((c) => c.slug === e.target.value);
                      setEditingArticle({
                        ...editingArticle,
                        category_slug: e.target.value,
                        category_name: selectedCat ? selectedCat.name : e.target.value,
                        category_id: e.target.value,
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Author Selection: Arjun Sindhu (Requirement 17) */}
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Author Byline</label>
                  <select
                    value={editingArticle.author_id}
                    onChange={() => {}}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-bold text-neutral-900"
                  >
                    <option value="author-arjun-sindhu">Arjun Sindhu (Founder & Editor-in-Chief)</option>
                  </select>
                </div>
              </div>

              {/* Featured Image MediaUploader (Requirements 5, 7, 8, 9, 27, 32) */}
              <div className="p-4 bg-neutral-50 border border-neutral-300">
                <MediaUploader
                  label="Featured News Image (1200 × 675, 16:9)"
                  recommendedWidth={1200}
                  recommendedHeight={675}
                  aspectRatioLabel="16:9"
                  bucket="article-images"
                  currentImageUrl={editingArticle.featured_image}
                  onImageUploaded={(url) => setEditingArticle({ ...editingArticle, featured_image: url })}
                  altText={editingArticle.featured_image_alt}
                  onAltTextChange={(alt) => setEditingArticle({ ...editingArticle, featured_image_alt: alt })}
                  caption={editingArticle.image_caption}
                  onCaptionChange={(caption) => setEditingArticle({ ...editingArticle, image_caption: caption })}
                  credit={editingArticle.image_credit}
                  onCreditChange={(credit) => setEditingArticle({ ...editingArticle, image_credit: credit })}
                  sourceUrl={editingArticle.featured_image_source_url}
                  onSourceUrlChange={(src) => setEditingArticle({ ...editingArticle, featured_image_source_url: src })}
                />
              </div>

              {/* Editorial Flags / Toggles */}
              <div className="p-3 bg-neutral-100 border border-neutral-300 flex flex-wrap gap-6 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingArticle.is_featured}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_featured: e.target.checked })}
                  />
                  <span className="font-bold">Featured Story (Lead Hero)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingArticle.is_trending}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_trending: e.target.checked })}
                  />
                  <span className="font-bold text-[#DF9E00]">Trending in Wire</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingArticle.is_editor_pick}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_editor_pick: e.target.checked })}
                  />
                  <span className="font-bold">Editor's Pick</span>
                </label>
              </div>

              {/* Source & Attribution Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Source / Attribution</label>
                  <input
                    type="text"
                    value={editingArticle.source_name || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, source_name: e.target.value })}
                    placeholder="e.g. MeitY Gazette Notification / Exchange Filing"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Source URL</label>
                  <input
                    type="url"
                    value={editingArticle.source_url || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, source_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs"
                  />
                </div>
              </div>

              {/* 1. REBUILD THE ARTICLE EDITOR: ONE SINGLE FULL ARTICLE BODY RICH-TEXT EDITOR */}
              <div className="space-y-2 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-900 font-mono text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#DF9E00]"></span>
                    <span className="font-black uppercase tracking-wider text-neutral-900 text-sm">
                      Full Article Body (Unified Editor)
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-sans">
                    One single rich-text editor with full typographic hierarchy, in-body media, and verified internal links.
                  </span>
                </div>

                <FullArticleBodyEditor
                  value={editingArticle.article_body || convertBlocksToArticleBody(editingArticle.content_blocks)}
                  onChange={(html) => setEditingArticle({ ...editingArticle, article_body: html })}
                  articleTitle={editingArticle.title}
                  allArticles={articles}
                />
              </div>

              {/* 2. DEDICATED SEO SECTION & REAL-TIME SEO ANALYSIS */}
              <div className="pt-4">
                <ArticleSEOSection
                  article={editingArticle}
                  onChange={(updated) => setEditingArticle({ ...editingArticle, ...updated })}
                  allArticles={articles}
                />
              </div>

              {/* 3. ENTITIES, AUTHOR BYLINE & TOPICAL KNOWLEDGE GRAPH */}
              <div className="pt-2">
                <ArticleEntitiesSection
                  article={editingArticle}
                  onChange={(updated) => setEditingArticle({ ...editingArticle, ...updated })}
                  authors={authors}
                  categories={categories}
                />
              </div>
            </div>
          )}

          {/* 4. HOMEPAGE BUILDER (Requirements 6 & 24) */}
          {activeTab === 'homepage-builder' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-900 font-mono">
                <div>
                  <h1 className="text-xl font-black uppercase text-neutral-900">
                    Homepage Architecture & Section Builder
                  </h1>
                  <p className="text-xs text-neutral-500">
                    Reorder, hide, or create sections. Public homepage strictly follows this exact order.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSectionModal(true)}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F5B800]" />
                  <span>Add Section</span>
                </button>
              </div>

              {/* Sections List with Drag/Move Order (Requirement 24) */}
              <div className="space-y-2.5 font-mono text-xs">
                {sections.map((section, idx) => (
                  <div
                    key={section.id}
                    className={`p-3.5 border transition-all flex items-center justify-between gap-4 ${
                      section.is_visible ? 'bg-white border-neutral-300' : 'bg-neutral-100 border-dashed border-neutral-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-neutral-400 font-bold text-base cursor-grab">☰</span>
                      <span className="w-6 h-6 rounded-full bg-neutral-900 text-[#F5B800] flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-black text-neutral-900 uppercase truncate">
                          {section.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          Type: {section.section_type} · Layout: {section.layout_type} {section.category_slug ? `· /${section.category_slug}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="p-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Visibility */}
                      <button
                        onClick={() => handleToggleSectionVisible(section)}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase border cursor-pointer ${
                          section.is_visible
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        {section.is_visible ? 'Visible' : 'Hidden'}
                      </button>

                      {/* Delete Section */}
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. BREAKING NEWS TAB (Requirement 3) */}
          {activeTab === 'breaking-news' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-neutral-900 font-mono">
                <h1 className="text-xl font-black uppercase text-neutral-900">
                  Breaking News Alerts
                </h1>
                <p className="text-xs text-neutral-500">
                  Real-time alerts displayed across the top breaking news bar on the live publication
                </p>
              </div>

              {/* Add Breaking Form */}
              <form onSubmit={handleAddBreakingNews} className="p-4 bg-neutral-50 border border-neutral-300 space-y-3 font-mono text-xs">
                <h3 className="font-bold uppercase text-neutral-900">Post New Breaking Alert</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-700 mb-1">Headline Text</label>
                    <input
                      type="text"
                      value={newBreakingHeadline}
                      onChange={(e) => setNewBreakingHeadline(e.target.value)}
                      placeholder="e.g. Ather Energy files draft red herring prospectus for ₹4,500 Cr IPO"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-700 mb-1">Destination Article Link</label>
                    <input
                      type="text"
                      value={newBreakingLink}
                      onChange={(e) => setNewBreakingLink(e.target.value)}
                      placeholder="Story slug or URL (e.g. news/story-slug)"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white font-bold uppercase tracking-wider text-xs cursor-pointer"
                >
                  Publish Breaking Alert
                </button>
              </form>

              {/* Active Breaking List */}
              <div className="space-y-2 font-mono text-xs">
                {breakingNews.map((item) => (
                  <div key={item.id} className="p-3 bg-white border border-neutral-200 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-500 mb-0.5">
                        <span className="text-red-600 font-bold uppercase">ALERT</span>
                        <span>·</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="font-bold text-neutral-900 truncate">{item.headline}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleBreakingActive(item)}
                        className={`px-2 py-1 text-[10px] font-bold uppercase border cursor-pointer ${
                          item.is_active ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDeleteBreaking(item.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. ADVERTISEMENTS TAB (Requirements 11, 12, 13, 14, 15, 16) */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-900 font-mono">
                <div>
                  <h1 className="text-xl font-black uppercase text-neutral-900">
                    Advertisement Campaign Management
                  </h1>
                  <p className="text-xs text-neutral-500">
                    Page-specific sponsorship slots with verified dimensions and real-time updates
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAdModal()}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F5B800]" />
                  <span>Add Advertisement</span>
                </button>
              </div>

              {/* Ads Table matching Requirement 16 */}
              <div className="overflow-x-auto border border-neutral-300 font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Ad</th>
                      <th className="py-2.5 px-3">Advertiser</th>
                      <th className="py-2.5 px-3">Page</th>
                      <th className="py-2.5 px-3">Placement</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Start</th>
                      <th className="py-2.5 px-3">End</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={ad.image_url}
                              alt={ad.name}
                              className="w-12 h-8 object-cover border border-neutral-300 shrink-0 bg-neutral-100"
                            />
                            <div className="font-bold text-neutral-900 truncate max-w-[180px]">{ad.name}</div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-neutral-700">{ad.advertiser}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="bg-neutral-100 px-2 py-0.5 border border-neutral-200 uppercase text-[10px] font-bold">
                            {ad.page || 'all'}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-[10px] text-neutral-600 font-bold">
                            {ad.placement}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleAdActive(ad)}
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase border cursor-pointer ${
                              ad.is_active ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {ad.is_active ? 'Active' : 'Paused'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-[10px] text-neutral-500 whitespace-nowrap">
                          {ad.start_date ? new Date(ad.start_date).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-3 text-[10px] text-neutral-500 whitespace-nowrap">
                          {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'Continuous'}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenAdModal(ad)}
                              className="p-1 hover:text-black text-neutral-500 cursor-pointer"
                              title="Edit Advertisement"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. MAGAZINE TAB (Requirements 19, 21, 22) */}
          {activeTab === 'magazine' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-900 font-mono">
                <div>
                  <h1 className="text-xl font-black uppercase text-neutral-900">
                    The Founder Magazine CMS
                  </h1>
                  <p className="text-xs text-neutral-500">
                    Manage archival print and digital issues, cover art, and digital flipbook editions
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMagazineModal(true)}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F5B800]" />
                  <span>Add Issue</span>
                </button>
              </div>

              <div className="space-y-4">
                {magazineIssues.map((issue) => (
                  <div key={issue.id} className="p-4 border border-neutral-300 bg-neutral-50 flex flex-col sm:flex-row gap-6 items-start font-mono text-xs">
                    <img
                      src={issue.cover_image}
                      alt={issue.title}
                      className="w-24 aspect-[3/4] object-cover border border-neutral-400 shrink-0 shadow-sm"
                    />
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#DF9E00] font-bold uppercase">{issue.issue_number} · {issue.season}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                          issue.is_published ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {issue.is_published ? 'Published' : 'Unpublished'}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-neutral-900 truncate">{issue.title}</h3>
                      <p className="text-xs text-neutral-600 font-sans line-clamp-2">{issue.dek}</p>
                      <div className="text-[11px] text-neutral-500 pt-1">
                        Theme: {issue.theme} {issue.pdf_link ? '· PDF Attached' : ''}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleToggleMagazinePublished(issue)}
                          className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 text-[10px] font-bold uppercase cursor-pointer"
                        >
                          {issue.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDeleteMagazineIssue(issue.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                          title="Delete issue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. AUTHORS TAB (Requirement 17: Arjun Sindhu Only) */}
          {activeTab === 'authors' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-neutral-900 font-mono">
                <h1 className="text-xl font-black uppercase text-neutral-900">
                  Newsroom Authors & Masthead
                </h1>
                <p className="text-xs text-neutral-500">
                  Author profiles for Founder Bytes editorial reporting (Arjun Sindhu)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {authors.map((auth) => (
                  <div key={auth.id} className="p-4 border border-neutral-300 bg-neutral-50 flex items-start gap-4">
                    <img
                      src={auth.avatar}
                      alt={auth.name}
                      className="w-14 h-14 rounded-full object-cover border border-neutral-300 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="font-black text-neutral-900 text-sm">{auth.name}</div>
                      <div className="text-[11px] text-[#DF9E00] font-bold uppercase">{auth.role}</div>
                      <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">{auth.bio}</p>
                      <div className="text-[10px] text-neutral-400 pt-1">{auth.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. CATEGORIES TAB (Requirement 28) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-900 font-mono">
                <div>
                  <h1 className="text-xl font-black uppercase text-neutral-900">
                    Content Categories
                  </h1>
                  <p className="text-xs text-neutral-500">
                    Section routing, category taxonomies, and navigation ordering
                  </p>
                </div>
                <button
                  onClick={() => handleOpenCategoryModal()}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F5B800]" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                {categories.map((cat) => (
                  <div key={cat.slug} className="p-3.5 border border-neutral-200 bg-neutral-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-neutral-900 text-sm">{cat.name}</div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenCategoryModal(cat)}
                            className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">/{cat.slug}</div>
                      <div className="text-[11px] text-neutral-600 mt-2 font-sans">{cat.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-neutral-900 font-mono">
                <h1 className="text-xl font-black uppercase text-neutral-900">
                  Settings & Database Configuration
                </h1>
                <p className="text-xs text-neutral-500">
                  Supabase live sync, storage credentials, and publication settings
                </p>
              </div>

              {/* Supabase Status Banner */}
              <div className="p-4 bg-neutral-50 border border-neutral-300 font-mono text-xs">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <Database className="w-4 h-4 text-[#DF9E00]" />
                  <span>SUPABASE REALTIME & DATABASE STATUS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span className="font-bold">
                    {isSupabaseConfigured() ? 'Active Supabase Instance Connected (Realtime Subscribed)' : 'Running in Local Persistent Storage Mode (Offline-Ready)'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-2 font-sans leading-relaxed">
                  Founder Bytes is architected with dual-layer storage. Content synchronizes directly to PostgreSQL, and Supabase Realtime channel subscriptions push changes live across all browsers.
                </p>
              </div>

              {/* Supabase Credentials Form */}
              <div className="p-4 bg-white border border-neutral-300 space-y-4 font-mono text-xs">
                <h3 className="font-bold uppercase text-neutral-900">Configure Supabase Project Credentials</h3>
                <div>
                  <label className="block text-[11px] text-neutral-700 mb-1">VITE_SUPABASE_URL</label>
                  <input
                    type="url"
                    defaultValue={localStorage.getItem('fb_supabase_url') || import.meta.env.VITE_SUPABASE_URL || ''}
                    id="input-supabase-url"
                    placeholder="https://your-project.supabase.co"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-700 mb-1">VITE_SUPABASE_ANON_KEY</label>
                  <input
                    type="password"
                    defaultValue={localStorage.getItem('fb_supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''}
                    id="input-supabase-anon"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const urlInput = (document.getElementById('input-supabase-url') as HTMLInputElement)?.value;
                    const keyInput = (document.getElementById('input-supabase-anon') as HTMLInputElement)?.value;
                    updateSupabaseCredentials(urlInput, keyInput);
                    showToast('Supabase connection updated.');
                  }}
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white font-bold uppercase tracking-wider text-xs cursor-pointer"
                >
                  Save Supabase Keys
                </button>
              </div>

              {/* Administrator Access & Security Configuration */}
              <div className="p-4 bg-white border border-neutral-300 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-neutral-900">
                    <Lock className="w-4 h-4 text-[#DF9E00]" />
                    <span className="uppercase">Editorial Administrator Credentials</span>
                  </div>
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold border border-neutral-200">
                    ROLE: SUPER_ADMIN
                  </span>
                </div>
                
                <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 font-bold uppercase">Active Master Password:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 bg-white px-2.5 py-0.5 border border-neutral-300 font-mono tracking-wider">
                        {revealActivePassword
                          ? (localStorage.getItem('fb_admin_password') || 'Admin@founderbytes123')
                          : '••••••••••••••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRevealActivePassword(!revealActivePassword)}
                        className="text-[10px] text-neutral-600 hover:text-black font-mono border border-neutral-300 bg-white px-1.5 py-0.5 cursor-pointer"
                      >
                        {revealActivePassword ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    This password grants full editorial access to publish stories, modify homepage sections, manage breaking news, and configure publication settings.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-700 mb-1">
                    Update Administrator Password
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        placeholder="Enter new password (min. 8 characters)"
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs pr-16"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 hover:text-black font-mono px-1 cursor-pointer"
                      >
                        {showAdminPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!adminPasswordInput || adminPasswordInput.trim().length < 6) {
                            showToast('Password must be at least 6 characters.');
                            return;
                          }
                          const newPass = adminPasswordInput.trim();
                          localStorage.setItem('fb_admin_password', newPass);
                          localStorage.setItem('fb_admin_auth_hash', btoa(`admin@founderbytes.in:${newPass}`));
                          setAdminPasswordInput('');
                          showToast('Admin password updated successfully.');
                        }}
                        className="px-4 py-2 bg-[#111111] hover:bg-black text-white font-bold uppercase tracking-wider text-xs cursor-pointer"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('fb_admin_password', 'Admin@founderbytes123');
                          localStorage.setItem('fb_admin_auth_hash', btoa('admin@founderbytes.in:Admin@founderbytes123'));
                          setAdminPasswordInput('');
                          showToast('Password reset to default: Admin@founderbytes123');
                        }}
                        className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold uppercase tracking-wider text-[11px] cursor-pointer"
                        title="Reset to Admin@founderbytes123"
                      >
                        Reset Default
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Add/Edit Advertisement (Requirements 11, 12, 13, 14, 15) */}
      {showAddAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowAddAdModal(false)}></div>
          <div className="relative bg-white border-2 border-neutral-900 p-6 max-w-lg w-full z-10 font-mono text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black uppercase text-neutral-900 mb-3">
              {editingAd ? 'Edit Advertisement Campaign' : 'Publish New Advertisement'}
            </h3>
            <form onSubmit={handleSaveAd} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={newAdName}
                  onChange={(e) => setNewAdName(e.target.value)}
                  required
                  placeholder="e.g. Karnataka Digital Economy Mission"
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Advertiser / Brand</label>
                <input
                  type="text"
                  value={newAdAdvertiser}
                  onChange={(e) => setNewAdAdvertiser(e.target.value)}
                  required
                  placeholder="e.g. KDEM Bengaluru"
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              {/* Page Selection (Requirement 15) */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Target Page Section
                </label>
                <select
                  value={newAdPage}
                  onChange={(e) => {
                    const page = e.target.value;
                    setNewAdPage(page);
                    const defaultPlacement = PAGE_PLACEMENTS_MAP[page]?.[0]?.id || 'top';
                    setNewAdPlacement(defaultPlacement);
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 text-xs font-bold"
                >
                  <option value="all">All Pages / Global Banner</option>
                  <option value="news">News Page</option>
                  <option value="startups">Startups Page</option>
                  <option value="business">Business Page</option>
                  <option value="technology">Technology Page</option>
                  <option value="ai">AI Page</option>
                  <option value="founders">Founders Page</option>
                  <option value="funding">Funding Page</option>
                  <option value="markets">Markets Page</option>
                  <option value="innovation">Innovation Page</option>
                  <option value="magazine">Magazine Page</option>
                  <option value="article">Article Pages</option>
                </select>
              </div>

              {/* Available Placement Slots (Requirement 13) */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Available Placement Slot (Filtered for {newAdPage.toUpperCase()})
                </label>
                <select
                  value={newAdPlacement}
                  onChange={(e) => setNewAdPlacement(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                >
                  {availablePlacements.map((p) => (
                    <option key={p.id} value={p.id}>
                      ✓ {p.label} ({p.width}×{p.height} px)
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Image using MediaUploader (Requirements 7, 8, 12) */}
              <div>
                <MediaUploader
                  label="Advertisement Banner Creative"
                  recommendedWidth={728}
                  recommendedHeight={90}
                  aspectRatioLabel="728:90 / Responsive Banner"
                  bucket="advertisements"
                  currentImageUrl={newAdImage}
                  onImageUploaded={(url) => setNewAdImage(url)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Destination URL</label>
                <input
                  type="url"
                  value={newAdUrl}
                  onChange={(e) => setNewAdUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newAdStartDate}
                    onChange={(e) => setNewAdStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={newAdEndDate}
                    onChange={(e) => setNewAdEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAdModal(false)}
                  className="px-3 py-2 bg-neutral-200 text-neutral-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Save Advertisement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Magazine Issue (Requirements 19, 21) */}
      {showAddMagazineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowAddMagazineModal(false)}></div>
          <div className="relative bg-white border-2 border-neutral-900 p-6 max-w-lg w-full z-10 font-mono text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black uppercase text-neutral-900 mb-3">Publish New Magazine Issue</h3>
            <form onSubmit={handleSaveMagazineIssue} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Issue Number</label>
                  <input
                    type="text"
                    value={newIssueNumber}
                    onChange={(e) => setNewIssueNumber(e.target.value)}
                    placeholder="e.g. Issue 02"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Season / Edition</label>
                  <input
                    type="text"
                    value={newIssueSeason}
                    onChange={(e) => setNewIssueSeason(e.target.value)}
                    placeholder="e.g. Winter 2026"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Issue Title (Cover Story)</label>
                <input
                  type="text"
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  placeholder="e.g. BHARAT TECH TITANS 2026"
                  required
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Summary / Dek</label>
                <textarea
                  rows={2}
                  value={newIssueDek}
                  onChange={(e) => setNewIssueDek(e.target.value)}
                  placeholder="Key editorial focus of this quarterly edition..."
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              {/* Cover Image Upload (Requirement 21) */}
              <div>
                <MediaUploader
                  label="Magazine Cover Image"
                  recommendedWidth={1600}
                  recommendedHeight={2400}
                  aspectRatioLabel="2:3 Portrait"
                  bucket="magazine-covers"
                  currentImageUrl={newIssueCoverImage}
                  onImageUploaded={(url) => setNewIssueCoverImage(url)}
                />
              </div>

              {/* PDF Issue Upload (Requirement 21) */}
              <div>
                <MediaUploader
                  label="Magazine PDF Issue"
                  recommendedWidth={1600}
                  recommendedHeight={2400}
                  aspectRatioLabel="Print Document"
                  bucket="site-assets"
                  allowPdf={true}
                  currentImageUrl={newIssuePdfLink}
                  onImageUploaded={(url) => setNewIssuePdfLink(url)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMagazineModal(false)}
                  className="px-3 py-2 bg-neutral-200 text-neutral-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Publish Magazine Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Homepage Section */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowAddSectionModal(false)}></div>
          <div className="relative bg-white border-2 border-neutral-900 p-6 max-w-md w-full z-10 font-mono text-xs shadow-2xl">
            <h3 className="text-base font-bold uppercase text-neutral-900 mb-3">Add Custom Homepage Section</h3>
            <form onSubmit={handleCreateSection} className="space-y-3">
              <div>
                <label className="block text-[11px] text-neutral-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => {
                    setNewSectionName(e.target.value);
                    setNewSectionSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  required
                  placeholder="e.g. Agritech & Rural Economy"
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-700 mb-1">Layout Template</label>
                <select
                  value={newSectionLayout}
                  onChange={(e) => setNewSectionLayout(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                >
                  <option value="startup-split">Startup Split (Lead Left + Stacked Right)</option>
                  <option value="grid-3">3-Column Grid</option>
                  <option value="horizontal-list">Horizontal Feature Rows</option>
                  <option value="founders-mosaic">Founders Portrait Mosaic</option>
                  <option value="funding-table">Funding Deals Table</option>
                  <option value="tech-grid">Tech & Engineering Grid</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-700 mb-1">Filter by Category</label>
                <select
                  value={newSectionCategory}
                  onChange={(e) => setNewSectionCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-3 py-2 bg-neutral-200 text-neutral-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F5B800] text-black font-bold text-xs uppercase cursor-pointer"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Add/Edit Category (Requirement 28) */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowCategoryModal(false)}></div>
          <div className="relative bg-white border-2 border-neutral-900 p-6 max-w-md w-full z-10 font-mono text-xs shadow-2xl">
            <h3 className="text-base font-bold uppercase text-neutral-900 mb-3">
              {editingCategory ? 'Edit Category' : 'Add Content Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-[11px] text-neutral-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (!editingCategory) {
                      setNewCategorySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  required
                  placeholder="e.g. Agritech"
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-700 mb-1">Slug / URL Path</label>
                <input
                  type="text"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  required
                  placeholder="e.g. agritech"
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Brief description of stories in this category..."
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-3 py-2 bg-neutral-200 text-neutral-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F5B800] text-black font-bold text-xs uppercase cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
