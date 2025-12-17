'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, Upload, X, Plus, Eye, Languages, Star, 
  MapPin, Clock, Phone, Mail, Globe, Building,
  UtensilsCrossed, Wine, Waves, Dumbbell, Car, Wifi,
  Plane, Accessibility, Sparkles, Flower2, Briefcase,
  ConciergeBell, Shirt, UserRound, Image as ImageIcon, Video
} from 'lucide-react';
import { createId } from '@paralleldrive/cuid2';
import { useI18n } from '@/lib/i18n-context';
import Image from 'next/image';
import type { 
  HotelFormData, 
  HotelFacility, 
  HotelPolicy, 
  MediaItem,
  FacilityType,
  PolicyType,
  AvailabilityStatus,
} from '@/types/hotel';
import { facilityLabels, policyLabels, availabilityLabels, defaultFacilities } from '@/types/hotel';

// Icon mapping for facilities
const facilityIcons: Record<FacilityType, React.ReactNode> = {
  restaurant: <UtensilsCrossed className="w-5 h-5" />,
  bar: <Wine className="w-5 h-5" />,
  pool: <Waves className="w-5 h-5" />,
  gym: <Dumbbell className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  wifi: <Wifi className="w-5 h-5" />,
  reception: <Clock className="w-5 h-5" />,
  airport_transfer: <Plane className="w-5 h-5" />,
  accessibility: <Accessibility className="w-5 h-5" />,
  cleaning: <Sparkles className="w-5 h-5" />,
  spa: <Flower2 className="w-5 h-5" />,
  business_center: <Briefcase className="w-5 h-5" />,
  room_service: <ConciergeBell className="w-5 h-5" />,
  laundry: <Shirt className="w-5 h-5" />,
  concierge: <UserRound className="w-5 h-5" />,
};

type HotelFormProps = {
  initialData?: {
    id: string;
    name: string;
    nameAr: string;
    location: string;
    locationAr: string;
    description: string;
    descriptionAr: string;
    address?: string | null;
    addressAr?: string | null;
    city?: string | null;
    cityAr?: string | null;
    country?: string | null;
    countryAr?: string | null;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    starRating: number;
    mainImage: string | null;
    images: string[];
    mediaGallery: MediaItem[];
    amenities: string[];
    amenitiesAr: string[];
    facilities: HotelFacility[];
    policies: HotelPolicy[];
    checkInTime: string;
    checkOutTime: string;
    availabilityStatus: AvailabilityStatus;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    published: boolean;
    featured: boolean;
    metaDescription?: string | null;
    metaDescriptionAr?: string | null;
    metaKeywords?: string | null;
    metaKeywordsAr?: string | null;
    slug?: string | null;
  };
};

export default function HotelForm({ initialData }: HotelFormProps) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'facilities' | 'policies' | 'gallery' | 'seo'>('basic');
  const [translating, setTranslating] = useState(false);
  const [translationDirection, setTranslationDirection] = useState<'en-to-ar' | 'ar-to-en'>('en-to-ar');

  // Initialize form data
  const [formData, setFormData] = useState<HotelFormData>({
    name: initialData?.name || '',
    nameAr: initialData?.nameAr || '',
    location: initialData?.location || '',
    locationAr: initialData?.locationAr || '',
    description: initialData?.description || '',
    descriptionAr: initialData?.descriptionAr || '',
    address: initialData?.address || '',
    addressAr: initialData?.addressAr || '',
    city: initialData?.city || '',
    cityAr: initialData?.cityAr || '',
    country: initialData?.country || 'Saudi Arabia',
    countryAr: initialData?.countryAr || 'المملكة العربية السعودية',
    postalCode: initialData?.postalCode || '',
    latitude: initialData?.latitude?.toString() || '',
    longitude: initialData?.longitude?.toString() || '',
    starRating: initialData?.starRating || 3,
    mainImage: initialData?.mainImage || null,
    images: initialData?.images || [],
    mediaGallery: initialData?.mediaGallery || [],
    amenities: initialData?.amenities || [],
    amenitiesAr: initialData?.amenitiesAr || [],
    facilities: initialData?.facilities?.length ? initialData.facilities : [...defaultFacilities],
    policies: initialData?.policies || [],
    checkInTime: initialData?.checkInTime || '14:00',
    checkOutTime: initialData?.checkOutTime || '12:00',
    availabilityStatus: initialData?.availabilityStatus || 'available',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    published: initialData?.published || false,
    featured: initialData?.featured || false,
    metaDescription: initialData?.metaDescription || '',
    metaDescriptionAr: initialData?.metaDescriptionAr || '',
    metaKeywords: initialData?.metaKeywords || '',
    metaKeywordsAr: initialData?.metaKeywordsAr || '',
    slug: initialData?.slug || '',
  });

  // Handle main image upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      setFormData(prev => ({ ...prev, mainImage: data.data.url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // Handle gallery image upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploading(true);
    try {
      const uploadedMedia: MediaItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataObj = new FormData();
        formDataObj.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataObj,
        });

        if (!response.ok) throw new Error(`Failed to upload ${file.name}`);

        const data = await response.json();
        const isVideo = file.type.startsWith('video/');
        
        uploadedMedia.push({
          id: createId(),
          type: isVideo ? 'video' : 'image',
          url: data.data.url,
          order: formData.mediaGallery.length + uploadedMedia.length,
        });
      }

      setFormData(prev => ({
        ...prev,
        mediaGallery: [...prev.mediaGallery, ...uploadedMedia],
      }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload media');
    } finally {
      setImageUploading(false);
    }
  };

  // Remove media from gallery
  const removeMedia = (id: string) => {
    setFormData(prev => ({
      ...prev,
      mediaGallery: prev.mediaGallery.filter(m => m.id !== id),
    }));
  };

  // Toggle facility availability
  const toggleFacility = (facilityType: FacilityType) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map(f => 
        f.type === facilityType ? { ...f, available: !f.available } : f
      ),
    }));
  };

  // Update facility description
  const updateFacilityDescription = (facilityType: FacilityType, lang: 'en' | 'ar', value: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map(f => 
        f.type === facilityType 
          ? { ...f, [lang === 'en' ? 'description' : 'descriptionAr']: value }
          : f
      ),
    }));
  };

  // Add new policy
  const addPolicy = () => {
    const newPolicy: HotelPolicy = {
      id: createId(),
      type: 'other',
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
    };
    setFormData(prev => ({
      ...prev,
      policies: [...prev.policies, newPolicy],
    }));
  };

  // Update policy
  const updatePolicy = (id: string, field: keyof HotelPolicy, value: string) => {
    setFormData(prev => ({
      ...prev,
      policies: prev.policies.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  // Remove policy
  const removePolicy = (id: string) => {
    setFormData(prev => ({
      ...prev,
      policies: prev.policies.filter(p => p.id !== id),
    }));
  };

  // Handle translation
  const handleTranslate = async () => {
    const isEnToAr = translationDirection === 'en-to-ar';
    
    // Check if at least one field has content (don't require all fields)
    const hasEnglishContent = !!(formData.name || formData.location || formData.description || formData.address || formData.city);
    const hasArabicContent = !!(formData.nameAr || formData.locationAr || formData.descriptionAr || formData.addressAr || formData.cityAr);
    
    if (isEnToAr) {
      if (!hasEnglishContent) {
        alert('Please fill in at least one English field before translating');
        return;
      }
    } else {
      if (!hasArabicContent) {
        alert('يرجى ملء حقل واحد على الأقل بالعربية قبل الترجمة');
        return;
      }
    }

    setTranslating(true);
    try {
      const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
        if (!text || !text.trim()) return text || '';

        const encodedText = encodeURIComponent(text);
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodedText}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Translation failed');

        const data = await response.json();
        if (data && data[0]) {
          return data[0].map((item: string[]) => item[0]).join('');
        }
        return text;
      };

      const fromLang = isEnToAr ? 'en' : 'ar';
      const toLang = isEnToAr ? 'ar' : 'en';

      if (isEnToAr) {
        // Translate only fields that have content
        const translations = await Promise.all([
          formData.name ? translateText(formData.name, fromLang, toLang) : Promise.resolve(formData.nameAr || ''),
          formData.location ? translateText(formData.location, fromLang, toLang) : Promise.resolve(formData.locationAr || ''),
          formData.description ? translateText(formData.description, fromLang, toLang) : Promise.resolve(formData.descriptionAr || ''),
          formData.address ? translateText(formData.address, fromLang, toLang) : Promise.resolve(formData.addressAr || ''),
          formData.city ? translateText(formData.city, fromLang, toLang) : Promise.resolve(formData.cityAr || ''),
        ]);

        setFormData(prev => ({
          ...prev,
          nameAr: translations[0] || prev.nameAr,
          locationAr: translations[1] || prev.locationAr,
          descriptionAr: translations[2] || prev.descriptionAr,
          addressAr: translations[3] || prev.addressAr,
          cityAr: translations[4] || prev.cityAr,
        }));
      } else {
        // Translate from AR to EN
        const translations = await Promise.all([
          formData.nameAr ? translateText(formData.nameAr, fromLang, toLang) : Promise.resolve(formData.name || ''),
          formData.locationAr ? translateText(formData.locationAr, fromLang, toLang) : Promise.resolve(formData.location || ''),
          formData.descriptionAr ? translateText(formData.descriptionAr, fromLang, toLang) : Promise.resolve(formData.description || ''),
          formData.addressAr ? translateText(formData.addressAr, fromLang, toLang) : Promise.resolve(formData.address || ''),
          formData.cityAr ? translateText(formData.cityAr, fromLang, toLang) : Promise.resolve(formData.city || ''),
        ]);

        setFormData(prev => ({
          ...prev,
          name: translations[0] || prev.name,
          location: translations[1] || prev.location,
          description: translations[2] || prev.description,
          address: translations[3] || prev.address,
          city: translations[4] || prev.city,
        }));
      }

      const targetLang = isEnToAr ? 'Arabic' : 'English';
      alert(`Translation to ${targetLang} completed!`);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again or fill in manually.');
    } finally {
      setTranslating(false);
    }
  };

  // Handle submit
  const handleSubmit = async (publish: boolean = false) => {
    // Validation
    if (!formData.name || !formData.nameAr) {
      alert('Please fill in hotel name in both English and Arabic');
      return;
    }
    if (!formData.location || !formData.locationAr) {
      alert('Please fill in location in both English and Arabic');
      return;
    }
    if (!formData.description || !formData.descriptionAr) {
      alert('Please fill in description in both English and Arabic');
      return;
    }

    setLoading(true);

    try {
      const url = '/api/hotels';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: publish,
          ...(initialData && { id: initialData.id }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save hotel');
      }

      router.push('/dashboard/hotels');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {initialData ? t('dashboard.hotels.editHotel') : t('dashboard.hotels.createHotel')}
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('dashboard.hotels.saveDraft')}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('dashboard.hotels.publish')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Upload */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('dashboard.hotels.mainImage')}
        </label>
        {formData.mainImage ? (
          <div className="relative group">
            <img
              src={formData.mainImage}
              alt="Main"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, mainImage: null })}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            {imageUploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 font-medium">
                  {t('dashboard.hotels.clickToUpload')}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="hidden"
              disabled={imageUploading}
            />
          </label>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-white">
          <div className="flex overflow-x-auto">
            {(['basic', 'facilities', 'policies', 'gallery', 'seo'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(`dashboard.hotels.tab.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Translation Button */}
              <div className="flex justify-center items-center gap-4 pb-4 border-b border-gray-200">
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
                {/* English Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    English Content
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hotel Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter hotel name"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Riyadh, Saudi Arabia"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Describe the hotel..."
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Street address"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="City name"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Arabic Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 text-right">
                    المحتوى العربي
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      اسم الفندق *
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                      placeholder="أدخل اسم الفندق"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      الموقع *
                    </label>
                    <input
                      type="text"
                      value={formData.locationAr}
                      onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                      placeholder="مثال: الرياض، المملكة العربية السعودية"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      الوصف *
                    </label>
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                      placeholder="وصف الفندق..."
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      العنوان الكامل
                    </label>
                    <input
                      type="text"
                      value={formData.addressAr}
                      onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                      placeholder="عنوان الشارع"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      المدينة
                    </label>
                    <input
                      type="text"
                      value={formData.cityAr}
                      onChange={(e) => setFormData({ ...formData, cityAr: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                      placeholder="اسم المدينة"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('dashboard.hotels.additionalDetails')}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.hotels.starRating')}
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, starRating: star })}
                          className={`p-1 ${star <= formData.starRating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.hotels.checkInTime')}
                    </label>
                    <input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.hotels.checkOutTime')}
                    </label>
                    <input
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.hotels.availability')}
                    </label>
                    <select
                      value={formData.availabilityStatus}
                      onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as AvailabilityStatus })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(availabilityLabels).map(([key, { en }]) => (
                        <option key={key} value={key}>{en}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-4 h-4 inline mr-1" />
                      {t('dashboard.hotels.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {t('dashboard.hotels.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="hotel@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Globe className="w-4 h-4 inline mr-1" />
                      {t('dashboard.hotels.website')}
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="https://www.hotel.com"
                    />
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.hotels.postalCode')}
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.hotels.latitude')}
                    </label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="24.7136"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.hotels.longitude')}
                    </label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="46.6753"
                    />
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t('dashboard.hotels.featuredHotel')}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm mb-4">
                {t('dashboard.hotels.facilitiesDescription')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      facility.available 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={facility.available ? 'text-green-600' : 'text-gray-400'}>
                          {facilityIcons[facility.type]}
                        </span>
                        <span className="font-medium text-gray-900">
                          {locale === 'ar' 
                            ? facilityLabels[facility.type].ar 
                            : facilityLabels[facility.type].en}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={facility.available}
                          onChange={() => toggleFacility(facility.type)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    {facility.available && (
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          value={facility.description || ''}
                          onChange={(e) => updateFacilityDescription(facility.type, 'en', e.target.value)}
                          placeholder="Additional details (English)"
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          dir="ltr"
                        />
                        <input
                          type="text"
                          value={facility.descriptionAr || ''}
                          onChange={(e) => updateFacilityDescription(facility.type, 'ar', e.target.value)}
                          placeholder="تفاصيل إضافية (عربي)"
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-right"
                          dir="rtl"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  {t('dashboard.hotels.policiesDescription')}
                </p>
                <button
                  type="button"
                  onClick={addPolicy}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('dashboard.hotels.addPolicy')}
                </button>
              </div>

              {formData.policies.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500">{t('dashboard.hotels.noPolicies')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.policies.map((policy) => (
                    <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <select
                          value={policy.type}
                          onChange={(e) => updatePolicy(policy.id, 'type', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                          {Object.entries(policyLabels).map(([key, { en, ar }]) => (
                            <option key={key} value={key}>
                              {locale === 'ar' ? ar : en}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removePolicy(policy.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* English */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={policy.title}
                            onChange={(e) => updatePolicy(policy.id, 'title', e.target.value)}
                            placeholder="Policy Title (English)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            dir="ltr"
                          />
                          <textarea
                            value={policy.description}
                            onChange={(e) => updatePolicy(policy.id, 'description', e.target.value)}
                            placeholder="Policy description (English)"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            dir="ltr"
                          />
                        </div>

                        {/* Arabic */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={policy.titleAr}
                            onChange={(e) => updatePolicy(policy.id, 'titleAr', e.target.value)}
                            placeholder="عنوان السياسة (عربي)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                            dir="rtl"
                          />
                          <textarea
                            value={policy.descriptionAr}
                            onChange={(e) => updatePolicy(policy.id, 'descriptionAr', e.target.value)}
                            placeholder="وصف السياسة (عربي)"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  {t('dashboard.hotels.galleryDescription')}
                </p>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  {imageUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {t('dashboard.hotels.uploadMedia')}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </label>
              </div>

              {formData.mediaGallery.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('dashboard.hotels.noMedia')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.mediaGallery.map((media) => (
                    <div key={media.id} className="relative group">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt=""
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-800 rounded-lg border border-gray-200 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(media.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* English SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    SEO (English)
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="hotel-name-city"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      rows={3}
                      maxLength={160}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Brief description for search engines (160 chars max)"
                      dir="ltr"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.metaDescription?.length || 0}/160
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={formData.metaKeywords}
                      onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="hotel, luxury, riyadh, saudi arabia"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Arabic SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 text-right">
                    تحسين محركات البحث (عربي)
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      وصف الميتا
                    </label>
                    <textarea
                      value={formData.metaDescriptionAr}
                      onChange={(e) => setFormData({ ...formData, metaDescriptionAr: e.target.value })}
                      rows={3}
                      maxLength={160}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                      placeholder="وصف مختصر لمحركات البحث (160 حرف كحد أقصى)"
                      dir="rtl"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {formData.metaDescriptionAr?.length || 0}/160
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      كلمات مفتاحية
                    </label>
                    <input
                      type="text"
                      value={formData.metaKeywordsAr}
                      onChange={(e) => setFormData({ ...formData, metaKeywordsAr: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                      placeholder="فندق، فاخر، الرياض، السعودية"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

