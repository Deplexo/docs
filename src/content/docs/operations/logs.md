---
title: "Build and runtime logs"
description: "Find the failing stage, inspect process output, and collect evidence to resolve an issue."
---

<span id="build-logs"></span>

## Read the deployment's build logs

Open the application and select the relevant deployment. Build logs show checkout, dependency installation, compilation, image creation, and startup. Confirm that the deployment uses the intended commit and branch.

Find the first error that explains what failed. The lines before it often identify the command, file path, or package involved. Missing files can indicate an incorrect root directory or an uncommitted file.

<span id="runtime-logs"></span>

## Inspect the running process

Open the application's Logs tab for process output after startup. Write diagnostics to standard output or standard error for Deplexo to collect. If your framework writes logs only to a file, those messages will not appear in the log stream.

Log useful milestones and failures: connecting to a database, authenticating a bot, handling a request, or retrying a dependency. Include timestamps and request or job identifiers when they connect related events.

- [Open logs](https://deplexo.com/logs)

To read logs from a terminal, use the [CLI log commands](/guides/cli/#read-logs). The [user API](/reference/user-api/#read-deployment-history-and-logs) provides build log snapshots and runtime log cursors for scripts.

<span id="correlate-an-incident"></span>

## Compare the event with the deployment

Record when the failure occurred, the application and deployment involved, and the action that triggered it. Check whether the problem began after a code deployment, credential rotation, or resource change.

For intermittent failures, compare the error with resource usage and restarts. A container can start successfully and later fail because a dependency is unreachable or a limit is exceeded. Test the affected feature even when the build succeeded.

<span id="share-useful-evidence"></span>

## Share useful, safe evidence

Include the application name, deployment ID, commit SHA, approximate time, reproduction steps, and a short log excerpt in a support request. Explain the expected response and the actual result.

Redact tokens, database URLs containing passwords, authorization headers, and sensitive user content. Do not assume every library log line is automatically scrubbed. Export logs or store them separately if you need a longer history.

- [Contact support](https://deplexo.com/support)
- [Troubleshooting guide](/operations/troubleshooting/)
