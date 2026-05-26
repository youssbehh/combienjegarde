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
        <p>Barème avec 2 parts : ≈ <strong className="text-vert-menthe">20 €/mois</strong></p>
        <p>→ Le barème progressif est plus intéressant avec 2 parts.</p>
      </div>
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Conditions d'éligibilité</h2>
      <p>Votre RFR N-2 ne doit pas dépasser <strong>27 794 €/part en 2025</strong> (28 797 €/part en 2026).</p>
      <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}>
        <strong>Source :</strong> <a href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire-de-limpot-sur-le-revenu" className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">impots.gouv.fr — Versement libératoire</a>
      </div>
    </div>
  ),

  'changements-2026': (
    <div className="font-corps text-gris-fonce leading-relaxed space-y-6">
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Hausse des cotisations BNC : +1,5 point</h2>
      <p>La principale nouveauté 2026 concerne les <strong>BNC (professions libérales non réglementées)</strong>. Dans le cadre de la réforme des retraites des professions libérales, les cotisations URSSAF passent de <strong>23,1% à 24,6%</strong> du CA.</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left">Secteur</th><th className="p-3 text-right">2025</th><th className="p-3 text-right">2026</th><th className="p-3 text-right">Évolution</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3">BIC Vente</td><td className="p-3 text-right">12,3%</td><td className="p-3 text-right">12,3%</td><td className="p-3 text-right text-gris-moyen">→ inchangé</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">BIC Services</td><td className="p-3 text-right">21,2%</td><td className="p-3 text-right">21,2%</td><td className="p-3 text-right text-gris-moyen">→ inchangé</td></tr>
            <tr className="border-b border-gris-clair"><td className="p-3 font-semibold">BNC / Libéral</td><td className="p-3 text-right">23,1%</td><td className="p-3 text-right font-bold text-rouge-charges">24,6%</td><td className="p-3 text-right text-rouge-charges font-bold">+1,5 pt</td></tr>
          </tbody>
        </table>
      </div>
      <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3E0', border: '1px solid #FF9F1C' }}>
        <strong>Impact concret :</strong> Pour un BNC à 3 000€/mois, la hausse représente <strong>45€/mois</strong> de cotisations supplémentaires, soit 540€/an.
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Barème IR 2026 : revalorisation +1,8%</h2>
      <p>Les tranches du barème progressif de l'impôt sur le revenu sont revalorisées de +1,8% pour tenir compte de l'inflation.</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left">Tranche</th><th className="p-3 text-right">Taux</th><th className="p-3 text-right">Seuil 2025</th><th className="p-3 text-right">Seuil 2026</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3">Tranche 0</td><td className="p-3 text-right text-vert-menthe font-bold">0%</td><td className="p-3 text-right">11 294 €</td><td className="p-3 text-right font-bold">11 497 €</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">Tranche 1</td><td className="p-3 text-right">11%</td><td className="p-3 text-right">28 797 €</td><td className="p-3 text-right font-bold">29 315 €</td></tr>
            <tr className="border-b border-gris-clair"><td className="p-3">Tranche 2</td><td className="p-3 text-right text-jaune-impot">30%</td><td className="p-3 text-right">82 341 €</td><td className="p-3 text-right font-bold">83 823 €</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">Tranche 3</td><td className="p-3 text-right text-rouge-charges">41%</td><td className="p-3 text-right">177 106 €</td><td className="p-3 text-right font-bold">180 294 €</td></tr>
            <tr><td className="p-3">Tranche 4</td><td className="p-3 text-right text-rouge-charges">45%</td><td className="p-3 text-right">∞</td><td className="p-3 text-right">∞</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">E-facturation : les grandes entreprises démarrent en 2026</h2>
      <p>Les grandes entreprises et ETI ont l'obligation d'émettre des factures électroniques à partir de <strong>2026</strong>. Pour les auto-entrepreneurs, l'obligation arrive en <strong>2027</strong> — mais il faut se préparer maintenant.</p>
      <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(46,196,182,0.08)', border: '1px solid rgba(46,196,182,0.3)' }}>
        <p>→ <strong>Lire notre guide complet :</strong> <a href="/guide/e-facturation-auto-entrepreneur" className="text-bleu-marine underline">E-facturation pour auto-entrepreneur 2027</a></p>
      </div>
    </div>
  ),

  'cotisations-urssaf-2026': (
    <div className="font-corps text-gris-fonce leading-relaxed space-y-6">
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Pourquoi les cotisations BNC augmentent en 2026 ?</h2>
      <p>La réforme des retraites des professions libérales prévoit une <strong>montée en charge progressive</strong> des cotisations retraite pour les non-réglementés (anciennement SSI, maintenant CIPAV pour certains). En 2026, cette hausse se traduit par +1,5 point sur les cotisations globales BNC.</p>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Nouveaux taux 2026</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left">Secteur</th><th className="p-3 text-right">Taux 2026</th><th className="p-3 text-right">Exemple 3 000€/mois</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3">BIC Vente</td><td className="p-3 text-right font-bold">12,3%</td><td className="p-3 text-right text-rouge-charges">369 €</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">BIC Services</td><td className="p-3 text-right font-bold">21,2%</td><td className="p-3 text-right text-rouge-charges">636 €</td></tr>
            <tr><td className="p-3 font-semibold">BNC / Libéral</td><td className="p-3 text-right font-bold text-rouge-charges">24,6%</td><td className="p-3 text-right text-rouge-charges font-bold">738 €</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">L'ACRE reste applicable en 2026</h2>
      <p>Si vous créez votre activité en 2026, vous pouvez bénéficier de l'<strong>ACRE (Aide à la Création ou Reprise d'Entreprise)</strong> : réduction de 50% sur vos cotisations pendant la 1ère année. La demande se fait lors de la création via le site de l'URSSAF.</p>

      <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}>
        <strong>Source :</strong> <a href="https://www.autoentrepreneur.urssaf.fr" className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">autoentrepreneur.urssaf.fr</a> — Taux applicables 2026
      </div>
    </div>
  ),

  'e-facturation-auto-entrepreneur': (
    <div className="font-corps text-gris-fonce leading-relaxed space-y-6">
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Qu'est-ce que l'e-facturation obligatoire ?</h2>
      <p>L'e-facturation (ou facturation électronique structurée) est l'obligation d'émettre et de recevoir des factures dans un <strong>format numérique normalisé</strong> transmis via une plateforme agréée par l'État. Ce n'est pas un simple PDF envoyé par email — c'est une facture que les systèmes informatiques peuvent lire automatiquement.</p>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Calendrier : quand serez-vous concerné ?</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left">Date</th><th className="p-3 text-left">Qui est concerné ?</th><th className="p-3 text-left">Obligation</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3 font-bold">2026</td><td className="p-3">Grandes entreprises et ETI</td><td className="p-3">Émettre des e-factures</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3 font-bold text-rouge-charges">2027</td><td className="p-3">PME, micro-entreprises, auto-entrepreneurs</td><td className="p-3 font-bold">Émettre ET recevoir</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Les formats de factures acceptés</h2>
      <ul className="space-y-3">
        <li className="p-4 rounded-xl bg-blanc-casse"><strong>Factur-X</strong> — Le plus simple pour les auto-entrepreneurs. C'est un PDF standard avec des données XML intégrées invisibles. Vos clients voient un beau PDF, les systèmes lisent les données automatiquement.</li>
        <li className="p-4 rounded-xl bg-blanc-casse"><strong>UBL (Universal Business Language)</strong> — Format XML international, surtout utilisé dans les grands groupes et les échanges européens.</li>
        <li className="p-4 rounded-xl bg-blanc-casse"><strong>CII (Cross Industry Invoice)</strong> — Standard UN/CEFACT, compatible avec de nombreux logiciels comptables.</li>
      </ul>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Les plateformes pour auto-entrepreneurs</h2>
      <div className="space-y-4">
        <div className="p-4 rounded-xl" style={{ border: '2px solid #2EC4B6', background: 'rgba(46,196,182,0.05)' }}>
          <p className="font-titre font-bold text-vert-fonce">✅ Portail Public de Facturation (PPF / Chorus Pro) — Gratuit</p>
          <p className="text-sm mt-1">La plateforme de l'État, accessible à tous. Suffisant pour les auto-entrepreneurs avec peu de factures par mois.</p>
        </div>
        <div className="p-4 rounded-xl bg-blanc-casse">
          <p className="font-titre font-bold text-bleu-marine">🔧 PDP privées agréées — 0 à 20€/mois</p>
          <p className="text-sm mt-1">Des outils comme Pennylane, Axonaut, Freebe, Indy proposent déjà la e-facturation avec des fonctionnalités supplémentaires (comptabilité, devis, etc.). Des offres gratuites existent pour les petits volumes.</p>
        </div>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Ce qui NE change PAS pour vous</h2>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li><strong>Factures aux particuliers (B2C)</strong> : pas concernées par l'obligation</li>
        <li><strong>Mentions légales</strong> : identiques (n° SIRET, "TVA non applicable art. 293B", etc.)</li>
        <li><strong>Franchise TVA</strong> : inchangée (37 500€ / 85 000€)</li>
        <li><strong>Contenu de la facture</strong> : les mêmes informations, juste dans un format différent</li>
      </ul>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Que faire maintenant pour se préparer ?</h2>
      <ol className="list-decimal list-inside space-y-2 text-sm">
        <li>Identifiez si vos clients sont des professionnels (B2B) ou des particuliers (B2C)</li>
        <li>Choisissez votre logiciel de facturation dès maintenant (beaucoup sont déjà conformes)</li>
        <li>Vérifiez que votre logiciel peut émettre du Factur-X — c'est la question à poser à votre éditeur</li>
        <li>Inscrivez-vous sur le PPF (Portail Public de Facturation) quand il sera ouvert au grand public</li>
      </ol>

      <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}>
        <strong>Source :</strong> <a href="https://www.impots.gouv.fr/professionnel/la-facture-electronique" className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">impots.gouv.fr — Facturation électronique</a>
      </div>
    </div>
  ),

  'e-facturation-generale': (
    <div className="font-corps text-gris-fonce leading-relaxed space-y-6">
      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Pourquoi cette réforme ?</h2>
      <p>La fraude à la TVA coûte à l'État français environ <strong>15 milliards d'euros par an</strong>. L'e-facturation permettra à la DGFiP de recroiser automatiquement les factures émises et reçues, rendant la fraude beaucoup plus difficile. En parallèle, la réforme doit accélérer les délais de paiement entre entreprises.</p>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">E-facturation vs PDF par email : quelle différence ?</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-bleu-marine text-white"><th className="p-3 text-left"></th><th className="p-3 text-center">PDF par email</th><th className="p-3 text-center">E-facture (Factur-X)</th></tr></thead>
          <tbody>
            <tr className="border-b border-gris-clair"><td className="p-3">Format</td><td className="p-3 text-center">PDF libre</td><td className="p-3 text-center font-bold text-vert-menthe">PDF + XML intégré</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">Lisible par machine ?</td><td className="p-3 text-center text-rouge-charges">Non</td><td className="p-3 text-center font-bold text-vert-menthe">Oui</td></tr>
            <tr className="border-b border-gris-clair"><td className="p-3">Transmission</td><td className="p-3 text-center">Email direct</td><td className="p-3 text-center font-bold text-vert-menthe">Via plateforme agréée</td></tr>
            <tr className="border-b border-gris-clair bg-blanc-casse"><td className="p-3">Valeur légale 2027</td><td className="p-3 text-center text-rouge-charges">Insuffisant (B2B)</td><td className="p-3 text-center font-bold text-vert-menthe">Conforme</td></tr>
            <tr><td className="p-3">Coût</td><td className="p-3 text-center">0€</td><td className="p-3 text-center">0€ à 20€/mois</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Les acteurs de l'écosystème</h2>
      <ul className="space-y-3 text-sm">
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>DGFiP</strong> — Direction Générale des Finances Publiques. Elle pilote la réforme et tient le registre des PDP agréées.</li>
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>PPF (Portail Public de Facturation)</strong> — Anciennement Chorus Pro. Plateforme gratuite de l'État pour toutes les entreprises.</li>
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>PDP (Plateformes de Dématérialisation Partenaires)</strong> — Opérateurs privés agréés (Pennylane, Sage, Oracle, etc.) offrant des services complémentaires.</li>
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>OD (Opérateurs de Dématérialisation)</strong> — Logiciels de facturation qui préparent vos factures mais doivent passer par un PPF ou PDP pour transmettre.</li>
      </ul>

      <h2 className="font-titre font-bold text-bleu-marine text-2xl">Calendrier de déploiement officiel</h2>
      <div className="space-y-3">
        {[
          { date: '2026', qui: 'Grandes entreprises (CA > 1,5 Md€) et ETI (250+ salariés)', obligation: 'Émission obligatoire', color: '#E63946' },
          { date: '2027', qui: 'PME, TPE, micro-entreprises et auto-entrepreneurs', obligation: 'Émission ET réception obligatoires', color: '#FF9F1C' },
        ].map((e) => (
          <div key={e.date} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(27,45,107,0.04)', border: '1px solid rgba(27,45,107,0.12)' }}>
            <span className="font-titre font-extrabold text-2xl min-w-12" style={{ color: e.color }}>{e.date}</span>
            <div>
              <p className="font-titre font-semibold text-bleu-marine">{e.qui}</p>
              <p className="font-corps text-sm text-gris-moyen">{e.obligation}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}>
        <strong>Sources :</strong>{' '}
        <a href="https://www.impots.gouv.fr/professionnel/la-facture-electronique" className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">impots.gouv.fr</a>{' '}·{' '}
        <a href="https://www.legifrance.gouv.fr" className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">legifrance.gouv.fr</a>
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
