import { Helmet } from 'react-helmet-async';

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
}

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
}: SEOHeadProps) {
  const fullTitle = `${title} | CombienJeGarde.fr`;
  const baseUrl = 'https://combienjeGarde.fr';
  const canonicalUrl = `${baseUrl}${canonical}`;

  const breadcrumbParts = canonical.split('/').filter(Boolean);
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: baseUrl },
    ...breadcrumbParts.map((part, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      item: `${baseUrl}/${breadcrumbParts.slice(0, i + 1).join('/')}`,
    })),
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="CombienJeGarde.fr" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />

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
          publisher: { '@type': 'Organization', name: 'CombienJeGarde.fr', url: baseUrl },
          url: canonicalUrl,
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
      {breadcrumbParts.length > 0 && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        })}</script>
      )}

      {/* JSON-LD SoftwareApplication */}
      {isSoftwareApp && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'CombienJeGarde.fr',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR',
            description: 'Simulation gratuite — Export PDF 4,90€',
          },
          description: 'Simulateur de revenu net pour auto-entrepreneurs français. Calculez vos cotisations URSSAF, impôts et revenu net en temps réel.',
          inLanguage: 'fr-FR',
        })}</script>
      )}

      {/* JSON-LD WebSite with SearchAction */}
      {isSoftwareApp && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'CombienJeGarde.fr',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/guide?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        })}</script>
      )}
    </Helmet>
  );
}
