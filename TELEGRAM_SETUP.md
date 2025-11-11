# Telegram Bot Sozlash

## Bot Ma'lumotlari

- **Bot:** @Better_ai_bot
- **Token:** `8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk`

## Bosqichma-bosqich Sozlash

### 1. Server ishga tushiring

```bash
npm install
npm run dev
```

Yoki:
```
start.bat ni ikki marta bosing
```

Server `http://localhost:5000` da ishga tushadi.

### 2. Ngrok o'rnating va ishga tushiring

1. [Ngrok yuklab oling](https://ngrok.com/download)
2. O'rnating
3. Yangi terminalda:
   ```bash
   ngrok http 5000
   ```
4. HTTPS URL ni nusxalang (masalan: `https://abc123.ngrok.io`)

### 3. BotFather da sozlang

1. [@BotFather](https://t.me/BotFather) ga o'ting
2. `/mybots` yuboring
3. **"1% Better Ai"** botini tanlang
4. **Bot Settings** → **Menu Button** → **Configure menu button**
5. URL kiriting: `https://abc123.ngrok.io`
6. Menu matni: `Odatlarni boshqarish`
7. Saqlang

### 4. Webhook sozlang (/start command uchun)

1. Ngrok URL ni oling (masalan: `https://abc123.ngrok.io`)
2. Quyidagi URL ni brauzerda oching yoki curl bilan yuboring:
   ```
   https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=https://abc123.ngrok.io/api/telegram/webhook
   ```
3. `{"ok":true,"result":true,"description":"Webhook was set"}` javob qaytishi kerak

### 5. Test qiling

1. [@Better_ai_bot](https://t.me/Better_ai_bot) ga o'ting
2. `/start` yuboring
3. **"Salom! 👋"** xabari kelishi kerak
4. Menu tugmasini bosing
5. **🎉 Mini App ochiladi!**

## Eslatmalar

- Server va Ngrok ishlayotgan bo'lishi kerak
- Ngrok URL har safar o'zgaradi
- HTTPS majburiy (Telegram uchun)
- Webhook URL ni har safar yangilang (ngrok URL o'zgarganda)
