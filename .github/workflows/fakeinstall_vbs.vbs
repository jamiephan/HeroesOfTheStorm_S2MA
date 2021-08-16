Set WshShell = WScript.CreateObject("WScript.Shell")
WshShell.Run "C:\Battle.net-Setup.exe"
WshShell.AppActivate "Battle.net Setup"
WScript.Sleep(5000)
WshShell.SendKeys "{ENTER}"