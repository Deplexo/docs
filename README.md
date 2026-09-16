<p align="center">
  <a href="https://docs.deplexo.com"><img src="public/logo.webp" width="64" height="64" alt="Deplexo" /></a>
</p>

<h1 align="center">Deplexo Docs</h1>

<p align="center">Guides for deploying, configuring, and running apps on Deplexo.</p>

<p align="center">
  <a href="https://docs.deplexo.com">Read the docs</a> ·
  <a href="https://deplexo.com">Deplexo</a> ·
  <a href="https://github.com/Deplexo/examples">Examples</a>
</p>

## Run locally

Use Node.js 24 LTS.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321`. Changes reload as you edit.

## Edit the docs

Pages live in `src/content/docs/` as Markdown or MDX. Each page needs a title and description in its frontmatter.

| Path | Contents |
| --- | --- |
| `src/content/docs/` | Guides, reference, FAQ, and platform policies |
| `src/components/` | Navigation and page components |
| `src/styles/custom.css` | Typography, colors, and responsive styles |
| `public/` | Logo, fonts, icons, and social image |
| `astro.config.mjs` | Site settings and sidebar order |

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build). Search uses Pagefind.

## Check your changes

```sh
npm run check
npm run build
node scripts/check-site.mjs
```

Check the page in the browser, then open a pull request. CI validates the build, internal links, and page metadata.

## Deploy

The site runs at **[docs.deplexo.com](https://docs.deplexo.com)**. See [deployment instructions](deploy/README.md) for the Docker and Cloudflare setup.

## License

[MIT](LICENSE). Keep the license notice when reusing code samples.
