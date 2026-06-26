#!/bin/bash
set -e

COMPOSE_FILE="docker-compose.yml"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== VVSU Tourism — Deploy ==="
echo "Dir: $PROJECT_DIR"

cd "$PROJECT_DIR"

echo ""
echo "▶ git pull origin main..."
git pull origin main

echo ""
echo "▶ Rebuilding images..."
docker compose -f "$COMPOSE_FILE" build --no-cache web api

echo ""
echo "▶ Restarting services..."
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo "▶ Waiting for containers..."
sleep 3
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo "✓ Deploy done! http://localhost:8888"
