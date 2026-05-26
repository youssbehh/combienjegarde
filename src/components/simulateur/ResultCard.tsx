import { useEffect, useState } from 'react';
import type { ResultatSimulation } from '../../types';
import { useSimulateurStore } from '../../store/simulateurStore';
import { TAUX_PAR_ANNEE } from '../../lib/constants';

function useCountUp(target: number, duration = 300) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    const start = Date.now();
    const from = value;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(from + (target - from) * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return value;
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const animated = useCountUp(value);
  return <span>{prefix}{animated.toLocaleString('fr-FR')}{suffix}</span>;
}

interface Props {
  resultats: ResultatSimulation;
  onRecommencer: () => void;
  onReset: () => void;
}

export default function ResultCard({ resultats, onRecommencer, onReset }: Props) {
  const { cabrut, cotisationsURSSAF, impotEstime, cfeEstimee, revenuNet, tauxPrelevement, acreApplique } = resultats;
  const { secteur } = useSimulateurStore();

  const taux = TAUX_PAR_ANNEE[resultats.annee];
  const caAnnuel = cabrut * 12;
  const seuilTVA = taux.seuils_tva[secteur];
  const pctDuSeuil = caAnnuel / seuilTVA;
  const showTVAAlerte = pctDuSeuil >= 0.75;

  return (
    <div>
      <div
        className="animate-fadeInUp rounded-card-lg p-8 text-white"
        style={{ background: 'linear-gradient(135deg, #1B2D6B 0%, #2A4494 100%)' }}
      >
        {/* ACRE badge */}
        {acreApplique && (
          <div className="flex items-center gap-2 mb-4">
            <span
              className="font-corps text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'rgba(46,196,182,0.25)', color: '#7EEEE8' }}
            >
              ACRE activée — cotisations −50% + CFE = 0 €
            </span>
          </div>
        )}

        {/* CA Brut */}
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/20">
          <span className="font-corps text-blue-200">CA Brut</span>
          <span className="font-titre font-bold text-xl">
            <AnimatedNumber value={cabrut} suffix=" €/mois" />
          </span>
        </div>

        {/* Déductions */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-corps text-sm text-blue-200">
              Cotisations URSSAF{acreApplique ? ' (−50% ACRE)' : ''}
            </span>
            <span className="font-titre font-semibold" style={{ color: '#E63946' }}>
              − <AnimatedNumber value={cotisationsURSSAF} suffix=" €" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-corps text-sm text-blue-200">Impôt estimé</span>
            <span className="font-titre font-semibold" style={{ color: '#FF9F1C' }}>
              − <AnimatedNumber value={impotEstime} suffix=" €" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-corps text-sm text-blue-200">
              CFE (estimée/mois){acreApplique ? ' — exonérée' : ''}
            </span>
            <span className="font-titre font-semibold text-blue-300">
              − <AnimatedNumber value={cfeEstimee} suffix=" €" />
            </span>
          </div>
        </div>

        {/* Revenu net */}
        <div className="pt-6 border-t border-white/20">
          <div className="flex justify-between items-center mb-3">
            <span className="font-corps font-medium text-blue-100">Revenu net réel</span>
            <div className="text-right">
              <p
                className="font-titre font-extrabold animate-pulse-green"
                style={{ fontSize: '36px', color: '#2EC4B6' }}
              >
                <AnimatedNumber value={revenuNet} suffix=" €/mois" />
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <span
              className="font-corps text-sm rounded-full px-3 py-1"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', fontSize: '14px' }}
            >
              Taux de prélèvement : <strong>{tauxPrelevement} %</strong>
            </span>
          </div>
        </div>

        {/* Note légale */}
        <p className="mt-6 text-xs text-blue-300 font-corps leading-relaxed">
          Estimation basée sur les taux officiels {resultats.annee}. Non contractuel. Consultez un expert-comptable pour votre situation précise.
        </p>

        <div className="mt-4 flex gap-4">
          <button
            onClick={onRecommencer}
            className="font-corps text-sm text-white hover:text-vert-menthe transition-colors flex items-center gap-1"
          >
            ↺ Modifier ma simulation
          </button>
          <button
            onClick={onReset}
            className="font-corps text-sm text-blue-300 hover:text-white transition-colors"
          >
            Tout réinitialiser
          </button>
        </div>
      </div>

      {/* Alerte seuil TVA */}
      {showTVAAlerte && (
        <div
          className="mt-4 p-4 rounded-xl font-corps text-sm leading-relaxed"
          style={{
            background: pctDuSeuil >= 1 ? 'rgba(230,57,70,0.07)' : 'rgba(255,159,28,0.09)',
            border: `1px solid ${pctDuSeuil >= 1 ? 'rgba(230,57,70,0.35)' : 'rgba(255,159,28,0.4)'}`,
          }}
        >
          <strong style={{ color: pctDuSeuil >= 1 ? '#E63946' : '#CC7A00' }}>
            {pctDuSeuil >= 1 ? '⚠️ Seuil TVA dépassé' : `⚠️ Seuil TVA proche (${Math.round(pctDuSeuil * 100)}%)`}
          </strong>
          <p className="mt-1 text-gris-fonce">
            {pctDuSeuil >= 1
              ? `Votre CA annuel estimé (${caAnnuel.toLocaleString('fr-FR')} €) dépasse le seuil de franchise TVA de ${seuilTVA.toLocaleString('fr-FR')} €. Vous devez facturer la TVA dès le 1er jour du mois de dépassement.`
              : `Votre CA annuel estimé (${caAnnuel.toLocaleString('fr-FR')} €) approche du seuil de franchise TVA (${seuilTVA.toLocaleString('fr-FR')} €). Anticipez vos obligations TVA.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
