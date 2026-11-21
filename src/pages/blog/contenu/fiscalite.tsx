import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Corps, Encadre, H2, Source, Tableau } from '../../../components/blog/Prose';
import { calculerImpotAnnuel, calculerRevenuNet } from '../../../lib/calculs';
import { TAUX_2025, TAUX_2026, formatTaux } from '../../../lib/constants';
import type { Secteur, TauxAnnee } from '../../../lib/constants';

// Les chiffres de ces articles sont calculés à partir de src/lib/constants.ts :
// corriger un taux là-bas met à jour le simulateur ET les articles.

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`;
const lien = 'text-bleu-marine underline';

const SECTEURS: { id: Secteur; libelle: string }[] = [
  { id: 'bic_vente', libelle: 'BIC Vente (commerce, vente de marchandises)' },
  { id: 'bic_services', libelle: 'BIC Services (prestations commerciales et artisanales)' },
  { id: 'bnc', libelle: 'BNC (libéral non réglementé)' },
  { id: 'bnc_cipav', libelle: 'BNC réglementé (CIPAV)' },
];

const CA_EXEMPLE = 3000;

function lignesTaux(taux: TauxAnnee): ReactNode[][] {
  return SECTEURS.map(({ id, libelle }) => [
    libelle,
    formatTaux(taux.cotisations[id]),
    eur(CA_EXEMPLE * taux.cotisations[id]),
  ]);
}

// Barème appliqué en 2025 (revenus 2024), pour comparaison avec le barème 2026
const BAREME_2025 = [11_497, 29_315, 83_823, 180_294];
const TAUX_TRANCHES = ['0 %', '11 %', '30 %', '41 %', '45 %'];
const seuils2026 = TAUX_2026.bareme_ir.map((tranche) => tranche.seuil);

function lignesBareme(): ReactNode[][] {
  return TAUX_TRANCHES.map((taux, i) => {
    if (i === 0) return [`Jusqu'à ${eur(seuils2026[0])}`, taux];
    if (i === TAUX_TRANCHES.length - 1) return [`Au-delà de ${eur(seuils2026[i - 1])}`, taux];
    return [`De ${eur(seuils2026[i - 1])} à ${eur(seuils2026[i])}`, taux];
  });
}

// Exemple d'impôt : BNC, 3 000 €/mois, personne seule, sans autre revenu
const caAnnuelExemple = CA_EXEMPLE * 12;
const imposableExemple = Math.round(caAnnuelExemple * (1 - TAUX_2026.abattement_forfaitaire.bnc));
const impotExemple = calculerImpotAnnuel(imposableExemple, 1, TAUX_2026);
const impotBrutExemple = Math.round((imposableExemple - seuils2026[0]) * 0.11);

/** Compare versement libératoire et barème pour un CA mensuel en BNC. */
function comparerVersementLiberatoire(ca: number, nbParts: number, autresRevenus = 0) {
  const base = { ca, secteur: 'bnc' as const, annee: 2026 as const, revenuFiscalRef: autresRevenus, nbParts };
  return {
    liberatoire: calculerRevenuNet({ ...base, prelevementLiberatoire: true }).impotEstime,
    bareme: calculerRevenuNet({ ...base, prelevementLiberatoire: false }).impotEstime,
  };
}

const exemplesPL = [
  { titre: '2 000 €/mois en BNC, personne seule, sans autre revenu', ...comparerVersementLiberatoire(2000, 1) },
  { titre: '4 000 €/mois en BNC, personne seule, sans autre revenu', ...comparerVersementLiberatoire(4000, 1) },
  { titre: '2 000 €/mois en BNC, en plus de 26 000 € de salaires imposables, 1 part', ...comparerVersementLiberatoire(2000, 1, 26_000) },
];

const hausseBNC = CA_EXEMPLE * (TAUX_2026.cotisations.bnc - TAUX_2025.cotisations.bnc);

export const articlesFiscalite: Record<string, ReactNode> = {
  'cotisations-urssaf-ae': (
    <Corps>
      <H2>Comment fonctionnent les cotisations en auto-entreprise ?</H2>
      <p>En auto-entreprise, vous ne payez des cotisations sociales que sur le chiffre d'affaires réellement encaissé. Si vous n'encaissez rien, vous ne payez rien : il n'y a aucune cotisation minimale.</p>
      <p>Le calcul est simple : <strong>cotisations = chiffre d'affaires × taux</strong>. Le taux dépend de votre activité.</p>

      <H2>Taux par secteur en 2025</H2>
      <Tableau
        legende="Taux de cotisations sociales des micro-entrepreneurs en 2025"
        entetes={['Secteur', 'Taux 2025', `Pour ${eur(CA_EXEMPLE)} de CA`]}
        lignes={lignesTaux(TAUX_2025)}
      />
      <p className="text-sm">Le taux des professions libérales non réglementées est passé de 23,1 % à {formatTaux(TAUX_2025.cotisations.bnc)} au 1er janvier 2025, puis à {formatTaux(TAUX_2026.cotisations.bnc)} en 2026. <Link to="/guide/cotisations-urssaf-2026" className={lien}>Voir les taux 2026</Link>.</p>

      <H2>Ce que couvrent vos cotisations</H2>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>Assurance maladie-maternité et indemnités journalières</li>
        <li>Retraite de base et retraite complémentaire</li>
        <li>Invalidité-décès</li>
        <li>Allocations familiales</li>
        <li>CSG et CRDS</li>
      </ul>
      <p>S'y ajoute la <strong>contribution à la formation professionnelle</strong> : 0,1 % du chiffre d'affaires pour les commerçants, 0,2 % pour les professions libérales, 0,3 % pour les artisans.</p>

      <H2>Comment déclarer et payer à l'URSSAF ?</H2>
      <p>Rendez-vous sur <a href="https://www.autoentrepreneur.urssaf.fr" className={lien} target="_blank" rel="noopener noreferrer">autoentrepreneur.urssaf.fr</a>. Vous déclarez votre chiffre d'affaires, même nul, chaque mois ou chaque trimestre selon l'option choisie. Le paiement se fait en ligne.</p>

      <H2>L'ACRE : une réduction en début d'activité</H2>
      <p>Sous conditions (demandeur d'emploi, jeune de moins de 26 ans, bénéficiaire du RSA…), l'ACRE réduit vos cotisations jusqu'à la fin du troisième trimestre civil suivant le début d'activité. La réduction est de <strong>50 %</strong> pour une création jusqu'au 30 juin 2026 et de <strong>25 %</strong> à partir du 1er juillet 2026. La demande se fait auprès de l'URSSAF dans les 45 jours suivant la création.</p>

      <Source href="https://www.autoentrepreneur.urssaf.fr">autoentrepreneur.urssaf.fr — taux de cotisations</Source>
    </Corps>
  ),

  'impot-auto-entrepreneur': (
    <Corps>
      <H2>L'abattement forfaitaire : votre principal avantage fiscal</H2>
      <p>Au régime micro, l'administration retire de votre chiffre d'affaires un abattement forfaitaire censé représenter vos frais professionnels, sans justificatif. Seul le reste est imposable.</p>
      <Tableau
        legende="Abattement forfaitaire par secteur"
        entetes={['Secteur', 'Abattement', `Base imposable pour ${eur(CA_EXEMPLE)} de CA`]}
        lignes={[
          ['BIC Vente', '71 %', `${eur(CA_EXEMPLE * 0.29)}/mois`],
          ['BIC Services', '50 %', `${eur(CA_EXEMPLE * 0.5)}/mois`],
          ['BNC', '34 %', `${eur(CA_EXEMPLE * 0.66)}/mois`],
        ]}
      />

      <H2>Barème progressif de l'impôt sur le revenu</H2>
      <p>Voici le barème voté dans la loi de finances pour 2026, applicable aux revenus de 2025, par part de quotient familial. C'est le dernier barème connu : celui des revenus 2026 sera fixé par la loi de finances pour 2027.</p>
      <Tableau legende="Barème de l'impôt sur le revenu" entetes={['Tranche de revenu annuel (par part)', 'Taux']} lignes={lignesBareme()} />

      <H2>Exemple complet : BNC, {eur(CA_EXEMPLE)} par mois, personne seule</H2>
      <Encadre ton="neutre">
        <p>Chiffre d'affaires annuel : <strong>{eur(caAnnuelExemple)}</strong></p>
        <p>Abattement de 34 % : <strong>− {eur(caAnnuelExemple - imposableExemple)}</strong></p>
        <p>Revenu imposable : <strong>{eur(imposableExemple)}</strong></p>
        <p>Tranche à 0 % jusqu'à {eur(seuils2026[0])} : 0 €</p>
        <p>Tranche à 11 % : ({eur(imposableExemple)} − {eur(seuils2026[0])}) × 11 % = {eur(impotBrutExemple)}</p>
        <p>Décote (réduction automatique pour les petits impôts) : − {eur(impotBrutExemple - impotExemple)}</p>
        <p>Impôt dû : <strong>{eur(impotExemple)} par an</strong>, soit environ <strong>{eur(impotExemple / 12)} par mois</strong></p>
      </Encadre>
      <p>Si votre foyer perçoit d'autres revenus, ils s'ajoutent à cette base et peuvent faire monter votre activité dans une tranche supérieure. Le <Link to="/#simulateur" className={lien}>simulateur</Link> en tient compte.</p>

      <Source href="https://www.service-public.gouv.fr/particuliers/vosdroits/F1419">service-public.gouv.fr — barème de l'impôt sur le revenu</Source>
    </Corps>
  ),

  'tva-auto-entrepreneur': (
    <Corps>
      <H2>Qu'est-ce que la franchise en base de TVA ?</H2>
      <p>C'est le régime par défaut de l'auto-entrepreneur : vous ne facturez pas la TVA à vos clients et vous ne la récupérez pas sur vos achats. C'est simple, et avantageux quand vos clients sont des particuliers.</p>

      <H2>Seuils de franchise en 2025 et 2026</H2>
      <Tableau
        legende="Seuils de la franchise en base de TVA"
        entetes={['Activité', 'Seuil de franchise', 'Seuil majoré']}
        lignes={[
          ['Vente de marchandises, hébergement', eur(TAUX_2026.seuils_tva.bic_vente), '93 500 €'],
          ['Prestations de services (BIC)', eur(TAUX_2026.seuils_tva.bic_services), '41 250 €'],
          ['Professions libérales (BNC)', eur(TAUX_2026.seuils_tva.bnc), '41 250 €'],
        ]}
      />
      <p>Ces seuils sont inchangés en 2026 : le projet de seuil unique abaissé a été abandonné.</p>

      <H2>Que se passe-t-il en cas de dépassement ?</H2>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li><strong>Entre le seuil et le seuil majoré :</strong> vous restez en franchise jusqu'au 31 décembre, puis vous facturez la TVA à partir du 1er janvier suivant.</li>
        <li><strong>Au-delà du seuil majoré :</strong> vous devenez redevable de la TVA dès le jour du dépassement.</li>
      </ul>
      <p>Attention : les seuils de TVA sont bien plus bas que les plafonds du régime micro ({eur(TAUX_2026.plafonds_ca.bnc)} et {eur(TAUX_2026.plafonds_ca.bic_vente)} en 2026). On peut donc rester micro-entrepreneur tout en facturant la TVA.</p>

      <H2>Mention obligatoire sur les factures</H2>
      <Encadre ton="neutre">
        <p className="font-mono">« TVA non applicable, art. 293 B du CGI »</p>
      </Encadre>
      <p>Cette mention est <strong>obligatoire</strong> sur toutes vos factures tant que vous êtes en franchise de TVA.</p>

      <Source href="https://entreprendre.service-public.gouv.fr/vosdroits/F21746">service-public.gouv.fr — franchise en base de TVA</Source>
    </Corps>
  ),

  'prelevement-liberatoire': (
    <Corps>
      <H2>Qu'est-ce que le versement libératoire ?</H2>
      <p>Le versement libératoire de l'impôt sur le revenu (souvent appelé « prélèvement libératoire ») vous permet de payer votre impôt en même temps que vos cotisations URSSAF, sous la forme d'un pourcentage fixe de votre chiffre d'affaires. L'impôt sur ces revenus est alors définitivement réglé.</p>
      <Tableau
        legende="Taux du versement libératoire"
        entetes={['Activité', 'Taux sur le CA']}
        lignes={[
          ['Vente de marchandises (BIC)', formatTaux(TAUX_2026.prelevement_liberatoire.bic_vente)],
          ['Prestations de services (BIC)', formatTaux(TAUX_2026.prelevement_liberatoire.bic_services)],
          ['Professions libérales (BNC)', formatTaux(TAUX_2026.prelevement_liberatoire.bnc)],
        ]}
      />

      <H2>Est-ce intéressant ? Trois exemples</H2>
      <p>Tout dépend de l'impôt que vous paieriez au barème. Si vous n'êtes pas ou peu imposable, le versement libératoire vous fait payer un impôt que vous n'auriez pas dû.</p>
      {exemplesPL.map((exemple) => (
        <Encadre key={exemple.titre} ton="neutre">
          <p className="font-titre font-bold text-bleu-marine">{exemple.titre}</p>
          <p>Versement libératoire : <strong>{eur(exemple.liberatoire)}/mois</strong></p>
          <p>Barème progressif : <strong>{eur(exemple.bareme)}/mois</strong></p>
          <p>→ {exemple.liberatoire < exemple.bareme ? 'Le versement libératoire est plus avantageux.' : 'Le barème est plus avantageux.'}</p>
        </Encadre>
      ))}

      <H2>Conditions d'éligibilité</H2>
      <p>Le revenu fiscal de référence de votre foyer de l'avant-dernière année ne doit pas dépasser un plafond par part de quotient familial : <strong>{eur(TAUX_2025.plafond_rfr_pl)}</strong> pour opter en 2025, <strong>{eur(TAUX_2026.plafond_rfr_pl)}</strong> pour 2026.</p>
      <p>L'option se demande à l'URSSAF au plus tard le 30 septembre pour une application l'année suivante, ou dans les trois mois suivant la création de l'activité.</p>

      <Source href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire">impots.gouv.fr — versement libératoire</Source>
    </Corps>
  ),

  'changements-2026': (
    <Corps>
      <H2>Cotisations BNC : +1 point</H2>
      <p>Le taux des <strong>professions libérales non réglementées</strong> passe de {formatTaux(TAUX_2025.cotisations.bnc)} à <strong>{formatTaux(TAUX_2026.cotisations.bnc)}</strong> au 1er janvier 2026. C'est la dernière étape d'une hausse engagée en 2024 pour financer leur retraite complémentaire. Les autres taux ne bougent pas.</p>
      <Tableau
        legende="Évolution des taux de cotisations entre 2025 et 2026"
        entetes={['Secteur', '2025', '2026']}
        lignes={SECTEURS.map(({ id, libelle }) => [libelle, formatTaux(TAUX_2025.cotisations[id]), formatTaux(TAUX_2026.cotisations[id])])}
      />
      <Encadre ton="attention">
        <p><strong>Impact concret :</strong> pour {eur(CA_EXEMPLE)} de chiffre d'affaires mensuel en BNC, la hausse représente <strong>{eur(hausseBNC)} par mois</strong>, soit {eur(hausseBNC * 12)} par an.</p>
      </Encadre>

      <H2>Plafonds de chiffre d'affaires relevés</H2>
      <p>Les plafonds du régime micro sont revalorisés pour 2026, 2027 et 2028 : <strong>{eur(TAUX_2026.plafonds_ca.bic_vente)}</strong> pour la vente de marchandises (contre {eur(TAUX_2025.plafonds_ca.bic_vente)}) et <strong>{eur(TAUX_2026.plafonds_ca.bnc)}</strong> pour les prestations de services et les professions libérales (contre {eur(TAUX_2025.plafonds_ca.bnc)}). Les seuils de franchise de TVA restent à 85 000 € et 37 500 €.</p>

      <H2>Barème de l'impôt : +0,9 %</H2>
      <p>La loi de finances pour 2026 revalorise de 0,9 % les tranches du barème applicable aux revenus de 2025.</p>
      <Tableau
        legende="Seuils du barème de l'impôt sur le revenu"
        entetes={['Taux', 'Seuil haut — barème 2025', 'Seuil haut — barème 2026']}
        lignes={TAUX_TRANCHES.map((taux, i) => [
          taux,
          i < BAREME_2025.length ? eur(BAREME_2025[i]) : '—',
          i < BAREME_2025.length ? eur(seuils2026[i]) : '—',
        ])}
      />

      <H2>ACRE : 25 % au lieu de 50 %</H2>
      <p>Pour les entreprises créées à partir du <strong>1er juillet 2026</strong>, l'ACRE ne réduit plus les cotisations que de 25 %, contre 50 % auparavant. Depuis le 1er janvier 2026, elle est aussi réservée à certains publics (demandeurs d'emploi, jeunes, bénéficiaires de minima sociaux…) et doit être demandée à l'URSSAF.</p>

      <H2>Facturation électronique : réception obligatoire depuis septembre</H2>
      <p>Depuis le <strong>1er septembre 2026</strong>, toutes les entreprises, micro-entrepreneurs compris, doivent pouvoir <strong>recevoir</strong> des factures électroniques via une plateforme agréée. L'obligation d'en <strong>émettre</strong> arrive le 1er septembre 2027 pour les micro-entreprises.</p>
      <Encadre>
        <p>→ <strong>Lire notre guide :</strong> <Link to="/guide/e-facturation-auto-entrepreneur" className={lien}>la facturation électronique pour l'auto-entrepreneur</Link></p>
      </Encadre>

      <Source href="https://entreprendre.service-public.gouv.fr/vosdroits/F36232">service-public.gouv.fr — cotisations du micro-entrepreneur</Source>
    </Corps>
  ),

  'cotisations-urssaf-2026': (
    <Corps>
      <H2>Pourquoi les cotisations BNC augmentent-elles en 2026 ?</H2>
      <p>Depuis 2024, le taux des professions libérales non réglementées est relevé par étapes afin de leur ouvrir des droits à la retraite complémentaire comparables à ceux des autres indépendants : 21,1 % → 23,1 % (juillet 2024) → {formatTaux(TAUX_2025.cotisations.bnc)} (2025) → <strong>{formatTaux(TAUX_2026.cotisations.bnc)}</strong> (2026).</p>

      <H2>Taux applicables en 2026</H2>
      <Tableau
        legende="Taux de cotisations sociales des micro-entrepreneurs en 2026"
        entetes={['Secteur', 'Taux 2026', `Pour ${eur(CA_EXEMPLE)} de CA`]}
        lignes={lignesTaux(TAUX_2026)}
      />
      <p>À ces taux s'ajoute la contribution à la formation professionnelle : 0,1 % (commerçants), 0,2 % (professions libérales) ou 0,3 % (artisans) du chiffre d'affaires.</p>

      <H2>L'ACRE en 2026</H2>
      <p>L'ACRE existe toujours, mais elle est moins généreuse : réduction de <strong>50 %</strong> pour une création jusqu'au 30 juin 2026, de <strong>25 %</strong> à partir du 1er juillet 2026. Elle est réservée à certains publics et se demande à l'URSSAF dans les 45 jours suivant la création.</p>

      <H2>Calculez l'effet sur votre revenu</H2>
      <p>Le <Link to="/#simulateur" className={lien}>simulateur</Link> applique ces taux et vous permet de comparer 2025 et 2026 en un clic.</p>

      <Source href="https://www.autoentrepreneur.urssaf.fr">autoentrepreneur.urssaf.fr — taux applicables en 2026</Source>
    </Corps>
  ),
};
