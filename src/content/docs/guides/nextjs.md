---
title: "Next.js and portfolios"
description: "Deploy a Next.js website with a production build, clear configuration, and storage that fits the runtime."
---

<span id="choose-your-runtime"></span>

## Choose a static portfolio or a server

The portfolio template uses a static export for its content pages. The website template uses a standalone Next.js server. Choose the server when you need server rendering, route handlers, or other runtime server features.

Both starters include production Dockerfiles and dependency lockfiles. Follow the README for the chosen template. Use npm ci for reproducible installs and npm run build to catch production build errors before deployment.

- [Portfolio template](https://github.com/Deplexo/examples/tree/main/templates/nextjs-portfolio)
- [Website template](https://github.com/Deplexo/examples/tree/main/templates/nextjs-website)
- [Next.js deployment documentation](https://nextjs.org/docs/app/getting-started/deploying)

<span id="standalone-build"></span>

## Build a standalone server

For a containerized Next.js server, output: standalone creates a smaller runtime containing traced server dependencies. The runtime image must include the standalone output, .next/static, and public assets.

Start the standalone server with node server.js. Set HOSTNAME=0.0.0.0 and match PORT to the configured application port. Keep the template's runtime image setup when customizing it; do not deploy the development server.

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

- [Docker build guidance](/guides/docker/)

<span id="configuration-and-secrets"></span>

## Separate build and runtime configuration

NEXT_PUBLIC_ values are public and are commonly embedded into browser code during the build. Changing a runtime variable does not rewrite a JavaScript bundle already produced by the build. Never use a NEXT_PUBLIC_ variable for a secret.

Deplexo application variables are supplied to the running container. Design server-only configuration to be read at request time when appropriate. If a page is prerendered during the build, its data requirements apply during the build too; a runtime database URL cannot satisfy that earlier step.

- [Environment variable behavior](/guides/environment/)
- [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables)

<span id="caches-and-uploads"></span>

## Plan writable paths

The application filesystem is read-only. The standalone website starter routes its cache directory to /tmp. Preserve that runtime setup when changing the Dockerfile. Temporary cache files are disposable and share the runtime's 100 MB temporary storage limit.

Introducing image optimization, incremental rendering, or a custom cache handler can add storage requirements beyond the starter. Test those features with a read-only root filesystem. Store uploads in the persistent data mount or external object storage, not beside application source files.

- [Storage and filesystem](/operations/storage/)
- [Next.js self-hosting guidance](https://nextjs.org/docs/app/guides/self-hosting)

<span id="launch-your-site"></span>

## Make it yours and launch

Update portfolio content, social links, page titles, descriptions, and social preview images. Replace example domains in metadata and canonical URLs with the actual public URL. Remove placeholder content before making the site discoverable.

After deployment, test direct navigation to a nested route, refresh that route, load assets, and submit any forms. Add a custom domain after the default URL works. A contact form needs a real delivery service and input validation; a visual form alone does not send mail.

- [Custom domains](/guides/domains/)
