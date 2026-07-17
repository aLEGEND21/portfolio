#!/usr/bin/env bash
# Runs ON the VPS. Swaps the running container back to the previous release.
#
# Usage: rollback.sh
set -euo pipefail

IMAGE="portfolio"
STATE_DIR="/opt/portfolio"
PORT=3000

PREVIOUS="$(cat "$STATE_DIR/previous" 2>/dev/null || true)"
if [ -z "$PREVIOUS" ]; then
  echo "No previous release recorded in $STATE_DIR/previous" >&2
  exit 1
fi
CURRENT="$(cat "$STATE_DIR/current" 2>/dev/null || true)"

echo "Rolling back to $IMAGE:$PREVIOUS"
docker rm -f "$IMAGE" > /dev/null 2>&1 || true
docker run -d --name "$IMAGE" --restart unless-stopped \
  --network nginx-proxy \
  -p "$PORT:3000" "$IMAGE:$PREVIOUS" > /dev/null

# The rolled-back release is now current; keep the old one for rolling forward.
echo "$PREVIOUS" > "$STATE_DIR/current"
if [ -n "$CURRENT" ]; then
  echo "$CURRENT" > "$STATE_DIR/previous"
fi

echo "Rolled back to $IMAGE:$PREVIOUS"
