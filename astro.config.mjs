import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  site: 'https://docs.deplexo.com',
  trailingSlash: 'always',
  integrations: [starlight({
    title: 'Deplexo Docs',
    components: {
      Head: './src/components/Head.astro',
      Header: './src/components/Header.astro',
      PageTitle: './src/components/PageTitle.astro',
      Sidebar: './src/components/Sidebar.astro',
    },
    description: 'Deploy and operate websites, APIs, and bots on Deplexo. Guides, configuration reference, and troubleshooting.',
    favicon: '/favicon.ico',
    social: [{ icon: 'github', label: 'Deplexo on GitHub', href: 'https://github.com/Deplexo' }],
    editLink: { baseUrl: 'https://github.com/Deplexo/docs/edit/main/' },
    customCss: ['./src/styles/custom.css'],
    expressiveCode: { themes: ['github-dark', 'github-light'], styleOverrides: { borderRadius: '6px', codeFontFamily: 'Geist Mono, monospace' } },
    sidebar: [
      { label: 'Getting started', items: [{ label: 'Overview', slug: '' }, { label: 'Your first deployment', slug: 'getting-started/quickstart' }, { label: 'Templates', slug: 'getting-started/templates' }] },
      { label: 'Build and deploy', items: [{ label: 'Docker and builds', slug: 'guides/docker' }, { label: 'Next.js', slug: 'guides/nextjs' }, { label: 'Telegram bots', slug: 'guides/telegram-bot' }, { label: 'Discord bots', slug: 'guides/discord-bot' }] },
      { label: 'Configuration', items: [{ label: 'Environment variables', slug: 'guides/environment' }, { label: 'Custom domains', slug: 'guides/domains' }] },
      { label: 'Operations', items: [{ label: 'Deployments', slug: 'operations/deployments' }, { label: 'Logs', slug: 'operations/logs' }, { label: 'Storage', slug: 'operations/storage' }, { label: 'Troubleshooting', slug: 'operations/troubleshooting' }] },
      { label: 'Reference', items: [{ label: 'deplexo.yaml', slug: 'reference/configuration' }] },
      { label: 'Help and policies', items: [{ label: 'FAQs', slug: 'getting-started/faq' }, { label: 'Acceptable use', slug: 'reference/acceptable-use' }] },
    ],
  })],
});
