#!/bin/sh
# Получение первого SSL-сертификата от Let's Encrypt.
# Запускать ОДИН РАЗ на сервере после первого старта nginx с bootstrap-конфигом.

set -e

DOMAIN="${1:-api.matras-ukish.kz}"
EMAIL="${2:?Usage: ./init-ssl.sh <domain> <email>}"

echo "→ Получаю сертификат для $DOMAIN ..."

docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

echo "→ Сертификат получен."
echo "→ Переключаю nginx на production-конфиг..."

# Подмена bootstrap.conf на api.conf уже сделана в DEPLOY.md шагами.
# Этот скрипт только получает сертификат.

docker compose -f docker-compose.prod.yml restart nginx
echo "✓ Готово. Проверь: curl -I https://$DOMAIN"
