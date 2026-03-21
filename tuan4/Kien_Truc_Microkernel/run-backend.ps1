$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $projectRoot ".env"

if (-not (Test-Path $envFile)) {
    throw ".env file not found at $envFile"
}

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { return }
    if ($line.StartsWith("#")) { return }

    $idx = $line.IndexOf("=")
    if ($idx -le 0) { return }

    $key = $line.Substring(0, $idx).Trim()
    $value = $line.Substring($idx + 1).Trim()

    if (-not [string]::IsNullOrWhiteSpace($key)) {
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

$mongoUri = [System.Environment]::GetEnvironmentVariable("MONGO_URI", "Process")
if ([string]::IsNullOrWhiteSpace($mongoUri)) {
    $mongoUri = [System.Environment]::GetEnvironmentVariable("CLOUD_MONGO_URI", "Process")
}
$profile = [System.Environment]::GetEnvironmentVariable("SPRING_PROFILES_ACTIVE", "Process")
$port = [System.Environment]::GetEnvironmentVariable("CORE_SERVICE_PORT", "Process")

if ([string]::IsNullOrWhiteSpace($mongoUri)) {
    throw "MONGO_URI (or CLOUD_MONGO_URI) is empty in .env"
}

$jvmArgs = "-Dspring.mongodb.uri=$mongoUri"
if (-not [string]::IsNullOrWhiteSpace($profile)) {
    $jvmArgs += " -Dspring.profiles.active=$profile"
}
if (-not [string]::IsNullOrWhiteSpace($port)) {
    $jvmArgs += " -Dserver.port=$port"
}

Write-Host "Loaded MONGO_URI/CLOUD_MONGO_URI from .env: True"

Set-Location $projectRoot
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=$jvmArgs"
