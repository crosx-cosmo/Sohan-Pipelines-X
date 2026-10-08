import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="pt-20 md:pt-24 min-h-[calc(100vh-250px)]">{children}</main>
      <SiteFooter />
    </>
  );
}
