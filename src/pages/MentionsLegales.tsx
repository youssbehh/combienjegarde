import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import { CONTACT_EMAIL, EDITEUR, PAIEMENT_ACTIF, SITE_NAME } from '../lib/site';

const lien = 'text-bleu-marine underline hover:text-bleu-moyen';

export default function MentionsLegales() {
  return (
    <>
      <SEOHead
        title="Mentions légales"
        description={`Mentions légales, informations sur l'éditeur, l'hébergeur et les données personnelles du site ${SITE_NAME}.`}
        canonical="/mentions-legales"
      />

      <div className="max-w-3xl mx-auto px-6 py-16 font-corps text-gris-fonce leading-relaxed">
        <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-10">Mentions légales</h1>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">1. Éditeur du site</h2>
          {EDITEUR.nom ? (
            <>
              <p>Le site <strong>{SITE_NAME}</strong> est édité par <strong>{EDITEUR.nom}</strong>.</p>
              {EDITEUR.siret && <p className="mt-2">SIRET : {EDITEUR.siret}</p>}
              {EDITEUR.adresse && <p className="mt-2">Adresse : {EDITEUR.adresse}</p>}
              <p className="mt-2">Directeur de la publication : {EDITEUR.nom}</p>
            </>
          ) : (
            <p>
              Le site <strong>{SITE_NAME}</strong> est édité à titre personnel et non professionnel. Conformément à l'article 1-1 de la loi n° 2004-575 du 21 juin 2004, l'éditeur a choisi de préserver son anonymat : ses coordonnées ont été communiquées à l'hébergeur ci-dessous.
            </p>
          )}
          <p className="mt-2">Contact : <a href={`mailto:${CONTACT_EMAIL}`} className={lien}>{CONTACT_EMAIL}</a></p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">2. Hébergement</h2>
          <p className="font-semibold">Vercel Inc.</p>
          <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
          <p><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className={lien}>vercel.com</a></p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">3. Objet du site</h2>
          <p>{SITE_NAME} est un <strong>outil de simulation indicatif</strong> permettant aux auto-entrepreneurs français d'estimer leur revenu net après cotisations URSSAF, impôt sur le revenu et CFE.</p>
          <p className="mt-2">Les calculs reposent sur les taux publiés par l'URSSAF, la DGFiP et service-public.gouv.fr pour les années 2025 et 2026.</p>
          {PAIEMENT_ACTIF && (
            <p className="mt-2">La simulation est gratuite. Un rapport PDF détaillé est proposé à la vente : voir les <Link to="/cgv" className={lien}>conditions générales de vente</Link>.</p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">4. Limitation de responsabilité</h2>
          <p>Les résultats fournis par ce simulateur sont des <strong>estimations à titre indicatif uniquement</strong>. Ils ne constituent en aucun cas un conseil fiscal, comptable ou juridique.</p>
          <p className="mt-2">Les taux et barèmes utilisés peuvent être modifiés par la loi. L'éditeur ne saurait être tenu responsable d'erreurs, d'omissions ou de résultats inexacts.</p>
          <p className="mt-2">Pour toute décision fiscale ou comptable, consultez un <strong>expert-comptable</strong>.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">5. Données personnelles et cookies</h2>
          <p>Ce site ne propose aucun compte utilisateur et <strong>ne dépose aucun cookie</strong>.</p>
          <p className="mt-2">Les paramètres de votre simulation sont enregistrés uniquement dans votre navigateur (<code>localStorage</code>, clés <code>cjg_last_sim</code> et <code>cjg_pending_pdf</code>). Ils ne sont jamais transmis à un serveur ; vous pouvez les effacer avec le bouton « Tout réinitialiser » ou en vidant les données du site.</p>
          <p className="mt-2">Les polices de caractères sont servies depuis ce site : aucune requête n'est envoyée à un service tiers pour les afficher.</p>
          <p className="mt-2">Des statistiques de fréquentation anonymes sont mesurées avec <strong>Vercel Web Analytics</strong> (pages vues, pays, type d'appareil), sans cookie ni identifiant persistant.</p>
          {PAIEMENT_ACTIF && (
            <p className="mt-2">Le paiement du rapport PDF est traité par <strong>Stripe</strong>, qui collecte les informations nécessaires à la transaction (e-mail, moyen de paiement). Ces données ne transitent pas par ce site.</p>
          )}
          <p className="mt-2">Pour toute question ou pour exercer vos droits (accès, rectification, effacement), écrivez à <a href={`mailto:${CONTACT_EMAIL}`} className={lien}>{CONTACT_EMAIL}</a>. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">6. Propriété intellectuelle</h2>
          <p>Les textes, le design et le code de ce site sont la propriété de l'éditeur. Toute reproduction sans autorisation préalable est interdite.</p>
          <p className="mt-2">Les données fiscales (taux URSSAF, barème de l'impôt) proviennent de sources officielles publiques. La page Guide affiche des titres d'actualités renvoyant vers les sites officiels qui les publient ; ces contenus restent la propriété de leurs auteurs.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">7. Sources officielles utilisées</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><a href="https://www.autoentrepreneur.urssaf.fr" target="_blank" rel="noopener noreferrer" className={lien}>autoentrepreneur.urssaf.fr</a> — taux de cotisations</li>
            <li><a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className={lien}>impots.gouv.fr</a> — barème de l'impôt, versement libératoire</li>
            <li><a href="https://entreprendre.service-public.gouv.fr" target="_blank" rel="noopener noreferrer" className={lien}>entreprendre.service-public.gouv.fr</a> — réglementation du micro-entrepreneur</li>
            <li><a href="https://www.legifrance.gouv.fr" target="_blank" rel="noopener noreferrer" className={lien}>legifrance.gouv.fr</a> — textes législatifs</li>
          </ul>
        </section>

        <p className="text-xs text-gris-moyen mt-10">Dernière mise à jour : novembre 2026</p>
      </div>
    </>
  );
}
