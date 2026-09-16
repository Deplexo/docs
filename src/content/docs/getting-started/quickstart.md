---
title: "Deploy your first app"
description: "Connect a repository, configure its runtime, and verify your first deployment."
---

<span id="before-you-start"></span>

## Before you start

You need a Deplexo account and a git repository containing an application. For private repositories, connect the corresponding git provider and grant access to the repository. Keep credentials out of the repository; add them during deployment.

Run the app locally first. Confirm its start command, listening port if it serves HTTP, and database or storage requirements. Official templates document these requirements in their README.

- [Choose a template](https://github.com/Deplexo/examples)
- [Connect a git provider](https://deplexo.com/git)

<span id="prepare-your-repository"></span>

## Prepare your repository

Commit a Dockerfile and your dependency lockfile. A Dockerfile gives you control over the build and startup process. For framework-generated builds, select the framework in the deployment form and use deplexo.yaml for repository settings.

For monorepos, set the root directory to the folder containing your app. Docker build instructions and the Dockerfile path are resolved from that build context; keep the files needed by the build inside it.

```yaml
framework: dockerfile
dockerfile: Dockerfile
port: 3000
```

- [Docker and builds](/guides/docker/)

<span id="configure-and-deploy"></span>

## Configure and deploy

Open Deploy, choose your repository, and review the application name, region, and resources. Select the build method and root directory. Add the environment variables required by your application before submitting.

For a web service, set PORT to the port your server listens on and bind the server to 0.0.0.0. For a polling bot or another background process, use its Dockerfile and required environment variables; no HTTP server is necessary. Review the resource information in the form, then deploy.

- [Deploy an application](https://deplexo.com/add)
- [Environment variables](/guides/environment/)

<span id="verify-the-result"></span>

## Verify the result

Watch the deployment's build logs. After startup, open a web service's application URL and exercise a real route or action. For a bot, send a command through Telegram or Discord and check its runtime logs for a successful connection.

A running process alone does not prove that authentication, a database connection, or a user action works. Compare the deployment commit, environment variables, and logs with your local setup if the result is unexpected.

- [Read deployment logs](/operations/logs/)
- [Diagnose a failure](/operations/troubleshooting/)

<span id="ship-your-next-change"></span>

## Ship your next change

Commit and push a small change to the connected branch. With automatic deployment enabled, the git webhook triggers a new deployment. Otherwise, redeploy from the application dashboard.

Once the app works on its default URL, attach a custom domain if needed. Set up your own backup process before relying on persistent data for production workloads.

- [Connect a domain](/guides/domains/)
- [Plan persistent storage](/operations/storage/)
