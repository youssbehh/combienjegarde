import SimulateurSecteurPage from '../components/simulateur/SimulateurSecteurPage';
import { ANNEE_COURANTE, TAUX_PAR_ANNEE, formatTaux } from '../lib/constants';

const taux = TAUX_PAR_ANNEE[ANNEE_COURANTE];
const tauxServices = formatTaux(taux.cotisations.bic_services);
const plafond = taux.plafonds_ca.bic_services.toLocaleString('fr-FR');
const seuilTVA = taux.seuils_tva.bic_services.toLocaleString('fr-FR');

const faq = [
  { question: `Quel est le taux de cotisations en BIC Services en ${ANNEE_COURANTE} ?`, answer: `En ${ANNEE_COURANTE}, le taux est de ${tauxServices} du chiffre d'affaires pour les prestations de services commerciales et artisanales, inchangé par rapport à 2025. S'y ajoute la contribution à la formation professionnelle (0,1 % pour les commerçants, 0,3 % pour les artisans).` },
  { question: 'Quelle est la différence entre BIC Services et BNC ?', answer: 'Le BIC Services concerne les prestations commerciales ou artisanales (agence, services à la personne, travaux…). Le BNC concerne les professions libérales et intellectuelles (freelances, consultants, professions de santé…).' },
  { question: 'Quel abattement forfaitaire en BIC Services ?', answer: "L'abattement forfaitaire est de 50 % : vous êtes imposé sur la moitié de votre chiffre d'affaires annuel." },
  { question: `Quel est le plafond de chiffre d'affaires en BIC Services en ${ANNEE_COURANTE} ?`, answer: `Le plafond annuel est de ${plafond} € en ${ANNEE_COURANTE} (77 700 € jusqu'en 2025). La franchise de TVA s'applique jusqu'à ${seuilTVA} €.` },
];

export default function SimulateurBICServices() {
  return (
    <SimulateurSecteurPage
      secteur="bic_services"
      canonical="/simulateur-bic-services"
      seoTitle={`Simulateur revenu net BIC Services ${ANNEE_COURANTE} — Prestations commerciales et artisanales`}
      seoDescription={`Calculez votre revenu net en BIC Services (prestations) après cotisations URSSAF (${tauxServices}) et impôts. Taux officiels ${ANNEE_COURANTE}, résultat immédiat.`}
      h1={`Simulateur de revenu net BIC Services ${ANNEE_COURANTE}`}
      intro={
        <>
          Prestation de service commerciale ou artisanale ? En BIC Services, les cotisations sont de <strong>{tauxServices}</strong> (inchangé en {ANNEE_COURANTE}) et l'abattement forfaitaire de <strong>50 %</strong>.
        </>
      }
      faq={faq}
    />
  );
}
