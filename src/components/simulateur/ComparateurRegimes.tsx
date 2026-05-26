import type { ResultatComparatif } from '../../types';

interface Props {
  comparatif: ResultatComparatif;
  caAnnuel: number;
}

export default function ComparateurRegimes({ comparatif, caAnnuel }: Props) {
  const { ae, sasu, portage } = comparatif;

  const message =
    caAnnuel < 30000
      ? { icon: '✅', text: "L'auto-entreprise semble adaptée à votre situation." }
      : caAnnuel < 70000
      ? { icon: '⚠️', text: 'À partir de 50 000 €/an, la SASU devient souvent plus avantageuse.' }
      : { icon: '🔄', text: 'À ce niveau de CA, une SASU vous ferait probablement économiser des charges.' };

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' €';

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <h3 className="font-titre font-semibold text-bleu-marine mb-6">Comparer les statuts</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-corps">
          <thead>
            <tr className="border-b border-gris-clair">
              <th className="text-left py-3 text-gris-moyen font-medium"></th>
              <th className="py-3 text-center">
                <span
                  className="inline-block px-3 py-1 rounded-full text-white text-xs font-titre font-bold"
                  style={{ background: '#1B2D6B' }}
                >
                  Auto-entrepreneur
                </span>
              </th>
              <th className="py-3 text-center text-gris-fonce font-semibold">SASU</th>
              <th className="py-3 text-center text-gris-fonce font-semibold">Portage salarial</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gris-clair/50">
              <td className="py-3 text-gris-moyen">Revenu net</td>
              <td className="py-3 text-center font-titre font-bold text-vert-menthe">{fmt(ae.revenuNet)}</td>
              <td className="py-3 text-center text-gris-fonce">{fmt(sasu.revenuNet)}</td>
              <td className="py-3 text-center text-gris-fonce">{fmt(portage.revenuNet)}</td>
            </tr>
            <tr className="border-b border-gris-clair/50">
              <td className="py-3 text-gris-moyen">Charges</td>
              <td className="py-3 text-center text-rouge-charges">{fmt(ae.cotisationsURSSAF)}</td>
              <td className="py-3 text-center text-rouge-charges">{fmt(sasu.charges)}</td>
              <td className="py-3 text-center text-rouge-charges">{fmt(portage.fraisPortage)}</td>
            </tr>
            <tr className="border-b border-gris-clair/50">
              <td className="py-3 text-gris-moyen">Complexité</td>
              <td className="py-3 text-center">⭐ Simple</td>
              <td className="py-3 text-center">⭐⭐⭐ Complexe</td>
              <td className="py-3 text-center">⭐⭐ Moyen</td>
            </tr>
            <tr className="border-b border-gris-clair/50">
              <td className="py-3 text-gris-moyen">Protection sociale</td>
              <td className="py-3 text-center">Basique</td>
              <td className="py-3 text-center">Assimilé salarié</td>
              <td className="py-3 text-center">Salarié</td>
            </tr>
            <tr>
              <td className="py-3 text-gris-moyen">Recommandé si</td>
              <td className="py-3 text-center text-xs">CA &lt; seuil</td>
              <td className="py-3 text-center text-xs">CA &gt; 70k€/an</td>
              <td className="py-3 text-center text-xs">Mission courte</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className="mt-6 p-4 rounded-xl font-corps text-sm"
        style={{ background: 'rgba(27, 45, 107, 0.05)', border: '1px solid rgba(27, 45, 107, 0.15)' }}
      >
        <span className="mr-2">{message.icon}</span>
        <span className="text-bleu-marine font-medium">{message.text}</span>
      </div>
    </div>
  );
}
