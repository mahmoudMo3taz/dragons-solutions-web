#!/usr/bin/env bash
# =============================================================================
# Dragons Solutions: one-time setup on an Ubuntu/Debian VPS that already hosts
# another website. Safe by design:
#   - never edits or removes existing web server sites, only ADDS a new one
#   - tests the web server config before reloading, and rolls back if the test fails
#   - runs the site privately on 127.0.0.1:3010 behind the existing web server
#
# Usage (as root):
#   curl -fsSL https://raw.githubusercontent.com/mahmoudMo3taz/dragons-solutions-web/main/deploy/setup.sh | bash -s -- dragonssolutions.com
# Re-running it is safe: it updates the code and keeps the database.
# =============================================================================
set -euo pipefail

DOMAIN="${1:-dragonssolutions.com}"
REPO="https://github.com/mahmoudMo3taz/dragons-solutions-web.git"
APP_DIR="/var/www/dragons-solutions"
PORT=3010
SITE_NAME="dragons-solutions"

say()  { printf '\n\033[1;31m==>\033[0m \033[1m%s\033[0m\n' "$*"; }
info() { printf '    %s\n' "$*"; }

[ "$(id -u)" -eq 0 ] || { echo "Please run as root (sudo -i first)."; exit 1; }

# -----------------------------------------------------------------------------
say "1/7  Checking what this server already runs (read-only)"
info "System: $(. /etc/os-release; echo "$PRETTY_NAME"), RAM: $(free -h | awk '/Mem:/{print $2}'), free disk: $(df -h / | awk 'NR==2{print $4}')"
info "Listening on 80/443:"
ss -ltnp 2>/dev/null | awk 'NR==1 || /:80 |:443 /' | sed 's/^/      /'
WEB=""
if systemctl is-active --quiet nginx 2>/dev/null; then WEB="nginx"
elif systemctl is-active --quiet apache2 2>/dev/null; then WEB="apache"
fi
if ss -ltnp 2>/dev/null | grep -qE ":$PORT "; then
  if ! pm2 describe "$SITE_NAME" >/dev/null 2>&1; then
    echo "Port $PORT is already used by another program. Stopping so nothing breaks."; exit 1
  fi
fi
info "Web server in charge of ports 80/443: ${WEB:-none detected}"
if [ -z "$WEB" ] && ss -ltnp 2>/dev/null | grep -qE ':(80|443) '; then
  echo
  echo "Something other than Nginx/Apache (Docker, Caddy, a control panel...) owns ports 80/443."
  echo "Stopping here without changing anything. Send this output to Claude."
  exit 2
fi

# -----------------------------------------------------------------------------
say "2/7  Installing Node.js 22, Git and PM2 (skipped if already present)"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq git curl ca-certificates build-essential >/dev/null
NODE_MAJOR=$(node -v 2>/dev/null | sed 's/v\([0-9]*\).*/\1/' || echo 0)
if [ "${NODE_MAJOR:-0}" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
command -v pm2 >/dev/null || npm install -g pm2 --silent
info "node $(node -v), npm $(npm -v), pm2 $(pm2 -v)"

# -----------------------------------------------------------------------------
say "3/7  Getting the website code into $APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull --ff-only
else
  mkdir -p "$(dirname "$APP_DIR")"
  git clone --depth 1 "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"
if [ ! -f .env ]; then
  cat > .env <<EOF
DATABASE_URL="file:./prod.db"
NEXT_PUBLIC_SITE_URL="https://$DOMAIN"
EOF
fi

# -----------------------------------------------------------------------------
say "4/7  Installing packages, creating the database and building (takes a few minutes)"
npm ci --no-audit --no-fund
npx prisma db push --skip-generate
npm run build

# -----------------------------------------------------------------------------
say "5/7  Starting the site with PM2 on 127.0.0.1:$PORT"
if pm2 describe "$SITE_NAME" >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
sleep 3
if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/"; then info "Site answers locally: OK"; else echo "Site did not answer on port $PORT"; pm2 logs "$SITE_NAME" --lines 30 --nostream; exit 1; fi

# -----------------------------------------------------------------------------
say "6/7  Adding $DOMAIN to $WEB (your other site is not touched)"
if [ "$WEB" = "apache" ]; then
  a2enmod proxy proxy_http headers >/dev/null
  CONF="/etc/apache2/sites-available/$SITE_NAME.conf"
  cat > "$CONF" <<EOF
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:$PORT/
    ProxyPassReverse / http://127.0.0.1:$PORT/
    RequestHeader set X-Forwarded-Proto "http"
</VirtualHost>
EOF
  a2ensite "$SITE_NAME" >/dev/null
  if apache2ctl configtest; then systemctl reload apache2; else a2dissite "$SITE_NAME" >/dev/null; rm -f "$CONF"; echo "Apache test failed, change rolled back."; exit 1; fi
  CERT_PLUGIN="apache"
else
  if [ -z "$WEB" ]; then
    info "No web server found, installing Nginx"
    apt-get install -y -qq nginx >/dev/null
    systemctl enable --now nginx
  fi
  CONF="/etc/nginx/sites-available/$SITE_NAME"
  sed "s/example.com/$DOMAIN/g" deploy/nginx-dragons-solutions.conf > "$CONF"
  ln -sf "$CONF" "/etc/nginx/sites-enabled/$SITE_NAME"
  if nginx -t; then systemctl reload nginx; else rm -f "/etc/nginx/sites-enabled/$SITE_NAME" "$CONF"; echo "Nginx test failed, change rolled back."; exit 1; fi
  CERT_PLUGIN="nginx"
fi

# -----------------------------------------------------------------------------
say "7/7  HTTPS certificate for $DOMAIN"
apt-get install -y -qq certbot "python3-certbot-$CERT_PLUGIN" >/dev/null
SERVER_IP=$(curl -fsS4 https://ifconfig.me || hostname -I | awk '{print $1}')
DNS_IP=$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}' || true)
if [ "$DNS_IP" = "$SERVER_IP" ]; then
  WWW=""
  [ "$(getent ahostsv4 "www.$DOMAIN" | awk 'NR==1{print $1}')" = "$SERVER_IP" ] && WWW="-d www.$DOMAIN"
  certbot "--$CERT_PLUGIN" -d "$DOMAIN" $WWW --non-interactive --agree-tos --register-unsafely-without-email --redirect
  info "HTTPS is on."
else
  info "DNS for $DOMAIN points to '${DNS_IP:-nothing}', not this server ($SERVER_IP) yet."
  info "After the DNS change is live, run:  certbot --$CERT_PLUGIN -d $DOMAIN -d www.$DOMAIN --redirect"
fi

say "Done. Dragons Solutions is running."
info "Status:  pm2 status        Logs:  pm2 logs $SITE_NAME"
info "Update later:  bash $APP_DIR/deploy/update.sh"
