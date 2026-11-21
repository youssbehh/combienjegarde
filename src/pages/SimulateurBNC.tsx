import SimulateurSecteurPage from '../components/simulateur/SimulateurSecteurPage';
import { ANNEE_COURANTE, TAUX_2025, TAUX_PAR_ANNEE, formatTaux } from '../lib/constants';

const taux = TAUX_PAR_ANNEE[ANNEE_COURANTE];
const tauxBNC = formatTaux(taux.cotisations.bnc);
const tauxBNCPrecedent = formatTaux(TAUX_2025.cotisations.bnc);
const tauxCipav = formatTaux(taux.cotisations.bnc_cipav);
const plafond = taux.plafonds_ca.bnc.toLocaleString('fr-FR');

const faq = [
  { question: `Quel est le taux de cotisations URSSAF en BNC en ${ANNEE_COURANTE} ?`, answer: `En ${ANNEE_COURANTE}, le taux est de ${tauxBNC} du chiffre d'affaires pour les professions libérales non réglementées, contre ${tauxBNCPrecedent} en 2025. S'y ajoute la contribution à la formation professionnelle (0,2 %).` },
  { question: "Qu'est-ce que le BNC ?", answer: 'Le BNC (Bénéfices Non Commerciaux) est le régime fiscal des professions libérales : développeurs, designers, consultants, médecins, avocats, etc.' },
  { question: "Quel est l'abattement forfaitaire en BNC ?", answer: "L'abattement forfaitaire est de 34 % en BNC. Votre revenu imposable correspond donc à 66 % de votre chiffre d'affaires annuel." },
  { question: 'Quelle est la différence entre BNC SSI et BNC CIPAV ?', answer: `SSI (non réglementé) : développeurs, designers, consultants — taux de ${tauxBNC} en ${ANNEE_COURANTE}. CIPAV (réglementé) : architectes, ostéopathes, psychologues… — taux de ${tauxCipav}. Le simulateur vous laisse choisir votre caisse.` },
  { question: `Quel est le plafond de chiffre d'affaires en BNC en ${ANNEE_COURANTE} ?`, answer: `Le plafond annuel est de ${plafond} € pour rester au régime micro-entrepreneur en ${ANNEE_COURANTE}. La franchise de TVA s'applique jusqu'à 37 500 €.` },
];

export default function SimulateurBNC() {
  return (
    <SimulateurSecteurPage
      secteur="bnc"
      canonical="/simulateur-bnc"
      seoTitle={`Simulateur de revenu net BNC ${ANNEE_COURANTE} — Freelances et professions libérales`}
      seoDescription={`Calculez votre revenu net en BNC (profession libérale) après cotisations URSSAF (${tauxBNC} en ${ANNEE_COURANTE}) et impôts. Résultat immédiat, taux officiels ${ANNEE_COURANTE}.`}
      h1={`Simulateur de revenu net BNC ${ANNEE_COURANTE}`}
      intro={
        <>
          Vous exercez une profession libérale non réglementée (développeur, designer, consultant…) ? En BNC {ANNEE_COURANTE}, vos cotisations URSSAF s'élèvent à <strong>{tauxBNC}</strong> de votre chiffre d'affaires ({tauxBNCPrecedent} en 2025). L'abattement forfaitaire de <strong>34 %</strong> réduit votre base imposable. Calculez combien il vous reste vraiment.
        </>
      }
      faq={faq}
    />
  );
}
