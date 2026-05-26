export const TAUX_2025 = {
  cotisations: {
    bic_vente:    0.123,
    bic_services: 0.212,
    bnc:          0.231,
  },
  prelevement_liberatoire: {
    bic_vente:    0.010,
    bic_services: 0.017,
    bnc:          0.022,
  },
  abattement_forfaitaire: {
    bic_vente:    0.71,
    bic_services: 0.50,
    bnc:          0.34,
  },
  bareme_ir: [
    { seuil: 11_294,   taux: 0.00 },
    { seuil: 28_797,   taux: 0.11 },
    { seuil: 82_341,   taux: 0.30 },
    { seuil: 177_106,  taux: 0.41 },
    { seuil: Infinity, taux: 0.45 },
  ],
  cfe_mensuelle: 17,
} as const;

export type Secteur = 'bic_vente' | 'bic_services' | 'bnc';
