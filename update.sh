#!/bin/bash
# ============================================================
# Скрипт обновления ВВГУ — загружает последний архив из Replit
# Использование: bash update.sh
# ============================================================
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARCHIVE_URL="${VVSU_ARCHIVE_URL:-}"

if [[ -z "$ARCHIVE_URL" ]]; then
  error "Укажите ссылку на архив: VVSU_ARCHIVE_URL=https://... bash update.sh"
fi

info "Скачиваю обновление..."
cd "$SCRIPT_DIR"
wget -q --show-progress "$ARCHIVE_URL" -O /tmp/vvsu-update.tar.gz

info "Сохраняю .env..."
cp .env /tmp/vvsu-env-backup 2>/dev/null || true

info "Распаковываю..."
tar -xzf /tmp/vvsu-update.tar.gz --strip-components=1 --overwrite

info "Восстанавливаю .env..."
cp /tmp/vvsu-env-backup .env 2>/dev/null || warn ".env не найден — проверьте настройки"

info "Пересобираю контейнеры..."
docker compose up -d --build

info "Применяю данные (если нужно)..."
sleep 5
docker compose exec -T db psql -U vvsu -d vvsu_tourism -c "SELECT count(*) FROM courses" 2>/dev/null | grep -q "0" && \
  docker compose exec -T db psql -U vvsu -d vvsu_tourism -f /seed.sql 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Обновление завершено!${NC}"
echo "Сайт доступен на порту 8888"
rm -f /tmp/vvsu-update.tar.gz
