@echo off
:: Save PowerShell command history to a file
:: Use PowerShell to retrieve the PSReadLine history and save it to a file in the current directory

powershell -Command "Get-Content (Get-PSReadLineOption).HistorySavePath | Out-File -FilePath '%CD%\ps_history.txt' -Encoding utf8"

echo PowerShell command history saved to ps_history.txt in %CD%.
pause