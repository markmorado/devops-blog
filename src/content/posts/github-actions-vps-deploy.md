---
title: "GitHub Actions bilan VPS ga deploy: kesh, artefaktlar va 30 soniyada rollback"
date: 2025-02-14
excerpt: "GitHub Actions da Docker qatlamlarini keshlash, aqlli rollback va Telegram xabarnomalari bilan production-ready CI/CD pipeline quramiz."
tags: ["ci-cd", "docker", "github-actions"]
category: "ci-cd"
readTime: 11
featured: false
---

## Maqsad

Pipeline quyidagilarni bajarishi kerak:

1. `main` ga push bo'lganda — Docker image yaratish va VPS ga deploy qilish
2. Sburkani tezlashtirish uchun image qatlamlarini keshlash
3. Muvaffaqiyatsizlikda — avtomatik oldingi versiyaga qaytish
4. Muvaffaqiyat yoki muvaffaqiyatsizlik haqida Telegram da xabar berish

## Pipeline tuzilmasi

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]

env:
  IMAGE_NAME: myapp
  CONTAINER_NAME: myapp-prod

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Docker qatlamlarini keshlash — takroriy sburkani 3-5 marta tezlashtiradi
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build image
        uses: docker/build-push-action@v5
        with:
          context: .
          load: true
          tags: ${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            # Rollback uchun joriy versiyani saqlaymiz
            CURRENT=$(docker inspect ${{ env.CONTAINER_NAME }} \
              --format='{{.Config.Image}}' 2>/dev/null || echo "none")
            echo $CURRENT > /tmp/rollback_image

            # Yangi imageni yuklaymiz va ishga tushiramiz
            docker load < /tmp/${{ env.IMAGE_NAME }}.tar
            docker stop ${{ env.CONTAINER_NAME }} 2>/dev/null || true
            docker run -d \
              --name ${{ env.CONTAINER_NAME }} \
              --restart unless-stopped \
              -p 3000:3000 \
              ${{ env.IMAGE_NAME }}:${{ github.sha }}

            # Konteyner ko'tarilganini tekshiramiz
            sleep 5
            docker ps | grep ${{ env.CONTAINER_NAME }} || exit 1

      - name: Notify Telegram on success
        if: success()
        run: |
          curl -s -X POST "https://api.telegram.org/bot${{ secrets.TG_BOT_TOKEN }}/sendMessage" \
            -d chat_id="${{ secrets.TG_CHAT_ID }}" \
            -d text="✅ Deploy muvaffaqiyatli: ${{ github.sha }}"

      - name: Rollback on failure
        if: failure()
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            ROLLBACK=$(cat /tmp/rollback_image)
            if [ "$ROLLBACK" != "none" ]; then
              docker stop ${{ env.CONTAINER_NAME }} || true
              docker run -d --name ${{ env.CONTAINER_NAME }} \
                --restart unless-stopped -p 3000:3000 $ROLLBACK
              echo "Rolled back to $ROLLBACK"
            fi

      - name: Notify Telegram on failure
        if: failure()
        run: |
          curl -s -X POST "https://api.telegram.org/bot${{ secrets.TG_BOT_TOKEN }}/sendMessage" \
            -d chat_id="${{ secrets.TG_CHAT_ID }}" \
            -d text="❌ Deploy muvaffaqiyatsiz, rollback bajarildi: ${{ github.sha }}"
```

## GitHub da Secrets

**Settings → Secrets and variables → Actions** ga qo'shish kerak:

| Secret | Bu nima |
|--------|---------|
| `VPS_HOST` | VPS IP yoki domeni |
| `VPS_USER` | SSH foydalanuvchisi |
| `VPS_SSH_KEY` | Shaxsiy SSH kaliti |
| `TG_BOT_TOKEN` | Telegram bot tokeni |
| `TG_CHAT_ID` | Xabarlar uchun chat ID |

## Natija

Birinchi sbur ~3 daqiqa davom etadi. Takroriy — Docker qatlamlari keshi tufayli **40-60 soniya**. Deploy muvaffaqiyatsiz bo'lganda servis avtomatik oldingi versiyaga qaytadi, Telegram da esa commit SHA bilan xabar keladi.
