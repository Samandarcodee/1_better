# Telegram Mini App sozlash qo'llanmasi

## Bot ma'lumotlari
- **Bot nomi:** 1% Better Ai
- **Bot username:** @Better_ai_bot
- **Bot Token:** `8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk`

## Mini App sozlash bosqichlari

### 1. Replit URL ni oling
Replit loyihangiz ishga tushgandan keyin, URL ni nusxalang:
```
https://[your-repl-url].replit.dev
```

### 2. BotFather orqali Mini App sozlang

1. Telegram'da [@BotFather](https://t.me/BotFather) botiga o'ting
2. Botingizni tanlash uchun quyidagi buyruqni yuboring:
   ```
   /mybots
   ```
3. **1% Better Ai** botini tanlang
4. **Bot Settings** tugmasini bosing
5. **Menu Button** ni tanlang
6. **Configure menu button** ni tanlang
7. Mini App URL sini kiriting:
   ```
   https://[your-repl-url].replit.dev
   ```
8. Menu button matni uchun quyidagini kiriting:
   ```
   Odatlarni boshqarish
   ```

### 3. Mini App ishga tushirish

1. Telegram'da @Better_ai_bot ga o'ting
2. **/start** buyrug'ini yuboring
3. Pastdagi menu tugmasini bosing yoki botga xabar yozish maydonidagi attachment tugmasidan "Menu" ni tanlang
4. Mini App ochilib, "1% Better" ilova ishga tushadi!

### 4. Mini App xususiyatlari

✅ **Telegram integratsiyasi:**
- Telegram ranglari va temasi avtomatik qo'llaniladi
- Orqaga qaytish tugmasi Telegram'ning BackButton'i orqali ishlaydi
- Haptik feedback (vibratsiya) qo'shilgan
- To'liq ekran rejimi
- Dark/Light mode avtomatik aniqlash

✅ **Funksiyalar:**
- Odatlarni kuzatish
- Streak (ketma-ketlik) hisoblash
- Motivatsion xabarlar
- Progress monitoring
- Kunlik bajarilgan vazifalarni belgilash

## Texnik tafsilotlar

### SDK versiyasi
- @twa-dev/sdk (Telegram WebApp SDK)

### Sozlangan parametrlar
```typescript
WebApp.ready()              // Mini App tayyor
WebApp.expand()             // To'liq ekran
WebApp.setHeaderColor()     // Sarlavha rangi
WebApp.setBackgroundColor() // Fon rangi
WebApp.BackButton          // Orqaga qaytish tugmasi
WebApp.HapticFeedback      // Vibratsiya feedbacklari
```

### Haptic Feedback turlari
- **light** - Odatga bosganda
- **medium** - "+" tugmasiga bosganda
- **success** - Odatni bajarganida
- **light** - O'tkazib yuborish

## Muammolarni hal qilish

### Mini App ochilmasa:
1. Replit serveri ishlab turganini tekshiring
2. URL to'g'ri kiritilganini tekshiring (https:// bilan)
3. BotFather'da URL ni qayta kiriting

### Orqaga qaytish tugmasi ko'rinmasa:
- Bu normal - faqat detail va add sahifalarida ko'rinadi
- Home sahifada yashiringan

### Dark mode ishlamasa:
- Telegram sozlamalarida Dark mode yoqilganini tekshiring
- Ilova avtomatik Telegram temasiga moslashadi

## Keyingi qadamlar

1. ✅ Bot tokenini xavfsiz saqlang
2. ✅ Mini App URL ni BotFather'ga kiriting
3. ✅ Testdan o'tkazing
4. 🚀 Foydalanuvchilarga ulashing!

---

**Eslatma:** Bot tokenini hech kimga bermang va ommaviy joyda joylashtirmang!
