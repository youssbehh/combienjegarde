import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import FAQ from '../components/layout/FAQ';
import Simulateur from '../components/simulateur/Simulateur';
import ArticleCard from '../components/blog/ArticleCard';
import { useSimulateurStore } from '../store/simulateurStore';
import { calculerRevenuNet } from '../lib/calculs';
import { ANNEE_COURANTE, TAUX_PAR_ANNEE, formatTaux } from '../lib/constants';
import { articles } from './blog/articles';

const taux = TAUX_PAR_ANNEE[ANNEE_COURANTE];
const exempleBNC = calculerRevenuNet({
  ca: 3000,
  secteur: 'bnc',
  annee: ANNEE_COURANTE,
  prelevementLiberatoire: false,
  revenuFiscalRef: 0,
  nbParts: 1,
});

const faqItems = [
  { question: `Combien reste-t-il après cotisations en auto-entreprise en ${ANNEE_COURANTE} ?`, answer: `En ${ANNEE_COURANTE}, les cotisations vont de ${formatTaux(taux.cotisations.bic_vente)} (vente de marchandises) à ${formatTaux(taux.cotisations.bnc)} (professions libérales) du chiffre d'affaires. Exemple : en BNC avec 3 000 € par mois, une personne seule sans autre revenu garde environ ${exempleBNC.revenuNet.toLocaleString('fr-FR')} € après cotisations, impôt et CFE.` },
  { question: "Comment calculer son revenu net d'auto-entrepreneur ?", answer: `Revenu net = chiffre d'affaires − cotisations URSSAF − impôt sur le revenu − CFE. Le simulateur fait ce calcul avec les taux officiels 2025 et ${ANNEE_COURANTE}.` },
  { question: "Qu'est-ce que le versement libératoire ?", answer: "Le versement (ou prélèvement) libératoire est une option qui permet de payer l'impôt sur le revenu en même temps que les cotisations, sous la forme d'un pourcentage fixe du chiffre d'affaires : 1 %, 1,7 % ou 2,2 % selon l'activité. Il est soumis à un plafond de revenus du foyer." },
  { question: `Quels changements pour les auto-entrepreneurs en ${ANNEE_COURANTE} ?`, answer: `En ${ANNEE_COURANTE} : cotisations BNC portées à ${formatTaux(taux.cotisations.bnc)}, plafonds de chiffre d'affaires relevés à ${taux.plafonds_ca.bnc.toLocaleString('fr-FR')} € (services) et ${taux.plafonds_ca.bic_vente.toLocaleString('fr-FR')} € (vente), ACRE réduite à 25 % pour les créations à partir du 1er juillet, et réception obligatoire des factures électroniques depuis le 1er septembre.` },
  { question: 'Auto-entrepreneur ou SASU : lequel choisir ?', answer: "À chiffre d'affaires égal et sans frais professionnels, l'auto-entreprise laisse en général un revenu net supérieur. La SASU devient pertinente à l'approche du plafond du régime micro, en cas de frais importants ou pour une meilleure protection sociale." },
];

const stepLabels = ['Votre activité', 'Situation fiscale', 'Résultats'];

const sources = [
  { label: 'URSSAF', href: 'https://www.autoentrepreneur.urssaf.fr' },
  { label: 'impots.gouv.fr', href: 'https://www.impots.gouv.fr' },
  { label: 'service-public.gouv.fr', href: 'https://entreprendre.service-public.gouv.fr' },
  { label: 'legifrance.gouv.fr', href: 'https://www.legifrance.gouv.fr' },
];

export default function Home() {
  const { step, annee, recommencer, setStep } = useSimulateurStore();

  return (
    <>
      <SEOHead
        title={`Simulateur revenu net auto-entrepreneur ${ANNEE_COURANTE} — Taux officiels URSSAF`}
        description={`Calculez votre revenu net d'auto-entrepreneur en 2 minutes. Cotisations URSSAF, impôts, CFE : résultat immédiat avec les taux officiels ${ANNEE_COURANTE} (et 2025 pour comparaison).`}
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
          <ul className="flex flex-wrap justify-center gap-4 mb-10">
            {[`Taux officiels ${ANNEE_COURANTE}`, 'Sans inscription', 'Simulation gratuite'].map((badge) => (
              <li
                key={badge}
                className="font-corps text-sm text-blue-100 px-4 py-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                ✓ {badge}
              </li>
            ))}
          </ul>
          <a
            href="#simulateur"
            className="inline-block font-titre font-bold text-bleu-marine rounded-xl px-8 py-4 transition-all hover:-translate-y-0.5 bg-vert-menthe"
            style={{ fontSize: '16px' }}
          >
            Calculer mon revenu net →
          </a>
        </div>
      </section>

      {/* SIMULATEUR */}
      <section id="simulateur" className="max-w-4xl mx-auto px-6 py-16 scroll-mt-16">
        <h2 className="sr-only">Simulateur de revenu net</h2>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <ol className="flex items-center gap-2">
            {stepLabels.map((label, i) => {
              const num = (i + 1) as 1 | 2 | 3;
              const active = step === num;
              const done = step > num;
              return (
                <li key={label} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() => setStep(num)}
                    disabled={!done}
                    aria-current={active ? 'step' : undefined}
                    aria-label={done ? `Revenir à l'étape ${num} : ${label}` : `Étape ${num} : ${label}`}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center font-titre font-bold text-sm transition-all"
                      style={{
                        background: active ? '#1B2D6B' : done ? '#1A9E92' : '#E9ECEF',
                        color: active || done ? '#fff' : '#495057',
                      }}
                    >
                      {done ? '✓' : num}
                    </span>
                    <span className={`font-corps text-sm hidden md:block ${active ? 'text-bleu-marine font-semibold' : done ? 'text-vert-fonce hover:underline' : 'text-gris-moyen'}`}>
                      {label}
                    </span>
                  </button>
                  {i < stepLabels.length - 1 && <span aria-hidden="true" className="w-8 h-0.5 bg-gris-clair mx-1" />}
                </li>
              );
            })}
          </ol>

          {step > 1 && (
            <button
              type="button"
              onClick={recommencer}
              className="ml-4 font-corps text-xs text-gris-moyen hover:text-rouge-charges transition-colors flex items-center gap-1 border border-gris-clair rounded-lg px-3 py-1.5 hover:border-rouge-charges"
            >
              ↺ Recommencer
            </button>
          )}
        </div>

        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          {step === 3 && (
            <p className="mb-6">
              <span
                className="font-corps text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: 'rgba(46,196,182,0.12)', color: '#147D73' }}
              >
                Simulation basée sur les taux {annee}
              </span>
            </p>
          )}
          <Simulateur />
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
              { icon: '📊', title: 'Entrez votre CA', desc: `Renseignez votre chiffre d'affaires, choisissez votre secteur et l'année (2025 ou ${ANNEE_COURANTE}).` },
              { icon: '⚙️', title: 'Ajoutez votre profil fiscal', desc: "Optionnel : précisez les autres revenus de votre foyer et votre quotient familial pour un résultat plus juste." },
              { icon: '💰', title: 'Obtenez votre résultat', desc: 'Visualisez votre revenu net après cotisations, impôt et CFE, et comparez avec la SASU et le portage.' },
            ].map((s) => (
              <div key={s.title} className="text-center">
                <span className="text-4xl block mb-4" aria-hidden="true">{s.icon}</span>
                <h3 className="font-titre font-bold text-bleu-marine text-lg mb-2">{s.title}</h3>
                <p className="font-corps text-sm text-gris-moyen leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqItems} className="max-w-3xl mx-auto px-6 py-16" />

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
            Voir tous les articles et l'actualité →
          </Link>
        </div>
      </section>

      {/* SOURCES */}
      <section className="bg-blanc-casse py-12 px-6 border-t border-gris-clair">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-corps text-sm text-gris-moyen mb-6">Nos données proviennent de sources officielles</p>
          <div className="flex flex-wrap justify-center gap-6">
            {sources.map((src) => (
              <a
                key={src.label}
                href={src.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-corps text-sm font-medium text-bleu-marine hover:text-vert-fonce transition-colors px-4 py-2 rounded-lg border border-gris-clair bg-white"
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
