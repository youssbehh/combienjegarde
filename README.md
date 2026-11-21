# CombienJeGarde

Simulateur de revenu net pour auto-entrepreneurs français : cotisations URSSAF, impôt sur le revenu, CFE, comparatif avec la SASU et le portage salarial, guides et actualités officielles.

React 18 · TypeScript · Vite · Tailwind · Zustand · déployé sur Vercel.

## Commandes

```bash
npm install
npm run dev        # serveur de développement
npm test           # tests unitaires (calculs + agrégateur d'actualités)
npm run typecheck  # vérification TypeScript
npm run build      # build de production + pré-rendu des pages
```

`vite dev` ne sert pas le dossier `api/`. Pour tester les fonctions serverless en local : `npx vercel dev`.

## Comment le site est construit

`npm run build` enchaîne quatre étapes :

1. `tsc` — vérification des types ;
2. `vite build` — bundle client dans `dist/` ;
3. `vite build --ssr` — bundle de rendu serveur temporaire ;
4. `scripts/prerender.mjs` — génère **un fichier HTML par page** (contenu et balises SEO inclus), `404.html`, `sitemap.xml` et `robots.txt`.

Vercel sert ces fichiers statiques (`cleanUrls` dans `vercel.json`) ; React hydrate ensuite la page. Une URL inconnue reçoit un vrai statut 404.

La liste des pages est dans `src/routes.ts`. Elle est dérivée de la liste des articles : **ajouter un article suffit à créer sa page et son entrée de sitemap.**

## Mettre à jour les chiffres

Tous les taux, plafonds et barèmes sont dans **`src/lib/constants.ts`**. Le simulateur, les FAQ, les pages par secteur, le comparatif et les articles fiscaux lisent ce fichier : une correction s'y propage partout.

Chaque début d'année :

1. ajouter un bloc `TAUX_20XX` et l'année dans `AnneeFiscale` / `TAUX_PAR_ANNEE` ;
2. passer `ANNEE_COURANTE` à la nouvelle année ;
3. mettre à jour `BAREME_IR_DERNIER_CONNU` et la décote quand la loi de finances est promulguée ;
4. adapter les tests de `src/lib/calculs.test.ts`.

Limites connues du calcul : la CFE est une estimation forfaitaire (elle dépend de la commune), le plafonnement du quotient familial n'est pas modélisé, et le comparatif SASU / portage repose sur les ordres de grandeur de `HYPOTHESES_COMPARATIF`.

## Contenu

- **Articles du guide** : métadonnées dans `src/pages/blog/articles.ts`, contenu dans `src/pages/blog/contenu/`. Un nouvel article demande un commit et un déploiement.
- **Actualités officielles** : `api/actualites.ts` agrège les flux RSS de Service-Public Entreprendre, economie.gouv.fr et du BOFiP, ne garde que les sujets utiles aux micro-entrepreneurs et met la réponse en cache une heure sur le CDN. **Elles se mettent à jour toutes seules, sans déploiement.** Pour ajouter une source ou un mot-clé : `FLUX` et `MOTS_CLES` dans ce fichier.

## Variables d'environnement

À définir dans Vercel (Project Settings → Environment Variables) ; voir `.env.example`.

| Variable | Rôle |
| --- | --- |
| `VITE_SITE_URL` | URL publique du site, sans barre finale. Sert aux URL canoniques, au sitemap et à l'Open Graph. Par défaut `https://combienjegarde.vercel.app`. |
| `VITE_CONTACT_EMAIL` | Adresse de contact affichée dans les pages légales. |
| `VITE_STRIPE_PAYMENT_LINK` | Lien de paiement Stripe **live** du rapport PDF. Vide ou lien de test : le bouton d'achat est masqué. |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe, utilisée uniquement par `api/verify-payment.ts`. |
| `VITE_EDITEUR_NOM`, `VITE_EDITEUR_SIRET`, `VITE_EDITEUR_ADRESSE` | Identité légale de l'éditeur (mentions légales et CGV). |

### Activer la vente du rapport PDF

Le bouton n'apparaît que si `VITE_STRIPE_PAYMENT_LINK`, `VITE_EDITEUR_NOM` et `VITE_EDITEUR_SIRET` sont renseignés.

1. Créer un lien de paiement en mode live dans Stripe.
2. Dans ce lien, régler la redirection après paiement sur
   `https://<votre-domaine>/?pdf=success&session_id={CHECKOUT_SESSION_ID}`.
3. Renseigner les variables ci-dessus dans Vercel, puis redéployer.

Au retour de Stripe, `api/verify-payment.ts` vérifie auprès de Stripe que la session est payée avant de générer le PDF. Le PDF étant fabriqué dans le navigateur, cette vérification bloque l'usage normal du site sans paiement, mais pas un utilisateur capable d'exécuter lui-même le code de génération.

## Brancher un nom de domaine

1. Ajouter le domaine dans Vercel (Project Settings → Domains) et suivre les instructions DNS.
2. Mettre `VITE_SITE_URL` à la nouvelle adresse et redéployer : canoniques, sitemap et robots suivent.
