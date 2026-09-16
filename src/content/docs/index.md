---
title: "Build something. Ship it."
description: "Take a website, API, or background worker from your repository to Deplexo—and keep it running."
---

<span id="how-deplexo-works"></span>

## Your code, running in a container

Connect a git repository and configure your application. Deplexo builds a container image and runs it with the environment variables and resources you select. Push changes to the connected branch to deploy again when automatic deployment is enabled.

Web services receive HTTP traffic through an application URL. Bots and other background processes can run continuously without serving HTTP. Deplexo currently assigns an application URL to all apps; a bot does not expose a website at that URL. Verify it using its platform and runtime logs.

<span id="choose-a-starting-point"></span>

## Choose a starting point

Have an application already? Follow the quickstart and bring your Dockerfile. Starting fresh? The examples repository includes independent starter applications with source code, local setup instructions, and deployment configuration.

A Next.js portfolio and a Telegram bot have different runtime needs. Follow the application guide before choosing storage, setting credentials, or attaching a domain.

- [Deploy an existing repository](/getting-started/quickstart/)
- [Browse starter applications](https://github.com/Deplexo/examples)

<span id="understand-the-runtime"></span>

## Understand the runtime

Applications run with a read-only container filesystem. Use temporary storage for disposable files and the persistent data mount for files that must survive a redeployment. Supply credentials through environment variables, and write diagnostic output to standard output or standard error.

Deplexo builds the new image before stopping the previous container. The replacement has a brief interruption, so clients and background jobs should handle reconnects and retries.

- [Storage and filesystem](/operations/storage/)
- [Deployment lifecycle](/operations/deployments/)

<span id="find-an-answer"></span>

## Find the next step

Browse by task or search by a setting, error, or framework. The configuration reference describes repository settings. Operations guides cover logs, redeployments, rollback, and common failures.

Check the current plans and deployment form for available resources and region capacity. Resource availability depends on the plan and region you select.

- [Configuration reference](/reference/configuration/)
- [Troubleshooting](/operations/troubleshooting/)
- [View plans](https://deplexo.com/plans)
