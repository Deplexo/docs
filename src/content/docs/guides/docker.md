---
title: "Docker and builds"
description: "Make your build reproducible and your container compatible with Deplexo's runtime."
---

<span id="build-methods"></span>

## Choose a build method

Use a Dockerfile to control system packages, compilation, assets, and startup. Choose a framework-generated build if its install, build, and start steps fit your app.

Select the intended method in the dashboard or set `build.framework` in YAML. An explicit YAML value overrides the dashboard selection. A nonempty Dockerfile path still selects a custom build, so clear any saved path when switching to `auto`. Dockerfile builds require the selected file inside the build context.

- [Repository configuration](/reference/configuration/)

<span id="reproducible-images"></span>

## Build a reproducible image

Commit dependency lockfiles and use clean install commands such as npm ci. Use multiple build stages to keep compilers and development dependencies out of the runtime image. Copy dependency manifests before source so unchanged dependencies can reuse build cache.

Use .dockerignore to exclude local dependencies, build output, git history, credentials, and editor files. Install dependencies while building the image; the runtime filesystem is read-only and is not intended for package installation.

```text
node_modules
.next
dist
.git
.env
.env.*
!.env.example
*.log
```

<span id="process-and-network"></span>

## Start the correct process

Use an exec-form CMD so the application process receives termination signals. Run a production server or compiled binary, not a development watcher. Web applications must listen on 0.0.0.0 and the configured PORT; exposing a Dockerfile port does not make a server listen on it.

Set `build.framework: dockerfile` in a version 1 `deplexo.yaml` at the source root. Use `build.root_dir` for a subdirectory and `build.dockerfile` for a path relative to that build context. Dockerfile builds use the file's own build steps. A nonempty `run.command` overrides its `CMD` through `/bin/sh -c`; the image needs that shell, and any `ENTRYPOINT` remains in effect. For a web app, `run.port` sets routing and the runtime `PORT`; for a background worker, set `type: worker` and omit the port. See the [configuration reference](/reference/configuration/).

Background processes should run in the foreground until stopped. Avoid scripts that launch the actual worker in the background and immediately exit.

```dockerfile
CMD ["node", "server.js"]
```

<span id="runtime-permissions"></span>

## Test runtime permissions

Run the image as an unprivileged user and check that it can read the packaged assets. Containers run without added capabilities and with a read-only root. Writable locations are the temporary directory and configured persistent mount.

Check that the image user can write to the directory where the app stores data. Compiled application binaries belong in the image, because the temporary and data mounts are not executable. Test with these constraints before deployment.

- [Filesystem constraints](/operations/storage/)

<span id="diagnose-build-failures"></span>

## Diagnose build failures

Find the first failing build step and read the lines before it. A missing lockfile, case-sensitive path mismatch, absent package script, or incorrect root directory can explain a build that worked locally.

Reproduce the build from a fresh checkout and committed files. Check the failing command and resource usage before changing limits. A successful image build still needs a working start command and runtime configuration.

- [Build and runtime logs](/operations/logs/)
- [Troubleshooting](/operations/troubleshooting/)
