---
title: "Build and runtime logs"
description: "Find the failing stage, inspect process output, and collect evidence to resolve an issue."
---

<span id="build-logs"></span>

## Read the deployment's build logs

Open the application and select the relevant deployment. Build logs show checkout, dependency installation, compilation, image creation, and startup. Confirm that the deployment uses the intended commit and branch.

Find the first actionable error, not just the final failure message. Read preceding lines for the command, file path, and package involved. Missing files can indicate an incorrect root directory or an uncommitted file.

<span id="runtime-logs"></span>

## Inspect the running process

Open the application's Logs tab for process output after startup. Write diagnostics to standard output or standard error for Deplexo to collect. A framework writing only to a private file will not automatically make that file visible in the log stream.

Log useful milestones and failures: connecting to a database, authenticating a bot, handling a request, or retrying a dependency. Include timestamps and request or job identifiers when they connect related events.

- [Open logs](https://deplexo.com/logs)

<span id="correlate-an-incident"></span>

## Compare the event with the deployment

Record when the failure occurred, the application and deployment involved, and the action that triggered it. Check whether the problem began after a code deployment, credential rotation, or resource change.

For intermittent failures, compare the error with resource usage and restarts. A container can start successfully and later fail because a dependency is unreachable or a limit is exceeded. Build success and application behavior are separate signals.

<span id="share-useful-evidence"></span>

## Share useful, safe evidence

Include the application name, deployment ID, commit SHA, approximate time, reproduction steps, and a short log excerpt in a support request. Explain the expected response and the actual result.

Redact tokens, database URLs containing passwords, authorization headers, and sensitive user content. Do not assume every library log line is automatically scrubbed. Maintain a separate retention or export plan if you need long-term log history.

- [Contact support](https://deplexo.com/support)
- [Troubleshooting guide](/operations/troubleshooting/)
