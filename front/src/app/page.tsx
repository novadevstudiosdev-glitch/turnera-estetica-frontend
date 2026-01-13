'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/Services';
import { VideoPresentationSection } from '@/components/sections/VideoPresentation';
import { TestimonialsSection } from '@/components/sections/Testimonials';
import { BrandsCarouselSection } from '@/components/sections/BrandsCarousel';
import { LocationSection } from '@/components/sections/Location';
import { ContactSection } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <VideoPresentationSection />
        <BrandsCarouselSection />
        <TestimonialsSection />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
