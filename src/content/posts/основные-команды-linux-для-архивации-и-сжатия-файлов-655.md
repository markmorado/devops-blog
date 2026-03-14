---
title: "Linux'da Fayllarni Arxivlash va Sichqonlash: Eng Foydali Buyruqlar"
date: 2026-03-14
excerpt: "Foydali Linux buyruqlari. Fayllarni arxivlash va siqish"
tags: ["linux", "commands", "archiving", "compression", "tar"]
category: "linux"
readTime: 1
featured: false
draft: false
---

# Foydali Linux buyruqlari. Fayllarni arxivlash va siqish

Ushbu maqolada Linux tizimida fayllarni arxivlash va sichqonlash uchun eng foydali buyruqlar keltirilgan. Ular yordamida fayllarni turli formatlarda saqlash, tezlik va hajmni tejash mumkin.

```bash
gzip -9 file1
```
Fayl `file1` ni maksimal sichqonlik darajasida gzip arxiviga joylashtiradi.

```bash
rar a file1.rar file1 file2 dir1
```
`file1`, `file2` fayllari va `dir1` katalogini `file1.rar` arxiviga joylashtiradi.

```bash
rar a file1.rar test_file
```
`test_file` faylini `file1.rar` arxiviga qo'shadi.

```bash
rar x file.rar
```
`file.rar` arxivini ochadi.

```bash
bzip2 file1
```
`file1` faylini bzip2 formatida sichqonlaydi.

```bash
bunzip2 file1.bz2
```
`file1.bz2` faylini ochadi.

```bash
gzip file1
```
`file1` faylini gzip formatida sichqonlaydi.

```bash
gunzip file1.gz
```
`file1.gz` faylini ochadi.

```bash
tar -cvf archive.tar file1 file2 dir1
```
`file1`, `file2` fayllari va `dir1` katalogini `archive.tar` arxiviga joylashtiradi.

```bash
tar -cvf archive.tar file
```
`file` faylini `archive.tar` arxiviga joylashtiradi.

```bash
tar -tf archive.tar
```
`archive.tar` arxivining tarkibini ko'rsatadi.

```bash
tar -xvf archive.tar
```
`archive.tar` arxivini joriy katalogga ochadi.

```bash
tar -xvf archive.tar -C /tmp
```
`archive.tar` arxivini `/tmp` katalogiga ochadi.

```bash
tar -cvfz archive.tar.gz dir1
```
`dir1` katalogini gzip yordamida sichqonlab `archive.tar.gz` arxivini yaratadi.

```bash
tar -xvfz archive.tar.gz
```
`archive.tar.gz` arxivini ochadi.

```bash
tar -cvfj archive.tar.bz2 dir1
```
`dir1` katalogini bzip2 yordamida sichqonlab `archive.tar.bz2` arxivini yaratadi. E'tibor bering: ba'zi *nix tizimlarida `-j` kaliti ishlamaydi.

```bash
tar -xvfj archive.tar.bz2
```
`archive.tar.bz2` arxivini ochadi. E'tibor bering: ba'zi *nix tizimlarida `-j` kaliti ishlamaydi.

```bash
zip file1.zip file1
```
`file1` faylini `file1.zip` arxiviga joylashtiradi.

```bash
zip -r file1.zip file1 file2 dir1
```
`file1`, `file2` fayllari va `dir1` katalogini rekursiv ravishda `file1.zip` arxiviga joylashtiradi.

```bash
unzip file1.zip
```
`file1.zip` arxivini ochadi.

```bash
unrar x file1.rar
```
`file1.rar` arxivini ochadi.

Tags: linux, commands, archiving, compression, tar  
Category: linux