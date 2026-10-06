---
title: "Discord bots"
description: "Deploy a Go Discord Gateway bot with appropriate permissions, a protected token, and predictable command registration."
---

<span id="create-the-application"></span>

## Create your Discord application

Create an application in the Discord Developer Portal, set up its bot user, and copy the token. Add DISCORD_BOT_TOKEN to Deplexo environment variables. Read the starter README for additional application or development guild identifiers it requires.

Invite the bot using the bot and applications.commands scopes with only the permissions it needs. Slash commands can avoid reading arbitrary message content; enable privileged intents only when the bot's behavior requires them.

- [Go Discord template](https://github.com/Deplexo/examples/tree/main/templates/go-discord-bot)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Application commands](https://discord.com/developers/docs/interactions/application-commands)

<span id="configure-the-worker"></span>

## Run the Gateway connection

A DiscordGo Gateway bot maintains an outgoing connection to Discord. Supply its credentials and deploy the Dockerfile. It does not require a public website or a custom domain.

Use a single active instance for the starter. Before adding shards or multiple consumers, handle Discord's session limits and coordinate the shards. Stop the local bot when it shares production credentials.

```yaml
version: 1
type: worker
build:
  framework: dockerfile
  dockerfile: Dockerfile
```

- [DiscordGo source and examples](https://github.com/bwmarrin/discordgo)

<span id="test-a-command"></span>

## Verify command registration and responses

Watch runtime logs for the ready event, then invoke the starter's slash command in a server where you installed the application. Test server-specific commands during development when supported by the starter; global command availability can take time to update.

If commands do not appear, check the application ID, installation scopes, guild ID, registration errors, and permissions. If the bot connects but cannot perform an action, check its effective channel permissions as well as role permissions.

- [Inspect logs](/operations/logs/)

<span id="graceful-operation"></span>

## Keep the bot reliable

Close the Gateway session on termination and allow the client to reconnect after network interruptions. A command handler should acknowledge interactions promptly and defer longer work using Discord's interaction APIs.

When registering commands, update only the commands your app owns and leave unrelated commands in place. Persist important state outside process memory, and redact tokens and private message content from logs.

- [Storage](/operations/storage/)
- [Deployments and restarts](/operations/deployments/)


<span id="check-the-bot-rather-than-its-assigned-url"></span>

## Check the bot in Discord

With `type: worker`, Deplexo checks that the bot stays running and honors any image health check. It does not publish a port or assign an application URL. Omit `run.port` and verify a command in your Discord server, then check the runtime logs.

Place this YAML at the source root before creating the app. Existing web apps cannot be converted by changing YAML; create a worker app and stop the old bot before starting the replacement. See the [configuration reference](/reference/configuration/).
