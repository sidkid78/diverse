# Docker Scout Environment Setup Script (PowerShell)
# This script creates development, staging, and production environments
# for the Agentic Workflow platform

param(
    [string]$DockerOrg = "sidkid1978",
    [string]$ImageName = "agentic-workflow",
    [string]$LatestTag = "latest",
    [string]$VersionTag = "v1.0.0",
    [string]$Platform = "linux/amd64"
)

$ErrorActionPreference = "Stop"

Write-Host "🔍 Docker Scout Environment Setup" -ForegroundColor Blue
Write-Host "========================================"
Write-Host "Organization: $DockerOrg"
Write-Host "Image: $ImageName"
Write-Host "Platform: $Platform"
Write-Host "Latest Tag: $LatestTag"
Write-Host "Version Tag: $VersionTag"
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker... " -NoNewline
try {
    $null = docker info 2>&1
    Write-Host "✓" -ForegroundColor Green
} catch {
    Write-Host "❌" -ForegroundColor Red
    Write-Host "Docker is not running. Please start Docker and try again."
    exit 1
}

# Check if logged in to Docker Hub
Write-Host "Checking Docker Hub authentication... " -NoNewline
$dockerInfo = docker info 2>&1 | Out-String
if ($dockerInfo -match "Username:") {
    Write-Host "✓" -ForegroundColor Green
} else {
    Write-Host "⚠" -ForegroundColor Yellow
    Write-Host "Not logged in to Docker Hub. Please run: docker login"
    exit 1
}

# Check if images exist
Write-Host ""
Write-Host "Verifying images..."
$skipDev = $false
$skipVersioned = $false

Write-Host "  - Checking ${DockerOrg}/${ImageName}:${LatestTag}... " -NoNewline
try {
    $null = docker pull "${DockerOrg}/${ImageName}:${LatestTag}" 2>&1
    Write-Host "✓" -ForegroundColor Green
} catch {
    Write-Host "⚠ (not found, will skip development environment)" -ForegroundColor Yellow
    $skipDev = $true
}

Write-Host "  - Checking ${DockerOrg}/${ImageName}:${VersionTag}... " -NoNewline
try {
    $null = docker pull "${DockerOrg}/${ImageName}:${VersionTag}" 2>&1
    Write-Host "✓" -ForegroundColor Green
} catch {
    Write-Host "⚠ (not found, will skip staging/production environments)" -ForegroundColor Yellow
    $skipVersioned = $true
}

Write-Host ""
Write-Host "Creating environments..."

# Create Development Environment
if (-not $skipDev) {
    Write-Host "📦 Development environment... " -NoNewline
    try {
        $null = docker scout environment --platform $Platform development "${DockerOrg}/${ImageName}:${LatestTag}" 2>&1
        Write-Host "✓" -ForegroundColor Green
    } catch {
        Write-Host "✗" -ForegroundColor Red
        Write-Host "   Failed to create development environment"
    }
}

# Create Staging Environment
if (-not $skipVersioned) {
    Write-Host "📦 Staging environment... " -NoNewline
    try {
        $null = docker scout environment --platform $Platform staging "${DockerOrg}/${ImageName}:${VersionTag}" 2>&1
        Write-Host "✓" -ForegroundColor Green
    } catch {
        Write-Host "✗" -ForegroundColor Red
        Write-Host "   Failed to create staging environment"
    }

    # Create Production Environment
    Write-Host "📦 Production environment... " -NoNewline
    try {
        $null = docker scout environment --platform $Platform production "${DockerOrg}/${ImageName}:${VersionTag}" 2>&1
        Write-Host "✓" -ForegroundColor Green
    } catch {
        Write-Host "✗" -ForegroundColor Red
        Write-Host "   Failed to create production environment"
    }
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. View environments: https://scout.docker.com/org/${DockerOrg}"
Write-Host "  2. Analyze image: docker scout cves ${DockerOrg}/${ImageName}:${VersionTag}"
Write-Host "  3. Compare: docker scout compare --to-env production ${DockerOrg}/${ImageName}:${LatestTag}"
Write-Host ""
Write-Host "For multi-architecture support, run:"
Write-Host "  .\setup-scout-environments.ps1 -Platform linux/arm64"

