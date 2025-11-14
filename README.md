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

### Environment Variables (.env)

Loyiha ildizida `.env` fayl yarating:

```env
DATABASE_URL=postgresql://neondb_owner:npg_c4Ihv9jBLuEP@ep-plain-sound-ab39we88-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=development
PORT=5000
```

**Windows PowerShell'da:**
```powershell
notepad .env
```

Keyin yuqoridagi kontentni qo'shing va saqlang.

Batafsil: [LOCAL_SETUP.md](./LOCAL_SETUP.md)

### Development server

```bash
npm run dev
```

**Windows uchun:**
```bash
npm run dev:win
```

Server `http://localhost:5000` da ishga tushadi.

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

### Core Features
- ✅ **Odatlarni qo'shish, tahrirlash, o'chirish** - To'liq CRUD operatsiyalar
- ✅ **Kunlik bajarilganlikni belgilash** - Har kun odatni belgilash
- ✅ **Streak (ketma-ketlik) hisoblash** - Motivatsiya uchun streak counter
- ✅ **Progress bar & visualization** - Progress ko'rsatkichlari
- ✅ **Kalendar ko'rinishi** - Tarixiy ma'lumotlar
- ✅ **Telegram Mini App** - Telegram ichida ishlaydi

### 🆕 Yangi Xususiyatlar (v2.0)
- ✨ **Emoji Icon tanlash** - 12 ta turli icon, har bir odat uchun
- 📝 **Izoh (Description)** - Odat haqida batafsil ma'lumot (200 belgi)
- ✏️ **Tahrirlash mode** - Mavjud odatlarni to'liq tahrirlash
- 🗑️ **Xavfsiz o'chirish** - Tasdiqlash dialogi bilan
- 💎 **Zamonaviy UI/UX** - Gradient dizayn, animatsiyalar
- 📊 **Quick Stats** - Asosiy sahifada statistika
- 🎨 **Enhanced Cards** - Yanada chiroyli habit card'lar

### Security & Auth
- ✅ **Foydalanuvchi autentifikatsiyasi (Telegram ID)**
- ✅ **Har bir user o'z ma'lumotlarini ko'radi**
- ✅ **User isolation** - Ma'lumotlar xavfsizligi

## Telegram Bot

- **Bot:** @Better_ai_bot
- **Token:** `8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk`

### Bot ishlamayapti?

**Tezkor yechim:** [FIX_TELEGRAM_BOT.md](./FIX_TELEGRAM_BOT.md) - 3 qadamda hal qiling!

Batafsil: [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) | [BOT_DIAGNOSTIC.md](./BOT_DIAGNOSTIC.md)

## API Endpoints

**Eslatma:** Barcha endpoints Telegram user ID bilan himoyalangan (requireAuth middleware)

- `GET /api/habits` - Foydalanuvchining odatlarini olish
- `GET /api/habits/:id` - Bitta odatni olish (faqat o'ziniki)
- `POST /api/habits` - Yangi odat qo'shish
- `PATCH /api/habits/:id` - Odatni yangilash (faqat o'ziniki)
- `DELETE /api/habits/:id` - Odatni o'chirish (faqat o'ziniki)
- `POST /api/habits/:id/mark` - Kunlik belgilash (faqat o'ziniki)
- `POST /api/telegram/webhook` - Telegram bot webhook

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
