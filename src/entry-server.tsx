import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';
import App from './App';

export { ROUTES_STATIQUES } from './routes';
export { SITE_URL } from './lib/site';

/** Rend une page en HTML statique (utilisé par scripts/prerender.mjs au build). */
export function render(url: string): { html: string; head: string } {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  );

  const { helmet } = helmetContext;
  const head = helmet
    ? [helmet.title, helmet.meta, helmet.link, helmet.script].map((tag) => tag.toString()).join('\n    ')
    : '';

  return { html, head };
}
