@echo off
chcp 65001 >nul
title Telegram Bot Holati
echo.
echo ===============================================
echo      TELEGRAM BOT HOLATINI TEKSHIRISH
echo ===============================================
echo.

set BOT_TOKEN=8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk
set PRODUCTION_URL=https://one-better.onrender.com

echo [1/5] Bot ma'lumotlarini tekshirish...
echo.
curl -s "https://api.telegram.org/bot%BOT_TOKEN%/getMe"
echo.
echo.

echo [2/5] Webhook holatini tekshirish...
echo.
curl -s "https://api.telegram.org/bot%BOT_TOKEN%/getWebhookInfo"
echo.
echo.

echo [3/5] Production server holatini tekshirish...
echo.
curl -s "%PRODUCTION_URL%/api/telegram/webhook"
echo.
echo.

echo [4/5] Habits API holatini tekshirish...
echo.
curl -s "%PRODUCTION_URL%/api/habits"
echo.
echo.

echo ===============================================
echo.
echo NATIJALAR:
echo.
echo - Agar "ok":true ko'rsangiz - bot aktiv
echo - Agar webhook URL ko'rsangiz - webhook sozlangan
echo - Agar habits array ko'rsangiz - API ishlayapti
echo.
echo ===============================================
echo.
echo MUAMMOLAR VA YECHIMLAR:
echo.
echo 1. Webhook noto'g'ri URL:
echo    - Webhook URL: %PRODUCTION_URL%/api/telegram/webhook bo'lishi kerak
echo.
echo 2. Webhook o'rnatilmagan:
echo    - set_webhook_production.bat ni ishga tushiring
echo.
echo 3. Server ishlamayapti:
echo    - Render Dashboard'da service statusni tekshiring
echo    - Logs'ni ko'ring
echo.
pause

