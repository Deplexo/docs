# Hosting the docs

GitHub Pages serves the static Astro site at [docs.deplexo.com](https://docs.deplexo.com). Search is built with Pagefind and runs in the browser. The site needs no application server or database.

## Automatic deployment

The [documentation workflow](../.github/workflows/ci.yml) runs source checks, builds the site, and validates generated links, metadata, sitemap, and search. It uploads `dist/` as a Pages artifact. Successful pushes to `main` deploy through the `github-pages` environment; pull requests only build and validate.

To retry deployment, open the workflow in GitHub Actions and run it on `main`, or rerun a failed workflow after fixing its cause. Deployment permission is limited to the deployment job (`pages: write` and `id-token: write`). Repository tokens are provided by GitHub Actions; no Cloudflare credentials are needed in the workflow.

## Custom domain and DNS

In the repository's **Settings → Pages**:

1. Set the build source to **GitHub Actions**.
2. Set the custom domain to `docs.deplexo.com` before changing DNS.
3. Once DNS validation and certificate provisioning complete, enable **Enforce HTTPS**.

In Cloudflare, configure this record:

| Type | Name | Target | Proxy status |
| --- | --- | --- | --- |
| CNAME | `docs` | `deplexo.github.io` | DNS only |

Use automatic TTL. Replace a conflicting record for `docs.deplexo.com`; do not change the main site's records. The target has no repository path. Keep `site: 'https://docs.deplexo.com'` in `astro.config.mjs`; the custom domain serves this repository at its root, so no `/docs` base path is needed.

A repository `CNAME` file is **not required** for an Actions deployment. GitHub Pages uses the custom-domain setting; Cloudflare supplies the DNS record. Both must be configured. See [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

When migrating from another host, keep the previous host available until Pages serves the custom domain with a valid certificate and the checks below pass. DNS changes and certificate provisioning may take time. Retire the old host and its route only after verifying the switch.

## Verify a deployment

Confirm that the successful Pages deployment identifies the intended commit. Then check:

```sh
curl --fail https://docs.deplexo.com/
curl --fail https://docs.deplexo.com/guides/mcp/
curl --fail https://docs.deplexo.com/sitemap-index.xml
curl --silent --output /dev/null --write-out '%{http_code}\n' https://docs.deplexo.com/this-page-does-not-exist/
```

The unknown page should return HTTP 404. Check navigation, code blocks, mobile layout, and search in a browser. The deployment does not expose the old container's `/healthz` endpoint; use a public page for uptime monitoring.

## Roll back content

Revert the offending commit on `main` and push the revert. The same checked workflow builds and deploys the previous content. Keep the custom-domain and DNS settings in place during a content rollback.
