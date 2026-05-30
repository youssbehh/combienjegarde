import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import StepSecteur from '../components/simulateur/StepSecteur';
import StepFiscal from '../components/simulateur/StepFiscal';
import ResultCard from '../components/simulateur/ResultCard';
import DonutChart from '../components/simulateur/DonutChart';
import ComparateurRegimes from '../components/simulateur/ComparateurRegimes';
import PDFExportButton from '../components/simulateur/PDFExportButton';
import ArticleCard from '../components/blog/ArticleCard';
import { useSimulateurStore } from '../store/simulateurStore';
import { articles } from './blog/articles';

const faqItems = [
  { question: 'Combien reste-t-il après cotisations en auto-entreprise en 2026 ?', answer: 'En 2026, les cotisations vont de 12,3% (BIC vente) à 24,6% (BNC, hausse réforme retraites). En BNC avec 3 000€/mois, il reste environ 2 150€ après cotisations et impôts.' },
  { question: "Comment calculer son revenu net d'auto-entrepreneur ?", answer: 'Revenu net = CA - cotisations URSSAF - impôt sur le revenu - CFE. Notre simulateur fait ce calcul automatiquement avec les taux officiels 2025 et 2026.' },
  { question: "Qu'est-ce que le prélèvement libératoire ?", answer: "Le prélèvement libératoire est une option fiscale qui vous permet de payer l'impôt sur le revenu en même temps que vos cotisations, sous forme d'un pourcentage fixe de votre CA." },
  { question: "Quels changements pour les auto-entrepreneurs en 2026 ?", answer: "En 2026 : hausse des cotisations BNC à 24,6%, barème IR revalorisé de +1,8%, et début de l'obligation d'e-facturation pour les grandes entreprises (auto-entrepreneurs concernés en 2027)." },
  { question: 'Auto-entrepreneur vs SASU : lequel choisir ?', answer: "L'auto-entreprise est idéale pour démarrer et pour les CA inférieurs à 50 000€/an. La SASU devient avantageuse au-delà, notamment pour optimiser les charges sociales." },
];

export default function Home() {
  const { step, resultats, comparatif, ca, secteur, annee, recommencer, reset } = useSimulateurStore();
  const { setStep } = useSimulateurStore();

  const stepLabels = ['Votre activité', 'Situation fiscale', 'Résultats'];

  return (
    <>
      <SEOHead
        title="Simulateur revenu net auto-entrepreneur 2026 — Taux officiels URSSAF"
        description="Calculez votre revenu net d'auto-entrepreneur en 2 minutes. Cotisations URSSAF, impôts, CFE : résultat immédiat avec les taux officiels 2026 (et 2025 pour comparaison)."
        canonical="/"
        faqItems={faqItems}
        isSoftwareApp
      />

      {/* HERO */}
      <section className="bg-bleu-marine text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-titre font-extrabold text-4xl md:text-5xl leading-tight mb-4">
            Combien vous reste-t-il vraiment ?
          </h1>
          <p className="font-corps text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Calculez votre revenu net d'auto-entrepreneur en 2 minutes.<br />
            Cotisations URSSAF, impôts, CFE : on calcule tout pour vous.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['✓ Taux 2026 officiel', '✓ Sans inscription', '✓ 100% gratuit'].map((badge) => (
              <span
                key={badge}
                className="font-corps text-sm text-blue-100 px-4 py-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {badge}
              </span>
            ))}
          </div>
          <a
            href="#simulateur"
            className="inline-block font-titre font-bold text-white rounded-xl px-8 py-4 transition-all hover:-translate-y-0.5"
            style={{ background: '#2EC4B6', fontSize: '16px' }}
          >
            Calculer mon revenu net →
          </a>
        </div>
      </section>

      {/* SIMULATEUR */}
      <section id="simulateur" className="max-w-4xl mx-auto px-6 py-16">
        {/* Stepper cliquable */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {stepLabels.map((label, i) => {
            const num = (i + 1) as 1 | 2 | 3;
            const active = step === num;
            const done = step > num;
            const clickable = done || (num < step);
            return (
              <div key={label} className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 group"
                  onClick={() => clickable && setStep(num)}
                  disabled={!clickable && !active}
                  title={done ? `Revenir à : ${label}` : undefined}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-titre font-bold text-sm transition-all"
                    style={{
                      background: active ? '#1B2D6B' : done ? '#2EC4B6' : '#E9ECEF',
                      color: active || done ? '#fff' : '#6C757D',
                      cursor: clickable ? 'pointer' : 'default',
                    }}
                  >
                    {done ? '✓' : num}
                  </span>
                  <span className={`font-corps text-sm hidden md:block ${active ? 'text-bleu-marine font-semibold' : done ? 'text-vert-menthe hover:underline cursor-pointer' : 'text-gris-moyen'}`}>
                    {label}
                  </span>
                </button>
                {i < stepLabels.length - 1 && (
                  <span className="w-8 h-0.5 bg-gris-clair mx-1" />
                )}
              </div>
            );
          })}

          {/* Bouton recommencer visible depuis l'étape 2 et 3 */}
          {step > 1 && (
            <button
              onClick={recommencer}
              className="ml-6 font-corps text-xs text-gris-moyen hover:text-rouge-charges transition-colors flex items-center gap-1 border border-gris-clair rounded-lg px-3 py-1.5 hover:border-rouge-charges"
            >
              ↺ Recommencer
            </button>
          )}
        </div>

        <div className="bg-white rounded-card shadow-card p-8">
          {step === 1 && <StepSecteur />}
          {step === 2 && <StepFiscal />}
          {step === 3 && resultats && comparatif && (
            <div className="flex flex-col gap-8 animate-fadeInUp">
              {/* Badge année */}
              <div className="flex items-center justify-between">
                <span
                  className="font-corps text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: annee === 2026 ? 'rgba(46,196,182,0.12)' : 'rgba(27,45,107,0.08)', color: annee === 2026 ? '#1A9E92' : '#1B2D6B' }}
                >
                  Simulation basée sur les taux {annee}
                </span>
                <button
                  onClick={recommencer}
                  className="font-corps text-sm text-bleu-marine hover:text-vert-menthe transition-colors flex items-center gap-1.5"
                >
                  ↺ Modifier ma simulation
                </button>
              </div>
              <ResultCard resultats={resultats} onRecommencer={recommencer} onReset={reset} />
              <DonutChart resultats={resultats} />
              <ComparateurRegimes comparatif={comparatif} caAnnuel={ca * 12} />
              <PDFExportButton resultats={resultats} comparatif={comparatif} secteur={secteur} />
            </div>
          )}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-titre font-bold text-bleu-marine text-3xl text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📊', title: 'Entrez votre CA', desc: "Renseignez votre chiffre d'affaires mensuel, choisissez votre secteur et l'année fiscale (2025 ou 2026)." },
              { icon: '⚙️', title: 'Ajoutez votre profil fiscal', desc: 'Optionnel : précisez votre tranche d\'impôt et quotient familial pour un résultat plus précis.' },
              { icon: '💰', title: 'Obtenez votre résultat', desc: 'Visualisez instantanément votre revenu net après cotisations, impôts et CFE.' },
            ].map((s) => (
              <div key={s.icon} className="text-center">
                <span className="text-4xl block mb-4">{s.icon}</span>
                <h3 className="font-titre font-bold text-bleu-marine text-lg mb-2">{s.title}</h3>
                <p className="font-corps text-sm text-gris-moyen leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-titre font-bold text-bleu-marine text-3xl mb-8">Questions fréquentes</h2>
        <div className="flex flex-col gap-3">
          {faqItems.map((item) => (
            <details key={item.question} className="bg-white rounded-card shadow-card group">
              <summary className="p-5 font-titre font-semibold text-bleu-marine cursor-pointer list-none flex justify-between items-center">
                {item.question}
                <span className="text-vert-menthe font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-5 pb-5 font-corps text-sm text-gris-fonce leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-titre font-bold text-bleu-marine text-3xl mb-8">Guides et articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...articles]
            .sort((a, b) => b.dateModified.localeCompare(a.dateModified))
            .slice(0, 6)
            .map((a) => (
              <ArticleCard key={a.slug} {...a} />
            ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/guide" className="inline-block font-corps font-medium text-bleu-marine hover:text-bleu-moyen transition-colors border-b border-bleu-marine/30 hover:border-bleu-moyen">
            Voir tous les articles →
          </Link>
        </div>
      </section>

      {/* SOURCES */}
      <section className="bg-blanc-casse py-12 px-6 border-t border-gris-clair">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-corps text-sm text-gris-moyen mb-6">Nos données proviennent exclusivement de sources officielles</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'URSSAF', href: 'https://www.autoentrepreneur.urssaf.fr' },
              { label: 'impots.gouv.fr', href: 'https://www.impots.gouv.fr' },
              { label: 'service-public.fr', href: 'https://www.service-public.fr' },
              { label: 'legifrance.gouv.fr', href: 'https://www.legifrance.gouv.fr' },
            ].map((src) => (
              <a
                key={src.label}
                href={src.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-corps text-sm font-medium text-bleu-marine hover:text-vert-menthe transition-colors px-4 py-2 rounded-lg border border-gris-clair bg-white"
              >
                {src.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
