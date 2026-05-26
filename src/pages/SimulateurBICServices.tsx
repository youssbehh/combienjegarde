import { useEffect } from 'react';
import SEOHead from '../components/layout/SEOHead';
import { useSimulateurStore } from '../store/simulateurStore';
import StepFiscal from '../components/simulateur/StepFiscal';
import ResultCard from '../components/simulateur/ResultCard';
import DonutChart from '../components/simulateur/DonutChart';
import ComparateurRegimes from '../components/simulateur/ComparateurRegimes';
import PDFExportButton from '../components/simulateur/PDFExportButton';
import StepSecteur from '../components/simulateur/StepSecteur';

const faq = [
  { question: 'Quel est le taux de cotisations en BIC Services ?', answer: 'En 2025, le taux est de 21,2% du CA pour les prestations de services commerciales (BIC Services).' },
  { question: 'Quelle est la différence entre BIC Services et BNC ?', answer: 'Le BIC Services concerne les activités commerciales de services (agence, conseil commercial). Le BNC concerne les professions libérales et intellectuelles.' },
  { question: 'Quel abattement forfaitaire en BIC Services ?', answer: '50% d\'abattement forfaitaire. Vous êtes imposé sur 50% de votre CA annuel.' },
];

export default function SimulateurBICServices() {
  const { setSecteur, step, resultats, comparatif, ca, secteur, reset, recommencer, setStep } = useSimulateurStore();

  useEffect(() => {
    setSecteur('bic_services');
    setStep(1);
  }, [setSecteur, setStep]);

  return (
    <>
      <SEOHead
        title="Simulateur revenu net BIC Services 2025 — Conseil, formation, agence"
        description="Calculez votre revenu net en BIC Services (prestations) après cotisations URSSAF (21,2%) et impôts. Taux officiels 2025."
        canonical="/simulateur-bic-services"
        faqItems={faq}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-4">
            Simulateur de revenu net BIC Services 2025
          </h1>
          <p className="font-corps text-gris-moyen leading-relaxed max-w-2xl">
            Activité de conseil, formation, agence ou autre prestation de service commerciale ? En BIC Services, les cotisations sont de <strong>21,2%</strong> et l'abattement forfaitaire de <strong>50%</strong>.
          </p>
        </div>

        <div className="bg-white rounded-card shadow-card p-8 mb-12">
          {step === 1 && <StepSecteur />}
          {step === 2 && <StepFiscal />}
          {step === 3 && resultats && comparatif && (
            <div className="flex flex-col gap-8">
              <ResultCard resultats={resultats} onRecommencer={recommencer} onReset={reset} />
              <DonutChart resultats={resultats} />
              <ComparateurRegimes comparatif={comparatif} caAnnuel={ca * 12} />
              <PDFExportButton resultats={resultats} comparatif={comparatif} secteur={secteur} />
            </div>
          )}
        </div>

        <section>
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-6">Questions fréquentes</h2>
          <div className="flex flex-col gap-3">
            {faq.map((item) => (
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
      </div>
    </>
  );
}
