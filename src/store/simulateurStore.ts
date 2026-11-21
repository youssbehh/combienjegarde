import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculerRevenuNet, calculerComparatif } from '../lib/calculs';
import { ANNEE_COURANTE } from '../lib/constants';
import type { Secteur, AnneeFiscale, ReductionAcre } from '../lib/constants';
import type { ResultatSimulation, ResultatComparatif } from '../types';

interface SimulateurState {
  ca: number;
  secteur: Secteur;
  prelevementLiberatoire: boolean;
  /** Autres revenus imposables annuels du foyer (hors auto-entreprise). */
  revenuFiscalRef: number;
  nbParts: number;
  annee: AnneeFiscale;
  acre: boolean;
  acreReduction: ReductionAcre;
  step: 1 | 2 | 3;
  resultats: ResultatSimulation | null;
  comparatif: ResultatComparatif | null;
  setCA: (ca: number) => void;
  setSecteur: (s: Secteur) => void;
  setPrelevementLiberatoire: (v: boolean) => void;
  setRevenuFiscalRef: (v: number) => void;
  setNbParts: (v: number) => void;
  setAnnee: (a: AnneeFiscale) => void;
  setAcre: (v: boolean) => void;
  setAcreReduction: (v: ReductionAcre) => void;
  setStep: (s: 1 | 2 | 3) => void;
  calculer: () => void;
  recommencer: () => void;
  reset: () => void;
}

const defaultInputs = {
  ca: 3000,
  secteur: 'bnc' as Secteur,
  prelevementLiberatoire: false,
  revenuFiscalRef: 0,
  nbParts: 1,
  annee: ANNEE_COURANTE,
  acre: false,
  acreReduction: 0.5 as ReductionAcre,
};

const defaultState = {
  ...defaultInputs,
  step: 1 as const,
  resultats: null,
  comparatif: null,
};

export const useSimulateurStore = create<SimulateurState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setCA: (ca) => set({ ca }),
      setSecteur: (secteur) => set({ secteur }),
      setPrelevementLiberatoire: (prelevementLiberatoire) => set({ prelevementLiberatoire }),
      setRevenuFiscalRef: (revenuFiscalRef) => set({ revenuFiscalRef }),
      setNbParts: (nbParts) => set({ nbParts }),
      // En 2025, seule la réduction ACRE de 50 % existait
      setAnnee: (annee) => set(annee === 2025 ? { annee, acreReduction: 0.5 } : { annee }),
      setAcre: (acre) => set({ acre }),
      setAcreReduction: (acreReduction) => set({ acreReduction }),
      setStep: (step) => set({ step }),
      calculer: () => {
        const { ca, secteur, prelevementLiberatoire, revenuFiscalRef, nbParts, annee, acre, acreReduction } = get();
        const params = { ca, secteur, prelevementLiberatoire, revenuFiscalRef, nbParts, annee, acre, acreReduction };
        set({
          resultats: calculerRevenuNet(params),
          comparatif: calculerComparatif(params),
          step: 3,
        });
      },
      recommencer: () => set({ step: 1, resultats: null, comparatif: null }),
      reset: () => set(defaultState),
    }),
    {
      name: 'cjg_last_sim',
      // La réhydratation est déclenchée après le montage (voir App.tsx) pour que
      // le HTML pré-rendu et le premier rendu du navigateur soient identiques.
      skipHydration: true,
      partialize: (state) => ({
        ca: state.ca,
        secteur: state.secteur,
        prelevementLiberatoire: state.prelevementLiberatoire,
        revenuFiscalRef: state.revenuFiscalRef,
        nbParts: state.nbParts,
        annee: state.annee,
        acre: state.acre,
        acreReduction: state.acreReduction,
      }),
    }
  )
);
