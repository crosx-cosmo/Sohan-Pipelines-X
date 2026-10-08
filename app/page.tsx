import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroSection } from '@/components/sections/hero-section';
import { HomeServicesPreview } from '@/components/sections/home-services-preview';
import { HomeAboutPreview } from '@/components/sections/home-about-preview';
import { HomeReviewsPreview } from '@/components/sections/home-reviews-preview';
import { HomeAreasPreview } from '@/components/sections/home-areas-preview';
import { CtaSection } from '@/components/sections/cta-section';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <HomeServicesPreview />
        <HomeAboutPreview />
        <HomeReviewsPreview />
        <HomeAreasPreview />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
