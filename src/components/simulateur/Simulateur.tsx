import { lazy, Suspense } from 'react';
import { useSimulateurStore } from '../../store/simulateurStore';
import StepSecteur from './StepSecteur';
import StepFiscal from './StepFiscal';
import ResultCard from './ResultCard';
import ComparateurRegimes from './ComparateurRegimes';
import PDFExportButton from './PDFExportButton';

// Le graphique (recharts) n'est téléchargé qu'à l'affichage des résultats
const DonutChart = lazy(() => import('./DonutChart'));

/** Les trois étapes du simulateur, partagées par l'accueil et les pages par secteur. */
export default function Simulateur() {
  const { step, resultats, comparatif, ca, secteur, recommencer, reset } = useSimulateurStore();

  return (
    <>
      {step === 1 && <StepSecteur />}
      {step === 2 && <StepFiscal />}
      {step === 3 && resultats && comparatif && (
        <div className="flex flex-col gap-8">
          <ResultCard resultats={resultats} onRecommencer={recommencer} onReset={reset} />
          <Suspense fallback={<div className="bg-white rounded-card shadow-card" style={{ height: 332 }} />}>
            <DonutChart resultats={resultats} />
          </Suspense>
          <ComparateurRegimes comparatif={comparatif} caAnnuel={ca * 12} />
          <PDFExportButton resultats={resultats} comparatif={comparatif} secteur={secteur} />
        </div>
      )}
    </>
  );
}
