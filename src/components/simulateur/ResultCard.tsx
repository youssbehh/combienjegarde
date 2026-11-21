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
  const acrePct = Math.round((resultats.acreReduction ?? 0.5) * 100);
  const formationPro = resultats.formationPro ?? 0;
  const { secteur } = useSimulateurStore();

  const taux = TAUX_PAR_ANNEE[resultats.annee];
  const caAnnuel = cabrut * 12;
  const seuilTVA = taux.seuils_tva[secteur];
  const pctDuSeuil = caAnnuel / seuilTVA;
  const showTVAAlerte = pctDuSeuil >= 0.75;

  const plafondCA = taux.plafonds_ca[secteur];
  const showPlafondAlerte = caAnnuel > plafondCA * 0.85;

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
              ACRE activée — cotisations −{acrePct} % · pas de CFE l'année de création
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
              Cotisations URSSAF{acreApplique ? ` (−${acrePct} % ACRE)` : ''}
              {formationPro > 0 && <span className="block text-xs text-blue-300">dont formation professionnelle : {formationPro.toLocaleString('fr-FR')} €</span>}
            </span>
            <span className="font-titre font-semibold" style={{ color: '#FF8A93' }}>
              − <AnimatedNumber value={cotisationsURSSAF} suffix=" €" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-corps text-sm text-blue-200">Impôt sur le revenu lié à l'activité (estimé)</span>
            <span className="font-titre font-semibold" style={{ color: '#FF9F1C' }}>
              − <AnimatedNumber value={impotEstime} suffix=" €" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-corps text-sm text-blue-200">
              CFE (estimation lissée/mois){acreApplique ? ' — non due la 1re année' : ''}
            </span>
            <span className="font-titre font-semibold text-blue-300">
              − <AnimatedNumber value={cfeEstimee} suffix=" €" />
            </span>
          </div>
        </div>

        {/* Revenu net */}
        <div className="pt-6 border-t border-white/20">
          <div className="flex justify-between items-center mb-3">
            <span className="font-corps font-medium text-blue-100">Revenu net estimé</span>
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
              Taux de prélèvement : <strong>{tauxPrelevement.toLocaleString('fr-FR')} %</strong>
            </span>
          </div>
        </div>

        {/* Note légale */}
        <p className="mt-6 text-xs text-blue-300 font-corps leading-relaxed">
          Estimation basée sur les taux officiels {resultats.annee} et le dernier barème de l'impôt connu. La CFE varie selon la commune ; le plafonnement du quotient familial n'est pas pris en compte. Non contractuel : consultez un expert-comptable pour votre situation précise.
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

      {/* Alerte plafond CA micro-entrepreneur */}
      {showPlafondAlerte && (
        <div
          className="mt-4 p-4 rounded-xl font-corps text-sm leading-relaxed"
          style={{
            background: caAnnuel > plafondCA ? 'rgba(230,57,70,0.07)' : 'rgba(255,159,28,0.09)',
            border: `1px solid ${caAnnuel > plafondCA ? 'rgba(230,57,70,0.35)' : 'rgba(255,159,28,0.4)'}`,
          }}
        >
          <strong style={{ color: caAnnuel > plafondCA ? '#E63946' : '#CC7A00' }}>
            {caAnnuel > plafondCA ? '⚠️ Plafond CA dépassé' : `⚠️ Proche du plafond CA (${Math.round((caAnnuel / plafondCA) * 100)}%)`}
          </strong>
          <p className="mt-1 text-gris-fonce">
            {caAnnuel > plafondCA
              ? `Votre CA annuel estimé (${caAnnuel.toLocaleString('fr-FR')} €) dépasse le plafond du régime micro-entrepreneur (${plafondCA.toLocaleString('fr-FR')} €). Après deux années consécutives de dépassement, vous basculez au régime réel.`
              : `Votre CA annuel estimé (${caAnnuel.toLocaleString('fr-FR')} €) approche du plafond micro-entrepreneur (${plafondCA.toLocaleString('fr-FR')} €). Anticipez un éventuel changement de régime.`
            }
          </p>
        </div>
      )}

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
              ? `Votre CA annuel estimé (${caAnnuel.toLocaleString('fr-FR')} €) dépasse le seuil de franchise TVA de ${seuilTVA.toLocaleString('fr-FR')} €. Au-delà du seuil majoré, la TVA s'applique dès le jour du dépassement ; sinon à partir du 1er janvier suivant.`
              : `Votre CA annuel estimé (${caAnnuel.toLocaleString('fr-FR')} €) approche du seuil de franchise TVA (${seuilTVA.toLocaleString('fr-FR')} €). Anticipez vos obligations TVA.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
