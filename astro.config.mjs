import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  site: 'https://docs.deplexo.com',
  trailingSlash: 'always',
  integrations: [starlight({
    title: 'Deplexo Docs',
    components: { Head: './src/components/Head.astro' },
    description: 'Deploy and operate websites, APIs, and background bots on Deplexo. Working examples, configuration reference, and troubleshooting guides.',
    logo: { src: './src/assets/logo.svg', replacesTitle: false },
    favicon: '/favicon.svg',
    social: [{ icon: 'github', label: 'Deplexo examples on GitHub', href: 'https://github.com/Deplexo/examples' }],
    editLink: { baseUrl: 'https://github.com/Deplexo/docs/edit/main/' },
    customCss: ['./src/styles/custom.css'],
    sidebar: [
      { label: 'Start here', items: [{ label: 'Overview', slug: '' }, { label: 'Your first deployment', slug: 'getting-started/quickstart' }, { label: 'Use a template', slug: 'getting-started/templates' }] },
      { label: 'Build and deploy', items: [{ autogenerate: { directory: 'guides' } }] },
      { label: 'Operate your app', items: [{ autogenerate: { directory: 'operations' } }] },
      { label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
      { label: 'Browse templates ↗', link: 'https://github.com/Deplexo/examples' },
      { label: 'Open dashboard ↗', link: 'https://deplexo.com/apps' },
    ],
    head: [{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Deplexo Docs' } }],
  })],
});
