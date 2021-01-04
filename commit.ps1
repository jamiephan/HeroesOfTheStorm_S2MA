$time = [int][double]::Parse((Get-Date -UFormat %s))
Start-Process "git" -ArgumentList "add","-A" -NoNewWindow -PassThru| Wait-Process
Start-Process "git" -ArgumentList "commit","-m", "[$time] ⬆ Updated S2MA + Maps" -NoNewWindow -PassThru| Wait-Process
Start-Process "git" -ArgumentList "push" -NoNewWindow -PassThru| Wait-Process