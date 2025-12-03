'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Loader2, Coffee, Wifi, Heart } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export function FeaturedHotels() {
  const { t, locale } = useI18n();
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('/api/hotels');
        const data = await response.json();
        if (data.success) {
          setHotels(data.data.slice(0, 4));
        }
      } catch (error) {
        console.error('[v0] Error fetching hotels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#B99B75] mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('hotels.featured')}
          </h2>
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            {t('hotels.discover')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="group flex flex-col justify-between overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card rounded-2xl"
            >
              {/* --- Image Section --- */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={hotel.image || '/placeholder.svg'}
                  alt={locale === 'ar' ? hotel.nameAr : hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay for text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Favorite/Heart Button (Top End) */}
                <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors text-white">
                  <Heart className="w-5 h-5" />
                </button>

                {/* Badge (Optional - e.g. "Popular") */}
                <div className="absolute top-4 left-4 bg-primary/90 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                  {locale === 'ar' ? 'مميز' : 'FEATURED'}
                </div>
              </div>

              {/* --- Content Section --- */}
              <CardContent className="flex-grow p-5 space-y-4">
                {/* Title & Rating Row */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                    {locale === 'ar' ? hotel.nameAr : hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded text-sm font-semibold whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-muted-foreground">
                  {/* 'me-1.5' means margin-end (margin-left in LTR, margin-right in RTL) */}
                  <MapPin className="w-4 h-4 me-1.5 flex-shrink-0 text-primary/70" />
                  <span className="line-clamp-1">
                    {locale === 'ar' ? hotel.locationAr : hotel.location}
                  </span>
                </div>

                {/* Amenities Preview (Visual Sugar) */}
                <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Wifi className="w-3.5 h-3.5" />
                    <span>{locale === 'ar' ? 'وايفاي' : 'Wifi'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>{locale === 'ar' ? 'فطور' : 'Breakfast'}</span>
                  </div>
                </div>
              </CardContent>

              {/* --- Footer Section (Price + Action) --- */}
              <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between gap-3">
                {/* Price Section */}
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground line-through decoration-red-400">
                    ${(hotel.price * 1.2).toFixed(0)}{' '}
                    {/* Fake original price for effect */}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-foreground">
                      ${hotel.price}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      /{t('hotels.night')}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/booking?hotelId=${hotel.id}`}>
                  <Button
                    size="sm"
                    className="px-6 h-10 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all rounded-lg font-semibold"
                  >
                    {t('hotels.bookNow')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/booking">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              {t('hotels.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedHotels;
