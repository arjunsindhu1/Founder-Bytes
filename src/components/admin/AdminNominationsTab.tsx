import React, { useState, useEffect } from 'react';
import { ContentService } from '../../services/contentService';
import { MagazineNomination, NominationStatus } from '../../types/cms';
import { 
  Award, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Pencil,
  MessageSquare, 
  Archive, 
  Check, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Copy, 
  ExternalLink, 
  FileText, 
  User, 
  Building, 
  TrendingUp, 
  Sparkles, 
  Radio, 
  RefreshCw,
  Calendar,
  ChevronDown
} from 'lucide-react';

interface AdminNominationsTabProps {
  onShowToast: (msg: string) => void;
}

export const AdminNominationsTab: React.FC<AdminNominationsTabProps> = ({ onShowToast }) => {
  const [nominations, setNominations] = useState<MagazineNomination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [magazineFilter, setMagazineFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Selected for full view modal
  const [viewingNomination, setViewingNomination] = useState<MagazineNomination | null>(null);

  // Edit nomination modal
  const [editingNomination, setEditingNomination] = useState<MagazineNomination | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Add note modal
  const [editingNotesNomination, setEditingNotesNomination] = useState<MagazineNomination | null>(null);
  const [notesText, setNotesText] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Real-time alert
  const [realtimeAlert, setRealtimeAlert] = useState<MagazineNomination | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Load nominations
  const loadNominations = async () => {
    try {
      const data = await ContentService.getNominations();
      setNominations(data);
    } catch (err: any) {
      console.error('Failed to load nominations:', err);
      onShowToast(`Error loading nominations: ${err?.message || 'Database error'}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNominations();

    // Subscribe to content changes
    const unsubscribeContent = ContentService.subscribe(() => {
      loadNominations();
    });

    // Subscribe to Realtime new nominations
    const unsubscribeNominations = ContentService.subscribeNominations((newNom) => {
      setRealtimeAlert(newNom);
      onShowToast(`NEW NOMINATION: ${newNom.full_name} · ${newNom.magazine}`);
      // Auto-reload list
      loadNominations();
    });

    return () => {
      unsubscribeContent();
      unsubscribeNominations();
    };
  }, []);

  // Quick Status Change
  const handleStatusChange = async (nomination: MagazineNomination, newStatus: NominationStatus) => {
    try {
      const updated = await ContentService.updateNominationStatus(nomination.id, newStatus);
      setNominations((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      if (viewingNomination?.id === updated.id) {
        setViewingNomination(updated);
      }
      onShowToast(`Status for ${updated.full_name} updated to ${newStatus}`);
    } catch (err: any) {
      onShowToast(`Failed to update status: ${err?.message}`);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (nomination: MagazineNomination) => {
    setEditingNomination({ ...nomination });
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingNomination) return;
    try {
      setIsSavingEdit(true);
      const updated = await ContentService.updateNomination(editingNomination.id, editingNomination);
      setNominations((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      if (viewingNomination?.id === updated.id) {
        setViewingNomination(updated);
      }
      setEditingNomination(null);
      onShowToast(`Nomination for ${updated.full_name} updated successfully.`);
    } catch (err: any) {
      onShowToast(`Failed to update nomination: ${err?.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Open Notes Modal
  const handleOpenNotes = (nomination: MagazineNomination) => {
    setEditingNotesNomination(nomination);
    setNotesText(nomination.admin_notes || '');
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!editingNotesNomination) return;
    try {
      setIsSavingNotes(true);
      const updated = await ContentService.updateNominationStatus(
        editingNotesNomination.id,
        editingNotesNomination.status,
        notesText.trim()
      );
      setNominations((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      if (viewingNomination?.id === updated.id) {
        setViewingNomination(updated);
      }
      setEditingNotesNomination(null);
      onShowToast('Admin notes saved successfully.');
    } catch (err: any) {
      onShowToast(`Failed to save notes: ${err?.message}`);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Archive
  const handleArchive = async (nomination: MagazineNomination) => {
    if (!window.confirm(`Archive nomination for ${nomination.full_name} (${nomination.reference_number})?`)) return;
    handleStatusChange(nomination, 'ARCHIVED');
  };

  // Copy Reference
  const handleCopy = (refNum: string) => {
    navigator.clipboard.writeText(refNum);
    setCopiedRef(refNum);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    ContentService.exportNominationsCSV(filteredNominations);
    onShowToast(`Exported ${filteredNominations.length} nominations to CSV.`);
  };

  // Filter nominations
  const filteredNominations = nominations.filter((item) => {
    if (magazineFilter !== 'ALL' && item.magazine !== magazineFilter) {
      return false;
    }
    if (statusFilter !== 'ALL' && item.status !== statusFilter) {
      return false;
    }
    if (dateFilter) {
      const itemDate = item.created_at ? item.created_at.slice(0, 10) : '';
      if (itemDate !== dateFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        (item.full_name || '').toLowerCase().includes(q) ||
        (item.company_name || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.reference_number || '').toLowerCase().includes(q) ||
        (item.city || '').toLowerCase().includes(q) ||
        (item.industry || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Calculate Metric Counts
  const totalCount = nominations.length;
  const newCount = nominations.filter((n) => n.status === 'NEW').length;
  const underReviewCount = nominations.filter((n) => n.status === 'UNDER REVIEW').length;
  const shortlistedCount = nominations.filter((n) => n.status === 'SHORTLISTED').length;
  const selectedCount = nominations.filter((n) => n.status === 'SELECTED').length;
  const count30Under30 = nominations.filter((n) => n.magazine === '30 UNDER 30').length;
  const countFounderTimex = nominations.filter((n) => n.magazine === 'FOUNDER TIMEX').length;

  const STATUS_COLORS: Record<NominationStatus, { bg: string; text: string; border: string }> = {
    NEW: { bg: 'bg-[#F5B800]/20', text: 'text-amber-900', border: 'border-[#F5B800]' },
    'UNDER REVIEW': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
    SHORTLISTED: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300' },
    INTERVIEW: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
    SELECTED: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-400' },
    REJECTED: { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-300' },
    ARCHIVED: { bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200' },
  };

  return (
    <div className="space-y-6">
      {/* REAL-TIME ALERT BANNER (Requirements 7 & 8) */}
      {realtimeAlert && (
        <div className="p-4 bg-black text-white border-2 border-[#F5B800] shadow-lg flex items-center justify-between gap-4 animate-bounce-short">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#F5B800] animate-ping" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5B800] font-bold">
                NEW NOMINATION ARRIVED IN REAL-TIME
              </div>
              <div className="text-sm font-bold">
                {realtimeAlert.full_name} · <span className="text-[#F5B800]">{realtimeAlert.magazine}</span> ({realtimeAlert.company_name})
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewingNomination(realtimeAlert);
                setRealtimeAlert(null);
              }}
              className="px-3 py-1.5 bg-[#F5B800] text-black font-mono text-xs font-bold uppercase hover:bg-white transition-colors"
            >
              View Now
            </button>
            <button
              onClick={() => setRealtimeAlert(null)}
              className="p-1.5 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TOP HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#F5B800]" />
            <h2 className="text-xl font-black uppercase tracking-tight font-serif text-neutral-900">
              MAGAZINE NOMINATIONS
            </h2>
          </div>
          <p className="text-xs font-serif text-neutral-500 mt-0.5">
            Real-time nomination pipeline for Founder Bytes 30 Under 30 & Founder Timex editions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Real-time status pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-[10px] font-mono text-neutral-700">
            <Radio className="w-3 h-3 text-green-600 animate-pulse" />
            <span>REALTIME SYNC ACTIVE</span>
          </div>

          <button
            onClick={() => {
              setIsRefreshing(true);
              loadNominations();
            }}
            disabled={isRefreshing}
            className="p-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 transition-colors"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-neutral-900 hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#F5B800]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD CARDS (Requirement 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total */}
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-3.5 border transition-all cursor-pointer ${
            statusFilter === 'ALL' && magazineFilter === 'ALL'
              ? 'border-black bg-neutral-50 shadow-sm'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-neutral-500 font-bold">TOTAL</div>
          <div className="text-2xl font-black font-mono text-black mt-1">{totalCount}</div>
        </div>

        {/* New */}
        <div 
          onClick={() => setStatusFilter('NEW')}
          className={`p-3.5 border transition-all cursor-pointer ${
            statusFilter === 'NEW'
              ? 'border-[#F5B800] bg-amber-50/50 shadow-sm'
              : 'border-neutral-200 bg-white hover:border-[#F5B800]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-700 font-bold">NEW</span>
            {newCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#DF9E00]" />}
          </div>
          <div className="text-2xl font-black font-mono text-[#DF9E00] mt-1">{newCount}</div>
        </div>

        {/* Under Review */}
        <div 
          onClick={() => setStatusFilter('UNDER REVIEW')}
          className={`p-3.5 border transition-all cursor-pointer ${
            statusFilter === 'UNDER REVIEW'
              ? 'border-blue-600 bg-blue-50/50 shadow-sm'
              : 'border-neutral-200 bg-white hover:border-blue-300'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-blue-700 font-bold">UNDER REVIEW</div>
          <div className="text-2xl font-black font-mono text-blue-700 mt-1">{underReviewCount}</div>
        </div>

        {/* Shortlisted */}
        <div 
          onClick={() => setStatusFilter('SHORTLISTED')}
          className={`p-3.5 border transition-all cursor-pointer ${
            statusFilter === 'SHORTLISTED'
              ? 'border-purple-600 bg-purple-50/50 shadow-sm'
              : 'border-neutral-200 bg-white hover:border-purple-300'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-purple-700 font-bold">SHORTLISTED</div>
          <div className="text-2xl font-black font-mono text-purple-700 mt-1">{shortlistedCount}</div>
        </div>

        {/* Selected */}
        <div 
          onClick={() => setStatusFilter('SELECTED')}
          className={`p-3.5 border transition-all cursor-pointer ${
            statusFilter === 'SELECTED'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
              : 'border-neutral-200 bg-white hover:border-emerald-300'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">SELECTED</div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">{selectedCount}</div>
        </div>

        {/* 30 Under 30 */}
        <div 
          onClick={() => setMagazineFilter(magazineFilter === '30 UNDER 30' ? 'ALL' : '30 UNDER 30')}
          className={`p-3.5 border transition-all cursor-pointer ${
            magazineFilter === '30 UNDER 30'
              ? 'border-black bg-neutral-900 text-white shadow-sm'
              : 'border-neutral-200 bg-white hover:border-neutral-400'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">30 UNDER 30</div>
          <div className={`text-2xl font-black font-mono mt-1 ${magazineFilter === '30 UNDER 30' ? 'text-[#F5B800]' : 'text-black'}`}>
            {count30Under30}
          </div>
        </div>

        {/* Founder Timex */}
        <div 
          onClick={() => setMagazineFilter(magazineFilter === 'FOUNDER TIMEX' ? 'ALL' : 'FOUNDER TIMEX')}
          className={`p-3.5 border transition-all cursor-pointer ${
            magazineFilter === 'FOUNDER TIMEX'
              ? 'border-black bg-neutral-900 text-white shadow-sm'
              : 'border-neutral-200 bg-white hover:border-neutral-400'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">FOUNDER TIMEX</div>
          <div className={`text-2xl font-black font-mono mt-1 ${magazineFilter === 'FOUNDER TIMEX' ? 'text-[#F5B800]' : 'text-black'}`}>
            {countFounderTimex}
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="p-4 bg-neutral-50 border border-neutral-300 flex flex-col md:flex-row items-stretch md:items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Nominee, Company, Reference, City, Email..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 focus:border-black outline-none font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Magazine Filter */}
        <div className="w-full sm:w-44">
          <select
            value={magazineFilter}
            onChange={(e) => setMagazineFilter(e.target.value)}
            className="w-full px-2.5 py-2 bg-white border border-neutral-300 focus:border-black outline-none font-mono text-xs"
          >
            <option value="ALL">All Magazines</option>
            <option value="30 UNDER 30">30 Under 30</option>
            <option value="FOUNDER TIMEX">Founder Timex</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-2 bg-white border border-neutral-300 focus:border-black outline-none font-mono text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="UNDER REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-full sm:w-40 flex items-center bg-white border border-neutral-300 px-2 py-1">
          <Calendar className="w-3 h-3 text-neutral-400 shrink-0 mr-1" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full outline-none font-mono text-xs bg-transparent"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="text-neutral-400 hover:text-black ml-1">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Clear Filters */}
        {(searchQuery || magazineFilter !== 'ALL' || statusFilter !== 'ALL' || dateFilter) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setMagazineFilter('ALL');
              setStatusFilter('ALL');
              setDateFilter('');
            }}
            className="text-xs font-mono text-neutral-500 hover:text-black underline px-1 shrink-0"
          >
            Reset
          </button>
        )}
      </div>

      {/* NOMINATIONS TABLE */}
      <div className="border border-neutral-300 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-900 text-white font-mono uppercase tracking-wider text-[11px] border-b border-black">
                <th className="py-3 px-3.5">Reference</th>
                <th className="py-3 px-3.5">Nominee</th>
                <th className="py-3 px-3.5">Company</th>
                <th className="py-3 px-3.5">Magazine</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#DF9E00]" />
                    <span>Loading nominations from Supabase...</span>
                  </td>
                </tr>
              ) : filteredNominations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 font-serif">
                    <Award className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <div className="text-sm font-bold text-neutral-700">No nominations found</div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {searchQuery || magazineFilter !== 'ALL' || statusFilter !== 'ALL'
                        ? 'Try clearing the active search or filters.'
                        : 'Submissions from https://founderbytes.in/nominations will appear here in real-time.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredNominations.map((n) => {
                  const statusStyle = STATUS_COLORS[n.status] || STATUS_COLORS.NEW;
                  return (
                    <tr key={n.id} className="hover:bg-neutral-50 transition-colors">
                      {/* Reference */}
                      <td className="py-3 px-3.5 font-mono whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-black">{n.reference_number}</span>
                          <button
                            onClick={() => handleCopy(n.reference_number)}
                            className="text-neutral-400 hover:text-black p-0.5"
                            title="Copy reference number"
                          >
                            {copiedRef === n.reference_number ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {n.nomination_type}
                        </div>
                      </td>

                      {/* Nominee */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          {n.profile_photo_url ? (
                            <img
                              src={n.profile_photo_url}
                              alt={n.full_name}
                              className="w-8 h-8 rounded-full object-cover border border-neutral-300 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 font-bold text-neutral-600">
                              {n.full_name.slice(0, 1)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-neutral-900 truncate">{n.full_name}</div>
                            <div className="text-[11px] text-neutral-500 font-mono truncate">{n.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-neutral-900">{n.company_name}</div>
                        <div className="text-[11px] text-neutral-500 truncate">{n.designation} · {n.city}</div>
                      </td>

                      {/* Magazine */}
                      <td className="py-3 px-3.5 font-mono whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          n.magazine === '30 UNDER 30'
                            ? 'bg-black text-[#F5B800]'
                            : 'bg-neutral-800 text-white'
                        }`}>
                          {n.magazine}
                        </span>
                      </td>

                      {/* Status with Quick Dropdown */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <select
                          value={n.status}
                          onChange={(e) => handleStatusChange(n, e.target.value as NominationStatus)}
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 border outline-none cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="UNDER REVIEW">UNDER REVIEW</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value="SELECTED">SELECTED</option>
                          <option value="REJECTED">REJECTED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                        {n.admin_notes && (
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-[140px]" title={n.admin_notes}>
                            Note: {n.admin_notes}
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                        {n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingNomination(n)}
                            className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 transition-colors"
                            title="View Full Profile Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(n)}
                            className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 transition-colors"
                            title="Edit Nomination Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenNotes(n)}
                            className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 transition-colors"
                            title="Add or Edit Admin Notes"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchive(n)}
                            className="p-1.5 bg-neutral-100 hover:bg-red-600 hover:text-white text-neutral-700 transition-colors"
                            title="Archive Nomination"
                          >
                            <Archive className="w-3.5 h-3.5" />
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

      {/* ================= FULL NOMINEE DOSSIER MODAL ================= */}
      {viewingNomination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-black max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-neutral-900 text-white flex items-center justify-between border-b-2 border-[#F5B800] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5B800] text-black font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#F5B800] uppercase tracking-wider font-bold">
                    NOMINATION DOSSIER · {viewingNomination.reference_number}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase font-serif tracking-tight">
                    {viewingNomination.full_name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setViewingNomination(null)}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
              {/* Header card with photo & status */}
              <div className="flex flex-col sm:flex-row gap-5 p-4 bg-neutral-50 border border-neutral-300">
                {viewingNomination.profile_photo_url ? (
                  <img
                    src={viewingNomination.profile_photo_url}
                    alt={viewingNomination.full_name}
                    className="w-24 h-24 object-cover border-2 border-black bg-neutral-200 shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-neutral-300 border-2 border-black flex items-center justify-center text-xl font-bold font-mono">
                    {viewingNomination.full_name.slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-black uppercase font-serif">
                      {viewingNomination.full_name}
                    </span>
                    <span className="px-2 py-0.5 bg-black text-[#F5B800] text-[10px] font-mono uppercase font-bold">
                      {viewingNomination.magazine}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 text-[10px] font-mono uppercase font-bold">
                      Type: {viewingNomination.nomination_type}
                    </span>
                  </div>

                  <div className="text-neutral-700 font-bold">
                    {viewingNomination.designation} · {viewingNomination.company_name}
                  </div>

                  <div className="text-neutral-500 font-mono text-[11px] pt-1 space-x-3">
                    <span>Email: {viewingNomination.email}</span>
                    <span>·</span>
                    <span>Phone: {viewingNomination.phone}</span>
                    <span>·</span>
                    <span>Location: {viewingNomination.city}, {viewingNomination.state_country}</span>
                  </div>

                  {/* Links */}
                  <div className="pt-2 flex items-center gap-3 font-mono text-[11px]">
                    {viewingNomination.linkedin && (
                      <a
                        href={viewingNomination.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {viewingNomination.company_website && (
                      <a
                        href={viewingNomination.company_website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-800 hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {viewingNomination.personal_website && (
                      <a
                        href={viewingNomination.personal_website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-800 hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>Portfolio</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update Bar inside Modal */}
              <div className="p-3 bg-neutral-100 border border-neutral-300 flex items-center justify-between gap-4 font-mono">
                <span className="text-[11px] font-bold text-neutral-700 uppercase">CHANGE EDITORIAL STATUS:</span>
                <div className="flex items-center gap-2">
                  <select
                    value={viewingNomination.status}
                    onChange={(e) => handleStatusChange(viewingNomination, e.target.value as NominationStatus)}
                    className="px-3 py-1.5 bg-white border border-neutral-400 font-bold text-xs uppercase outline-none cursor-pointer"
                  >
                    <option value="NEW">NEW</option>
                    <option value="UNDER REVIEW">UNDER REVIEW</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="SELECTED">SELECTED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              {/* Business Overview */}
              <div className="border border-neutral-300 p-4 space-y-3">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#DF9E00] border-b border-neutral-200 pb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>VENTURE DETAILS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                  <div>
                    <span className="text-neutral-500 block">INDUSTRY:</span>
                    <span className="font-bold text-black">{viewingNomination.industry || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">YEAR FOUNDED:</span>
                    <span className="font-bold text-black">{viewingNomination.year_founded || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">STAGE:</span>
                    <span className="font-bold text-black">{viewingNomination.company_stage || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">TEAM SIZE:</span>
                    <span className="font-bold text-black">{viewingNomination.team_size || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Capital & Funding */}
              <div className="border border-neutral-300 p-4 space-y-3">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#DF9E00] border-b border-neutral-200 pb-1.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>CAPITAL & INVESTORS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                  <div>
                    <span className="text-neutral-500 block">FUNDING STATUS:</span>
                    <span className="font-bold text-black">{viewingNomination.funding_status || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">ROUND:</span>
                    <span className="font-bold text-black">{viewingNomination.funding_stage || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">TOTAL RAISED:</span>
                    <span className="font-bold text-black">{viewingNomination.total_funding || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">INVESTORS:</span>
                    <span className="font-bold text-black">{viewingNomination.key_investors || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Editorial Stories */}
              <div className="border border-neutral-300 p-4 space-y-4">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#DF9E00] border-b border-neutral-200 pb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>EDITORIAL NARRATIVE & IMPACT</span>
                </div>

                <div>
                  <div className="font-mono text-[11px] font-bold text-neutral-500 uppercase mb-1">
                    ABOUT THE NOMINEE:
                  </div>
                  <p className="text-neutral-800 leading-relaxed font-serif bg-neutral-50 p-3 border border-neutral-200">
                    {viewingNomination.story_nominee}
                  </p>
                </div>

                <div>
                  <div className="font-mono text-[11px] font-bold text-neutral-500 uppercase mb-1">
                    WHAT MAKES THEM STAND OUT:
                  </div>
                  <p className="text-neutral-800 leading-relaxed font-serif bg-neutral-50 p-3 border border-neutral-200">
                    {viewingNomination.standout_reason}
                  </p>
                </div>

                <div>
                  <div className="font-mono text-[11px] font-bold text-neutral-500 uppercase mb-1">
                    KEY ACHIEVEMENTS:
                  </div>
                  <p className="text-neutral-800 leading-relaxed font-serif bg-neutral-50 p-3 border border-neutral-200">
                    {viewingNomination.key_achievements}
                  </p>
                </div>

                <div>
                  <div className="font-mono text-[11px] font-bold text-neutral-500 uppercase mb-1">
                    BIGGEST IMPACT / ACHIEVEMENT:
                  </div>
                  <p className="text-neutral-800 leading-relaxed font-serif bg-neutral-50 p-3 border border-neutral-200">
                    {viewingNomination.biggest_impact}
                  </p>
                </div>

                <div>
                  <div className="font-mono text-[11px] font-bold text-neutral-500 uppercase mb-1">
                    WHY FOUNDER BYTES SHOULD FEATURE THEM:
                  </div>
                  <p className="text-neutral-800 leading-relaxed font-serif bg-amber-50/40 p-3 border border-amber-200">
                    {viewingNomination.feature_reason}
                  </p>
                </div>
              </div>

              {/* Supporting Assets */}
              <div className="border border-neutral-300 p-4 space-y-3">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#DF9E00] border-b border-neutral-200 pb-1.5">
                  ATTACHED FILES & LINKS
                </div>
                <div className="flex flex-wrap gap-3">
                  {viewingNomination.profile_photo_url && (
                    <a
                      href={viewingNomination.profile_photo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-mono text-xs flex items-center gap-1.5 font-bold"
                    >
                      <span>View Profile Photo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {viewingNomination.supporting_docs_url && (
                    <a
                      href={viewingNomination.supporting_docs_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-mono text-xs flex items-center gap-1.5 font-bold"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-700" />
                      <span>Download Supporting Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {viewingNomination.press_portfolio_url && (
                    <a
                      href={viewingNomination.press_portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-mono text-xs flex items-center gap-1.5 font-bold"
                    >
                      <span>Press / Portfolio Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Nominator Details if applicable */}
              {viewingNomination.nomination_type === 'Someone Else' && (
                <div className="border border-neutral-300 p-4 bg-neutral-50 space-y-2 font-mono text-[11px]">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-1">
                    NOMINATED BY THIRD PARTY
                  </div>
                  <div>Nominator Name: <strong>{viewingNomination.nominator_name}</strong></div>
                  <div>Nominator Email: <strong>{viewingNomination.nominator_email}</strong></div>
                  <div>Relationship: <strong>{viewingNomination.nominator_relationship}</strong></div>
                  <div className="pt-1">
                    <span className="text-neutral-500">Nominator Reason:</span>
                    <p className="font-serif italic text-neutral-800 mt-0.5">{viewingNomination.nominator_reason}</p>
                  </div>
                </div>
              )}

              {/* Admin Notes Section */}
              <div className="border border-neutral-300 p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                    ADMIN NOTES
                  </span>
                  <button
                    onClick={() => handleOpenNotes(viewingNomination)}
                    className="text-xs font-mono text-[#DF9E00] hover:underline font-bold"
                  >
                    Edit Notes
                  </button>
                </div>
                <p className="font-mono text-xs text-neutral-700 whitespace-pre-wrap bg-neutral-50 p-2.5 border border-neutral-200 min-h-[50px]">
                  {viewingNomination.admin_notes || 'No notes added yet.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-100 border-t border-neutral-300 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-neutral-500">
                Submitted on {viewingNomination.created_at ? new Date(viewingNomination.created_at).toLocaleString() : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(viewingNomination);
                    setViewingNomination(null);
                  }}
                  className="px-4 py-2 bg-[#F5B800] text-black font-mono text-xs font-bold uppercase hover:bg-neutral-900 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => setViewingNomination(null)}
                  className="px-5 py-2 bg-black text-white font-mono text-xs font-bold uppercase hover:bg-neutral-800"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT ADMIN NOTES MODAL ================= */}
      {editingNotesNomination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-black uppercase font-mono">
                ADMIN NOTES · {editingNotesNomination.full_name}
              </h3>
              <button onClick={() => setEditingNotesNomination(null)} className="text-neutral-500 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-600 mb-1">
                Internal Editorial Assessment & Evaluation Notes:
              </label>
              <textarea
                rows={5}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Add editorial notes, interview scheduling details, background check remarks..."
                className="w-full p-3 border border-neutral-300 focus:border-black outline-none font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingNotesNomination(null)}
                className="px-4 py-2 border border-neutral-300 font-mono text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-5 py-2 bg-black text-white font-mono text-xs font-bold uppercase hover:bg-[#F5B800] hover:text-black transition-colors"
              >
                {isSavingNotes ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT NOMINATION DETAILS MODAL ================= */}
      {editingNomination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-black max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fadeIn">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between border-b-2 border-[#F5B800] shrink-0">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#F5B800]" />
                <h3 className="text-base font-black uppercase font-mono">
                  EDIT NOMINATION · {editingNomination.reference_number}
                </h3>
              </div>
              <button onClick={() => setEditingNomination(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editingNomination.full_name}
                    onChange={(e) => setEditingNomination({ ...editingNomination, full_name: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={editingNomination.email}
                    onChange={(e) => setEditingNomination({ ...editingNomination, email: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    value={editingNomination.phone}
                    onChange={(e) => setEditingNomination({ ...editingNomination, phone: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={editingNomination.city}
                    onChange={(e) => setEditingNomination({ ...editingNomination, city: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Company / Startup Name *</label>
                  <input
                    type="text"
                    value={editingNomination.company_name}
                    onChange={(e) => setEditingNomination({ ...editingNomination, company_name: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    value={editingNomination.designation}
                    onChange={(e) => setEditingNomination({ ...editingNomination, designation: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Industry *</label>
                  <input
                    type="text"
                    value={editingNomination.industry}
                    onChange={(e) => setEditingNomination({ ...editingNomination, industry: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Magazine *</label>
                  <select
                    value={editingNomination.magazine}
                    onChange={(e) => setEditingNomination({ ...editingNomination, magazine: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-mono text-xs focus:border-black outline-none"
                  >
                    <option value="30 UNDER 30">30 UNDER 30</option>
                    <option value="FOUNDER TIMEX">FOUNDER TIMEX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Status</label>
                  <select
                    value={editingNomination.status}
                    onChange={(e) => setEditingNomination({ ...editingNomination, status: e.target.value as NominationStatus })}
                    className="w-full p-2 border border-neutral-300 font-mono text-xs focus:border-black outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="UNDER REVIEW">UNDER REVIEW</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="SELECTED">SELECTED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Company Website</label>
                  <input
                    type="text"
                    value={editingNomination.company_website || ''}
                    onChange={(e) => setEditingNomination({ ...editingNomination, company_website: e.target.value })}
                    className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Story / About Nominee</label>
                <textarea
                  rows={3}
                  value={editingNomination.story_nominee || ''}
                  onChange={(e) => setEditingNomination({ ...editingNomination, story_nominee: e.target.value })}
                  className="w-full p-2 border border-neutral-300 font-sans text-xs focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 mb-1">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={editingNomination.admin_notes || ''}
                  onChange={(e) => setEditingNomination({ ...editingNomination, admin_notes: e.target.value })}
                  className="w-full p-2 border border-neutral-300 font-mono text-xs focus:border-black outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-neutral-100 border-t border-neutral-300 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditingNomination(null)}
                className="px-4 py-2 border border-neutral-300 font-mono text-xs uppercase hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="px-5 py-2 bg-black text-white font-mono text-xs font-bold uppercase hover:bg-[#F5B800] hover:text-black transition-colors"
              >
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
