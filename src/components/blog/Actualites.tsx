import { useEffect, useState } from 'react';

interface Actualite {
  titre: string;
  lien: string;
  date: string | null;
  source: string;
  extrait: string;
}

type Etat =
  | { statut: 'chargement' }
  | { statut: 'pret'; actualites: Actualite[] }
  | { statut: 'indisponible' };

function estActualite(valeur: unknown): valeur is Actualite {
  if (typeof valeur !== 'object' || valeur === null) return false;
  const v = valeur as Record<string, unknown>;
  return (
    typeof v.titre === 'string' &&
    typeof v.lien === 'string' &&
    v.lien.startsWith('https://') &&
    typeof v.source === 'string' &&
    typeof v.extrait === 'string' &&
    (v.date === null || typeof v.date === 'string')
  );
}

function formaterDate(date: string | null): string | null {
  if (!date) return null;
  const jour = new Date(`${date}T12:00:00`);
  return Number.isNaN(jour.getTime())
    ? null
    : jour.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Fil d'actualités officielles, agrégé automatiquement par /api/actualites
 * (flux RSS de Service-Public, economie.gouv.fr et du BOFiP). Se met à jour
 * tout seul, sans redéploiement du site.
 */
export default function Actualites() {
  const [etat, setEtat] = useState<Etat>({ statut: 'chargement' });

  useEffect(() => {
    const controleur = new AbortController();

    fetch('/api/actualites', { signal: controleur.signal })
      .then((reponse) => (reponse.ok ? reponse.json() : Promise.reject(new Error('indisponible'))))
      .then((corps: { actualites?: unknown }) => {
        const actualites = Array.isArray(corps.actualites) ? corps.actualites.filter(estActualite) : [];
        setEtat(actualites.length > 0 ? { statut: 'pret', actualites } : { statut: 'indisponible' });
      })
      .catch(() => {
        if (!controleur.signal.aborted) setEtat({ statut: 'indisponible' });
      });

    return () => controleur.abort();
  }, []);

  // Flux indisponibles : la section disparaît plutôt que d'afficher une erreur
  if (etat.statut === 'indisponible') return null;

  return (
    <section className="mt-16" aria-labelledby="titre-actualites">
      <h2 id="titre-actualites" className="font-titre font-bold text-bleu-marine text-2xl mb-2">
        Actualités officielles
      </h2>
      <p className="font-corps text-sm text-gris-moyen mb-6 max-w-2xl">
        Les dernières publications de l'administration qui concernent les micro-entrepreneurs. Liste mise à jour automatiquement ; chaque lien ouvre le site officiel.
      </p>

      {etat.statut === 'chargement' ? (
        <p className="font-corps text-sm text-gris-moyen" role="status">Chargement des actualités…</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {etat.actualites.map((actualite) => (
            <li key={actualite.lien} className="bg-white rounded-card shadow-card p-5">
              <p className="font-corps text-xs text-gris-moyen mb-2">
                <span className="font-semibold text-bleu-marine">{actualite.source}</span>
                {formaterDate(actualite.date) && <> · {formaterDate(actualite.date)}</>}
              </p>
              <a
                href={actualite.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="font-titre font-bold text-bleu-marine hover:text-bleu-moyen hover:underline leading-snug"
              >
                {actualite.titre}
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
              {actualite.extrait && (
                <p className="font-corps text-sm text-gris-fonce leading-relaxed mt-2">{actualite.extrait}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
