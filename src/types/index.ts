import type { Secteur } from '../lib/constants';

export type { Secteur };

export interface ParamsSimulation {
  ca: number;
  secteur: Secteur;
  prelevementLiberatoire: boolean;
  revenuFiscalRef: number;
  nbParts: number;
}

export interface ResultatSimulation {
  cabrut: number;
  cotisationsURSSAF: number;
  impotEstime: number;
  cfeEstimee: number;
  revenuNet: number;
  tauxPrelevement: number;
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
  faq: { question: string; answer: string }[];
}
