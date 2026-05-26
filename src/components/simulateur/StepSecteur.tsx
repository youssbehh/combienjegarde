import { useState } from 'react';
import { useSimulateurStore } from '../../store/simulateurStore';
import type { Secteur } from '../../types';

const secteurs: { id: Secteur; emoji: string; label: string; desc: string }[] = [
  { id: 'bic_vente',    emoji: '🛒', label: 'BIC Vente',     desc: 'Commerce, e-commerce, artisanat' },
  { id: 'bic_services', emoji: '💼', label: 'BIC Services',  desc: 'Conseil, formation, agence' },
  { id: 'bnc',          emoji: '📝', label: 'BNC / Libéral', desc: 'Dev, designer, consultant, médical' },
];

export default function StepSecteur() {
  const { ca, secteur, setCA, setSecteur, setStep } = useSimulateurStore();
  const [mode, setMode] = useState<'mensuel' | 'annuel'>('mensuel');

  const displayCA = mode === 'annuel' ? ca * 12 : ca;

  const handleCAChange = (val: number) => {
    setCA(mode === 'annuel' ? Math.round(val / 12) : val);
  };

  const sliderMin = mode === 'annuel' ? 6000 : 500;
  const sliderMax = mode === 'annuel' ? 120000 : 10000;
  const sliderStep = mode === 'annuel' ? 1200 : 100;

  return (
    <div className="animate-fadeInUp">
      <h2 className="font-titre font-bold text-2xl text-bleu-marine mb-6">Votre activité</h2>

      {/* Secteur cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {secteurs.map((s) => (
          <button
            key={s.id}
            onClick={() => setSecteur(s.id)}
            className="text-left p-4 rounded-card transition-all duration-200 focus:outline-none"
            style={{
              border: secteur === s.id ? '2px solid #1B2D6B' : '2px solid #E9ECEF',
              background: secteur === s.id ? 'rgba(27, 45, 107, 0.05)' : '#FFFFFF',
            }}
          >
            <span className="text-2xl mb-2 block">{s.emoji}</span>
            <span className="font-titre font-semibold text-bleu-marine block">{s.label}</span>
            <span className="font-corps text-sm text-gris-moyen">{s.desc}</span>
          </button>
        ))}
      </div>

      {/* Toggle mensuel/annuel */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-corps text-sm font-medium text-gris-fonce">CA</span>
        <div className="flex rounded-xl overflow-hidden border border-gris-clair">
          {(['mensuel', 'annuel'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-sm font-corps font-medium transition-colors ${
                mode === m ? 'bg-bleu-marine text-white' : 'bg-white text-gris-moyen hover:bg-blanc-casse'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* CA display */}
      <div className="mb-4">
        <span
          className="font-titre font-bold text-bleu-marine countup-transition"
          style={{ fontSize: '32px' }}
        >
          {displayCA.toLocaleString('fr-FR')} €
        </span>
        <span className="font-corps text-gris-moyen ml-2">/{mode === 'annuel' ? 'an' : 'mois'}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        value={displayCA}
        onChange={(e) => handleCAChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full mb-2"
        style={{ accentColor: '#1B2D6B' }}
      />
      <div className="flex justify-between text-xs text-gris-moyen font-corps mb-8">
        <span>{sliderMin.toLocaleString('fr-FR')} €</span>
        <span>{sliderMax.toLocaleString('fr-FR')} €</span>
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full md:w-auto font-titre font-bold text-white rounded-xl px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5"
        style={{ background: '#1B2D6B', fontSize: '16px' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#2A4494')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#1B2D6B')}
      >
        Voir mon revenu net →
      </button>
    </div>
  );
}
