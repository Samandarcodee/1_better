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

**Windows uchun:** `npm run dev:win` buyrug'ini ishlating.

## Render'ga Deploy Qilish

### 1. GitHub'ga yuklash

Loyhani GitHub repository'ga yuklang:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Render Dashboard'da sozlash

1. [Render Dashboard](https://dashboard.render.com/) ga kiring
2. **New +** → **Web Service** ni tanlang
3. GitHub repository'ni ulang
4. Quyidagi sozlamalarni kiriting:
   - **Name:** `betterhabit` (yoki xohlagan nomingiz)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (yoki xohlagan planingiz)

5. **Environment Variables** bo'limida:
   - `NODE_ENV` = `production`
   - `PORT` - Render avtomatik o'rnatadi

6. **Create Web Service** ni bosing

### 3. Telegram Webhook sozlash

Deploy qilingandan keyin:

1. Render'dan berilgan URL ni oling (masalan: `https://betterhabit.onrender.com`)
2. Telegram Bot webhook'ni sozlang:
   ```
   https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://betterhabit.onrender.com/api/telegram/webhook
   ```
3. BotFather'da Menu Button'ni sozlang:
   - URL: `https://betterhabit.onrender.com`
   - Menu text: `Odatlarni boshqarish`

### 4. render.yaml orqali deploy (Alternativ)

Agar `render.yaml` faylidan foydalanmoqchi bo'lsangiz:

1. GitHub'ga `render.yaml` faylini yuklang
2. Render Dashboard'da **New +** → **Blueprint** ni tanlang
3. Repository'ni tanlang va **Apply** ni bosing

**Eslatma:** Free plan'da server 15 daqiqa ishlatilmasa uxlaydi. Birinchi so'rov sekin bo'lishi mumkin (cold start).

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
