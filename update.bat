@echo off
REM update.ps1 래퍼 - ExecutionPolicy 제한 우회용
REM 사용법:
REM   update.bat "커밋 메시지"
REM   update.bat "커밋 메시지" -Deploy
REM   update.bat "커밋 메시지" -Deploy -Prod
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update.ps1" %*
