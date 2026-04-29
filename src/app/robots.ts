import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/uzivatel/', '/the-cheats/', '/vip-club/'],
    },
    sitemap: 'https://mmbarber.cz/sitemap.xml',
  };
}
