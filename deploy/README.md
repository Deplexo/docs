# Hosting the docs

Nginx serves the static documentation from an unprivileged container. Docker Compose binds it to `127.0.0.1:8094`; an existing Cloudflare Tunnel publishes `https://docs.deplexo.com`. Cloudflare handles public TLS. The site needs no database or writable application data.

## Deploy an update

Install Docker Engine and Docker Compose, clone this repository on the host, and check out a reviewed commit. From the repository root, run:

```sh
bash scripts/deploy.sh
```

The script requires a clean checkout, builds an image tagged with the full Git commit, and waits for the container health check. Docker restarts the service after a host reboot. Replacing the single container may briefly interrupt requests. GitHub Actions validates changes; it does not automatically deploy them.

## Connect Cloudflare

Add an ingress rule to the existing locally managed tunnel, before its final catch-all rule:

```yaml
- hostname: docs.deplexo.com
  service: http://127.0.0.1:8094
```

Validate the candidate configuration with `cloudflared --config /path/to/config.yml tunnel ingress validate`. Back up the current configuration before applying the change, then restart the tunnel connector using its service manager. On a tunnel shared with other sites, run a temporary connector during the restart to keep routes available.

Using the existing authenticated Cloudflare installation, create the DNS record with `cloudflared tunnel route dns TUNNEL_NAME_OR_ID docs.deplexo.com`. Do not overwrite a conflicting record without investigating it. Keep tunnel credentials and account certificates outside this repository.

## Verify and operate

```sh
docker compose --file deploy/compose.yaml ps
docker compose --file deploy/compose.yaml logs --tail 100 docs
curl --fail http://127.0.0.1:8094/healthz
curl --fail https://docs.deplexo.com/
curl --fail https://docs.deplexo.com/sitemap-index.xml
```

Check search in a browser and confirm that an unknown page returns HTTP 404. Register the sitemap in Search Console using an account with access to the domain.

To roll back to a previously built image:

```sh
DEPLEXO_DOCS_IMAGE=deplexo-docs:PREVIOUS_FULL_COMMIT docker compose --file deploy/compose.yaml up --detach --wait --wait-timeout 60
```

Keep previous image tags until you have verified the current deployment. The Compose service uses a read-only filesystem, drops Linux capabilities, limits memory and process count, and rotates logs.
