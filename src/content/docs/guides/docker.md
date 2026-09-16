---
title: "Docker and builds"
description: "Make your build reproducible and your container compatible with Deplexo's runtime."
---

<span id="build-methods"></span>

## Choose a build method

Bring a Dockerfile for explicit control over system packages, compilation, assets, and startup. Framework-generated builds are useful when standard install, build, and start steps fit your application.

Select the intended method in the dashboard. When Dockerfile is selected, the repository must contain it at the configured path. Adding framework settings alone does not override an explicitly selected Dockerfile build.

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

Background processes should run in the foreground until stopped. Avoid scripts that launch the actual worker in the background and immediately exit.

```dockerfile
CMD ["node", "server.js"]
```

<span id="runtime-permissions"></span>

## Test runtime permissions

Use an unprivileged image user and ensure it can read packaged assets. Containers run without added capabilities and with a read-only root. Writable locations are the temporary directory and configured persistent mount.

Ensure the image user can write where the app needs to persist data. Compiled application binaries belong in the image, because the temporary and data mounts are not executable. Test with these constraints before deployment.

- [Filesystem constraints](/operations/storage/)

<span id="diagnose-build-failures"></span>

## Diagnose build failures

Read the first failing build step and the preceding lines. A missing lockfile, case-sensitive path mismatch, absent package script, or incorrect root directory can explain a build that worked locally.

Reproduce the build from a fresh checkout and committed files. Check the failing command and resource usage before changing limits. A successful image build still needs a working start command and runtime configuration.

- [Build and runtime logs](/operations/logs/)
- [Troubleshooting](/operations/troubleshooting/)
