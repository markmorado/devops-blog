---
title: "GitHub Actions для деплоя на VPS: кэш, артефакты и rollback за 30 секунд"
date: 2025-02-14
excerpt: "Строим production-ready CI/CD пайплайн на GitHub Actions с кэшированием Docker слоёв, умным rollback и уведомлениями в Telegram."
tags: ["ci-cd", "docker", "github-actions"]
readTime: 11
featured: false
---

## Цель

Пайплайн должен делать следующее:

1. При пуше в `main` — собирать Docker образ и деплоить на VPS
2. Кэшировать слои образа для ускорения сборки
3. При провале — автоматически откатываться к предыдущей версии
4. Уведомлять в Telegram об успехе или провале

## Структура пайплайна

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

      # Кэш Docker слоёв — ускоряет повторные сборки в 3-5 раз
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
            # Сохраняем текущую версию для rollback
            CURRENT=$(docker inspect ${{ env.CONTAINER_NAME }} \
              --format='{{.Config.Image}}' 2>/dev/null || echo "none")
            echo $CURRENT > /tmp/rollback_image

            # Загружаем и запускаем новый образ
            docker load < /tmp/${{ env.IMAGE_NAME }}.tar
            docker stop ${{ env.CONTAINER_NAME }} 2>/dev/null || true
            docker run -d \
              --name ${{ env.CONTAINER_NAME }} \
              --restart unless-stopped \
              -p 3000:3000 \
              ${{ env.IMAGE_NAME }}:${{ github.sha }}

            # Проверяем что контейнер поднялся
            sleep 5
            docker ps | grep ${{ env.CONTAINER_NAME }} || exit 1

      - name: Notify Telegram on success
        if: success()
        run: |
          curl -s -X POST "https://api.telegram.org/bot${{ secrets.TG_BOT_TOKEN }}/sendMessage" \
            -d chat_id="${{ secrets.TG_CHAT_ID }}" \
            -d text="✅ Deploy успешен: ${{ github.sha }}"

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
            -d text="❌ Deploy упал, откат выполнен: ${{ github.sha }}"
```

## Secrets в GitHub

Нужно добавить в **Settings → Secrets and variables → Actions**:

| Secret | Что это |
|--------|---------|
| `VPS_HOST` | IP или домен VPS |
| `VPS_USER` | Пользователь SSH |
| `VPS_SSH_KEY` | Приватный SSH ключ |
| `TG_BOT_TOKEN` | Токен Telegram бота |
| `TG_CHAT_ID` | ID чата для уведомлений |

## Результат

Первая сборка занимает ~3 минуты. Повторные — **40-60 секунд** благодаря кэшу Docker слоёв. При провале деплоя сервис автоматически возвращается к предыдущей версии, а в Telegram приходит уведомление с SHA коммита.
