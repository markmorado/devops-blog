---
title: "Linux tarmoq boshqaruvining asosiy buyruqlari: DNS va marshrutlash"
date: 2026-03-14
excerpt: "Linux tarmoq boshqaruvining asosiy buyruqlari: DNS va marshrutlash"
tags: ["linux", "networking", "sysadmin", "terminal", "commands"]
category: "linux"
readTime: 2
featured: false
draft: false
---

Ushbu material Linux operatsion tizimida tarmoq sozlamalarini tekshirish, marshrutlarni boshqarish va diagnostika qilish uchun ishlatiladigan eng muhim terminal buyruqlarini qamrab oladi.

Quyida tarmoq interfeyslari, IP manzillari, marshrutlash jadvallari hamda ulanish holatlarini boshqarish bo'yicha asosiy vositalar keltirilgan:

**Tarmoq interfeysi va IP sozlamalari:**
*   `ipcalc` – tarmoq kalkulyatori (subnet hisoblash).
*   `ethtool <interface>` – belgilangan interfeysning fizik statistikasini chiqaradi.
*   `ping <host>` – belgilangan hostga ping yuborib, javob vaqtini o'lchaydi.
*   `whois <domain>` – domen haqida WHOIS ma'lumotlarini oladi.
*   `traceroute <host>` – maqsadli hostgacha bo'lgan marshutni kuzatadi.
*   `ifconfig` – tarmoq interfeysi parametrlarini ko'rish yoki sozlash. Agar interfeys nomi ko'rsatilmasa, barcha interfeyslar konfiguratsiyasi chiqariladi.
    *   `ifconfig eth0` – `eth0` interfeysi sozlamalari.
    *   `inet <ip_address>` – interfeysga IP manzilni tayinlash.
    *   `netmask <mask>` – tarmoq maskasini belgilash.
    *   `broadcast <address>` – kengaytirilgan (broadcast) manzilni o'rnatish.
    *   `up` – interfeysni ishga tushirish.
    *   `down` – interfeysni to'xtatish.
    *   `-a` – barcha apparat interfeyslarini (faol va nofaol) ko'rsatish.

**Marshrutlash jadvallari:**
*   `route` – marshrutlash jadvalini ko'rsatadi.
    *   `-n` – IP manzillarni nomlarga aylantirmaslik (rezolv qilmaslik).
    *   `add <destination> gw <gateway> metric <metric>` – yangi marshut qo'shish (manzil, shlyuz va metrika ko'rsatiladi).
    *   `add -net` – tarmoq uchun marshut qo'shish.
    *   `add -host` – alohida host uchun marshut qo'shish.
    *   `del <destination>` – ma'lum bir manzilga oid marshutni o'chirish.

**Diagnostika va monitoring:**
*   `mtr <host>` – hostgacha bo'lgan marshut statistikasini chiroyli formatda ko'rsatadi (traceroute dan ko'ra qulayroq).
*   `netstat` – tarmoq statistikasini chiqaradi.
    *   `-r` – marshrutlash jadvali.
    *   `-n` – IP va portlarni nomlarga aylantirmaslik.
    *   `-a` – barcha holatdagi ulanishlarni ko'rsatish.
    *   `-t` – TCP protokoli statistikasi.
    *   `-u` – UDP protokoli statistikasi.
    *   `-i` – tarmoq interfeyslari statistikasi.
    *   `-l` – tinglayotgan (LISTEN) soketlarni ko'rish.
    *   `-p` – soket bilan bog'langan dastur nomi va PID raqamini ko'rsatish.

**Portlar va ulanishlar:**
*   `netcat <host> <port>` – ma'lum bir portni tinglayotgan jarayonlarni tekshirish.
*   `nc` – TCP/IP uchun universal vosita ("shveytsariya pichog'i").
    *   `-h` – yordam ma'lumotlarini chiqarish.
    *   `-l <port>` – kiruvchi ulanishlar uchun lokal portni tinglash.

Tags: linux, networking, sysadmin, terminal, commands
Category: linux