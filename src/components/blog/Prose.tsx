import type { ReactNode } from 'react';

/** Briques de mise en forme partagées par les articles du guide. */

export function Corps({ children }: { children: ReactNode }) {
  return <div className="font-corps text-gris-fonce leading-relaxed space-y-6">{children}</div>;
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="font-titre font-bold text-bleu-marine text-2xl">{children}</h2>;
}

interface TableauProps {
  entetes: string[];
  lignes: ReactNode[][];
  /** Légende lue par les lecteurs d'écran. */
  legende: string;
}

export function Tableau({ entetes, lignes, legende }: TableauProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{legende}</caption>
        <thead>
          <tr className="bg-bleu-marine text-white">
            {entetes.map((entete, i) => (
              <th key={entete} scope="col" className={`p-3 ${i === 0 ? 'text-left' : 'text-right'}`}>{entete}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, i) => (
            <tr key={i} className={`border-b border-gris-clair ${i % 2 === 1 ? 'bg-blanc-casse' : ''}`}>
              {ligne.map((cellule, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="p-3 text-left font-normal">{cellule}</th>
                ) : (
                  <td key={j} className="p-3 text-right font-semibold">{cellule}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TonEncadre = 'info' | 'attention' | 'neutre';

const STYLES_ENCADRE: Record<TonEncadre, { background: string; border: string }> = {
  info: { background: 'rgba(46,196,182,0.08)', border: '1px solid rgba(46,196,182,0.3)' },
  attention: { background: '#FFF3E0', border: '1px solid #FF9F1C' },
  neutre: { background: '#F8F9FA', border: '1px solid #E9ECEF' },
};

export function Encadre({ ton = 'info', children }: { ton?: TonEncadre; children: ReactNode }) {
  return (
    <div className="p-4 rounded-xl text-sm space-y-2" style={STYLES_ENCADRE[ton]}>
      {children}
    </div>
  );
}

export function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="p-4 rounded-xl text-sm" style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}>
      <strong>Source officielle :</strong>{' '}
      <a href={href} className="text-bleu-marine underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </div>
  );
}
