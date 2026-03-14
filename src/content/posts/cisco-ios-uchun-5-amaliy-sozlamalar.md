---
title: "Cisco IOS uchun 5 amaliy sozlamalar"
date: 2026-03-14
excerpt: "Cisco IOS uchun 5 amaliy sozlamalar"
tags: ["cisco", "ios", "networking", "security", "qos"]
category: "networking"
readTime: 1
featured: false
draft: false
---

Cisco IOS tizimida ishlayotgan tarmoq muhandislari uchun vaqtni tejash va tizimni barqaror ishlashini ta'minlash uchun 5 amaliy sozlamani ko'rib chiqamiz.

**TCP Intercept orqali SYN-flood hujumlarini oldini olish**  
Router paketlarni faqat tashlab yubormasdan, TCP handshake jarayonini boshqarib, faqat to'g'ri ulanishlarni ruxsat beradi, bu esa serverga bosimni kamaytiradi.

```ip
ip tcp intercept list SYN-FLOOD
ip tcp intercept mode intercept
ip tcp intercept max-incomplete 100
ip tcp intercept one-minute
```

**IP SLA Object Tracking orqali avtomatik failover**  
Xizmat to'xtaganda (masalan, 8.8.8.8 manziliga ulanish muvaffaqiyatsiz bo'lganda) yo'nalishlar yoki interfeyslarni avtomatik ravishda o'zgartirish mumkin.

```ip
ip sla 1
 icmp-echo 8.8.8.8 source-interface Gi0/0
 frequency 5
ip sla schedule 1 life forever start-time now

track 1 ip sla 1 reachability
ip route 0.0.0.0 0.0.0.0 10.0.0.1 track 1
ip route 0.0.0.0 0.0.0.0 10.0.0.2 10
```

**Control Plane uchun QoS sozlamalari**  
Foydalanuvchi trafiki bilan birga OSPF, BGP, SNMP kabi protokollarning CPU ni ortiqcha yuklashini oldini olish uchun QoS qoidalarini qo'llash.

```ip
class-map match-any CTRL-TRAFFIC
 match protocol ospf
 match protocol bgp
 match protocol snmp

policy-map CTRL-POLICY
 class CTRL-TRAFFIC
  police 64000 conform-action transmit exceed-action drop

control-plane
 service-policy input CTRL-POLICY
```

**VLAN filtri bilan Embedded Packet Capture (EPC)**  
SPAN-portlarni ishlatmasdan, kommutator yoki routerda to'g'ridan-to'g'ri trafikni kuzatish va faqat kerakli ma'lumotlarni olish.

```shell
monitor capture EPC interface Gi1/0/1 both match vlan 10
monitor capture EPC start
monitor capture EPC stop
show monitor capture EPC buffer brief
copy monitor capture EPC tftp://10.0.0.100/capture.pcap
```

**Smart Call Home orqali xabarnomalar**  
Tizimda muammolar yuzaga kelsa (interfeys holati, xatolar, SLA), qurilma oldindan sozlangan elektron pochta yoki syslog manziliga avtomatik xabarnoma yuboradi.

```ip
call-home
 profile "ALERTS"
  destination email admin@example.com
  subscribe-to all
  periodic-schedule daily 08:00
  send-alerts
```

Ushbu sozlamalar tarmoq infratuzilmasining ishlash tezligini va xavfsizligini oshirishga yordam beradi.

Tags: cisco, ios, networking, security, qos
Category: networking