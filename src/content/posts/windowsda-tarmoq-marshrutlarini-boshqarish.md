---
title: "Windowsda tarmoq marshrutlarini boshqarish"
date: 2026-03-14
excerpt: "Windowsda tarmoq routelarini boshqarish"
tags: ["windows", "network", "routing", "cmd", "powershell"]
category: "networking"
readTime: 1
featured: false
draft: false
---

# Windowsda tarmoq routelarini boshqarish

Ushbu maqolada Windows tizimida tarmoq routelarini ko'rish, qo'shish va o'chirish uchun ishlatiladigan buyruqlar tushuntiriladi.

Windows tizimida barcha tarmoq routelarini ko'rish uchun CMD da `route print` buyrug'ini ishlatish mumkin. IPv4 routelarini faqat ko'rish uchun `-4` kalitini qo'shing. 

route qo'shish uchun `route add` buyrug'i ishlatiladi. Bunda `-p` kaliti routeni doimiy qilib, tizimni qayta ishga tushirganda ham saqlanishini ta'minlaydi. Xatoliklarni oldini olish uchun avval `-p` kalitsiz sinab ko'rish tavsiya etiladi. Buyruq sintaksisi quyidagicha:

```cmd
route add -p [SUBNET ID] MASK [SUBNET MASK] [GATEWAY] metric [METRIC] IF [INTERFACE ID]
```

Bu yerda:
- SUBNET ID — qo'shiladigan tarmoq ostki tarmog'i
- SUBNET MASK — yangi route uchun maska
- METRIC — routening og'irligi (1 dan 9999 gacha), kichik qiymat yuqori prioritetni anglatadi
- GATEWAY — yangi tarmoq ostki tarmog'iga trafikni yo'naltiradigan birinchi nuqta
- INTERFACE ID — ixtiyoriy, lekin tarmoq interfeysining ichki raqamini ko'rsatish tavsiya etiladi (buni `route print` yordamida aniqlash mumkin)

Misol uchun, 192.168.0.0/24 tarmoq ostki tarmog'iga 192.168.1.1 orqali, interfeys ID 11 orqali route qo'shish:

```cmd
route add -p 192.168.0.0 MASK 255.255.255.0 192.168.1.1 metric 7 IF 11
```

PowerShell da route qo'shish uchun `New-NetRoute` cmdletidan foydalaniladi. Avval `Get-NetAdapter` yordamida interfeys indeksini aniqlang:

```powershell
New-NetRoute -DestinationPrefix "192.168.0.0/24" -RouteMetric 7 -InterfaceIndex 11 -NextHop 192.168.1.1
```

routeni o'chirish uchun CMD da `route delete` buyrug'i, PowerShell da esa `Remove-NetRoute` cmdleti ishlatiladi. Masalan:

```cmd
route delete 192.168.0.0 MASK 255.255.255.0 192.168.1.1 IF 11
```

```powershell
Remove-NetRoute -DestinationPrefix "192.168.0.0/24" -RouteMetric 7 -InterfaceIndex 11 -NextHop 192.168.1.1
```

Tags: windows, network, routing, cmd, powershell
Category: networking