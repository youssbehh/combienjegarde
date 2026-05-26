import { useParams, Navigate } from 'react-router-dom';
import ArticleLayout from '../../components/blog/ArticleLayout';
import { articles } from './articles';
import { Link } from 'react-router-dom';

const articleContent: Record<string, React.ReactNode> = {
  'cotisations-urssaf-ae': (
    <div className="font-corps text-gris-fonce leading-relaxed space-y-6">
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Comment fonctionnent les cotisations en auto-entreprise ?</h2>
      <p>En auto-entreprise, vous ne payez des cotisations sociales que sur le chiffre d'affaires réellement encaissé. Si vous ne facturez rien, vous ne payez rien. C'est l'un des grands avantages du régime : aucune cotisation minimale.</p>
      <p>Le calcul est simple : <strong>Cotisations = CA × taux</strong>. Le taux varie selon votre secteur d'activité.</p>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Tableau des taux par secteur (2025)</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left">Secteur</th><th className="p-3 text-right">Taux 2025</th><th className="p-3 text-right">Exemple CA 3 000€</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3">BIC Vente (commerce, artisanat)</td><td className="p-3 text-right font-bold">12,3%</td><td className="p-3 text-right text-rouge-charges">369 €</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">BIC Services (conseil, formation)</td><td className="p-3 text-right font-bold">21,2%</td><td className="p-3 text-right text-rouge-charges">636 €</td></tr>
            <tr className="border-b border-gris-clair"><td className="p-3">BNC (libéral, freelance)</td><td className="p-3 text-right font-bold">23,1%</td><td className="p-3 text-right text-rouge-charges">693 €</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Ce que couvrent vos cotisations</h2>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>Assurance maladie-maternité</li>
        <li>Allocations familiales</li>
        <li>Retraite de base et complémentaire</li>
        <li>Invalidité-décès</li>
        <li>Formation professionnelle (0,1% à 0,2% selon activité)</li>
      </ul>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Comment déclarer et payer à l'URSSAF ?</h2>
      <p>Rendez-vous sur <a href="https://www.autoentrepreneur.urssaf.fr" className="text-vert-menthe hover:underline" target="_blank" rel="noopener noreferrer">autoentrepreneur.urssaf.fr</a>. Vous déclarez votre CA (même nul) mensuellement ou trimestriellement selon votre option. Le paiement se fait en ligne par prélèvement automatique ou carte bancaire.</p>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">L'ACRE : réduction de cotisations la première année</h2>
      <p>Si vous débutez votre activité, l'ACRE vous permet de bénéficier d'une réduction de 50% sur vos cotisations pendant la première année. La demande se fait au moment de la création auprès de l'URSSAF.</p>

      <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}>
        <strong>Source :</strong> <a href="https://www.autoentrepreneur.urssaf.fr/portail/accueil/une-question/toutes-les-fiches-pratiques/mes-cotisations/les-taux-de-cotisations.html" className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">autoentrepreneur.urssaf.fr — Taux de cotisations</a>
      </div>
    </div>
  ),

  'impot-auto-entrepreneur': (
    <div className="font-corps text-gris-fonce leading-relaxed space-y-6">
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">L'abattement forfaitaire : votre principal avantage fiscal</h2>
      <p>L'abattement forfaitaire est déduit de votre CA pour calculer votre revenu imposable. Il représente vos "frais professionnels" estimés, sans justificatif à fournir.</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left">Secteur</th><th className="p-3 text-right">Abattement</th><th className="p-3 text-right">Base imposable sur 3 000€</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3">BIC Vente</td><td className="p-3 text-right font-bold text-vert-menthe">71%</td><td className="p-3 text-right">870 €/mois</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">BIC Services</td><td className="p-3 text-right font-bold text-vert-menthe">50%</td><td className="p-3 text-right">1 500 €/mois</td></tr>
            <tr className="border-b border-gris-clair"><td className="p-3">BNC</td><td className="p-3 text-right font-bold text-jaune-impot">34%</td><td className="p-3 text-right">1 980 €/mois</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Barème progressif IR 2025</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left">Tranche de revenu annuel</th><th className="p-3 text-right">Taux</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3">Jusqu'à 11 294 €</td><td className="p-3 text-right font-bold text-vert-menthe">0%</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">11 294 € – 28 797 €</td><td className="p-3 text-right font-bold">11%</td></tr>
            <tr className="border-b border-gris-clair"><td className="p-3">28 797 € – 82 341 €</td><td className="p-3 text-right font-bold text-jaune-impot">30%</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">82 341 € – 177 106 €</td><td className="p-3 text-right font-bold text-rouge-charges">41%</td></tr>
            <tr><td className="p-3">Au-delà de 177 106 €</td><td className="p-3 text-right font-bold text-rouge-charges">45%</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Exemple de calcul complet (BNC, 3 000€/mois, 1 part)</h2>
      <div className="p-5 rounded-xl bg-blanc-casse text-sm space-y-2">
        <p>CA annuel : <strong>36 000 €</strong></p>
        <p>Abattement 34% : <strong>- 12 240 €</strong></p>
        <p>Revenu imposable : <strong>23 760 €</strong></p>
        <p>Impôt sur la tranche 0-11 294€ : 0 €</p>
        <p>Impôt sur la tranche 11 294-23 760€ : 12 466 × 11% = <strong>1 371 €/an</strong> → <strong>114 €/mois</strong></p>
      </div>
    </div>
  ),

  'tva-auto-entrepreneur': (
    <div className="font-corps text-gris-fonce leading-relaxed space-y-6">
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Qu'est-ce que la franchise en base de TVA ?</h2>
      <p>La franchise en base de TVA est le régime par défaut de l'auto-entrepreneur. Vous ne facturez pas la TVA à vos clients et vous ne la récupérez pas sur vos achats non plus. C'est un régime simple et avantageux pour les petits CA.</p>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Seuils de TVA 2025</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left">Secteur</th><th className="p-3 text-right">Seuil franchise</th><th className="p-3 text-right">Seuil tolérance</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3">BIC Vente (commerce)</td><td className="p-3 text-right font-bold">85 000 €</td><td className="p-3 text-right">93 500 €</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">BIC Services</td><td className="p-3 text-right font-bold">37 500 €</td><td className="p-3 text-right">41 250 €</td></tr>
            <tr><td className="p-3">BNC (professions libérales)</td><td className="p-3 text-right font-bold">37 500 €</td><td className="p-3 text-right">41 250 €</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Mention obligatoire sur les factures</h2>
      <div className="p-4 rounded-xl font-mono text-sm" style={{ background: '#f1f3f4', border: '1px solid #dee2e6' }}>
        "TVA non applicable - article 293 B du CGI"
      </div>
      <p>Cette mention est <strong>obligatoire</strong> sur toutes vos factures tant que vous êtes en franchise de TVA.</p>

      <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}>
        <strong>Source officielle :</strong> <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F21746" className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">service-public.fr — Franchise en base de TVA</a>
      </div>
    </div>
  ),

  'prelevement-liberatoire': (
    <div className="font-corps text-gris-fonce leading-relaxed space-y-6">
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Qu'est-ce que le prélèvement libératoire ?</h2>
      <p>Le prélèvement libératoire de l'impôt sur le revenu (PLIR) vous permet de payer votre impôt en même temps que vos cotisations URSSAF, sous forme d'un pourcentage fixe de votre CA. Il "libère" définitivement de l'impôt sur ces revenus.</p>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Tableau comparatif : 3 exemples chiffrés</h2>

      <div className="p-5 rounded-xl bg-blanc-casse text-sm space-y-4">
        <h3 className="font-titre font-semibold text-bleu-marine">Exemple 1 : CA 2 000€/mois BNC, 1 part, faibles revenus annexes</h3>
        <p>Prélèvement libératoire : 2 000 × 2,2% = <strong className="text-vert-menthe">44 €/mois</strong></p>
        <p>Barème (revenu imposable 15 840€/an) : ≈ <strong className="text-jaune-impot">50 €/mois</strong></p>
        <p>→ PL légèrement avantageux dans ce cas.</p>
      </div>

      <div className="p-5 rounded-xl bg-blanc-casse text-sm space-y-4">
        <h3 className="font-titre font-semibold text-bleu-marine">Exemple 2 : CA 2 000€/mois BNC, 2 parts</h3>
        <p>Prélèvement libératoire : <strong className="text-jaune-impot">44 €/mois</strong></p>
        <p>Barème avec 2 parts (impôt divisé) : ≈ <strong className="text-vert-menthe">20 €/mois</strong></p>
        <p>→ Le barème progressif est plus intéressant avec 2 parts.</p>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Conditions d'éligibilité</h2>
      <p>Votre revenu fiscal de référence (RFR) de l'année N-2 ne doit pas dépasser <strong>27 794 € par part</strong> de quotient familial.</p>

      <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}>
        <strong>Source :</strong> <a href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire-de-limpot-sur-le-revenu" className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">impots.gouv.fr — Versement libératoire</a>
      </div>
    </div>
  ),
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/guide" replace />;

  const content = articleContent[slug!] ?? (
    <p className="font-corps text-gris-moyen">Contenu bientôt disponible.</p>
  );

  return (
    <ArticleLayout {...article}>
      {content}
      <div className="mt-8 pt-6 border-t border-gris-clair">
        <Link to="/guide" className="font-corps text-sm text-vert-menthe hover:underline">
          ← Retour aux articles
        </Link>
      </div>
    </ArticleLayout>
  );
}
