#!/usr/bin/env bash
# Pull the latest code and restart the site. Run on the VPS:
#   bash /var/www/dragons-solutions/deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."

git pull --ff-only
npm ci
npx prisma db push --skip-generate
npm run build
pm2 reload ecosystem.config.cjs --update-env
pm2 save
echo "Dragons Solutions updated."
