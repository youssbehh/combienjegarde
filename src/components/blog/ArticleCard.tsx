import { Link } from 'react-router-dom';
import type { ArticleData } from '../../types';

const badgeColors: Record<NonNullable<ArticleData['badge']>, { bg: string; text: string }> = {
  '2025': { bg: 'rgba(27,45,107,0.08)',  text: '#1B2D6B' },
  '2026': { bg: 'rgba(46,196,182,0.12)', text: '#1A9E92' },
  'Nouveau': { bg: 'rgba(255,107,53,0.12)', text: '#E85A25' },
};

type Props = Pick<ArticleData, 'slug' | 'title' | 'description' | 'readingTime' | 'dateModified' | 'badge'>;

export default function ArticleCard({ slug, title, description, readingTime, dateModified, badge }: Props) {
  const badgeStyle = badge ? badgeColors[badge] : null;

  return (
    <Link
      to={`/guide/${slug}`}
      className="block bg-white rounded-card shadow-card hover:shadow-card-hover transition-shadow duration-200 p-6 group"
    >
      <div className="flex items-center gap-3 mb-3">
        {badge && badgeStyle && (
          <span
            className="font-titre font-bold text-xs px-2.5 py-1 rounded-full"
            style={{ background: badgeStyle.bg, color: badgeStyle.text }}
          >
            {badge}
          </span>
        )}
        <span className="font-corps text-xs text-gris-moyen">⏱️ {readingTime} min</span>
        <span className="font-corps text-xs text-gris-moyen">
          {new Date(dateModified).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      <h3 className="font-titre font-bold text-bleu-marine group-hover:text-bleu-moyen transition-colors mb-2 text-lg leading-snug">
        {title}
      </h3>
      <p className="font-corps text-sm text-gris-moyen leading-relaxed line-clamp-2">{description}</p>
      <span className="mt-4 inline-block font-corps text-sm text-vert-menthe font-medium">
        Lire l'article →
      </span>
    </Link>
  );
}
