import { Link } from 'react-router-dom';
import { HYPOTHESES_COMPARATIF } from '../../lib/constants';
import type { ResultatComparatif } from '../../types';

interface Props {
  comparatif: ResultatComparatif;
  caAnnuel: number;
}

export default function ComparateurRegimes({ comparatif, caAnnuel }: Props) {
  const { ae, sasu, portage } = comparatif;

  const message =
    caAnnuel < 40000
      ? { icon: '✅', text: "À ce niveau de chiffre d'affaires, l'auto-entreprise est généralement le statut le plus simple et le plus rentable." }
      : caAnnuel < 70000
      ? { icon: '⚖️', text: "Zone intermédiaire : l'auto-entreprise reste souvent plus rentable, mais la SASU apporte une meilleure protection sociale et permet de déduire vos frais réels." }
      : { icon: '🔄', text: 'Vous approchez du plafond du régime micro : faites chiffrer un passage en société par un expert-comptable.' };

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' €';

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <h3 className="font-titre font-semibold text-bleu-marine mb-1">Comparer les statuts</h3>
      <p className="font-corps text-xs text-gris-moyen mb-6">Montants mensuels, pour le même chiffre d'affaires.</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-corps">
          <thead>
            <tr className="border-b border-gris-clair">
              <td className="py-3"></td>
              <th scope="col" className="py-3 text-center">
                <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-titre font-bold bg-bleu-marine">
                  Auto-entrepreneur
                </span>
              </th>
              <th scope="col" className="py-3 text-center text-gris-fonce font-semibold">SASU</th>
              <th scope="col" className="py-3 text-center text-gris-fonce font-semibold">Portage salarial</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gris-clair/50">
              <th scope="row" className="py-3 text-left font-normal text-gris-moyen">Revenu net après impôt</th>
              <td className="py-3 text-center font-titre font-bold text-vert-fonce">{fmt(ae.revenuNet)}</td>
              <td className="py-3 text-center text-gris-fonce">{fmt(sasu.revenuNet)}</td>
              <td className="py-3 text-center text-gris-fonce">{fmt(portage.revenuNet)}</td>
            </tr>
            <tr className="border-b border-gris-clair/50">
              <th scope="row" className="py-3 text-left font-normal text-gris-moyen">Cotisations sociales</th>
              <td className="py-3 text-center text-rouge-charges">{fmt(ae.cotisationsURSSAF)}</td>
              <td className="py-3 text-center text-rouge-charges">{fmt(sasu.charges)}</td>
              <td className="py-3 text-center text-rouge-charges">{fmt(portage.charges)}</td>
            </tr>
            <tr className="border-b border-gris-clair/50">
              <th scope="row" className="py-3 text-left font-normal text-gris-moyen">Frais de structure</th>
              <td className="py-3 text-center">{fmt(ae.cfeEstimee)} <span className="text-xs text-gris-moyen">(CFE)</span></td>
              <td className="py-3 text-center">{fmt(sasu.fraisFixes)} <span className="text-xs text-gris-moyen">(comptable)</span></td>
              <td className="py-3 text-center">{fmt(portage.fraisPortage)} <span className="text-xs text-gris-moyen">(gestion)</span></td>
            </tr>
            <tr className="border-b border-gris-clair/50">
              <th scope="row" className="py-3 text-left font-normal text-gris-moyen">Impôt sur le revenu</th>
              <td className="py-3 text-center">{fmt(ae.impotEstime)}</td>
              <td className="py-3 text-center">{fmt(sasu.impot)}</td>
              <td className="py-3 text-center">{fmt(portage.impot)}</td>
            </tr>
            <tr className="border-b border-gris-clair/50">
              <th scope="row" className="py-3 text-left font-normal text-gris-moyen">Complexité</th>
              <td className="py-3 text-center">Simple</td>
              <td className="py-3 text-center">Élevée</td>
              <td className="py-3 text-center">Moyenne</td>
            </tr>
            <tr>
              <th scope="row" className="py-3 text-left font-normal text-gris-moyen">Protection sociale</th>
              <td className="py-3 text-center">Basique, pas de chômage</td>
              <td className="py-3 text-center">Assimilé salarié, pas de chômage</td>
              <td className="py-3 text-center">Salarié, chômage inclus</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className="mt-6 p-4 rounded-xl font-corps text-sm"
        style={{ background: 'rgba(27, 45, 107, 0.05)', border: '1px solid rgba(27, 45, 107, 0.15)' }}
      >
        <span className="mr-2" aria-hidden="true">{message.icon}</span>
        <span className="text-bleu-marine font-medium">{message.text}</span>
      </div>

      <p className="mt-4 font-corps text-xs text-gris-moyen leading-relaxed">
        Ordres de grandeur. SASU : {HYPOTHESES_COMPARATIF.sasu_frais_fixes_annuels.toLocaleString('fr-FR')} € de frais fixes par an, tout le reste versé en salaire au président (net ≈ {Math.round(HYPOTHESES_COMPARATIF.sasu_ratio_net_sur_cout * 100)} % du coût total), sans dividendes ni frais déductibles. Portage : {Math.round(HYPOTHESES_COMPARATIF.portage_frais_gestion * 100)} % de frais de gestion.{' '}
        <Link to="/comparateur/ae-vs-sasu" className="underline text-bleu-marine">Voir le comparatif détaillé</Link>
      </p>
    </div>
  );
}
