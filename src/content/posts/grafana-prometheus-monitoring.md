---
title: "Grafana + Prometheus: мониторинг серверов за 1 час"
date: 2026-03-06
excerpt: "Разворачиваем стек мониторинга через Docker Compose: Prometheus собирает метрики, Node Exporter следит за серверами, Grafana рисует дашборды."
tags: ["monitoring", "docker", "grafana", "prometheus"]
category: "monitoring"
readTime: 10
featured: false
---

## Что получим в итоге

Полноценный стек мониторинга из трёх компонентов:

- **Prometheus** — собирает и хранит метрики
- **Node Exporter** — экспортирует метрики хоста (CPU, RAM, диск, сеть)
- **Grafana** — визуализация и алерты

Всё поднимаем через Docker Compose на одном сервере.

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

## Конфиг Prometheus

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

Node Exporter запущен с `network_mode: host`, поэтому Prometheus достаёт его через `localhost:9100`.

## Запускаем

```bash
docker compose up -d
```

Проверяем, что всё поднялось:

```bash
docker compose ps
```

Через 30 секунд Prometheus начнёт собирать метрики. Проверить можно на `http://your-server:9090/targets` — статус всех job должен быть `UP`.

## Подключаем Grafana

1. Открываем `http://your-server:3000`, логин `admin` / пароль из `GF_SECURITY_ADMIN_PASSWORD`
2. Идём в **Connections → Data Sources → Add data source → Prometheus**
3. URL: `http://prometheus:9090` (контейнеры в одной сети)
4. Нажимаем **Save & Test**

## Готовый дашборд

Вместо того чтобы строить дашборд вручную, импортируем готовый из Grafana Labs:

1. В Grafana: **Dashboards → Import**
2. Вводим ID `1860` (Node Exporter Full)
3. Выбираем источник данных Prometheus
4. **Import**

Получаем дашборд с ~30 панелями: загрузка CPU, использование RAM, I/O дисков, сетевой трафик, температура, uptime.

## Алерт на высокую загрузку CPU

В Grafana идём в **Alerting → Alert rules → New alert rule**:

```
Condition: avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100 > 80
For: 5m
```

Настраиваем Contact point (email, Telegram, Slack) в **Alerting → Contact points**.

## Добавляем мониторинг Docker-контейнеров

Для метрик самих контейнеров добавляем cAdvisor:

```yaml
# Дополнение к docker-compose.yml

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

И добавляем job в `prometheus.yml`:

```yaml
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

Импортируем дашборд с ID `14282` (Cadvisor exporter) — получаем CPU, RAM и сеть по каждому контейнеру.

## Итог

За час получили рабочий мониторинг: метрики хоста через Node Exporter, красивые дашборды в Grafana и алерты при проблемах. Следующий шаг — вынести Prometheus и Grafana на отдельный сервер и добавить мониторинг нескольких хостов через единую точку сбора.
