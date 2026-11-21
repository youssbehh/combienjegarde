// Fonction serverless Vercel : agrège automatiquement les actualités des
// sites officiels qui concernent les micro-entrepreneurs.
//
// Aucun déploiement n'est nécessaire pour publier une nouveauté : la réponse
// est mise en cache une heure par le CDN de Vercel, puis régénérée à la
// demande à partir des flux RSS ci-dessous.
//
// Ce fichier est volontairement autonome (aucun import relatif).

export interface Actualite {
  titre: string;
  lien: string;
  /** Date ISO (AAAA-MM-JJ), ou null si le flux ne la fournit pas. */
  date: string | null;
  source: string;
  extrait: string;
}

interface Flux {
  source: string;
  url: string;
}

interface Requete {
  method?: string;
}

interface Reponse {
  status: (code: number) => Reponse;
  setHeader: (nom: string, valeur: string) => void;
  json: (corps: unknown) => void;
}

export const FLUX: Flux[] = [
  { source: 'Service-Public Entreprendre', url: 'https://www.service-public.gouv.fr/abonnements/rss/actu-actu-pro.rss' },
  { source: 'economie.gouv.fr', url: 'https://www.economie.gouv.fr/rss/toutesactualites' },
  { source: 'BOFiP-Impôts', url: 'https://bofip.impots.gouv.fr/bofip/ext/rss.xml?actualites=1&maxR=30&maxJ=60' },
];

/** Hôtes vers lesquels un lien d'actualité a le droit de pointer. */
const HOTES_AUTORISES = /(^|\.)(service-public\.gouv\.fr|service-public\.fr|economie\.gouv\.fr|impots\.gouv\.fr)$/;

/** Sujets qui intéressent un micro-entrepreneur. */
const MOTS_CLES =
  /micro-?entrepr|auto-?entrepr|travailleurs? indépendants?|entrepreneurs? individuels?|entreprise individuelle|urssaf|cotisations? sociales?|factur(e|ation)s? électroniques?|franchise en base|franchise de TVA|cotisation foncière|\bCFE\b|versement libératoire|\bACRE\b|impôt sur le revenu|régime micro|micro-(BIC|BNC)|création d'entreprise|loi de finances/i;

const NOMBRE_MAX = 12;
const DELAI_MAX_MS = 6000;

const ENTITES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘',
  laquo: '«', raquo: '»', eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', ccedil: 'ç',
  ocirc: 'ô', ucirc: 'û', icirc: 'î', euro: '€', hellip: '…', ndash: '–', mdash: '—',
};

function decoderEntites(texte: string): string {
  return texte.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (tout, code: string) => {
    if (code[0] === '#') {
      const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(point) && point > 0 && point < 0x110000 ? String.fromCodePoint(point) : '';
    }
    return ENTITES[code.toLowerCase()] ?? tout;
  });
}

/** Texte brut : CDATA retiré, entités décodées (deux passes), balises supprimées. */
export function texteBrut(xml: string): string {
  const sansCdata = xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  const decode = decoderEntites(decoderEntites(sansCdata));
  return decode.replace(/<[^>]*>/g, ' ').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
}

function balise(bloc: string, nom: string): string {
  const trouve = bloc.match(new RegExp(`<${nom}(?:\\s[^>]*)?>([\\s\\S]*?)</${nom}>`, 'i'));
  return trouve ? trouve[1] : '';
}

const MOIS_RFC822 = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Lit le jour de publication tel qu'il est écrit dans le flux (sans conversion
 * de fuseau, qui ferait reculer d'un jour les dates à minuit heure de Paris).
 */
function versDateIso(valeur: string): string | null {
  const texte = valeur.trim();

  const iso = texte.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const francaise = texte.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (francaise) return `${francaise[3]}-${francaise[2]}-${francaise[1]}`;

  const rfc822 = texte.match(/(\d{1,2}) ([A-Za-z]{3}) (\d{4})/);
  if (rfc822) {
    const mois = MOIS_RFC822.indexOf(rfc822[2].toLowerCase());
    if (mois >= 0) return `${rfc822[3]}-${String(mois + 1).padStart(2, '0')}-${rfc822[1].padStart(2, '0')}`;
  }

  return null;
}

function couper(texte: string, longueur: number): string {
  if (texte.length <= longueur) return texte;
  const coupe = texte.slice(0, longueur);
  return `${coupe.slice(0, Math.max(coupe.lastIndexOf(' '), longueur - 30))}…`;
}

/** Extrait les articles d'un flux RSS 2.0. */
export function analyserFlux(xml: string, source: string): Actualite[] {
  const blocs = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const actualites: Actualite[] = [];

  for (const bloc of blocs) {
    const titre = texteBrut(balise(bloc, 'title'));
    const lienBrut = texteBrut(balise(bloc, 'link'));
    const description = texteBrut(balise(bloc, 'description'));

    let lien: URL;
    try {
      lien = new URL(lienBrut);
    } catch {
      continue;
    }
    if (!titre || lien.protocol !== 'https:' || !HOTES_AUTORISES.test(lien.hostname)) continue;

    const dateBrute = balise(bloc, 'pubDate') || balise(bloc, 'dc:date');
    const date = versDateIso(dateBrute) ?? versDateIso(description.match(/publié le (\d{2}\/\d{2}\/\d{4})/)?.[1] ?? '');

    actualites.push({
      titre: couper(titre, 160),
      lien: lien.href,
      date,
      source,
      // Le BOFiP répète le titre dans la description : inutile de l'afficher deux fois
      extrait: description.startsWith(titre.slice(0, 40)) ? '' : couper(description, 180),
    });
  }

  return actualites;
}

export function estPertinente(actualite: Actualite): boolean {
  return MOTS_CLES.test(`${actualite.titre} ${actualite.extrait}`);
}

/** Filtre, dédoublonne et trie par date décroissante. */
export function selectionner(actualites: Actualite[], maximum = NOMBRE_MAX): Actualite[] {
  const vus = new Set<string>();
  return actualites
    .filter(estPertinente)
    .filter((actualite) => {
      const cle = actualite.lien.split('?')[0];
      if (vus.has(cle)) return false;
      vus.add(cle);
      return true;
    })
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, maximum);
}

async function chargerFlux(flux: Flux): Promise<Actualite[]> {
  const reponse = await fetch(flux.url, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml', 'User-Agent': 'Mozilla/5.0 (compatible; agregateur-actualites)' },
    signal: AbortSignal.timeout(DELAI_MAX_MS),
  });
  if (!reponse.ok) throw new Error(`${flux.source} : HTTP ${reponse.status}`);
  return analyserFlux(await reponse.text(), flux.source);
}

export default async function handler(req: Requete, res: Reponse) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ actualites: [] });
    return;
  }

  // Un flux en panne n'empêche pas d'afficher les autres
  const resultats = await Promise.allSettled(FLUX.map(chargerFlux));
  const toutes = resultats.flatMap((resultat) => (resultat.status === 'fulfilled' ? resultat.value : []));
  const actualites = selectionner(toutes);

  // Cache CDN : 1 h, puis réponse périmée servie pendant la régénération (jusqu'à 24 h).
  // Si tous les flux sont en panne, on ne garde la réponse vide que 5 minutes.
  res.setHeader(
    'Cache-Control',
    actualites.length > 0
      ? 'public, s-maxage=3600, stale-while-revalidate=86400'
      : 'public, s-maxage=300'
  );
  res.status(200).json({ actualites, misAJour: new Date().toISOString() });
}
