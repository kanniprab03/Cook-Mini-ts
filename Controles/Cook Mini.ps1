Write-Host "Initializing the application"

$base_url = "C:\Users\kanni\QuantumCelestials\Cook-Mini"
$client = Join-Path -Path $base_url -ChildPath "\client"
$server = Join-Path -Path $base_url -ChildPath "\backend"

Set-Location -Path $client
Start-Process -FilePath "pnpm" -ArgumentList "dev" -NoNewWindow
Set-Location -Path $server
Start-Process -FilePath "pnpm" -ArgumentList "start" -NoNewWindow

Write-Host "Application initialized"