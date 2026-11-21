import { useEffect } from 'react';
import type { ReactNode } from 'react';
import SEOHead from '../layout/SEOHead';
import FAQ from '../layout/FAQ';
import Simulateur from './Simulateur';
import { useSimulateurStore } from '../../store/simulateurStore';
import type { Secteur } from '../../types';

interface Props {
  secteur: Secteur;
  canonical: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: ReactNode;
  faq: { question: string; answer: string }[];
}

/** Gabarit commun aux pages « simulateur par secteur » (BNC, BIC Services, BIC Vente). */
export default function SimulateurSecteurPage({ secteur, canonical, seoTitle, seoDescription, h1, intro, faq }: Props) {
  const setSecteur = useSimulateurStore((state) => state.setSecteur);
  const setStep = useSimulateurStore((state) => state.setStep);

  useEffect(() => {
    // Attend la restauration de la simulation précédente avant d'imposer le secteur de la page
    const appliquer = () => {
      setSecteur(secteur);
      setStep(1);
    };
    if (useSimulateurStore.persist.hasHydrated()) {
      appliquer();
      return;
    }
    return useSimulateurStore.persist.onFinishHydration(appliquer);
  }, [secteur, setSecteur, setStep]);

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} canonical={canonical} faqItems={faq} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-4">{h1}</h1>
          <p className="font-corps text-gris-moyen leading-relaxed max-w-2xl">{intro}</p>
        </div>

        <div className="bg-white rounded-card shadow-card p-6 md:p-8 mb-12">
          <Simulateur />
        </div>

        <FAQ items={faq} />
      </div>
    </>
  );
}
