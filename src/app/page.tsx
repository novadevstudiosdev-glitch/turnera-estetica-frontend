'use client';

import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/Services';
import { ProductsCarouselSection } from '@/components/sections/ProductsCarousel';
import { TestimonialsSection } from '@/components/sections/Testimonials';
import { BrandsCarouselSection } from '@/components/sections/BrandsCarousel';
import { LocationSection } from '@/components/sections/Location';

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsCarouselSection />
        <TestimonialsSection />
        <BrandsCarouselSection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
