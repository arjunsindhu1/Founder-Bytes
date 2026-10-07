import React, { useState, useEffect, useRef } from 'react';
import { SEOHead } from './SEOHead';
import { ContentService } from '../services/contentService';
import { MagazineNomination, NominationType } from '../types/cms';
import { 
  Award, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Loader2,
  Building,
  User,
  TrendingUp,
  ShieldCheck,
  Send
} from 'lucide-react';

interface MagazineNominationsPageProps {
  onNavigateHome: () => void;
  onNavigateMagazine?: () => void;
}

export const MagazineNominationsPage: React.FC<MagazineNominationsPageProps> = ({
  onNavigateHome,
  onNavigateMagazine,
}) => {
  // Magazine options from database
  const [magazineOptions, setMagazineOptions] = useState<string[]>(['30 UNDER 30', 'FOUNDER TIMEX']);
  const [selectedMagazine, setSelectedMagazine] = useState<string>('30 UNDER 30');

  // Nomination Type
  const [nominationType, setNominationType] = useState<NominationType>('Myself');

  // Nominee Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [stateCountry, setStateCountry] = useState('India');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [personalWebsite, setPersonalWebsite] = useState('');

  // Business Details
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [designation, setDesignation] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearFounded, setYearFounded] = useState('');
  const [companyStage, setCompanyStage] = useState('');
  const [teamSize, setTeamSize] = useState('');

  // Story & Impact
  const [storyNominee, setStoryNominee] = useState('');
  const [standoutReason, setStandoutReason] = useState('');
  const [keyAchievements, setKeyAchievements] = useState('');
  const [biggestImpact, setBiggestImpact] = useState('');

  // Funding Details
  const [fundingStatus, setFundingStatus] = useState('');
  const [fundingStage, setFundingStage] = useState('');
  const [totalFunding, setTotalFunding] = useState('');
  const [keyInvestors, setKeyInvestors] = useState('');

  // Nomination Reason
  const [featureReason, setFeatureReason] = useState('');

  // Supporting Files
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [profilePhotoName, setProfilePhotoName] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [supportingDocsUrl, setSupportingDocsUrl] = useState('');
  const [supportingDocsName, setSupportingDocsName] = useState('');
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  const [pressPortfolioUrl, setPressPortfolioUrl] = useState('');

  // If "Someone Else"
  const [nominatorName, setNominatorName] = useState('');
  const [nominatorEmail, setNominatorEmail] = useState('');
  const [nominatorRelationship, setNominatorRelationship] = useState('');
  const [nominatorReason, setNominatorReason] = useState('');

  // Declarations
  const [declarationAccurate, setDeclarationAccurate] = useState(false);
  const [declarationNoGuarantee, setDeclarationNoGuarantee] = useState(false);
  const [declarationContactConsent, setDeclarationContactConsent] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedNomination, setSubmittedNomination] = useState<MagazineNomination | null>(null);
  const [hasCopiedRef, setHasCopiedRef] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const docsInputRef = useRef<HTMLInputElement>(null);

  // Load dynamic magazine options on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadOptions = async () => {
      try {
        const options = await ContentService.getMagazineOptions();
        if (options && options.length > 0) {
          setMagazineOptions(options);
          if (!options.includes(selectedMagazine)) {
            setSelectedMagazine(options[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load magazine options:', err);
      }
    };
    loadOptions();
  }, []);

  // Handle Profile Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);

    // Validate type (JPG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Invalid format. Profile photo must be a JPG, PNG, or WEBP image.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const url = await ContentService.uploadNominationFile(file, true);
      setProfilePhotoUrl(url);
      setProfilePhotoName(file.name);
    } catch (err: any) {
      setPhotoError(err?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle Supporting Documents Upload
  const handleDocsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocsError(null);

    // Validate type (PDF, JPG, PNG, WEBP)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setDocsError('Invalid format. Supporting document must be a PDF, JPG, PNG, or WEBP file.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setDocsError('File size exceeds 10MB limit. Please choose a smaller document.');
      return;
    }

    try {
      setIsUploadingDocs(true);
      const url = await ContentService.uploadNominationFile(file, false);
      setSupportingDocsUrl(url);
      setSupportingDocsName(file.name);
    } catch (err: any) {
      setDocsError(err?.message || 'Failed to upload document. Please try again.');
    } finally {
      setIsUploadingDocs(false);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isSubmitting) return;

    // Validation
    if (!selectedMagazine) {
      setFormError('Please select a magazine.');
      return;
    }
    if (!fullName.trim()) {
      setFormError('Nominee full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('A valid nominee email address is required.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Nominee contact phone number is required.');
      return;
    }
    if (!city.trim()) {
      setFormError('City is required.');
      return;
    }
    if (!stateCountry.trim()) {
      setFormError('State / Country is required.');
      return;
    }
    if (!companyName.trim()) {
      setFormError('Company or Startup name is required.');
      return;
    }
    if (!designation.trim()) {
      setFormError('Designation is required.');
      return;
    }
    if (!industry.trim()) {
      setFormError('Industry is required.');
      return;
    }
    if (!storyNominee.trim()) {
      setFormError('Please tell us about the nominee.');
      return;
    }
    if (!standoutReason.trim()) {
      setFormError('Please explain what makes the nominee stand out.');
      return;
    }
    if (!keyAchievements.trim()) {
      setFormError('Please provide key achievements.');
      return;
    }
    if (!biggestImpact.trim()) {
      setFormError('Please detail the nominee’s biggest impact/achievement.');
      return;
    }
    if (!featureReason.trim()) {
      setFormError('Please specify why Founder Bytes should feature them.');
      return;
    }
    if (!profilePhotoUrl) {
      setFormError('Profile photo is required. Please upload a clear photo.');
      return;
    }

    // Someone else validation
    if (nominationType === 'Someone Else') {
      if (!nominatorName.trim()) {
        setFormError('Nominator name is required when nominating someone else.');
        return;
      }
      if (!nominatorEmail.trim() || !nominatorEmail.includes('@')) {
        setFormError('A valid nominator email address is required.');
        return;
      }
      if (!nominatorRelationship.trim()) {
        setFormError('Please specify your relationship to the nominee.');
        return;
      }
      if (!nominatorReason.trim()) {
        setFormError('Please provide your reason for nominating them.');
        return;
      }
    }

    // Declarations validation
    if (!declarationAccurate || !declarationNoGuarantee || !declarationContactConsent) {
      setFormError('Please acknowledge and agree to all 3 required declarations before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        magazine: selectedMagazine,
        nomination_type: nominationType,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state_country: stateCountry.trim(),
        linkedin: linkedin.trim() || undefined,
        instagram: instagram.trim() || undefined,
        personal_website: personalWebsite.trim() || undefined,
        company_name: companyName.trim(),
        company_website: companyWebsite.trim() || undefined,
        designation: designation.trim(),
        industry: industry.trim(),
        year_founded: yearFounded.trim() || undefined,
        company_stage: companyStage.trim() || undefined,
        team_size: teamSize.trim() || undefined,
        story_nominee: storyNominee.trim(),
        standout_reason: standoutReason.trim(),
        key_achievements: keyAchievements.trim(),
        biggest_impact: biggestImpact.trim(),
        funding_status: fundingStatus.trim() || undefined,
        funding_stage: fundingStage.trim() || undefined,
        total_funding: totalFunding.trim() || undefined,
        key_investors: keyInvestors.trim() || undefined,
        feature_reason: featureReason.trim(),
        profile_photo_url: profilePhotoUrl,
        supporting_docs_url: supportingDocsUrl || undefined,
        press_portfolio_url: pressPortfolioUrl.trim() || undefined,
        nominator_name: nominationType === 'Someone Else' ? nominatorName.trim() : undefined,
        nominator_email: nominationType === 'Someone Else' ? nominatorEmail.trim() : undefined,
        nominator_relationship: nominationType === 'Someone Else' ? nominatorRelationship.trim() : undefined,
        nominator_reason: nominationType === 'Someone Else' ? nominatorReason.trim() : undefined,
        declaration_accurate: declarationAccurate,
        declaration_no_guarantee: declarationNoGuarantee,
        declaration_contact_consent: declarationContactConsent,
      };

      const result = await ContentService.submitNomination(payload);
      setSubmittedNomination(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setFormError(err?.message || 'Failed to submit nomination. Please verify your information and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (submittedNomination?.reference_number) {
      navigator.clipboard.writeText(submittedNomination.reference_number);
      setHasCopiedRef(true);
      setTimeout(() => setHasCopiedRef(false), 2500);
    }
  };

  const handleResetForm = () => {
    setSubmittedNomination(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setCity('');
    setLinkedin('');
    setInstagram('');
    setPersonalWebsite('');
    setCompanyName('');
    setCompanyWebsite('');
    setDesignation('');
    setIndustry('');
    setYearFounded('');
    setCompanyStage('');
    setTeamSize('');
    setStoryNominee('');
    setStandoutReason('');
    setKeyAchievements('');
    setBiggestImpact('');
    setFundingStatus('');
    setFundingStage('');
    setTotalFunding('');
    setKeyInvestors('');
    setFeatureReason('');
    setProfilePhotoUrl('');
    setProfilePhotoName('');
    setSupportingDocsUrl('');
    setSupportingDocsName('');
    setPressPortfolioUrl('');
    setNominatorName('');
    setNominatorEmail('');
    setNominatorRelationship('');
    setNominatorReason('');
    setDeclarationAccurate(false);
    setDeclarationNoGuarantee(false);
    setDeclarationContactConsent(false);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-w-full min-h-screen bg-white text-neutral-900 font-sans pb-20">
      <SEOHead
        title="Magazine Nominations | Founder Bytes"
        description="Nominate yourself or an exceptional entrepreneur for Founder Bytes 30 Under 30 and Founder Timex magazine editions. Celebrate visionary Indian startup leaders."
        canonicalUrl="https://founderbytes.in/nominations"
      />

      {/* TOP HEADER BANNER */}
      <div className="w-full bg-[#111111] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F5B800]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6 uppercase tracking-wider">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#F5B800] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>HOME</span>
            </button>
            <span>/</span>
            {onNavigateMagazine && (
              <>
                <button
                  onClick={onNavigateMagazine}
                  className="hover:text-[#F5B800] transition-colors"
                >
                  MAGAZINE
                </button>
                <span>/</span>
              </>
            )}
            <span className="text-[#F5B800] font-bold">NOMINATIONS</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F5B800] text-black font-black">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-800 text-[#F5B800] text-[10px] font-mono uppercase tracking-widest font-bold mb-2">
                <span>FOUNDER BYTES EDITORIAL AWARDS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif leading-none">
                MAGAZINE NOMINATIONS
              </h1>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 font-serif leading-relaxed max-w-2xl">
                Nominate yourself or someone who deserves to be featured in Founder Bytes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* ================= SUCCESS CONFIRMATION SCREEN ================= */}
        {submittedNomination ? (
          <div className="bg-neutral-50 border-2 border-black p-8 sm:p-12 text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5B800] text-black mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-1">
              FOUNDER BYTES EDITORIAL BOARD
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-serif text-neutral-900 mb-2">
              NOMINATION RECEIVED
            </h2>
            <p className="text-sm font-serif text-neutral-600 max-w-xl mx-auto mb-8">
              Thank you for submitting your nomination for the <strong>{submittedNomination.magazine}</strong> edition. 
              Our editorial scrutiny board is currently cataloging your materials.
            </p>

            {/* Reference Box */}
            <div className="bg-white border-2 border-neutral-900 p-6 max-w-md mx-auto mb-8 text-center shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                OFFICIAL REFERENCE NUMBER
              </span>
              <div className="font-mono text-xl sm:text-2xl font-black text-black tracking-wider py-1 selection:bg-[#F5B800]">
                {submittedNomination.reference_number}
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-1 mb-4">
                Please save this reference number for all future editorial correspondence.
              </p>
              <button
                type="button"
                onClick={handleCopyReference}
                className="w-full py-2.5 px-4 bg-black text-white hover:bg-[#DF9E00] hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
              >
                {hasCopiedRef ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY REFERENCE NUMBER</span>
                  </>
                )}
              </button>
            </div>

            {/* Summary Highlights */}
            <div className="bg-white border border-neutral-300 p-6 max-w-xl mx-auto text-left mb-8 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">NOMINEE:</span>
                <span className="font-bold text-black">{submittedNomination.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">COMPANY:</span>
                <span className="font-bold text-black">{submittedNomination.company_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">MAGAZINE:</span>
                <span className="font-bold text-[#DF9E00]">{submittedNomination.magazine}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">NOMINATION TYPE:</span>
                <span className="font-bold text-black">{submittedNomination.nomination_type}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">STATUS:</span>
                <span className="font-bold bg-neutral-900 text-[#F5B800] px-2 py-0.5">{submittedNomination.status}</span>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-3 border-2 border-neutral-900 font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
              >
                Submit Another Nomination
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#F5B800] hover:text-black transition-colors"
              >
                Return to Founder Bytes
              </button>
            </div>
          </div>
        ) : (
          /* ================= MAIN NOMINATION FORM ================= */
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Form Error Banner */}
            {formError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-xs font-mono flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <div className="font-bold uppercase tracking-wider mb-0.5">Submission Error</div>
                  <div>{formError}</div>
                </div>
              </div>
            )}

            {/* 1. SELECT MAGAZINE (REQUIRED) */}
            <div className="bg-neutral-50 border-2 border-black p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2 text-[#DF9E00]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold">
                  STEP 1 · SELECT PUBLICATION
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-serif text-black mb-4">
                SELECT MAGAZINE *
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {magazineOptions.map((mag) => {
                  const isSelected = selectedMagazine === mag;
                  return (
                    <button
                      key={mag}
                      type="button"
                      onClick={() => setSelectedMagazine(mag)}
                      className={`text-left p-5 border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                          : 'border-neutral-300 bg-neutral-100 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 ${
                          isSelected ? 'bg-[#F5B800] text-black' : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          EDITORIAL LIST
                        </span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-black bg-black' : 'border-neutral-400 bg-white'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#F5B800]" />}
                        </div>
                      </div>
                      <div className="text-lg font-black uppercase font-serif tracking-tight text-neutral-900">
                        {mag}
                      </div>
                      <p className="text-[11px] font-serif text-neutral-600 mt-1">
                        {mag === '30 UNDER 30'
                          ? 'Honoring trailblazing founders and innovators under the age of 30 across India.'
                          : 'Recognizing timeless, visionary leaders shaping India’s enterprise and industrial frontier.'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. NOMINATION TYPE */}
            <div className="border border-neutral-300 p-6 sm:p-8 bg-white">
              <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-1">
                STEP 2 · APPLICANT CLASSIFICATION
              </div>
              <label className="block text-sm font-black uppercase tracking-tight text-neutral-900 mb-3 font-mono">
                NOMINATION TYPE *
              </label>

              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() => setNominationType('Myself')}
                  className={`py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all text-center ${
                    nominationType === 'Myself'
                      ? 'border-black bg-black text-[#F5B800]'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                  }`}
                >
                  Myself
                </button>
                <button
                  type="button"
                  onClick={() => setNominationType('Someone Else')}
                  className={`py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all text-center ${
                    nominationType === 'Someone Else'
                      ? 'border-black bg-black text-[#F5B800]'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                  }`}
                >
                  Someone Else
                </button>
              </div>
            </div>

            {/* 3. NOMINEE INFORMATION */}
            <div className="border border-neutral-300 p-6 sm:p-8 bg-white space-y-6">
              <div className="border-b border-neutral-200 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#DF9E00]" />
                <h3 className="text-base font-black uppercase tracking-tight font-mono text-neutral-900">
                  NOMINEE INFORMATION
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@startup.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Mumbai, Delhi NCR"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    State / Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateCountry}
                    onChange={(e) => setStateCountry(e.target.value)}
                    placeholder="e.g. Karnataka, India"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Instagram Handle / URL
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@username or URL"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Personal Website
                  </label>
                  <input
                    type="url"
                    value={personalWebsite}
                    onChange={(e) => setPersonalWebsite(e.target.value)}
                    placeholder="https://personalwebsite.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 4. BUSINESS & VENTURE DETAILS */}
            <div className="border border-neutral-300 p-6 sm:p-8 bg-white space-y-6">
              <div className="border-b border-neutral-200 pb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#DF9E00]" />
                <h3 className="text-base font-black uppercase tracking-tight font-mono text-neutral-900">
                  BUSINESS & STARTUP INFORMATION
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Company / Startup Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Atherix Technologies"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Co-Founder & CEO"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Industry / Sector *
                  </label>
                  <select
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors font-sans"
                  >
                    <option value="">Select Primary Industry</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    <option value="Fintech & Insurtech">Fintech & Insurtech</option>
                    <option value="Edtech">Edtech</option>
                    <option value="Healthtech & Medtech">Healthtech & Medtech</option>
                    <option value="Enterprise SaaS">Enterprise SaaS</option>
                    <option value="Deeptech & Quantum">Deeptech & Quantum</option>
                    <option value="Climate & Clean Energy">Climate & Clean Energy</option>
                    <option value="E-Commerce & D2C">E-Commerce & D2C</option>
                    <option value="Consumer Tech">Consumer Tech</option>
                    <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                    <option value="Manufacturing & Hardware">Manufacturing & Hardware</option>
                    <option value="Agritech">Agritech</option>
                    <option value="SpaceTech & Defense">SpaceTech & Defense</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Year Founded
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max="2030"
                    value={yearFounded}
                    onChange={(e) => setYearFounded(e.target.value)}
                    placeholder="e.g. 2023"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Company Stage
                  </label>
                  <select
                    value={companyStage}
                    onChange={(e) => setCompanyStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors font-sans"
                  >
                    <option value="">Select Stage</option>
                    <option value="Idea / Prototype">Idea / Prototype</option>
                    <option value="Bootstrapped & Profitable">Bootstrapped & Profitable</option>
                    <option value="Pre-Seed / Seed">Pre-Seed / Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B+">Series B+</option>
                    <option value="Growth / Pre-IPO">Growth / Pre-IPO</option>
                    <option value="Public / Conglomerate">Public / Conglomerate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Team Size
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors font-sans"
                  >
                    <option value="">Select Team Size</option>
                    <option value="1-5">1 - 5 Team Members</option>
                    <option value="6-20">6 - 20 Team Members</option>
                    <option value="21-50">21 - 50 Team Members</option>
                    <option value="51-200">51 - 200 Team Members</option>
                    <option value="200+">200+ Team Members</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. STORY & IMPACT */}
            <div className="border border-neutral-300 p-6 sm:p-8 bg-white space-y-6">
              <div className="border-b border-neutral-200 pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DF9E00]" />
                <h3 className="text-base font-black uppercase tracking-tight font-mono text-neutral-900">
                  NARRATIVE, STANDOUT FACTORS & IMPACT
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Tell us about the nominee *
                  </label>
                  <p className="text-[11px] font-serif text-neutral-500 mb-2">
                    Provide background, origin story, entrepreneurial conviction, and leadership ethos.
                  </p>
                  <textarea
                    required
                    rows={4}
                    value={storyNominee}
                    onChange={(e) => setStoryNominee(e.target.value)}
                    placeholder="Write a concise overview of the nominee..."
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    What makes them stand out? *
                  </label>
                  <p className="text-[11px] font-serif text-neutral-500 mb-2">
                    Differentiators compared to peers in the sector, proprietary innovation, or exceptional grit.
                  </p>
                  <textarea
                    required
                    rows={3}
                    value={standoutReason}
                    onChange={(e) => setStandoutReason(e.target.value)}
                    placeholder="Highlight what sets this founder or leader apart..."
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Key Achievements *
                  </label>
                  <p className="text-[11px] font-serif text-neutral-500 mb-2">
                    Milestones, awards, patents, scale metrics, or industry recognitions.
                  </p>
                  <textarea
                    required
                    rows={3}
                    value={keyAchievements}
                    onChange={(e) => setKeyAchievements(e.target.value)}
                    placeholder="List verifiable key milestones and accomplishments..."
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Biggest Impact / Achievement *
                  </label>
                  <p className="text-[11px] font-serif text-neutral-500 mb-2">
                    Their single most consequential breakthrough or market contribution.
                  </p>
                  <textarea
                    required
                    rows={3}
                    value={biggestImpact}
                    onChange={(e) => setBiggestImpact(e.target.value)}
                    placeholder="Describe their defining legacy or high-impact achievement..."
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 6. FUNDING & CAPITAL (Optional) */}
            <div className="border border-neutral-300 p-6 sm:p-8 bg-white space-y-6">
              <div className="border-b border-neutral-200 pb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#DF9E00]" />
                <h3 className="text-base font-black uppercase tracking-tight font-mono text-neutral-900">
                  CAPITAL & INVESTMENT PROFILE (OPTIONAL)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Funding Status
                  </label>
                  <select
                    value={fundingStatus}
                    onChange={(e) => setFundingStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors font-sans"
                  >
                    <option value="">Select Funding Status</option>
                    <option value="Bootstrapped">100% Bootstrapped</option>
                    <option value="Seed Funded">Seed Funded</option>
                    <option value="Venture Backed">Venture Backed</option>
                    <option value="Profitable / Cash-Flow Positive">Profitable / Cash-Flow Positive</option>
                    <option value="Currently Raising">Currently Raising</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Funding Stage
                  </label>
                  <input
                    type="text"
                    value={fundingStage}
                    onChange={(e) => setFundingStage(e.target.value)}
                    placeholder="e.g. Series A, Pre-Seed, Angel"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Total Funding Raised
                  </label>
                  <input
                    type="text"
                    value={totalFunding}
                    onChange={(e) => setTotalFunding(e.target.value)}
                    placeholder="e.g. $2.5M USD or ₹15 Crore"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                    Key Investors
                  </label>
                  <input
                    type="text"
                    value={keyInvestors}
                    onChange={(e) => setKeyInvestors(e.target.value)}
                    placeholder="e.g. Peak XV, Blume Ventures, Angels"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 7. WHY FOUNDER BYTES SHOULD FEATURE THEM */}
            <div className="border border-neutral-300 p-6 sm:p-8 bg-white space-y-4">
              <div className="border-b border-neutral-200 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#DF9E00]" />
                <h3 className="text-base font-black uppercase tracking-tight font-mono text-neutral-900">
                  EDITORIAL JUSTIFICATION *
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                  Why should Founder Bytes feature them? *
                </label>
                <p className="text-[11px] font-serif text-neutral-500 mb-2">
                  Articulate why their story matters to the Indian entrepreneurial community and Founder Bytes readers.
                </p>
                <textarea
                  required
                  rows={3}
                  value={featureReason}
                  onChange={(e) => setFeatureReason(e.target.value)}
                  placeholder="Explain why their leadership warrants editorial feature in Founder Bytes..."
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors leading-relaxed"
                />
              </div>
            </div>

            {/* 8. SUPPORTING MATERIALS & UPLOADS */}
            <div className="border border-neutral-300 p-6 sm:p-8 bg-white space-y-6">
              <div className="border-b border-neutral-200 pb-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#DF9E00]" />
                <h3 className="text-base font-black uppercase tracking-tight font-mono text-neutral-900">
                  SUPPORTING ASSETS & VERIFICATION
                </h3>
              </div>

              {/* Profile Photo (Required) */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1">
                  Profile Photo *
                </label>
                <p className="text-[11px] font-serif text-neutral-500 mb-3">
                  High-resolution portrait or headshot. Formats: JPG, PNG, WEBP. Maximum file size: 5MB.
                </p>

                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {profilePhotoUrl ? (
                  <div className="flex items-center gap-4 p-4 border border-neutral-300 bg-neutral-50">
                    <img
                      src={profilePhotoUrl}
                      alt="Uploaded profile photo preview"
                      className="w-16 h-16 object-cover border border-black bg-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono font-bold text-neutral-900 truncate">
                        {profilePhotoName || 'Profile Photo Uploaded'}
                      </div>
                      <div className="text-[11px] font-mono text-green-700 flex items-center gap-1 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Ready for submission</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePhotoUrl('');
                        setProfilePhotoName('');
                      }}
                      className="text-neutral-500 hover:text-red-600 p-1"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                      isUploadingPhoto
                        ? 'border-neutral-400 bg-neutral-50'
                        : 'border-neutral-300 hover:border-black bg-neutral-50/50'
                    }`}
                  >
                    {isUploadingPhoto ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#DF9E00]" />
                        <span className="text-xs font-mono text-neutral-600">Uploading photo...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <ImageIcon className="w-6 h-6 text-neutral-400 mb-1" />
                        <span className="text-xs font-mono font-bold text-neutral-800">
                          Click to upload Profile Photo *
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          JPG, PNG, or WEBP (Max 5MB)
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {photoError && (
                  <p className="text-[11px] font-mono text-red-600 mt-1.5">{photoError}</p>
                )}
              </div>

              {/* Supporting Documents (Optional) */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1">
                  Supporting Documents (Optional)
                </label>
                <p className="text-[11px] font-serif text-neutral-500 mb-3">
                  Pitch deck, credentials, executive bio, or company presentation. Formats: PDF, JPG, PNG. Max: 10MB.
                </p>

                <input
                  type="file"
                  ref={docsInputRef}
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={handleDocsUpload}
                  className="hidden"
                />

                {supportingDocsUrl ? (
                  <div className="flex items-center gap-4 p-4 border border-neutral-300 bg-neutral-50">
                    <div className="w-12 h-12 bg-neutral-200 border border-neutral-400 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-neutral-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono font-bold text-neutral-900 truncate">
                        {supportingDocsName || 'Document Attached'}
                      </div>
                      <div className="text-[11px] font-mono text-green-700 flex items-center gap-1 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Attached to nomination</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSupportingDocsUrl('');
                        setSupportingDocsName('');
                      }}
                      className="text-neutral-500 hover:text-red-600 p-1"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => docsInputRef.current?.click()}
                    className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                      isUploadingDocs
                        ? 'border-neutral-400 bg-neutral-50'
                        : 'border-neutral-300 hover:border-black bg-neutral-50/50'
                    }`}
                  >
                    {isUploadingDocs ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#DF9E00]" />
                        <span className="text-xs font-mono text-neutral-600">Uploading document...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <FileText className="w-6 h-6 text-neutral-400 mb-1" />
                        <span className="text-xs font-mono font-bold text-neutral-800">
                          Attach Supporting Document / Deck (Optional)
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          PDF, JPG, PNG, or WEBP (Max 10MB)
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {docsError && (
                  <p className="text-[11px] font-mono text-red-600 mt-1.5">{docsError}</p>
                )}
              </div>

              {/* Press / Portfolio URL */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                  Press / Portfolio URL (Optional)
                </label>
                <input
                  type="url"
                  value={pressPortfolioUrl}
                  onChange={(e) => setPressPortfolioUrl(e.target.value)}
                  placeholder="https://press-link-or-notion-portfolio.com"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* 9. IF "SOMEONE ELSE" IS SELECTED */}
            {nominationType === 'Someone Else' && (
              <div className="border-2 border-neutral-900 p-6 sm:p-8 bg-neutral-50 space-y-6">
                <div className="border-b border-neutral-300 pb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#DF9E00]" />
                  <h3 className="text-base font-black uppercase tracking-tight font-mono text-neutral-900">
                    NOMINATOR INFORMATION (REQUIRED FOR THIRD-PARTY SUBMISSIONS)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={nominatorName}
                      onChange={(e) => setNominatorName(e.target.value)}
                      placeholder="e.g. Rahul Kapoor"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 focus:border-black text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={nominatorEmail}
                      onChange={(e) => setNominatorEmail(e.target.value)}
                      placeholder="rahul@venturefund.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 focus:border-black text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                      Relationship to Nominee *
                    </label>
                    <select
                      required
                      value={nominatorRelationship}
                      onChange={(e) => setNominatorRelationship(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 focus:border-black text-sm outline-none transition-colors font-sans"
                    >
                      <option value="">Select Relationship</option>
                      <option value="Co-Founder">Co-Founder</option>
                      <option value="Colleague / Team Member">Colleague / Team Member</option>
                      <option value="Investor / Board Member">Investor / Board Member</option>
                      <option value="PR Agency / Publicist">PR Agency / Publicist</option>
                      <option value="Mentor / Advisor">Mentor / Advisor</option>
                      <option value="Friend / Peer">Friend / Peer</option>
                      <option value="Customer / Partner">Customer / Partner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-800 uppercase font-mono mb-1.5">
                      Reason for Nomination *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={nominatorReason}
                      onChange={(e) => setNominatorReason(e.target.value)}
                      placeholder="Why are you nominating this person? Share your direct perspective..."
                      className="w-full p-3 bg-white border border-neutral-300 focus:border-black text-sm outline-none transition-colors leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 10. DECLARATIONS (REQUIRED) */}
            <div className="border border-neutral-300 p-6 sm:p-8 bg-neutral-50 space-y-4">
              <div className="border-b border-neutral-200 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#DF9E00]" />
                <h3 className="text-base font-black uppercase tracking-tight font-mono text-neutral-900">
                  STATUTORY DECLARATIONS & CONSENT *
                </h3>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={declarationAccurate}
                    onChange={(e) => setDeclarationAccurate(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-black rounded-none cursor-pointer"
                  />
                  <span className="text-xs font-serif text-neutral-800 leading-relaxed">
                    I declare that all information and statements provided in this nomination are true, accurate, and verifiable to the best of my knowledge. *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={declarationNoGuarantee}
                    onChange={(e) => setDeclarationNoGuarantee(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-black rounded-none cursor-pointer"
                  />
                  <span className="text-xs font-serif text-neutral-800 leading-relaxed">
                    I understand that submitting a nomination does not guarantee selection, interview, or publication in Founder Bytes magazine editions. Editorial decisions are final. *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={declarationContactConsent}
                    onChange={(e) => setDeclarationContactConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-black rounded-none cursor-pointer"
                  />
                  <span className="text-xs font-serif text-neutral-800 leading-relaxed">
                    I consent to Founder Bytes editorial staff contacting the nominee or nominator via email or telephone for fact-checking, additional materials, or interview scheduling. *
                  </span>
                </label>
              </div>
            </div>

            {/* 11. SUBMISSION BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 bg-neutral-900 hover:bg-[#F5B800] text-white hover:text-black transition-all font-mono text-sm sm:text-base font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#F5B800]" />
                    <span>PROCESSING SUBMISSION...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT NOMINATION</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] font-mono text-neutral-500 mt-3">
                Protected by Founder Bytes Editorial Integrity & Privacy Standards. Duplicate submissions are monitored and filtered.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
