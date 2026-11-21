/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL publique du site, sans barre finale (ex. https://combienjegarde.fr). */
  readonly VITE_SITE_URL?: string;
  /** Lien de paiement Stripe (mode live) pour le rapport PDF. */
  readonly VITE_STRIPE_PAYMENT_LINK?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  /** Identité de l'éditeur — obligatoire dès que la vente du PDF est activée. */
  readonly VITE_EDITEUR_NOM?: string;
  readonly VITE_EDITEUR_SIRET?: string;
  readonly VITE_EDITEUR_ADRESSE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
