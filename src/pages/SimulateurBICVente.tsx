import SimulateurSecteurPage from '../components/simulateur/SimulateurSecteurPage';
import { ANNEE_COURANTE, TAUX_PAR_ANNEE, formatTaux } from '../lib/constants';

const taux = TAUX_PAR_ANNEE[ANNEE_COURANTE];
const tauxVente = formatTaux(taux.cotisations.bic_vente);
const plafond = taux.plafonds_ca.bic_vente.toLocaleString('fr-FR');
const seuilTVA = taux.seuils_tva.bic_vente.toLocaleString('fr-FR');

const faq = [
  { question: `Quel est le taux de cotisations en BIC Vente en ${ANNEE_COURANTE} ?`, answer: `En ${ANNEE_COURANTE}, le taux est de ${tauxVente} du chiffre d'affaires pour le commerce, l'e-commerce et la vente de marchandises — inchangé par rapport à 2025. S'y ajoute la contribution à la formation professionnelle (0,1 %).` },
  { question: "Pourquoi l'abattement est-il si élevé en BIC Vente ?", answer: "L'abattement de 71 % reflète le coût d'achat des marchandises, très important dans le commerce. Votre revenu imposable n'est que de 29 % de votre chiffre d'affaires." },
  { question: `Quel est le plafond de chiffre d'affaires en BIC Vente en ${ANNEE_COURANTE} ?`, answer: `Le plafond annuel pour rester micro-entrepreneur en vente de marchandises est de ${plafond} € en ${ANNEE_COURANTE} (188 700 € jusqu'en 2025). La franchise de TVA s'applique jusqu'à ${seuilTVA} €.` },
  { question: `Le taux BIC Vente change-t-il en ${ANNEE_COURANTE} ?`, answer: `Non, il reste à ${tauxVente}. Seul le taux des professions libérales non réglementées (BNC) a augmenté.` },
];

export default function SimulateurBICVente() {
  return (
    <SimulateurSecteurPage
      secteur="bic_vente"
      canonical="/simulateur-bic-vente"
      seoTitle={`Simulateur revenu net BIC Vente ${ANNEE_COURANTE} — Commerce, e-commerce, artisanat`}
      seoDescription={`Calculez votre revenu net en BIC Vente (commerce) après cotisations URSSAF (${tauxVente}). Abattement de 71 %, taux officiels ${ANNEE_COURANTE}.`}
      h1={`Simulateur de revenu net BIC Vente ${ANNEE_COURANTE}`}
      intro={
        <>
          Commerce, e-commerce, vente en ligne ? En BIC Vente, vous bénéficiez du taux de cotisations le plus bas : <strong>{tauxVente}</strong> (inchangé en {ANNEE_COURANTE}), et de l'abattement forfaitaire le plus élevé : <strong>71 %</strong>.
        </>
      }
      faq={faq}
    />
  );
}
