---
title: "Linuxda tarmoq yuklamasining CPU yadroлари bo'ylab noto'g'ri taqsimlanishi"
date: 2026-03-14
excerpt: "Linuxda tarmoq yuklamasining CPU yadroлари bo'ylab noto'g'ri taqsimlanishi"
tags: ["linux", "tarmoq", "unumdorlik", "rps", "xps"]
readTime: 1
featured: false
draft: false
---

# Linuxda tarmoq yuklamasining CPU yadroлари bo'ylab noto'g'ri taqsimlanishi

Tarmoq interfeysi bandligidan to'liq foydalanmasa-da, bitta CPU yadrosi softirq jarayonlari bilan to'liq yuklanishi mumkin. Bu holat RPS va XPS sozlamalarining noto'g'ri taqsimlanganligidan kelib chiqadi.

Bunday vaziyatta tizimning tor joyi (bottleneck) tarmoq yoki CPU umumiy quvvati emas, balki paketlarni ishlovchi yadroлар bo'ylab taqsimlash mexanizmi bo'ladi. Paketlar avval NIC RX navbatlariga tushadi, keyin softirq (NET_RX) orqali ishlanadi. Agar RPS (Receive Packet Steering) va IRQ affinity teng taqsimlanmagan bo'lsa, deyarli barcha ish bitta CPU ga yuklanadi.

Bu holat burst yuklamalarda latency keskin oshishiga olib keladi, garchi tizimning o'rtacha yuklamasi past bo'lsa ham. Muammoni aniqlash uchun quyidagi buyruqlardan foydalanish mumkin:

```shell
cat /proc/interrupts
```

Agar tarmoq IRQ hisoblagichlari faqat bitta CPU da o'sayotgan bo'lsa, yuklama taqsimlanmagan.

Softirq faolligini tekshirish:

```shell
cat /proc/softirqs | grep NET_RX
```

Bu yerda qaysi yadroлар haqiqatan ham tarmoq trafikini ishlayotgani ko'rinadi.

Interfeys navbatlari uchun RPS sozlamalarini ko'rish:

```shell
cat /sys/class/net/eth0/queues/rx-*/rps_cpus
cat /sys/class/net/eth0/queues/tx-*/xps_cpus
```

Ushbu maskalar kiruvchi va chiquvchi paketlarni ishlovchi CPU larni belgilaydi. Agar ular bo'sh yoki bitta yadroga bog'langan bo'lsa, barcha yuklama shu yerda to'planadi.

Tags: linux, tarmoq, unumdorlik, rps, xps