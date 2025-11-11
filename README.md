# 1% Better - Odatlar Kuzatish Ilovasi

Telegram Mini App orqali odatlarni kuzatish ilovasi.

## Texnologiyalar

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Database:** Drizzle ORM (hozircha xotirada)

## Ishga tushirish

### Dependencies o'rnatish

```bash
npm install
```

### Development server

```bash
npm run dev
```

Server `http://localhost:5000` da ishga tushadi.

## Xususiyatlar

- ✅ Odatlarni qo'shish, o'chirish, tahrirlash
- ✅ Kunlik bajarilganlikni belgilash
- ✅ Streak (ketma-ketlik) hisoblash
- ✅ Progress bar
- ✅ Kalendar ko'rinishi
- ✅ Telegram Mini App integratsiyasi

## Telegram Bot

- **Bot:** @Better_ai_bot
- **Token:** `8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk`

## API Endpoints

- `GET /api/habits` - Barcha odatlarni olish
- `GET /api/habits/:id` - Bitta odatni olish
- `POST /api/habits` - Yangi odat qo'shish
- `PATCH /api/habits/:id` - Odatni yangilash
- `DELETE /api/habits/:id` - Odatni o'chirish
- `POST /api/habits/:id/mark` - Kunlik bajarilganligini belgilash

## Loyiha tuzilmasi

```
BetterHabit/
├── client/          # Frontend (React)
├── server/          # Backend (Express)
├── shared/          # Umumiy kodlar
└── package.json     # Dependencies
```

## License

MIT
