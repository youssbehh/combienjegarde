import type { ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ArticleLayout from '../../components/blog/ArticleLayout';
import { articles } from './articles';
import { articlesFiscalite } from './contenu/fiscalite';
import { articlesFacturation } from './contenu/facturation-electronique';

const articleContent: Record<string, ReactNode> = {
  ...articlesFiscalite,
  ...articlesFacturation,
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/guide" replace />;

  const content = articleContent[article.slug] ?? (
    <p className="font-corps text-gris-moyen">Contenu bientôt disponible.</p>
  );

  return (
    <ArticleLayout {...article}>
      {content}
      <div className="mt-8 pt-6 border-t border-gris-clair">
        <Link to="/guide" className="font-corps text-sm text-bleu-marine underline">
          ← Retour aux articles
        </Link>
      </div>
    </ArticleLayout>
  );
}
