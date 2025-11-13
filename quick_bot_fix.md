# TELEGRAM BOT TEZKOR YECHIM

## 🚀 3 QADAMDA BOT'NI ISHGA TUSHIRISH

### QADAM 1: Webhook'ni o'rnatish

**Brauzerda quyidagi URL'ni oching:**

```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://one-better.onrender.com/api/telegram/webhook
```

**Ko'rinishi kerak:**
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

---

### QADAM 2: Server'ni uyg'otish (Render Free Plan)

**Brauzerda quyidagi URL'ni oching:**

```
https://one-better.onrender.com/api/habits
```

**Ko'rinishi kerak:**
```json
[]
```
yoki habits array

**Agar hech narsa yuklanmasa:**
- [Render Dashboard](https://dashboard.render.com/) ga kiring
- `one-better` service'ni toping
- Logs'ni tekshiring
- "Manual Deploy" bosing (agar kerak bo'lsa)

---

### QADAM 3: Test qilish

1. **Telegram'da [@Better_ai_bot](https://t.me/Better_ai_bot) ga o'ting**
2. **/start** buyrug'ini yuboring
3. **"Salom! 👋"** xabari kelishi kerak
4. **🚀 Mini App'ni ochish** tugmasini bosing
5. ✅ **Ilova ochilishi kerak!**

---

## ❌ MUAMMO HAL BO'LMASA

### Tekshirish 1: Webhook holati

```
https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/getWebhookInfo
```

**"url"** qatorida ko'rinishi kerak:
```
"url": "https://one-better.onrender.com/api/telegram/webhook"
```

---

### Tekshirish 2: Server ishlayaptimi?

```
https://one-better.onrender.com/api/telegram/webhook
```

**Ko'rinishi kerak:**
```json
{
  "status": "ok",
  "message": "Webhook endpoint is ready"
}
```

---

### Tekshirish 3: Menu Button (BotFather)

1. [@BotFather](https://t.me/BotFather) → `/mybots`
2. **1% Better Ai** → **Bot Settings** → **Menu Button**
3. **Edit menu button URL**
4. URL: `https://one-better.onrender.com`
5. Saqlang

---

## 🔧 QISQA KOMANDALAR

| Komanda | URL |
|---------|-----|
| **Webhook o'rnatish** | [BOSING](https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://one-better.onrender.com/api/telegram/webhook) |
| **Webhook tekshirish** | [BOSING](https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/getWebhookInfo) |
| **Server tekshirish** | [BOSING](https://one-better.onrender.com/api/habits) |
| **Webhook endpoint** | [BOSING](https://one-better.onrender.com/api/telegram/webhook) |
| **Bot test qilish** | [BOSING](https://t.me/Better_ai_bot) |

---

## 💡 TEZKOR MASLAHATLAR

1. **Render Free Plan** - Server 15 daqiqa ishlamasa uxlab qoladi
   - Yechim: Har safar `/api/habits` URL'ni oching

2. **Webhook har safar o'rnatilishi shart emas**
   - Bir marta o'rnatganingizdan keyin saqlanadi
   - Faqat server URL o'zgarsa qayta o'rnating

3. **Logs** - Render Dashboard'da har doim logs'ni tekshiring
   - `📨 Webhook received` ko'rinishi kerak

4. **Menu Button** - BotFather'da bir marta sozlaysiz
   - Botni har ochganda pastda ko'rinadi

---

## ✅ ISHLAY BOSHLADI!

Agar yuqoridagi 3 qadam bajarilsa:

1. ✅ Webhook sozlangan
2. ✅ Server javob beradi
3. ✅ Bot `/start` ga javob beradi
4. ✅ Mini App ochiladi

**Tabriklaymiz! 🎉**

