import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SimulateurBNC from './pages/SimulateurBNC';
import SimulateurBICServices from './pages/SimulateurBICServices';
import SimulateurBICVente from './pages/SimulateurBICVente';
import ComparateurAEvsSASU from './pages/ComparateurAEvsSASU';
import BlogIndex from './pages/blog/BlogIndex';
import ArticlePage from './pages/blog/ArticlePage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col" style={{ background: '#F8F9FA' }}>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulateur-bnc" element={<SimulateurBNC />} />
            <Route path="/simulateur-bic-services" element={<SimulateurBICServices />} />
            <Route path="/simulateur-bic-vente" element={<SimulateurBICVente />} />
            <Route path="/comparateur/ae-vs-sasu" element={<ComparateurAEvsSASU />} />
            <Route path="/guide" element={<BlogIndex />} />
            <Route path="/guide/:slug" element={<ArticlePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
