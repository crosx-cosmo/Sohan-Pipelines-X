import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sohan-pipelines.netlify.app';
  const currentDate = new Date().toISOString().split('T')[0];

  const routes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/services', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/book', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/service-areas', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/reviews', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/find-booking', changeFrequency: 'always' as const, priority: 0.6 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
