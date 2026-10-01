import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ContentService } from '../../services/contentService';

interface MediaUploaderProps {
  label: string;
  recommendedWidth: number;
  recommendedHeight: number;
  aspectRatioLabel: string; // e.g. "16:9", "1:1", "2:3", "728:90"
  currentImageUrl?: string;
  bucket?: 'article-images' | 'author-images' | 'magazine-covers' | 'advertisements' | 'site-assets';
  onImageUploaded: (url: string) => void;
  caption?: string;
  onCaptionChange?: (caption: string) => void;
  credit?: string;
  onCreditChange?: (credit: string) => void;
  altText?: string;
  onAltTextChange?: (alt: string) => void;
  allowPdf?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  recommendedWidth,
  recommendedHeight,
  aspectRatioLabel,
  currentImageUrl,
  bucket = 'article-images',
  onImageUploaded,
  caption,
  onCaptionChange,
  credit,
  onCreditChange,
  altText,
  onAltTextChange,
  allowPdf = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [detectedDims, setDetectedDims] = useState<{ width: number; height: number } | null>(null);
  const [aspectRatioMatch, setAspectRatioMatch] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetRatio = recommendedWidth / recommendedHeight;

  const processFile = async (file: File) => {
    setErrorMessage(null);

    const isPdf = file.type === 'application/pdf';
    if (!file.type.startsWith('image/') && (!allowPdf || !isPdf)) {
      setErrorMessage(`Please upload a valid image file (JPEG, PNG, WebP)${allowPdf ? ' or PDF' : ''}.`);
      return;
    }

    if (isPdf) {
      setUploading(true);
      try {
        const result = await ContentService.uploadMedia(file, bucket);
        onImageUploaded(result.url);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to upload PDF file.');
      } finally {
        setUploading(false);
      }
      return;
    }

    // Inspect image dimensions before upload
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      setDetectedDims({ width, height });

      const fileRatio = width / height;
      const ratioDiff = Math.abs(fileRatio - targetRatio);
      // Warning if ratio differs by more than 15%
      const matches = ratioDiff < 0.25;
      setAspectRatioMatch(matches);

      URL.revokeObjectURL(objectUrl);

      // Perform upload to Supabase Storage
      setUploading(true);
      try {
        const result = await ContentService.uploadMedia(file, bucket);
        onImageUploaded(result.url);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Upload failed.');
      } finally {
        setUploading(false);
      }
    };

    img.onerror = () => {
      setErrorMessage('Could not decode image dimensions.');
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">
          {label}
        </label>
        {/* Recommended Dimensions Banner (Prominent & Direct) */}
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-300 text-neutral-800 text-[10px] font-bold">
          <span className="text-[#DF9E00]">RECOMMENDED:</span>
          <span>{recommendedWidth} × {recommendedHeight} px</span>
          <span className="text-neutral-400">·</span>
          <span>{aspectRatioLabel}</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {currentImageUrl ? (
        <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-3">
          <div className="flex items-start gap-4">
            <div className="relative w-36 h-24 bg-neutral-200 border border-neutral-300 shrink-0 overflow-hidden group">
              <img
                src={currentImageUrl}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  onImageUploaded('');
                  setDetectedDims(null);
                  setAspectRatioMatch(null);
                }}
                className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-700 text-white rounded-xs transition-colors"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                  <CheckCircle className="w-3 h-3" />
                  <span>IMAGE READY</span>
                </span>
                {detectedDims && (
                  <span className="text-neutral-500 text-[10px]">
                    Uploaded: {detectedDims.width} × {detectedDims.height} px
                  </span>
                )}
              </div>

              {aspectRatioMatch === false && (
                <div className="text-[10px] text-amber-700 flex items-center gap-1 font-sans">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>Warning: Aspect ratio differs from recommended {aspectRatioLabel}.</span>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-white border border-neutral-300 hover:border-black text-[10px] font-bold uppercase transition-colors"
                >
                  Replace Image
                </button>
                <a
                  href={currentImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-neutral-500 hover:text-black text-[10px] underline transition-colors"
                >
                  View Full Asset
                </a>
              </div>
            </div>
          </div>

          {/* Optional Caption and Credit */}
          {(onCaptionChange || onCreditChange || onAltTextChange) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-200">
              {onCaptionChange && (
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-0.5">Image Caption</label>
                  <input
                    type="text"
                    value={caption || ''}
                    onChange={(e) => onCaptionChange(e.target.value)}
                    placeholder="e.g. Founders reviewing factory telemetry in Bengaluru."
                    className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 text-[11px]"
                  />
                </div>
              )}
              {onCreditChange && (
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-0.5">Photo Credit / Agency</label>
                  <input
                    type="text"
                    value={credit || ''}
                    onChange={(e) => onCreditChange(e.target.value)}
                    placeholder="e.g. Founder Bytes Photography / PTI"
                    className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 text-[11px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-black bg-[#F5B800]/10'
              : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-500'
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#DF9E00]" />
              <span className="text-xs font-bold text-neutral-700">Uploading to Supabase Storage...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-white border border-neutral-300 flex items-center justify-center mb-1 shadow-xs">
                <Upload className="w-5 h-5 text-neutral-700" />
              </div>
              <p className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                Click to Choose Image or Drag & Drop File
              </p>
              <p className="text-[10px] text-neutral-500 font-sans">
                Supports PNG, JPG, WebP up to 10MB · Automatically stored in Supabase
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={allowPdf ? 'image/*,application/pdf' : 'image/*'}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
