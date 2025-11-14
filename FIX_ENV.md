# .env Fayl Muammosini Hal Qilish

## Muammo
Server `.env` faylni o'qiy olmayapti, shuning uchun `DATABASE_URL` undefined bo'lishi mumkin.

## Yechim

### 1. dotenv Package O'rnatish

Terminal'da quyidagi buyruqni ishga tushiring:

```powershell
npm install dotenv
```

### 2. Server'ni Qayta Ishga Tushirish

```powershell
npm run dev:win
```

### 3. .env Fayl Tekshirish

`.env` fayl loyiha ildizida (`C:\Users\Диёрбек\Desktop\BetterHabit\.env`) mavjudligini tekshiring:

```powershell
# PowerShell'da
Test-Path .env
```

Agar `False` qaytsa, `.env` fayl yaratilmagan. Quyidagilarni bajaring:

```powershell
notepad .env
```

Keyin quyidagi kontentni qo'shing:

```env
DATABASE_URL=postgresql://neondb_owner:npg_c4Ihv9jBLuEP@ep-plain-sound-ab39we88-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=development
PORT=5000
```

### 4. Tekshirish

Server'ni qayta ishga tushirgandan keyin, console'da quyidagilardan birini ko'rasiz:

- `✅ PostgreSQL database connected` - database ulanadi
- `💾 Using in-memory storage` - `.env` yo'q yoki database ulanmayapti

## Qo'shimcha Tekshirish

Agar hali ham muammo bo'lsa:

1. **Console'dagi xatoliklarni ko'ring** - server terminal'ida
2. **Database table mavjudligini tekshiring** - Neon Dashboard'da
3. **Connection string to'g'riligini tekshiring** - `.env` faylda






