import SEOHead from '../components/layout/SEOHead';

const faq = [
  { question: 'Quand choisir l\'auto-entreprise plutôt que la SASU ?', answer: 'L\'auto-entreprise est idéale pour débuter, tester une activité, ou pour un CA inférieur à 50 000€/an. Elle est simple, sans comptable obligatoire, et sans risques financiers importants.' },
  { question: 'À partir de quel CA la SASU devient-elle intéressante ?', answer: 'Généralement à partir de 50 000-70 000€/an de CA. À ce niveau, les économies de charges sociales via la SASU peuvent compenser les coûts de structure (comptable, dépôt des comptes...).' },
  { question: 'Peut-on facilement passer d\'auto-entrepreneur à SASU ?', answer: 'Oui. Vous créez la SASU, puis vous radiez votre auto-entreprise. Prévoyez 1 à 3 mois pour les formalités et le transfert de clients.' },
];

export default function ComparateurAEvsSASU() {
  return (
    <>
      <SEOHead
        title="AE vs SASU 2025 : quel statut choisir selon votre chiffre d'affaires ?"
        description="Comparatif complet auto-entrepreneur vs SASU : charges, revenu net, complexité, protection sociale. Exemples chiffrés pour vous aider à choisir."
        canonical="/comparateur/ae-vs-sasu"
        faqItems={faq}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-4">
          AE vs SASU 2025 : quel statut choisir ?
        </h1>
        <p className="font-corps text-gris-moyen leading-relaxed max-w-2xl mb-12">
          Comparer l'auto-entreprise et la SASU n'est pas simple. Voici un comparatif objectif avec exemples chiffrés pour vous aider à prendre la bonne décision selon votre situation.
        </p>

        {/* Tableau comparatif */}
        <div className="bg-white rounded-card shadow-card p-6 mb-10 overflow-x-auto">
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-6">Tableau comparatif synthétique</h2>
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
                ['Cotisations sociales', '12–23% du CA', '~45% du salaire net'],
                ['Impôt société', 'Aucun (IR direct)', '15% jusqu\'à 42k€, 25% au-delà'],
                ['Plafond CA', '77 700 – 188 700€/an', 'Illimité'],
                ['Comptable obligatoire', 'Non', 'Oui (~2 000-4 000€/an)'],
                ['Complexité administrative', '⭐ Très simple', '⭐⭐⭐ Complexe'],
                ['Protection sociale', 'Basique (SSI)', 'Assimilé salarié (régime général)'],
                ['Retraite', 'Faible', 'Meilleure couverture'],
                ['Crédibilité client', 'Variable', 'Généralement plus élevée'],
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

        {/* Exemple chiffré */}
        <div className="bg-white rounded-card shadow-card p-6 mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-6">Exemple chiffré : CA 60 000€/an</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl" style={{ background: 'rgba(27, 45, 107, 0.05)', border: '2px solid #1B2D6B' }}>
              <h3 className="font-titre font-bold text-bleu-marine mb-3">Auto-entrepreneur BNC</h3>
              <ul className="font-corps text-sm space-y-2">
                <li>CA annuel : <strong>60 000 €</strong></li>
                <li>Cotisations (23,1%) : <strong className="text-rouge-charges">-13 860 €</strong></li>
                <li>Impôt estimé (barème) : <strong className="text-jaune-impot">-5 400 €</strong></li>
                <li>CFE : <strong>-200 €</strong></li>
                <li className="pt-2 border-t border-gris-clair font-bold text-vert-menthe text-lg">Net : ~40 540 €/an</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl" style={{ background: '#F8F9FA', border: '2px solid #E9ECEF' }}>
              <h3 className="font-titre font-bold text-gris-fonce mb-3">SASU (estimation)</h3>
              <ul className="font-corps text-sm space-y-2">
                <li>CA annuel : <strong>60 000 €</strong></li>
                <li>Charges soc. dirigeant (~45%) : <strong className="text-rouge-charges">-20 000 €</strong></li>
                <li>IS (15%) : <strong className="text-jaune-impot">-4 500 €</strong></li>
                <li>Comptable : <strong>-2 500 €</strong></li>
                <li className="pt-2 border-t border-gris-clair font-bold text-gris-fonce text-lg">Net : ~33 000 €/an</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 font-corps text-xs text-gris-moyen">
            Estimation simplifiée. Les résultats réels dépendent de la rémunération choisie en SASU, de la politique dividendes, et de votre situation personnelle.
          </p>
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
