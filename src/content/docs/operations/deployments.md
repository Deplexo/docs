---
title: "Deployment lifecycle"
description: "Understand builds, automatic deployment, restarts, and the limits of a code rollback."
---

<span id="build-then-replace"></span>

## Build first, then replace

Deplexo checks out the requested revision and builds its image before replacing the existing container. If the build fails, inspect that deployment's logs and correct the cause before trying again.

When the image is ready, Deplexo stops the previous container before starting its replacement. This can briefly interrupt service. Handle termination signals, finish in-flight work promptly, and make clients reconnect after a connection drops.

<span id="automatic-deployments"></span>

## Deploy after a git push

Automatic deployment uses the connected provider's webhook for the configured repository. Turn it on in application settings to deploy on pushes, or leave it off to deploy manually.

If a push does not deploy, verify the branch, provider access, automatic deployment setting, and recent deployment activity. Review the commit shown in the deployment history before relying on an automated release.

<span id="restart-or-redeploy"></span>

## Choose a restart or redeployment

A process-only restart replaces the container using its existing image and current runtime configuration. A redeployment builds the selected source revision first. In the CLI, `deplexo deploy` rebuilds the app; the user API calls this operation `POST /apps/{id}/restart`. See the [CLI guide](/guides/cli/#create-an-app-or-deploy-a-change) or [API guide](/reference/user-api/#rebuild-an-existing-app) before choosing an automation command.

Saving an environment value or mount setting does not alter an already-running process. Apply it with the relevant restart or redeployment action, then verify the new process and application behavior.

<span id="rollback"></span>

## Rollback changes application code

Choose a previous deployment revision to rebuild and deploy an earlier code version. Check its dependencies and compatibility with the current environment and data before rolling back.

A code rollback does not restore a database, reverse a migration, recover deleted files, or rotate secrets to earlier values. Persistent data remains current. Design schema migrations and application releases so recovery is possible.

<span id="workers-and-state"></span>

## Make background work restartable

When a worker receives a termination signal, it should stop accepting work and finish or safely release its current jobs. Use acknowledgments, leases, or idempotent handlers when supported by the queue or API.

Keep important state in persistent storage or an external database. Ensure a local development bot does not consume the production token. Replacing the deployed container does not stop a separate process using the same credentials.

- [Telegram worker guide](/guides/telegram-bot/)
- [Persistent storage](/operations/storage/)
