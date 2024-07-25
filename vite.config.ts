import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const url = process.env.VITE_SERVER_URL;

export default defineConfig({
	plugins: [reactRefresh()],
	define: {
    'import.meta.env': process.env,
  },
  server: {
    proxy: {
      '/api': `${url}`,
      '/auth': `${url}`
    }
  }
});
