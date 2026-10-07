import React, { useState, useEffect } from 'react';
import { 
  FounderSpotlight, 
  FounderSpotlightPackage, 
  SpotlightPaymentStatus, 
  SpotlightStatus 
} from '../../types/cms';
import { ContentService } from '../../services/contentService';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Upload, 
  ArrowUpDown,
  Building,
  UserCheck,
  Globe,
  Linkedin,
  Instagram,
  RefreshCw
} from 'lucide-react';

interface AdminFounderSpotlightTabProps {
  onViewPublicProfile?: (slug: string) => void;
}

export const AdminFounderSpotlightTab: React.FC<AdminFounderSpotlightTabProps> = ({
  onViewPublicProfile,
}) => {
  const [spotlights, setSpotlights] = useState<FounderSpotlight[]>([]);
  const [packages, setPackages] = useState<FounderSpotlightPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'position' | 'created' | 'end_date' | 'price'>('position');
  
  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FounderSpotlight | null>(null);
  const [previewItem, setPreviewItem] = useState<FounderSpotlight | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    founder_name: '',
    founder_photo: '',
    company_name: '',
    designation: '',
    industry: '',
    short_bio: '',
    founder_story: '',
    featured_quote: '',
    website_url: '',
    linkedin_url: '',
    instagram_url: '',
    cta_text: 'View Spotlight',
    cta_url: '',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    featured_position: 1,
    package_id: '',
    price: 75000,
    payment_status: 'Paid' as SpotlightPaymentStatus,
    admin_notes: '',
    status: 'Live' as SpotlightStatus,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [spots, pkgs] = await Promise.all([
        ContentService.getFounderSpotlights(),
        ContentService.getSpotlightPackages(),
      ]);
      setSpotlights(spots);
      setPackages(pkgs);
    } catch (err) {
      console.error('Failed to load spotlights data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = ContentService.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleOpenNew = () => {
    setEditingItem(null);
    const defaultPkg = packages.find(p => p.name === 'PREMIUM') || packages[0];
    setFormData({
      founder_name: '',
      founder_photo: '',
      company_name: '',
      designation: '',
      industry: 'Fintech & Enterprise',
      short_bio: '',
      founder_story: '',
      featured_quote: '',
      website_url: '',
      linkedin_url: '',
      instagram_url: '',
      cta_text: 'Explore Venture',
      cta_url: '',
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(Date.now() + (defaultPkg ? defaultPkg.duration_days : 30) * 86400000).toISOString().slice(0, 10),
      featured_position: (spotlights.length + 1),
      package_id: defaultPkg?.id || '',
      price: defaultPkg?.price || 75000,
      payment_status: 'Paid',
      admin_notes: '',
      status: 'Live',
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (item: FounderSpotlight) => {
    setEditingItem(item);
    setFormData({
      founder_name: item.founder_name,
      founder_photo: item.founder_photo,
      company_name: item.company_name,
      designation: item.designation,
      industry: item.industry,
      short_bio: item.short_bio,
      founder_story: item.founder_story,
      featured_quote: item.featured_quote || '',
      website_url: item.website_url || '',
      linkedin_url: item.linkedin_url || '',
      instagram_url: item.instagram_url || '',
      cta_text: item.cta_text || 'View Spotlight',
      cta_url: item.cta_url || '',
      start_date: item.start_date.slice(0, 10),
      end_date: item.end_date.slice(0, 10),
      featured_position: item.featured_position,
      package_id: item.package_id || '',
      price: item.price ?? 75000,
      payment_status: item.payment_status,
      admin_notes: item.admin_notes || '',
      status: item.status,
    });
    setShowFormModal(true);
  };

  const handlePackageSelect = (pkgId: string) => {
    const pkg = packages.find(p => p.id === pkgId);
    if (pkg) {
      const days = pkg.duration_days || 30;
      const start = new Date(formData.start_date || Date.now());
      const end = new Date(start.getTime() + days * 86400000);
      setFormData(prev => ({
        ...prev,
        package_id: pkg.id,
        price: pkg.price,
        end_date: end.toISOString().slice(0, 10),
      }));
    } else {
      setFormData(prev => ({ ...prev, package_id: '' }));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await ContentService.uploadFounderPhoto(file);
      setFormData(prev => ({ ...prev, founder_photo: url }));
      showNotification('Founder portrait uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Photo upload failed. Please try a valid image file or paste URL directly.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.founder_name.trim()) {
      alert('Founder Name is required.');
      return;
    }
    if (!formData.founder_photo.trim()) {
      alert('Founder Photo URL is required.');
      return;
    }
    if (!formData.company_name.trim()) {
      alert('Company Name is required.');
      return;
    }

    const slug = editingItem 
      ? editingItem.slug 
      : formData.founder_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      if (editingItem) {
        await ContentService.updateFounderSpotlight(editingItem.id, {
          ...formData,
          slug,
        });
        showNotification(`Spotlight for "${formData.founder_name}" updated.`);
      } else {
        await ContentService.createFounderSpotlight({
          ...formData,
          slug,
        });
        showNotification(`Spotlight for "${formData.founder_name}" created.`);
      }
      setShowFormModal(false);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error saving Founder Spotlight.');
    }
  };

  const handleDelete = async (item: FounderSpotlight) => {
    if (!window.confirm(`Are you sure you want to delete "${item.founder_name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await ContentService.deleteFounderSpotlight(item.id);
      showNotification(`Deleted spotlight "${item.founder_name}".`);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert('Error deleting spotlight.');
    }
  };

  const handleToggleStatus = async (item: FounderSpotlight) => {
    const nextStatus: SpotlightStatus = item.status === 'Live' ? 'Unpublished' : 'Live';
    try {
      await ContentService.updateFounderSpotlight(item.id, { status: nextStatus });
      showNotification(`"${item.founder_name}" status changed to ${nextStatus}.`);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const todayStr = new Date().toISOString().slice(0, 10);
  const totalCount = spotlights.length;
  const liveCount = spotlights.filter(s => {
    if (s.status !== 'Live') return false;
    const start = s.start_date.slice(0, 10);
    const end = s.end_date.slice(0, 10);
    return todayStr >= start && todayStr <= end && (s.payment_status === 'Paid' || s.payment_status === 'Complimentary');
  }).length;
  const scheduledCount = spotlights.filter(s => s.status === 'Scheduled' || (s.status === 'Live' && s.start_date.slice(0, 10) > todayStr)).length;
  const expiredCount = spotlights.filter(s => s.status === 'Expired' || s.end_date.slice(0, 10) < todayStr).length;
  const totalRevenue = spotlights
    .filter(s => s.payment_status === 'Paid')
    .reduce((acc, curr) => acc + (curr.price || 0), 0);

  // Filtered & Sorted
  const filtered = spotlights.filter(s => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'Live' && s.status !== 'Live') return false;
      if (statusFilter === 'Scheduled' && s.status !== 'Scheduled') return false;
      if (statusFilter === 'Expired' && s.status !== 'Expired' && s.end_date.slice(0, 10) >= todayStr) return false;
      if (statusFilter === 'Draft' && s.status !== 'Draft') return false;
      if (statusFilter === 'Unpublished' && s.status !== 'Unpublished') return false;
    }
    if (paymentFilter !== 'all' && s.payment_status !== paymentFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.founder_name.toLowerCase().includes(q);
      const matchCompany = s.company_name.toLowerCase().includes(q);
      const matchIndustry = s.industry.toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchIndustry) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'position') return (a.featured_position || 1) - (b.featured_position || 1);
    if (sortBy === 'created') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'end_date') return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
    if (sortBy === 'price') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-[#F5B800] px-4 py-3 rounded-none shadow-xl border border-[#F5B800] font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5B800]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#F5B800]"></span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900 font-serif">
              FOUNDER SPOTLIGHT
            </h1>
            <span className="px-2 py-0.5 bg-neutral-900 text-[#F5B800] text-[10px] font-mono font-bold uppercase tracking-wider">
              MONETIZABLE EDITORIAL
            </span>
          </div>
          <p className="text-xs text-neutral-600 font-serif mt-1">
            Manage high-profile sponsored profiles, commercial packages, editorial placement, and live schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 bg-black text-[#F5B800] hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Founder Spotlight</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 font-mono">
        <div className="p-4 bg-white border border-neutral-200 border-l-4 border-l-neutral-900">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Total Records</div>
          <div className="text-2xl font-black text-neutral-900 mt-1">{totalCount}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">In database</div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 border-l-4 border-l-green-600">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Live on Homepage</span>
          </div>
          <div className="text-2xl font-black text-green-700 mt-1">
            {liveCount} <span className="text-xs font-normal text-neutral-400">/ 3 max</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Active & verified</div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 border-l-4 border-l-blue-600">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Scheduled</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{scheduledCount}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Future dates</div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 border-l-4 border-l-amber-600">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Expired</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{expiredCount}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Auto-withdrawn</div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 border-l-4 border-l-[#F5B800] col-span-2 lg:col-span-1">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Recorded Billing</div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Paid spotlights</div>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="p-3 bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search founder, company, sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-white border border-neutral-300 px-2 py-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-neutral-900 text-xs"
            >
              <option value="all">All ({totalCount})</option>
              <option value="Live">Live ({liveCount})</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Expired">Expired ({expiredCount})</option>
              <option value="Draft">Draft</option>
              <option value="Unpublished">Unpublished</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-neutral-300 px-2 py-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-neutral-900 text-xs"
            >
              <option value="all">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Complimentary">Complimentary</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-neutral-300 px-2 py-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none font-bold text-neutral-900 text-xs"
            >
              <option value="position">Position (#1-#3)</option>
              <option value="created">Recently Created</option>
              <option value="end_date">End Date</option>
              <option value="price">Highest Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spotlight List Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900 text-white font-mono uppercase tracking-wider text-[11px] border-b border-neutral-800">
                <th className="py-3 px-3 font-bold w-12 text-center">Pos</th>
                <th className="py-3 px-3 font-bold">Founder & Enterprise</th>
                <th className="py-3 px-3 font-bold hidden sm:table-cell">Industry</th>
                <th className="py-3 px-3 font-bold">Schedule</th>
                <th className="py-3 px-3 font-bold">Package & Price</th>
                <th className="py-3 px-3 font-bold">Payment</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500 font-mono text-xs">
                    No founder spotlights found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isEndPassed = item.end_date.slice(0, 10) < todayStr;
                  const isStartFuture = item.start_date.slice(0, 10) > todayStr;
                  const isCurrentlyLive = item.status === 'Live' && !isEndPassed && !isStartFuture && (item.payment_status === 'Paid' || item.payment_status === 'Complimentary');

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-neutral-50/80 transition-colors ${isCurrentlyLive ? 'bg-amber-50/20' : ''}`}
                    >
                      {/* Position */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold ${item.featured_position <= 3 ? 'bg-[#F5B800] text-black' : 'bg-neutral-100 text-neutral-600'}`}>
                          #{item.featured_position}
                        </span>
                      </td>

                      {/* Photo & Founder */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.founder_photo}
                            alt={item.founder_name}
                            className="w-10 h-10 object-cover rounded-none border border-neutral-300 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-neutral-900 hover:text-black font-serif text-sm">
                              {item.founder_name}
                            </div>
                            <div className="text-[11px] text-neutral-600 font-mono flex items-center gap-1">
                              <span className="font-semibold">{item.company_name}</span>
                              <span>·</span>
                              <span className="text-neutral-500">{item.designation}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-mono font-bold uppercase">
                          {item.industry}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div className="text-neutral-900 font-medium">
                          {new Date(item.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {new Date(item.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        {isEndPassed ? (
                          <span className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            <span>Expired</span>
                          </span>
                        ) : isStartFuture ? (
                          <span className="text-blue-600 text-[10px] font-bold flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Starts in future</span>
                          </span>
                        ) : (
                          <span className="text-green-700 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Active window</span>
                          </span>
                        )}
                      </td>

                      {/* Package & Price */}
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div className="font-bold text-neutral-900">
                          {item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'Custom'}
                        </div>
                        <div className="text-[10px] text-neutral-500 uppercase">
                          {packages.find(p => p.id === item.package_id)?.name || 'Custom Plan'}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-3 font-mono">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase ${
                          item.payment_status === 'Paid' ? 'bg-green-100 text-green-800 border border-green-300' :
                          item.payment_status === 'Complimentary' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          item.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                          'bg-neutral-100 text-neutral-800'
                        }`}>
                          {item.payment_status}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 font-mono">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase ${
                          item.status === 'Live' ? 'bg-black text-[#F5B800] border border-black' :
                          item.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          item.status === 'Expired' ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-neutral-100 text-neutral-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                            title="Preview Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                            title={item.status === 'Live' ? 'Unpublish' : 'Publish Live'}
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${item.status === 'Live' ? 'text-[#DF9E00]' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full border-2 border-black max-h-[90vh] flex flex-col my-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-neutral-900 text-white border-b-2 border-[#F5B800]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider">
                  {editingItem ? 'EDIT FOUNDER SPOTLIGHT' : 'CREATE FOUNDER SPOTLIGHT'}
                </h3>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SECTION 1: Personal & Venture Information */}
                <div className="space-y-4">
                  <h4 className="font-mono font-bold text-neutral-900 border-b border-neutral-200 pb-1 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#DF9E00]" />
                    <span>Founder & Company Info</span>
                  </h4>

                  <div>
                    <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Founder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.founder_name}
                      onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
                      placeholder="e.g. Tarun Mehta"
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="e.g. Ather Energy"
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-sans text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Designation *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="e.g. Co-founder & CEO"
                        className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Industry *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="e.g. CleanTech & Mobility"
                        className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Photo Upload & Preview */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Founder Photo URL or Upload *
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        required
                        value={formData.founder_photo}
                        onChange={(e) => setFormData({ ...formData, founder_photo: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 p-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                      />
                      <label className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingPhoto ? 'Uploading...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.founder_photo && (
                      <div className="flex items-center gap-2 p-2 bg-neutral-50 border border-neutral-200">
                        <img
                          src={formData.founder_photo}
                          alt="Preview"
                          className="w-12 h-12 object-cover border border-neutral-300"
                        />
                        <span className="text-[10px] text-neutral-500 font-mono truncate">
                          {formData.founder_photo}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Short Bio */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Short Bio (Displayed on Homepage Card) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.short_bio}
                      onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                      placeholder="1-2 sentences summarizing the founder's key breakthrough..."
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-serif text-xs leading-relaxed"
                    />
                  </div>

                  {/* Featured Quote */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Featured Quote (Pull Quote)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.featured_quote}
                      onChange={(e) => setFormData({ ...formData, featured_quote: e.target.value })}
                      placeholder="High-impact quote from the founder..."
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-serif italic text-xs"
                    />
                  </div>
                </div>

                {/* SECTION 2: Commercial Package, Dates & Editorial Positioning */}
                <div className="space-y-4">
                  <h4 className="font-mono font-bold text-neutral-900 border-b border-neutral-200 pb-1 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#DF9E00]" />
                    <span>Package, Placement & Billing</span>
                  </h4>

                  {/* Package Selector */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Commercial Package
                    </label>
                    <select
                      value={formData.package_id}
                      onChange={(e) => handlePackageSelect(e.target.value)}
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                    >
                      <option value="">Custom Package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')} ({pkg.duration_days} days)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Payment Status
                      </label>
                      <select
                        value={formData.payment_status}
                        onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
                        className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-mono"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Complimentary">Complimentary</option>
                        <option value="Pending">Pending</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Editorial Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-mono font-bold"
                      >
                        <option value="Live">Live</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Draft">Draft</option>
                        <option value="Expired">Expired</option>
                        <option value="Unpublished">Unpublished</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Featured Position
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.featured_position}
                        onChange={(e) => setFormData({ ...formData, featured_position: Number(e.target.value) })}
                        className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                  </div>

                  {/* Schedule Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                  </div>

                  {/* URLs & Socials */}
                  <div className="space-y-2">
                    <div>
                      <label className="block font-mono text-[10px] font-bold text-neutral-600 uppercase">
                        Company Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        placeholder="https://company.com"
                        className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-mono text-[10px] font-bold text-neutral-600 uppercase">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          value={formData.linkedin_url}
                          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] font-bold text-neutral-600 uppercase">
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          value={formData.instagram_url}
                          onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                          placeholder="https://instagram.com/..."
                          className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-mono text-[10px] font-bold text-neutral-600 uppercase">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.cta_text}
                          onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                          placeholder="View Spotlight"
                          className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] font-bold text-neutral-600 uppercase">
                          CTA Destination URL
                        </label>
                        <input
                          type="url"
                          value={formData.cta_url}
                          onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                          placeholder="https://company.com/deck"
                          className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Admin Internal Notes (Private)
                    </label>
                    <input
                      type="text"
                      value={formData.admin_notes}
                      onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                      placeholder="PO number, contract terms, contact person..."
                      className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Full Founder Story (Markdown / Editorial Content) */}
              <div>
                <label className="block font-mono text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Full Founder Story (Detailed Profile Dossier) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.founder_story}
                  onChange={(e) => setFormData({ ...formData, founder_story: e.target.value })}
                  placeholder="Comprehensive editorial narrative: the early origins, core technology, unit economics, market expansion, setbacks, and future aspirations..."
                  className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-black font-serif text-sm leading-relaxed"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 font-mono text-xs uppercase font-bold hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-black text-[#F5B800] hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {editingItem ? 'Save & Update Spotlight' : 'Publish Founder Spotlight'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full border-2 border-black max-h-[92vh] flex flex-col my-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-neutral-900 text-white border-b-2 border-[#F5B800]">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
                <span className="font-bold text-[#F5B800]">LIVE PREVIEW DOSSIER:</span>
                <span className="text-neutral-300">{previewItem.founder_name} ({previewItem.company_name})</span>
              </div>
              <div className="flex items-center gap-3">
                {onViewPublicProfile && (
                  <button
                    onClick={() => {
                      onViewPublicProfile(previewItem.slug);
                      setPreviewItem(null);
                    }}
                    className="text-xs font-mono text-[#F5B800] hover:underline flex items-center gap-1"
                  >
                    <span>Open /founders/{previewItem.slug}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setPreviewItem(null)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Homepage Card Preview */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-2">
                  1. HOMEPAGE SPOTLIGHT CARD (Compact Grid View)
                </div>
                <div className="max-w-sm p-4 bg-neutral-50 border border-neutral-300">
                  <div className="aspect-[4/3] bg-neutral-200 overflow-hidden mb-3 relative border border-neutral-300">
                    <img
                      src={previewItem.founder_photo}
                      alt={previewItem.founder_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 bg-black text-[#F5B800] text-[9px] font-mono uppercase font-bold">
                        {previewItem.industry}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-neutral-900 font-serif leading-tight">
                    {previewItem.founder_name}
                  </h4>
                  <div className="text-xs font-mono text-neutral-700 mt-1">
                    {previewItem.designation} · <span className="font-bold text-black">{previewItem.company_name}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-2 font-serif line-clamp-2">
                    {previewItem.short_bio}
                  </p>
                  <div className="mt-3 pt-2 border-t border-neutral-200 flex justify-between text-xs font-mono font-bold text-neutral-900">
                    <span>{previewItem.cta_text || 'View Spotlight'}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>

              {/* Dedicated Profile Header Preview */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-2">
                  2. FULL PROFILE VIEW (/founders/{previewItem.slug})
                </div>
                <div className="bg-[#111111] text-white p-6 border-b-2 border-[#F5B800]">
                  <span className="text-[10px] font-mono text-[#F5B800] uppercase font-bold">
                    FOUNDER BYTES SPOTLIGHT DOSSIER
                  </span>
                  <h2 className="text-3xl font-black uppercase font-serif text-white mt-1">
                    {previewItem.founder_name}
                  </h2>
                  <div className="text-sm font-mono text-neutral-300 mt-2">
                    {previewItem.designation} · <span className="text-[#F5B800] font-bold">{previewItem.company_name}</span> · {previewItem.industry}
                  </div>
                </div>

                <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-4">
                  {previewItem.featured_quote && (
                    <div className="p-4 bg-neutral-900 text-white border-l-4 border-[#F5B800] italic font-serif text-base">
                      "{previewItem.featured_quote}"
                    </div>
                  )}

                  <div className="font-serif text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
                    {previewItem.founder_story}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2 bg-neutral-900 text-white font-mono text-xs font-bold uppercase tracking-wider"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
