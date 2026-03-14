---
title: "Metrikalar va Monitoring: Prometheusga Kirish"
date: 2026-03-14
excerpt: "Metrikalar va Monitoring: Prometheusga Kirish"
tags: ["monitoring", "prometheus", "metrics", "grafana", "kubernetes"]
category: "monitoring"
readTime: 1
featured: false
draft: false
---

Metrikalar dasturiy tizimlarni nazorat qilish va ularning ishlash samaradorligini baholash uchun asosiy vositadir. Ushbu maqolada metrikalarni to'plash, saqlash va vizualizatsiya qilish tizimlariga kirish beriladi.

Dasturiy tizimlarni qo'llab-quvvatlash va ishonchli xizmat ko'rsatish uchun kodi va infratuzilma ishlashini tushunish muhimdir. Buning uchun loglar, metrikalar va treyslar to'planadi. Loglar voqealarni qayd etishda sodda bo'lsa-da, metrikalar bilan ishlash murakkabroq jarayon hisoblanadi. 

## 1. Nazariy asoslar

Boshlang'ich bosqichda [Habrda "Chelovecheskim yazykom pro metriki" nomli maqola seriyasini](https://habr.com/ru/companies/tochka/articles/683608/) o'qish tavsiya etiladi. Ushbu materialda matematik asoslar, Prometheus ishlash mexanizmlari va vizualizatsiya usullari tushuntirilgan.

## 2. Amaliy mashg'ulotlar

Metrikalarni so'rov yordamida o'rganish uchun [PromLens demo platformasidan](https://demo.promlens.com) foydalaning. Ushbu interaktiv vositada quyidagi manbalardan foydalanish mumkin:
```
https://demo.promlens.com/metrics
```
So'rovlar tuzish uchun [PromQL tezkor справка](https://promlabs.com/promql-cheat-sheet/) yordam beradi.

## 3. O'z kompyuterida sinash

Kubernetes, Prometheus va Grafana integratsiyasini o'rganish uchun [k8s-deployment-strategies](https://github.com/ContainerSolutions/k8s-deployment-strategies) repozitoriyasidan foydalaning. Shuningdek, dasturingizga standart runtime metrikalarini qo'shish uchun [Golang uchun rahbarlik](https://oneuptime.com/blog/post/2026-01-07-go-runtime-metrics/view) mavjud.

## 4. Asosiy metrikalar

Monitoring tizimini qurishda quyidagi metrikalar asosini tashkil etadi:
- **RED**: Tezlik (Rate), Xatolar (Errors), Davomiylik (Duration)
- **USE**: Foydalanish (Utilization), To'yinganlik (Saturation), Xatolar (Errors)
- **To'rt Altin Signal**: Latentlik (Latency), Trafik (Traffic), Xatolar (Errors), To'yinganlik (Saturation)

Tags: monitoring, prometheus, metrics, grafana, kubernetes  
Category: monitoring