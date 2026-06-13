import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://DeskMate.vercel.app',
  output: 'static',
  integrations: [sitemap()],
});
