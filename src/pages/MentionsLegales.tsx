import SEOHead from '../components/layout/SEOHead';

export default function MentionsLegales() {
  return (
    <>
      <SEOHead
        title="Mentions légales — CombienJeGarde.fr"
        description="Mentions légales, informations sur l'éditeur, hébergeur et conditions d'utilisation de CombienJeGarde.fr."
        canonical="/mentions-legales"
      />

      <div className="max-w-3xl mx-auto px-6 py-16 font-corps text-gris-fonce leading-relaxed">
        <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-10">Mentions légales</h1>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">1. Éditeur du site</h2>
          <p>Le site <strong>CombienJeGarde.fr</strong> est édité à titre personnel, dans le cadre d'un projet non commercial.</p>
          <p className="mt-2">Contact : <a href="mailto:contact@combienjegarde.fr" className="text-vert-menthe hover:underline">contact@combienjegarde.fr</a></p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">2. Hébergement</h2>
          <p>Ce site est hébergé par :</p>
          <p className="mt-2 font-semibold">Vercel Inc.</p>
          <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
          <p><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-vert-menthe hover:underline">vercel.com</a></p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">3. Objet du site</h2>
          <p>CombienJeGarde.fr est un <strong>outil de simulation indicatif</strong> permettant aux auto-entrepreneurs français d'estimer leur revenu net après cotisations URSSAF, impôt sur le revenu et CFE.</p>
          <p className="mt-2">Les calculs sont basés sur les taux officiels publiés par l'URSSAF, la DGFiP et le service-public.fr pour les années 2025 et 2026.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">4. Limitation de responsabilité</h2>
          <p>Les résultats fournis par ce simulateur sont des <strong>estimations à titre indicatif uniquement</strong>. Ils ne constituent en aucun cas un conseil fiscal, comptable ou juridique.</p>
          <p className="mt-2">Les taux et barèmes utilisés peuvent être sujets à modification. L'éditeur ne saurait être tenu responsable d'erreurs, omissions ou résultats inexacts.</p>
          <p className="mt-2">Pour toute décision fiscale ou comptable, il est recommandé de consulter un <strong>expert-comptable agréé</strong>.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">5. Données personnelles et cookies</h2>
          <p>Ce site <strong>ne collecte aucune donnée personnelle</strong> identifiable. Aucun formulaire d'inscription n'est proposé.</p>
          <p className="mt-2">Les préférences de simulation sont sauvegardées localement dans votre navigateur (<code>localStorage</code>) sous la clé <code>cjg_last_sim</code>. Ces données ne quittent jamais votre appareil.</p>
          <p className="mt-2">Des statistiques de visite anonymisées peuvent être collectées via <strong>Vercel Analytics</strong> (pages vues, pays d'origine, temps de chargement). Aucun cookie tiers de tracking n'est déposé.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">6. Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, calculs, design, code source) est la propriété de l'éditeur. Toute reproduction totale ou partielle sans autorisation préalable est interdite.</p>
          <p className="mt-2">Les données fiscales utilisées (taux URSSAF, barèmes IR) proviennent de sources officielles publiques (autoentrepreneur.urssaf.fr, impots.gouv.fr, service-public.fr, legifrance.gouv.fr) et sont reproduites à titre informatif.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">7. Sources officielles utilisées</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><a href="https://www.autoentrepreneur.urssaf.fr" target="_blank" rel="noopener noreferrer" className="text-vert-menthe hover:underline">autoentrepreneur.urssaf.fr</a> — Taux de cotisations</li>
            <li><a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-vert-menthe hover:underline">impots.gouv.fr</a> — Barème IR, prélèvement libératoire</li>
            <li><a href="https://www.service-public.fr" target="_blank" rel="noopener noreferrer" className="text-vert-menthe hover:underline">service-public.fr</a> — Réglementation auto-entrepreneur</li>
            <li><a href="https://www.legifrance.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-vert-menthe hover:underline">legifrance.gouv.fr</a> — Textes législatifs</li>
          </ul>
        </section>

        <p className="text-xs text-gris-moyen mt-10">Dernière mise à jour : mai 2026</p>
      </div>
    </>
  );
}
