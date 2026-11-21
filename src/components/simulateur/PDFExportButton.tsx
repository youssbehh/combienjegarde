import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { jsPDF } from 'jspdf';
import type { ResultatSimulation, ResultatComparatif, Secteur } from '../../types';
import { TAUX_PAR_ANNEE, formatTaux } from '../../lib/constants';
import { CONTACT_EMAIL, PAIEMENT_ACTIF, PRIX_PDF, STRIPE_PAYMENT_LINK } from '../../lib/site';
import type { AnneeFiscale } from '../../lib/constants';

const STORAGE_KEY = 'cjg_pending_pdf';

interface PendingPDF {
  resultats: ResultatSimulation;
  comparatif: ResultatComparatif;
  secteur: Secteur;
}

interface Props {
  resultats: ResultatSimulation;
  comparatif: ResultatComparatif;
  secteur: Secteur;
}

const secteurLabels: Record<Secteur, string> = {
  bic_vente: 'BIC Vente (Commerce / Artisanat)',
  bic_services: 'BIC Services (Conseil / Prestation)',
  bnc: 'BNC (Profession libérale / Freelance — SSI)',
  bnc_cipav: 'BNC (Profession réglementée — CIPAV)',
};

const conseils: Record<Secteur, string[]> = {
  bnc_cipav: [
    "Vos cotisations CIPAV (23,2 %) couvrent votre retraite de base et complémentaire CIPAV — vérifiez votre relevé de points chaque année.",
    "Provisionnez 30-35% de chaque encaissement pour charges sociales et fiscales.",
    "Surveillez votre seuil de franchise TVA (37 500 €, majoré 41 250 €) : au-delà du seuil majoré, la TVA s'applique dès le jour du dépassement.",
    "Comparez le versement libératoire (2,2 % du CA) au barème : il n'est intéressant que si vous êtes imposable.",
    "Consultez un expert-comptable dès 40 000 €/an pour optimiser votre structure.",
  ],
  bnc: [
    "Comparez le versement libératoire (2,2 % du CA) au barème progressif : il n'est intéressant que si vous êtes imposable.",
    "Provisionnez 28-32% de chaque encaissement pour vos charges sociales et fiscales afin d'éviter les mauvaises surprises.",
    "Déclarez à l'URSSAF mensuellement si votre CA est irrégulier — cela lisse vos paiements.",
    "Surveillez votre seuil de franchise TVA (37 500 €, majoré 41 250 €) : au-delà du seuil majoré, la TVA s'applique dès le jour du dépassement.",
    "Consultez un expert-comptable dès 40 000 €/an : les économies réalisées couvrent largement ses honoraires.",
  ],
  bic_services: [
    "Vérifiez votre éligibilité au versement libératoire (revenu fiscal de référence N-2 inférieur ou égal à 28 797 € par part pour 2026).",
    "L'abattement forfaitaire de 50% signifie que seule la moitié de votre CA est imposable à l'IR.",
    "Franchise TVA jusqu'à 37 500 €/an — mentionnez 'TVA non applicable - art. 293 B CGI' sur vos factures.",
    "Au-delà de 50 000 €/an, comparez sérieusement avec la SASU : les charges peuvent être inférieures.",
    "ACRE : réduction de cotisations en début d'activité (50 % pour une création avant le 1er juillet 2026, 25 % depuis), sous conditions.",
  ],
  bic_vente: [
    "L'abattement de 71% est votre principal avantage fiscal : seuls 29% de votre CA sont imposables à l'IR.",
    "Taux de cotisations le plus bas du régime (12,3%) — provisionnez 15-18% de votre CA.",
    "Franchise TVA jusqu'à 85 000 €/an pour la vente — bien au-dessus des services.",
    "Anticipez la CFE dès la 2e année d'activité (environ 200€/an, variable selon la commune).",
    "Le plafond micro-BIC vente est de 203 100 €/an depuis 2026 — au-delà, deux années de suite, vous basculez au régime réel.",
  ],
};

const planAction: Record<Secteur, string[]> = {
  bnc_cipav: [
    "📅 Déclarez votre CA URSSAF avant le 31 janvier (trimestriel) ou mensuellement",
    "💰 Ouvrez un compte bancaire dédié et provisionnez 32% de chaque encaissement",
    "Choisissez une plateforme agréée : réception des factures électroniques obligatoire depuis septembre 2026, émission en septembre 2027",
    "📊 Vérifiez votre relevé de points CIPAV chaque année sur cipav.fr",
    "Vérifiez si l'ACRE vous est applicable à la création (réduction de 25 % depuis le 1er juillet 2026)",
  ],
  bnc: [
    "📅 Déclarez votre CA URSSAF avant le 31 janvier (trimestriel) ou le 31 de chaque mois (mensuel)",
    "💰 Ouvrez un compte bancaire dédié à votre activité pour suivre facilement vos flux",
    "Choisissez une plateforme agréée : réception des factures électroniques obligatoire depuis septembre 2026, émission en septembre 2027",
    "📊 Réévaluez votre option fiscale (PL vs barème) chaque année en octobre avant la date limite",
    "🔍 Vérifiez si l'ACRE vous est applicable — demande à faire dès la création",
  ],
  bic_services: [
    "📅 Déclarez votre CA URSSAF avant le 31 janvier ou mensuellement pour plus de régularité",
    "💰 Provisionnez 25% de chaque facture sur un compte séparé pour les charges",
    "Choisissez une plateforme agréée : réception des factures électroniques obligatoire depuis septembre 2026, émission en septembre 2027",
    "📊 Comparez régime AE vs SASU chaque année si votre CA dépasse 40 000 €",
    "Vérifiez les plafonds de CA chaque année (BIC services : 83 600 €/an depuis 2026)",
  ],
  bic_vente: [
    "📅 Déclarez votre CA URSSAF avant la date limite (mensuel ou trimestriel)",
    "💰 Tenez un registre des achats et des recettes — obligatoire en BIC vente",
    "Choisissez une plateforme agréée : réception des factures électroniques obligatoire depuis septembre 2026, émission en septembre 2027",
    "📊 Surveillez le seuil TVA de 85 000 € : dépassement = obligations TVA immédiates",
    "Au-delà de 85 000 €/an, vous devenez redevable de la TVA : anticipez la facturation et les déclarations",
  ],
};

const calendrierFiscal = [
  { mois: 'Janvier', action: 'Déclaration CA URSSAF T4 (si trimestriel) — avant le 31/01' },
  { mois: 'Avril',   action: 'Déclaration CA URSSAF T1 — avant le 30/04' },
  { mois: 'Mai',     action: 'Déclaration revenus IR (formulaire 2042 C PRO) — avant fin mai' },
  { mois: 'Juillet', action: 'Déclaration CA URSSAF T2 — avant le 31/07' },
  { mois: 'Octobre', action: 'Déclaration CA URSSAF T3 — avant le 31/10 | Délai option prélèvement libératoire N+1' },
  { mois: 'Décembre', action: 'Paiement CFE (Cotisation Foncière des Entreprises) — avant le 15/12' },
];

// ─── Helpers PDF ────────────────────────────────────────────────────────────

function headerBande(doc: jsPDF, titre: string, sous?: string) {
  doc.setFillColor(27, 45, 107);
  doc.rect(0, 0, 210, sous ? 28 : 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(sous ? 14 : 13);
  doc.text(titre, 20, sous ? 13 : 15);
  if (sous) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 200, 240);
    doc.text(sous, 20, 23);
  }
}

function ligneTableau(doc: jsPDF, y: number, label: string, valeur: string, couleurValeur?: [number, number, number], gris = false) {
  if (gris) {
    doc.setFillColor(248, 249, 250);
    doc.rect(14, y - 5, 182, 10, 'F');
  }
  doc.setTextColor(108, 117, 125);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(label, 20, y);
  doc.setFont('helvetica', 'bold');
  if (couleurValeur) doc.setTextColor(...couleurValeur);
  else doc.setTextColor(52, 58, 64);
  doc.text(valeur, 190, y, { align: 'right' });
  doc.setTextColor(52, 58, 64);
}

function pied(doc: jsPDF, page: number, total: number) {
  doc.setFontSize(7.5);
  doc.setTextColor(108, 117, 125);
  doc.setFont('helvetica', 'normal');
  doc.text('CombienJeGarde.fr — Estimation basée sur les taux officiels. Non contractuel.', 20, 288);
  doc.text(`${page}/${total}`, 190, 288, { align: 'right' });
}

// ─── Constructeur PDF ────────────────────────────────────────────────────────

/** Remplace les caractères absents de la police Helvetica intégrée au PDF. */
function nettoyerTexte(texte: string): string {
  return texte
    .replace(/[\u00A0\u202F\u2009]/g, ' ')
    .replace(/\u2212/g, '-')
    .replace(/≤/g, '<=')
    .replace(/→/g, '->')
    .replace(/[✓✔]/g, '-')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B50}]/gu, '')
    .replace(/ {2,}/g, ' ')
    .trimStart();
}

async function buildPDF(data: PendingPDF) {
  // jsPDF (~170 Ko compressés) n'est téléchargé qu'au moment de générer le rapport
  const { jsPDF: JsPDF } = await import('jspdf');
  const { resultats, comparatif, secteur } = data;
  const annee: AnneeFiscale = (resultats.annee ?? 2026) as AnneeFiscale;
  const taux = TAUX_PAR_ANNEE[annee];
  const doc = new JsPDF();
  const ecrireTexte = doc.text.bind(doc) as (...args: unknown[]) => jsPDF;
  const decouper = doc.splitTextToSize.bind(doc);
  doc.splitTextToSize = ((texte: string, largeur: number) => decouper(nettoyerTexte(texte), largeur)) as typeof doc.splitTextToSize;
  doc.text = ((texte: string | string[], ...reste: unknown[]) =>
    ecrireTexte(Array.isArray(texte) ? texte.map(nettoyerTexte) : nettoyerTexte(texte), ...reste)) as typeof doc.text;
  const date = new Date().toLocaleDateString('fr-FR');
  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' €';
  const PAGES = 6;

  // ── PAGE 1 : Couverture ──────────────────────────────────────────────────
  doc.setFillColor(27, 45, 107);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(46, 196, 182);
  doc.rect(0, 0, 8, 297, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('CombienJeGarde.fr', 20, 70);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(180, 210, 240);
  doc.text('Rapport de simulation personnalisé', 20, 85);

  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`Généré le ${date}`, 20, 100);
  doc.text(`Année fiscale : ${annee}`, 20, 112);
  doc.text(`Secteur : ${secteurLabels[secteur]}`, 20, 124);

  // Encadré résultat clé
  doc.setFillColor(46, 196, 182);
  doc.roundedRect(20, 150, 170, 55, 6, 6, 'F');
  doc.setTextColor(27, 45, 107);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Votre revenu net estimé', 105, 166, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(fmt(resultats.revenuNet), 105, 183, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`sur un CA de ${fmt(resultats.cabrut)}/mois  ·  Taux de prélèvement : ${resultats.tauxPrelevement}%`, 105, 196, { align: 'center' });

  doc.setTextColor(100, 140, 200);
  doc.setFontSize(9);
  doc.text('Ce rapport contient 6 pages : résultats, projections, comparatif, calendrier, conseils et e-facturation', 105, 270, { align: 'center' });

  // ── PAGE 2 : Détail des résultats ────────────────────────────────────────
  doc.addPage();
  headerBande(doc, `Détail de votre simulation ${annee}`, `CA mensuel : ${fmt(resultats.cabrut)}  ·  Secteur : ${secteurLabels[secteur]}`);

  let y = 45;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 45, 107);
  doc.text('Décomposition mensuelle', 20, y);
  y += 10;

  ligneTableau(doc, y, 'Chiffre d\'affaires brut', fmt(resultats.cabrut), undefined, false); y += 12;
  ligneTableau(doc, y, `Cotisations URSSAF (${formatTaux(taux.cotisations[secteur])}${resultats.acreApplique ? ', ACRE déduite' : ''} + formation)`, `− ${fmt(resultats.cotisationsURSSAF)}`, [230, 57, 70], true); y += 12;
  ligneTableau(doc, y, 'Impôt sur le revenu (estimé)', `− ${fmt(resultats.impotEstime)}`, [255, 159, 28], false); y += 12;
  ligneTableau(doc, y, 'CFE (lissée sur 12 mois)', `− ${fmt(resultats.cfeEstimee)}`, [108, 117, 125], true); y += 14;

  doc.setFillColor(27, 45, 107);
  doc.rect(14, y - 5, 182, 13, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Revenu net réel', 20, y + 3);
  doc.text(fmt(resultats.revenuNet), 190, y + 3, { align: 'right' });
  y += 22;

  doc.setTextColor(52, 58, 64);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 45, 107);
  doc.text('Projection annuelle', 20, y); y += 10;

  ligneTableau(doc, y, 'CA annuel', fmt(resultats.cabrut * 12), undefined, false); y += 12;
  ligneTableau(doc, y, 'Cotisations annuelles', `− ${fmt(resultats.cotisationsURSSAF * 12)}`, [230, 57, 70], true); y += 12;
  ligneTableau(doc, y, 'Impôt annuel estimé', `− ${fmt(resultats.impotEstime * 12)}`, [255, 159, 28], false); y += 12;
  ligneTableau(doc, y, 'CFE annuelle', `− ${fmt(resultats.cfeEstimee * 12)}`, [108, 117, 125], true); y += 14;

  doc.setFillColor(46, 196, 182);
  doc.rect(14, y - 5, 182, 13, 'F');
  doc.setTextColor(27, 45, 107);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Revenu net annuel', 20, y + 3);
  doc.text(fmt(resultats.revenuNet * 12), 190, y + 3, { align: 'right' });
  y += 24;

  // Taux de prélèvement visuel
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(108, 117, 125);
  doc.text(`Taux global de prélèvement : ${resultats.tauxPrelevement}% de votre CA`, 20, y);
  const barW = 160;
  const fillW = Math.round(barW * resultats.tauxPrelevement / 100);
  doc.setFillColor(233, 236, 239);
  doc.roundedRect(20, y + 4, barW, 6, 3, 3, 'F');
  doc.setFillColor(230, 57, 70);
  doc.roundedRect(20, y + 4, fillW, 6, 3, 3, 'F');

  pied(doc, 2, PAGES);

  // ── PAGE 3 : Comparatif AE / SASU / Portage ──────────────────────────────
  doc.addPage();
  headerBande(doc, 'Comparatif des statuts juridiques', 'Auto-entrepreneur · SASU · Portage salarial');

  y = 40;
  const cols = [20, 80, 130, 175];
  const headers = ['', 'Auto-entrepreneur', 'SASU', 'Portage'];

  doc.setFillColor(27, 45, 107);
  doc.rect(14, y - 6, 182, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  headers.forEach((h, i) => doc.text(h, cols[i], y));
  y += 8;

  const lignes = [
    ['Net après impôt/mois', fmt(comparatif.ae.revenuNet), fmt(comparatif.sasu.revenuNet), fmt(comparatif.portage.revenuNet)],
    ['Cotisations sociales/mois', fmt(comparatif.ae.cotisationsURSSAF), fmt(comparatif.sasu.charges), fmt(comparatif.portage.charges)],
    ['Frais de structure/mois', fmt(comparatif.ae.cfeEstimee), fmt(comparatif.sasu.fraisFixes), fmt(comparatif.portage.fraisPortage)],
    ['Impôt sur le revenu/mois', fmt(comparatif.ae.impotEstime), fmt(comparatif.sasu.impot), fmt(comparatif.portage.impot)],
    ['Net après impôt/an', fmt(comparatif.ae.revenuNet * 12), fmt(comparatif.sasu.revenuNet * 12), fmt(comparatif.portage.revenuNet * 12)],
    ['Complexité', 'Très simple', 'Élevée', 'Moyenne'],
    ['Protection sociale', 'Basique (SSI)', 'Assimilé salarié', 'Salarié régime gén.'],
    ['Comptable obligatoire', 'Non', 'Oui (~2-4k€/an)', 'Non'],
    ['Plafond CA', fmt(taux.plafonds_ca[secteur]) + '/an', 'Illimité', 'Selon société'],
  ];

  lignes.forEach((row, ri) => {
    const isGris = ri % 2 === 0;
    if (isGris) { doc.setFillColor(248, 249, 250); doc.rect(14, y - 5, 182, 10, 'F'); }
    doc.setFont('helvetica', ri === 0 ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.setTextColor(ri === 0 ? 27 : 52, ri === 0 ? 45 : 58, ri === 0 ? 107 : 64);
    row.forEach((cell, ci) => doc.text(cell, cols[ci], y));
    y += 10;
  });

  y += 6;
  const caAnnuel = resultats.cabrut * 12;
  const msg = caAnnuel < 30000
    ? { icon: '✅', text: "Votre CA est adapté au régime auto-entrepreneur. C'est le statut le plus simple et le plus avantageux à ce niveau." }
    : caAnnuel < 70000
    ? { icon: '⚠️', text: "À partir de 50 000 €/an, la SASU peut devenir plus intéressante. Faites comparer par un comptable." }
    : { icon: '🔄', text: "À ce niveau de CA, une SASU vous permettrait probablement d'économiser sur les charges sociales." };

  doc.setFillColor(240, 248, 255);
  doc.roundedRect(14, y, 182, 20, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(27, 45, 107);
  doc.text(msg.icon + ' ' + msg.text, 20, y + 7, { maxWidth: 170 });

  pied(doc, 3, PAGES);

  // ── PAGE 4 : Calendrier fiscal ───────────────────────────────────────────
  doc.addPage();
  headerBande(doc, `Votre calendrier fiscal ${annee}`, 'Dates clés à ne pas manquer pour un auto-entrepreneur');

  y = 38;
  calendrierFiscal.forEach((evt, i) => {
    const isGris = i % 2 === 0;
    if (isGris) { doc.setFillColor(248, 249, 250); doc.rect(14, y - 5, 182, 14, 'F'); }
    doc.setFillColor(27, 45, 107);
    doc.roundedRect(14, y - 5, 28, 14, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(evt.mois, 28, y + 1, { align: 'center' });
    doc.setTextColor(52, 58, 64);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(evt.action, 148);
    doc.text(lines, 47, y + 1);
    y += 16;
  });

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(27, 45, 107);
  doc.text('Seuils importants à surveiller', 20, y); y += 10;

  const seuilsTaux = TAUX_PAR_ANNEE[annee];
  const seuilsData = [
    ['Plafond CA (votre secteur)', fmt(seuilsTaux.plafonds_ca[secteur]) + '/an', 'Dépassement = sortie du régime micro'],
    ['Franchise TVA', fmt(seuilsTaux.seuils_tva[secteur]) + '/an', 'Dépassement = TVA obligatoire'],
    ['Facture électronique', 'Sept. 2027', 'Émission obligatoire (réception : sept. 2026)'],
    ['Plafond RFR versement lib.', fmt(seuilsTaux.plafond_rfr_pl) + '/part', 'Au-delà = option impossible'],
  ];

  seuilsData.forEach((row, i) => {
    const isGris = i % 2 === 0;
    if (isGris) { doc.setFillColor(248, 249, 250); doc.rect(14, y - 5, 182, 10, 'F'); }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(52, 58, 64);
    doc.text(row[0], 20, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 45, 107);
    doc.text(row[1], 105, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(108, 117, 125);
    doc.text(row[2], 190, y, { align: 'right' });
    y += 10;
  });

  pied(doc, 4, PAGES);

  // ── PAGE 5 : Conseils + plan d'action ───────────────────────────────────
  doc.addPage();
  headerBande(doc, '5 conseils personnalisés & plan d\'action', `Profil : ${secteurLabels[secteur]}`);

  y = 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 45, 107);
  doc.text('Conseils fiscaux personnalisés', 20, y); y += 8;

  conseils[secteur].forEach((conseil, i) => {
    doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255);
    doc.rect(14, y - 4, 182, 14, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(46, 196, 182);
    doc.text(`${i + 1}`, 20, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(52, 58, 64);
    const lines = doc.splitTextToSize(conseil, 158);
    doc.text(lines, 28, y + 2);
    y += lines.length > 1 ? 16 : 12;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 45, 107);
  doc.text('Votre plan d\'action', 20, y); y += 8;

  planAction[secteur].forEach((action, i) => {
    doc.setFillColor(i % 2 === 0 ? 240 : 255, i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 255 : 255);
    doc.rect(14, y - 4, 182, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(52, 58, 64);
    const lines = doc.splitTextToSize(action, 170);
    doc.text(lines, 20, y + 2);
    y += 12;
  });

  pied(doc, 5, PAGES);

  // ── PAGE 6 : E-facturation ───────────────────────────────────────────────
  doc.addPage();
  headerBande(doc, 'Facturation électronique : où en êtes-vous ?', 'Réforme obligatoire pour toutes les entreprises, micro-entrepreneurs compris');

  y = 36;

  const efacBlocs = [
    {
      titre: "Qu'est-ce que l'e-facturation ?",
      texte: "L'e-facturation (facturation électronique) est l'émission et la réception de factures dans un format structuré et numérique normalisé (Factur-X, UBL, CII). À la différence d'un PDF classique, la facture électronique est lisible par les systèmes informatiques et transmise via une plateforme agréée par l'État.",
    },
    {
      titre: 'Calendrier de déploiement',
      texte: "• 1er septembre 2026 : toutes les entreprises, micro-entrepreneurs compris, doivent pouvoir RECEVOIR des factures électroniques ; les grandes entreprises et ETI doivent en émettre\n• 1er septembre 2027 : les PME et micro-entreprises doivent à leur tour ÉMETTRE leurs factures au format électronique\n• Sont concernées les opérations entre entreprises établies en France (B2B), y compris en franchise de TVA.",
    },
    {
      titre: 'Ce que vous devrez faire en tant qu\'auto-entrepreneur',
      texte: "1. Choisir une plateforme agréée (PA, ex-PDP) dans la liste publiée sur impots.gouv.fr — plusieurs proposent une offre gratuite\n2. Recevoir les factures de vos fournisseurs par cette plateforme (obligatoire depuis septembre 2026)\n3. Émettre vos factures via cette plateforme dans un format structuré, au plus tard en septembre 2027\n4. Le portail public ne propose plus de service de facturation gratuit : il sert d'annuaire et transmet les données à l'administration",
    },
    {
      titre: 'Ce qui NE change PAS',
      texte: "• Les ventes aux particuliers (B2C) ne donnent pas lieu à facture électronique, mais leurs données devront être transmises (e-reporting)\n• Les mentions légales obligatoires sur vos factures restent identiques\n• La franchise TVA et les taux de cotisations ne sont pas modifiés par cette réforme",
    },
    {
      titre: 'Avantages pour vous',
      texte: "✓ Suivi en temps réel de vos factures émises et reçues\n✓ Pré-remplissage automatique de vos déclarations de TVA (si applicable)\n✓ Réduction des délais de paiement\n✓ Dématérialisation complète : fini les factures PDF perdues dans les emails",
    },
  ];

  efacBlocs.forEach((bloc) => {
    doc.setFillColor(240, 244, 255);
    const textLines = doc.splitTextToSize(bloc.texte, 165);
    const blockH = 10 + textLines.length * 5 + 4;
    doc.roundedRect(14, y - 4, 182, blockH, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(27, 45, 107);
    doc.text(bloc.titre, 20, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(52, 58, 64);
    doc.text(textLines, 20, y + 9);
    y += blockH + 5;
  });

  pied(doc, 6, PAGES);

  doc.save(`rapport-combienjegarde-${date.replace(/\//g, '-')}.pdf`);
}

// ─── Composant ───────────────────────────────────────────────────────────────

type EtatRetour = 'aucun' | 'verification' | 'telecharge' | 'echec';

async function paiementConfirme(sessionId: string): Promise<boolean> {
  try {
    const reponse = await fetch(`/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`);
    if (!reponse.ok) return false;
    const corps: { paid?: boolean } = await reponse.json();
    return corps.paid === true;
  } catch {
    return false;
  }
}

/**
 * Au retour de Stripe (?pdf=success&session_id=…), vérifie le paiement côté
 * serveur puis génère le rapport de la simulation mise de côté avant le départ.
 */
function useRetourPaiement(): EtatRetour {
  const [etat, setEtat] = useState<EtatRetour>('aucun');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pdf') !== 'success') return;

    const sessionId = params.get('session_id') ?? '';
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      raw = null;
    }
    window.history.replaceState({}, '', window.location.pathname);
    if (!raw || !sessionId) return;

    let annule = false;
    setEtat('verification');

    (async () => {
      const confirme = await paiementConfirme(sessionId);
      if (annule) return;
      if (!confirme) {
        setEtat('echec');
        return;
      }
      try {
        await buildPDF(JSON.parse(raw) as PendingPDF);
        localStorage.removeItem(STORAGE_KEY);
        setEtat('telecharge');
      } catch {
        setEtat('echec');
      }
    })();

    return () => {
      annule = true;
    };
  }, []);

  return etat;
}

export default function PDFExportButton({ resultats, comparatif, secteur }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const etatRetour = useRetourPaiement();
  const boutonOuvrirRef = useRef<HTMLButtonElement>(null);
  const boutonPayerRef = useRef<HTMLButtonElement>(null);

  // Fenêtre modale : focus à l'ouverture, fermeture avec Échap, focus rendu à la fermeture
  useEffect(() => {
    if (!modalOpen) return;
    const declencheur = boutonOuvrirRef.current;
    boutonPayerRef.current?.focus();
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', surTouche);
    return () => {
      document.removeEventListener('keydown', surTouche);
      declencheur?.focus();
    };
  }, [modalOpen]);

  const handlePay = () => {
    const pending: PendingPDF = { resultats, comparatif, secteur };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    } catch {
      // Stockage indisponible (navigation privée) : le rapport ne pourra pas être généré au retour
      return;
    }
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  const messageRetour = {
    aucun: null,
    verification: { texte: 'Vérification de votre paiement…', couleur: '#6C757D' },
    telecharge: { texte: '✅ Paiement confirmé — votre rapport a été téléchargé.', couleur: '#1A9E92' },
    echec: { texte: `Le paiement n'a pas pu être vérifié. Si vous avez été débité, écrivez à ${CONTACT_EMAIL}.`, couleur: '#B02A37' },
  }[etatRetour];

  // Tant que la vente n'est pas configurée (lien Stripe + identité de l'éditeur), rien n'est proposé
  if (!PAIEMENT_ACTIF && !messageRetour) return null;

  return (
    <div>
      {PAIEMENT_ACTIF && (
        <button
          ref={boutonOuvrirRef}
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full font-titre font-bold text-white rounded-xl px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 bg-orange-hover"
          style={{ fontSize: '18px', boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)' }}
        >
          📄 Télécharger mon rapport complet — {PRIX_PDF}
        </button>
      )}

      {messageRetour && (
        <p role="status" className="text-center font-corps text-sm mt-2" style={{ color: messageRetour.couleur }}>
          {messageRetour.texte}
        </p>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-modale-pdf"
            className="bg-white rounded-card-lg p-8 max-w-md w-full shadow-xl animate-fadeInUp"
          >
            <h3 id="titre-modale-pdf" className="font-titre font-bold text-xl text-bleu-marine mb-1">Rapport PDF — 6 pages</h3>
            <p className="font-corps text-xs text-gris-moyen mb-5">Personnalisé pour votre profil · Taux {resultats.annee}</p>
            <ul className="font-corps text-sm text-gris-fonce mb-6 space-y-2">
              <li>📊 <strong>Pages 1–2 :</strong> couverture + détail mensuel et annuel</li>
              <li>⚖️ <strong>Page 3 :</strong> comparatif AE / SASU / portage chiffré</li>
              <li>📅 <strong>Page 4 :</strong> calendrier fiscal {resultats.annee} + seuils à surveiller</li>
              <li>💡 <strong>Page 5 :</strong> 5 conseils fiscaux + plan d'action en 5 étapes</li>
              <li>🧾 <strong>Page 6 :</strong> guide de la facturation électronique</li>
            </ul>
            <div className="flex gap-3">
              <button
                ref={boutonPayerRef}
                type="button"
                onClick={handlePay}
                className="flex-1 font-titre font-bold text-white rounded-xl py-3 transition-all hover:opacity-90 bg-orange-hover"
              >
                Payer {PRIX_PDF} →
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-3 rounded-xl border border-gris-clair font-corps text-sm text-gris-moyen hover:border-bleu-marine transition-colors"
              >
                Annuler
              </button>
            </div>
            <p className="mt-3 text-center font-corps text-xs text-gris-moyen leading-relaxed">
              Paiement sécurisé par Stripe · PDF généré et téléchargé au retour sur le site.
              <br />
              Contenu numérique fourni immédiatement : en payant, vous acceptez les{' '}
              <Link to="/cgv" className="underline">conditions générales de vente</Link> et renoncez à votre droit de rétractation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
