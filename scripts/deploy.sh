#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
if [[ -n "$(git status --porcelain)" ]]; then
  printf '%s\n' 'Commit or discard local changes before deploying.' >&2
  exit 1
fi
revision=$(git rev-parse HEAD)
image="deplexo-docs:$revision"
docker build --label "org.opencontainers.image.revision=$revision" --tag "$image" --tag deplexo-docs:current .
DEPLEXO_DOCS_IMAGE="$image" docker compose --file deploy/compose.yaml up --detach --wait --wait-timeout 60
curl --fail --silent --show-error http://127.0.0.1:8094/healthz
printf 'Deployed docs revision %s\n' "$revision"
