# 🔍 Docker Scout Quick Reference

Essential Docker Scout commands for the Agentic Workflow platform.

## Setup Commands

### Initialize Scout
```bash
docker scout enroll sidkid1978
```

### Create Environments
```bash
# Development
docker scout environment --platform linux/amd64 development sidkid1978/agentic-workflow:latest

# Staging
docker scout environment --platform linux/amd64 staging sidkid1978/agentic-workflow:v1.0.0

# Production
docker scout environment --platform linux/amd64 production sidkid1978/agentic-workflow:v1.0.0
```

## Analysis Commands

### Check Vulnerabilities
```bash
# All vulnerabilities
docker scout cves sidkid1978/agentic-workflow:v1.0.0

# Only critical and high
docker scout cves --only-severity critical,high sidkid1978/agentic-workflow:v1.0.0

# Output as JSON
docker scout cves --format json sidkid1978/agentic-workflow:v1.0.0
```

### Quick Overview
```bash
docker scout quickview sidkid1978/agentic-workflow:v1.0.0
```

### Get Recommendations
```bash
docker scout recommendations sidkid1978/agentic-workflow:v1.0.0
```

### Compare Images
```bash
# Compare with production
docker scout compare --to-env production sidkid1978/agentic-workflow:latest

# Compare two specific images
docker scout compare sidkid1978/agentic-workflow:v1.0.0 --to sidkid1978/agentic-workflow:v1.1.0
```

### SBOM (Software Bill of Materials)
```bash
docker scout sbom sidkid1978/agentic-workflow:v1.0.0
```

## Policy Evaluation

### Check Against Policy
```bash
docker scout policy sidkid1978/agentic-workflow:v1.0.0
```

### Evaluate with Exit Code
```bash
# Exit with error if policy fails
docker scout policy --exit-code sidkid1978/agentic-workflow:v1.0.0
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Docker Scout
  uses: docker/scout-action@v1
  with:
    command: cves
    image: sidkid1978/agentic-workflow:${{ github.sha }}
    only-severities: critical,high
    exit-code: true
```

### GitLab CI
```yaml
scout:
  script:
    - docker scout cves $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker scout compare --to-env production $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

## Multi-Architecture

### AMD64 (x86_64)
```bash
docker scout environment --platform linux/amd64 production sidkid1978/agentic-workflow:v1.0.0
```

### ARM64 (Apple Silicon, AWS Graviton)
```bash
docker scout environment --platform linux/arm64 production sidkid1978/agentic-workflow:v1.0.0
```

## Filtering and Formatting

### Filter by Severity
```bash
docker scout cves --only-severity critical sidkid1978/agentic-workflow:v1.0.0
```

### Filter by Package
```bash
docker scout cves --only-package node sidkid1978/agentic-workflow:v1.0.0
```

### Output Formats
```bash
# JSON
docker scout cves --format json sidkid1978/agentic-workflow:v1.0.0

# SARIF (for GitHub Code Scanning)
docker scout cves --format sarif sidkid1978/agentic-workflow:v1.0.0

# Markdown
docker scout cves --format markdown sidkid1978/agentic-workflow:v1.0.0
```

## Watching for Changes

### Stream CVE Updates
```bash
docker scout stream cves sidkid1978/agentic-workflow:v1.0.0
```

## Environment Management

### List Environments
```bash
# Via Docker Scout dashboard
# https://scout.docker.com/org/sidkid1978
```

### Update Environment
```bash
# Just reassign the environment to a new image
docker scout environment --platform linux/amd64 production sidkid1978/agentic-workflow:v1.1.0
```

## Common Workflows

### Pre-Push Check
```bash
# Before pushing to production
docker scout cves --only-severity critical,high --exit-code sidkid1978/agentic-workflow:latest
```

### Deployment Validation
```bash
# Compare staging with production
docker scout compare --to-env production sidkid1978/agentic-workflow:staging

# If better, promote to production
docker scout environment --platform linux/amd64 production sidkid1978/agentic-workflow:staging
```

### Security Audit
```bash
# Full security report
docker scout cves sidkid1978/agentic-workflow:v1.0.0 > security-report.txt

# Check policy compliance
docker scout policy sidkid1978/agentic-workflow:v1.0.0

# Get remediation steps
docker scout recommendations sidkid1978/agentic-workflow:v1.0.0
```

## Troubleshooting

### Debug Mode
```bash
docker scout --debug cves sidkid1978/agentic-workflow:v1.0.0
```

### Verify Authentication
```bash
docker info | grep Username
```

### Check Scout Version
```bash
docker scout version
```

## Useful Flags

| Flag | Description |
|------|-------------|
| `--platform` | Specify OS/architecture |
| `--only-severity` | Filter by severity level |
| `--only-package` | Filter by package name |
| `--format` | Output format (json, sarif, markdown) |
| `--exit-code` | Exit with error code if issues found |
| `--to-env` | Compare to specific environment |
| `--debug` | Enable debug logging |

## Resources

- **Dashboard**: https://scout.docker.com/org/sidkid1978
- **Documentation**: https://docs.docker.com/scout/
- **CLI Reference**: https://docs.docker.com/engine/reference/commandline/scout/

## Quick Tips

1. **Run Scout before every push** to catch vulnerabilities early
2. **Set up automated scanning** in your CI/CD pipeline
3. **Compare with production** before deploying
4. **Monitor critical/high** severity issues only for faster feedback
5. **Use exit codes** in CI/CD to block bad builds
6. **Review recommendations** for upgrade paths
7. **Check regularly** as new CVEs are discovered daily

## Example: Full Release Workflow

```bash
# 1. Build new version
docker build -t sidkid1978/agentic-workflow:v1.1.0 .

# 2. Scan for vulnerabilities
docker scout cves --only-severity critical,high sidkid1978/agentic-workflow:v1.1.0

# 3. Compare with current production
docker scout compare --to-env production sidkid1978/agentic-workflow:v1.1.0

# 4. Push if checks pass
docker push sidkid1978/agentic-workflow:v1.1.0

# 5. Assign to staging
docker scout environment --platform linux/amd64 staging sidkid1978/agentic-workflow:v1.1.0

# 6. Test in staging...

# 7. Promote to production
docker scout environment --platform linux/amd64 production sidkid1978/agentic-workflow:v1.1.0
```

---

**Remember**: Docker Scout is free for Docker Hub repositories! 🎉

