# Деплой на продакшен

Архитектура:
- **VPS** — Postgres + Strapi + Nginx (reverse-proxy с SSL) + Certbot, всё в Docker. Доступно на `https://api.matras-ukish.kz`.
- **Хостинг** — статический билд Next.js (папка `out/`). Доступно на `https://matras-ukish.kz`.

---

## 1. Сервер (VPS)

### 1.1. Предварительные требования

- Ubuntu/Debian VPS, минимум 2 GB RAM
- Установлен Docker + Docker Compose plugin
- DNS A-запись `api.matras-ukish.kz` → IP сервера (проверь: `dig api.matras-ukish.kz`)
- Открыты порты 80 и 443 в файрволе

### 1.2. Клонирование репозитория и .env

```bash
git clone https://github.com/XcenaX/matrasy-ukish.git
cd matrasy-ukish
cp .env.production.example .env
```

Открой `.env` и заполни:
- `POSTGRES_PASSWORD` — сильный пароль БД
- Все `STRAPI_*` секреты — каждый сгенерировать командой `openssl rand -base64 32`
- `STRAPI_APP_KEYS` — четыре случайных ключа через запятую

### 1.3. Первый запуск SSL (бутстрап)

Пока сертификата нет, основной nginx-конфиг не загрузится. Временно подменяем его:

```bash
# Прячем боевой конфиг
mv docker/nginx/conf.d/api.conf docker/nginx/conf.d/api.conf.disabled
cp docker/nginx/bootstrap.conf docker/nginx/conf.d/

# Поднимаем стек
docker compose -f docker-compose.prod.yml up -d postgres strapi nginx
```

Получаем сертификат:

```bash
chmod +x scripts/init-ssl.sh
./scripts/init-ssl.sh api.matras-ukish.kz твой@email.kz
```

Возвращаем боевой конфиг:

```bash
rm docker/nginx/conf.d/bootstrap.conf
mv docker/nginx/conf.d/api.conf.disabled docker/nginx/conf.d/api.conf
docker compose -f docker-compose.prod.yml up -d   # запустит и certbot для автообновления
docker compose -f docker-compose.prod.yml restart nginx
```

Проверь:
```bash
curl -I https://api.matras-ukish.kz
# должно вернуть HTTP/2 200 и не ругаться на SSL
```

### 1.4. Создание админа Strapi

Открой `https://api.matras-ukish.kz/admin` в браузере — Strapi предложит создать первого администратора. После этого зайди и добавь товары.

---

## 2. Фронтенд (статический сайт)

### 2.1. Локальная сборка

В корне проекта создай `.env.local`:

```
NEXT_PUBLIC_STRAPI_URL=https://api.matras-ukish.kz
```

Сборка:
```bash
npm install
npm run build
```

В корне появится папка `out/` — это твой статический сайт.

### 2.2. Заливка на хостинг

Залей содержимое папки `out/` в корень публичной директории на хостинге (обычно `public_html/` или `www/`) через FTP/SFTP/файловый менеджер.

Проверь: `https://matras-ukish.kz` — сайт должен открыться, товары подгрузятся из Strapi.

---

## 3. Обновления

### Обновить контент (товары)
Заходишь в `https://api.matras-ukish.kz/admin`, редактируешь — изменения сразу видны на сайте без пересборки.

### Обновить код сайта (фронт)
```bash
git pull
npm run build
# залить обновлённый out/ на хостинг
```

### Обновить код Strapi (на сервере)
```bash
cd matrasy-ukish
git pull
docker compose -f docker-compose.prod.yml up -d --build strapi
```

### Бэкап БД
```bash
docker exec ukish-postgres pg_dump -U ukish ukish_strapi > backup_$(date +%F).sql
```

---

## Полезные команды

```bash
# Логи Strapi
docker compose -f docker-compose.prod.yml logs -f strapi

# Логи Nginx
docker compose -f docker-compose.prod.yml logs -f nginx

# Перезапуск только Strapi
docker compose -f docker-compose.prod.yml restart strapi

# Полная остановка
docker compose -f docker-compose.prod.yml down
```

---

## Структура файлов деплоя

```
matrasy-ukish/
├── docker-compose.prod.yml      ← production-стек
├── .env                          ← секреты (НЕ коммитить, создаётся вручную)
├── docker/
│   ├── nginx/
│   │   ├── conf.d/api.conf       ← основной HTTPS-конфиг
│   │   └── bootstrap.conf        ← временный, для первого certbot
│   └── postgres/init/            ← создание Strapi БД
└── scripts/
    └── init-ssl.sh               ← однокнопочное получение SSL
```
