import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';
// import viteTsconfigPaths from 'vite-tsconfig-paths';
// import svgrPlugin from 'vite-plugin-svgr';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
    '/api': 'http://127.0.0.1:5000',
      // changeOrigin: true,
      // rewrite: (path) => path.replace(/^\/api/, '')
    },
    port: 3000,
    hmr: {
      websocketPort: 3000,
    },
    watch: {
      usePolling: true,
    },
  },
})
