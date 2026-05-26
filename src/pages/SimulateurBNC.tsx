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
  { question: 'Quel est le taux de cotisations URSSAF en BNC ?', answer: 'En 2025, le taux est de 23,1% du CA pour les professions libérales non réglementées (BNC).' },
  { question: 'Qu\'est-ce que le BNC ?', answer: 'Le BNC (Bénéfices Non Commerciaux) est le régime fiscal des professions libérales : développeurs, designers, consultants, médecins, avocats, etc.' },
  { question: 'Quel est l\'abattement forfaitaire en BNC ?', answer: 'L\'abattement forfaitaire est de 34% en BNC. Votre revenu imposable est donc 66% de votre CA annuel.' },
];

export default function SimulateurBNC() {
  const { setSecteur, step, resultats, comparatif, ca, secteur, reset, setStep } = useSimulateurStore();

  useEffect(() => {
    setSecteur('bnc');
    setStep(1);
  }, [setSecteur, setStep]);

  return (
    <>
      <SEOHead
        title="Simulateur de revenu net BNC 2025 — Freelances et professions libérales"
        description="Calculez votre revenu net en BNC (profession libérale) après cotisations URSSAF (23,1%) et impôts. Résultat immédiat, taux 2025."
        canonical="/simulateur-bnc"
        faqItems={faq}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-4">
            Simulateur de revenu net BNC 2025
          </h1>
          <p className="font-corps text-gris-moyen leading-relaxed max-w-2xl">
            Vous exercez une profession libérale non réglementée (développeur, designer, consultant, médecin, avocat…) ? En BNC, vos cotisations URSSAF s'élèvent à <strong>23,1%</strong> de votre chiffre d'affaires. L'abattement forfaitaire de <strong>34%</strong> réduit votre base imposable. Calculez en temps réel combien il vous reste vraiment.
          </p>
        </div>

        <div className="bg-white rounded-card shadow-card p-8 mb-12">
          {step === 1 && <StepSecteur />}
          {step === 2 && <StepFiscal />}
          {step === 3 && resultats && comparatif && (
            <div className="flex flex-col gap-8">
              <ResultCard resultats={resultats} onReset={reset} />
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
