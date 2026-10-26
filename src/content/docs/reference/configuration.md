---
title: "deplexo.yaml reference"
description: "Configure one app with versioned YAML: source paths, builds, startup, worker apps, and port overrides."
---

One `deplexo.yaml` configures one application. It is optional: without it, Deplexo uses the deployment form and saved application settings.

<span id="file-location"></span>

## Place the file at the source root

Put `deplexo.yaml` at the root of your Git repository or uploaded ZIP source. Deplexo uses `deplexo.yml` only when `deplexo.yaml` is absent. If both exist, `deplexo.yaml` wins; an invalid file does not fall back to the other filename.

For a monorepo, keep the YAML at the repository root and set `build.root_dir` to the application folder. Deplexo does not search that folder for another configuration file. A ZIP may contain its files directly or inside one enclosing folder, which is removed when the source is read.

```yaml
version: 1
type: web

build:
  framework: dockerfile
  root_dir: apps/api
  dockerfile: Dockerfile

run:
  port: 3000
```

Here the build context is `apps/api`, and the Dockerfile is `apps/api/Dockerfile`. Keep Dockerfile `COPY` sources inside the build context. Source paths must be relative and stay inside the source tree.

## Supported fields

| Field | Value | When omitted |
| --- | --- | --- |
| `version` | Integer `1`; required | Configuration is rejected |
| `type` | `web` or `worker` | Uses the selected or existing app type; new apps default to `web` |
| `build.framework` | `auto` or `dockerfile` | Uses the saved build method |
| `build.root_dir` | Application directory, relative to the source root | Uses the saved root directory; default `.` |
| `build.dockerfile` | File path relative to `build.root_dir` | Uses the saved path; Dockerfile builds without a path look for `Containerfile`, then `Dockerfile` |
| `build.install` | Dependency installation command for generated builds | Uses the saved command or detected default |
| `build.command` | Build command for generated builds | Uses the saved command or detected default |
| `run.command` | Startup command; also overrides a custom image's `CMD` | Uses the saved command, generated default, or image command |
| `run.port` | Integer from `1` to `65535`, for web apps | Uses the saved `PORT`; routing defaults to `3000` when absent or invalid |

The app type is fixed when the app is created. Changing `type` in YAML cannot convert an existing web app to a worker, or a worker to a web app; the redeployment is rejected.

<span id="framework-and-dockerfile"></span>

## Choose a build method

`build.framework: auto` detects the framework from the selected source directory and generates a build. Runtime names such as `node`, `python`, or `go` are not accepted as YAML framework values.

For a custom image, use `build.framework: dockerfile`. A nonempty `build.dockerfile` path selects a custom Dockerfile even if the framework is `auto`. Put installation and build steps in that Dockerfile; `build.install` and `build.command` apply only to generated builds. To switch to `auto`, also clear any saved Dockerfile path in the dashboard.

`run.command` overrides a custom image's `CMD` with `/bin/sh -c <command>`. The image must contain `/bin/sh`. An existing `ENTRYPOINT` remains in place and receives those command arguments. Leave the command override empty to use the Dockerfile's startup command.

<span id="install-build-start"></span>

## Configure build and startup commands

```yaml
version: 1
type: web

build:
  framework: auto
  install: npm ci
  command: npm run build

run:
  command: npm start
  port: 3000
```

Commands must be strings. Quote commands containing YAML punctuation, such as a colon followed by a space. An explicit empty command (`""`) clears the saved override, using the generated default or the custom image's startup command. An empty build command does not disable a generated build step. To control each build step exactly, use a Dockerfile.

## YAML and dashboard precedence

Explicit YAML fields override dashboard settings. Omitted fields use the saved dashboard defaults. Those defaults remain stored separately, so removing an override restores the dashboard value on the next redeployment. Deleting the configuration file restores all dashboard defaults.

The deployment form reads the selected source and marks fields controlled by YAML. Edit those values in the source file. GitHub, GitLab, Bitbucket, and Codeberg support this preview, with configuration and deployment tied to the same resolved commit. ZIP deployments read the same uploaded source for preview and build. For other Git hosts, use dashboard settings without YAML, or upload a ZIP to use YAML configuration.

Push or upload the changed source and redeploy to apply YAML changes. Starting an existing stopped container does not read a new configuration file.

<span id="service-and-port"></span>

## Web ports and background workers

For web apps, `run.port` sets the routed container port and the runtime `PORT` environment value. It appears read-only in environment settings while YAML controls it. You do not need to set `PORT` separately. Removing `run.port` and redeploying restores the saved dashboard `PORT` value. If none was saved, Deplexo supplies `3000`.

Keep a saved `PORT` between `1` and `65535`. An invalid saved value stays in the runtime environment even though routing falls back to port `3000`, so correct or remove it before restoring dashboard settings.

Your HTTP server must listen on `0.0.0.0` and the configured port. A Dockerfile `EXPOSE` instruction alone does not configure routing or start a listener.

For a queue consumer, polling bot, or Discord Gateway bot, use `type: worker` and omit `run.port`:

```yaml
version: 1
type: worker

build:
  framework: dockerfile
  dockerfile: Dockerfile
```

Workers receive no application hostname, published port, or custom-domain route. Startup checks that the process keeps running and honors any health check defined by its image. It does not require an HTTP listener. One-shot tasks and scheduled jobs are not supported by this format.

## Validation and migration

The configuration must be one YAML mapping in one document, at most 8 KiB. Unknown fields, duplicate fields, anchors, aliases, merge keys, and `null` values are rejected. Keep `version` and `run.port` as unquoted integers. Do not use absolute paths or paths that escape the source tree. Validation errors identify the field and line where available.

Older flat configuration files must be migrated before deployment:

| Old field | Current field |
| --- | --- |
| No version | Add `version: 1` |
| `framework` | `build.framework`, using `auto` or `dockerfile` |
| `dockerfile` | `build.dockerfile` |
| `install` | `build.install` |
| `build` command string | `build.command` inside the `build` mapping |
| `start` | `run.command` |
| `port` | `run.port`, for web apps only |

Move a configuration stored inside a monorepo application folder to the repository root and set `build.root_dir`. Review the new YAML precedence when migrating; dashboard commands no longer override explicit YAML commands.

<span id="dashboard-settings"></span>

## Settings managed in the dashboard

Keep secrets, environment variables other than YAML-controlled `PORT`, domains, region, resource limits, storage, and automatic deployment settings in the dashboard. YAML does not define multiple services, replicas, environment overlays, or release orchestration.

- [Environment variables](/guides/environment/)
- [Storage and mounts](/operations/storage/)
- [Deployment lifecycle](/operations/deployments/)
