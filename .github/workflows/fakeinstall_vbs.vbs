Set WshShell = WScript.CreateObject("WScript.Shell")
WshShell.Run "C:\Battle.net-Setup.exe"
' Wait 10s for it to launch
WScript.Sleep(5000)
' First enter to select default language
WshShell.AppActivate "Battle.net Setup"
WshShell.SendKeys "{ENTER}"
' Prompt: Updating Battle.net Update Agent....
' Wait 30s

WScript.Sleep(20000)
WshShell.AppActivate "Battle.net Setup"
WshShell.SendKeys "{ENTER}"
' Second Enter to Accept default install
' Wait 80s for it to install
WScript.Sleep(60000)