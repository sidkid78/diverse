#!/bin/bash

# Integration Test Script for Agentic Workflow Platform
# This script tests all major API endpoints to verify the backend integration

set -e

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Agentic Workflow Integration Tests"
echo "======================================"
echo ""

# Check if server is running
echo -n "Checking if server is running... "
if curl -s -f "$BASE_URL" > /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Error: Server is not running. Please start it with 'npm run dev'"
    exit 1
fi

# Test 1: Health Check
echo -n "Testing health endpoint... "
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
STATUS=$(echo $HEALTH_RESPONSE | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$STATUS" = "healthy" ] || [ "$STATUS" = "degraded" ]; then
    echo -e "${GREEN}✓${NC} Status: $STATUS"
else
    echo -e "${RED}✗${NC}"
    echo "Response: $HEALTH_RESPONSE"
    exit 1
fi

# Check Gemini status
GEMINI_STATUS=$(echo $HEALTH_RESPONSE | grep -o '"gemini":{[^}]*}' | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
echo "  - Gemini AI: $GEMINI_STATUS"

# Check GitHub status
GITHUB_STATUS=$(echo $HEALTH_RESPONSE | grep -o '"github":{[^}]*}' | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
echo "  - GitHub API: $GITHUB_STATUS"

# Test 2: Plan Generation
echo ""
echo -n "Testing plan generation... "
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/plans/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "mission_statement": "Add basic error handling",
    "repo_url": "https://github.com/sidkid78/diverse",
    "model_preference": "gemini-2.5-flash"
  }')

if echo "$PLAN_RESPONSE" | grep -q '"plan"'; then
    echo -e "${GREEN}✓${NC}"
    PLAN_LENGTH=$(echo "$PLAN_RESPONSE" | grep -o '"plan":\[[^]]*\]' | grep -o '{' | wc -l)
    echo "  - Generated plan with $PLAN_LENGTH steps"
else
    echo -e "${RED}✗${NC}"
    echo "Response: $PLAN_RESPONSE"
fi

# Test 3: GitHub Repository Info
echo ""
echo -n "Testing GitHub repository endpoint... "
REPO_RESPONSE=$(curl -s "$BASE_URL/api/github/repo?url=https://github.com/sidkid78/diverse")

if echo "$REPO_RESPONSE" | grep -q '"name"'; then
    echo -e "${GREEN}✓${NC}"
    REPO_NAME=$(echo "$REPO_RESPONSE" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "  - Repository: $REPO_NAME"
else
    echo -e "${YELLOW}⚠${NC} GitHub API not configured or repository not accessible"
fi

# Test 4: GitHub Files Listing
echo ""
echo -n "Testing GitHub files endpoint... "
FILES_RESPONSE=$(curl -s "$BASE_URL/api/github/files?url=https://github.com/sidkid78/diverse")

if echo "$FILES_RESPONSE" | grep -q '"files"'; then
    echo -e "${GREEN}✓${NC}"
    FILE_COUNT=$(echo "$FILES_RESPONSE" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
    echo "  - Found $FILE_COUNT files"
else
    echo -e "${YELLOW}⚠${NC} GitHub API not configured or repository not accessible"
fi

# Test 5: SSE Stream Connection
echo ""
echo -n "Testing SSE stream endpoint... "
# Test just the connection, not actual events
STREAM_TEST=$(curl -s -m 2 -N "$BASE_URL/api/stream" 2>&1 | head -n 1)

if echo "$STREAM_TEST" | grep -q "data:"; then
    echo -e "${GREEN}✓${NC}"
    echo "  - SSE connection established"
else
    echo -e "${YELLOW}⚠${NC} SSE stream may not be working properly"
fi

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}✅ Integration tests complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Visit http://localhost:3000 to use the UI"
echo "  2. Go to Mission Control to create your first task"
echo "  3. Check Live Ops to monitor agent activity"
echo ""
echo "For detailed API documentation, see:"
echo "  - BACKEND_INTEGRATION.md"
echo "  - QUICKSTART.md"

