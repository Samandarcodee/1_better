# Local Development Setup

## .env Fayl Yaratish

Loyiha ildizida `.env` fayl yarating va quyidagi kontentni qo'shing:

```env
# Database Configuration
# Neon PostgreSQL Database Connection String
DATABASE_URL=postgresql://neondb_owner:npg_c4Ihv9jBLuEP@ep-plain-sound-ab39we88-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Application Configuration
NODE_ENV=development
PORT=5000

# Telegram Bot Configuration
# WEB_APP_URL=https://one-better.onrender.com
```

## Qadamlar

### 1. .env Fayl Yaratish

**Windows PowerShell'da:**
```powershell
cd C:\Users\Диёрбек\Desktop\BetterHabit
notepad .env
```

Yoki **VS Code'da:**
1. File → New File
2. `.env` nomini kiriting
3. Yuqoridagi kontentni qo'shing
4. Saqlang

### 2. Server'ni Ishga Tushirish

**Windows uchun:**
```bash
npm run dev:win
```

**Linux/Mac uchun:**
```bash
npm run dev
```

Server `http://localhost:5000` da ishga tushadi.

### 3. Test Qilish

Brauzerda yoki curl bilan:
```bash
# Barcha odatlarni olish
curl http://localhost:5000/api/habits

# Yoki brauzerda
http://localhost:5000/api/habits
```

## Eslatmalar

- `.env` fayl `.gitignore`'da, shuning uchun GitHub'ga yuklanmaydi
- `DATABASE_URL` mavjud bo'lsa, PostgreSQL ishlatiladi
- `DATABASE_URL` bo'lmasa, xotira (MemStorage) ishlatiladi
- Database table allaqachon yaratilgan (Neon Dashboard'da)

## Muammolarni Hal Qilish

### Database ulanmayapti

1. `.env` faylda `DATABASE_URL` to'g'ri ekanligini tekshiring
2. Neon Dashboard'da database ishlayotganini tekshiring
3. Connection string'dagi parol to'g'ri ekanligini tekshiring

### Server ishlamayapti

1. `npm install` qiling
2. Port 5000 band bo'lmasligini tekshiring
3. Logs'ni ko'rib chiqing






