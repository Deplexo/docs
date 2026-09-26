---
title: "Environment variables"
description: "Configure runtime behavior and supply credentials without putting them in your source code."
---

<span id="add-variables"></span>

## Add configuration before startup

Enter variables in the deployment form, or open application environment settings to change them later. Use the exact names expected by the application; names are case-sensitive.

Keep .env.example in the repository to document names and safe defaults. Real tokens, passwords, signing secrets, and API keys belong in environment settings. Deplexo encrypts stored environment values, but the running application can access variables supplied to it.

```text
PORT=3000
NODE_ENV=production
TELEGRAM_BOT_TOKEN=<set-in-deplexo>
```

<span id="runtime-not-build"></span>

## Understand when variables are available

Deplexo passes application variables to the running container. Dependency installation and Dockerfile RUN commands do not automatically receive them during the build.

Make public build configuration explicit. Avoid embedding secrets in Dockerfile ARG or ENV instructions, image layers, frontend bundles, or repository build commands. Restructure server code to read secrets at runtime when possible.

- [Next.js build and runtime configuration](/guides/nextjs/#configuration-and-secrets)

<span id="apply-changes"></span>

## Apply a configuration change

After saving environment changes, redeploy or restart through the dashboard so a new container receives the configuration. A running process keeps its old environment until it is replaced.

Verify the change through application behavior and logs. A public frontend variable embedded during a build also requires rebuilding with the intended build configuration.

- [Deployment lifecycle](/operations/deployments/)

<span id="rotate-and-redact"></span>

## Rotate and redact secrets

Rotate credentials with the issuing provider, update the corresponding variable, and redeploy. If the provider lets both credentials remain active, test the replacement before revoking the old one.

Do not print the entire process environment. Log whether a required value is present rather than its contents. Remove tokens, passwords, authorization headers, and sensitive customer data before sharing logs or screenshots.

- [Inspect logs safely](/operations/logs/)
