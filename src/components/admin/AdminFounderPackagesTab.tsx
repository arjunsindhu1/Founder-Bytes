import React, { useState, useEffect } from 'react';
import { FounderSpotlightPackage } from '../../types/cms';
import { ContentService } from '../../services/contentService';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  Award, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw,
  Share2,
  BookOpen
} from 'lucide-react';

export const AdminFounderPackagesTab: React.FC = () => {
  const [packages, setPackages] = useState<FounderSpotlightPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<FounderSpotlightPackage | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 25000,
    duration_days: 7,
    homepage_feature: true,
    profile_included: false,
    social_promotion: false,
    magazine_consideration: false,
    is_active: true,
  });

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await ContentService.getSpotlightPackages();
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
    const unsub = ContentService.subscribe(() => {
      loadPackages();
    });
    return () => unsub();
  }, []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleOpenNew = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      description: '',
      price: 50000,
      duration_days: 14,
      homepage_feature: true,
      profile_included: true,
      social_promotion: false,
      magazine_consideration: false,
      is_active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (pkg: FounderSpotlightPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration_days: pkg.duration_days,
      homepage_feature: pkg.homepage_feature,
      profile_included: pkg.profile_included,
      social_promotion: pkg.social_promotion,
      magazine_consideration: pkg.magazine_consideration,
      is_active: pkg.is_active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Package Name is required.');
      return;
    }

    try {
      if (editingPackage) {
        await ContentService.updateSpotlightPackage(editingPackage.id, formData);
        showNotification(`Updated package "${formData.name}".`);
      } else {
        await ContentService.createSpotlightPackage(formData);
        showNotification(`Created package "${formData.name}".`);
      }
      setShowModal(false);
      await loadPackages();
    } catch (err: any) {
      console.error(err);
      alert('Error saving package: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (pkg: FounderSpotlightPackage) => {
    if (!window.confirm(`Are you sure you want to delete package "${pkg.name}"?`)) {
      return;
    }
    try {
      await ContentService.deleteSpotlightPackage(pkg.id);
      showNotification(`Deleted package "${pkg.name}".`);
      await loadPackages();
    } catch (err: any) {
      console.error(err);
      alert('Error deleting package.');
    }
  };

  const handleToggleActive = async (pkg: FounderSpotlightPackage) => {
    try {
      await ContentService.updateSpotlightPackage(pkg.id, { is_active: !pkg.is_active });
      showNotification(`Package "${pkg.name}" is now ${!pkg.is_active ? 'Active' : 'Inactive'}.`);
      await loadPackages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-[#F5B800] px-4 py-3 shadow-xl border border-[#F5B800] font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5B800]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#F5B800]"></span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900 font-serif">
              FOUNDER SPOTLIGHT PACKAGES
            </h1>
            <span className="px-2 py-0.5 bg-neutral-900 text-[#F5B800] text-[10px] font-mono font-bold uppercase tracking-wider">
              PRICING & TIERS
            </span>
          </div>
          <p className="text-xs text-neutral-600 font-serif mt-1">
            Configure commercial pricing, duration, homepage placement, and magazine inclusion for founder features.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPackages}
            className="p-2 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black transition-colors"
            title="Refresh Packages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 bg-black text-[#F5B800] hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`border-2 flex flex-col justify-between p-6 bg-white transition-all ${
              pkg.name === 'SIGNATURE' ? 'border-[#F5B800] shadow-md relative' : 'border-neutral-900 shadow-xs'
            }`}
          >
            {pkg.name === 'SIGNATURE' && (
              <div className="absolute -top-3 right-4 px-2 py-0.5 bg-[#F5B800] text-black font-mono font-bold text-[9px] uppercase tracking-widest">
                PREMIER TIER
              </div>
            )}

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <h3 className="text-xl font-black font-serif text-neutral-900 uppercase">
                  {pkg.name}
                </h3>
                <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                  pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Price Display */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-neutral-900 font-mono">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    / {pkg.duration_days} days
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-serif mt-2 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Feature Matrix Checkmarks */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-200 text-xs font-mono">
                <div className="flex items-center gap-2">
                  {pkg.homepage_feature ? (
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-neutral-300 shrink-0" />
                  )}
                  <span className={pkg.homepage_feature ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                    Homepage Spotlight Placement ({pkg.duration_days} Days)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {pkg.profile_included ? (
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-neutral-300 shrink-0" />
                  )}
                  <span className={pkg.profile_included ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                    Dedicated /founders/[slug] Profile Dossier
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {pkg.social_promotion ? (
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-neutral-300 shrink-0" />
                  )}
                  <span className={pkg.social_promotion ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                    LinkedIn & Multi-Channel Social Amplification
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {pkg.magazine_consideration ? (
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-neutral-300 shrink-0" />
                  )}
                  <span className={pkg.magazine_consideration ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                    Print & Digital Magazine Consideration
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => handleToggleActive(pkg)}
                className="text-[11px] text-neutral-600 hover:text-black underline font-bold"
              >
                {pkg.is_active ? 'Mark Inactive' : 'Activate Plan'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="p-1.5 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black transition-colors"
                  title="Edit Package"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(pkg)}
                  className="p-1.5 border border-neutral-300 hover:border-red-600 text-neutral-700 hover:text-red-600 transition-colors"
                  title="Delete Package"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full border-2 border-black shadow-2xl flex flex-col my-auto">
            <div className="flex items-center justify-between p-4 bg-neutral-900 text-white border-b-2 border-[#F5B800]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider">
                  {editingPackage ? 'EDIT SPOTLIGHT PACKAGE' : 'CREATE SPOTLIGHT PACKAGE'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                  placeholder="e.g. STANDARD, PREMIUM, SIGNATURE"
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed commercial scope and deliverables..."
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Duration in Days *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Inclusions Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <div className="text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Deliverables & Inclusions:
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.homepage_feature}
                    onChange={(e) => setFormData({ ...formData, homepage_feature: e.target.checked })}
                    className="rounded-none border-neutral-400 text-black focus:ring-0"
                  />
                  <span>Homepage Spotlight Card Placement</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.profile_included}
                    onChange={(e) => setFormData({ ...formData, profile_included: e.target.checked })}
                    className="rounded-none border-neutral-400 text-black focus:ring-0"
                  />
                  <span>Dedicated /founders/[slug] Profile Dossier</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.social_promotion}
                    onChange={(e) => setFormData({ ...formData, social_promotion: e.target.checked })}
                    className="rounded-none border-neutral-400 text-black focus:ring-0"
                  />
                  <span>Social Promotion Included</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.magazine_consideration}
                    onChange={(e) => setFormData({ ...formData, magazine_consideration: e.target.checked })}
                    className="rounded-none border-neutral-400 text-black focus:ring-0"
                  />
                  <span>Magazine Editorial Consideration Included</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded-none border-neutral-400 text-black focus:ring-0"
                  />
                  <span className="font-bold text-black">Active Package (Available for selection)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 uppercase font-bold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black text-[#F5B800] hover:bg-neutral-800 uppercase font-bold tracking-wider cursor-pointer"
                >
                  {editingPackage ? 'Save Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
