import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SimulateurBNC from './pages/SimulateurBNC';
import SimulateurBICServices from './pages/SimulateurBICServices';
import SimulateurBICVente from './pages/SimulateurBICVente';
import ComparateurAEvsSASU from './pages/ComparateurAEvsSASU';
import BlogIndex from './pages/blog/BlogIndex';
import ArticlePage from './pages/blog/ArticlePage';
import MentionsLegales from './pages/MentionsLegales';
import CGV from './pages/CGV';
import NotFound from './pages/NotFound';
import { useSimulateurStore } from './store/simulateurStore';

export default function App() {
  // Restaure la dernière simulation après le montage (voir skipHydration dans le store)
  useEffect(() => {
    void useSimulateurStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-blanc-casse">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:text-bleu-marine focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-card"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulateur-bnc" element={<SimulateurBNC />} />
          <Route path="/simulateur-bic-services" element={<SimulateurBICServices />} />
          <Route path="/simulateur-bic-vente" element={<SimulateurBICVente />} />
          <Route path="/comparateur/ae-vs-sasu" element={<ComparateurAEvsSASU />} />
          <Route path="/guide" element={<BlogIndex />} />
          <Route path="/guide/:slug" element={<ArticlePage />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}
