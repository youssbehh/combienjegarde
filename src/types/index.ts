import type { Secteur, AnneeFiscale, ReductionAcre } from '../lib/constants';

export type { Secteur, AnneeFiscale };

export interface ParamsSimulation {
  /** Chiffre d'affaires mensuel. */
  ca: number;
  secteur: Secteur;
  prelevementLiberatoire: boolean;
  /** Autres revenus imposables annuels du foyer (hors auto-entreprise). */
  revenuFiscalRef: number;
  nbParts: number;
  annee: AnneeFiscale;
  acre?: boolean;
  /** Réduction ACRE : 0,5 par défaut, 0,25 pour une création depuis le 1er juillet 2026. */
  acreReduction?: ReductionAcre;
}

export interface ResultatSimulation {
  cabrut: number;
  /** Cotisations sociales + contribution à la formation professionnelle. */
  cotisationsURSSAF: number;
  /** Part « formation professionnelle » incluse dans cotisationsURSSAF. */
  formationPro?: number;
  impotEstime: number;
  cfeEstimee: number;
  revenuNet: number;
  tauxPrelevement: number;
  annee: AnneeFiscale;
  acreApplique?: boolean;
  acreReduction?: number;
  detail: {
    cotisations: number;
    impot: number;
    cfe: number;
    net: number;
  };
}

export interface ResultatComparatif {
  ae: ResultatSimulation;
  sasu: { revenuNet: number; charges: number; fraisFixes: number; impot: number };
  portage: { revenuNet: number; charges: number; fraisPortage: number; impot: number };
}

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  readingTime: number;
  summary: string;
  badge?: '2025' | '2026' | 'Nouveau';
  faq: { question: string; answer: string }[];
}
