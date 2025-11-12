# Render Deployment - Telegram Bot Sozlash

## ✅ Server Deploy Qilindi

Serveringiz muvaffaqiyatli deploy qilindi:
- **URL:** https://one-better.onrender.com
- **Status:** ✅ Live

## 🔧 Telegram Bot'ni Sozlash

### 1. Webhook Sozlash

Telegram bot webhook'ni sozlang. Quyidagi URL ni brauzerda oching yoki curl bilan yuboring:

```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://one-better.onrender.com/api/telegram/webhook
```

**Yoki PowerShell'da:**

```powershell
curl "https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://one-better.onrender.com/api/telegram/webhook"
```

**Kutilayotgan javob:**
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

### 2. Webhook'ni Tekshirish

Webhook to'g'ri sozlanganini tekshirish:

```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/getWebhookInfo
```

### 3. BotFather'da Menu Button Sozlash

1. [@BotFather](https://t.me/BotFather) ga o'ting
2. `/mybots` yuboring
3. **"1% Better Ai"** yoki bot nomingizni tanlang
4. **Bot Settings** → **Menu Button** → **Configure menu button**
5. URL kiriting: `https://one-better.onrender.com`
6. Menu matni: `Odatlarni boshqarish`
7. **Save** ni bosing

### 4. Test Qilish

1. [@Better_ai_bot](https://t.me/Better_ai_bot) ga o'ting
2. `/start` yuboring
3. **"Salom! 👋"** xabari kelishi kerak
4. Menu tugmasini bosing
5. **🎉 Mini App ochiladi!**

## 🐛 Muammolarni Hal Qilish

### Bot javob bermayapti

1. **Webhook tekshirish:**
   ```
   https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/getWebhookInfo
   ```

2. **Render Logs'ni tekshirish:**
   - Render Dashboard → Your Service → Logs
   - Webhook so'rovlari ko'rinishi kerak

3. **Webhook endpoint'ni test qilish:**
   ```
   https://one-better.onrender.com/api/telegram/webhook
   ```
   Bu GET so'rov bo'lsa, `{"status":"ok"}` qaytishi kerak

### Server uxlayapti (Free Plan)

Free plan'da server 15 daqiqa ishlatilmasa uxlaydi. Birinchi so'rov sekin bo'lishi mumkin (cold start ~30-60 soniya).

**Yechim:** Paid plan'ga o'ting yoki serverni faol saqlash uchun uptime monitoring xizmatidan foydalaning.

## 📝 Eslatmalar

- Webhook URL HTTPS bo'lishi kerak (Render avtomatik HTTPS beradi)
- Server restart qilinganda webhook o'zgarishi shart emas
- Bot token'ni xavfsiz saqlang va GitHub'ga yuklamang
- Environment variable sifatida bot token'ni qo'shish tavsiya etiladi

