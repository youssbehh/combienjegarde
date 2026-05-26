export type Secteur = 'bic_vente' | 'bic_services' | 'bnc' | 'bnc_cipav';
export type AnneeFiscale = 2025 | 2026;

const TAUX_BASE = {
  prelevement_liberatoire: {
    bic_vente:    0.010,
    bic_services: 0.017,
    bnc:          0.022,
    bnc_cipav:    0.022,
  },
  abattement_forfaitaire: {
    bic_vente:    0.71,
    bic_services: 0.50,
    bnc:          0.34,
    bnc_cipav:    0.34,
  },
  // Plafonds CA annuels
  plafonds_ca: {
    bic_vente:    188_700,
    bic_services:  77_700,
    bnc:           77_700,
    bnc_cipav:     77_700,
  },
  // Seuils franchise TVA
  seuils_tva: {
    bic_vente:    85_000,
    bic_services: 37_500,
    bnc:          37_500,
    bnc_cipav:    37_500,
  },
} as const;

export const TAUX_2025 = {
  ...TAUX_BASE,
  annee: 2025 as const,
  cotisations: {
    bic_vente:    0.123,
    bic_services: 0.212,
    bnc:          0.231,
    bnc_cipav:    0.232,  // professions réglementées CIPAV (+0,1 pt)
  },
  bareme_ir: [
    { seuil: 11_294,   taux: 0.00 },
    { seuil: 28_797,   taux: 0.11 },
    { seuil: 82_341,   taux: 0.30 },
    { seuil: 177_106,  taux: 0.41 },
    { seuil: Infinity, taux: 0.45 },
  ],
  cfe_mensuelle: 17,
  // Plafond RFR pour prélèvement libératoire (par part)
  plafond_rfr_pl: 27_794,
} as const;

// Taux 2026 — sources : PLFSS 2026, BOFiP, URSSAF (barème IR revalorisé ~1,8%)
export const TAUX_2026 = {
  ...TAUX_BASE,
  annee: 2026 as const,
  cotisations: {
    bic_vente:    0.123,   // inchangé
    bic_services: 0.212,   // inchangé
    bnc:          0.246,   // hausse progressive réforme retraites libéraux (+1,5 pt)
    bnc_cipav:    0.247,   // CIPAV réglementé (+1,5 pt réforme)
  },
  bareme_ir: [
    { seuil: 11_497,   taux: 0.00 },  // +1,8% inflation
    { seuil: 29_315,   taux: 0.11 },
    { seuil: 83_823,   taux: 0.30 },
    { seuil: 180_294,  taux: 0.41 },
    { seuil: Infinity, taux: 0.45 },
  ],
  cfe_mensuelle: 18,       // légère revalorisation
  plafond_rfr_pl: 28_797,  // revalorisation annuelle
} as const;

export type TauxAnnee = typeof TAUX_2025 | typeof TAUX_2026;

export const TAUX_PAR_ANNEE: Record<AnneeFiscale, TauxAnnee> = {
  2025: TAUX_2025,
  2026: TAUX_2026,
};

// Rétrocompat : exporte TAUX_2025 comme TAUX_2025 (articles existants)
export { TAUX_2025 as TAUX_2025_COMPAT };
