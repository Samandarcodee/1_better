# Database Setup Qo'llanmasi

## Muammo
Drizzle-kit pooler endpoint'ga ulanmoqchi bo'lyapti, lekin endpoint o'chirilgan.

## Yechimlar

### Yechim 1: Manual SQL orqali (Eng oson)

1. [Neon Dashboard](https://console.neon.tech/) ga kiring
2. Database'ingizni tanlang
3. **SQL Editor** ni oching
4. `setup-database.sql` faylidagi SQL'ni nusxalang va ishga tushiring
5. Table yaratilganini tekshiring

### Yechim 2: Direct Connection String ishlatish

1. Neon Dashboard → **Connect to your database**
2. **Connection pooling** toggle'ni **OFF** qiling
3. Yangi connection string oling (pooler bo'lmagan)
4. `.env` fayl yaratish:
   ```env
   DATABASE_URL=postgresql://neondb_owner:password@ep-plain-sound-ab39we88.eu-west-2.aws.neon.tech/neondb?sslmode=require
   ```
   (Eslatma: `-pooler` bo'lmasligi kerak)

5. Keyin qayta urinib ko'ring:
   ```bash
   npm run db:push
   ```

### Yechim 3: Neon API orqali endpoint yoqish

Agar Neon API access bo'lsa, endpoint'ni API orqali yoqish mumkin.

## Tekshirish

Database ulanganini tekshirish:

1. Neon Dashboard → SQL Editor
2. Quyidagi query'ni ishga tushiring:
   ```sql
   SELECT * FROM habits;
   ```

3. Yoki application'ni ishga tushiring va API endpoint'larni test qiling:
   ```bash
   curl https://one-better.onrender.com/api/habits
   ```

## Eslatmalar

- Pooler endpoint serverless uchun yaxshi, lekin drizzle-kit uchun direct connection kerak
- Production'da pooler ishlatish tavsiya etiladi
- Development'da direct connection ishlatish mumkin








