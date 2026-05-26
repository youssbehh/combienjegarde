import { useState } from 'react';
import { useSimulateurStore } from '../../store/simulateurStore';

const tranches = [
  { label: 'Moins de 15 000 €', value: 7500 },
  { label: '15 000 – 30 000 €', value: 22500 },
  { label: '30 000 – 50 000 €', value: 40000 },
  { label: '50 000 – 80 000 €', value: 65000 },
  { label: 'Plus de 80 000 €',  value: 100000 },
];

function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        className="w-4 h-4 rounded-full bg-gris-moyen text-white text-xs font-bold leading-none flex items-center justify-center"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        aria-label="Info"
      >
        ?
      </button>
      {visible && (
        <span
          className="absolute bottom-6 left-0 z-10 font-corps text-white rounded-lg px-3 py-2 text-xs w-56 shadow-lg"
          style={{ background: '#343A40', maxWidth: '220px' }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

export default function StepFiscal() {
  const {
    prelevementLiberatoire, revenuFiscalRef, nbParts,
    setPrelevementLiberatoire, setRevenuFiscalRef, setNbParts,
    setStep, calculer,
  } = useSimulateurStore();

  const partsOptions = [1, 1.5, 2, 2.5, 3];

  const handleSkip = () => {
    setPrelevementLiberatoire(false);
    setRevenuFiscalRef(0);
    setNbParts(1);
    calculer();
  };

  return (
    <div className="animate-fadeInUp">
      <h2 className="font-titre font-bold text-2xl text-bleu-marine mb-6">Votre situation fiscale</h2>

      {/* Prélèvement libératoire toggle */}
      <div className="mb-8 p-5 rounded-card bg-white shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-titre font-semibold text-gris-fonce">Prélèvement libératoire ?</span>
            <Tooltip text="Recommandé si votre taux marginal d'imposition est inférieur à 15%. Vous payez un % fixe de votre CA directement à l'URSSAF avec vos cotisations." />
          </div>
          <button
            onClick={() => setPrelevementLiberatoire(!prelevementLiberatoire)}
            className="relative w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: prelevementLiberatoire ? '#1B2D6B' : '#E9ECEF' }}
            aria-checked={prelevementLiberatoire}
            role="switch"
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: prelevementLiberatoire ? 'translateX(24px)' : 'translateX(0)' }}
            />
          </button>
        </div>
        {prelevementLiberatoire && (
          <p className="mt-2 text-xs font-corps text-gris-moyen">
            Un % fixe de votre CA est prélevé à la source. Simple et prévisible.
          </p>
        )}
      </div>

      {/* Tranche revenu fiscal */}
      <div className="mb-8">
        <label className="font-titre font-semibold text-gris-fonce block mb-4">
          Votre revenu fiscal de référence (foyer)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tranches.map((t) => (
            <button
              key={t.value}
              onClick={() => setRevenuFiscalRef(t.value)}
              className="text-left p-4 rounded-card font-corps text-sm transition-all duration-200"
              style={{
                border: revenuFiscalRef === t.value ? '2px solid #1B2D6B' : '2px solid #E9ECEF',
                background: revenuFiscalRef === t.value ? 'rgba(27, 45, 107, 0.05)' : '#FFFFFF',
                color: revenuFiscalRef === t.value ? '#1B2D6B' : '#343A40',
                fontWeight: revenuFiscalRef === t.value ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nombre de parts */}
      <div className="mb-10">
        <label className="font-titre font-semibold text-gris-fonce block mb-4">
          Quotient familial (nombre de parts)
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const idx = partsOptions.indexOf(nbParts);
              if (idx > 0) setNbParts(partsOptions[idx - 1]);
            }}
            className="w-10 h-10 rounded-full border-2 border-gris-clair text-xl font-bold text-bleu-marine hover:border-bleu-marine transition-colors"
          >
            −
          </button>
          <span className="font-titre font-bold text-2xl text-bleu-marine w-10 text-center">{nbParts}</span>
          <button
            onClick={() => {
              const idx = partsOptions.indexOf(nbParts);
              if (idx < partsOptions.length - 1) setNbParts(partsOptions[idx + 1]);
            }}
            className="w-10 h-10 rounded-full border-2 border-gris-clair text-xl font-bold text-bleu-marine hover:border-bleu-marine transition-colors"
          >
            +
          </button>
          <div className="flex gap-2 ml-4">
            {partsOptions.map((p) => (
              <button
                key={p}
                onClick={() => setNbParts(p)}
                className="px-2 py-0.5 rounded text-xs font-corps transition-colors"
                style={{
                  background: nbParts === p ? '#1B2D6B' : '#E9ECEF',
                  color: nbParts === p ? '#fff' : '#6C757D',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={calculer}
          className="font-titre font-bold text-white rounded-xl px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: '#1B2D6B', fontSize: '16px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#2A4494')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#1B2D6B')}
        >
          Calculer →
        </button>
        <button onClick={() => setStep(1)} className="font-corps text-sm text-gris-moyen hover:text-bleu-marine transition-colors">
          ← Retour
        </button>
        <button onClick={handleSkip} className="font-corps text-sm text-gris-moyen hover:text-bleu-marine transition-colors ml-auto">
          Passer cette étape
        </button>
      </div>
    </div>
  );
}
