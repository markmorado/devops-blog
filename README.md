# TZIM Blog — DevOps блог на Astro

Минималистичный DevOps блог. Тёмная тема, Markdown статьи, RSS, теги.

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Запустить dev-сервер
npm run dev
# → http://localhost:4321

# 3. Сборка для продакшена
npm run build

# 4. Превью сборки
npm run preview
```

## Структура проекта

```
src/
├── content/
│   ├── config.ts          ← схема frontmatter
│   └── posts/             ← твои статьи (.md или .mdx)
├── layouts/
│   ├── Base.astro         ← общий каркас (nav, footer, SEO)
│   └── Post.astro         ← шаблон страницы статьи
├── pages/
│   ├── index.astro        ← главная
│   ├── about.astro        ← страница "обо мне"
│   ├── posts/[slug].astro ← динамические страницы статей
│   ├── tags/[tag].astro   ← страницы тегов
│   └── rss.xml.js         ← RSS фид
├── components/
│   └── PostCard.astro     ← карточка статьи
└── styles/
    └── global.css         ← глобальные стили
```

## Как написать статью

Создай файл в `src/content/posts/my-post.md`:

```markdown
---
title: "Заголовок статьи"
date: 2025-03-01
excerpt: "Краткое описание для превью и SEO (1-2 предложения)"
tags: ["docker", "linux"]
readTime: 8
featured: false   # true — показывать первой на главной
draft: false      # true — скрыть из публикации
---

## Твой контент здесь

Обычный Markdown. Код с подсветкой синтаксиса из коробки.

```bash
docker compose up -d
```
```

## Деплой на Cloudflare Pages

1. Пушишь репозиторий на GitHub
2. Идёшь на [pages.cloudflare.com](https://pages.cloudflare.com)
3. **Create project → Connect to Git → выбираешь репо**
4. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
5. Нажимаешь Deploy

Готово. При каждом `git push` сайт обновляется автоматически.

## Кастомизация

Основные переменные в `src/styles/global.css`:

```css
:root {
  --bg:      #0d0f0f;   /* фон */
  --accent:  #00e5a0;   /* акцентный цвет */
  --text:    #d4dbd8;   /* основной текст */
  --muted:   #5a6b66;   /* второстепенный текст */
}
```

Название блога — в `src/layouts/Base.astro` (ищи "TZIM Blog").

Домен — в `astro.config.mjs`, поле `site`.
