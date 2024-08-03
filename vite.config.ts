import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const url = process.env.VITE_SERVER_URL;
const key = process.env.SSL_KEY_PATH;
const cert = process.env.SSL_CERT_PATH;

export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    'import.meta.env': process.env,
  },
  server: {
    proxy: {
      '/api': {
        target: url,
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: url,
        changeOrigin: true,
        secure: false,
      },
    },
    https: {
      key: fs.readFileSync(path.resolve(__dirname, key || '')),
      cert: fs.readFileSync(path.resolve(__dirname, cert || '')),
    },
    headers: {
      'Permissions-Policy': 'compute-pressure=()',
    },
  }
});
