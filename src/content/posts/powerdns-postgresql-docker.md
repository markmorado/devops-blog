---
title: "PowerDNS va PostgreSQL Docker da: noldan prodakshengacha"
date: 2025-02-20
excerpt: "PostgreSQL da zonalarni saqlab, PowerDNS da to'liq DNS server o'rnatamiz. Docker Compose, avtomatik migratsiyalar va PowerDNS-Admin bilan birga."
tags: ["dns", "docker", "postgresql"]
category: "infrastructure"
readTime: 9
featured: false
---

## Nima uchun PowerDNS + PostgreSQL

BIND yaxshi, lekin 2025 yilda matn fayllari orqali zonalarni boshqarish — azob. PowerDNS SQL backend bilan beradi:

- Zonalarni boshqarish uchun API
- PowerDNS-Admin orqali veb-interfeys
- Qulay zaxira nusxa (shunchaki MB dump)
- Fayllarni qo'lda sinxronlashsiz klasterlash

## Loyiha tuzilmasi

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

## Konfiguratsiya pdns.conf

```ini
# Backend
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

## Ishga tushirish

```bash
cp .env.example .env
# .env ni tahrirlashimiz kerak — POSTGRES_PASSWORD va PDNS_API_KEY ni o'rnatamiz

docker compose up -d
```

30 soniyadan so'ng PowerDNS-Admin `http://localhost:9191` da mavjud bo'ladi.

## API orqali birinchi zonani yaratamiz

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

Zona yaratildi. A yozuvini xuddi shunday API yoki veb-interfeys orqali qo'shamiz.

## Natija

Veb-interfeys bilan to'liq DNS server 10 daqiqada o'rnatiladi. Zaxira nusxa — shunchaki `pg_dump`, tiklash — yangi serverda `pg_restore` va `docker compose up`.
