# Build and Push Docker Image Script (PowerShell)
# Usage: .\build-and-push.ps1 [version]
# Example: .\build-and-push.ps1 v1.0.0

param(
    [string]$Version = "latest",
    [string]$ImageName = "sidkid1978/agentic-workflow"
)

$ErrorActionPreference = "Stop"

Write-Host " Building Docker Image" -ForegroundColor Blue
Write-Host "========================================"
Write-Host "Image: $ImageName"
Write-Host "Version: $Version"
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker... " -NoNewline
try {
    $ErrorActionPreference = "Continue"
    $null = docker info 2>&1 | Out-Null
    $ErrorActionPreference = "Stop"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓" -ForegroundColor Green
    } else {
        Write-Host "❌" -ForegroundColor Red
        Write-Host "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    }
} catch {
    $ErrorActionPreference = "Stop"
    Write-Host "❌" -ForegroundColor Red
    Write-Host "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Build the image
Write-Host ""
Write-Host "Building image..." -ForegroundColor Yellow
Write-Host "Command: docker build -t ${ImageName}:${Version} ."
Write-Host ""

docker build -t "${ImageName}:${Version}" .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host " Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host " Build successful!" -ForegroundColor Green
Write-Host ""

# Tag as latest if not already latest
if ($Version -ne "latest") {
    Write-Host "Tagging as latest..." -ForegroundColor Yellow
    docker tag "${ImageName}:${Version}" "${ImageName}:latest"
}

# Push to Docker Hub
Write-Host ""
Write-Host "Pushing to Docker Hub..." -ForegroundColor Yellow
Write-Host ""

# Check if logged in
$ErrorActionPreference = "Continue"
$dockerInfo = docker info 2>&1 | Out-String
$ErrorActionPreference = "Stop"
if ($dockerInfo -notmatch "Username:") {
    Write-Host " Not logged in to Docker Hub" -ForegroundColor Yellow
    Write-Host "Please run: docker login"
    Write-Host ""
    $response = Read-Host "Do you want to login now? (y/n)"
    if ($response -eq "y") {
        docker login
        if ($LASTEXITCODE -ne 0) {
            Write-Host " Login failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Skipping push to Docker Hub"
        exit 0
    }
}

# Push version tag
Write-Host "Pushing ${ImageName}:${Version}..."
docker push "${ImageName}:${Version}"

if ($LASTEXITCODE -ne 0) {
    Write-Host " Push failed" -ForegroundColor Red
    exit 1
}

# Push latest tag if different from version
if ($Version -ne "latest") {
    Write-Host "Pushing ${ImageName}:latest..."
    docker push "${ImageName}:latest"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host " Failed to push latest tag" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host " Successfully built and pushed ${ImageName}:${Version}" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Set up Docker Scout environments:"
Write-Host "     .\setup-scout-environments.ps1"
Write-Host ""
Write-Host "  2. Scan for vulnerabilities:"
Write-Host "     docker scout cves ${ImageName}:${Version}"
Write-Host ""
Write-Host "  3. Deploy to production:"
Write-Host "     docker pull ${ImageName}:${Version}"
Write-Host "     docker-compose up -d"
