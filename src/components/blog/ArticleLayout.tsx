import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { ArticleData } from '../../types';
import SEOHead from '../layout/SEOHead';

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
        <nav className="flex items-center gap-2 font-corps text-sm text-gris-moyen mb-8">
          <Link to="/" className="hover:text-bleu-marine transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/guide" className="hover:text-bleu-marine transition-colors">Guide</Link>
          <span>/</span>
          <span className="text-bleu-marine">{title}</span>
        </nav>

        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-xs font-corps text-gris-moyen mb-4">
              <span>Mis à jour : {new Date(dateModified).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
              className="inline-block font-titre font-bold text-white rounded-xl px-6 py-3 transition-all hover:-translate-y-0.5"
              style={{ background: '#2EC4B6' }}
            >
              Utiliser le simulateur →
            </Link>
          </div>

          {/* FAQ */}
          {faq.length > 0 && (
            <section className="mt-12">
              <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-6">Questions fréquentes</h2>
              <div className="flex flex-col gap-3">
                {faq.map((item) => (
                  <details
                    key={item.question}
                    className="bg-white rounded-card shadow-card group"
                  >
                    <summary className="p-5 font-titre font-semibold text-bleu-marine cursor-pointer list-none flex items-center justify-between">
                      {item.question}
                      <span className="text-vert-menthe font-bold group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="px-5 pb-5 font-corps text-sm text-gris-fonce leading-relaxed">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
