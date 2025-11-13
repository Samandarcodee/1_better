# Telegram Bot Muammosini Hal Qilish

## Muammo: Bot ishlamayapti

Bot ishlamasligi uchun bir necha sabab bo'lishi mumkin:

### 1. Webhook noto'g'ri sozlangan yoki o'chirilgan

**Tekshirish:**

Brauzerda quyidagi URL'ni oching:
```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/getWebhookInfo
```

**Kutilayotgan natija:**
```json
{
  "ok": true,
  "result": {
    "url": "https://one-better.onrender.com/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

**Agar `url` bo'sh yoki noto'g'ri bo'lsa:**

Quyidagi URL'ni brauzerda oching:
```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://one-better.onrender.com/api/telegram/webhook
```

Natija:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

### 2. Production server ishlamayapti (Render)

**Tekshirish:**

Brauzerda quyidagi URL'larni oching:

1. **Webhook endpoint:**
   ```
   https://one-better.onrender.com/api/telegram/webhook
   ```
   
   Kutilayotgan javob:
   ```json
   {
     "status": "ok",
     "message": "Webhook endpoint is ready",
     "url": "/api/telegram/webhook",
     "method": "POST"
   }
   ```

2. **Habits API:**
   ```
   https://one-better.onrender.com/api/habits
   ```
   
   Kutilayotgan javob: habits array (bo'sh yoki ma'lumotlar bilan)

**Agar server javob bermasa:**

1. [Render Dashboard](https://dashboard.render.com/) ga kiring
2. `one-better` service'ni oching
3. **Logs** tabni tekshiring
4. Agar server uxlab qolgan bo'lsa (Free plan), biror URL'ni ochib serverni uyg'oting

### 3. Environment Variables (Production)

Render Dashboard'da quyidagi environment variables tekshiring:

1. `NODE_ENV` = `production`
2. `DATABASE_URL` = `postgresql://...` (to'liq connection string)
3. `WEB_APP_URL` = `https://one-better.onrender.com`

### 4. Menu Button sozlash

BotFather'da menu button sozlang:

1. [@BotFather](https://t.me/BotFather) ga o'ting
2. `/mybots` → **1% Better Ai** → **Bot Settings** → **Menu Button**
3. **Configure menu button** → **Edit menu button URL**
4. URL: `https://one-better.onrender.com`
5. Menu text: `🚀 Odatlarni boshqarish`

## Test Qilish

1. **Bot ma'lumotlarini tekshirish:**
   ```
   https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/getMe
   ```

2. **@Better_ai_bot ga o'ting**
3. `/start` buyrug'ini yuboring
4. "Salom! 👋" xabari kelishi kerak + Mini App tugmasi
5. Menu tugmasini (pastdagi keyboardda) bosing
6. Mini App ochilishi kerak

## Tez-tez uchraydigan xatolar

### Xato 1: "Webhook was deleted"
**Yechim:** Webhook'ni qayta o'rnating (yuqoridagi setWebhook URL)

### Xato 2: Bot javob bermayapti
**Sabab:** Server uxlab qolgan (Render Free plan)
**Yechim:** Biror API URL'ni oching (masalan, /api/habits)

### Xato 3: Mini App ochilmayapti
**Sabab:** Menu button noto'g'ri sozlangan
**Yechim:** BotFather'da menu button URL'ni tekshiring

### Xato 4: 404 Not Found
**Sabab:** Webhook endpoint yo'q
**Yechim:** 
- `server/routes.ts` da `/api/telegram/webhook` endpoint mavjudligini tekshiring
- Serverni restart qiling

## Debug Qilish

### Server Logs (Render Dashboard)

1. Render Dashboard → Service → **Logs**
2. Qidiruv: `Webhook received` yoki `Message from`
3. Agar log'lar ko'rinmasa - webhook ishlamayapti

### Manual Test (curl)

Windows PowerShell'da:
```powershell
Invoke-WebRequest -Uri "https://one-better.onrender.com/api/telegram/webhook" -Method GET
```

Yoki Git Bash'da:
```bash
curl https://one-better.onrender.com/api/telegram/webhook
```

## Qisqa yo'l: Hammasi ishlamasa

1. **Webhook'ni o'chirish:**
   ```
   https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/deleteWebhook
   ```

2. **Server'ni tekshirish:**
   ```
   https://one-better.onrender.com/api/habits
   ```

3. **Webhook'ni qayta o'rnatish:**
   ```
   https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://one-better.onrender.com/api/telegram/webhook
   ```

4. **Test qilish:**
   - @Better_ai_bot → `/start`

## Yordam kerakmi?

Agar muammo hal bo'lmasa, quyidagi ma'lumotlarni yuboring:

1. `getWebhookInfo` natijasi
2. `https://one-better.onrender.com/api/telegram/webhook` GET so'rovi natijasi
3. Render Dashboard'dagi Logs
4. Botga `/start` yuborganda nima bo'ladi?

