---
title: Deplexo CLI
description: Install the Deplexo CLI, sign in, deploy from Git, and read your app's logs from a terminal.
---

The `deplexo` command lets you manage apps from your terminal. It uses the [user API](/reference/user-api/) and is open source under Apache-2.0. You can read the code and report issues in [Deplexo/cli](https://github.com/Deplexo/cli).

## Install

On Linux or macOS:

```sh
curl -fsSL https://cli.deplexo.com/install.sh | sh
```

On Windows, use PowerShell:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod -ErrorAction Stop 'https://cli.deplexo.com/install.ps1')))
```

The installer verifies the download's SHA-256 checksum and installs to `~/.local/bin` on Linux and macOS, or `%LOCALAPPDATA%\Deplexo\bin` on Windows. These default locations do not need administrator access. Follow the installer's PATH instructions, then run `deplexo --help`.

The installer prefers a stable release and falls back to a beta while no stable release exists. Builds target Linux, macOS, and Windows on amd64 and arm64; check the [release notes](https://github.com/Deplexo/cli/releases) for native testing status on your platform. You can inspect the [installer scripts](https://github.com/Deplexo/cli/tree/main/site) or download an archive directly. See [cli.deplexo.com](https://cli.deplexo.com/) for installation options, including version pinning for CI.

## Sign in

```sh
deplexo auth login
deplexo whoami
deplexo auth status
```

Sign-in displays a verification URL and pairing code. Press Enter to open the browser and approve access, or use `deplexo auth login --no-browser` to open the URL yourself. Use `--read-only` when you only need to inspect apps and logs.

The default permissions are `profile:read app:read app:deploy app:restart logs:read`. To change them, pass `--scopes` with a space-separated list; this replaces the defaults and must include `profile:read`. Starting, stopping, and deleting apps need `app:start`, `app:stop`, and `app:delete`, respectively.

Credentials are stored in Linux Secret Service, macOS Keychain, or Windows Credential Manager. On Linux, unlock the keyring before running commands. If a keyring is unavailable, `--insecure-storage` uses a plaintext credential file restricted to your account. Pass that flag on each command that needs the file. Run `deplexo auth logout` to sign out.

## Choose an app

```sh
deplexo apps list
deplexo link --app 11111111-1111-4111-8111-111111111111
deplexo apps get
```

Replace the example UUID with an app ID from `apps list`. Linking checks your access and saves the app ID in `.deplexo.json` in the current directory. Commands use that app unless you pass `--app`. Run `deplexo unlink` to remove the link.

## Create an app or deploy a change

To create an app, replace the example repository URL with your own:

```sh
deplexo apps create --name my-app --repo https://github.com/example/my-app
```

The command creates the app and its first deployment, then prints both UUIDs. For a private repository, first connect the Git provider and grant Deplexo access through the dashboard.

To rebuild an existing linked app:

```sh
deplexo deploy
deplexo deployments list
deplexo deployments logs 22222222-2222-4222-8222-222222222222
```

Replace the deployment UUID with one returned by `deploy` or `deployments list`. `deploy` rebuilds from the app's recorded source; Git apps use the latest source. It returns once the server accepts the request, so check the build logs to see whether deployment succeeds.

This command uses the API's `/apps/{id}/restart` endpoint and needs `app:restart`. The CLI does not offer a process-only restart or local directory and ZIP uploads. If an app creation request loses its response, check the dashboard before trying again to avoid creating another app.

## Read logs

```sh
deplexo logs
deplexo logs --follow
deplexo logs --follow --json
```

These commands read runtime logs for the selected app. `--follow` polls for new lines and stops after 30 minutes by default; set `--timeout` to change that. Build logs use `deplexo deployments logs <deployment-uuid>` and return a snapshot.

## Use the CLI in scripts

Create an [API key](https://deplexo.com/api-keys) with the required [scopes](/reference/user-api/#permissions), then store it as `DEPLEXO_TOKEN` in your CI secret manager. The CLI uses this token before stored credentials and does not save or refresh it. An invalid token fails the command; it does not switch accounts.

```sh
deplexo apps list --json --no-input
deplexo deploy --app 11111111-1111-4111-8111-111111111111 --json --no-input
```

Use `--json` for machine-readable results and `--no-input` to disable prompts. Set `DEPLEXO_NO_UPDATE_CHECK=1` to disable automatic update checks. Unset `DEPLEXO_TOKEN` before signing in or out interactively.

Stopping an app, cancelling a deployment, and deleting an app require `--yes`. Starting or stopping also requires the corresponding scope. For example, `deplexo apps stop --yes` stops the selected app; it does not cancel a deployment in progress.

## Update and get help

```sh
deplexo upgrade --check
deplexo upgrade
deplexo --help
deplexo apps --help
```

`upgrade` asks before replacing the executable and verifies the archive checksum and the downloaded executable. Use `--yes` to skip the prompt. If you installed through a package manager, use that manager to update.

The [CLI README](https://github.com/Deplexo/cli#readme) covers profiles, output formats, exit codes, and building from source. See [open-source projects](/reference/open-source/) for the other Deplexo repositories.
