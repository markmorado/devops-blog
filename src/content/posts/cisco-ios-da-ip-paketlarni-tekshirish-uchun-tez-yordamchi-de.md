---
title: "Cisco IOS da IP-paketlarni tekshirish uchun tez yordamchi (debug ip packet)"
date: 2026-03-14
excerpt: "Cisco IOS da IP-paketlarni tekshirish uchun tez yordamchi (debug ip packet)"
tags: ["cisco", "ios", "debugging", "networking", "commands"]
category: "networking"
readTime: 2
featured: false
draft: false
---

Ushbu qo'llanma Cisco IOS tizimida IP-paketlarni tekshirish (debug ip packet) uchun asosiy buyruqlarni va maslahatlarni taqdim etadi. E'tibor bering, bu buyruqlar tizimga katta yuk qo'yishi mumkin, shuning uchun faqat zarur holatlarda ishlatilishi kerak.

## Asosiy buyruqlar

### 1. IP-paketlarni tekshirishni yoqish
```bash
debug ip packet
```
- Barcha IP-paketlarni tekshirishni yoqadi.
- Tizimga katta yuk qo'yishi mumkin, shuning uchun faol tarmoqlarda ehtiyotkorlik bilan foydalaning.

### 2. Tekshirishni cheklash
```bash
access-list 100 permit ip host 192.168.1.1 host 192.168.2.1
debug ip packet detail 100
```
- `access-list 100` yordamida manba va maqsad IP manzillariga qarab paketlarni filtrlash.
- `detail` parametri paket haqida batafsil ma'lumotlarni ko'rsatadi.

### 3. Tekshirishni o'chirish
```bash
undebug all
```
yoki
```bash
no debug ip packet
```
- Barcha tekshirish buyruqlarini yoki faqat IP-paketlarni tekshirishni o'chiradi.

### 4. Chiqish ma'lumotlarini tahlil qilish
`debug ip packet` chiqishida quyidagi ma'lumotlar keltiriladi:
- **Manba IP** — yuboruvchi manzili
- **Maqsad IP** — qabul qiluvchi manzili
- **Protokol** — TCP, UDP, ICMP kabi
- **Paket harakati** — "forwarded" (o'tkazildi), "dropped" (tashlandi)
- **Interfeys** — paket o'tgan port

Namuna chiqish:
```
IP: s=192.168.1.1 (FastEthernet0/0), d=192.168.2.1 (FastEthernet0/1), len 100, forward
```
- 192.168.1.1 manzilidan 192.168.2.1 manziliga paket FastEthernet0/0 dan FastEthernet0/1 orqali o'tkazildi.

### 5. Foydali maslahatlar
- Faqat zarur holatlarda va qisqa vaqtga `debug` buyrug'idan foydalaning.
- Yukni kamaytirish uchun ACL filtrlaridan foydalaning.
- Loglarni saqlash uchun quyidagi buyruqlarni ishga tushiring:
  ```bash
  logging console
  logging buffered 10000
  ```
- Konsolga chiqishni to'xtatish uchun:
  ```bash
  no logging console
  ```

### 6. Qo'shimcha foydali buyruqlar
- **Marshrutlanishni tekshirish**:
  ```bash
  show ip route
  ```
- **ARP-jadvalini ko'rish**:
  ```bash
  show ip arp
  ```
- **Marshrutni kuzatish**:
  ```bash
  traceroute
  ```

Xulosa: IP-paketlarni tekshirish kuchli vosita bo'lsa-da, tizim ishlash tezligiga ta'sir qilishi mumkin. Faqat muammolarni hal qilish uchun ACL bilan cheklangan holda ishlatish tavsiya etiladi.

Tags: cisco, ios, debugging, networking, commands
Category: networking