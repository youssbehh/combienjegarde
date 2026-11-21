import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <Helmet>
        <title>Page introuvable | CombienJeGarde</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <p className="font-titre font-bold text-bleu-marine text-8xl mb-4">404</p>
      <h1 className="font-titre font-bold text-bleu-marine text-2xl mb-4">Page introuvable</h1>
      <p className="font-corps text-gris-moyen mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link
        to="/"
        className="inline-block font-titre font-bold text-white rounded-xl px-6 py-3 bg-bleu-marine hover:bg-bleu-moyen transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
