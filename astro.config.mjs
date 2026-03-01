import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
// sitemap убираем отсюда

export default defineConfig({
  site: 'https://devops-blog.pages.dev',
  integrations: [
    mdx(),
    // sitemap() — убираем
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
