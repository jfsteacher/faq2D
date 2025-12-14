import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/faq/',   // https://jfsteacher.github.io/faq/

    exclude: ['lucide-react'],
  },
});
