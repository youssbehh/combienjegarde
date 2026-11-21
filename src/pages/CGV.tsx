import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import { CONTACT_EMAIL, EDITEUR, PAIEMENT_ACTIF, PRIX_PDF, SITE_NAME } from '../lib/site';

const lien = 'text-bleu-marine underline hover:text-bleu-moyen';

export default function CGV() {
  return (
    <>
      <SEOHead
        title="Conditions générales de vente"
        description={`Conditions générales de vente du rapport PDF proposé par ${SITE_NAME}.`}
        canonical="/cgv"
        noindex={!PAIEMENT_ACTIF}
      />

      <div className="max-w-3xl mx-auto px-6 py-16 font-corps text-gris-fonce leading-relaxed">
        <h1 className="font-titre font-extrabold text-bleu-marine text-3xl mb-10">Conditions générales de vente</h1>

        {!PAIEMENT_ACTIF ? (
          <p>
            Le simulateur {SITE_NAME} est entièrement gratuit et aucun produit n'est actuellement proposé à la vente sur ce site. Voir les <Link to="/mentions-legales" className={lien}>mentions légales</Link>.
          </p>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">1. Vendeur</h2>
              <p><strong>{EDITEUR.nom}</strong> — SIRET {EDITEUR.siret}</p>
              {EDITEUR.adresse && <p>{EDITEUR.adresse}</p>}
              <p>Contact : <a href={`mailto:${CONTACT_EMAIL}`} className={lien}>{CONTACT_EMAIL}</a></p>
            </section>

            <section className="mb-10">
              <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">2. Produit</h2>
              <p>Le produit vendu est un <strong>rapport PDF de 6 pages</strong> généré à partir de la simulation réalisée sur le site : détail mensuel et annuel, comparatif de statuts, calendrier, conseils et guide de la facturation électronique.</p>
              <p className="mt-2">Ce rapport est un contenu numérique d'information. Il ne constitue pas un conseil fiscal, comptable ou juridique personnalisé.</p>
            </section>

            <section className="mb-10">
              <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">3. Prix et paiement</h2>
              <p>Le prix est de <strong>{PRIX_PDF} TTC</strong> (TVA non applicable, article 293 B du CGI). Le paiement s'effectue en ligne par carte bancaire via Stripe, au moment de la commande.</p>
            </section>

            <section className="mb-10">
              <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">4. Livraison</h2>
              <p>Le rapport est généré et téléchargé automatiquement dans votre navigateur dès le retour sur le site après le paiement. Effectuez l'achat et le téléchargement sur le même appareil et le même navigateur.</p>
              <p className="mt-2">En cas de problème de téléchargement, écrivez à <a href={`mailto:${CONTACT_EMAIL}`} className={lien}>{CONTACT_EMAIL}</a> en indiquant l'adresse e-mail utilisée pour le paiement : le rapport vous sera renvoyé ou la commande remboursée.</p>
            </section>

            <section className="mb-10">
              <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">5. Droit de rétractation</h2>
              <p>Le rapport étant un contenu numérique fourni immédiatement après le paiement, vous acceptez expressément, en validant la commande, que son exécution commence sans délai et vous renoncez à votre droit de rétractation, conformément à l'article L221-28 du Code de la consommation.</p>
            </section>

            <section className="mb-10">
              <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">6. Garanties et réclamations</h2>
              <p>Vous bénéficiez de la garantie légale de conformité applicable aux contenus numériques. Toute réclamation peut être adressée à <a href={`mailto:${CONTACT_EMAIL}`} className={lien}>{CONTACT_EMAIL}</a>.</p>
              <p className="mt-2">À défaut de solution amiable, vous pouvez recourir gratuitement à un médiateur de la consommation.</p>
            </section>

            <section className="mb-10">
              <h2 className="font-titre font-bold text-bleu-marine text-xl mb-4">7. Droit applicable</h2>
              <p>Les présentes conditions sont soumises au droit français.</p>
            </section>

            <p className="text-xs text-gris-moyen mt-10">Dernière mise à jour : novembre 2026</p>
          </>
        )}
      </div>
    </>
  );
}
