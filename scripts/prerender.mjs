// Pré-rendu statique : génère un fichier HTML par page (balises SEO incluses),
// ainsi que sitemap.xml, robots.txt et 404.html. Lancé par `npm run build`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(racine, 'dist');
const distSsr = join(racine, 'dist-ssr');

const { render, ROUTES_STATIQUES, SITE_URL } = await import(
  pathToFileURL(join(distSsr, 'entry-server.js')).href
);

const gabarit = await readFile(join(dist, 'index.html'), 'utf8');

function genererPage(url) {
  const { html, head } = render(url);
  // Fonctions de remplacement : évite l'interprétation des « $ » du contenu
  return gabarit.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html);
}

async function ecrire(cheminRelatif, contenu) {
  const cible = join(dist, cheminRelatif);
  await mkdir(dirname(cible), { recursive: true });
  await writeFile(cible, contenu, 'utf8');
}

// Vercel sert /guide depuis guide.html grâce à `cleanUrls` (vercel.json)
for (const route of ROUTES_STATIQUES) {
  const fichier = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  await ecrire(fichier, genererPage(route.path));
}

// Servie par Vercel avec un vrai statut 404 pour toute URL inconnue
await ecrire('404.html', genererPage('/page-introuvable'));

const aujourdhui = new Date().toISOString().slice(0, 10);
const urls = ROUTES_STATIQUES.filter((route) => !route.horsSitemap).map(
  (route) =>
    `  <url><loc>${SITE_URL}${route.path}</loc>` +
    `<lastmod>${route.lastmod ?? aujourdhui}</lastmod>` +
    `<changefreq>${route.changefreq}</changefreq>` +
    `<priority>${route.priority.toFixed(1)}</priority></url>`
).join('\n');

await ecrire(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
await ecrire('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

await rm(distSsr, { recursive: true, force: true });

console.log(`Pré-rendu : ${ROUTES_STATIQUES.length} pages + 404, sitemap et robots pour ${SITE_URL}`);
