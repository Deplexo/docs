---
title: "Troubleshooting"
description: "Work from the failing stage to a specific cause: build, startup, routing, credentials, or storage."
---

<span id="build-fails"></span>

## The image does not build

Check the deployment commit, root directory, Dockerfile path, and first failing command. Confirm the lockfile is committed and agrees with the dependency manifest. Run the production build from a clean checkout.

If the build needs a variable available only in Deplexo's runtime environment, change the build or application design. For timeout or resource errors, inspect the failing command and resource information before increasing limits.

- [Docker and builds](/guides/docker/)
- [Environment availability](/guides/environment/#runtime-not-build)

<span id="app-wont-start"></span>

## The application exits after startup

Read runtime logs for the exit reason. Confirm the start command points to a file in the final image, required credentials are set, and runtime libraries are present.

A worker must keep its process running. A script that backgrounds the bot and exits also ends the container's main process. Fix the cause of repeated crashes; restarting repeatedly is not a recovery strategy.

<span id="web-service-unreachable"></span>

## A web service is unreachable

Confirm it is a web service, its process is running, and it listens on 0.0.0.0 rather than localhost. Match its listening port to PORT and repository configuration. A successful build or EXPOSE line does not prove reachability.

Test the default application URL before a custom domain. If that fails, inspect startup and runtime logs. If it works, focus on DNS and domain verification.

<span id="bot-does-not-answer"></span>

## A bot connects but does not respond

Check bot identity, credentials, and whether the command is implemented. For Telegram polling conflicts, stop duplicate consumers and remove an existing webhook. Check privacy settings if private messages work but group messages do not.

For Discord, verify installation scopes, registration, guild configuration, effective channel permissions, and intents. Test the starter's documented command before custom handlers.

- [Telegram guide](/guides/telegram-bot/)
- [Discord guide](/guides/discord-bot/)

<span id="filesystem-errors"></span>

## Writes fail or files disappear

A read-only filesystem error means the app is writing outside a supported writable path. Move disposable caches to temporary storage and persistent data to the data mount. Check ownership if the error is permission denied.

Files in /tmp are temporary and limited in size. Image files are replaced by deployment. Use the persistent volume for required local state and verify backups before moving or deleting the application.

- [Storage and filesystem](/operations/storage/)

<span id="domain-not-working"></span>

## A custom domain is not working

Verify the exact TXT record and routing target shown in the dashboard. Check authoritative DNS records, including whether the provider appended the zone name twice. TXT verification does not replace the traffic CNAME.

Allow for DNS propagation and certificate provisioning. Keep the verification record after setup. If the application URL works but the custom hostname fails, include the hostname, DNS lookup results, and browser error in your support request.

- [Custom-domain setup](/guides/domains/)
- [Contact support](https://deplexo.com/support)
