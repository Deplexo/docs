---
title: "Telegram bots"
description: "Run a Go Telegram bot with gotgbot, long polling, secure credentials, and a single active consumer."
---

<span id="create-your-bot"></span>

## Create a bot and protect its token

Create a bot through Telegram's verified @BotFather account and copy its token. Add TELEGRAM_BOT_TOKEN to the application's Deplexo environment variables. Use the exact variable name expected by the starter.

The token grants control of the bot. Never commit it, paste it into public issues, or log request URLs that contain it. If exposed, revoke or regenerate it through BotFather and redeploy with the replacement.

- [Go Telegram template](https://github.com/Deplexo/examples/tree/main/templates/go-telegram-bot)
- [Telegram bot setup](https://core.telegram.org/bots/tutorial)

<span id="use-a-background-worker"></span>

## Run long polling as a worker

A polling bot connects outward to Telegram and waits for updates. It does not need a public HTTP endpoint or a custom domain. The gotgbot polling starter uses a worker service and runs until it receives a termination signal.

Keep one active polling consumer per token. Stop the local development process before deploying the same bot, and remove any existing Telegram webhook before switching that token to polling. A webhook and getUpdates polling cannot be used simultaneously.

```yaml
framework: dockerfile
dockerfile: Dockerfile
```

- [gotgbot documentation and examples](https://github.com/PaulSonOfLars/gotgbot)

<span id="verify-and-debug"></span>

## Verify a real conversation

After deployment, check runtime logs for successful startup. Open the bot in Telegram and send /start, or the command documented by the starter. Verify its response rather than relying only on the application's running status.

Authentication failures usually indicate a wrong or revoked token. A getUpdates conflict often means another process or a configured webhook is consuming updates. Group message visibility also depends on Telegram's privacy settings and the bot's permissions.

- [Runtime logs](/operations/logs/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

<span id="state-and-redeployments"></span>

## Handle restarts and stored state

Stop polling on termination and allow in-flight handlers to finish. Make sure retrying a handler will not duplicate changes to external data. Network reconnects and application restarts are normal events for a long-running bot.

In-memory state disappears on restart. Store important user settings or job state in an external database or a file in the persistent mount. If using SQLite, keep the database and journal files on the writable mount and maintain backups.

- [Persistent storage](/operations/storage/)
- [Deployment lifecycle](/operations/deployments/)

<span id="when-to-use-webhooks"></span>

## When to use a webhook

A Telegram webhook bot is an HTTP service with a reachable HTTPS endpoint. It needs request validation, including Telegram's webhook secret header when configured, and prompt responses to avoid unnecessary retries.

Changing only the service type does not turn a polling starter into a webhook bot. The application must implement a webhook handler and register its URL with Telegram. Test the handler before switching the deployed bot to webhooks.


<span id="check-the-bot-rather-than-its-assigned-url"></span>

## Check the bot in Telegram

Deplexo currently performs a port check for all applications. A polling or Gateway bot has no HTTP listener, so startup may include a port warning before completing. Send a command in your Telegram test chat and check the logs. Do not add a dummy HTTP server just to make the assigned URL load.
