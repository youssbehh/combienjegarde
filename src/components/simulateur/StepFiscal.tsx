import { useId, useState } from 'react';
import { useSimulateurStore } from '../../store/simulateurStore';
import { depassePlafondVersementLiberatoire } from '../../lib/calculs';
import { TAUX_PAR_ANNEE, formatTaux } from '../../lib/constants';
import type { ReductionAcre } from '../../lib/constants';

const tranches = [
  { label: 'Aucun autre revenu', value: 0 },
  { label: 'Moins de 15 000 €', value: 7500 },
  { label: '15 000 – 30 000 €', value: 22500 },
  { label: '30 000 – 50 000 €', value: 40000 },
  { label: '50 000 – 80 000 €', value: 65000 },
  { label: 'Plus de 80 000 €', value: 100000 },
];

const partsOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4];

function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        className="w-5 h-5 rounded-full bg-gris-moyen text-white text-xs font-bold leading-none flex items-center justify-center"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        aria-label="Plus d'informations"
        aria-describedby={visible ? id : undefined}
      >
        ?
      </button>
      {visible && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-7 left-0 z-10 font-corps text-white rounded-lg px-3 py-2 text-xs w-56 shadow-lg bg-gris-fonce"
        >
          {text}
        </span>
      )}
    </span>
  );
}

function Interrupteur({ actif, onChange, libelle, couleur }: { actif: boolean; onChange: (v: boolean) => void; libelle: string; couleur: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      aria-label={libelle}
      onClick={() => onChange(!actif)}
      className="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: actif ? couleur : '#ADB5BD' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: actif ? 'translateX(24px)' : 'translateX(0)' }}
      />
    </button>
  );
}

export default function StepFiscal() {
  const {
    secteur, annee, prelevementLiberatoire, revenuFiscalRef, nbParts, acre, acreReduction,
    setPrelevementLiberatoire, setRevenuFiscalRef, setNbParts,
    setAcre, setAcreReduction, setStep, calculer,
  } = useSimulateurStore();

  const taux = TAUX_PAR_ANNEE[annee];
  const plInaccessible = depassePlafondVersementLiberatoire(revenuFiscalRef, nbParts, taux);
  const indexParts = partsOptions.indexOf(nbParts);

  const handleSkip = () => {
    setPrelevementLiberatoire(false);
    setRevenuFiscalRef(0);
    setNbParts(1);
    calculer();
  };

  const choixAcre: { valeur: ReductionAcre; libelle: string }[] = [
    { valeur: 0.5, libelle: 'Créée avant le 1er juillet 2026 (−50 %)' },
    { valeur: 0.25, libelle: 'Créée depuis le 1er juillet 2026 (−25 %)' },
  ];

  return (
    <div className="animate-fadeInUp">
      <h2 className="font-titre font-bold text-2xl text-bleu-marine mb-6">Votre situation fiscale</h2>

      {/* ACRE */}
      <div className="mb-6 p-5 rounded-card bg-white shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-titre font-semibold text-gris-fonce">Bénéficiez-vous de l'ACRE ?</span>
            <Tooltip text="L'ACRE (Aide à la Création ou à la Reprise d'une Entreprise) réduit vos cotisations sociales jusqu'à la fin du 3e trimestre civil suivant le début d'activité : −50 % pour une création avant le 1er juillet 2026, −25 % depuis. Elle est réservée à certains publics et se demande à l'URSSAF." />
          </div>
          <Interrupteur actif={acre} onChange={setAcre} libelle="Bénéficier de l'ACRE" couleur="#1A9E92" />
        </div>
        {acre && (
          <div className="mt-3">
            {annee === 2026 && (
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                {choixAcre.map((choix) => (
                  <button
                    key={choix.valeur}
                    type="button"
                    onClick={() => setAcreReduction(choix.valeur)}
                    aria-pressed={acreReduction === choix.valeur}
                    className="px-3 py-2 rounded-xl font-corps text-xs text-left transition-all"
                    style={{
                      border: acreReduction === choix.valeur ? '2px solid #1B2D6B' : '2px solid #E9ECEF',
                      background: acreReduction === choix.valeur ? 'rgba(27,45,107,0.06)' : '#fff',
                      fontWeight: acreReduction === choix.valeur ? 600 : 400,
                    }}
                  >
                    {choix.libelle}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs font-corps leading-relaxed text-vert-fonce">
              Cotisations sociales réduites de <strong>{acreReduction * 100} %</strong>. La CFE n'est pas due l'année de création, elle est donc comptée à 0 €.
            </p>
          </div>
        )}
      </div>

      {/* Versement libératoire */}
      <div className="mb-8 p-5 rounded-card bg-white shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-titre font-semibold text-gris-fonce">Versement libératoire de l'impôt ?</span>
            <Tooltip text={`Vous payez l'impôt en même temps que vos cotisations : ${formatTaux(taux.prelevement_liberatoire[secteur])} de votre CA. Réservé aux foyers dont le revenu fiscal de référence d'il y a deux ans ne dépasse pas ${taux.plafond_rfr_pl.toLocaleString('fr-FR')} € par part. Intéressant surtout si vous êtes imposable.`} />
          </div>
          <Interrupteur
            actif={prelevementLiberatoire}
            onChange={setPrelevementLiberatoire}
            libelle="Opter pour le versement libératoire"
            couleur="#1B2D6B"
          />
        </div>
        {prelevementLiberatoire && !plInaccessible && (
          <p className="mt-2 text-xs font-corps text-gris-moyen">
            {formatTaux(taux.prelevement_liberatoire[secteur])} de votre CA sont prélevés avec vos cotisations, quel que soit votre taux d'imposition.
          </p>
        )}
        {prelevementLiberatoire && plInaccessible && (
          <p role="alert" className="mt-2 text-xs font-corps leading-relaxed" style={{ color: '#B02A37' }}>
            ⚠️ Avec ces revenus, votre foyer dépasse probablement le plafond d'éligibilité ({taux.plafond_rfr_pl.toLocaleString('fr-FR')} € de revenu fiscal de référence par part). Vérifiez votre avis d'imposition : si vous n'êtes pas éligible, désactivez cette option.
          </p>
        )}
      </div>

      {/* Autres revenus du foyer */}
      <fieldset className="mb-8">
        <legend className="font-titre font-semibold text-gris-fonce mb-1">
          Autres revenus imposables de votre foyer (par an)
        </legend>
        <p className="font-corps text-xs text-gris-moyen mb-4">
          Salaires, pensions, revenus du conjoint… hors auto-entreprise. Ils déterminent la tranche d'imposition de votre activité ; seul l'impôt supplémentaire dû à l'auto-entreprise est retenu.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tranches.map((t) => {
            const selectionne = revenuFiscalRef === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setRevenuFiscalRef(t.value)}
                aria-pressed={selectionne}
                className="text-left p-4 rounded-card font-corps text-sm transition-all duration-200"
                style={{
                  border: selectionne ? '2px solid #1B2D6B' : '2px solid #E9ECEF',
                  background: selectionne ? 'rgba(27, 45, 107, 0.05)' : '#FFFFFF',
                  color: selectionne ? '#1B2D6B' : '#343A40',
                  fontWeight: selectionne ? 600 : 400,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Nombre de parts */}
      <fieldset className="mb-10">
        <legend className="font-titre font-semibold text-gris-fonce mb-4">
          Quotient familial (nombre de parts)
        </legend>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            aria-label="Diminuer le nombre de parts"
            disabled={indexParts <= 0}
            onClick={() => setNbParts(partsOptions[indexParts - 1])}
            className="w-10 h-10 rounded-full border-2 border-gris-clair text-xl font-bold text-bleu-marine hover:border-bleu-marine transition-colors disabled:opacity-40"
          >
            −
          </button>
          <span aria-live="polite" className="font-titre font-bold text-2xl text-bleu-marine w-10 text-center">
            {nbParts.toLocaleString('fr-FR')}
          </span>
          <button
            type="button"
            aria-label="Augmenter le nombre de parts"
            disabled={indexParts >= partsOptions.length - 1}
            onClick={() => setNbParts(partsOptions[indexParts + 1])}
            className="w-10 h-10 rounded-full border-2 border-gris-clair text-xl font-bold text-bleu-marine hover:border-bleu-marine transition-colors disabled:opacity-40"
          >
            +
          </button>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={calculer}
          className="font-titre font-bold text-white rounded-xl px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5 bg-bleu-marine hover:bg-bleu-moyen"
          style={{ fontSize: '16px' }}
        >
          Calculer →
        </button>
        <button type="button" onClick={() => setStep(1)} className="font-corps text-sm text-gris-moyen hover:text-bleu-marine transition-colors">
          ← Retour
        </button>
        <button type="button" onClick={handleSkip} className="font-corps text-sm text-gris-moyen hover:text-bleu-marine transition-colors ml-auto">
          Passer cette étape
        </button>
      </div>
    </div>
  );
}
