---
title: "PowerDNS с PostgreSQL бэкендом в Docker: от нуля до продакшена"
date: 2025-02-20
excerpt: "Поднимаем полноценный DNS сервер на PowerDNS с хранением зон в PostgreSQL. Docker Compose, автоматические миграции и PowerDNS-Admin в комплекте."
tags: ["dns", "docker", "postgresql"]
category: "infrastructure"
readTime: 9
featured: false
---

## Почему PowerDNS + PostgreSQL

BIND хорош, но управлять зонами через текстовые файлы в 2025 году — боль. PowerDNS с SQL бэкендом даёт:

- API для управления зонами
- Веб-интерфейс через PowerDNS-Admin
- Удобный бэкап (просто дамп БД)
- Кластеризацию без ручной синхронизации файлов

## Структура проекта

```
powerdns/
├── docker-compose.yml
├── pdns.conf
└── init/
    └── schema.sql
```

## docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: pdns
      POSTGRES_USER: pdns
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

  pdns:
    image: powerdns/pdns-auth-48:latest
    depends_on:
      - postgres
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "8081:8081"
    volumes:
      - ./pdns.conf:/etc/powerdns/pdns.conf
    restart: unless-stopped

  pdns-admin:
    image: ngoduykhanh/powerdns-admin:latest
    depends_on:
      - pdns
    ports:
      - "9191:80"
    environment:
      - SQLALCHEMY_DATABASE_URI=postgresql://pdns:${POSTGRES_PASSWORD}@postgres/pdnsadmin
    restart: unless-stopped

volumes:
  pgdata:
```

## Конфигурация pdns.conf

```ini
# Бэкенд
launch=gpgsql
gpgsql-host=postgres
gpgsql-dbname=pdns
gpgsql-user=pdns
gpgsql-password=${POSTGRES_PASSWORD}

# API
api=yes
api-key=${PDNS_API_KEY}
webserver=yes
webserver-address=0.0.0.0
webserver-port=8081
webserver-allow-from=0.0.0.0/0
```

## Запуск

```bash
cp .env.example .env
# Редактируем .env — задаём POSTGRES_PASSWORD и PDNS_API_KEY

docker compose up -d
```

Через 30 секунд PowerDNS-Admin доступен на `http://localhost:9191`.

## Создаём первую зону через API

```bash
curl -X POST http://localhost:8081/api/v1/servers/localhost/zones \
  -H "X-API-Key: ${PDNS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "example.com.",
    "kind": "Native",
    "nameservers": ["ns1.example.com.", "ns2.example.com."]
  }'
```

Зона создана. Добавляем A запись аналогичным образом через API или через веб-интерфейс.

## Итог

Полноценный DNS сервер с веб-интерфейсом поднимается за 10 минут. Бэкап — просто `pg_dump`, восстановление — `pg_restore` на новом сервере и `docker compose up`.
