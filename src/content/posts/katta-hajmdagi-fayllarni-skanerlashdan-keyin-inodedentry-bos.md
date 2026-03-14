---
title: "Katta hajmdagi fayllarni skanerlashdan keyin inode/dentry bosimi"
date: 2026-03-14
excerpt: "Katta hajmdagi fayllarni skanerlashdan keyin inode/dentry bosimi"
tags: ["linux", "kernel", "memory", "filesystem", "cache"]
category: "linux"
readTime: 1
featured: false
draft: false
---

Backup, rsync yoki katta hajmdagi fayllarni skanerlashdan so‘ng, tizimda erkin RAM hajmi keskin pasayadi, garchi jarayonlar uning ko‘p qismini foydalanmasa ham.

Yadro fayl metadannylarini — inode va dentrylarni — slab-keshda saqlaydi. Millionlab fayllarni skanerlashda bu strukturalar massiv tarzda keshga tushadi. Bu takroriy kirishni tezlashtiradi, lekin bitta marta fayllarni o‘qishda metadannylar keshi kengayib ketadi.

Xotirada nima sodir bo‘layotganini tekshirish uchun quyidagi buyruqlardan foydalaning:

```shell
cat /proc/meminfo | grep -E "Slab|SReclaimable|SUnreclaim"
cat /proc/slabinfo | grep -E "dentry|inode"
slabtop
```

Agar Slab va ayniqsa SReclaimable qiymatlari oshgan bo‘lsa, shuningdek, slabinfo chiqishida dentry va inode_cache yetakchilik qilsa, bu VFS metadannylar keshi tomonidan xotira egallanganligini anglatadi.

Teoretik jihatdan, bu kesh xotira bosimi paydo bo‘lganda avtomatik tozalanadi, lekin agar bosim bo‘lmasa, u uzun muddat saqlanishi mumkin. Katta hajmdagi fayllar bo‘lgan tizimlarda bu gigabaytlab RAMni egallashi mumkin, bu esa jarayonlarning RSS ko‘rsatkichlarida aks etmaydi.

Tags: linux, kernel, memory, filesystem, cache
Category: linux