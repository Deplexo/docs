# Documentation design

The docs use Deplexo's existing logo and favicon files, the same Geist / Geist Mono / Space Grotesk font families, and a slate light theme and charcoal dark theme derived from the main application. Font files include their upstream licenses.

Astro and Starlight provide static rendering, content routing, navigation, Pagefind search, code highlighting, mobile navigation, and theme switching. The site customizes Starlight's supported Header, PageTitle, Sidebar, and Head components. It does not fork the framework or depend on application code from the main project.

## Research

Reviewed live on 2026-09-16:

- https://docs.railway.com/ — task-oriented entry points, grouped sidebar, compact persistent search.
- https://vercel.com/docs — restrained surfaces, precise typography, and useful code examples near the first action.
- https://fly.io/docs/ — prominent quickstart, language/framework guides, readable articles and in-page navigation.
- https://deplexo.com/ — source of the logo, fonts, neutral palette, and brand metadata.
- https://starlight.astro.build/guides/overriding-components/ — supported customization boundaries.

The overview prioritizes a real quickstart, working configuration, framework guides, and operations references. Articles use a bounded reading width, visible page summaries, and quieter navigation. FAQ answers expand with native HTML details controls. The acceptable-use policy is a normal indexable article.

## Brand and search metadata

Use Deplexo as the application name, author, Open Graph site name, and organization identity. Use the main site's Twitter account and favicon assets. Titles, descriptions, social previews, canonical URLs, and article breadcrumbs are specific to documentation. Do not canonicalize documentation articles to the marketing homepage. Error pages remain noindex.

## Verification

Run `npm run check`, `npm run build`, and `node scripts/check-site.mjs`. Review overview, article, FAQ, and policy pages in both themes and at desktop, tablet, and phone widths. Check keyboard navigation, search, code copying, mobile menu behavior, and reduced-motion preferences before deployment.
