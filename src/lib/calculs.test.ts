import { describe, it, expect } from 'vitest';
import {
  calculerRevenuNet,
  calculerComparatif,
  calculerImpotAnnuel,
  depassePlafondVersementLiberatoire,
} from './calculs';
import { TAUX_2025, TAUX_2026 } from './constants';
import type { ParamsSimulation } from '../types';

const base: ParamsSimulation = {
  ca: 3000,
  secteur: 'bnc',
  annee: 2026,
  prelevementLiberatoire: true,
  revenuFiscalRef: 0,
  nbParts: 1,
};

describe('taux officiels', () => {
  it('BNC : 24,6 % en 2025, 25,6 % en 2026', () => {
    expect(TAUX_2025.cotisations.bnc).toBe(0.246);
    expect(TAUX_2026.cotisations.bnc).toBe(0.256);
  });

  it('CIPAV : 23,2 % les deux années', () => {
    expect(TAUX_2025.cotisations.bnc_cipav).toBe(0.232);
    expect(TAUX_2026.cotisations.bnc_cipav).toBe(0.232);
  });

  it('plafonds de CA revalorisés en 2026', () => {
    expect(TAUX_2025.plafonds_ca.bic_vente).toBe(188_700);
    expect(TAUX_2026.plafonds_ca.bic_vente).toBe(203_100);
    expect(TAUX_2026.plafonds_ca.bnc).toBe(83_600);
  });
});

describe('calculerImpotAnnuel', () => {
  it('aucun impôt sous la première tranche', () => {
    expect(calculerImpotAnnuel(11_600, 1, TAUX_2026)).toBe(0);
    expect(calculerImpotAnnuel(0, 1, TAUX_2026)).toBe(0);
  });

  it('barème 2026 sans décote : 40 000 € pour 1 part', () => {
    // (29 579 − 11 600) × 11 % + (40 000 − 29 579) × 30 % = 1 977,69 + 3 126,30
    expect(calculerImpotAnnuel(40_000, 1, TAUX_2026)).toBe(5104);
  });

  it('applique la décote sur les petits impôts', () => {
    // Brut : (20 000 − 11 600) × 11 % = 924 € ; décote : 897 − 924 × 45,25 % = 478,89 €
    expect(calculerImpotAnnuel(20_000, 1, TAUX_2026)).toBe(445);
  });

  it('le quotient familial réduit l’impôt', () => {
    const seul = calculerImpotAnnuel(60_000, 1, TAUX_2026);
    const couple = calculerImpotAnnuel(60_000, 2, TAUX_2026);
    expect(couple).toBeLessThan(seul);
  });
});

describe('calculerRevenuNet', () => {
  it('BNC 3 000 €/mois, versement libératoire, 2026', () => {
    const r = calculerRevenuNet(base);
    expect(r.formationPro).toBe(6);            // 0,2 %
    expect(r.cotisationsURSSAF).toBe(768 + 6); // 25,6 % + CFP
    expect(r.impotEstime).toBe(66);            // 2,2 %
    expect(r.cfeEstimee).toBe(18);
    expect(r.revenuNet).toBe(3000 - 774 - 66 - 18);
  });

  it('BNC 3 000 €/mois en 2025 : 24,6 %', () => {
    const r = calculerRevenuNet({ ...base, annee: 2025 });
    expect(r.cotisationsURSSAF).toBe(738 + 6);
  });

  it('CIPAV 2026 : 23,2 %', () => {
    const r = calculerRevenuNet({ ...base, secteur: 'bnc_cipav' });
    expect(r.cotisationsURSSAF).toBe(696 + 6);
  });

  it('BIC Services 5 000 €/mois, versement libératoire', () => {
    const r = calculerRevenuNet({ ...base, ca: 5000, secteur: 'bic_services' });
    expect(r.cotisationsURSSAF).toBe(1060 + 5);
    expect(r.impotEstime).toBe(85);
  });

  it('BIC Vente 2 000 €/mois au barème : revenu imposable sous la 1re tranche', () => {
    const r = calculerRevenuNet({ ...base, ca: 2000, secteur: 'bic_vente', prelevementLiberatoire: false });
    expect(r.cotisationsURSSAF).toBe(246 + 2);
    expect(r.impotEstime).toBe(0); // 24 000 × 29 % = 6 960 € imposables
  });

  it('ACRE 50 % : cotisations divisées par deux, CFP inchangée, pas de CFE', () => {
    const r = calculerRevenuNet({ ...base, acre: true });
    expect(r.cotisationsURSSAF).toBe(384 + 6);
    expect(r.cfeEstimee).toBe(0);
    expect(r.acreReduction).toBe(0.5);
  });

  it('ACRE 25 % pour une création depuis le 1er juillet 2026', () => {
    const r = calculerRevenuNet({ ...base, acre: true, acreReduction: 0.25 });
    expect(r.cotisationsURSSAF).toBe(576 + 6);
  });

  it('l’impôt imputé à l’activité est le supplément, pas l’impôt total du foyer', () => {
    const params = { ...base, prelevementLiberatoire: false, revenuFiscalRef: 40_000 };
    const r = calculerRevenuNet(params);
    const total = calculerImpotAnnuel(40_000 + 3000 * 12 * 0.66, 1, TAUX_2026);
    const sansActivite = calculerImpotAnnuel(40_000, 1, TAUX_2026);
    expect(r.impotEstime).toBe(Math.round((total - sansActivite) / 12));
    expect(r.impotEstime).toBeLessThan(Math.round(total / 12));
  });

  it('le revenu net n’est jamais négatif', () => {
    const r = calculerRevenuNet({ ...base, ca: 100, prelevementLiberatoire: false, revenuFiscalRef: 200_000 });
    expect(r.revenuNet).toBeGreaterThanOrEqual(0);
  });

  it('CA = 0 → tout à zéro', () => {
    const r = calculerRevenuNet({ ...base, ca: 0 });
    expect(r.revenuNet).toBe(0);
    expect(r.tauxPrelevement).toBe(0);
  });
});

describe('versement libératoire', () => {
  it('signale le dépassement du plafond de revenu par part', () => {
    expect(depassePlafondVersementLiberatoire(40_000, 1, TAUX_2026)).toBe(true);
    expect(depassePlafondVersementLiberatoire(40_000, 2, TAUX_2026)).toBe(false);
    expect(depassePlafondVersementLiberatoire(0, 1, TAUX_2026)).toBe(false);
  });
});

describe('calculerComparatif', () => {
  it('SASU et portage laissent environ la moitié du CA avant impôt', () => {
    const c = calculerComparatif({ ...base, ca: 5000 });
    expect(c.sasu.revenuNet + c.sasu.impot).toBeGreaterThan(5000 * 0.45);
    expect(c.sasu.revenuNet + c.sasu.impot).toBeLessThan(5000 * 0.56);
    expect(c.portage.revenuNet + c.portage.impot).toBeGreaterThan(5000 * 0.45);
    expect(c.portage.revenuNet + c.portage.impot).toBeLessThan(5000 * 0.56);
  });

  it('les trois revenus nets sont exprimés après impôt', () => {
    const c = calculerComparatif({ ...base, ca: 5000, prelevementLiberatoire: false });
    expect(c.sasu.impot).toBeGreaterThan(0);
    expect(c.portage.impot).toBeGreaterThan(0);
    expect(c.ae.impotEstime).toBeGreaterThan(0);
  });
});
