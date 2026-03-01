---
title: "Proxmox + PBS: настройка кластера с бэкапами за 2 часа"
date: 2025-02-28
excerpt: "Разворачиваем трёхнодовый Proxmox кластер с нуля, настраиваем Proxmox Backup Server в LXC контейнере и автоматизируем ротацию снапшотов."
tags: ["proxmox", "backup", "linux"]
readTime: 12
featured: true
---

## Что будем делать

Поднимем минимальный Proxmox VE кластер из трёх нод и настроим Proxmox Backup Server (PBS) для централизованного хранения бэкапов. Всё в локальной сети, без облаков.

**Что понадобится:**
- 3 сервера или VM с Proxmox VE 8.x
- 1 дополнительная VM под PBS
- Shared сеть между нодами

## Создаём кластер

На **первой ноде** инициализируем кластер:

```bash
pvecm create pve-prod
```

Проверяем статус:

```bash
pvecm status
```

На **второй и третьей ноде** вступаем в кластер:

```bash
pvecm add 192.168.1.10  # IP первой ноды
```

Теперь все три ноды видят друг друга. Проверить можно через GUI или командой `pvecm nodes`.

## Настраиваем Proxmox Backup Server

PBS удобнее всего поставить в LXC контейнер на одной из нод.

Создаём контейнер с Debian 12, минимум 2 CPU и 2GB RAM. Затем внутри контейнера:

```bash
# Добавляем репозиторий PBS
echo "deb http://download.proxmox.com/debian/pbs bookworm pbs-no-subscription" \
  > /etc/apt/sources.list.d/pbs.list

apt update && apt install proxmox-backup-server
```

После установки PBS доступен на порту `8007`.

## Подключаем PBS к Proxmox

В GUI Proxmox идём в **Datacenter → Storage → Add → Proxmox Backup Server** и вводим:

- Server: IP адрес PBS
- Datastore: имя хранилища
- Fingerprint: берём из PBS GUI

## Настраиваем расписание бэкапов

В **Datacenter → Backup** создаём задачу:

```
Schedule: 0 2 * * *  (каждую ночь в 02:00)
Storage: pbs-storage
Mode: Snapshot
Max Backups: 7
```

Теперь каждую ночь все VM автоматически бэкапятся с ротацией за 7 дней.

## Итог

За два часа получили полностью рабочий кластер с централизованными бэкапами. Следующий шаг — настроить мониторинг через Grafana + Prometheus, но это отдельная статья.
