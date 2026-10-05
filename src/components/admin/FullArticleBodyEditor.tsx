import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Minus, 
  Undo, 
  Redo, 
  RemoveFormatting, 
  Code, 
  Search, 
  ExternalLink, 
  Check, 
  X, 
  Upload, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { CMSArticle } from '../../types/cms';
import { MediaUploader } from './MediaUploader';
import { analyzeHeadings, countWords, calculateReadingTime } from '../../utils/articleBodyUtils';

interface FullArticleBodyEditorProps {
  value: string;
  onChange: (html: string) => void;
  articleTitle: string;
  allArticles: CMSArticle[];
}

export const FullArticleBodyEditor: React.FC<FullArticleBodyEditorProps> = ({
  value,
  onChange,
  articleTitle,
  allArticles = [],
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [rawHtml, setRawHtml] = useState(value);
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkTab, setLinkTab] = useState<'custom' | 'internal'>('custom');
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);
  const [linkRel, setLinkRel] = useState<'follow' | 'nofollow' | 'sponsored' | 'ugc'>('follow');
  const [internalSearchQuery, setInternalSearchQuery] = useState('');

  // Image Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const [imgCaption, setImgCaption] = useState('');
  const [imgCredit, setImgCredit] = useState('');
  const [imgSourceUrl, setImgSourceUrl] = useState('');
  const [imgAlignment, setImgAlignment] = useState<'center' | 'left' | 'right' | 'full'>('center');
  const [imgWidth, setImgWidth] = useState<'100%' | '75%' | '50%'>('100%');
  const [imgAltError, setImgAltError] = useState(false);

  // Keep internal state in sync if value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    setRawHtml(value);
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange(html);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setRawHtml(newHtml);
    onChange(newHtml);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedRange(sel.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (savedRange) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRange);
      }
    }
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const formatBlock = (tag: string) => {
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, `<${tag}>`);
    handleInput();
  };

  // Open Link Modal
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString().trim() : '';
    setLinkText(selectedText || '');
    setLinkUrl('');
    setLinkTargetBlank(true);
    setLinkRel('follow');
    setLinkTab('custom');
    setIsLinkModalOpen(true);
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    restoreSelection();
    editorRef.current?.focus();

    const cleanUrl = linkUrl.trim();
    const textToInsert = linkText.trim() || cleanUrl;
    const targetAttr = linkTargetBlank ? ' target="_blank"' : '';
    
    // Build rel attributes
    let relAttr = '';
    const relParts: string[] = [];
    if (linkTargetBlank) relParts.push('noopener', 'noreferrer');
    if (linkRel !== 'follow') relParts.push(linkRel);
    if (relParts.length > 0) {
      relAttr = ` rel="${relParts.join(' ')}"`;
    }

    const anchorHtml = `<a href="${cleanUrl}"${targetAttr}${relAttr} class="text-blue-700 underline font-medium hover:text-blue-900">${textToInsert}</a>`;
    document.execCommand('insertHTML', false, anchorHtml);
    handleInput();
    setIsLinkModalOpen(false);
  };

  // Open Image Modal
  const openImageModal = () => {
    saveSelection();
    setImgUrl('');
    setImgAlt('');
    setImgCaption('');
    setImgCredit('');
    setImgSourceUrl('');
    setImgAlignment('center');
    setImgWidth('100%');
    setImgAltError(false);
    setIsImageModalOpen(true);
  };

  const insertImage = () => {
    if (!imgAlt.trim()) {
      setImgAltError(true);
      return;
    }
    if (!imgUrl.trim()) return;

    restoreSelection();
    editorRef.current?.focus();

    let alignClass = 'my-6 mx-auto';
    if (imgAlignment === 'left') alignClass = 'my-4 mr-6 float-left';
    else if (imgAlignment === 'right') alignClass = 'my-4 ml-6 float-right';
    else if (imgAlignment === 'full') alignClass = 'my-8 w-full';

    const captionText = imgCaption.trim();
    const creditText = imgCredit.trim();
    const sourceText = imgSourceUrl.trim();

    let figcaptionHtml = '';
    if (captionText || creditText || sourceText) {
      figcaptionHtml = `
        <figcaption class="text-xs text-neutral-500 font-serif italic mt-2 flex flex-wrap items-center justify-between gap-1">
          ${captionText ? `<span>${captionText}</span>` : '<span></span>'}
          ${creditText || sourceText ? `
            <span class="font-mono text-[10px] not-italic text-neutral-400">
              ${sourceText ? `<a href="${sourceText}" target="_blank" rel="nofollow noopener" class="hover:underline">Photo: ${creditText || 'Source'}</a>` : `Photo: ${creditText}`}
            </span>
          ` : ''}
        </figcaption>
      `;
    }

    const figureHtml = `
      <figure class="${alignClass} max-w-full block clear-both" style="width: ${imgWidth};">
        <img src="${imgUrl}" alt="${imgAlt.replace(/"/g, '&quot;')}" class="w-full h-auto object-cover border border-neutral-200" loading="lazy" />
        ${figcaptionHtml}
      </figure>
      <p></p>
    `;

    document.execCommand('insertHTML', false, figureHtml);
    handleInput();
    setIsImageModalOpen(false);
  };

  // Filter internal articles
  const filteredArticles = allArticles.filter((a) => {
    if (!internalSearchQuery.trim()) return true;
    const q = internalSearchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q) || a.author_name.toLowerCase().includes(q);
  });

  const headingAnalysis = analyzeHeadings(rawHtml);
  const words = countWords(rawHtml);
  const readTime = calculateReadingTime(rawHtml);

  return (
    <div className="w-full bg-white border border-neutral-300 font-sans">
      {/* 1. Main Rich Text Editor Toolbar */}
      <div className="p-2 bg-neutral-100 border-b border-neutral-300 flex flex-wrap items-center gap-1 text-xs select-none sticky top-0 z-10">
        {/* Paragraph & Headings */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') formatBlock('p');
            else if (val === 'h2') formatBlock('h2');
            else if (val === 'h3') formatBlock('h3');
            else if (val === 'h4') formatBlock('h4');
            else if (val === 'blockquote') formatBlock('blockquote');
            e.target.value = 'default';
          }}
          defaultValue="default"
          className="px-2 py-1.5 bg-white border border-neutral-300 font-bold text-neutral-800 rounded-xs cursor-pointer hover:bg-neutral-50 text-xs"
          title="Format Block Style"
        >
          <option value="default" disabled>Format ▼</option>
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2 (H2)</option>
          <option value="h3">Heading 3 (H3)</option>
          <option value="h4">Heading 4 (H4)</option>
          <option value="blockquote">Blockquote</option>
        </select>

        {/* Direct Heading Buttons */}
        <button
          type="button"
          onClick={() => formatBlock('h2')}
          className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 font-black text-neutral-800 rounded-xs"
          title="Heading 2 (Main Section)"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatBlock('h3')}
          className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 font-bold text-neutral-800 rounded-xs"
          title="Heading 3 (Subsection)"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => formatBlock('h4')}
          className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 font-bold text-neutral-800 rounded-xs"
          title="Heading 4 (Minor Subtitle)"
        >
          H4
        </button>

        <span className="w-px h-5 bg-neutral-300 mx-1"></span>

        {/* Text Styling */}
        <button
          type="button"
          onClick={() => execCmd('bold')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs font-bold"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('italic')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('underline')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('strikeThrough')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-neutral-300 mx-1"></span>

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => execCmd('insertUnorderedList')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('insertOrderedList')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => formatBlock('blockquote')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Pull Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-neutral-300 mx-1"></span>

        {/* Insert Elements */}
        <button
          type="button"
          onClick={openLinkModal}
          className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs font-bold inline-flex items-center gap-1"
          title="Insert Hyperlink / Internal Link"
        >
          <LinkIcon className="w-3.5 h-3.5 text-blue-700" />
          <span>Link</span>
        </button>

        <button
          type="button"
          onClick={openImageModal}
          className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs font-bold inline-flex items-center gap-1"
          title="Insert In-Body Image with Alt Text & Caption"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>Image</span>
        </button>

        <button
          type="button"
          onClick={() => execCmd('insertHorizontalRule')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Horizontal Divider"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-neutral-300 mx-1"></span>

        {/* Undo / Redo / Clear */}
        <button
          type="button"
          onClick={() => execCmd('undo')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('redo')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('removeFormat')}
          className="p-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xs text-neutral-500 hover:text-black"
          title="Remove Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* Code toggle */}
          <button
            type="button"
            onClick={() => setIsCodeView(!isCodeView)}
            className={`px-2 py-1 border text-[11px] font-mono font-bold flex items-center gap-1 rounded-xs cursor-pointer ${
              isCodeView ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white hover:bg-neutral-200 border-neutral-300 text-neutral-800'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>{isCodeView ? 'Visual View' : 'HTML Code'}</span>
          </button>
        </div>
      </div>

      {/* Heading Structure & Warnings Indicator */}
      <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
            Structure:
          </span>
          <span className="px-1.5 py-0.5 bg-neutral-200 text-neutral-800 font-bold rounded-xs">
            H1: {articleTitle || 'Untitled Headline'}
          </span>
          {headingAnalysis.headings.slice(0, 4).map((h, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-700 rounded-xs">
              H{h.level}: {h.text.slice(0, 18)}{h.text.length > 18 ? '...' : ''}
            </span>
          ))}
          {headingAnalysis.headings.length > 4 && (
            <span className="text-neutral-500">+{headingAnalysis.headings.length - 4} more</span>
          )}
        </div>

        {headingAnalysis.hasH1InBody && (
          <div className="flex items-center gap-1 text-red-600 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Avoid H1 in body. Story headline is H1; use H2 for sections.</span>
          </div>
        )}
      </div>

      {/* 2. Visual ContentEditable Editor OR HTML Raw Code Editor */}
      {isCodeView ? (
        <textarea
          value={rawHtml}
          onChange={handleCodeChange}
          rows={22}
          placeholder="<p>Write your article HTML body here...</p>"
          className="w-full p-4 font-mono text-xs text-neutral-900 bg-neutral-900/5 focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="min-h-[420px] p-6 focus:outline-none article-editor-canvas font-serif text-base sm:text-lg text-neutral-900 leading-[1.8] space-y-4"
          data-placeholder="Begin typing the full article story here. Use toolbar for headings, quotes, images, links and lists..."
        />
      )}

      {/* 3. Footer Stats Bar */}
      <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-300 flex items-center justify-between text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-neutral-900">{words}</strong></span>
          <span>Characters: <strong className="text-neutral-900">{rawHtml.replace(/<[^>]*>/g, '').length}</strong></span>
          <span>Reading Time: <strong className="text-neutral-900">~{readTime} min</strong></span>
        </div>
        <div className="text-[11px] text-neutral-400">
          Single unified article body · Clean semantic HTML
        </div>
      </div>

      {/* LINK MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-neutral-900 max-w-lg w-full p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-neutral-900" />
                <h3 className="font-black text-sm uppercase text-neutral-900">Insert Hyperlink</h3>
              </div>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-neutral-500 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Link Mode Switcher */}
            <div className="flex gap-2 mb-4 border-b border-neutral-200 pb-2">
              <button
                type="button"
                onClick={() => setLinkTab('custom')}
                className={`px-3 py-1.5 font-bold uppercase ${linkTab === 'custom' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'}`}
              >
                External / Custom URL
              </button>
              <button
                type="button"
                onClick={() => setLinkTab('internal')}
                className={`px-3 py-1.5 font-bold uppercase flex items-center gap-1 ${linkTab === 'internal' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'}`}
              >
                <Search className="w-3 h-3" />
                <span>Founder Bytes Internal Link</span>
              </button>
            </div>

            {linkTab === 'internal' ? (
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Search Existing Articles</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={internalSearchQuery}
                      onChange={(e) => setInternalSearchQuery(e.target.value)}
                      placeholder="Type founder name, startup or keyword..."
                      className="w-full px-3 py-2 pl-8 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-neutral-200 border border-neutral-200">
                  {filteredArticles.slice(0, 8).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        setLinkUrl(`https://founderbytes.in/${art.slug}`);
                        if (!linkText) setLinkText(art.title);
                        setLinkTab('custom');
                      }}
                      className="p-2.5 hover:bg-neutral-100 cursor-pointer flex flex-col gap-0.5 text-left transition-colors"
                    >
                      <div className="font-bold text-neutral-900 font-sans text-xs truncate">
                        {art.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        /{art.slug} · <span className="uppercase text-[#DF9E00]">{art.category_name}</span>
                      </div>
                    </div>
                  ))}
                  {filteredArticles.length === 0 && (
                    <div className="p-4 text-center text-neutral-400 italic">No matching articles found</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Target URL</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com/source or https://founderbytes.in/news/..."
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Anchor Text (Optional)</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Visible link text..."
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Rel Attribute</label>
                    <select
                      value={linkRel}
                      onChange={(e) => setLinkRel(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                    >
                      <option value="follow">follow (default editorial)</option>
                      <option value="nofollow">nofollow (external untrusted)</option>
                      <option value="sponsored">sponsored (paid commercial)</option>
                      <option value="ugc">ugc (user generated)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={linkTargetBlank}
                        onChange={(e) => setLinkTargetBlank(e.target.checked)}
                      />
                      <span className="font-bold text-neutral-800">Open in New Tab</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 font-bold uppercase text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-1.5 bg-[#F5B800] hover:bg-[#E0A700] text-black font-black uppercase tracking-wider"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-neutral-900 max-w-lg w-full p-5 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-neutral-900" />
                <h3 className="font-black text-sm uppercase text-neutral-900">Insert In-Body News Image</h3>
              </div>
              <button onClick={() => setIsImageModalOpen(false)} className="text-neutral-500 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Media Uploader integration */}
              <div>
                <MediaUploader
                  label="Upload Story Photo (Supabase Storage)"
                  recommendedWidth={1200}
                  recommendedHeight={675}
                  aspectRatioLabel="16:9"
                  bucket="article-images"
                  currentImageUrl={imgUrl}
                  onImageUploaded={(url) => setImgUrl(url)}
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Direct Image URL</label>
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or uploaded URL"
                  className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                />
              </div>

              {/* Alt Text (REQUIRED) */}
              <div>
                <label className="block font-bold text-neutral-900 mb-1 flex items-center justify-between">
                  <span>Image Alt Text <strong className="text-red-600">* Required for SEO</strong></span>
                  <span className="text-[10px] text-neutral-400">Describe photo context</span>
                </label>
                <input
                  type="text"
                  value={imgAlt}
                  onChange={(e) => {
                    setImgAlt(e.target.value);
                    if (e.target.value.trim()) setImgAltError(false);
                  }}
                  placeholder="e.g. Simple Energy manufacturing floor in Bengaluru assembly line"
                  className={`w-full px-3 py-2 border text-xs focus:outline-none ${
                    imgAltError ? 'border-red-600 bg-red-50' : 'border-neutral-300'
                  }`}
                />
                {imgAltError && (
                  <p className="text-red-600 text-[10px] font-bold mt-1">
                    Alt text is mandatory for accessibility and search engine compliance.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Caption</label>
                  <input
                    type="text"
                    value={imgCaption}
                    onChange={(e) => setImgCaption(e.target.value)}
                    placeholder="Editorial explanation..."
                    className="w-full px-3 py-2 border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Photo Credit</label>
                  <input
                    type="text"
                    value={imgCredit}
                    onChange={(e) => setImgCredit(e.target.value)}
                    placeholder="e.g. Simple Energy / Founder Bytes"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Source Link (Optional)</label>
                <input
                  type="url"
                  value={imgSourceUrl}
                  onChange={(e) => setImgSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-neutral-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Alignment</label>
                  <select
                    value={imgAlignment}
                    onChange={(e) => setImgAlignment(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                  >
                    <option value="center">Centered</option>
                    <option value="full">Full Width</option>
                    <option value="left">Left Float</option>
                    <option value="right">Right Float</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Width</label>
                  <select
                    value={imgWidth}
                    onChange={(e) => setImgWidth(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                  >
                    <option value="100%">100% (Standard)</option>
                    <option value="75%">75% (Medium)</option>
                    <option value="50%">50% (Compact)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 font-bold uppercase text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                className="px-4 py-1.5 bg-[#F5B800] hover:bg-[#E0A700] text-black font-black uppercase tracking-wider"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
