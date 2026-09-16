---
title: "Storage and filesystem"
description: "Choose the right location for temporary files, persistent application data, and backups."
---

<span id="read-only-root"></span>

## Application files are read-only

The image contains code, assets, and installed dependencies. Its root filesystem is read-only at runtime. Writing beside source files, installing packages at startup, or creating a cache under the application directory can fail.

Build executable files and dependencies into the image. Configure framework caches, session files, and uploads to use appropriate writable locations. An unprivileged application user must also have permission to write there.

<span id="temporary-files"></span>

## Use /tmp for disposable files

The temporary directory is writable and limited to 100 MB. Use it for small intermediate files the application can recreate. Its contents are not durable across container replacement.

The temporary mount does not allow execution. Do not download a binary into /tmp and expect to run it. Clean up temporary uploads and processing files promptly so one request cannot exhaust the available space.

<span id="persistent-data"></span>

## Use the data mount for durable files

Each application has a named data volume mounted at /data by default. Files there survive container restarts and replacements on the same worker. Configure the mount path in application settings when a framework expects another location.

Store SQLite databases, uploads, and necessary local state here. Test filesystem ownership with the production image user. The data mount does not allow execution; application binaries belong in the image.

```text
UPLOAD_DIRECTORY=/data/uploads
SQLITE_PATH=/data/app.db
```

<span id="durability-boundaries"></span>

## Know the durability boundary

The volume belongs to the worker hosting the application. It is not a shared filesystem across regions or independent apps. Do not assume recreating the app on another worker transfers its files.

Deleting an application removes its data volume. Export data before deletion or migration. Resource limits apply to stored data too; monitor disk usage and clean up files no longer needed.

<span id="backups"></span>

## Keep backups outside the application

Back up to an independent destination and test restoration. Use database-aware backup methods for SQLite or another database so backups are consistent while the application runs.

Use external object storage for large uploads or files needing independent durability and distribution. A mounted volume preserves files across redeployment, but does not replace a backup plan.

- [Deployment lifecycle](/operations/deployments/)
- [Troubleshoot storage](/operations/troubleshooting/#filesystem-errors)
