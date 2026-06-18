#!/bin/bash
# ============================================================
# ВВГУ — Институт туризма и креативных индустрий
# Скрипт ручной установки (без Docker)
# ============================================================
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --- Проверки ---
command -v node  >/dev/null 2>&1 || error "Node.js не установлен. Нужен Node.js 20+"
command -v pnpm  >/dev/null 2>&1 || (warn "pnpm не найден, устанавливаю..." && npm i -g pnpm)
[[ -f .env ]] || error "Файл .env не найден. Скопируйте .env.example → .env и заполните переменные."

info "Загружаю переменные из .env..."
export $(grep -v '^#' .env | xargs)

[[ -z "$DATABASE_URL" ]]  && error "DATABASE_URL не задан в .env"
[[ -z "$SESSION_SECRET" ]] && error "SESSION_SECRET не задан в .env"

# --- Зависимости ---
info "Устанавливаю зависимости..."
pnpm install --frozen-lockfile

# --- Сборка ---
info "Собираю shared libs..."
pnpm run typecheck:libs

info "Применяю схему БД..."
pnpm --filter @workspace/db run push

info "Собираю API сервер..."
pnpm --filter @workspace/api-server run build

info "Собираю фронтенд..."
pnpm --filter @workspace/vvsu-tourism run build

echo ""
echo -e "${GREEN}✅ Сборка завершена!${NC}"
echo ""
echo "Готовые файлы:"
echo "  API:      artifacts/api-server/dist/index.mjs"
echo "  Frontend: artifacts/vvsu-tourism/dist/"
echo ""
echo "Запустите API:"
echo "  PORT=8080 node --enable-source-maps artifacts/api-server/dist/index.mjs"
echo ""
echo "Раздавайте frontend через nginx или любой статик-сервер."
echo "Пример (быстрая проверка):"
echo "  npx serve artifacts/vvsu-tourism/dist"
