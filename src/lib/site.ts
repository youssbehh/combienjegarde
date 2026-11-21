// Configuration du site, pilotée par les variables d'environnement Vercel
// (Project Settings → Environment Variables). Voir .env.example.

const env = import.meta.env;

/** URL publique du site, sans barre finale. Sert aux canoniques, au sitemap et à l'Open Graph. */
export const SITE_URL = (env.VITE_SITE_URL || 'https://combienjegarde.vercel.app').replace(/\/+$/, '');

export const SITE_NAME = 'CombienJeGarde';

export const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL || 'contact@combienjegarde.fr';

export const PRIX_PDF = '4,90 €';

/** Lien de paiement Stripe. Les liens de test (« /test_ ») sont ignorés. */
const lienStripe = env.VITE_STRIPE_PAYMENT_LINK || '';
export const STRIPE_PAYMENT_LINK =
  lienStripe.startsWith('https://buy.stripe.com/') && !lienStripe.includes('/test_') ? lienStripe : '';

export const EDITEUR = {
  nom: env.VITE_EDITEUR_NOM || '',
  siret: env.VITE_EDITEUR_SIRET || '',
  adresse: env.VITE_EDITEUR_ADRESSE || '',
};

/**
 * La vente du rapport PDF n'est proposée que si le lien Stripe live ET
 * l'identité légale de l'éditeur sont renseignés.
 */
export const PAIEMENT_ACTIF = Boolean(STRIPE_PAYMENT_LINK && EDITEUR.nom && EDITEUR.siret);
