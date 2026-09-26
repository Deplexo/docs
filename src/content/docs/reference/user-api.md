---
title: User API
description: Use the Deplexo REST API to list apps, create deployments, read logs, and manage configuration with scoped credentials.
---

Use the user API to manage Deplexo from scripts, CI jobs, or your own tools. The [Deplexo CLI](/guides/cli/) uses this API too.

The base URL is `https://deplexo.com/user/api/v1`. Requests and responses use JSON, except for ZIP uploads and log streams. The [interactive API reference](https://deplexo.com/user/api/v1/docs) and [OpenAPI document](https://deplexo.com/user/api/v1/docs/openapi.yaml) provide endpoint schemas.

## Authentication

Create a key in [API keys](https://deplexo.com/api-keys) and select the permissions your tool needs. Save the key in a secret manager. Send it in the `Authorization` header:

```http
Authorization: Bearer dplx_your_api_key
```

The examples below expect your secret manager to supply `DEPLEXO_TOKEN`. Keep tokens out of source files, URLs, and logs. Revoke a key from the dashboard when it is no longer needed or has been exposed.

The API also accepts access tokens issued through device sign-in. Use `deplexo auth login` for the CLI's browser approval flow and credential storage.

## Permissions

Scopes limit what a credential can do. They do not grant access to another account's resources.

| Scope | Access |
| --- | --- |
| `profile:read` | Read your identity through `/profile`; include identity fields in `/me`. |
| `app:read` | Read app inventory, app details, deployment history, usage, and alerts. |
| `app:deploy` | Create apps, upload source ZIPs, cancel deployments, and change build or automatic deployment settings. |
| `app:restart` | Rebuild and redeploy an existing app. |
| `app:start` | Start a stopped app. |
| `app:stop` | Stop an app. |
| `app:delete` | Delete an app. |
| `env:read` | Read environment variable listings with masked values. |
| `env:write` | Create, update, import, or delete environment variables. |
| `domain:read` | List custom domains. |
| `domain:write` | Add, verify, or delete custom domains. |
| `logs:read` | Read build and runtime logs. |

A rebuild with `commitSha` or a replacement `sourceId` needs both `app:restart` and `app:deploy`. App details include build logs only when the credential also has `logs:read`.

## List your apps

Use `GET /me` with `app:read`. The response includes an `apps` array with app UUIDs, names, and statuses, along with plan and platform information. The `user` field is included only with `profile:read`.

```sh
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer $DEPLEXO_TOKEN" \
  https://deplexo.com/user/api/v1/me
```

Use an app's UUID in paths such as `/apps/{id}`. `GET /profile` needs `profile:read` and returns `id`, `email`, `name`, and `avatar_url` without the app inventory.

## Create an app from Git

`POST /deploy` creates an app and its first deployment. It needs `app:deploy`. Replace the example repository URL and app name with your own. Connect your Git provider in the dashboard first if the repository is private.

```sh
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer $DEPLEXO_TOKEN" \
  -H 'Content-Type: application/json' \
  --data '{"repoUrl":"https://github.com/example/my-app","name":"my-app"}' \
  https://deplexo.com/user/api/v1/deploy
```

Optional fields include `framework`, `rootDir`, `dockerfilePath`, `installCommand`, `buildCommand`, `startCommand`, `mountPath`, `workerId`, and an `env` map. Check the API reference for their schemas.

A `202 Accepted` response includes `appId`, `deploymentId`, and `status`. It means the deployment was accepted, not that the app is running. Use the returned deployment UUID to read its build logs. If a request times out after submission, check your app inventory before retrying creation.

## Rebuild an existing app

`POST /apps/{id}/restart` rebuilds and redeploys the app. For Git apps, an empty JSON body uses the latest source. This endpoint needs `app:restart`.

```sh
APP_ID=11111111-1111-4111-8111-111111111111
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer $DEPLEXO_TOKEN" \
  -H 'Content-Type: application/json' \
  --data '{}' \
  "https://deplexo.com/user/api/v1/apps/$APP_ID/restart"
```

Replace the example UUID with your app's ID. To rebuild a particular Git revision, send `{"commitSha":"your-commit-sha"}` and include `app:deploy` in the credential's scopes. The API does not provide a process-only restart through this endpoint.

Use `POST /apps/{id}/stop` to stop an app, `POST /apps/{id}/start` to start a stopped app, and `POST /apps/{id}/cancel` to cancel its current deployment. Each requires the scope listed above. Stopping an app and cancelling a deployment are separate actions.

## Read deployment history and logs

```sh
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer $DEPLEXO_TOKEN" \
  "https://deplexo.com/user/api/v1/apps/$APP_ID/deployments?limit=20&offset=0"
```

Deployment history needs `app:read`. With `logs:read`, request `GET /deployments/{id}/logs` for a deployment's status and build log snapshot, or `GET /apps/{id}/logs/runtime` for recent runtime output.

Runtime responses contain `lines` and `nextSince`. To request later lines, pass `nextSince` unchanged as the next request's `since` parameter and URL-encode it. App runtime logs default to 500 lines and accept a `limit` up to 1,000. Use the [CLI's log commands](/guides/cli/#read-logs) to follow logs without writing a polling loop.

## Upload a ZIP

The API accepts source archives even though the CLI does not yet expose upload commands. Send the ZIP as the raw request body to `POST /sources` with `app:deploy`, `Content-Type: application/zip`, `Content-Length`, and a `Content-Disposition` filename:

```sh
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer $DEPLEXO_TOKEN" \
  -H 'Content-Type: application/zip' \
  -H 'Content-Disposition: attachment; filename="project.zip"' \
  --data-binary @project.zip \
  https://deplexo.com/user/api/v1/sources
```

With a local file, curl supplies the content length. The archive limit is 50 MiB compressed, 512 MiB expanded, 128 MiB per file, and 10,000 entries. Unsafe paths, links, encrypted archives, ZIP64, and invalid checksums are rejected.

Use the returned `id` as `sourceId` in `POST /deploy`, omitting `repoUrl`. To update an existing ZIP app, send the new `sourceId` to `/apps/{id}/restart` with both `app:restart` and `app:deploy`. Do not combine `sourceId` with `commitSha`.

Unused uploads expire after 24 hours. An app or active deployment keeps its source available. You can discard an unused upload with `DELETE /sources/{id}`. One upload per user and four across the platform can run at once; wait before retrying a concurrency rejection.

## Other endpoints

All paths below are relative to `/user/api/v1`. The [API reference](https://deplexo.com/user/api/v1/docs) lists request bodies and response fields.

| Task | Endpoints | Scope |
| --- | --- | --- |
| Inspect an app | `GET /apps/{id}` | `app:read` |
| List recent deployments | `GET /deployments/recent` | `app:read` |
| Change build settings | `PATCH /apps/{id}/build` | `app:deploy` |
| Set automatic deployment | `PUT /apps/{id}/auto-deploy` | `app:deploy` |
| List environment variables | `GET /apps/{id}/env`, `GET /env` | `env:read` |
| Change environment variables | `PUT /apps/{id}/env`, `DELETE /apps/{id}/env/{key}`, `POST /apps/{id}/env/import` | `env:write` |
| List domains | `GET /domains` | `domain:read` |
| Manage domains | `POST /domains`, `POST /domains/{id}/verify`, `DELETE /domains/{id}` | `domain:write` |
| Read workspace runtime logs | `GET /logs/runtime` | `logs:read` |
| Read usage | `GET /usage`, `GET /usage/timeseries`, `GET /apps/{id}/live-stats` | `app:read` |
| Read alerts | `GET /alerts`, `GET /apps/{id}/alert-rules` | `app:read` |
| Delete an app | `DELETE /apps/{id}` | `app:delete` |

Deleting an app removes its persistent data volume. Export data you need before sending a delete request. Environment changes apply to a new container; follow the [environment guide](/guides/environment/#apply-changes) after updating values.

## Pagination, errors, and rate limits

Paginated lists accept `limit` and `offset`. The default limit is 50 and the maximum is 200. Responses include `data` and a `pagination` object with `total`, `limit`, `offset`, and `has_more`. This format applies to paginated lists such as deployment history; app inventory and runtime logs use the response shapes described above.

Errors have this shape:

```json
{"error":{"code":"not_found","message":"not found"}}
```

| HTTP status | What to check |
| --- | --- |
| `400` | Request fields, IDs, or query parameters are invalid. |
| `401` | The credential is missing, invalid, expired, or revoked. |
| `402` | The request exceeds a plan limit. |
| `403` | The credential lacks a required scope or access is denied. |
| `404` | The resource was not found. |
| `409` | A deployment is already in progress or the request conflicts with existing state. |
| `413` | The upload is too large or its content length is missing or invalid. |
| `429` | A request rate, upload concurrency, or upload quota limit was reached. |
| `503` | A required service is temporarily unavailable. |

Rate-limited responses use `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`; reset is a Unix timestamp. A rate-limit rejection includes `Retry-After` in seconds. Respect that delay and avoid tight retry loops. Upload rejections can also return `429`, so read the error body rather than assuming every rejection has the same cause.
