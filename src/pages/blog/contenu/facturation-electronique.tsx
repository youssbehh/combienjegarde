import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Corps, Encadre, H2, Source, Tableau } from '../../../components/blog/Prose';

const lien = 'text-bleu-marine underline';
const SOURCE_DGFIP = 'https://www.impots.gouv.fr/professionnel/la-facture-electronique';

const CALENDRIER: ReactNode[][] = [
  ['1er septembre 2026', 'Toutes les entreprises, micro-entrepreneurs compris', 'Recevoir des factures électroniques'],
  ['1er septembre 2026', 'Grandes entreprises et ETI', 'Émettre des factures électroniques'],
  ['1er septembre 2027', 'PME et micro-entreprises', 'Émettre des factures électroniques'],
];

function ListeNumerotee({ etapes }: { etapes: string[] }) {
  return (
    <ol className="space-y-3">
      {etapes.map((etape, i) => (
        <li key={etape} className="flex items-start gap-3 text-sm">
          <span aria-hidden="true" className="w-6 h-6 rounded-full bg-bleu-marine text-white font-bold text-xs flex items-center justify-center shrink-0">
            {i + 1}
          </span>
          <span>{etape}</span>
        </li>
      ))}
    </ol>
  );
}

export const articlesFacturation: Record<string, ReactNode> = {
  'e-facturation-auto-entrepreneur': (
    <Corps>
      <Encadre ton="attention">
        <p><strong>Où en est-on ?</strong> Depuis le <strong>1er septembre 2026</strong>, vous devez pouvoir <strong>recevoir</strong> des factures électroniques. À partir du <strong>1er septembre 2027</strong>, vous devrez aussi <strong>émettre</strong> les vôtres dans ce format pour vos clients professionnels.</p>
      </Encadre>

      <H2>Qu'est-ce qu'une facture électronique ?</H2>
      <p>C'est une facture émise, transmise et reçue dans un <strong>format structuré</strong>, par l'intermédiaire d'une plateforme agréée par l'administration. Ce n'est <strong>pas</strong> un PDF envoyé par e-mail : elle doit pouvoir être lue automatiquement par les logiciels, et certaines de ses données sont transmises à l'administration fiscale.</p>

      <H2>Êtes-vous concerné ?</H2>
      <ul className="space-y-2 text-sm">
        <li><strong>Vous facturez des entreprises françaises :</strong> oui, réception depuis septembre 2026 et émission en septembre 2027.</li>
        <li><strong>Vous êtes en franchise de TVA :</strong> oui aussi. La franchise ne dispense pas de la réforme.</li>
        <li><strong>Vous ne vendez qu'à des particuliers :</strong> pas de facture électronique à émettre, mais vous devez recevoir celles de vos fournisseurs, et les données de vos ventes devront être transmises (e-reporting).</li>
        <li><strong>Vous facturez le secteur public :</strong> rien ne change, cela passe déjà par Chorus Pro.</li>
      </ul>

      <H2>Calendrier</H2>
      <Tableau legende="Calendrier de la facturation électronique" entetes={['Date', 'Qui ?', 'Obligation']} lignes={CALENDRIER} />

      <H2>Par où passent les factures ?</H2>
      <p>Par une <strong>plateforme agréée</strong> (« PA », anciennement « PDP ») : un opérateur privé immatriculé par l'administration. Vous en choisissez une, et vos clients et fournisseurs utilisent la leur ; les plateformes communiquent entre elles.</p>
      <Encadre ton="attention">
        <p><strong>Attention à une idée reçue :</strong> le portail public de facturation ne propose pas de service gratuit pour émettre ou recevoir des factures. L'État y a renoncé en 2024 ; le portail sert d'annuaire et centralise les données. Il faut donc choisir une plateforme agréée.</p>
      </Encadre>
      <p>→ <Link to="/guide/solutions-e-facturation-auto-entrepreneur-gratuit" className={lien}>Comment choisir sa plateforme, y compris gratuite</Link></p>

      <H2>Factur-X : le format le plus simple</H2>
      <p>Trois formats sont admis : <strong>Factur-X</strong>, UBL et CII. Factur-X est le plus adapté aux indépendants : c'est un PDF classique, lisible par votre client, qui contient en plus des données lisibles par les logiciels. La plupart des outils de facturation le produisent sans que vous ayez à vous en occuper.</p>

      <H2>Ce qui ne change pas</H2>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>Les mentions habituelles de vos factures, dont « TVA non applicable, art. 293 B du CGI » si vous êtes en franchise</li>
        <li>Les seuils de franchise de TVA et vos taux de cotisations</li>
        <li>Les délais de paiement</li>
      </ul>
      <p className="text-sm">De nouvelles mentions s'ajoutent toutefois, notamment le numéro SIREN de votre client et la nature de l'opération (vente de biens, prestation de services ou les deux).</p>

      <H2>Se mettre en règle en 5 étapes</H2>
      <ListeNumerotee
        etapes={[
          'Vérifiez si votre logiciel de facturation actuel est une plateforme agréée ou est raccordé à l\'une d\'elles.',
          'Sinon, choisissez une plateforme dans la liste officielle publiée sur impots.gouv.fr.',
          'Désignez-la comme plateforme de réception : c\'est obligatoire depuis le 1er septembre 2026.',
          'Collectez le numéro SIREN de vos clients professionnels.',
          'Émettez quelques factures électroniques avant septembre 2027 pour roder le processus.',
        ]}
      />

      <Source href={SOURCE_DGFIP}>impots.gouv.fr — la facturation électronique</Source>
    </Corps>
  ),

  'solutions-e-facturation-auto-entrepreneur-gratuit': (
    <Corps>
      <Encadre>
        <p><strong>L'essentiel :</strong> il existe des offres gratuites suffisantes pour un auto-entrepreneur, mais elles viennent de plateformes privées agréées — pas du portail public, qui ne permet ni d'émettre ni de recevoir des factures.</p>
      </Encadre>

      <H2>Trois façons d'être en règle</H2>
      <Tableau
        legende="Types de solutions de facturation électronique"
        entetes={['Solution', 'Pour qui ?', 'Coût habituel']}
        lignes={[
          ['Offre gratuite d\'une plateforme agréée', 'Quelques factures par mois, besoins simples', 'Gratuit, avec limites'],
          ['Logiciel de facturation raccordé à une plateforme', 'Devis, relances, suivi des paiements', 'Quelques euros à une vingtaine d\'euros par mois'],
          ['Logiciel de comptabilité complet', 'Activité soumise à la TVA, nombreuses écritures', 'Plus élevé, rarement utile en micro'],
        ]}
      />
      <p className="text-sm">Les tarifs et les limites des offres gratuites changent souvent : vérifiez-les sur le site de chaque éditeur avant de vous engager.</p>

      <H2>La seule liste qui fait foi</H2>
      <p>L'administration publie la liste des plateformes agréées sur <a href={SOURCE_DGFIP} className={lien} target="_blank" rel="noopener noreferrer">impots.gouv.fr</a>. Un outil qui n'y figure pas doit être raccordé à une plateforme qui y figure : demandez laquelle.</p>

      <H2>Les critères qui comptent pour un auto-entrepreneur</H2>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li><strong>Le coût réel :</strong> nombre de factures incluses, prix au-delà, durée de l'offre gratuite.</li>
        <li><strong>La réception :</strong> est-elle incluse dans l'offre gratuite ? C'est l'obligation déjà en vigueur.</li>
        <li><strong>Les mentions du régime micro :</strong> franchise de TVA, numéro SIREN, nature de l'opération.</li>
        <li><strong>Le suivi du chiffre d'affaires :</strong> utile pour surveiller les seuils de TVA et les plafonds du régime micro.</li>
        <li><strong>La portabilité :</strong> pouvez-vous exporter vos factures et changer de plateforme facilement ?</li>
      </ul>

      <H2>Questions à poser à votre logiciel actuel</H2>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li>Êtes-vous une plateforme agréée, ou à quelle plateforme agréée êtes-vous raccordé ?</li>
        <li>La réception et l'émission de factures électroniques sont-elles incluses dans mon abonnement ?</li>
        <li>Produisez-vous des factures au format <strong>Factur-X</strong> ?</li>
        <li>Gérez-vous l'e-reporting pour mes ventes aux particuliers ?</li>
      </ul>

      <H2>Notre conseil</H2>
      <p>Si vous utilisez déjà un outil de facturation, commencez par lui : la plupart des éditeurs destinés aux indépendants se sont raccordés à une plateforme agréée. Si vous facturez encore avec un traitement de texte ou un tableur, une offre gratuite de plateforme agréée suffit pour un petit volume.</p>

      <Encadre ton="neutre">
        <p><strong>Pour aller plus loin :</strong> <Link to="/guide/e-facturation-auto-entrepreneur" className={lien}>les obligations de l'auto-entrepreneur</Link> · <Link to="/guide/e-facturation-generale" className={lien}>la réforme en détail</Link></p>
      </Encadre>

      <Source href={SOURCE_DGFIP}>impots.gouv.fr — plateformes agréées</Source>
    </Corps>
  ),

  'e-facturation-generale': (
    <Corps>
      <H2>Pourquoi cette réforme ?</H2>
      <p>La facturation électronique permet à l'administration de rapprocher automatiquement les factures émises et reçues, ce qui rend la fraude à la TVA plus difficile. Elle doit aussi, à terme, préremplir les déclarations de TVA et accélérer les paiements entre entreprises.</p>

      <H2>Facture électronique ou PDF par e-mail ?</H2>
      <Tableau
        legende="Différences entre un PDF envoyé par e-mail et une facture électronique"
        entetes={['', 'PDF par e-mail', 'Facture électronique']}
        lignes={[
          ['Format', 'Libre', 'Structuré (Factur-X, UBL, CII)'],
          ['Lisible par un logiciel', 'Non', 'Oui'],
          ['Transmission', 'E-mail', 'Plateforme agréée'],
          ['Valable entre professionnels français', 'Jusqu\'à l\'obligation d\'émission', 'Oui'],
        ]}
      />

      <H2>Les acteurs</H2>
      <ul className="space-y-3 text-sm">
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>DGFiP</strong> — l'administration fiscale pilote la réforme et immatricule les plateformes.</li>
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>Portail public de facturation</strong> — il tient l'annuaire des entreprises et centralise les données. Depuis 2024, il n'est plus prévu qu'il serve à émettre ou recevoir gratuitement des factures.</li>
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>Plateformes agréées</strong> (« PA », ex-« PDP ») — opérateurs privés par lesquels transitent obligatoirement les factures.</li>
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>Solutions compatibles</strong> — logiciels de facturation non agréés, qui doivent être raccordés à une plateforme agréée.</li>
        <li className="p-3 rounded-xl bg-blanc-casse"><strong>Chorus Pro</strong> — reste le portail des factures adressées au secteur public.</li>
      </ul>

      <H2>Calendrier</H2>
      <Tableau legende="Calendrier de la réforme" entetes={['Date', 'Qui ?', 'Obligation']} lignes={CALENDRIER} />

      <H2>E-invoicing et e-reporting</H2>
      <p>La réforme comporte deux volets. L'<strong>e-invoicing</strong> : les factures entre entreprises établies en France passent au format électronique. L'<strong>e-reporting</strong> : les données des autres opérations (ventes aux particuliers, opérations avec l'étranger, encaissement des prestations de services) sont transmises à l'administration par la plateforme.</p>

      <H2>Sanctions</H2>
      <p>La loi prévoit une amende par facture qui n'est pas émise au format électronique et une amende par transmission de données manquante, chacune plafonnée par année civile. Les montants en vigueur sont indiqués sur impots.gouv.fr.</p>

      <Source href={SOURCE_DGFIP}>impots.gouv.fr — la facturation électronique</Source>
    </Corps>
  ),
};
