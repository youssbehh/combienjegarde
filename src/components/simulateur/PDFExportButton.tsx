import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import type { ResultatSimulation, ResultatComparatif, Secteur } from '../../types';

// ✅ COLLE TON LIEN STRIPE ICI après l'avoir créé dans le Dashboard
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_fZubJ15rA9kmc9Aa7f9R600';

// Clé localStorage pour sauvegarder la simulation avant redirection Stripe
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

const conseils: Record<Secteur, string[]> = {
  bnc: [
    'Optez pour le prélèvement libératoire si votre TMI est inférieur à 15%.',
    'Provisionnez 25-30% de votre CA pour vos charges et impôts.',
    'Pensez à déclarer vos revenus mensuellement ou trimestriellement.',
    'Suivez de près votre seuil de franchise TVA (37 500 €/an en BNC).',
    'Consultez un comptable si votre CA dépasse 40 000 €/an.',
  ],
  bic_services: [
    'Vérifiez votre éligibilité au prélèvement libératoire (TMI < 15%).',
    'Provisionnez 25% de votre CA pour les cotisations URSSAF.',
    "La franchise TVA s'applique jusqu'à 37 500 €/an.",
    'Au-delà de 50 000 €/an, comparez avec la SASU.',
    "Pensez à l'ACRE si vous débutez (réduction de cotisations la 1ère année).",
  ],
  bic_vente: [
    "L'abattement forfaitaire de 71% est très avantageux en BIC vente.",
    'Vérifiez votre seuil TVA : 85 000 €/an en vente.',
    'Provisionnez 15-20% de votre CA pour vos charges.',
    'Anticipez la CFE dès la 2e année d\'activité.',
    'Comparez avec le statut SASU si votre CA dépasse 70 000 €/an.',
  ],
};

function buildPDF(data: PendingPDF) {
  const { resultats, comparatif, secteur } = data;
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('fr-FR');
  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' €';

  // Page 1
  doc.setFillColor(27, 45, 107);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CombienJeGarde.fr', 20, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Rapport de simulation — ${date}`, 20, 32);

  doc.setTextColor(52, 58, 64);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Résultats de votre simulation', 20, 56);

  const rows = [
    ['CA Brut', fmt(resultats.cabrut)],
    ['Cotisations URSSAF', `- ${fmt(resultats.cotisationsURSSAF)}`],
    ['Impôt estimé', `- ${fmt(resultats.impotEstime)}`],
    ['CFE (estimée)', `- ${fmt(resultats.cfeEstimee)}`],
    ['Revenu net réel', fmt(resultats.revenuNet)],
    ['Taux de prélèvement', `${resultats.tauxPrelevement} %`],
  ];

  doc.setFontSize(11);
  rows.forEach(([label, val], i) => {
    const y = 70 + i * 12;
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'bold');
    doc.text(val, 150, y, { align: 'right' });
    if (i < rows.length - 1) {
      doc.setDrawColor(233, 236, 239);
      doc.line(20, y + 3, 190, y + 3);
    }
  });

  // Page 2
  doc.addPage();
  doc.setFillColor(27, 45, 107);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Comparatif des régimes', 20, 14);

  doc.setTextColor(52, 58, 64);
  const compRows = [
    ['', 'Auto-entrepreneur', 'SASU', 'Portage'],
    ['Revenu net', fmt(comparatif.ae.revenuNet), fmt(comparatif.sasu.revenuNet), fmt(comparatif.portage.revenuNet)],
    ['Charges', fmt(comparatif.ae.cotisationsURSSAF), fmt(comparatif.sasu.charges), fmt(comparatif.portage.fraisPortage)],
  ];

  compRows.forEach((row, i) => {
    const y = 35 + i * 14;
    doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
    doc.setFontSize(10);
    row.forEach((cell, j) => {
      doc.text(cell, 20 + j * 42, y);
    });
  });

  // Page 3
  doc.addPage();
  doc.setFillColor(27, 45, 107);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('5 conseils personnalisés pour votre profil', 20, 14);

  doc.setTextColor(52, 58, 64);
  doc.setFontSize(10);
  conseils[secteur].forEach((conseil, i) => {
    const y = 35 + i * 20;
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}.`, 20, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(conseil, 155);
    doc.text(lines, 30, y);
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(108, 117, 125);
    doc.text('Source : combienjeGarde.fr — Données basées sur les taux officiels 2025', 20, 287);
    doc.text(`Page ${p}/${pageCount}`, 190, 287, { align: 'right' });
  }

  doc.save(`rapport-combienjeGarde-${date.replace(/\//g, '-')}.pdf`);
}

export default function PDFExportButton({ resultats, comparatif, secteur }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [autoDownloaded, setAutoDownloaded] = useState(false);

  // Détecte le retour depuis Stripe (?pdf=success) et génère le PDF automatiquement
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
      // Nettoie l'URL sans recharger la page
      window.history.replaceState({}, '', window.location.pathname);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [autoDownloaded]);

  const handlePay = () => {
    // Sauvegarde la simulation avant de quitter la page
    const pending: PendingPDF = { resultats, comparatif, secteur };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="w-full font-titre font-bold text-white rounded-xl px-8 py-4 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: '#FF6B35',
          fontSize: '18px',
          boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#E85A25')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#FF6B35')}
      >
        📄 Télécharger mon rapport — 4,90 €
      </button>

      {autoDownloaded && (
        <p className="text-center font-corps text-sm text-vert-menthe mt-2">
          ✅ Paiement confirmé — votre rapport a été téléchargé.
        </p>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-card-lg p-8 max-w-md w-full shadow-xl animate-fadeInUp">
            <h3 className="font-titre font-bold text-xl text-bleu-marine mb-2">Votre rapport PDF inclut</h3>
            <ul className="font-corps text-sm text-gris-fonce mb-6 space-y-2">
              <li>✅ Résumé complet de votre simulation</li>
              <li>✅ Comparatif AE / SASU / Portage salarial</li>
              <li>✅ 5 conseils personnalisés selon votre profil</li>
              <li>✅ Mention "Valable pour la déclaration 2025"</li>
              <li>✅ Sources officielles</li>
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
              Paiement sécurisé par Stripe — vous serez redirigé puis le PDF se télécharge automatiquement.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
