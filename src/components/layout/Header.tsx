import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-titre font-bold text-xl text-bleu-marine">
            CombienJeGarde<span className="text-vert-fonce">.fr</span>
          </span>
          <span className="hidden md:block text-sm text-gris-moyen font-corps">
            Votre CA en brut. Votre vie en net.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `font-corps font-medium text-sm transition-colors ${isActive ? 'text-bleu-marine' : 'text-gris-fonce hover:text-bleu-marine'}`
            }
          >
            Simulateur
          </NavLink>
          <NavLink
            to="/comparateur/ae-vs-sasu"
            className={({ isActive }) =>
              `font-corps font-medium text-sm transition-colors ${isActive ? 'text-bleu-marine' : 'text-gris-fonce hover:text-bleu-marine'}`
            }
          >
            Comparer les statuts
          </NavLink>
          <NavLink
            to="/guide"
            className={({ isActive }) =>
              `font-corps font-medium text-sm transition-colors ${isActive ? 'text-bleu-marine' : 'text-gris-fonce hover:text-bleu-marine'}`
            }
          >
            Guide &amp; Articles
          </NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
        >
          <span className={`block w-6 h-0.5 bg-bleu-marine transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-bleu-marine transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-bleu-marine transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav id="menu-mobile" aria-label="Navigation principale" className="md:hidden bg-white border-t border-gris-clair px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className="font-corps font-medium text-gris-fonce hover:text-bleu-marine">
            Simulateur
          </NavLink>
          <NavLink to="/comparateur/ae-vs-sasu" onClick={() => setMenuOpen(false)} className="font-corps font-medium text-gris-fonce hover:text-bleu-marine">
            Comparer les statuts
          </NavLink>
          <NavLink to="/guide" onClick={() => setMenuOpen(false)} className="font-corps font-medium text-gris-fonce hover:text-bleu-marine">
            Guide &amp; Articles
          </NavLink>
        </nav>
      )}
    </header>
  );
}
