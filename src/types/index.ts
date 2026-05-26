import type { Secteur, AnneeFiscale } from '../lib/constants';

export type { Secteur, AnneeFiscale };

export interface ParamsSimulation {
  ca: number;
  secteur: Secteur;
  prelevementLiberatoire: boolean;
  revenuFiscalRef: number;
  nbParts: number;
  annee: AnneeFiscale;
  acre?: boolean;
}

export interface ResultatSimulation {
  cabrut: number;
  cotisationsURSSAF: number;
  impotEstime: number;
  cfeEstimee: number;
  revenuNet: number;
  tauxPrelevement: number;
  annee: AnneeFiscale;
  acreApplique?: boolean;
  detail: {
    cotisations: number;
    impot: number;
    cfe: number;
    net: number;
  };
}

export interface ResultatComparatif {
  ae: ResultatSimulation;
  sasu: { revenuNet: number; charges: number; is: number };
  portage: { revenuNet: number; fraisPortage: number };
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
