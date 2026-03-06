---
title: "Proxmox + PBS: 2 soatda zaxira nusxalar bilan klasterni sozlash"
date: 2025-02-28
excerpt: "Uch tugunli Proxmox klasterini noldan o'rnatamiz, LXC konteynerida Proxmox Backup Server ni sozlaymiz va snapshotlar rotatsiyasini avtomatlashtirish."
tags: ["proxmox", "backup", "linux"]
category: "virtualization"
readTime: 12
featured: true
---

## Nima qilamiz

Uch tugunli minimal Proxmox VE klasterini o'rnatamiz va zaxira nusxalarni markazlashgan saqlash uchun Proxmox Backup Server (PBS) ni sozlaymiz. Hammasi mahalliy tarmoqda, bulutsiz.

**Kerak bo'ladi:**
- Proxmox VE 8.x bilan 3 ta server yoki VM
- PBS uchun 1 ta qo'shimcha VM
- Tugunlar o'rtasida umumiy tarmoq

## Klasterni yaratamiz

**Birinchi tugun**da klasterni ishga tushiramiz:

```bash
pvecm create pve-prod
```

Statusni tekshiramiz:

```bash
pvecm status
```

**Ikkinchi va uchinchi tugun**da klasterga qo'shilmiz:

```bash
pvecm add 192.168.1.10  # Birinchi tugunning IP si
```

Endi uchala tugun bir-birini ko'rmoqda. GUI orqali yoki `pvecm nodes` buyrug'i bilan tekshirish mumkin.

## Proxmox Backup Server ni sozlaymiz

PBS ni tugunlardan birida LXC konteyneriga o'rnatish qulay.

Debian 12 bilan konteyner yaratamiz, kamida 2 CPU va 2GB RAM. So'ngra konteyner ichida:

```bash
# PBS repositoriyasini qo'shamiz
echo "deb http://download.proxmox.com/debian/pbs bookworm pbs-no-subscription" \
  > /etc/apt/sources.list.d/pbs.list

apt update && apt install proxmox-backup-server
```

O'rnatilgandan so'ng PBS `8007` portida mavjud bo'ladi.

## PBS ni Proxmoxga ulaymiz

Proxmox GUI da **Datacenter → Storage → Add → Proxmox Backup Server** bo'limiga o'tamiz va kiritamiz:

- Server: PBS ning IP manzili
- Datastore: saqlash nomi
- Fingerprint: PBS GUI dan olinadi

## Zaxira nusxa jadvalini sozlaymiz

**Datacenter → Backup** da vazifa yaratamiz:

```
Schedule: 0 2 * * *  (har kecha 02:00 da)
Storage: pbs-storage
Mode: Snapshot
Max Backups: 7
```

Endi har kecha barcha VM lar 7 kunlik rotatsiya bilan avtomatik zaxiralanadi.

## Natija

Ikki soatda markazlashgan zaxira nusxalar bilan to'liq ishlaydigan klaster oldik. Keyingi qadam — Grafana + Prometheus orqali monitoringni sozlash, lekin bu alohida maqola.
