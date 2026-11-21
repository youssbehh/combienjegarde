import { describe, it, expect } from 'vitest';
import { analyserFlux, selectionner, texteBrut } from '../../api/actualites';

const FLUX_EXEMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<item>
  <title>Micro-entrepreneur : les plafonds de chiffre d&#039;affaires évoluent</title>
  <description>&lt;p&gt;Les seuils du régime &lt;b&gt;micro&lt;/b&gt; sont revalorisés.&lt;/p&gt;</description>
  <link>https://entreprendre.service-public.gouv.fr/actualites/A1?xtor=RSS-112</link>
  <dc:date xmlns:dc="http://purl.org/dc/elements/1.1/">2026-11-20T00:00:00+01:00</dc:date>
</item>
<item>
  <title><![CDATA[Aide exceptionnelle pour les exploitations agricoles]]></title>
  <description>Sans rapport avec le sujet.</description>
  <link>https://entreprendre.service-public.gouv.fr/actualites/A2</link>
  <pubDate>Wed, 18 Nov 2026 09:00:00 +0100</pubDate>
</item>
<item>
  <title>TVA - Franchise en base : précisions</title>
  <description>TVA - Franchise en base : précisions (identifiant juridique ACTU-2026-00001; publié le 19/11/2026)</description>
  <link>https://bofip.impots.gouv.fr/bofip/1-PGP.html/ACTU-2026-00001</link>
</item>
<item>
  <title>URSSAF : lien piégé</title>
  <description>Lien vers un site tiers.</description>
  <link>https://exemple-malveillant.test/urssaf</link>
</item>
<item>
  <title>URSSAF : lien javascript</title>
  <link>javascript:alert(1)</link>
</item>
</channel></rss>`;

describe('analyserFlux', () => {
  const actualites = analyserFlux(FLUX_EXEMPLE, 'Test');

  it('ne garde que les liens https vers les sites officiels', () => {
    expect(actualites.map((a) => a.lien)).toEqual([
      'https://entreprendre.service-public.gouv.fr/actualites/A1?xtor=RSS-112',
      'https://entreprendre.service-public.gouv.fr/actualites/A2',
      'https://bofip.impots.gouv.fr/bofip/1-PGP.html/ACTU-2026-00001',
    ]);
  });

  it('décode les entités et retire le HTML', () => {
    expect(actualites[0].titre).toBe("Micro-entrepreneur : les plafonds de chiffre d'affaires évoluent");
    expect(actualites[0].extrait).toBe('Les seuils du régime micro sont revalorisés.');
  });

  it('lit les dates dc:date, pubDate et « publié le »', () => {
    expect(actualites[0].date).toBe('2026-11-20'); // minuit heure de Paris : pas de recul d'un jour
    expect(actualites[1].date).toBe('2026-11-18');
    expect(actualites[2].date).toBe('2026-11-19');
  });

  it('n’affiche pas un extrait qui répète le titre', () => {
    expect(actualites[2].extrait).toBe('');
  });
});

describe('selectionner', () => {
  it('filtre par mots-clés et trie par date décroissante', () => {
    const selection = selectionner(analyserFlux(FLUX_EXEMPLE, 'Test'));
    expect(selection.map((a) => a.titre)).toEqual([
      "Micro-entrepreneur : les plafonds de chiffre d'affaires évoluent",
      'TVA - Franchise en base : précisions',
    ]);
  });

  it('dédoublonne et respecte le maximum', () => {
    const doublons = [...analyserFlux(FLUX_EXEMPLE, 'A'), ...analyserFlux(FLUX_EXEMPLE, 'B')];
    expect(selectionner(doublons)).toHaveLength(2);
    expect(selectionner(doublons, 1)).toHaveLength(1);
  });
});

describe('texteBrut', () => {
  it('neutralise le balisage, même doublement encodé', () => {
    expect(texteBrut('&amp;lt;script&amp;gt;alert(1)&amp;lt;/script&amp;gt; ok')).toBe('alert(1) ok');
  });
});
