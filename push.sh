#!/bin/bash
# Push to GitHub using GITHUB_TOKEN from environment.
# Run this from the Replit Shell tab after the agent makes changes.
# WSL2 auto-deploy watcher will pick up the new commit within 60 seconds.

set -euo pipefail

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "❌ GITHUB_TOKEN не задан в Replit Secrets"
  exit 1
fi

echo "machine github.com login RacconVl password ${GITHUB_TOKEN}" > ~/.netrc
chmod 600 ~/.netrc

COMMIT=$(git rev-parse --short HEAD)
MSG=$(git log -1 --pretty=%s)

echo "📤 Отправляю коммит на GitHub..."
echo "   Коммит: $COMMIT — $MSG"

git push origin main

echo ""
echo "✅ Готово! Коммит $COMMIT запушен на GitHub."
echo "   WSL2 подхватит изменения автоматически в течение ~60 секунд."
echo "   Следите за логами: journalctl --user -u vvsu-deploy-watcher -f"
