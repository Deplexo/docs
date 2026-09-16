# Deplexo public documentation

Customer documentation for https://docs.deplexo.com. This repository is independent of the examples collection and the private engineering handbook.

## Develop

Use Node.js 22.12 or newer. Run `npm ci`, then `npm run dev`. Content lives in `src/content/docs`. Run `npm run check` and `npm run build` before proposing a change.

## Publish

For the standalone Docker host and Cloudflare Tunnel setup, see [Hosting the docs](deploy/README.md). `bash scripts/deploy.sh` builds a committed revision and starts the health-checked service.

Build static output in `dist`, or deploy the included Dockerfile. Connect docs.deplexo.com as a custom domain. The site URL is intentionally fixed so canonical tags and sitemaps remain correct. The included legacy-redirects.json records the intended permanent redirects from deplexo.com/docs. Apply these redirects in the edge/router configuration when the new site launches; this repository does not modify the control plane. Submit sitemap-index.xml in Google Search Console after deployment.

Audit the actual existing URLs before applying the redirect map, including trailing-slash variants. Use direct HTTP 301 or 308 redirects to the matching article and retain them for at least one year. Update navigation and internal links to the new URLs at cutover. Verify the domain in Search Console, submit the new sitemap, and monitor indexing and crawl errors. Keep one canonical copy of each article; do not publish identical documentation on both hosts.

Google's [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) recommends choosing subdomains or subdirectories according to business needs. Its [site migration guide](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) explains URL mapping, permanent redirects, and monitoring. A subdomain does not itself provide a ranking advantage.

Starlight supplies static HTML, breadcrumbs, canonical URLs, page titles and descriptions, a sitemap, and Pagefind search. Keep one purpose per article, use descriptive links, and update claims when behavior changes. Internal infrastructure credentials and operational runbooks do not belong here.

## Contribute

Edit the relevant Markdown page, verify its examples and links, and open a pull request describing the user-facing change. Report security concerns privately to mail@deplexo.com.

MIT licensed. Code samples may be reused with the license notice.
