@echo off
REM Wrapper for update.ps1 - bypasses PowerShell ExecutionPolicy.
REM
REM Usage:
REM   update.bat "commit message"
REM   update.bat "commit message" -Deploy
REM   update.bat "commit message" -Deploy -Prod

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update.ps1" %*
