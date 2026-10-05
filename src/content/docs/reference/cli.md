---
title: CLI commands and flags
description: Every Deplexo CLI command, flag, permission, environment variable, and exit code.
---

Use the [CLI guide](/guides/cli/) to install and get started. Run `deplexo version` and `deplexo <command> --help` to check what your installed version supports. This reference includes the current source's start/stop login defaults and `support` command; older releases may need the explicit scopes shown below and may not have `support` yet.

## Global flags

These flags work before or after a command. Boolean flags default to false.

| Flag | Default | Meaning |
| --- | --- | --- |
| `--origin URL` | `https://deplexo.com` | HTTPS API origin; overrides `DEPLEXO_ORIGIN` and saved settings. |
| `--profile NAME` | `default` | Credential profile; overrides `DEPLEXO_PROFILE` and saved settings. |
| `--insecure-storage` | Off | Use a protected plaintext credential file instead of the OS keyring. Pass it on each command that uses that file. |
| `--no-input` | Off | Disable prompts and automatic browser opening. It does not confirm mutations; pass `--yes` where required. |
| `--json` | Off | Write JSON results; runtime log following writes one JSON object per line. |
| `--color MODE` | `auto` | `auto`, `always`, or `never`. Nonempty `NO_COLOR` or `TERM=dumb` disables colors in every mode. |
| `-h`, `--help` | Off | Show help for the selected command without signing in. |

### Choose an account profile

`--profile` names a separate saved sign-in; it does not change which Deplexo account you approve in the browser. Use the same profile on later commands:

```sh
deplexo --profile work auth login
deplexo --profile work whoami
deplexo --profile work apps list
```

Omitting the flag selects `DEPLEXO_PROFILE`, saved settings, or `default`. App links do not select a profile. `--origin` selects the Deplexo installation, not an app's public hostname; use an HTTPS origin without an API path:

```sh
deplexo --origin https://deplexo.com --profile work whoami
```

### Choose output and prompting behavior

```sh
deplexo apps list --json
deplexo apps list --color never
deplexo apps stop --app APP_UUID --yes --no-input --json
```

Replace `APP_UUID` with an ID from `apps list`. `--json` is for scripts; it avoids parsing terminal tables. `--color always` forces terminal colors in human output, including redirected output; `never` disables them. `--no-input` prevents prompts but still requires valid credentials, permissions, and any command-specific `--yes`. It does not make browser authorization unattended. With macOS Keychain, use an injected API key or explicitly selected file storage for `--no-input` commands.

## Authentication

### `auth login`

Sign in and store credentials for the selected origin and profile. Local interactive login opens your browser. SSH sessions, redirected input, and `--no-input` use device authorization.

| Flag | Meaning |
| --- | --- |
| `--device` | Use a pairing link and code that can be opened on another device. |
| `--no-browser` | Use device authorization and print the pairing instructions without opening a browser. |
| `--read-only` | Request only `profile:read app:read logs:read`. |
| `--scopes LIST` | Request a quoted list separated by spaces or commas. Replaces all defaults and must include `profile:read`. Cannot be combined with `--read-only`. |

Normal login requests `profile:read app:read logs:read app:deploy app:restart app:start app:stop`. Existing sessions do not gain permissions automatically: sign in again and approve the requested access. Older releases that omit start/stop can use:

```sh
deplexo auth login --scopes "profile:read app:read logs:read app:deploy app:restart app:start app:stop"
```

Deletion remains opt-in. For example, this grants only profile access and deletion:

```sh
deplexo auth login --scopes "profile:read app:delete"
```

For a remote terminal:

```sh
deplexo auth login --device --no-browser
```

The user must approve sign-in in their browser. Interactive success output includes the connected website, documentation, and next commands. JSON output remains the account object.

Use `--read-only` for an inspection profile:

```sh
deplexo --profile inspect auth login --read-only
deplexo --profile inspect apps list
```

That profile cannot deploy, start, stop, cancel, or delete apps. To request selected permissions instead, use `--scopes`, for example `--scopes "profile:read app:read app:start app:stop"`. It replaces the whole requested permission set; it does not add permissions to an existing session. Sign in again when changing access.

`--device` chooses pairing even on a local terminal. By itself it can offer to open the pairing page; add `--no-browser` to print the link and code only. SSH and redirected input already select pairing. Keep the CLI running while you approve the request on another device.

### When the keyring is unavailable

The default is the operating system's credential store. `--insecure-storage` is an explicit choice to save credentials in a plaintext file with restricted permissions:

```sh
deplexo auth login --device --no-browser --insecure-storage
deplexo apps list --insecure-storage
deplexo auth logout --insecure-storage
```

Keep the flag on every command that uses those credentials. It is not saved as a preference, and omitting it switches back to the OS keyring. Changing storage modes does not migrate an existing sign-in; log in using the mode you intend to keep.

### `whoami`, `auth status`, and `auth logout`

`whoami` and `auth status` check the current account through the API and require `profile:read`. `auth logout` revokes the saved session and removes local credentials. These commands have no local flags.

`DEPLEXO_TOKEN` takes precedence over stored credentials. Unset it before browser login or logout if you intend to switch to stored credentials; those commands do not replace or revoke an injected API key. On macOS, `--no-input` cannot use Keychain; use an API key or explicitly choose `--insecure-storage`.

## Apps and deployments

Use UUIDs, not app names. Commands with `--app` use `.deplexo.json` in the current directory when the flag is omitted, except `link`, which requires the flag.

| Command | Local flags or arguments | Required scope | Result |
| --- | --- | --- | --- |
| `apps list` | None | `app:read` | List your apps. |
| `apps get` | `--app UUID` | `app:read` | Show one app's details and current state. |
| `apps create` | See below | `app:deploy` | Create an app and queue its first deployment. |
| `apps start` | `--app UUID` | `app:start` | Start an existing stopped container without rebuilding. |
| `apps stop` | `--app UUID`, required `--yes` | `app:stop` | Queue a stop; does not cancel a deployment. |
| `apps cancel` | `--app UUID`, required `--yes` | `app:deploy` | Cancel the app's in-progress deployment. |
| `apps delete` | `--app UUID`, required `--yes` | `app:delete` | Delete the app and its resources. |
| `deploy` | `--app UUID` | `app:restart` | Rebuild the recorded source and queue a deployment. |
| `link` | Required `--app UUID` | `app:read` | Check access and save the app UUID in `.deplexo.json`. |
| `unlink` | None | None | Remove the current directory's app link; does not delete the app. |
| `deployments list` | `--app UUID`, `--limit N`, `--offset N` | `app:read` | Read deployment history; limit defaults to 50, range 1–200; offset defaults to 0 and must be nonnegative. |
| `deployments logs DEPLOYMENT_UUID` | One required deployment UUID | `logs:read` | Read a build-log snapshot for that deployment. |

`apps create` flags:

| Flag | Meaning |
| --- | --- |
| `--name NAME` | Required app name. |
| `--repo URL` | Required HTTPS Git repository URL accessible to your account. |
| `--framework NAME` | Build framework; omit for automatic detection. See [framework values](/reference/configuration/#framework-and-dockerfile). |
| `--root-dir PATH` | Source subdirectory to build; omit for the repository root. |

```sh
deplexo apps create --name api --repo https://github.com/example/project --root-dir services/api
deplexo apps stop --app APP_UUID --yes
deplexo apps start --app APP_UUID
deplexo deployments list --app APP_UUID --limit 20 --offset 20
```

Replace placeholders before running commands. Start, stop, creation, and rebuild commands return when the server accepts the operation. Acceptance is not completion. Inspect the app state or the returned deployment UUID. After a lost response, inspect the app and deployment history before retrying.

`deploy` is a rebuild, not a process-only restart. It takes no local path argument. Local directory/ZIP uploads, environment-variable commands, build-log following, and a deployment wait command are not implemented. `--yes` confirms only commands that advertise it; it is not a global flag.

### App selection and build settings

Linking avoids repeating `--app` for each command in the current directory:

```sh
deplexo link --app APP_UUID
deplexo apps get
deplexo deploy
```

An explicit `--app` overrides the link for that command without changing `.deplexo.json`. To change the saved link, run `deplexo unlink` and then `link --app NEW_APP_UUID`. Unlinking only removes the local association.

For creation, `--name` names the app and `--repo` supplies its Git source. `--root-dir` is relative to the repository root, useful for a monorepo. `--framework` chooses a supported build preset; omit it for detection. For example:

```sh
deplexo apps create --name api --repo https://github.com/example/project --root-dir services/api --framework dockerfile
```

This example expects a Dockerfile or Containerfile in `services/api`. These flags belong to `apps create`; `deploy` reuses the existing app's configuration. For custom install, build, or start commands and Dockerfile paths, use [repository configuration](/reference/configuration/).

`apps create` immediately queues the first deployment and has no `--env` flag. If the app needs environment values on its first deployment, create it through [MCP](/guides/mcp/#available-tools), the dashboard, or the [public API](/reference/user-api/) with those values supplied.

### Verify a deployment and page through history

```sh
deplexo deploy --app APP_UUID --json
deplexo deployments logs DEPLOYMENT_UUID --json
deplexo apps get --app APP_UUID --json
```

Use the `deploymentId` returned by `deploy`. In the log response, inspect `status`, `buildLogs`, and `errorMessage`; without `--json`, this command prints only log text. Poll that exact deployment with backoff until `success` or `failed`, then verify the app. Set a time limit for your monitoring rather than polling forever.

`deployments list --limit 20 --offset 0` returns the first page; `--offset 20` skips the first 20 records. Add `--app APP_UUID` if the directory is not linked. Its `--limit` counts deployments, while `logs --limit` counts runtime log lines per request.

## Runtime logs

`deplexo logs` requires `logs:read`.

| Flag | Default | Meaning |
| --- | --- | --- |
| `--app UUID` | Current directory's link | App whose runtime logs to read. |
| `--follow` | Off | Poll for new lines until interrupted or the timeout is reached. |
| `--limit N` | `500` | Maximum lines per request, from 1 to 1,000. |
| `--since CURSOR` | Empty | Opaque `nextSince` cursor from an earlier response. Pass it unchanged and quoted. |
| `--timeout DURATION` | `30m` | Maximum runtime-log command duration; must be positive. Accepts values such as `30s`, `10m`, or `1h`. |

```sh
deplexo logs --app APP_UUID --limit 100 --json
deplexo logs --app APP_UUID --follow --timeout 10m --json --no-input
```

Without `--follow`, the command returns one snapshot. `--timeout` bounds this log command, not deployment execution. Build logs use `deployments logs DEPLOYMENT_UUID`; that command has no `--follow`, `--limit`, or `--since` flags.

To resume runtime logs, first request a JSON snapshot and copy its `nextSince` cursor:

```sh
deplexo logs --app APP_UUID --json
deplexo logs --app APP_UUID --since 'CURSOR_FROM_nextSince' --follow --timeout 10m
```

Replace the quoted placeholder with that response's cursor. `--since` takes the opaque cursor, not a timestamp or a duration such as `10m`. `--limit` applies to each request, so a follow session can print more lines than the limit over time. Interrupting log following stops observation; it does not stop the app.

## Updates, support, and shell completion

| Command | Local flags or arguments | Meaning |
| --- | --- | --- |
| `version` | None | Show installed version and platform. `--json` also includes the source commit. |
| `upgrade` | `--check`, `--yes` | `--check` reports availability without installing; `--yes` installs a newer release without prompting. |
| `support` | None | Show email, Discord, and docs links. Works offline without credentials; `--json` returns `email`, `discord`, and `docs`. |
| `completion bash` | `--no-descriptions` | Generate Bash completion. |
| `completion zsh` | `--no-descriptions` | Generate Zsh completion. |
| `completion fish` | `--no-descriptions` | Generate Fish completion. |
| `completion powershell` | `--no-descriptions` | Generate PowerShell completion. |
| `help [command]` | Command path | Show help, for example `deplexo help apps start`. |

`--no-descriptions` omits descriptions from generated completion suggestions and defaults to off. Completion commands print shell scripts even with `--json`. Run `deplexo completion SHELL --help` for installation instructions. Help, version, completion, and support work without network access.

`upgrade` verifies downloads before replacement. In scripts, use `upgrade --yes` or `upgrade --check`; `--no-input` does not accept an update prompt. Development builds cannot upgrade themselves. Automatic checks run at most once per 24 hours after successful interactive commands; they do not install an update without consent. Set `DEPLEXO_NO_UPDATE_CHECK=1` to disable automatic checks.

```sh
deplexo upgrade --check
deplexo upgrade --yes --no-input
deplexo completion bash --no-descriptions
deplexo help apps start
```

`upgrade --check` does not install anything, even if `--yes` is also passed. Completion prints a script; use your shell's installation steps from `completion SHELL --help` to load it. `--no-descriptions` changes completion suggestions, not ordinary command help. `support --json` prints contact URLs and email without submitting a support request.

For help, email [support@deplexo.com](mailto:support@deplexo.com) or join the [Discord community](https://dsc.gg/deplexo). Use email for account-specific questions. Never post credentials or environment secrets in support messages.

## Configuration and environment variables

For origin and profile, precedence is command flag → environment variable → user settings → default. Profiles separate credentials for each origin; a project link does not select a profile.

| Variable | Meaning |
| --- | --- |
| `DEPLEXO_ORIGIN` | HTTPS origin when `--origin` is omitted. |
| `DEPLEXO_PROFILE` | Profile name when `--profile` is omitted. |
| `DEPLEXO_TOKEN` | API key for automation; overrides saved credentials and is never saved or refreshed by the CLI. Empty or invalid values fail. |
| `DEPLEXO_NO_UPDATE_CHECK` | Any nonempty value disables automatic update checks. |
| `CI` | Any nonempty value disables automatic update checks. |
| `NO_COLOR` | Any nonempty value disables color. |
| `TERM` | `dumb` disables color. |
| `SSH_CONNECTION`, `SSH_TTY` | A nonempty value selects device authorization for login. |

Profile names contain 1–64 letters, digits, underscores, or hyphens and start with a letter or digit. Save optional nonsecret settings as `deplexo/settings.json` under the OS user configuration directory:

```json
{ "version": 1, "origin": "https://deplexo.com", "profile": "default" }
```

That directory is `$XDG_CONFIG_HOME` or `~/.config` on Linux, `~/Library/Application Support` on macOS, and `%AppData%` on Windows. There is no `config` command. Keep tokens out of this file and `.deplexo.json`.

### Installer options

These affect the installer, not ordinary CLI commands:

| Option | Meaning |
| --- | --- |
| `DEPLEXO_VERSION` | Select an exact release tag, for example `v0.1.0`. Both installers support it. |
| `DEPLEXO_INSTALL_DIR` | Shell installer destination; must be absolute. Default: `~/.local/bin`. |
| `DEPLEXO_NO_MODIFY_PATH=1` | Prevent the shell installer from offering to edit shell configuration. |
| PowerShell `-Version TAG` | Override the release selected by `DEPLEXO_VERSION`. |
| PowerShell `-InstallDir PATH` | Override `%LOCALAPPDATA%\Deplexo\bin`. |

When piping the shell installer, apply environment variables to `sh`, which executes it. Inspect the [installer source](https://github.com/Deplexo/cli/tree/main/site) before using custom installation options.

For example, pin a published version on Linux or macOS and prevent shell-configuration edits:

```sh
curl -fsSL https://cli.deplexo.com/install.sh | DEPLEXO_VERSION=v0.1.0 DEPLEXO_INSTALL_DIR="$HOME/.local/bin" DEPLEXO_NO_MODIFY_PATH=1 sh
```

The version above is an example of an existing release; choose the published tag you intend to install. `DEPLEXO_VERSION` controls the installer run, not future `deplexo upgrade` commands. In PowerShell, pass installer parameters after creating its script block:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod -ErrorAction Stop 'https://cli.deplexo.com/install.ps1'))) -Version 'v0.1.0' -InstallDir (Join-Path $env:LOCALAPPDATA 'Deplexo\bin')
```

## Output and exit codes

Results go to stdout; progress, pairing instructions, and errors go to stderr. Use `--json` for scripts; human tables are not a stable parsing interface. Errors in JSON mode contain `error` and `exit_code`. Human output escapes terminal control characters, aligns columns, and switches wide tables to labeled fields on narrow terminals.

| Code | Meaning |
| --- | --- |
| `0` | Command succeeded. For queued operations, this means accepted. |
| `1` | Operation failed. |
| `2` | Invalid arguments or flags. |
| `3` | Sign-in required. |
| `4` | Insufficient permission. |
| `130` | Interrupted. A submitted operation may still complete on the server. |
