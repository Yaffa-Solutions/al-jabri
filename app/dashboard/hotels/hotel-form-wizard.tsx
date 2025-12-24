'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, Upload, X, Plus, Languages, Star, 
  MapPin, Clock, Phone, Mail, Globe, Building,
  UtensilsCrossed, Wine, Waves, Dumbbell, Car, Wifi,
  Plane, Accessibility, Sparkles, Flower2, Briefcase,
  ConciergeBell, Shirt, UserRound, Image as ImageIcon, Video,
  ChevronRight, ChevronLeft, CheckCircle2, Circle, Eye
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

type Step = 'basic' | 'details' | 'facilities' | 'policies' | 'gallery' | 'review';

const steps: { id: Step; title: string; titleAr: string }[] = [
  { id: 'basic', title: 'Basic Information', titleAr: 'المعلومات الأساسية' },
  { id: 'details', title: 'Property Details', titleAr: 'تفاصيل العقار' },
  { id: 'facilities', title: 'Facilities & Amenities', titleAr: 'المرافق والخدمات' },
  { id: 'policies', title: 'Policies & Rules', titleAr: 'السياسات والقواعد' },
  { id: 'gallery', title: 'Photos & Media', titleAr: 'الصور والوسائط' },
  { id: 'review', title: 'Review & Publish', titleAr: 'المراجعة والنشر' },
];

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

export default function HotelFormWizard({ initialData }: HotelFormProps) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translationDirection, setTranslationDirection] = useState<'en-to-ar' | 'ar-to-en'>('en-to-ar');
  const [showPreview, setShowPreview] = useState(false);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

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

  // Validation for each step
  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 'basic':
        return !!(formData.name && formData.nameAr && formData.location && formData.locationAr);
      case 'details':
        return !!(formData.description && formData.descriptionAr);
      case 'facilities':
        return true; // Optional step
      case 'policies':
        return true; // Optional step
      case 'gallery':
        return true; // Optional step
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const canProceed = validateStep(currentStep);

  // Navigation
  const nextStep = () => {
    if (!canProceed) {
      alert(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

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

  const removeMedia = (id: string) => {
    setFormData(prev => ({
      ...prev,
      mediaGallery: prev.mediaGallery.filter(m => m.id !== id),
    }));
  };

  const toggleFacility = (facilityType: FacilityType) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map(f => 
        f.type === facilityType ? { ...f, available: !f.available } : f
      ),
    }));
  };

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

  const updatePolicy = (id: string, field: keyof HotelPolicy, value: string) => {
    setFormData(prev => ({
      ...prev,
      policies: prev.policies.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const removePolicy = (id: string) => {
    setFormData(prev => ({
      ...prev,
      policies: prev.policies.filter(p => p.id !== id),
    }));
  };

  // Handle translation
  const handleTranslate = async () => {
    const isEnToAr = translationDirection === 'en-to-ar';
    
    // Check if at least one field has content based on current step
    let hasContent = false;
    if (isEnToAr) {
      // For EN to AR: check fields that are relevant to current step
      if (currentStep === 'basic') {
        hasContent = !!(formData.name || formData.location || formData.address || formData.city);
      } else if (currentStep === 'details') {
        hasContent = !!(formData.description || formData.name || formData.location);
      } else {
        // For other steps, check all available fields
        hasContent = !!(formData.name || formData.location || formData.description || formData.address || formData.city);
      }
    } else {
      // For AR to EN: check Arabic fields
      if (currentStep === 'basic') {
        hasContent = !!(formData.nameAr || formData.locationAr || formData.addressAr || formData.cityAr);
      } else if (currentStep === 'details') {
        hasContent = !!(formData.descriptionAr || formData.nameAr || formData.locationAr);
      } else {
        hasContent = !!(formData.nameAr || formData.locationAr || formData.descriptionAr || formData.addressAr || formData.cityAr);
      }
    }
    
    if (!hasContent) {
      const message = isEnToAr 
        ? 'Please fill in at least one English field before translating'
        : 'يرجى ملء حقل واحد على الأقل بالعربية قبل الترجمة';
      alert(message);
      return;
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

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <p className="text-blue-900 text-sm font-medium leading-relaxed">
                  {locale === 'ar' 
                    ? 'ابدأ بإدخال المعلومات الأساسية عن فندقك. يمكنك ترجمة المحتوى تلقائياً.'
                    : 'Start by entering basic information about your hotel. You can auto-translate content.'}
                </p>
              </div>
            </div>

            {/* Translation Button */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-6 border-b-2 border-gray-100">
              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 rounded-xl shadow-inner">
                <button
                  type="button"
                  onClick={() => setTranslationDirection('en-to-ar')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    translationDirection === 'en-to-ar'
                      ? 'bg-white text-gray-900 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  EN → AR
                </button>
                <button
                  type="button"
                  onClick={() => setTranslationDirection('ar-to-en')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    translationDirection === 'ar-to-en'
                      ? 'bg-white text-gray-900 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  AR → EN
                </button>
              </div>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* English Section */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-blue-100">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">
                    English Content
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hotel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="Enter hotel name"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="e.g., Riyadh, Saudi Arabia"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="Street address"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="City name"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Arabic Section */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-purple-100 justify-end">
                  <h3 className="text-xl font-bold text-gray-900">
                    المحتوى العربي
                  </h3>
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                    اسم الفندق <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white hover:border-gray-300 text-right"
                    placeholder="أدخل اسم الفندق"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                    الموقع <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.locationAr}
                    onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white hover:border-gray-300 text-right"
                    placeholder="مثال: الرياض، المملكة العربية السعودية"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                    العنوان الكامل
                  </label>
                  <input
                    type="text"
                    value={formData.addressAr}
                    onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white hover:border-gray-300 text-right"
                    placeholder="عنوان الشارع"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={formData.cityAr}
                    onChange={(e) => setFormData({ ...formData, cityAr: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white hover:border-gray-300 text-right"
                    placeholder="اسم المدينة"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-l-4 border-indigo-500 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <p className="text-indigo-900 text-sm font-medium leading-relaxed">
                  {locale === 'ar' 
                    ? 'أضف وصفاً مفصلاً عن فندقك ومعلومات الاتصال. يمكنك ترجمة الوصف تلقائياً.'
                    : 'Add a detailed description of your hotel and contact information. You can auto-translate the description.'}
                </p>
              </div>
            </div>

            {/* Translation Button */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-6 border-b-2 border-gray-100">
              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 rounded-xl shadow-inner">
                <button
                  type="button"
                  onClick={() => setTranslationDirection('en-to-ar')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    translationDirection === 'en-to-ar'
                      ? 'bg-white text-gray-900 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  EN → AR
                </button>
                <button
                  type="button"
                  onClick={() => setTranslationDirection('ar-to-en')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    translationDirection === 'ar-to-en'
                      ? 'bg-white text-gray-900 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  AR → EN
                </button>
              </div>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* English Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-blue-100">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Description (English) <span className="text-red-500">*</span>
                  </h3>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white hover:border-gray-300 resize-none"
                  placeholder="Describe your hotel, its unique features, and what makes it special..."
                  dir="ltr"
                />
              </div>

              {/* Arabic Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-purple-100 justify-end">
                  <h3 className="text-xl font-bold text-gray-900">
                    الوصف (عربي) <span className="text-red-500">*</span>
                  </h3>
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                </div>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white hover:border-gray-300 text-right resize-none"
                  placeholder="اوصف فندقك، ميزاته الفريدة، وما يميزه..."
                  dir="rtl"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                {t('dashboard.hotels.additionalDetails')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('dashboard.hotels.starRating')}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, starRating: star })}
                        className={`p-1 transition-transform duration-200 hover:scale-110 ${
                          star <= formData.starRating 
                            ? 'text-yellow-400 drop-shadow-sm' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className={`w-7 h-7 ${star <= formData.starRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('dashboard.hotels.checkInTime')}
                  </label>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white"
                  />
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('dashboard.hotels.checkOutTime')}
                  </label>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-600" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    {t('dashboard.hotels.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="+966 XX XXX XXXX"
                  />
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    {t('dashboard.hotels.email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="hotel@example.com"
                  />
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    {t('dashboard.hotels.website')}
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="https://www.hotel.com"
                  />
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-white rounded-xl p-5 border-2 border-gray-100 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('dashboard.hotels.availability')}
              </label>
              <select
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as AvailabilityStatus })}
                className="w-full md:w-64 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white hover:border-gray-300"
              >
                {Object.entries(availabilityLabels).map(([key, { en, ar }]) => (
                  <option key={key} value={key}>
                    {locale === 'ar' ? ar : en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'facilities':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                {locale === 'ar' 
                  ? 'حدد المرافق والخدمات المتوفرة في فندقك.'
                  : 'Select the facilities and services available at your hotel.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.facilities.map((facility) => (
                <div
                  key={facility.id}
                  className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    facility.available 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  onClick={() => toggleFacility(facility.type)}
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
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      facility.available 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {facility.available && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>

                  {facility.available && (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={facility.description || ''}
                        onChange={(e) => updateFacilityDescription(facility.type, 'en', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Additional details (English)"
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        dir="ltr"
                      />
                      <input
                        type="text"
                        value={facility.descriptionAr || ''}
                        onChange={(e) => updateFacilityDescription(facility.type, 'ar', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
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
        );

      case 'policies':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                {locale === 'ar' 
                  ? 'أضف سياسات الفندق مثل سياسات الإلغاء، التدخين، الحيوانات الأليفة، وغيرها.'
                  : 'Add hotel policies such as cancellation, smoking, pets, and more.'}
              </p>
            </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          dir="ltr"
                        />
                      </div>

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
                          rows={3}
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
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                {locale === 'ar' 
                  ? 'قم بتحميل الصور الرئيسية ومعرض الصور لإظهار فندقك بأفضل شكل.'
                  : 'Upload main image and gallery photos to showcase your hotel beautifully.'}
              </p>
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.hotels.mainImage')} *
              </label>
              {formData.mainImage ? (
                <div className="relative group">
                  <img
                    src={formData.mainImage}
                    alt="Main"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
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
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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

            {/* Gallery */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Photo Gallery
                </label>
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
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm font-medium">
                {locale === 'ar' 
                  ? 'راجع جميع المعلومات قبل النشر. يمكنك حفظها كمسودة أيضاً.'
                  : 'Review all information before publishing. You can also save as draft.'}
              </p>
            </div>

            {/* Preview Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-6">
                {formData.mainImage && (
                  <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={formData.mainImage}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {locale === 'ar' ? formData.nameAr : formData.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{locale === 'ar' ? formData.locationAr : formData.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(formData.starRating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {locale === 'ar' ? formData.descriptionAr : formData.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.facilities.filter(f => f.available).slice(0, 5).map((facility) => (
                      <span
                        key={facility.id}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {locale === 'ar' 
                          ? facilityLabels[facility.type].ar 
                          : facilityLabels[facility.type].en}
                      </span>
                    ))}
                    {formData.facilities.filter(f => f.available).length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{formData.facilities.filter(f => f.available).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• {formData.facilities.filter(f => f.available).length} Facilities</li>
                  <li>• {formData.policies.length} Policies</li>
                  <li>• {formData.mediaGallery.length} Media Items</li>
                  <li>• Check-in: {formData.checkInTime}</li>
                  <li>• Check-out: {formData.checkOutTime}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Availability: {locale === 'ar' ? availabilityLabels[formData.availabilityStatus].ar : availabilityLabels[formData.availabilityStatus].en}</li>
                  <li>• Published: {formData.published ? 'Yes' : 'No'}</li>
                  <li>• Featured: {formData.featured ? 'Yes' : 'No'}</li>
                </ul>
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                id="featured"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                {t('dashboard.hotels.featuredHotel')}
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm bg-gradient-to-r from-white to-blue-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {initialData ? t('dashboard.hotels.editHotel') : t('dashboard.hotels.createHotel')}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {locale === 'ar' 
                ? `الخطوة ${currentStepIndex + 1} من ${steps.length}`
                : `Step ${currentStepIndex + 1} of ${steps.length}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 flex items-center gap-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Eye className="w-4 h-4" />
              {t('dashboard.hotels.preview')}
            </button>
            {currentStep === 'review' && (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('dashboard.hotels.saveDraft')}
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 disabled:opacity-50 flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('dashboard.hotels.publish')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            const canClick = index <= currentStepIndex || isCompleted;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => canClick && goToStep(step.id)}
                  disabled={!canClick}
                  className={`flex items-center gap-3 transition-all duration-200 ${canClick ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
                >
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-600 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-110' 
                      : isCompleted 
                        ? 'border-green-500 bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md shadow-green-500/30'
                        : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-bold text-sm">{index + 1}</span>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
                    )}
                  </div>
                  <div className="hidden md:block text-left ml-2">
                    <div className={`text-sm font-semibold transition-colors ${
                      isActive 
                        ? 'text-blue-600' 
                        : isCompleted 
                          ? 'text-green-600'
                          : 'text-gray-500'
                    }`}>
                      {locale === 'ar' ? step.titleAr : step.title}
                    </div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-sm' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('dashboard.hotels.previous')}
          </button>

          {currentStep !== 'review' && (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
            >
              {t('dashboard.hotels.next')}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

