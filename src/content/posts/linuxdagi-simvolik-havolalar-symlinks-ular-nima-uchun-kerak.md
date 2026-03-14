---
title: "Linuxdagi simvolik havolalar (symlinks): ular nima uchun kerak?"
date: 2026-03-14
excerpt: "Linuxdagi simvolik havolalar (symlinks): ular nima uchun kerak?"
tags: ["symlinks", "linux", "file system", "terminal commands", "system administration"]
category: "linux"
readTime: 1
featured: false
draft: false
---

Linux tizimida ishlayotgan bo'lsangiz, simvolik havolalar (symlinks) haqida eshitganingiz aniq. Ular fayl tizimini boshqarishda qanday qo'llanilishi kerakligini tushunish muhimdir.

Simvolik havola — bu Windowsdagi "yaroq"ga o'xshash, biron bir fayl yoki katalogga yo'naltiruvchi havoladir. Farqi shundaki, u maqsadli obyektni emas, balki uning yo'lini saqlaydi. Bu xususiyat ularni quyidagi vazifalarda foydali qiladi:

- **Ishni osonlashtirish**: Tez-tez ishlatiladigan fayllarga qisqa yo'lni yaratish. Masalan:  
  ```bash
  ln -s /var/log/nginx ~/nginx-logs
  ```
  Endi veb-server loglari uy jildidan (home directory) ochiladi.

- **Fayllarni ko'chirishda yo'llarni saqlash**: Agar fayl yoki katalog o'zgartirilgan bo'lsa, eski yo'lga simvolik havola orqali murojaat qilish mumkin.

- **Dasturlarning versiyalarini boshqarish**: Masalan, Java versiyalarini almashtirish uchun:  
  ```bash
  ln -s /usr/lib/jvm/java-11-openjdk ~/java
  ```

- **Turli fayl tizimlarini birlashtirish**: Boshqa disk yoki bo'limda joylashgan fayllarga bir xil yo'l orqali murojaat qilish imkoniyati.

Eslatmalar:
- Agar maqsadli fayl o'chirilsa, simvolik havola ishlamay qoladi.
- Ular tarmoq yo'llarida ishlamaydi, chunki ular faqat mahalliy fayl tizimi uchun mo'ljallangan.
- Aylana havolalardan (masalan, `dir1` va `dir2` o'zaro havolalari) saqlaning.

Xulosa: Simvolik havolalar Linuxda fayl tizimini moslashtirish va boshqarish uchun kuchli vositadir. To'g'ri qo'llanilsa, ular ish jarayonini ancha osonlashtiradi.

Tags: symlinks, linux, file system, terminal commands, system administration
Category: linux