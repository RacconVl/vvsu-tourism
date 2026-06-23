#!/bin/bash
# auto-deploy.sh
# Runs on WSL2 — polls GitHub every 60s, auto-rebuilds Docker when new commit detected.
# Usage:
#   bash auto-deploy.sh                    # runs in foreground
#   nohup bash auto-deploy.sh &> deploy.log &   # runs in background (survives terminal close)

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
POLL_INTERVAL="${DEPLOY_POLL_INTERVAL:-60}"
BRANCH="main"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

cd "$REPO_DIR"

log "🚢 Auto-deploy watcher started"
log "   Repo:     $REPO_DIR"
log "   Branch:   $BRANCH"
log "   Interval: ${POLL_INTERVAL}s"
log ""

LAST_DEPLOYED="$(git rev-parse HEAD)"
log "   Current commit: $LAST_DEPLOYED"
log ""

while true; do
  sleep "$POLL_INTERVAL"

  # Fetch silently
  if ! git fetch origin "$BRANCH" --quiet 2>/dev/null; then
    log "⚠️  git fetch failed (no internet?), retrying in ${POLL_INTERVAL}s"
    continue
  fi

  REMOTE_COMMIT="$(git rev-parse "origin/$BRANCH")"

  if [ "$REMOTE_COMMIT" = "$LAST_DEPLOYED" ]; then
    continue
  fi

  log "🆕 New commit detected: $REMOTE_COMMIT"
  log "   (was: $LAST_DEPLOYED)"

  # Pull
  log "📥 Pulling changes..."
  git pull origin "$BRANCH" --ff-only

  # Rebuild and restart containers
  log "🐳 Rebuilding Docker containers..."
  docker compose up -d --build

  LAST_DEPLOYED="$REMOTE_COMMIT"
  log "✅ Deploy complete! Commit: $LAST_DEPLOYED"
  log ""
done
