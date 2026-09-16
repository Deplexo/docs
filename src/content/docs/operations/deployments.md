---
title: "Deployment lifecycle"
description: "Understand builds, automatic deployment, restarts, and the limits of a code rollback."
---

<span id="build-then-replace"></span>

## Build first, then replace

Deplexo checks out the requested revision and builds its image before replacing the existing container. If the build fails, inspect that deployment's logs and correct the cause before trying again.

When the image is ready, Deplexo stops the previous container before starting its replacement. There can be a brief interruption. Handle termination signals, finish in-flight work promptly, and make clients resilient to connection loss. Do not assume a zero-downtime rolling deployment.

<span id="automatic-deployments"></span>

## Deploy after a git push

Automatic deployment uses the connected provider's webhook for the configured repository. Enable or disable it in application settings according to your release process.

If a push does not deploy, verify the branch, provider access, automatic deployment setting, and recent deployment activity. Review the commit shown in the deployment history before relying on an automated release.

<span id="restart-or-redeploy"></span>

## Choose a restart or redeployment

A restart starts a replacement container from the existing image and current runtime configuration. A redeployment runs the build path for the selected revision. Redeploy when source code or build output must change.

Saving an environment value or mount setting does not alter an already-running process. Apply it with the relevant restart or redeployment action, then verify the new process and application behavior.

<span id="rollback"></span>

## Rollback changes application code

Choose a previous deployment revision to rebuild and deploy an earlier code version. Check its dependencies and compatibility with the current environment and data before rolling back.

A code rollback does not restore a database, reverse a migration, recover deleted files, or rotate secrets to earlier values. Persistent data remains current. Design schema migrations and application releases so recovery is possible.

<span id="workers-and-state"></span>

## Make background work restartable

A worker should stop accepting work when termination begins, then finish or safely release the work it owns. Use acknowledgments, leases, or idempotent handlers when supported by the queue or API.

Keep important state in persistent storage or an external database. Ensure a local development bot does not consume the production token. The platform's replacement sequence cannot prevent an independently running process from using the same credentials.

- [Telegram worker guide](/guides/telegram-bot/)
- [Persistent storage](/operations/storage/)
