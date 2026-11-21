import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Le rendu serveur (pré-rendu des pages au build) embarque toutes les
  // dépendances pour éviter les soucis d'interopérabilité CJS/ESM sous Node.
  ssr: {
    noExternal: true,
  },
});
