import { articles } from './pages/blog/articles';
import { PAIEMENT_ACTIF } from './lib/site';

export interface RouteStatique {
  path: string;
  priority: number;
  changefreq: 'weekly' | 'monthly' | 'yearly';
  lastmod?: string;
  /** Page pré-rendue mais absente du sitemap. */
  horsSitemap?: boolean;
}

/** Toutes les pages du site : sert au pré-rendu et à la génération du sitemap. */
export const ROUTES_STATIQUES: RouteStatique[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/simulateur-bnc', priority: 0.9, changefreq: 'monthly' },
  { path: '/simulateur-bic-services', priority: 0.9, changefreq: 'monthly' },
  { path: '/simulateur-bic-vente', priority: 0.9, changefreq: 'monthly' },
  { path: '/comparateur/ae-vs-sasu', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide', priority: 0.8, changefreq: 'weekly' },
  ...articles.map((article) => ({
    path: `/guide/${article.slug}`,
    priority: 0.7,
    changefreq: 'monthly' as const,
    lastmod: article.dateModified,
  })),
  { path: '/mentions-legales', priority: 0.2, changefreq: 'yearly' },
  { path: '/cgv', priority: 0.2, changefreq: 'yearly', horsSitemap: !PAIEMENT_ACTIF },
];
