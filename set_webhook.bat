@echo off
title Set Telegram Webhook
echo.
echo ===============================================
echo      TELEGRAM WEBHOOK SOZLASH
echo ===============================================
echo.
echo Ngrok URL ni kiriting (masalan: https://abc123.ngrok.io)
echo.
set /p NGROK_URL="Ngrok URL: "

if "%NGROK_URL%"=="" (
    echo Xatolik: URL kiritilmadi!
    pause
    exit /b 1
)

echo.
echo Webhook sozlanmoqda...
echo.

curl "https://api.telegram.org/bot8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk/setWebhook?url=%NGROK_URL%/api/telegram/webhook"

echo.
echo.
echo ===============================================
echo.
echo Agar {"ok":true} ko'rsa - webhook sozlandi!
echo.
echo Endi @Better_ai_bot ga /start yuboring
echo.
pause
