import { TAUX_2025 } from './constants';
import type { ParamsSimulation, ResultatSimulation, ResultatComparatif } from '../types';

function calculerIRBareme(revenuImposableAnnuel: number, nbParts: number): number {
  const quotient = revenuImposableAnnuel / nbParts;
  let impotParPart = 0;
  let seuilPrecedent = 0;

  for (const tranche of TAUX_2025.bareme_ir) {
    if (quotient <= seuilPrecedent) break;
    const imposable = Math.min(quotient, tranche.seuil) - seuilPrecedent;
    impotParPart += imposable * tranche.taux;
    seuilPrecedent = tranche.seuil;
  }

  return Math.round((impotParPart * nbParts) / 12);
}

export function calculerRevenuNet(params: ParamsSimulation): ResultatSimulation {
  const { ca, secteur, prelevementLiberatoire, revenuFiscalRef, nbParts } = params;

  const cotisationsURSSAF = Math.round(ca * TAUX_2025.cotisations[secteur]);

  let impotEstime: number;
  if (prelevementLiberatoire) {
    impotEstime = Math.round(ca * TAUX_2025.prelevement_liberatoire[secteur]);
  } else {
    const abattement = TAUX_2025.abattement_forfaitaire[secteur];
    const caAnnuel = ca * 12;
    const revenuImposableAE = Math.round(caAnnuel * (1 - abattement));
    const revenuGlobal = revenuImposableAE + revenuFiscalRef;
    impotEstime = calculerIRBareme(revenuGlobal, nbParts);
  }

  const cfeEstimee = TAUX_2025.cfe_mensuelle;
  const revenuNet = Math.max(0, ca - cotisationsURSSAF - impotEstime - cfeEstimee);
  const tauxPrelevement = ca > 0
    ? Math.round(((cotisationsURSSAF + impotEstime + cfeEstimee) / ca) * 1000) / 10
    : 0;

  return {
    cabrut: ca,
    cotisationsURSSAF,
    impotEstime,
    cfeEstimee,
    revenuNet,
    tauxPrelevement,
    detail: {
      cotisations: cotisationsURSSAF,
      impot: impotEstime,
      cfe: cfeEstimee,
      net: revenuNet,
    },
  };
}

export function calculerComparatif(params: ParamsSimulation): ResultatComparatif {
  const ae = calculerRevenuNet(params);

  const chargesSASU = Math.round(params.ca * 0.45);
  const resultatAvantIS = params.ca - chargesSASU;
  const is = Math.round(Math.max(0, resultatAvantIS) * 0.15);
  const sasu = {
    revenuNet: Math.max(0, resultatAvantIS - is),
    charges: chargesSASU,
    is,
  };

  const fraisPortage = Math.round(params.ca * 0.10);
  const basePortage = params.ca - fraisPortage;
  const chargesPortage = Math.round(basePortage * 0.22);
  const portage = {
    revenuNet: Math.max(0, basePortage - chargesPortage),
    fraisPortage,
  };

  return { ae, sasu, portage };
}
