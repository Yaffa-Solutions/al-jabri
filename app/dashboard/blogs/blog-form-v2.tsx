'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, X, Plus, Eye, Languages, Calendar, User, Clock } from 'lucide-react';
import { createId } from '@paralleldrive/cuid2';
import { useI18n } from '@/lib/i18n-context';
import type { BlogFormData, ContentBlock } from '@/types/blog';
import WysiwygEditor from '@/components/wysiwyg-editor';
import Image from 'next/image';

type BlogFormV2Props = {
  authorId: string;
  initialData?: {
    id: string;
    title: string;
    excerpt: string;
    content: ContentBlock[];
    titleAr?: string | null;
    excerptAr?: string | null;
    contentAr?: ContentBlock[] | null;
    category: string;
    tags: string[];
    coverImage: string | null;
    readTime: string;
    published: boolean;
    languageCode: 'en' | 'ar';
    metaDescription?: string;
    metaKeywords?: string;
  };
};

export default function BlogFormV2({ authorId, initialData }: BlogFormV2Props) {
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'meta' | 'seo'>(
    'content'
  );
  const [tagInput, setTagInput] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translationDirection, setTranslationDirection] = useState<'en-to-ar' | 'ar-to-en'>('en-to-ar');
  const [showPreview, setShowPreview] = useState(false);
  const [previewLocale, setPreviewLocale] = useState<'en' | 'ar'>('en');

  // Helper function to extract HTML from ContentBlock[]
  const extractHtmlFromBlocks = (blocks: ContentBlock[] | null | undefined): string => {
    if (!blocks || blocks.length === 0) return '';
    const textBlock = blocks.find(block => block.type === 'text');
    return textBlock && textBlock.type === 'text' ? textBlock.data : '';
  };

  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || [
      { type: 'text', id: createId(), data: '' },
    ],
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    coverImage: initialData?.coverImage || null,
    readTime: initialData?.readTime || '5 min read',
    published: initialData?.published || false,
    languageCode: initialData?.languageCode || locale,
    metaDescription: initialData?.metaDescription || '',
    metaKeywords: initialData?.metaKeywords || '',
  });

  // Separate state for bilingual content
  const [bilingualContent, setBilingualContent] = useState({
    titleEn: initialData?.title || '',
    titleAr: initialData?.titleAr || '',
    excerptEn: initialData?.excerpt || '',
    excerptAr: initialData?.excerptAr || '',
    contentEn: extractHtmlFromBlocks(initialData?.content),
    contentAr: extractHtmlFromBlocks(initialData?.contentAr),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, coverImage: data.data.url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTranslate = async () => {
    // Validate based on translation direction
    const isEnToAr = translationDirection === 'en-to-ar';
    const sourceTitle = isEnToAr ? bilingualContent.titleEn : bilingualContent.titleAr;
    const sourceExcerpt = isEnToAr ? bilingualContent.excerptEn : bilingualContent.excerptAr;
    const sourceContent = isEnToAr ? bilingualContent.contentEn : bilingualContent.contentAr;

    if (!sourceTitle || !sourceExcerpt || !sourceContent) {
      const lang = isEnToAr ? 'English' : 'Arabic';
      alert(`Please fill in ${lang} content first before translating`);
      return;
    }

    setTranslating(true);
    try {
      // Translation function using Google Translate's free API
      const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
        try {
          if (!text.trim()) return text;

          // For HTML content (from WYSIWYG editor), extract text nodes and translate them
          if (text.includes('<')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;

            // Get all text nodes
            const textNodes: { node: Node; text: string }[] = [];
            const walker = document.createTreeWalker(
              tempDiv,
              NodeFilter.SHOW_TEXT,
              null
            );

            let node;
            while ((node = walker.nextNode())) {
              const nodeText = node.textContent?.trim();
              if (nodeText) {
                textNodes.push({ node, text: nodeText });
              }
            }

            // Translate all text nodes
            for (const { node, text } of textNodes) {
              const encodedText = encodeURIComponent(text);
              const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodedText}`;

              try {
                const response = await fetch(url);
                if (response.ok) {
                  const data = await response.json();
                  if (data && data[0]) {
                    const translated = data[0].map((item: any) => item[0]).join('');
                    if (node.textContent) {
                      node.textContent = translated;
                    }
                  }
                }
              } catch (err) {
                console.error('Failed to translate text node:', err);
              }

              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
            }

            return tempDiv.innerHTML;
          }

          // For plain text, translate directly
          const encodedText = encodeURIComponent(text);
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodedText}`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error('Translation failed');
          }

          const data = await response.json();

          if (data && data[0]) {
            return data[0].map((item: any) => item[0]).join('');
          }

          return text;
        } catch (error) {
          console.error('Translation error:', error);
          return text;
        }
      };

      const fromLang = isEnToAr ? 'en' : 'ar';
      const toLang = isEnToAr ? 'ar' : 'en';

      // Translate all fields
      const [translatedTitle, translatedExcerpt, translatedContent] = await Promise.all([
        translateText(sourceTitle, fromLang, toLang),
        translateText(sourceExcerpt, fromLang, toLang),
        translateText(sourceContent, fromLang, toLang),
      ]);

      // Update target content based on direction
      if (isEnToAr) {
        setBilingualContent({
          ...bilingualContent,
          titleAr: translatedTitle,
          excerptAr: translatedExcerpt,
          contentAr: translatedContent,
        });
      } else {
        setBilingualContent({
          ...bilingualContent,
          titleEn: translatedTitle,
          excerptEn: translatedExcerpt,
          contentEn: translatedContent,
        });
      }

      const targetLang = isEnToAr ? 'Arabic' : 'English';
      alert(`Translation to ${targetLang} completed! You can now edit the content if needed.`);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again or fill in manually.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (publish: boolean = false) => {
    // Validation
    if (!bilingualContent.titleEn || !bilingualContent.excerptEn || !bilingualContent.contentEn) {
      alert('Please fill in all required English fields (Title, Excerpt, Content)');
      return;
    }
    if (!bilingualContent.titleAr || !bilingualContent.excerptAr || !bilingualContent.contentAr) {
      alert('Please fill in all required Arabic fields (العنوان، المقتطف، المحتوى)');
      return;
    }
    if (!formData.category) {
      alert('Please fill in the category in the Meta tab');
      return;
    }

    setLoading(true);

    try {
      const url = initialData ? '/api/blogs' : '/api/blogs';
      const method = initialData ? 'PUT' : 'POST';

      // Send bilingual content to the backend
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          title: bilingualContent.titleEn,
          excerpt: bilingualContent.excerptEn,
          content: [{ type: 'text', id: createId(), data: bilingualContent.contentEn }],
          titleAr: bilingualContent.titleAr,
          excerptAr: bilingualContent.excerptAr,
          contentAr: [{ type: 'text', id: createId(), data: bilingualContent.contentAr }],
          published: publish,
          authorId,
          ...(initialData && { id: initialData.id }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save blog');
      }

      router.push('/dashboard/blogs');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const currentDir = formData.languageCode === 'ar' ? 'rtl' : 'ltr';

  return (
    // create a container column
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {initialData ? t('blog.editor.editTitle') : t('blog.editor.title')}
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
            >
              <Eye className="w-4 h-4" />
              {t('dashboard.blogs.preview')}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('dashboard.blogs.draft')}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('dashboard.blogs.publish')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('blog.editor.coverImage')}
        </label>
        {formData.coverImage ? (
          <div className="relative group">
            <img
              src={formData.coverImage}
              alt="Cover"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, coverImage: null })}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            {imageUploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-2 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 font-medium">
                  {t('blog.editor.clickToUpload')}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {t('blog.editor.fileFormat')}
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={imageUploading}
            />
          </label>
        )}
      </div>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
       

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('blog.editor.content')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('meta')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'meta'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('blog.editor.meta')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'seo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('blog.editor.seo')}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Translate Button with Direction Selector */}
              <div className="flex justify-center items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTranslationDirection('en-to-ar')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      translationDirection === 'en-to-ar'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    EN → AR
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationDirection('ar-to-en')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      translationDirection === 'ar-to-en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    AR → EN
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={translating}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg transition-all"
                >
                  {translating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('blog.editor.translating')}
                    </>
                  ) : (
                    <>
                      <Languages className="w-5 h-5" />
                      {translationDirection === 'en-to-ar'
                        ? t('blog.editor.autoTranslateToArabic')
                        : t('blog.editor.autoTranslateToEnglish')}
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* English Section - Left */}
                <div className="space-y-6 border-r pr-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    English Content
                  </h3>

                <div className="relative">
                  <input
                    type="text"
                    value={bilingualContent.titleEn}
                    onChange={(e) =>
                      setBilingualContent({
                        ...bilingualContent,
                        titleEn: e.target.value
                      })
                    }
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-lg font-semibold placeholder-transparent"
                    placeholder="Title"
                    dir="ltr"
                    required
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-700 transition-all">
                    Title *
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    value={bilingualContent.excerptEn}
                    onChange={(e) =>
                      setBilingualContent({
                        ...bilingualContent,
                        excerptEn: e.target.value
                      })
                    }
                    rows={3}
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder-transparent"
                    placeholder="Excerpt"
                    dir="ltr"
                    required
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-700 transition-all">
                    Excerpt *
                  </label>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Content *
                  </label>
                  <WysiwygEditor
                    content={bilingualContent.contentEn}
                    onChange={(content) =>
                      setBilingualContent({
                        ...bilingualContent,
                        contentEn: content
                      })
                    }
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Arabic Section - Right */}
              <div className="space-y-6 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 text-right">
                  المحتوى العربي
                </h3>

                <div className="relative">
                  <input
                    type="text"
                    value={bilingualContent.titleAr}
                    onChange={(e) =>
                      setBilingualContent({
                        ...bilingualContent,
                        titleAr: e.target.value
                      })
                    }
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-lg font-semibold placeholder-transparent"
                    placeholder="العنوان"
                    dir="rtl"
                    required
                  />
                  <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm font-medium text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-700 transition-all">
                    العنوان *
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    value={bilingualContent.excerptAr}
                    onChange={(e) =>
                      setBilingualContent({
                        ...bilingualContent,
                        excerptAr: e.target.value
                      })
                    }
                    rows={3}
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder-transparent"
                    placeholder="المقتطف"
                    dir="rtl"
                    required
                  />
                  <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm font-medium text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-700 transition-all">
                    المقتطف *
                  </label>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                    المحتوى *
                  </label>
                  <WysiwygEditor
                    content={bilingualContent.contentAr}
                    onChange={(content) =>
                      setBilingualContent({
                        ...bilingualContent,
                        contentAr: content
                      })
                    }
                    dir="rtl"
                  />
                </div>
              </div>
              </div>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-6" dir={currentDir}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('blog.editor.category')} *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  placeholder={t('blog.editor.enterCategory')}
                  dir={currentDir}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('blog.editor.tags')}
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder={t('blog.editor.addTag')}
                    dir={currentDir}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('blog.editor.readTime')}
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  placeholder="5 min read"
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('blog.editor.metaDescription')}
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  rows={3}
                  maxLength={160}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  placeholder={t('blog.editor.enterMetaDesc')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription?.length || 0} / 160
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('blog.editor.metaKeywords')}
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, metaKeywords: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  placeholder={t('blog.editor.enterMetaKeywords')}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Blog Preview</h2>
                {/* Language Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewLocale('en')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      previewLocale === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLocale('ar')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      previewLocale === 'ar'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 bg-[#FDFBF7]">
              <article className="max-w-4xl mx-auto">
                {/* Preview Banner */}
                <div className="bg-amber-100 border border-amber-200 rounded-lg p-3 mb-8">
                  <p className="text-amber-800 text-sm font-medium text-center">
                    ⚠️ This is a preview - Blog is not published yet
                  </p>
                </div>

                {/* Category Badge */}
                {formData.category && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#B99B75]/10 text-[#B99B75] text-sm font-medium rounded-full">
                      {formData.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1
                  className="text-3xl md:text-5xl font-bold text-[#324557] mb-6 leading-tight"
                  dir={previewLocale === 'ar' ? 'rtl' : 'ltr'}
                >
                  {previewLocale === 'en' ? bilingualContent.titleEn : bilingualContent.titleAr}
                </h1>

                {/* Meta Data */}
                <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-b border-[#E3D6C7] pb-6 mb-8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#B99B75]" />
                    <span className="font-medium text-[#324557]">Author</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B99B75]" />
                    <span>
                      {new Date().toLocaleDateString(previewLocale === 'ar' ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {formData.readTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#B99B75]" />
                      <span>{formData.readTime}</span>
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                {formData.coverImage && (
                  <div className="rounded-2xl overflow-hidden mb-10 shadow-lg relative h-[400px] w-full">
                    <Image
                      src={formData.coverImage}
                      alt={previewLocale === 'en' ? bilingualContent.titleEn : bilingualContent.titleAr}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Excerpt */}
                {(previewLocale === 'en' ? bilingualContent.excerptEn : bilingualContent.excerptAr) && (
                  <div className="mb-10 p-6 bg-white border-l-4 border-[#B99B75] rounded-r-lg shadow-sm">
                    <p
                      className="text-xl text-gray-700 leading-relaxed font-medium italic"
                      dir={previewLocale === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {previewLocale === 'en' ? bilingualContent.excerptEn : bilingualContent.excerptAr}
                    </p>
                  </div>
                )}

                {/* Main Content */}
                <div
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#324557] prose-p:text-gray-600 prose-a:text-[#B99B75] prose-img:rounded-xl bg-white p-8 rounded-lg shadow-sm"
                  dir={previewLocale === 'ar' ? 'rtl' : 'ltr'}
                  dangerouslySetInnerHTML={{
                    __html: previewLocale === 'en' ? bilingualContent.contentEn : bilingualContent.contentAr
                  }}
                />

                {/* Tags */}
                {formData.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-[#E3D6C7]">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
