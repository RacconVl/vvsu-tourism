#!/bin/sh
set -e

echo "⏳ Применение схемы базы данных..."
cd /app && pnpm --filter @workspace/db run push

echo "🚀 Запуск API сервера..."
exec node --enable-source-maps /app/artifacts/api-server/dist/index.mjs
