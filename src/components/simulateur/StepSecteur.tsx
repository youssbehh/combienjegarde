import { useState } from 'react';
import { useSimulateurStore } from '../../store/simulateurStore';
import type { Secteur } from '../../types';
import type { AnneeFiscale } from '../../lib/constants';

const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const secteurs: { id: Secteur; emoji: string; label: string; desc: string }[] = [
  { id: 'bic_vente',    emoji: '🛒', label: 'BIC Vente',     desc: 'Commerce, e-commerce, artisanat' },
  { id: 'bic_services', emoji: '💼', label: 'BIC Services',  desc: 'Conseil, formation, agence' },
  { id: 'bnc',          emoji: '📝', label: 'BNC / Libéral', desc: 'Dev, designer, consultant, médical' },
];

export default function StepSecteur() {
  const { ca, secteur, annee, setCA, setSecteur, setAnnee, setStep } = useSimulateurStore();
  const [mode, setMode] = useState<'mensuel' | 'annuel'>('mensuel');
  const [caMode, setCaMode] = useState<'fixe' | 'variable'>('fixe');
  const [moisCA, setMoisCA] = useState<number[]>(Array(12).fill(ca));

  const isBNC = secteur === 'bnc' || secteur === 'bnc_cipav';
  const displayCA = mode === 'annuel' ? ca * 12 : ca;

  const handleCAChange = (val: number) => {
    const monthly = mode === 'annuel' ? Math.round(val / 12) : val;
    setCA(monthly);
    if (caMode === 'variable') setMoisCA(Array(12).fill(monthly));
  };

  const handleMoisChange = (index: number, val: number) => {
    const updated = [...moisCA];
    updated[index] = Math.max(0, val);
    setMoisCA(updated);
  };

  const moyenneCA = Math.round(moisCA.reduce((s, v) => s + v, 0) / 12);

  const sliderMin = mode === 'annuel' ? 6000 : 500;
  const sliderMax = mode === 'annuel' ? 120000 : 10000;
  const sliderStep = mode === 'annuel' ? 1200 : 100;

  const handleNext = () => {
    if (caMode === 'variable') setCA(moyenneCA);
    setStep(2);
  };

  return (
    <div className="animate-fadeInUp">
      {/* Toggle année */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-titre font-bold text-2xl text-bleu-marine">Votre activité</h2>
        <div className="flex items-center gap-2">
          <span className="font-corps text-xs text-gris-moyen">Année fiscale</span>
          <div className="flex rounded-xl overflow-hidden border border-gris-clair">
            {([2025, 2026] as AnneeFiscale[]).map((a) => (
              <button
                key={a}
                onClick={() => setAnnee(a)}
                className={`px-4 py-1.5 text-sm font-titre font-bold transition-colors ${
                  annee === a ? 'bg-bleu-marine text-white' : 'bg-white text-gris-moyen hover:bg-blanc-casse'
                }`}
              >
                {a}
                {a === 2026 && annee === a && (
                  <span className="ml-1.5 text-xs bg-vert-menthe text-white rounded-full px-1.5 py-0.5">Nouveau</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {annee === 2026 && (
        <div
          className="mb-5 p-3 rounded-xl font-corps text-xs leading-relaxed"
          style={{ background: 'rgba(46,196,182,0.08)', border: '1px solid rgba(46,196,182,0.3)' }}
        >
          <strong className="text-vert-fonce">Taux 2026 actifs</strong> — Barème IR revalorisé (+1,8%), cotisations BNC à 24,6% (réforme retraites libéraux). <a href="/guide/changements-2026" className="underline text-bleu-marine">Voir tous les changements →</a>
        </div>
      )}

      {/* Secteur cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {secteurs.map((s) => {
          const selected = s.id === 'bnc' ? isBNC : secteur === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSecteur(s.id)}
              className="text-left p-4 rounded-card transition-all duration-200 focus:outline-none"
              style={{
                border: selected ? '2px solid #1B2D6B' : '2px solid #E9ECEF',
                background: selected ? 'rgba(27, 45, 107, 0.05)' : '#FFFFFF',
              }}
            >
              <span className="text-2xl mb-2 block">{s.emoji}</span>
              <span className="font-titre font-semibold text-bleu-marine block">{s.label}</span>
              <span className="font-corps text-sm text-gris-moyen">{s.desc}</span>
            </button>
          );
        })}
      </div>

      {/* CIPAV vs SSI sub-choice (BNC only) */}
      {isBNC && (
        <div
          className="mb-8 p-4 rounded-xl"
          style={{ background: 'rgba(27,45,107,0.04)', border: '1px solid rgba(27,45,107,0.12)' }}
        >
          <p className="font-titre text-sm font-semibold text-bleu-marine mb-3">Votre caisse de retraite :</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSecteur('bnc')}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                border: secteur === 'bnc' ? '2px solid #1B2D6B' : '2px solid #E9ECEF',
                background: secteur === 'bnc' ? 'rgba(27,45,107,0.06)' : '#fff',
              }}
            >
              <span className="font-titre font-semibold text-sm text-bleu-marine block">SSI (non réglementé)</span>
              <span className="font-corps text-xs text-gris-moyen">Dev, designer, consultant…</span>
              <span className="font-corps text-xs font-bold mt-1 block" style={{ color: '#1A9E92' }}>
                {annee === 2026 ? '24,6%' : '23,1%'} de cotisations
              </span>
            </button>
            <button
              onClick={() => setSecteur('bnc_cipav')}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                border: secteur === 'bnc_cipav' ? '2px solid #1B2D6B' : '2px solid #E9ECEF',
                background: secteur === 'bnc_cipav' ? 'rgba(27,45,107,0.06)' : '#fff',
              }}
            >
              <span className="font-titre font-semibold text-sm text-bleu-marine block">CIPAV (réglementé)</span>
              <span className="font-corps text-xs text-gris-moyen">Médecin, avocat, architecte…</span>
              <span className="font-corps text-xs font-bold mt-1 block" style={{ color: '#1A9E92' }}>
                {annee === 2026 ? '24,7%' : '23,2%'} de cotisations
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Toggle fixe/variable CA */}
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
        <div className="flex rounded-xl overflow-hidden border border-gris-clair ml-auto">
          {(['fixe', 'variable'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setCaMode(m);
                if (m === 'variable') setMoisCA(Array(12).fill(ca));
              }}
              className={`px-3 py-1.5 text-sm font-corps font-medium transition-colors ${
                caMode === m ? 'bg-bleu-marine text-white' : 'bg-white text-gris-moyen hover:bg-blanc-casse'
              }`}
            >
              {m === 'fixe' ? 'Fixe' : 'Variable'}
            </button>
          ))}
        </div>
      </div>

      {caMode === 'fixe' ? (
        <>
          <div className="mb-4">
            <span className="font-titre font-bold text-bleu-marine countup-transition" style={{ fontSize: '32px' }}>
              {displayCA.toLocaleString('fr-FR')} €
            </span>
            <span className="font-corps text-gris-moyen ml-2">/{mode === 'annuel' ? 'an' : 'mois'}</span>
          </div>

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
        </>
      ) : (
        <div className="mb-8">
          <p className="font-corps text-xs text-gris-moyen mb-3">Saisissez votre CA mensuel pour chaque mois :</p>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
            {MOIS.map((nom, i) => (
              <div key={nom} className="flex flex-col gap-1">
                <label className="font-corps text-xs text-gris-moyen text-center">{nom}</label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={moisCA[i]}
                  onChange={(e) => handleMoisChange(i, Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg font-corps text-sm text-bleu-marine text-center focus:outline-none"
                  style={{ border: '1.5px solid #E9ECEF' }}
                />
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'rgba(27,45,107,0.05)' }}
          >
            <span className="font-corps text-sm text-gris-fonce">Moyenne mensuelle utilisée</span>
            <span className="font-titre font-bold text-bleu-marine text-lg">
              {moyenneCA.toLocaleString('fr-FR')} €/mois
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
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
