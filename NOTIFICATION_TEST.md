# 🔔 BILDIRISHNOMALARNI TEST QILISH

## ✅ Tuzatilgan muammolar

1. ✅ **Development rejimida ham bildirishnomalar ishga tushadi**
2. ✅ **Test uchun manual trigger endpoint qo'shildi**
3. ✅ **Loglar yaxshilandi - nima bo'layotgani aniq ko'rinadi**

---

## 🚀 QANDAY TEST QILISH?

### USUL 1: Avtomatik test (har daqiqa)

1. **Server'ni ishga tushiring:**
   ```bash
   npm run dev
   ```

2. **Console'da ko'ring:**
   ```
   🔔 Initializing notification scheduler...
   ⏰ Current time: 14:23
   📍 Timezone: Asia/Tashkent
   ✅ Notification scheduler initialized - running every minute
   ```

3. **Har daqiqa ko'ring:**
   ```
   ⏰ [14:24] Checking reminders...
   ⏰ Checking reminders for 2 habits...
   ```

4. **Agar odatlar bo'lmasa:**
   ```
   ℹ️ No habits with reminders enabled found
   ```

---

### USUL 2: Qo'lda test qilish (tezroq)

**POST** so'rov yuboring:

```bash
curl -X POST http://localhost:5000/api/notifications/trigger
```

yoki brauzerda Postman/Insomnia ishlatib:

- **URL:** `http://localhost:5000/api/notifications/trigger`
- **Method:** POST
- **Body:** (keraksiz)

**Javob:**
```json
{
  "status": "ok",
  "message": "Notifications triggered successfully"
}
```

---

## 🔍 BILDIRISHNOMA ISHLAMASLIGINING SABABLARI

### 1. Database'da odat yo'q ✅

**Tekshirish:**
```
ℹ️ No habits with reminders enabled found
```

**Yechim:** 
- Ilova orqali odat qo'shing
- `reminderEnabled` = `true` qiling

---

### 2. User settings yo'q ⚠️

**Tekshirish:**
```
⚠️ No user settings found for user: 123456
```

**Yechim:**
- Botga `/start` yuboring
- Avtomatik user settings yaratiladi

---

### 3. Bildirishnomalar o'chirilgan 🔕

**Tekshirish:**
```
🔕 Notifications disabled for user: 123456
```

**Yechim:**
- Database'da `user_settings` table'ga o'ting
- `notifications_enabled` ni `true` qiling

---

### 4. Vaqt mos kelmayapti ⏰

**Tekshirish:**
```
⏰ [09:30] Checking reminders...
```
Lekin odat uchun `reminderTime` = `09:00`

**Sabab:** Vaqt o'tib ketgan, keyingi daqiqa kutiladi

**Yechim:**
1. Hozirgi vaqtni ko'ring (console'da)
2. Odatga shu vaqtdan 1 daqiqa keyingi vaqt qo'ying
3. Yoki `/api/notifications/trigger` qo'lda chaqiring

---

### 5. Bugun allaqachon bajarilgan ✅

**Tekshirish:**
```
✅ Habit "Kitob o'qish" already completed today - skipping reminder
```

**Sabab:** Bugun shu odat uchun eslatma kerak emas

**Yechim:** Bu normal holat!

---

## 📋 BILDIRISHNOMA YUBORILGANDA

**Console'da:**
```
📨 Sending reminder for habit "Kitob o'qish" to user 123456 at 09:00
✅ Daily reminder sent for habit: Kitob o'qish to chat: 123456 at 09:00
```

**Telegram'da:**
```
⏰ Eslatma!

🌅 Ertalab! Yangi kunni yangi odatdan boshlang!

📋 Odat: Kitob o'qish
💬 Har kuni 30 minut

🔥 Sizda 5 kunlik streak bor!

💪 Bugun ham qo'lingizdan keladi!

📱 Ilovani ochib, odatni belgilang
```

---

## 🧪 FULL TEST SCENARIO

### Test 1: Reminder yuborish

1. **Server'ni ishga tushiring:**
   ```bash
   npm run dev
   ```

2. **Botga `/start` yuboring** (user settings yaratish)

3. **Odat qo'shing:**
   - Ilovani oching
   - "Kitob o'qish" nomli odat yarating
   - `reminderEnabled` = `true`
   - `reminderTime` = hozirdan 1 daqiqa keyin (masalan, hozir 14:30 bo'lsa, 14:31 qo'ying)

4. **1 daqiqa kuting**

5. **Console'da ko'ring:**
   ```
   ⏰ [14:31] Checking reminders...
   📨 Sending reminder for habit "Kitob o'qish"...
   ✅ Daily reminder sent...
   ```

6. **Telegram'da eslatma kelishini tekshiring**

---

### Test 2: Streak protection (22:00)

1. Server vaqtini 22:00 ga o'zgartiring yoki kuting
2. Odat uchun `streak` >= 3 bo'lishi kerak
3. Bugun bajarilmagan bo'lishi kerak
4. Streak himoya xabari keladi

---

### Test 3: Milestone (7, 21, 30, 66, 100, 365 kunlar)

1. Odatning `streak`ini 7 ga o'zgartiring (database'da)
2. Keyingi daqiqada milestone xabari keladi

---

## 📊 DATABASE TEKSHIRUV

### Odatlar jadvalini tekshiring:

```sql
SELECT 
  id, 
  name, 
  user_id, 
  reminder_enabled, 
  reminder_time 
FROM habits;
```

### User sozlamalarini tekshiring:

```sql
SELECT 
  user_id, 
  chat_id, 
  notifications_enabled, 
  streak_reminders, 
  milestone_notifications 
FROM user_settings;
```

---

## 🐛 AGAR HALI HAM ISHLAMASA

1. **Console loglarini to'liq o'qing**
2. **Database'ni tekshiring**
3. **Bot tokenini tekshiring**
4. **Telegram API'ni to'g'ridan-to'g'ri test qiling:**

```bash
curl -X POST "https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "YOUR_CHAT_ID",
    "text": "Test message"
  }'
```

5. **DATABASE_URL o'rnatilganini tekshiring:**
   ```bash
   echo $DATABASE_URL
   ```

---

## ✅ SUCCESS CHECKLIST

- [ ] Server ishlayapti (`npm run dev`)
- [ ] Console'da har daqiqa check bo'lyapti
- [ ] Database'da odat bor (`reminder_enabled = true`)
- [ ] User settings bor (`notifications_enabled = true`)
- [ ] Reminder vaqti to'g'ri sozlangan
- [ ] Console'da xabar yuborilgani ko'rinadi
- [ ] Telegram'da xabar keldi

---

## 📞 YORDAM

Agar hali ham muammo bo'lsa, console loglarini va quyidagi ma'lumotlarni yuboring:

1. Console'dagi barcha loglar
2. `SELECT * FROM habits WHERE reminder_enabled = true;`
3. `SELECT * FROM user_settings;`
4. Telegram chat ID
5. Kutilgan vaqt va haqiqiy vaqt
