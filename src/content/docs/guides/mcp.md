---
title: Connect an AI agent with MCP
description: Configure Deplexo MCP in Codex, Claude Code, or Cursor, approve access, and verify your connection.
---

Connect your AI client to Deplexo to inspect your apps and deploy Git repositories from a conversation.

| Setting | Value |
| --- | --- |
| Server URL | `https://deplexo.com/mcp` |
| Transport | Streamable HTTP |
| Authentication | OAuth in your browser |

Your client must support remote Streamable HTTP servers, OAuth authorization code with PKCE, dynamic client registration, and resource indicators. Deplexo handles sign-in and permission approval; the client stores and refreshes its tokens. You do not need to create or copy an API key.

## Connect

1. Open your client's MCP server settings and add a remote HTTP server named `deplexo` with the URL above.
2. Choose its **Connect**, **Authenticate**, or **Sign in** action. The label depends on the client.
3. In the browser, sign in to Deplexo and complete two-factor authentication if enabled.
4. Review the client name, signed-in account, callback URL, and requested permissions, then choose **Allow access**.
5. Return to your client and confirm that Deplexo's tools are available.

Deplexo may ask you to confirm your credentials again if your last authentication is no longer recent. Only approve clients you intended to connect; a registered client's name does not verify its publisher.

### Codex

Add the server from your terminal:

```sh
codex mcp add deplexo --url https://deplexo.com/mcp
```

Complete browser approval. If sign-in does not start, run `codex mcp login deplexo`. Start Codex and use `/mcp` to check the connection. The CLI and IDE extension share the server configuration.

See [Codex's MCP documentation](https://developers.openai.com/codex/mcp/) for configuration files and IDE settings.

### Claude Code

Add the server from your terminal:

```bash
claude mcp add --transport http deplexo https://deplexo.com/mcp
```

Start Claude Code, run `/mcp`, select `deplexo`, and follow the authentication action. Complete the browser approval, then return to Claude Code.

See [Claude Code's MCP documentation](https://code.claude.com/docs/en/mcp) for configuration scopes and client-specific troubleshooting.

### Cursor

Add this entry to your project's `.cursor/mcp.json`, or use `~/.cursor/mcp.json` to make it available across projects. Merge it into any existing `mcpServers` object.

```json
{
  "mcpServers": {
    "deplexo": {
      "url": "https://deplexo.com/mcp"
    }
  }
}
```

Open Cursor's MCP settings, find `deplexo`, and use its connection or authentication action to complete browser approval. This configuration contains only the server URL; do not add access tokens to the file.

See [Cursor's MCP documentation](https://cursor.com/docs/context/mcp) for the current settings interface.

## Check the connection

Ask your agent:

```text
Use Deplexo to show my account and list my apps. Do not change anything.
```

The agent should call `get_account` and `list_apps`. Check that the returned account is the one you intended to use before requesting a deployment.

## Available tools

| Tool | What it does | Required scope |
| --- | --- | --- |
| `get_account` | Read the connected account | `profile:read` |
| `list_apps` | List the account's apps | `app:read` |
| `get_app` | Read one app's state | `app:read` |
| `deploy_app` | Create an app and queue a Git deployment | `app:deploy` |
| `redeploy_app` | Queue a redeployment of an existing app | `app:restart` |
| `get_deployment` | Read deployment status and build logs | `logs:read` |

Deployment tools use your account's ownership checks and plan limits. `deploy_app` accepts `name`, `repo_url`, and optional `root_dir`, `framework`, and `env`. Private repositories must be accessible through the Git provider connected to your Deplexo account. For custom install, build, or start commands and Dockerfile paths, commit a [deplexo.yaml configuration](/reference/configuration/) with your source; these are not separate `deploy_app` arguments.

MCP deploys committed Git source; it does not upload uncommitted files from your computer. It currently has no tools for app start/stop/delete, database provisioning, runtime log streaming, domain changes, or environment-variable editing after app creation. Use the [CLI start/stop commands](/guides/cli/#start-stop-or-cancel), dashboard, or [public API](/reference/user-api/) for supported operations outside this tool set. CLI authentication is separate from your MCP connection; start and stop require `app:start` and `app:stop` on the CLI's credential.

A queued deployment is not yet live. Keep its returned `deployment_id`, check it with `get_deployment`, and verify the application URL when it succeeds. Build logs include at most the last 32 KiB and report truncation. If creation times out, list your apps before retrying so you do not create a duplicate.

## Give an agent the deployment guide

Copy this prompt into your coding agent:

```text
Set this project up to deploy on Deplexo. Fetch https://deplexo.com/agent.md and follow it.
```

The landing page's **Deploy with your AI agent** button copies this prompt. The [agent guide](https://deplexo.com/agent.md) describes connection, project inspection, deployment, and verification. Your client still needs an MCP connection or the Deplexo CLI to carry out those steps.

## Disconnect or change accounts

In Deplexo, open **Settings → Security → Connected clients** and revoke the client's access. Removing a server from your editor and revoking its grant on Deplexo are separate actions. To use another account, revoke the old grant, reconnect, and check the account on the approval page.

MCP tokens are restricted to `https://deplexo.com/mcp`. CLI tokens and API keys authenticate the REST API and cannot be reused for MCP. See the [CLI guide](/guides/cli/) for terminal sign-in and automation.

## Troubleshooting

- **A direct request to `/mcp` returns 401:** this is expected before authentication. Connect through an OAuth-capable MCP client; opening the URL in a browser does not sign the client in.
- **The client asks for an API key or client secret:** select its OAuth flow. Deplexo uses public client registration without a client secret. If the client lacks this flow, update it or use a supported client.
- **A tool reports a missing permission:** reconnect and review the requested scopes. Approval does not bypass your account's plan or app ownership restrictions.
- **Access expired or was revoked:** reconnect through browser approval. Clients normally rotate refresh tokens automatically; do not copy old tokens between clients.
- **A browser-only integration hits CORS errors:** Deplexo does not enable cross-origin browser requests to MCP. Use a native client or an integration that calls the server from its backend.

## For client implementers

Discover endpoints through [authorization-server metadata](https://deplexo.com/.well-known/oauth-authorization-server) and [protected-resource metadata](https://deplexo.com/.well-known/oauth-protected-resource/mcp). Use authorization code with S256 PKCE and `resource=https://deplexo.com/mcp`. Callbacks must use HTTPS or literal-loopback HTTP; only the loopback port may vary from registration.

Access tokens last 15 minutes. Refresh tokens rotate on use, and replay of a correctly bound consumed code or refresh token revokes its grant. Store credentials in your client's protected credential storage.
