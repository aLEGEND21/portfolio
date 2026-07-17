#!/usr/bin/env bash
# Runs ON the VPS. Starts the container for the given image tag, health-checks
# it, and automatically falls back to the previous release if it won't serve.
#
# Usage: deploy.sh <image-tag>
set -euo pipefail

IMAGE="portfolio"
TAG="${1:?usage: deploy.sh <image-tag>}"
STATE_DIR="/opt/portfolio"
PORT=3000

mkdir -p "$STATE_DIR"
CURRENT="$(cat "$STATE_DIR/current" 2>/dev/null || true)"

start_container() {
  docker rm -f "$IMAGE" > /dev/null 2>&1 || true
  docker run -d --name "$IMAGE" --restart unless-stopped \
    --network nginx-proxy \
    -p "$PORT:3000" "$IMAGE:$1" > /dev/null
}

healthy() {
  for _ in $(seq 1 30); do
    curl -sf -o /dev/null "http://localhost:$PORT" && return 0
    sleep 1
  done
  return 1
}

echo "Deploying $IMAGE:$TAG"
start_container "$TAG"

if ! healthy; then
  echo "Health check failed for $IMAGE:$TAG" >&2
  if [ -n "$CURRENT" ]; then
    echo "Restoring $IMAGE:$CURRENT" >&2
    start_container "$CURRENT"
  fi
  exit 1
fi

if [ -n "$CURRENT" ] && [ "$CURRENT" != "$TAG" ]; then
  echo "$CURRENT" > "$STATE_DIR/previous"
fi
echo "$TAG" > "$STATE_DIR/current"

# Prune all release images except current and previous.
PREVIOUS="$(cat "$STATE_DIR/previous" 2>/dev/null || echo none)"
docker images "$IMAGE" --format '{{.Tag}}' |
  grep -v -e "^$TAG$" -e "^$PREVIOUS$" |
  xargs -r -I{} docker rmi "$IMAGE:{}" > /dev/null 2>&1 || true

echo "Deployed $IMAGE:$TAG"
