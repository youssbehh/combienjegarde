import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL } from '../../lib/site';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  type?: 'website' | 'article';
  datePublished?: string;
  dateModified?: string;
  faqItems?: { question: string; answer: string }[];
  isSoftwareApp?: boolean;
  noindex?: boolean;
}

const LIBELLES_FIL_ARIANE: Record<string, string> = {
  guide: 'Guide',
  comparateur: 'Comparateur',
};

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = '/og/default.png',
  type = 'website',
  datePublished,
  dateModified,
  faqItems,
  isSoftwareApp,
  noindex,
}: SEOHeadProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${canonical === '/' ? '/' : canonical}`;
  const ogImageUrl = `${SITE_URL}${ogImage}`;

  const segments = canonical.split('/').filter(Boolean);
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
    ...segments.map((segment, i) => {
      const estDernier = i === segments.length - 1;
      return {
        '@type': 'ListItem',
        position: i + 2,
        name: estDernier ? title : (LIBELLES_FIL_ARIANE[segment] ?? segment),
        item: `${SITE_URL}/${segments.slice(0, i + 1).join('/')}`,
      };
    }),
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Article dates */}
      {datePublished && <meta property="article:published_time" content={datePublished} />}
      {dateModified && <meta property="article:modified_time" content={dateModified} />}

      {/* JSON-LD Article */}
      {type === 'article' && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          datePublished,
          dateModified,
          image: ogImageUrl,
          publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          mainEntityOfPage: canonicalUrl,
        })}</script>
      )}

      {/* JSON-LD FAQ */}
      {faqItems && faqItems.length > 0 && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        })}</script>
      )}

      {/* JSON-LD Breadcrumb */}
      {segments.length > 0 && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        })}</script>
      )}

      {/* JSON-LD WebApplication : le simulateur lui-même est gratuit */}
      {isSoftwareApp && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: SITE_NAME,
          url: SITE_URL,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          description: 'Simulateur de revenu net pour auto-entrepreneurs français : cotisations URSSAF, impôt sur le revenu et CFE.',
          inLanguage: 'fr-FR',
        })}</script>
      )}

      {isSoftwareApp && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          inLanguage: 'fr-FR',
        })}</script>
      )}
    </Helmet>
  );
}
