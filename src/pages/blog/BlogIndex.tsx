import SEOHead from '../../components/layout/SEOHead';
import ArticleCard from '../../components/blog/ArticleCard';
import { articles } from './articles';

export default function BlogIndex() {
  return (
    <>
      <SEOHead
        title="Guide auto-entrepreneur 2025 — Fiscalité, cotisations, impôts"
        description="Tous nos guides pour auto-entrepreneurs : cotisations URSSAF, impôts, TVA, prélèvement libératoire. Explications claires avec les taux 2025."
        canonical="/guide"
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="font-titre font-extrabold text-bleu-marine text-4xl mb-4">
            Guide auto-entrepreneur 2025
          </h1>
          <p className="font-corps text-gris-moyen text-lg max-w-2xl">
            Tout comprendre sur la fiscalité, les cotisations et l'optimisation de votre statut. Données basées sur les sources officielles 2025.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
      </div>
    </>
  );
}
