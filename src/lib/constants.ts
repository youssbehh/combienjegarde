export type Secteur = 'bic_vente' | 'bic_services' | 'bnc' | 'bnc_cipav';
export type AnneeFiscale = 2025 | 2026;

/** Année affichée par défaut dans l'interface, les titres et le SEO. */
export const ANNEE_COURANTE: AnneeFiscale = 2026;

export interface TrancheIR {
  seuil: number;
  taux: number;
}

export interface Decote {
  /** Montant forfaitaire pour une personne seule / un couple. */
  forfaitSeul: number;
  forfaitCouple: number;
  /** Part de l'impôt brut retranchée du forfait. */
  taux: number;
}

export interface TauxAnnee {
  annee: AnneeFiscale;
  cotisations: Record<Secteur, number>;
  formation_pro: Record<Secteur, number>;
  prelevement_liberatoire: Record<Secteur, number>;
  abattement_forfaitaire: Record<Secteur, number>;
  plafonds_ca: Record<Secteur, number>;
  seuils_tva: Record<Secteur, number>;
  bareme_ir: readonly TrancheIR[];
  decote: Decote;
  cfe_mensuelle: number;
  /** Plafond de revenu fiscal de référence N-2, par part, pour opter au versement libératoire. */
  plafond_rfr_pl: number;
}

// ── Valeurs communes aux deux années ────────────────────────────────────────

const PRELEVEMENT_LIBERATOIRE: Record<Secteur, number> = {
  bic_vente: 0.010,
  bic_services: 0.017,
  bnc: 0.022,
  bnc_cipav: 0.022,
};

const ABATTEMENT_FORFAITAIRE: Record<Secteur, number> = {
  bic_vente: 0.71,
  bic_services: 0.50,
  bnc: 0.34,
  bnc_cipav: 0.34,
};

// Franchise en base de TVA — inchangée en 2025 et 2026
const SEUILS_TVA: Record<Secteur, number> = {
  bic_vente: 85_000,
  bic_services: 37_500,
  bnc: 37_500,
  bnc_cipav: 37_500,
};

// Contribution à la formation professionnelle (CFP), en % du CA.
// Prestations artisanales : 0,3 % (non distinguées ici des prestations commerciales).
const FORMATION_PRO: Record<Secteur, number> = {
  bic_vente: 0.001,
  bic_services: 0.001,
  bnc: 0.002,
  bnc_cipav: 0.002,
};

// Barème de la loi de finances 2026 (revenus 2025), revalorisé de 0,9 %.
// Le barème applicable aux revenus 2026 sera fixé par la loi de finances 2027 :
// en attendant, le dernier barème connu est utilisé pour les deux années.
const BAREME_IR_DERNIER_CONNU: readonly TrancheIR[] = [
  { seuil: 11_600, taux: 0.00 },
  { seuil: 29_579, taux: 0.11 },
  { seuil: 84_577, taux: 0.30 },
  { seuil: 181_917, taux: 0.41 },
  { seuil: Infinity, taux: 0.45 },
];

const DECOTE_DERNIERE_CONNUE: Decote = {
  forfaitSeul: 897,
  forfaitCouple: 1_483,
  taux: 0.4525,
};

// ── Taux par année — sources : urssaf.fr, economie.gouv.fr, service-public.gouv.fr ──

export const TAUX_2025: TauxAnnee = {
  annee: 2025,
  cotisations: {
    bic_vente: 0.123,
    bic_services: 0.212,
    bnc: 0.246,        // 24,6 % depuis le 1er janvier 2025
    bnc_cipav: 0.232,  // professions libérales réglementées (CIPAV)
  },
  formation_pro: FORMATION_PRO,
  prelevement_liberatoire: PRELEVEMENT_LIBERATOIRE,
  abattement_forfaitaire: ABATTEMENT_FORFAITAIRE,
  plafonds_ca: {
    bic_vente: 188_700,
    bic_services: 77_700,
    bnc: 77_700,
    bnc_cipav: 77_700,
  },
  seuils_tva: SEUILS_TVA,
  bareme_ir: BAREME_IR_DERNIER_CONNU,
  decote: DECOTE_DERNIERE_CONNUE,
  cfe_mensuelle: 17,
  plafond_rfr_pl: 27_478,
};

export const TAUX_2026: TauxAnnee = {
  annee: 2026,
  cotisations: {
    bic_vente: 0.123,   // inchangé
    bic_services: 0.212, // inchangé
    bnc: 0.256,         // 25,6 % depuis le 1er janvier 2026 (+1 pt)
    bnc_cipav: 0.232,   // inchangé
  },
  formation_pro: FORMATION_PRO,
  prelevement_liberatoire: PRELEVEMENT_LIBERATOIRE,
  abattement_forfaitaire: ABATTEMENT_FORFAITAIRE,
  // Plafonds revalorisés pour 2026-2028
  plafonds_ca: {
    bic_vente: 203_100,
    bic_services: 83_600,
    bnc: 83_600,
    bnc_cipav: 83_600,
  },
  seuils_tva: SEUILS_TVA,
  bareme_ir: BAREME_IR_DERNIER_CONNU,
  decote: DECOTE_DERNIERE_CONNUE,
  cfe_mensuelle: 18,
  plafond_rfr_pl: 28_797,
};

export const TAUX_PAR_ANNEE: Record<AnneeFiscale, TauxAnnee> = {
  2025: TAUX_2025,
  2026: TAUX_2026,
};

// ── ACRE ────────────────────────────────────────────────────────────────────
// Réduction de cotisations la 1ère année : 50 % pour les créations jusqu'au
// 30 juin 2026, 25 % pour les créations à partir du 1er juillet 2026.
export type ReductionAcre = 0.5 | 0.25;
export const ACRE_REDUCTION_HISTORIQUE: ReductionAcre = 0.5;
export const ACRE_REDUCTION_DEPUIS_JUILLET_2026: ReductionAcre = 0.25;

// ── Hypothèses du comparatif de statuts (ordres de grandeur) ────────────────
export const HYPOTHESES_COMPARATIF = {
  /** Comptabilité, frais juridiques et bancaires d'une SASU, par an. */
  sasu_frais_fixes_annuels: 2_500,
  /** Salaire net du président ≈ 55 % du coût total employeur. */
  sasu_ratio_net_sur_cout: 0.55,
  /** Frais de gestion de la société de portage, en % du CA. */
  portage_frais_gestion: 0.08,
  /** Salaire net ≈ 55 % du montant restant après frais de gestion. */
  portage_ratio_net_sur_cout: 0.55,
  /** Abattement de 10 % sur les salaires pour le calcul de l'impôt. */
  abattement_salaires: 0.10,
} as const;

/** Formate un taux (0.256) en pourcentage français (« 25,6 % »). */
export function formatTaux(taux: number): string {
  return `${(taux * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`;
}
