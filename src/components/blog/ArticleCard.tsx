import { Link } from 'react-router-dom';

interface Props {
  slug: string;
  title: string;
  description: string;
  readingTime: number;
  dateModified: string;
}

export default function ArticleCard({ slug, title, description, readingTime, dateModified }: Props) {
  return (
    <Link
      to={`/guide/${slug}`}
      className="block bg-white rounded-card shadow-card hover:shadow-card-hover transition-shadow duration-200 p-6 group"
    >
      <div className="flex items-center gap-3 mb-3 text-xs font-corps text-gris-moyen">
        <span>⏱️ {readingTime} min</span>
        <span>•</span>
        <span>{new Date(dateModified).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
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
