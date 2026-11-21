import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { ArticleData } from '../../types';
import SEOHead from '../layout/SEOHead';
import FAQ from '../layout/FAQ';

interface Props extends ArticleData {
  children: ReactNode;
}

export default function ArticleLayout({ slug, title, description, datePublished, dateModified, readingTime, summary, faq, children }: Props) {
  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={`/guide/${slug}`}
        type="article"
        datePublished={datePublished}
        dateModified={dateModified}
        faqItems={faq}
      />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 font-corps text-sm text-gris-moyen mb-8">
          <Link to="/" className="hover:text-bleu-marine transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/guide" className="hover:text-bleu-marine transition-colors">Guide</Link>
          <span>/</span>
          <span aria-current="page" className="text-bleu-marine">{title}</span>
        </nav>

        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-xs font-corps text-gris-moyen mb-4">
              <span>Mis à jour le <time dateTime={dateModified}>{new Date(`${dateModified}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</time></span>
              <span>•</span>
              <span>⏱️ {readingTime} min de lecture</span>
            </div>
            <h1 className="font-titre font-extrabold text-bleu-marine text-3xl leading-tight mb-4">{title}</h1>
          </header>

          {/* Summary box */}
          <aside
            className="p-5 rounded-card mb-10 font-corps text-sm leading-relaxed"
            style={{ background: 'rgba(46, 196, 182, 0.08)', border: '1px solid rgba(46, 196, 182, 0.3)' }}
          >
            <strong className="text-vert-fonce">En résumé : </strong>
            <span className="text-gris-fonce">{summary}</span>
          </aside>

          {/* Content */}
          <div className="prose-article">{children}</div>

          {/* CTA simulateur */}
          <div
            className="mt-12 p-8 rounded-card-lg text-center"
            style={{ background: 'linear-gradient(135deg, #1B2D6B 0%, #2A4494 100%)' }}
          >
            <h3 className="font-titre font-bold text-white text-xl mb-2">Calculez votre revenu net en 2 minutes</h3>
            <p className="font-corps text-blue-200 text-sm mb-4">Cotisations, impôts, CFE : on calcule tout pour vous.</p>
            <Link
              to="/#simulateur"
              className="inline-block font-titre font-bold text-bleu-marine rounded-xl px-6 py-3 transition-all hover:-translate-y-0.5 bg-vert-menthe"
            >
              Utiliser le simulateur →
            </Link>
          </div>

          <FAQ items={faq} className="mt-12" />
        </article>
      </div>
    </>
  );
}
