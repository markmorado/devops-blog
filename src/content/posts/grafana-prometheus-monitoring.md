---
title: "Grafana + Prometheus: 1 soatda serverlarni monitoring qilish"
date: 2026-03-06
excerpt: "Docker Compose orqali monitoring stekini o'rnatamiz: Prometheus metrikalarni yig'adi, Node Exporter serverlarni kuzatadi, Grafana dashboardlar chizadi."
tags: ["monitoring", "docker", "grafana", "prometheus"]
category: "monitoring"
readTime: 10
featured: false
---

## Natijada nima olamiz

Uch komponentdan iborat to'liq monitoring steki:

- **Prometheus** — metrikalarni yig'adi va saqlaydi
- **Node Exporter** — host metrikalarini eksport qiladi (CPU, RAM, disk, tarmoq)
- **Grafana** — vizualizatsiya va ogohlantirishlar

Hammasi bitta serverda Docker Compose orqali o'rnatiladi.

## Docker Compose

```yaml
# docker-compose.yml

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'
    ports:
      - "9090:9090"

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    network_mode: host
    pid: host
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=changeme
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"

volumes:
  prometheus_data:
  grafana_data:
```

## Prometheus konfiguratsiyasi

```yaml
# prometheus.yml

global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

Node Exporter `network_mode: host` bilan ishlamoqda, shuning uchun Prometheus uni `localhost:9100` orqali oladi.

## Ishga tushiramiz

```bash
docker compose up -d
```

Hammasining ko'tarilganini tekshiramiz:

```bash
docker compose ps
```

30 soniyadan so'ng Prometheus metrikalarni yig'a boshlaydi. `http://your-server:9090/targets` da tekshirish mumkin — barcha job lar holati `UP` bo'lishi kerak.

## Grafana ni ulaymiz

1. `http://your-server:3000` ni ochamiz, login `admin` / `GF_SECURITY_ADMIN_PASSWORD` dan parol
2. **Connections → Data Sources → Add data source → Prometheus** ga o'tamiz
3. URL: `http://prometheus:9090` (konteynerlar bir tarmoqda)
4. **Save & Test** ni bosamiz

## Tayyor dashboard

Dashboardni qo'lda qurishning o'rniga, Grafana Labs dan tayyor narsani import qilamiz:

1. Grafana da: **Dashboards → Import**
2. `1860` ID ni kiritamiz (Node Exporter Full)
3. Prometheus ma'lumot manbasini tanlaymiz
4. **Import**

~30 panelli dashboard olamiz: CPU yuklanishi, RAM ishlatilishi, disk I/O, tarmoq trafigi, harorat, uptime.

## Yuqori CPU yuklama uchun ogohlantirish

Grafana da **Alerting → Alert rules → New alert rule** ga o'tamiz:

```
Condition: avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100 > 80
For: 5m
```

**Alerting → Contact points** da Contact point (email, Telegram, Slack) sozlaymiz.

## Docker konteynerlar monitoringini qo'shamiz

Konteynerlarning o'z metrikalari uchun cAdvisor qo'shamiz:

```yaml
# docker-compose.yml ga qo'shimcha

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    restart: unless-stopped
    privileged: true
    devices:
      - /dev/kmsg
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
    ports:
      - "8080:8080"
```

`prometheus.yml` ga job qo'shamiz:

```yaml
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

ID `14282` (Cadvisor exporter) bilan dashboard import qilamiz — har bir konteyner bo'yicha CPU, RAM va tarmoq olamiz.

## Natija

Bir soatda ishlaydigan monitoring oldik: Node Exporter orqali host metrikalari, Grafana da chiroyli dashboardlar va muammolar uchun ogohlantirishlar. Keyingi qadam — Prometheus va Grafana ni alohida serverga ko'chirish va bitta yig'ish nuqtasi orqali bir nechta hostlarni monitoring qilish.
