import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './',
    plugins: [react()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            let extType = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            } else if (/woff|woff2/.test(extType)) {
              extType = 'fonts';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      sourcemap: true,
      assetsDir: 'assets',
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      hmr: {
        overlay: true,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
