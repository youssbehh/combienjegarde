import { describe, it, expect } from 'vitest';
import { calculerRevenuNet } from './calculs';

describe('calculerRevenuNet', () => {
  it('BNC 3000€/mois prélèvement libératoire', () => {
    const r = calculerRevenuNet({
      ca: 3000, secteur: 'bnc',
      prelevementLiberatoire: true,
      revenuFiscalRef: 0, nbParts: 1,
    });
    expect(r.cotisationsURSSAF).toBe(693);
    expect(r.impotEstime).toBe(66);
    expect(r.cfeEstimee).toBe(17);
    expect(r.revenuNet).toBe(2224);
  });

  it('BIC Vente 2000€/mois barème', () => {
    const r = calculerRevenuNet({
      ca: 2000, secteur: 'bic_vente',
      prelevementLiberatoire: false,
      revenuFiscalRef: 0, nbParts: 1,
    });
    expect(r.cotisationsURSSAF).toBe(246);
    expect(r.revenuNet).toBeGreaterThan(0);
    expect(r.tauxPrelevement).toBeLessThan(50);
  });

  it('BIC Services 5000€/mois prélèvement libératoire', () => {
    const r = calculerRevenuNet({
      ca: 5000, secteur: 'bic_services',
      prelevementLiberatoire: true,
      revenuFiscalRef: 0, nbParts: 1,
    });
    expect(r.cotisationsURSSAF).toBe(1060);
    expect(r.impotEstime).toBe(85);
  });

  it('Revenu net jamais négatif', () => {
    const r = calculerRevenuNet({
      ca: 100, secteur: 'bnc',
      prelevementLiberatoire: false,
      revenuFiscalRef: 200000, nbParts: 1,
    });
    expect(r.revenuNet).toBeGreaterThanOrEqual(0);
  });

  it('CA = 0 → tout à zéro', () => {
    const r = calculerRevenuNet({
      ca: 0, secteur: 'bnc',
      prelevementLiberatoire: true,
      revenuFiscalRef: 0, nbParts: 1,
    });
    expect(r.revenuNet).toBe(0);
    expect(r.tauxPrelevement).toBe(0);
  });
});
