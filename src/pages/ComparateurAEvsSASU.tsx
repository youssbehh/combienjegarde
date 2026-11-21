import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import FAQ from '../components/layout/FAQ';
import { calculerComparatif } from '../lib/calculs';
import { ANNEE_COURANTE, HYPOTHESES_COMPARATIF, TAUX_PAR_ANNEE, formatTaux } from '../lib/constants';

const taux = TAUX_PAR_ANNEE[ANNEE_COURANTE];
const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`;

// Exemple calculé avec le moteur du simulateur : BNC, 1 part, sans autre revenu, au barème
const CA_EXEMPLE_MENSUEL = 5000;
const exemple = calculerComparatif({
  ca: CA_EXEMPLE_MENSUEL,
  secteur: 'bnc',
  annee: ANNEE_COURANTE,
  prelevementLiberatoire: false,
  revenuFiscalRef: 0,
  nbParts: 1,
});
const caExemple = CA_EXEMPLE_MENSUEL * 12;
const ecartAnnuel = (exemple.ae.revenuNet - exemple.sasu.revenuNet) * 12;

const faq = [
  { question: "Quand choisir l'auto-entreprise plutôt que la SASU ?", answer: "L'auto-entreprise est idéale pour débuter, tester une activité ou exercer avec peu de frais professionnels. Elle est simple, sans comptable obligatoire, et les cotisations sont proportionnelles au chiffre d'affaires encaissé." },
  { question: 'Quand la SASU devient-elle intéressante ?', answer: `Quand vous approchez du plafond du régime micro (${eur(taux.plafonds_ca.bnc)} en prestations de services en ${ANNEE_COURANTE}), quand vous avez des frais professionnels importants à déduire, ou quand vous voulez une meilleure protection sociale. À chiffre d'affaires égal et sans frais, l'auto-entreprise laisse en général un revenu net supérieur.` },
  { question: "Peut-on facilement passer d'auto-entrepreneur à SASU ?", answer: "Oui. Vous créez la SASU, puis vous cessez votre micro-entreprise. Prévoyez un à trois mois pour les formalités et le transfert des contrats clients." },
  { question: `Les taux ont-ils changé en ${ANNEE_COURANTE} pour l'auto-entrepreneur ?`, answer: `Oui : le taux des professions libérales non réglementées (BNC) est passé à ${formatTaux(taux.cotisations.bnc)} au 1er janvier ${ANNEE_COURANTE}, contre 24,6 % en 2025. Les taux BIC sont stables et les plafonds de chiffre d'affaires ont été relevés.` },
];

export default function ComparateurAEvsSASU() {
  const lignes: [string, string, string][] = [
    [`Cotisations sociales ${ANNEE_COURANTE}`, `${formatTaux(taux.cotisations.bic_vente)} à ${formatTaux(taux.cotisations.bnc)} du CA`, '≈ 80 % du salaire net versé'],
    ['Impôt sur les sociétés', 'Aucun (impôt sur le revenu)', '15 % jusqu\'à 42 500 € de bénéfice, 25 % au-delà'],
    ['Plafond de CA', `${eur(taux.plafonds_ca.bnc)} à ${eur(taux.plafonds_ca.bic_vente)} par an`, 'Illimité'],
    ['Frais professionnels', 'Non déductibles (abattement forfaitaire)', 'Déductibles au réel'],
    ['Comptable', 'Non obligatoire', 'Indispensable (≈ 2 000 à 4 000 €/an)'],
    ['Complexité administrative', 'Très simple', 'Élevée'],
    ['Protection sociale', 'Sécurité sociale des indépendants', 'Régime général (assimilé salarié)'],
    ['Assurance chômage', 'Non', 'Non (président non couvert)'],
    ['ACRE', 'Oui, sous conditions', 'Oui, sous conditions'],
  ];

  return (
    <>
      <SEOHead
        title={`AE vs SASU ${ANNEE_COURANTE} : quel statut choisir selon votre chiffre d'affaires ?`}
        description={`Comparatif auto-entrepreneur vs SASU en ${ANNEE_COURANTE} : charges, revenu net, impôts, complexité, protection sociale. Exemple chiffré avec les taux officiels ${ANNEE_COURANTE}.`}
        canonical="/comparateur/ae-vs-sasu"
        faqItems={faq}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-4">
          AE vs SASU {ANNEE_COURANTE} : quel statut choisir ?
        </h1>
        <p className="font-corps text-gris-moyen leading-relaxed max-w-2xl mb-12">
          Comparer l'auto-entreprise et la SASU n'est pas simple. Voici un comparatif avec un exemple chiffré pour vous aider à décider selon votre situation — données {ANNEE_COURANTE}.
        </p>

        <div className="bg-white rounded-card shadow-card p-6 mb-10 overflow-x-auto">
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-6">Tableau comparatif {ANNEE_COURANTE}</h2>
          <table className="w-full text-sm font-corps border-collapse">
            <thead>
              <tr className="border-b-2 border-bleu-marine">
                <td className="py-3"></td>
                <th scope="col" className="py-3 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-titre font-bold bg-bleu-marine">
                    Auto-entrepreneur
                  </span>
                </th>
                <th scope="col" className="py-3 text-center text-gris-fonce font-semibold">SASU</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map(([label, ae, sasu]) => (
                <tr key={label} className="border-b border-gris-clair">
                  <th scope="row" className="py-3 pr-3 text-left font-normal text-gris-moyen">{label}</th>
                  <td className="py-3 px-2 text-center font-medium text-bleu-marine">{ae}</td>
                  <td className="py-3 px-2 text-center text-gris-fonce">{sasu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-card shadow-card p-6 mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-2">Exemple chiffré : {eur(caExemple)} de CA par an</h2>
          <p className="font-corps text-xs text-gris-moyen mb-6">
            Taux officiels {ANNEE_COURANTE} — profession libérale (BNC), célibataire, 1 part, sans autre revenu, impôt au barème, sans frais professionnels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl" style={{ background: 'rgba(27, 45, 107, 0.05)', border: '2px solid #1B2D6B' }}>
              <h3 className="font-titre font-bold text-bleu-marine mb-3">Auto-entrepreneur BNC</h3>
              <ul className="font-corps text-sm space-y-2">
                <li>CA annuel : <strong>{eur(caExemple)}</strong></li>
                <li>Cotisations URSSAF ({formatTaux(taux.cotisations.bnc)} + formation) : <strong className="text-rouge-charges">− {eur(exemple.ae.cotisationsURSSAF * 12)}</strong></li>
                <li>Impôt sur le revenu : <strong>− {eur(exemple.ae.impotEstime * 12)}</strong></li>
                <li>CFE (estimation) : <strong className="text-gris-moyen">− {eur(exemple.ae.cfeEstimee * 12)}</strong></li>
                <li className="pt-2 border-t border-gris-clair font-bold text-vert-fonce text-lg">Net : ≈ {eur(exemple.ae.revenuNet * 12)}/an</li>
                <li className="text-xs text-gris-moyen">soit ≈ {eur(exemple.ae.revenuNet)}/mois</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-blanc-casse" style={{ border: '2px solid #E9ECEF' }}>
              <h3 className="font-titre font-bold text-gris-fonce mb-3">SASU, tout en salaire</h3>
              <ul className="font-corps text-sm space-y-2">
                <li>CA annuel : <strong>{eur(caExemple)}</strong></li>
                <li>Comptable et frais fixes : <strong className="text-gris-moyen">− {eur(exemple.sasu.fraisFixes * 12)}</strong></li>
                <li>Cotisations sociales du président : <strong className="text-rouge-charges">− {eur(exemple.sasu.charges * 12)}</strong></li>
                <li>Impôt sur le revenu : <strong>− {eur(exemple.sasu.impot * 12)}</strong></li>
                <li className="pt-2 border-t border-gris-clair font-bold text-gris-fonce text-lg">Net : ≈ {eur(exemple.sasu.revenuNet * 12)}/an</li>
                <li className="text-xs text-gris-moyen">soit ≈ {eur(exemple.sasu.revenuNet)}/mois</li>
              </ul>
            </div>
          </div>

          <div
            className="mt-6 p-4 rounded-xl font-corps text-sm"
            style={{ background: 'rgba(46,196,182,0.07)', border: '1px solid rgba(46,196,182,0.3)' }}
          >
            <strong className="text-vert-fonce">Verdict à {eur(caExemple)}/an :</strong> sans frais professionnels, l'auto-entrepreneur garde environ <strong>{eur(ecartAnnuel)} de plus par an</strong>. La SASU reprend l'avantage si vous avez des frais importants à déduire, si vous dépassez le plafond du régime micro, ou si vous valorisez sa meilleure couverture sociale.
          </div>

          <p className="mt-4 font-corps text-xs text-gris-moyen leading-relaxed">
            ⚠️ Estimation simplifiée : en SASU, le salaire net est estimé à {Math.round(HYPOTHESES_COMPARATIF.sasu_ratio_net_sur_cout * 100)} % du coût total employeur, sans dividendes. Le résultat réel dépend de la rémunération choisie, de vos frais, de votre quotient familial et de vos autres revenus. Consultez un expert-comptable pour votre cas.
          </p>

          <Link
            to="/#simulateur"
            className="mt-6 inline-block font-titre font-bold text-white rounded-xl px-6 py-3 bg-bleu-marine hover:bg-bleu-moyen transition-colors"
          >
            Faire le calcul avec mon chiffre d'affaires →
          </Link>
        </div>

        <div className="bg-white rounded-card shadow-card p-6 mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-4">À quel moment envisager la SASU ?</h2>
          <div className="space-y-3">
            {[
              { titre: 'Moins de 40 000 € de CA par an', conseil: "Auto-entreprise recommandée : simplicité maximale, cotisations proportionnelles au chiffre d'affaires.", icon: '✅' },
              { titre: 'De 40 000 € au plafond du régime micro', conseil: "Comparez selon votre profil : frais professionnels, besoin de protection sociale, image auprès des clients.", icon: '⚖️' },
              { titre: `Au-delà de ${eur(taux.plafonds_ca.bnc)} (services) ou ${eur(taux.plafonds_ca.bic_vente)} (vente)`, conseil: 'Le régime micro n\'est plus possible après deux années de dépassement : la société (SASU, EURL) ou l\'entreprise individuelle au réel s\'impose.', icon: '🔄' },
            ].map((item) => (
              <div
                key={item.titre}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(27,45,107,0.03)', border: '1px solid rgba(27,45,107,0.10)' }}
              >
                <span className="text-xl" aria-hidden="true">{item.icon}</span>
                <div>
                  <p className="font-titre font-bold text-sm text-bleu-marine">{item.titre}</p>
                  <p className="font-corps text-sm text-gris-fonce">{item.conseil}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FAQ items={faq} />
      </div>
    </>
  );
}
