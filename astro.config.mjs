import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  // Trocar pelo domínio final quando o briefing confirmar (ex.: https://cobemoftalmologia.com.br)
  site: 'https://briefing-cobem.vercel.app',
  integrations: [sitemap()],
})
