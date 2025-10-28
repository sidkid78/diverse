# Docker Scout Environment Setup Script (PowerShell)
param(
    [string]$DockerOrg = "sidkid1978",
    [string]$ImageName = "agentic-workflow",
    [string]$LatestTag = "latest",
    [string]$VersionTag = "v1.0.0",
    [string]$Platform = "linux/amd64"
)

Write-Host " Docker Scout Environment Setup" -ForegroundColor Blue
Write-Host "========================================"
Write-Host ""

# Check Docker
Write-Host "Checking Docker... " -NoNewline
$ErrorActionPreference = "Continue"
$null = docker info 2>&1 | Out-Null
$ErrorActionPreference = "Stop"
if ($LASTEXITCODE -eq 0) {
    Write-Host "" -ForegroundColor Green
} else {
    Write-Host "" -ForegroundColor Red
    Write-Host "Docker is not running"
    exit 1
}

# Create environments
Write-Host "Creating environments..."
Write-Host ""

Write-Host "Development environment ()... " -NoNewline
$null = docker scout environment --platform $Platform development "${DockerOrg}/${ImageName}:${LatestTag}" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "" -ForegroundColor Green
} else {
    Write-Host "" -ForegroundColor Red
}

Write-Host "Staging environment (${VersionTag})... " -NoNewline
$null = docker scout environment --platform $Platform staging "${DockerOrg}/${ImageName}:${VersionTag}" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "" -ForegroundColor Green
} else {
    Write-Host "" -ForegroundColor Red
}

Write-Host "Production environment (${VersionTag})... " -NoNewline
$null = docker scout environment --platform $Platform production "${DockerOrg}/${ImageName}:${VersionTag}" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "" -ForegroundColor Green
} else {
    Write-Host "" -ForegroundColor Red
}

Write-Host ""
Write-Host " Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "View environments: https://scout.docker.com/org/${DockerOrg}"
