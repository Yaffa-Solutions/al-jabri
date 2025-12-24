'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, Upload, X, Plus, Languages, 
  Bed, Users, DollarSign, Image as ImageIcon,
  Coffee, Sparkles, ConciergeBell, Shirt, Plane,
  Flower2, Dumbbell, Clock, Home, Wifi, Calendar,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import { createId } from '@paralleldrive/cuid2';
import { useI18n } from '@/lib/i18n-context';
import Image from 'next/image';
import type { RoomAddOn, RoomBookingConditions } from '@/types/hotel';

// Room add-on types
const addOnTypes: Array<{ value: RoomAddOn['type']; label: { en: string; ar: string }; icon: React.ReactNode }> = [
  { value: 'breakfast', label: { en: 'Breakfast Included', ar: 'إفطار شامل' }, icon: <Coffee className="w-5 h-5" /> },
  { value: 'daily_cleaning', label: { en: 'Daily Cleaning', ar: 'تنظيف يومي' }, icon: <Sparkles className="w-5 h-5" /> },
  { value: 'room_service', label: { en: 'Room Service', ar: 'خدمة الغرف' }, icon: <ConciergeBell className="w-5 h-5" /> },
  { value: 'laundry', label: { en: 'Laundry', ar: 'غسيل ملابس' }, icon: <Shirt className="w-5 h-5" /> },
  { value: 'airport_transfer', label: { en: 'Airport Transfer', ar: 'نقل من/إلى المطار' }, icon: <Plane className="w-5 h-5" /> },
  { value: 'spa_access', label: { en: 'Spa Access', ar: 'وصول إلى السبا' }, icon: <Flower2 className="w-5 h-5" /> },
  { value: 'gym_access', label: { en: 'Gym Access', ar: 'وصول إلى الصالة الرياضية' }, icon: <Dumbbell className="w-5 h-5" /> },
  { value: 'late_checkout', label: { en: 'Late Checkout', ar: 'تأخير تسجيل المغادرة' }, icon: <Clock className="w-5 h-5" /> },
  { value: 'early_checkin', label: { en: 'Early Check-in', ar: 'تسجيل وصول مبكر' }, icon: <Clock className="w-5 h-5" /> },
  { value: 'extra_bed', label: { en: 'Extra Bed', ar: 'سرير إضافي' }, icon: <Bed className="w-5 h-5" /> },
  { value: 'mini_bar', label: { en: 'Mini Bar', ar: 'ميني بار' }, icon: <Home className="w-5 h-5" /> },
  { value: 'wifi_premium', label: { en: 'Premium WiFi', ar: 'واي فاي مميز' }, icon: <Wifi className="w-5 h-5" /> },
];

type RoomFormProps = {
  initialData?: {
    id: string;
    hotelId: string;
    type: string;
    typeAr?: string | null;
    price: number;
    currency: string;
    available: number;
    description?: string | null;
    descriptionAr?: string | null;
    images: string[];
    maxGuests: number;
    amenities: string[];
    amenitiesAr: string[];
    size?: number | null;
    bedType?: string | null;
    bedTypeAr?: string | null;
    addOns: RoomAddOn[];
    bookingConditions: RoomBookingConditions;
  };
  hotelId?: string;
};

export default function RoomForm({ initialData, hotelId: propHotelId }: RoomFormProps) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translationDirection, setTranslationDirection] = useState<'en-to-ar' | 'ar-to-en'>('en-to-ar');
  const [hotels, setHotels] = useState<Array<{ id: string; name: string; nameAr: string }>>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  // Initialize form data
  const [formData, setFormData] = useState({
    hotelId: initialData?.hotelId || propHotelId || '',
    type: initialData?.type || '',
    typeAr: initialData?.typeAr || '',
    price: initialData?.price?.toString() || '',
    currency: initialData?.currency || 'SAR',
    available: initialData?.available?.toString() || '0',
    description: initialData?.description || '',
    descriptionAr: initialData?.descriptionAr || '',
    images: initialData?.images || [],
    maxGuests: initialData?.maxGuests?.toString() || '2',
    amenities: initialData?.amenities || [],
    amenitiesAr: initialData?.amenitiesAr || [],
    size: initialData?.size?.toString() || '',
    bedType: initialData?.bedType || '',
    bedTypeAr: initialData?.bedTypeAr || '',
    addOns: initialData?.addOns || [],
    bookingConditions: initialData?.bookingConditions || {
      cancellationPolicy: '',
      cancellationPolicyAr: '',
      minimumStay: undefined,
      maximumStay: undefined,
      checkInTime: '',
      checkOutTime: '',
      ageRestriction: undefined,
      smokingAllowed: false,
      petsAllowed: false,
    },
  });

  // Fetch hotels on mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('/api/hotels');
        const data = await response.json();
        if (data.success) {
          setHotels(data.data.map((h: any) => ({ id: h.id, name: h.name, nameAr: h.nameAr })));
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoadingHotels(false);
      }
    };
    fetchHotels();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploading(true);
    try {
      const uploadedImages: string[] = [];

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
        uploadedImages.push(data.data.url);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setImageUploading(false);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Add amenity
  const addAmenity = (lang: 'en' | 'ar') => {
    const amenity = prompt(lang === 'en' ? 'Enter amenity' : 'أدخل الميزة');
    if (amenity && amenity.trim()) {
      setFormData(prev => ({
        ...prev,
        [lang === 'en' ? 'amenities' : 'amenitiesAr']: [...prev[lang === 'en' ? 'amenities' : 'amenitiesAr'], amenity.trim()],
      }));
    }
  };

  // Remove amenity
  const removeAmenity = (index: number, lang: 'en' | 'ar') => {
    setFormData(prev => ({
      ...prev,
      [lang === 'en' ? 'amenities' : 'amenitiesAr']: prev[lang === 'en' ? 'amenities' : 'amenitiesAr'].filter((_, i) => i !== index),
    }));
  };

  // Add add-on
  const addAddOn = () => {
    const newAddOn: RoomAddOn = {
      id: createId(),
      type: 'breakfast',
      included: false,
      price: 0,
      priceCurrency: 'SAR',
      description: '',
      descriptionAr: '',
    };
    setFormData(prev => ({
      ...prev,
      addOns: [...prev.addOns, newAddOn],
    }));
  };

  // Update add-on
  const updateAddOn = (id: string, field: keyof RoomAddOn, value: any) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.map(a => a.id === id ? { ...a, [field]: value } : a),
    }));
  };

  // Remove add-on
  const removeAddOn = (id: string) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.filter(a => a.id !== id),
    }));
  };

  // Handle translation
  const handleTranslate = async () => {
    const isEnToAr = translationDirection === 'en-to-ar';
    
    const hasEnglishContent = !!(formData.type || formData.description || formData.bedType);
    const hasArabicContent = !!(formData.typeAr || formData.descriptionAr || formData.bedTypeAr);
    
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
        const translations = await Promise.all([
          formData.type ? translateText(formData.type, fromLang, toLang) : Promise.resolve(formData.typeAr || ''),
          formData.description ? translateText(formData.description, fromLang, toLang) : Promise.resolve(formData.descriptionAr || ''),
          formData.bedType ? translateText(formData.bedType, fromLang, toLang) : Promise.resolve(formData.bedTypeAr || ''),
        ]);

        setFormData(prev => ({
          ...prev,
          typeAr: translations[0] || prev.typeAr,
          descriptionAr: translations[1] || prev.descriptionAr,
          bedTypeAr: translations[2] || prev.bedTypeAr,
        }));
      } else {
        const translations = await Promise.all([
          formData.typeAr ? translateText(formData.typeAr, fromLang, toLang) : Promise.resolve(formData.type || ''),
          formData.descriptionAr ? translateText(formData.descriptionAr, fromLang, toLang) : Promise.resolve(formData.description || ''),
          formData.bedTypeAr ? translateText(formData.bedTypeAr, fromLang, toLang) : Promise.resolve(formData.bedType || ''),
        ]);

        setFormData(prev => ({
          ...prev,
          type: translations[0] || prev.type,
          description: translations[1] || prev.description,
          bedType: translations[2] || prev.bedType,
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
  const handleSubmit = async () => {
    // Validation
    if (!formData.hotelId) {
      alert('Please select a hotel');
      return;
    }
    if (!formData.type) {
      alert('Please fill in room type');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setLoading(true);

    try {
      const url = '/api/rooms';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          available: parseInt(formData.available) || 0,
          maxGuests: parseInt(formData.maxGuests) || 2,
          size: formData.size ? parseInt(formData.size) : null,
          minimumStay: formData.bookingConditions.minimumStay ? parseInt(formData.bookingConditions.minimumStay.toString()) : undefined,
          maximumStay: formData.bookingConditions.maximumStay ? parseInt(formData.bookingConditions.maximumStay.toString()) : undefined,
          ageRestriction: formData.bookingConditions.ageRestriction ? parseInt(formData.bookingConditions.ageRestriction.toString()) : undefined,
          ...(initialData && { id: initialData.id }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save room');
      }

      router.push('/dashboard/rooms');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save room');
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
            {initialData ? t('dashboard.rooms.editRoom') : t('dashboard.rooms.createRoom')}
          </h1>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? t('dashboard.rooms.updateRoom') : t('dashboard.rooms.createRoom')}
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
        {/* Hotel Selection */}
        {loadingHotels ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel *
            </label>
            <select
              value={formData.hotelId}
              onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={!!propHotelId}
            >
              <option value="">Select a hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {locale === 'ar' ? hotel.nameAr : hotel.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
                Translating...
              </>
            ) : (
              <>
                <Languages className="w-5 h-5" />
                {translationDirection === 'en-to-ar' ? 'Auto Translate to Arabic' : 'Auto Translate to English'}
              </>
            )}
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          {/* English Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              English Content
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type/Name *
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., Standard Room, Deluxe Suite"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Describe the room..."
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bed Type
              </label>
              <input
                type="text"
                value={formData.bedType}
                onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., King Bed, Twin Beds"
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
                نوع/اسم الغرفة *
              </label>
              <input
                type="text"
                value={formData.typeAr}
                onChange={(e) => setFormData({ ...formData, typeAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                placeholder="مثال: غرفة قياسية، جناح فاخر"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                الوصف
              </label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                placeholder="وصف الغرفة..."
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                نوع السرير
              </label>
              <input
                type="text"
                value={formData.bedTypeAr}
                onChange={(e) => setFormData({ ...formData, bedTypeAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                placeholder="مثال: سرير كينغ، سريران توأمان"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pricing & Availability
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Night *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="SAR">SAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Rooms
              </label>
              <input
                type="number"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="2"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Size (sqm)
              </label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., 25"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Room Images */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Room Images
          </h3>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer w-fit">
            {imageUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={imageUploading}
            />
          </label>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Room image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* In-Room Facilities (Amenities) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            In-Room Facilities
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {/* English Amenities */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  English Amenities
                </label>
                <button
                  type="button"
                  onClick={() => addAmenity('en')}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => {
                        const newAmenities = [...formData.amenities];
                        newAmenities[index] = e.target.value;
                        setFormData({ ...formData, amenities: newAmenities });
                      }}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => removeAmenity(index, 'en')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.amenities.length === 0 && (
                  <p className="text-sm text-gray-500">No amenities added yet</p>
                )}
              </div>
            </div>

            {/* Arabic Amenities */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  الميزات العربية
                </label>
                <button
                  type="button"
                  onClick={() => addAmenity('ar')}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-4 h-4" />
                  إضافة
                </button>
              </div>
              <div className="space-y-2">
                {formData.amenitiesAr.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => {
                        const newAmenities = [...formData.amenitiesAr];
                        newAmenities[index] = e.target.value;
                        setFormData({ ...formData, amenitiesAr: newAmenities });
                      }}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-right"
                      dir="rtl"
                    />
                    <button
                      type="button"
                      onClick={() => removeAmenity(index, 'ar')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.amenitiesAr.length === 0 && (
                  <p className="text-sm text-gray-500 text-right">لم تتم إضافة ميزات بعد</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add-on Options */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add-on Options
            </h3>
            <button
              type="button"
              onClick={addAddOn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Add-on
            </button>
          </div>
          {formData.addOns.length === 0 ? (
            <p className="text-sm text-gray-500">No add-ons configured</p>
          ) : (
            <div className="space-y-4">
              {formData.addOns.map((addOn) => (
                <div key={addOn.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Add-on Type
                      </label>
                      <select
                        value={addOn.type}
                        onChange={(e) => updateAddOn(addOn.id, 'type', e.target.value as RoomAddOn['type'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        {addOnTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {locale === 'ar' ? type.label.ar : type.label.en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addOn.included}
                          onChange={(e) => updateAddOn(addOn.id, 'included', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Included in base price</span>
                      </label>
                      {!addOn.included && (
                        <div className="flex-1">
                          <input
                            type="number"
                            value={addOn.price || 0}
                            onChange={(e) => updateAddOn(addOn.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Additional price"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (English)
                      </label>
                      <input
                        type="text"
                        value={addOn.description || ''}
                        onChange={(e) => updateAddOn(addOn.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Optional description"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        الوصف (عربي)
                      </label>
                      <input
                        type="text"
                        value={addOn.descriptionAr || ''}
                        onChange={(e) => updateAddOn(addOn.id, 'descriptionAr', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                        placeholder="وصف اختياري"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAddOn(addOn.id)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Conditions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Booking Conditions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Policy (English)
                </label>
                <textarea
                  value={formData.bookingConditions.cancellationPolicy || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    bookingConditions: { ...formData.bookingConditions, cancellationPolicy: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Free cancellation up to 24 hours before check-in"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  سياسة الإلغاء (عربي)
                </label>
                <textarea
                  value={formData.bookingConditions.cancellationPolicyAr || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    bookingConditions: { ...formData.bookingConditions, cancellationPolicyAr: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                  placeholder="مثال: إلغاء مجاني حتى 24 ساعة قبل تسجيل الوصول"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stay (nights)
                  </label>
                  <input
                    type="number"
                    value={formData.bookingConditions.minimumStay || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      bookingConditions: { ...formData.bookingConditions, minimumStay: e.target.value ? parseInt(e.target.value) : undefined }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 1"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Stay (nights)
                  </label>
                  <input
                    type="number"
                    value={formData.bookingConditions.maximumStay || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      bookingConditions: { ...formData.bookingConditions, maximumStay: e.target.value ? parseInt(e.target.value) : undefined }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 30"
                    min="1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    value={formData.bookingConditions.checkInTime || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      bookingConditions: { ...formData.bookingConditions, checkInTime: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    value={formData.bookingConditions.checkOutTime || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      bookingConditions: { ...formData.bookingConditions, checkOutTime: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Restriction (minimum age)
                </label>
                <input
                  type="number"
                  value={formData.bookingConditions.ageRestriction || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    bookingConditions: { ...formData.bookingConditions, ageRestriction: e.target.value ? parseInt(e.target.value) : undefined }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 18"
                  min="0"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bookingConditions.smokingAllowed || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      bookingConditions: { ...formData.bookingConditions, smokingAllowed: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Smoking Allowed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bookingConditions.petsAllowed || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      bookingConditions: { ...formData.bookingConditions, petsAllowed: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Pets Allowed</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

