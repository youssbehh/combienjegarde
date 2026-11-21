import { HYPOTHESES_COMPARATIF, TAUX_PAR_ANNEE } from './constants';
import type { TauxAnnee } from './constants';
import type { ParamsSimulation, ResultatSimulation, ResultatComparatif } from '../types';

/**
 * Impôt sur le revenu annuel du foyer : barème progressif, quotient familial
 * et décote. Le plafonnement du quotient familial n'est pas modélisé.
 */
export function calculerImpotAnnuel(
  revenuImposableAnnuel: number,
  nbParts: number,
  taux: Pick<TauxAnnee, 'bareme_ir' | 'decote'>
): number {
  if (revenuImposableAnnuel <= 0) return 0;

  const quotient = revenuImposableAnnuel / nbParts;
  let impotParPart = 0;
  let seuilPrecedent = 0;

  for (const tranche of taux.bareme_ir) {
    if (quotient <= seuilPrecedent) break;
    const imposable = Math.min(quotient, tranche.seuil) - seuilPrecedent;
    impotParPart += imposable * tranche.taux;
    seuilPrecedent = tranche.seuil;
  }

  const impotBrut = impotParPart * nbParts;

  // Décote : forfait « couple » à partir de 2 parts, « personne seule » sinon.
  const forfait = nbParts >= 2 ? taux.decote.forfaitCouple : taux.decote.forfaitSeul;
  const decote = Math.max(0, forfait - impotBrut * taux.decote.taux);

  return Math.max(0, Math.round(impotBrut - decote));
}

/**
 * Impôt mensuel imputable à un revenu d'activité : différence entre l'impôt
 * du foyer avec et sans ce revenu (les autres revenus restent imposés par ailleurs).
 */
function impotMensuelSupplementaire(
  revenuActiviteImposableAnnuel: number,
  autresRevenusAnnuels: number,
  nbParts: number,
  taux: TauxAnnee
): number {
  const avec = calculerImpotAnnuel(autresRevenusAnnuels + revenuActiviteImposableAnnuel, nbParts, taux);
  const sans = calculerImpotAnnuel(autresRevenusAnnuels, nbParts, taux);
  return Math.round(Math.max(0, avec - sans) / 12);
}

/** Vrai si les autres revenus du foyer dépassent déjà le plafond du versement libératoire. */
export function depassePlafondVersementLiberatoire(
  autresRevenusAnnuels: number,
  nbParts: number,
  taux: TauxAnnee
): boolean {
  return autresRevenusAnnuels / nbParts > taux.plafond_rfr_pl;
}

export function calculerRevenuNet(params: ParamsSimulation): ResultatSimulation {
  const { ca, secteur, prelevementLiberatoire, revenuFiscalRef, nbParts, annee, acre } = params;
  const taux = TAUX_PAR_ANNEE[annee];
  const acreReduction = acre ? (params.acreReduction ?? 0.5) : 0;

  // Cotisations sociales (réduites par l'ACRE) + contribution formation (non réduite)
  const cotisationsSociales = Math.round(ca * taux.cotisations[secteur] * (1 - acreReduction));
  const formationPro = Math.round(ca * taux.formation_pro[secteur]);
  const cotisationsURSSAF = cotisationsSociales + formationPro;

  let impotEstime: number;
  if (prelevementLiberatoire) {
    impotEstime = Math.round(ca * taux.prelevement_liberatoire[secteur]);
  } else {
    const abattement = taux.abattement_forfaitaire[secteur];
    const revenuImposableAE = Math.round(ca * 12 * (1 - abattement));
    impotEstime = impotMensuelSupplementaire(revenuImposableAE, revenuFiscalRef, nbParts, taux);
  }

  // La CFE n'est pas due l'année de création (qui est aussi celle de l'ACRE)
  const cfeEstimee = acre ? 0 : taux.cfe_mensuelle;
  const revenuNet = Math.max(0, ca - cotisationsURSSAF - impotEstime - cfeEstimee);
  const tauxPrelevement = ca > 0
    ? Math.round(((cotisationsURSSAF + impotEstime + cfeEstimee) / ca) * 1000) / 10
    : 0;

  return {
    cabrut: ca,
    cotisationsURSSAF,
    formationPro,
    impotEstime,
    cfeEstimee,
    revenuNet,
    tauxPrelevement,
    annee,
    acreApplique: !!acre,
    acreReduction,
    detail: {
      cotisations: cotisationsURSSAF,
      impot: impotEstime,
      cfe: cfeEstimee,
      net: revenuNet,
    },
  };
}

/**
 * Comparatif simplifié AE / SASU / portage, tous exprimés en revenu net
 * mensuel APRÈS impôt sur le revenu pour rester comparables.
 * SASU : tout le résultat est versé en salaire au président (pas de dividendes).
 */
export function calculerComparatif(params: ParamsSimulation): ResultatComparatif {
  const ae = calculerRevenuNet(params);
  const taux = TAUX_PAR_ANNEE[params.annee];
  const h = HYPOTHESES_COMPARATIF;

  const impotSurSalaire = (netMensuel: number) =>
    impotMensuelSupplementaire(
      Math.round(netMensuel * 12 * (1 - h.abattement_salaires)),
      params.revenuFiscalRef,
      params.nbParts,
      taux
    );

  // SASU
  const fraisFixes = Math.round(h.sasu_frais_fixes_annuels / 12);
  const budgetSalaire = Math.max(0, params.ca - fraisFixes);
  const netSasuAvantImpot = Math.round(budgetSalaire * h.sasu_ratio_net_sur_cout);
  const impotSasu = impotSurSalaire(netSasuAvantImpot);
  const sasu = {
    revenuNet: Math.max(0, netSasuAvantImpot - impotSasu),
    charges: budgetSalaire - netSasuAvantImpot,
    fraisFixes,
    impot: impotSasu,
  };

  // Portage salarial
  const fraisPortage = Math.round(params.ca * h.portage_frais_gestion);
  const basePortage = params.ca - fraisPortage;
  const netPortageAvantImpot = Math.round(basePortage * h.portage_ratio_net_sur_cout);
  const impotPortage = impotSurSalaire(netPortageAvantImpot);
  const portage = {
    revenuNet: Math.max(0, netPortageAvantImpot - impotPortage),
    charges: basePortage - netPortageAvantImpot,
    fraisPortage,
    impot: impotPortage,
  };

  return { ae, sasu, portage };
}
