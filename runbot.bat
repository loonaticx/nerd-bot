@echo off
:loop:
git pull
node bot.js
goto :loop:
pause
