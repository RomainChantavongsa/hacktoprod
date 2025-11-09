// Dans : frontend/vite.config.js

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables depuis le .env à la racine du projet
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '')
  
  return {
  publicDir: 'statiques',
  plugins: [
    react({
      // Fast Refresh avec meilleure gestion d'erreurs
      fastRefresh: true,
      // Affiche les erreurs runtime dans l'overlay
      jsxRuntime: 'automatic',
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@models': path.resolve(__dirname, './src/types'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    // Affiche les erreurs dans le terminal ET dans le navigateur
    hmr: {
      overlay: true, // Active l'overlay d'erreurs (activé par défaut)
    }
  },
  // Configuration pour de meilleurs messages d'erreur
  build: {
    sourcemap: true, // Génère les sourcemaps pour le debug
  },
  // Expose FRONT_MODE comme VITE_NODE_ENV pour le frontend
  define: {
    'import.meta.env.VITE_NODE_ENV': JSON.stringify(env.FRONT_MODE || env.NODE_ENV || 'development')
  }
}
})