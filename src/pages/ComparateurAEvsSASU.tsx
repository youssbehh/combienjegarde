import SEOHead from '../components/layout/SEOHead';

const faq = [
  { question: 'Quand choisir l\'auto-entreprise plutôt que la SASU ?', answer: 'L\'auto-entreprise est idéale pour débuter, tester une activité, ou pour un CA inférieur à 50 000€/an. Elle est simple, sans comptable obligatoire, et sans risques financiers importants.' },
  { question: 'À partir de quel CA la SASU devient-elle intéressante ?', answer: 'Généralement à partir de 50 000-70 000€/an de CA. À ce niveau, les économies de charges sociales via la SASU peuvent compenser les coûts de structure (comptable, dépôt des comptes...).' },
  { question: 'Peut-on facilement passer d\'auto-entrepreneur à SASU ?', answer: 'Oui. Vous créez la SASU, puis vous radiez votre auto-entreprise. Prévoyez 1 à 3 mois pour les formalités et le transfert de clients.' },
  { question: 'Les taux ont-ils changé en 2026 pour l\'auto-entrepreneur ?', answer: 'Oui : le taux BNC (professions libérales) passe à 24,6% en 2026 contre 23,1% en 2025, dans le cadre de la réforme des retraites des professions libérales. Les taux BIC restent stables.' },
];

export default function ComparateurAEvsSASU() {
  return (
    <>
      <SEOHead
        title="AE vs SASU 2026 : quel statut choisir selon votre chiffre d'affaires ?"
        description="Comparatif auto-entrepreneur vs SASU en 2026 : charges, revenu net, IS, complexité, protection sociale. Exemples chiffrés avec les taux officiels 2026."
        canonical="/comparateur/ae-vs-sasu"
        faqItems={faq}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-4">
          AE vs SASU 2026 : quel statut choisir ?
        </h1>
        <p className="font-corps text-gris-moyen leading-relaxed max-w-2xl mb-12">
          Comparer l'auto-entreprise et la SASU n'est pas simple. Voici un comparatif objectif avec exemples chiffrés pour vous aider à prendre la bonne décision selon votre situation — données 2026.
        </p>

        {/* Tableau comparatif */}
        <div className="bg-white rounded-card shadow-card p-6 mb-10 overflow-x-auto">
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-6">Tableau comparatif synthétique 2026</h2>
          <table className="w-full text-sm font-corps border-collapse">
            <thead>
              <tr className="border-b-2 border-bleu-marine">
                <th className="text-left py-3 text-gris-moyen font-medium"></th>
                <th className="py-3 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-titre font-bold bg-bleu-marine">
                    Auto-entrepreneur
                  </span>
                </th>
                <th className="py-3 text-center text-gris-fonce font-semibold">SASU</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Cotisations sociales 2026', '12,3% – 24,6% du CA', '~45% du salaire brut'],
                ['Impôt société (IS)', 'Aucun (IR direct)', '15% jusqu\'à 42 500€, 25% au-delà'],
                ['Plafond CA', '77 700 – 188 700 €/an', 'Illimité'],
                ['Comptable obligatoire', 'Non', 'Oui (~2 000-4 000 €/an)'],
                ['Complexité administrative', '⭐ Très simple', '⭐⭐⭐ Complexe'],
                ['Protection sociale', 'SSI (basique)', 'Assimilé salarié (régime général)'],
                ['Retraite', 'Faible couverture', 'Meilleure couverture'],
                ['Crédibilité client', 'Variable', 'Généralement plus élevée'],
                ['ACRE applicable ?', 'Oui — -50% cotisations 1ère année', 'Non'],
              ].map(([label, ae, sasu]) => (
                <tr key={label} className="border-b border-gris-clair">
                  <td className="py-3 text-gris-moyen">{label}</td>
                  <td className="py-3 text-center font-medium text-bleu-marine">{ae}</td>
                  <td className="py-3 text-center text-gris-fonce">{sasu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Exemple chiffré 2026 */}
        <div className="bg-white rounded-card shadow-card p-6 mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-2">Exemple chiffré : CA 60 000 €/an</h2>
          <p className="font-corps text-xs text-gris-moyen mb-6">Basé sur les taux officiels 2026 — profil BNC, 1 part fiscale, pas de prélèvement libératoire</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl" style={{ background: 'rgba(27, 45, 107, 0.05)', border: '2px solid #1B2D6B' }}>
              <h3 className="font-titre font-bold text-bleu-marine mb-3">Auto-entrepreneur BNC — 2026</h3>
              <ul className="font-corps text-sm space-y-2">
                <li>CA annuel : <strong>60 000 €</strong></li>
                <li>Cotisations URSSAF (24,6%) : <strong className="text-rouge-charges">− 14 760 €</strong></li>
                <li>Impôt sur le revenu (barème 2026) : <strong className="text-jaune-impot">− 5 050 €</strong></li>
                <li>CFE annuelle (18 €/mois) : <strong className="text-gris-moyen">− 216 €</strong></li>
                <li className="pt-2 border-t border-gris-clair font-bold text-vert-menthe text-lg">Net : ~39 974 €/an</li>
                <li className="text-xs text-gris-moyen">soit ~3 331 €/mois net</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl" style={{ background: '#F8F9FA', border: '2px solid #E9ECEF' }}>
              <h3 className="font-titre font-bold text-gris-fonce mb-3">SASU (estimation 2026)</h3>
              <ul className="font-corps text-sm space-y-2">
                <li>CA annuel : <strong>60 000 €</strong></li>
                <li>Charges soc. dirigeant (~33 % du CA) : <strong className="text-rouge-charges">− 20 000 €</strong></li>
                <li>IS sur bénéfice (15%) : <strong className="text-jaune-impot">− 4 500 €</strong></li>
                <li>Comptable : <strong className="text-gris-moyen">− 2 500 €</strong></li>
                <li className="pt-2 border-t border-gris-clair font-bold text-gris-fonce text-lg">Net : ~33 000 €/an</li>
                <li className="text-xs text-gris-moyen">soit ~2 750 €/mois net</li>
              </ul>
            </div>
          </div>

          {/* Verdict */}
          <div
            className="mt-6 p-4 rounded-xl font-corps text-sm"
            style={{ background: 'rgba(46,196,182,0.07)', border: '1px solid rgba(46,196,182,0.3)' }}
          >
            <strong style={{ color: '#1A9E92' }}>Verdict à 60 000 €/an :</strong> l'auto-entrepreneur BNC garde environ <strong>6 974 €/an de plus</strong> que la SASU dans ce scénario, sans comptable ni charges fixes. La SASU devient avantageuse à partir de ~70 000–80 000 €/an grâce à l'optimisation dividendes + IS.
          </div>

          <p className="mt-4 font-corps text-xs text-gris-moyen">
            ⚠️ Estimation simplifiée basée sur les taux 2026. Les résultats réels dépendent de la rémunération choisie en SASU, de la politique dividendes, de votre quotient familial et de votre situation personnelle. Consultez un expert-comptable pour votre cas.
          </p>
        </div>

        {/* Quand basculer ? */}
        <div className="bg-white rounded-card shadow-card p-6 mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-4">À quel CA basculer vers la SASU ?</h2>
          <div className="space-y-3">
            {[
              { ca: '< 40 000 €/an', conseil: 'Auto-entrepreneur recommandé — simplicité maximale, charges faibles', color: '#2EC4B6', icon: '✅' },
              { ca: '40 000 – 70 000 €/an', conseil: 'Zone intermédiaire — comparez selon votre profil (charges, protection sociale, dividendes)', color: '#FF9F1C', icon: '⚖️' },
              { ca: '> 70 000 €/an', conseil: 'Envisagez sérieusement la SASU — l\'optimisation IS + dividendes devient rentable', color: '#E63946', icon: '🔄' },
            ].map((item) => (
              <div
                key={item.ca}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(27,45,107,0.03)', border: '1px solid rgba(27,45,107,0.10)' }}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-titre font-bold text-sm" style={{ color: item.color }}>{item.ca}</p>
                  <p className="font-corps text-sm text-gris-fonce">{item.conseil}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-6">Questions fréquentes</h2>
          <div className="flex flex-col gap-3">
            {faq.map((item) => (
              <details key={item.question} className="bg-white rounded-card shadow-card group">
                <summary className="p-5 font-titre font-semibold text-bleu-marine cursor-pointer list-none flex justify-between items-center">
                  {item.question}
                  <span className="text-vert-menthe font-bold group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-5 pb-5 font-corps text-sm text-gris-fonce leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
