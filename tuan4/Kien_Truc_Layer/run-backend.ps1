# PowerShell script to run Layer backend with MongoDB Atlas connection
# This script reads .env file and injects MongoDB URI as JVM argument

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $projectRoot ".env"

if (-not (Test-Path $envFile)) {
    throw ".env file not found at $envFile"
}

# Parse .env file and extract key=value pairs
$envVars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { return }
    if ($line.StartsWith("#")) { return }
    
    $idx = $line.IndexOf("=")
    if ($idx -le 0) { return }
    
    $key = $line.Substring(0, $idx).Trim()
    $value = $line.Substring($idx + 1).Trim()
    
    if (-not [string]::IsNullOrWhiteSpace($key)) {
        $envVars[$key] = $value
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Extract MongoDB URI (prefer MONGO_URI, keep compatibility with CLOUD_MONGO_URI)
$mongoUri = $envVars["MONGO_URI"]
if ([string]::IsNullOrWhiteSpace($mongoUri)) {
    $mongoUri = $envVars["CLOUD_MONGO_URI"]
}
$profile = $envVars["SPRING_PROFILES_ACTIVE"]
$port = $envVars["CORE_SERVICE_PORT"]

if ([string]::IsNullOrWhiteSpace($mongoUri)) {
    throw "MONGO_URI (or CLOUD_MONGO_URI) is empty in .env"
}

# Build JVM arguments to inject configuration
$jvmArgs = "-Dspring.mongodb.uri=$mongoUri"
if (-not [string]::IsNullOrWhiteSpace($profile)) {
    $jvmArgs += " -Dspring.profiles.active=$profile"
}
if (-not [string]::IsNullOrWhiteSpace($port)) {
    $jvmArgs += " -Dserver.port=$port"
}

Write-Host "Starting Layer backend with MongoDB Atlas..."
Write-Host "MongoDB URI: $(if($mongoUri.Length -gt 50) { $mongoUri.Substring(0, 50) + '...' } else { $mongoUri })"

Set-Location $projectRoot
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=$jvmArgs"
