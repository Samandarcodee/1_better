@echo off
chcp 65001 >nul
title Set Production Webhook
echo.
echo ===============================================
echo      PRODUCTION WEBHOOK SOZLASH
echo ===============================================
echo.

set BOT_TOKEN=8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk
set PRODUCTION_URL=https://one-better.onrender.com

echo Bot Token: %BOT_TOKEN%
echo Production URL: %PRODUCTION_URL%
echo Webhook URL: %PRODUCTION_URL%/api/telegram/webhook
echo.
echo.

echo Webhook sozlanmoqda...
echo.
curl "https://api.telegram.org/bot%BOT_TOKEN%/setWebhook?url=%PRODUCTION_URL%/api/telegram/webhook"
echo.
echo.

echo ===============================================
echo.
echo Webhook holati:
echo.
curl "https://api.telegram.org/bot%BOT_TOKEN%/getWebhookInfo"
echo.
echo.

echo ===============================================
echo.
echo Agar {"ok":true} ko'rsangiz - webhook sozlandi!
echo.
echo TEST QILISH:
echo 1. @Better_ai_bot ga o'ting
echo 2. /start yuboring
echo 3. "Salom! 👋" xabari kelishi kerak
echo 4. Mini App tugmasini bosing
echo.
pause

