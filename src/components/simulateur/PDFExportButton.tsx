import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import type { ResultatSimulation, ResultatComparatif, Secteur } from '../../types';
import { TAUX_PAR_ANNEE } from '../../lib/constants';
import type { AnneeFiscale } from '../../lib/constants';

// ✅ COLLE TON LIEN STRIPE ICI après l'avoir créé dans le Dashboard
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REMPLACE_PAR_TON_LIEN';

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
  bnc: 'BNC (Profession libérale / Freelance)',
};

const conseils: Record<Secteur, string[]> = {
  bnc: [
    "Optez pour le prélèvement libératoire si votre TMI est inférieur à 15% : vous payez un taux fixe (2,2%) plutôt que le barème progressif.",
    "Provisionnez 28-32% de chaque encaissement pour vos charges sociales et fiscales afin d'éviter les mauvaises surprises.",
    "Déclarez à l'URSSAF mensuellement si votre CA est irrégulier — cela lisse vos paiements.",
    "Surveillez votre seuil TVA annuel (37 500 €) : le dépassement vous oblige à facturer la TVA dès le 1er jour du mois concerné.",
    "Consultez un expert-comptable dès 40 000 €/an : les économies réalisées couvrent largement ses honoraires.",
  ],
  bic_services: [
    "Vérifiez votre éligibilité au prélèvement libératoire (RFR N-2 ≤ 28 797 € par part en 2026).",
    "L'abattement forfaitaire de 50% signifie que seule la moitié de votre CA est imposable à l'IR.",
    "Franchise TVA jusqu'à 37 500 €/an — mentionnez 'TVA non applicable - art. 293 B CGI' sur vos factures.",
    "Au-delà de 50 000 €/an, comparez sérieusement avec la SASU : les charges peuvent être inférieures.",
    "Pensez à l'ACRE si vous créez ou venez de créer votre activité : -50% sur les cotisations la 1ère année.",
  ],
  bic_vente: [
    "L'abattement de 71% est votre principal avantage fiscal : seuls 29% de votre CA sont imposables à l'IR.",
    "Taux de cotisations le plus bas du régime (12,3%) — provisionnez 15-18% de votre CA.",
    "Franchise TVA jusqu'à 85 000 €/an pour la vente — bien au-dessus des services.",
    "Anticipez la CFE dès la 2e année d'activité (environ 200€/an, variable selon la commune).",
    "Le seuil micro-BIC vente est à 188 700 €/an — au-delà vous basculez au régime réel.",
  ],
};

const planAction: Record<Secteur, string[]> = {
  bnc: [
    "📅 Déclarez votre CA URSSAF avant le 31 janvier (trimestriel) ou le 31 de chaque mois (mensuel)",
    "💰 Ouvrez un compte bancaire dédié à votre activité pour suivre facilement vos flux",
    "📄 À partir de 2027, émettez vos factures en e-facturation (format structuré via PDP agréée)",
    "📊 Réévaluez votre option fiscale (PL vs barème) chaque année en octobre avant la date limite",
    "🔍 Vérifiez si l'ACRE vous est applicable — demande à faire dès la création",
  ],
  bic_services: [
    "📅 Déclarez votre CA URSSAF avant le 31 janvier ou mensuellement pour plus de régularité",
    "💰 Provisionnez 25% de chaque facture sur un compte séparé pour les charges",
    "📄 E-facturation obligatoire à partir de 2027 pour les factures B2B",
    "📊 Comparez régime AE vs SASU chaque année si votre CA dépasse 40 000 €",
    "🔍 Vérifiez les plafonds de CA chaque année (BIC services : 77 700 €/an)",
  ],
  bic_vente: [
    "📅 Déclarez votre CA URSSAF avant la date limite (mensuel ou trimestriel)",
    "💰 Tenez un registre des achats et des recettes — obligatoire en BIC vente",
    "📄 E-facturation obligatoire à partir de 2027 pour les factures inter-entreprises",
    "📊 Surveillez le seuil TVA de 85 000 € : dépassement = obligations TVA immédiates",
    "🔍 Au-delà de 80 000 €/an, étudiez le passage au régime réel simplifié",
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

function buildPDF(data: PendingPDF) {
  const { resultats, comparatif, secteur } = data;
  const annee: AnneeFiscale = (resultats.annee ?? 2026) as AnneeFiscale;
  const taux = TAUX_PAR_ANNEE[annee];
  const doc = new jsPDF();
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
  ligneTableau(doc, y, `Cotisations URSSAF (${(taux.cotisations[secteur] * 100).toFixed(1)}%)`, `− ${fmt(resultats.cotisationsURSSAF)}`, [230, 57, 70], true); y += 12;
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
    ['Revenu net/mois', fmt(comparatif.ae.revenuNet), fmt(comparatif.sasu.revenuNet), fmt(comparatif.portage.revenuNet)],
    ['Charges/mois', fmt(comparatif.ae.cotisationsURSSAF), fmt(comparatif.sasu.charges), fmt(comparatif.portage.fraisPortage)],
    ['Revenu net/an', fmt(comparatif.ae.revenuNet * 12), fmt(comparatif.sasu.revenuNet * 12), fmt(comparatif.portage.revenuNet * 12)],
    ['Complexité', '⭐ Très simple', '⭐⭐⭐ Élevée', '⭐⭐ Moyenne'],
    ['Protection sociale', 'Basique (SSI)', 'Assimilé salarié', 'Salarié régime gén.'],
    ['Comptable obligatoire', 'Non', 'Oui (~2-4k€/an)', 'Non'],
    ['Plafond CA', '77-189k€/an', 'Illimité', 'Variable'],
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
    ['E-facturation B2B', '2027', 'Obligation légale pour les AE'],
    ['Plafond RFR prélèv. lib.', fmt(seuilsTaux.plafond_rfr_pl) + '/part', 'Au-delà = inéligible au PL'],
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
  headerBande(doc, 'E-facturation : ce qui vous attend en 2027', 'Réforme obligatoire pour tous les auto-entrepreneurs en B2B');

  y = 36;

  const efacBlocs = [
    {
      titre: "Qu'est-ce que l'e-facturation ?",
      texte: "L'e-facturation (facturation électronique) est l'émission et la réception de factures dans un format structuré et numérique normalisé (Factur-X, UBL, CII). À la différence d'un PDF classique, la facture électronique est lisible par les systèmes informatiques et transmise via une plateforme agréée par l'État.",
    },
    {
      titre: 'Calendrier de déploiement',
      texte: "• 2026 : Grandes entreprises et ETI obligées d'émettre des e-factures\n• 2027 : PME et micro-entreprises (dont auto-entrepreneurs) — obligation d'émettre ET de recevoir\n• Toutes les entreprises françaises soumises à TVA sont concernées pour les transactions B2B.",
    },
    {
      titre: 'Ce que vous devrez faire en tant qu\'auto-entrepreneur',
      texte: "1. S'inscrire sur une Plateforme de Dématérialisation Partenaire (PDP) agréée (liste publiée par la DGFiP)\n2. Émettre vos factures via cette plateforme dans un format structuré\n3. Recevoir les factures de vos fournisseurs par le même canal\n4. Le Portail Public de Facturation (Chorus Pro / PPF) sera accessible gratuitement comme alternative",
    },
    {
      titre: 'Ce qui NE change PAS',
      texte: "• Les factures aux particuliers (B2C) ne sont PAS concernées par l'e-facturation obligatoire\n• Les mentions légales obligatoires sur vos factures restent identiques\n• La franchise TVA et les taux de cotisations ne sont pas modifiés par cette réforme",
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

  doc.save(`rapport-combienjeGarde-${date.replace(/\//g, '-')}.pdf`);
}

// ─── Composant ───────────────────────────────────────────────────────────────

export default function PDFExportButton({ resultats, comparatif, secteur }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [autoDownloaded, setAutoDownloaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pdf') !== 'success' || autoDownloaded) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const pending: PendingPDF = JSON.parse(raw);
      buildPDF(pending);
      localStorage.removeItem(STORAGE_KEY);
      setAutoDownloaded(true);
      window.history.replaceState({}, '', window.location.pathname);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [autoDownloaded]);

  const handlePay = () => {
    const pending: PendingPDF = { resultats, comparatif, secteur };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="w-full font-titre font-bold text-white rounded-xl px-8 py-4 transition-all duration-200 hover:-translate-y-0.5"
        style={{ background: '#FF6B35', fontSize: '18px', boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#E85A25')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#FF6B35')}
      >
        📄 Télécharger mon rapport complet — 4,90 €
      </button>

      {autoDownloaded && (
        <p className="text-center font-corps text-sm text-vert-menthe mt-2">
          ✅ Paiement confirmé — votre rapport a été téléchargé.
        </p>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-card-lg p-8 max-w-md w-full shadow-xl animate-fadeInUp">
            <h3 className="font-titre font-bold text-xl text-bleu-marine mb-1">Rapport PDF — 6 pages</h3>
            <p className="font-corps text-xs text-gris-moyen mb-5">Personnalisé pour votre profil · Taux {resultats.annee ?? 2026}</p>
            <ul className="font-corps text-sm text-gris-fonce mb-6 space-y-2">
              <li>📊 <strong>Page 1–2 :</strong> Couverture + détail mensuel & annuel</li>
              <li>⚖️ <strong>Page 3 :</strong> Comparatif AE / SASU / Portage avec chiffres</li>
              <li>📅 <strong>Page 4 :</strong> Calendrier fiscal {resultats.annee ?? 2026} + seuils à surveiller</li>
              <li>💡 <strong>Page 5 :</strong> 5 conseils fiscaux + plan d'action en 5 étapes</li>
              <li>🧾 <strong>Page 6 :</strong> Guide e-facturation 2027 pour auto-entrepreneur</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={handlePay}
                className="flex-1 font-titre font-bold text-white rounded-xl py-3 transition-all hover:opacity-90"
                style={{ background: '#FF6B35' }}
              >
                Payer 4,90 € →
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-3 rounded-xl border border-gris-clair font-corps text-sm text-gris-moyen hover:border-bleu-marine transition-colors"
              >
                Annuler
              </button>
            </div>
            <p className="mt-3 text-center font-corps text-xs text-gris-moyen">
              Paiement sécurisé Stripe · PDF généré et téléchargé automatiquement au retour
            </p>
          </div>
        </div>
      )}
    </>
  );
}
