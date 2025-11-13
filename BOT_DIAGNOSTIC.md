# 🔍 TELEGRAM BOT DIAGNOSTIKA

## Botning hozirgi holati

### 1. Server konfiguratsiyasi ✅

**Production URL:** `https://one-better.onrender.com`

**Webhook endpoint:** 
- POST: `/api/telegram/webhook` - Telegram'dan xabarlar qabul qiladi
- GET: `/api/telegram/webhook` - Test uchun (status: ok qaytaradi)

**Bot ma'lumotlari:**
- Bot: @Better_ai_bot
- Token: `8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk`

---

## 🧪 TEKSHIRISH BOSQICHLARI

### BOSQICH 1: Bot aktiv ekanini tekshirish

**URL:** 
```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/getMe
```

**Kutilayotgan javob:**
```json
{
  "ok": true,
  "result": {
    "id": 8300153631,
    "is_bot": true,
    "first_name": "1% Better Ai",
    "username": "Better_ai_bot"
  }
}
```

✅ **Agar `"ok": true`** - Bot aktiv  
❌ **Agar xatolik** - Token noto'g'ri

---

### BOSQICH 2: Webhook holatini tekshirish

**URL:**
```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/getWebhookInfo
```

**TO'G'RI natija:**
```json
{
  "ok": true,
  "result": {
    "url": "https://one-better.onrender.com/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "last_error_date": 0
  }
}
```

**MUAMMOLI holatlar:**

❌ **`"url": ""`** (bo'sh) - Webhook o'rnatilmagan
   - Yechim: BOSQICH 4'ni bajaring

❌ **`"pending_update_count": 5`** (0 dan katta) - Xabarlar kutilmoqda
   - Sabab: Server javob bermayapti
   - Yechim: BOSQICH 3'ni bajaring

❌ **`"last_error_date"` va `"last_error_message"`** mavjud
   - Sabab: Telegram webhook'ga ulanolmayapti
   - Xatolik tavsifi: `last_error_message` da yozilgan

---

### BOSQICH 3: Server ishlayotganini tekshirish

**URL 1 - Webhook endpoint:**
```
https://one-better.onrender.com/api/telegram/webhook
```

**Kutilayotgan javob:**
```json
{
  "status": "ok",
  "message": "Webhook endpoint is ready",
  "url": "/api/telegram/webhook",
  "method": "POST"
}
```

**URL 2 - Habits API:**
```
https://one-better.onrender.com/api/habits
```

**Kutilayotgan javob:**
```json
[]
```
(yoki habits array)

---

❌ **AGAR SERVER JAVOB BERMASA:**

**Sabab 1: Server uxlab qolgan (Render Free Plan)**
- Free plan'da 15 daqiqa ishlatilmasa server to'xtaydi
- Birinchi so'rov 30-50 sekund davom etishi mumkin

**Yechim:**
1. [Render Dashboard](https://dashboard.render.com/) ga kiring
2. `one-better` service'ni toping
3. **Logs** bo'limini oching
4. Oxirgi log vaqtini tekshiring
5. Agar server to'xtagan bo'lsa, `/api/habits` URL'ni bir necha marta yangilang

**Sabab 2: Deploy xatoligi**
- Oxirgi deploy muvaffaqiyatsiz bo'lgan

**Yechim:**
1. Render Dashboard → **Logs**
2. Qizil rangdagi xatolarni qidiring
3. Agar kerak bo'lsa: **Manual Deploy** → **Clear build cache & deploy**

**Sabab 3: Environment Variables yo'q**
- `DATABASE_URL`, `WEB_APP_URL` sozlanmagan

**Yechim:**
1. Render Dashboard → **Environment** tab
2. Quyidagilar mavjudligini tekshiring:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `postgresql://...`
   - `WEB_APP_URL` = `https://one-better.onrender.com`

---

### BOSQICH 4: Webhook o'rnatish

**URL:**
```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://one-better.onrender.com/api/telegram/webhook
```

**Kutilayotgan javob:**
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

---

### BOSQICH 5: Menu Button sozlash

1. [@BotFather](https://t.me/BotFather) ga o'ting
2. `/mybots` → **1% Better Ai**
3. **Bot Settings** → **Menu Button**
4. **Configure menu button**
5. URL: `https://one-better.onrender.com`
6. Menu text: `🚀 Odatlarni boshqarish`

---

### BOSQICH 6: Bot'ni test qilish

1. [@Better_ai_bot](https://t.me/Better_ai_bot) ga o'ting
2. `/start` yuboring

**TO'G'RI javob:**
```
Salom! 👋

1% Better ilovasiga xush kelibsiz!

Odatlarni boshqarish uchun quyidagi tugmani bosing yoki menu tugmasidan foydalaning.

[🚀 Mini App'ni ochish] (tugma)
```

3. Tugmani bosing → Mini App ochilishi kerak
4. Pastdagi menu tugmasini bosing → Mini App ochilishi kerak

---

## 🐛 UMUMIY MUAMMOLAR VA YECHIMLAR

### 1. Bot javob bermayapti

**Tekshirish:**
```
getWebhookInfo → pending_update_count > 0
```

**Sabab:** Server ishlamayapti yoki webhook noto'g'ri

**Yechim:**
1. Server'ni uyg'oting (BOSQICH 3)
2. Webhook'ni qayta o'rnating (BOSQICH 4)
3. 5-10 daqiqa kuting (Telegram qayta urinadi)

---

### 2. Webhook o'rnatilganda xatolik

**Xatolik:**
```json
{
  "ok": false,
  "error_code": 400,
  "description": "Bad Request: bad webhook: ..."
}
```

**Sabab 1:** URL noto'g'ri (HTTPS bo'lishi kerak)
**Sabab 2:** Server javob bermayapti
**Sabab 3:** SSL sertifikati muammoli

**Yechim:**
1. URL'ni to'g'ri kiriting (https://)
2. Server ishlayotganini tekshiring
3. Render'da SSL avtomatik

---

### 3. Mini App ochilmayapti

**Sabab:** Menu Button noto'g'ri sozlangan

**Yechim:**
- BotFather'da Menu Button URL'ni tekshiring
- URL: `https://one-better.onrender.com` (webhook yo'li emas!)

---

### 4. Server logs'da "Webhook received" ko'rinmayapti

**Sabab:** Webhook Telegram tomonidan chaqirilmayapti

**Yechim:**
1. `getWebhookInfo` orqali webhook URL'ni tekshiring
2. `last_error_message` ni o'qing
3. Webhook'ni qayta o'rnating

---

### 5. "Connection refused" xatosi

**Sabab:** Server to'xtagan

**Yechim:**
- Render Dashboard'da service'ni restart qiling
- Yoki `/api/habits` URL'ni oching (server uyg'onadi)

---

## 📊 MUVAFFAQIYATLI SOZLASH CHECKLIST

- [ ] Bot aktiv (`getMe` → ok: true)
- [ ] Webhook o'rnatilgan (`getWebhookInfo` → url to'ldirilgan)
- [ ] Server javob beradi (`/api/telegram/webhook` → 200 OK)
- [ ] Menu Button sozlangan (BotFather)
- [ ] `/start` javob beradi (bot xabar yuboradi)
- [ ] Mini App ochiladi (tugma ishlaydi)

---

## 🔄 TOZALASH (Agar hamma narsa ishlamasa)

1. **Webhook o'chirish:**
   ```
   https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/deleteWebhook
   ```

2. **Server restart:**
   - Render Dashboard → Service → **Manual Deploy**

3. **Webhook qayta o'rnatish:**
   ```
   https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://one-better.onrender.com/api/telegram/webhook
   ```

4. **Test:**
   - @Better_ai_bot → `/start`

---

## 📞 QAYERDAN BOSHLASH?

1. ✅ **Avval BOSQICH 1** - Bot aktiv ekanini tekshiring
2. ✅ **Keyin BOSQICH 3** - Server ishlayotganini tekshiring
3. ✅ **Keyin BOSQICH 2** - Webhook holatini tekshiring
4. ✅ **Keyin BOSQICH 4** - Webhook o'rnating (agar kerak bo'lsa)
5. ✅ **Oxirida BOSQICH 6** - Test qiling

**Har bir bosqichda natijani yozib boring, shunda muammoni topish oson bo'ladi!**

