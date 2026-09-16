---
title: "deplexo.yaml reference"
description: "Configure Dockerfile paths, generated builds, commands, and runtime ports."
---

<span id="file-location"></span>

## Place the file in the application root

Add deplexo.yaml to the application directory used as the build context. For a monorepo, choose that directory with Root directory in the dashboard. The file belongs alongside the application's Dockerfile or dependency manifest.

Repository settings are versioned with code. Keep secrets in environment variables, and use the dashboard for resources, region, persistent mount path, and automatic deployment settings.

```yaml
framework: dockerfile
dockerfile: Dockerfile
port: 3000
```

<span id="framework-and-dockerfile"></span>

## framework and dockerfile

framework selects a generated build preset: auto, node, python, go, ruby, rust, java, php, elixir, static, or dockerfile. auto detects the framework from repository files. An explicit dashboard framework takes precedence over repository framework detection.

dockerfile selects a path relative to the configured application root. Keep COPY sources inside the build context. Use the Dockerfile to define custom build steps and CMD when choosing a Dockerfile build.

<span id="install-build-start"></span>

## install, build, and start

install replaces the generated dependency installation command. build runs the application build after installation. start sets the runtime command for a generated image. For custom Dockerfiles, put these steps in the Dockerfile itself.

Nonempty dashboard command overrides take precedence over corresponding repository commands. Avoid conflicting values in both places. Clear an override when the repository should control that command again.

```yaml
framework: node
install: npm ci
build: npm run build
start: npm start
port: 3000
```

<span id="service-and-port"></span>

## Ports and background processes

For a web application, set PORT in the deployment form to the port the server listens on, and bind to 0.0.0.0. All official web starters use port 3000. A Dockerfile EXPOSE instruction documents a port; it does not configure Deplexo's routing.

The YAML port field is used by generated build configuration. Set the runtime PORT variable explicitly as well instead of relying on YAML alone. The current runtime defaults to port 3000 when PORT is absent or invalid.

For a polling bot or Discord Gateway bot, the process does not need an HTTP listener. Use its Dockerfile and credentials. Deplexo currently assigns a URL and checks a port even for these processes; verify the bot in Telegram or Discord and inspect its logs. There is no service-type field in the current deplexo.yaml format.

<span id="dashboard-settings"></span>

## Settings managed in the dashboard

Set the repository, root directory, region, and resource choices in the deployment form. Environment variables supply runtime configuration. The persistent mount defaults to /data and can be changed in application settings.

Review effective dashboard settings when a build behaves differently from the repository file. Record intentional overrides in project documentation so teammates can reproduce the deployment.

- [Environment variables](/guides/environment/)
- [Storage and mounts](/operations/storage/)
