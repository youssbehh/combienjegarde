import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-bleu-marine text-white mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1 */}
        <div>
          <p className="font-titre font-bold text-lg mb-3">
            CombienJeGarde<span className="text-vert-menthe">.fr</span>
          </p>
          <p className="font-corps text-sm text-blue-200 leading-relaxed mb-4">
            Le simulateur de revenu net pour auto-entrepreneurs français. Simple, rapide, basé sur les taux officiels 2025.
          </p>
          <p className="font-corps text-xs text-blue-300">
            Outil d'estimation — non contractuel. Consultez un expert-comptable pour votre situation personnelle.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h3 className="font-titre font-semibold text-sm uppercase tracking-wider mb-4 text-blue-200">Simulateurs</h3>
          <ul className="flex flex-col gap-2">
            <li><Link to="/" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">Simulateur général</Link></li>
            <li><Link to="/simulateur-bnc" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">Simulateur BNC</Link></li>
            <li><Link to="/simulateur-bic-services" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">Simulateur BIC Services</Link></li>
            <li><Link to="/simulateur-bic-vente" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">Simulateur BIC Vente</Link></li>
            <li><Link to="/comparateur/ae-vs-sasu" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">AE vs SASU</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h3 className="font-titre font-semibold text-sm uppercase tracking-wider mb-4 text-blue-200">Articles populaires</h3>
          <ul className="flex flex-col gap-2">
            <li><Link to="/guide/cotisations-urssaf-ae" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">Cotisations URSSAF 2025</Link></li>
            <li><Link to="/guide/impot-auto-entrepreneur" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">Impôts auto-entrepreneur</Link></li>
            <li><Link to="/guide/tva-auto-entrepreneur" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">TVA et franchise</Link></li>
            <li><Link to="/guide/prelevement-liberatoire" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">Prélèvement libératoire</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h3 className="font-titre font-semibold text-sm uppercase tracking-wider mb-4 text-blue-200">Sources officielles</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="https://www.autoentrepreneur.urssaf.fr" target="_blank" rel="noopener noreferrer" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">
                autoentrepreneur.urssaf.fr
              </a>
            </li>
            <li>
              <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">
                impots.gouv.fr
              </a>
            </li>
            <li>
              <a href="https://www.service-public.fr" target="_blank" rel="noopener noreferrer" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">
                service-public.fr
              </a>
            </li>
            <li>
              <a href="https://www.legifrance.gouv.fr" target="_blank" rel="noopener noreferrer" className="font-corps text-sm text-blue-100 hover:text-vert-menthe transition-colors">
                legifrance.gouv.fr
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-corps text-xs text-blue-300">
            © 2025 CombienJeGarde.fr — Données basées sur les taux officiels 2025, à titre indicatif uniquement.
          </p>
          <div className="flex gap-4">
            <Link to="/mentions-legales" className="font-corps text-xs text-blue-300 hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
