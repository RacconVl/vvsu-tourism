#!/bin/bash
# Push to GitHub using GITHUB_TOKEN from environment
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN не задан в Replit Secrets"
  exit 1
fi
echo "machine github.com login RacconVl password ${GITHUB_TOKEN}" > ~/.netrc
chmod 600 ~/.netrc
git push origin main
echo "✅ Запушено на GitHub"
