Write-Host "Initializing SMS application"

$base_url = "C:\Users\kanni\Documents\Student"
$client = Join-Path -Path $base_url -ChildPath "\client"
$server = Join-Path -Path $base_url -ChildPath "\backend"

Set-Location -Path $client
Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
Set-Location -Path $server
Start-Process -FilePath "node" -ArgumentList "index.js" -NoNewWindow

Write-Host "Application initialized"