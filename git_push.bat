@echo off
title Git Push to GitHub
cd /d "%~dp0"

echo ===============================================
echo      GIT PUSH TO GITHUB
echo ===============================================
echo.

echo [1/6] Git init...
git init
if errorlevel 1 (
    echo Git o'rnatilmagan yoki xatolik!
    pause
    exit /b 1
)
echo ✅ Git init qilindi
echo.

echo [2/6] .gitignore tekshiryapman...
if not exist ".gitignore" (
    echo ⚠️  .gitignore yo'q, yaratilmoqda...
    echo node_modules/ > .gitignore
    echo .env >> .gitignore
    echo dist/ >> .gitignore
    echo ✅ .gitignore yaratildi
) else (
    echo ✅ .gitignore mavjud
)
echo.

echo [3/6] Fayllarni qo'shish...
git add .
if errorlevel 1 (
    echo ❌ git add xatolik!
    pause
    exit /b 1
)
echo ✅ Fayllar qo'shildi
echo.

echo [4/6] Commit qilish...
git commit -m "first commit"
if errorlevel 1 (
    echo ⚠️  Commit xatolik (ehtimol allaqachon commit qilingan)
) else (
    echo ✅ Commit qilindi
)
echo.

echo [5/6] Branch nomini main ga o'zgartirish...
git branch -M main
echo ✅ Branch main ga o'zgartirildi
echo.

echo [6/6] Remote qo'shish va push qilish...
git remote remove origin 2>nul
git remote add origin https://github.com/Samandarcodee/1_better.git
if errorlevel 1 (
    echo ⚠️  Remote allaqachon qo'shilgan, yangilanmoqda...
    git remote set-url origin https://github.com/Samandarcodee/1_better.git
)
echo ✅ Remote qo'shildi
echo.

echo Push qilish...
git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ Push xatolik!
    echo.
    echo Yechimlar:
    echo 1. GitHub da repository yaratilganini tekshiring
    echo 2. GitHub username va password kiriting
    echo 3. Personal Access Token ishlatish kerak bo'lishi mumkin
    echo.
    echo GitHub Personal Access Token yaratish:
    echo https://github.com/settings/tokens
    echo.
    pause
    exit /b 1
)

echo.
echo ===============================================
echo           MUVAFFAQIYATLI! ✅
echo ===============================================
echo.
echo Repository GitHub ga yuklandi:
echo https://github.com/Samandarcodee/1_better
echo.
pause
