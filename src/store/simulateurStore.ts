import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculerRevenuNet, calculerComparatif } from '../lib/calculs';
import type { Secteur } from '../lib/constants';
import type { ResultatSimulation, ResultatComparatif } from '../types';

interface SimulateurState {
  ca: number;
  secteur: Secteur;
  prelevementLiberatoire: boolean;
  revenuFiscalRef: number;
  nbParts: number;
  step: 1 | 2 | 3;
  resultats: ResultatSimulation | null;
  comparatif: ResultatComparatif | null;
  setCA: (ca: number) => void;
  setSecteur: (s: Secteur) => void;
  setPrelevementLiberatoire: (v: boolean) => void;
  setRevenuFiscalRef: (v: number) => void;
  setNbParts: (v: number) => void;
  setStep: (s: 1 | 2 | 3) => void;
  calculer: () => void;
  reset: () => void;
}

const defaultState = {
  ca: 3000,
  secteur: 'bnc' as Secteur,
  prelevementLiberatoire: false,
  revenuFiscalRef: 0,
  nbParts: 1,
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
      setStep: (step) => set({ step }),
      calculer: () => {
        const { ca, secteur, prelevementLiberatoire, revenuFiscalRef, nbParts } = get();
        const params = { ca, secteur, prelevementLiberatoire, revenuFiscalRef, nbParts };
        set({
          resultats: calculerRevenuNet(params),
          comparatif: calculerComparatif(params),
          step: 3,
        });
      },
      reset: () => set(defaultState),
    }),
    {
      name: 'cjg_last_sim',
      partialize: (state) => ({
        ca: state.ca,
        secteur: state.secteur,
        prelevementLiberatoire: state.prelevementLiberatoire,
        revenuFiscalRef: state.revenuFiscalRef,
        nbParts: state.nbParts,
      }),
    }
  )
);
