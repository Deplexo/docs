---
title: "Start from a template"
description: "Take ownership of a complete starter application, customize it, and deploy from your own repository."
---

<span id="choose-a-template"></span>

## Choose a template

Browse the gallery by purpose: portfolio, website, API, or bot. Read the template details before deploying, especially the required accounts, environment variables, workload type, and storage requirements.

Each starter runs on its own. Its folder includes source code, dependency lockfiles, a Dockerfile, deplexo.yaml, and a README. Follow that README to set up the app, then use these docs for deploying it on Deplexo.

- [Next.js portfolio](https://github.com/Deplexo/examples/tree/main/templates/nextjs-portfolio)
- [Next.js website](https://github.com/Deplexo/examples/tree/main/templates/nextjs-website)
- [All templates](https://github.com/Deplexo/examples)

<span id="create-your-copy"></span>

## Export a starter into your own directory

Clone the public examples repository and run the export script with a template ID and a new destination directory. The exporter copies the starter and its license into a directory you can turn into your own repository.

Use a destination that does not already contain a project. The example below exports the Next.js portfolio. Other IDs include nextjs-website, go-telegram-bot, go-discord-bot, go-http-api, node-express, python-fastapi, and static-site.

```shell
git clone https://github.com/Deplexo/examples.git
cd examples
node scripts/export.mjs nextjs-portfolio ../my-portfolio
cd ../my-portfolio
```

- [Examples repository](https://github.com/Deplexo/examples)

<span id="own-your-repository"></span>

## Create your application repository

Create a repository in your own Git account and push the exported application there. Keep the license and required notices in your copy. Record the template revision you started from when tracking upstream changes.

Deploy from your own repository so you decide when code and dependencies change. Pointing a production app at the shared examples repository would let its maintenance updates trigger your releases.

```shell
git init
git add .
git commit -m "Start application"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

<span id="configure-locally"></span>

## Test and personalize

Follow the starter README to install dependencies and run locally. Replace branding, profile content, links, and contact details. Keep .env.example as a list of configuration names with safe placeholders; store actual local credentials in an ignored file.

For bots, create a separate development bot if possible. Stop any local polling or Gateway instance using the production token before starting the deployed application.

- [Next.js websites and portfolios](/guides/nextjs/)
- [Telegram bot guide](/guides/telegram-bot/)
- [Discord bot guide](/guides/discord-bot/)

<span id="deploy-and-maintain"></span>

## Deploy and maintain your copy

Connect your repository in Deplexo and follow the quickstart. Keep the starter's Dockerfile and runtime setup unless you intend to change how the app runs. Enter required credentials before deployment, then verify the app with a real interaction.

Updates to the examples repository do not automatically modify your copy. Review upstream improvements, dependency updates, and security fixes, then commit the changes you want to ship. Run the starter's checks before redeploying.

- [Follow the quickstart](/getting-started/quickstart/)
- [Understand redeployments](/operations/deployments/)
