/**
 * Health Check API
 * Verify system status and API key configuration
 */

import { NextResponse } from 'next/server';
import { isGeminiConfigured, validateApiKey as validateGeminiKey } from '@/lib/gemini';
import { isGitHubConfigured, validateToken as validateGitHubToken } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * Check system health and API key validity
 */
export async function GET() {
  const startTime = Date.now();

  // Check configurations
  const geminiConfigured = isGeminiConfigured();
  const githubConfigured = isGitHubConfigured();

  // Validate API keys (only if configured)
  let geminiValid = false;
  let githubValid = false;

  if (geminiConfigured) {
    try {
      geminiValid = await validateGeminiKey();
    } catch (error) {
      console.error('Gemini validation error:', error);
    }
  }

  if (githubConfigured) {
    try {
      githubValid = await validateGitHubToken();
    } catch (error) {
      console.error('GitHub validation error:', error);
    }
  }

  const responseTime = Date.now() - startTime;

  const status = geminiValid && githubValid ? 'healthy' : 'degraded';

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    response_time_ms: responseTime,
    services: {
      gemini: {
        configured: geminiConfigured,
        valid: geminiValid,
        status: geminiValid ? 'operational' : geminiConfigured ? 'invalid_key' : 'not_configured',
      },
      github: {
        configured: githubConfigured,
        valid: githubValid,
        status: githubValid ? 'operational' : githubConfigured ? 'invalid_key' : 'not_configured',
      },
    },
    version: '1.0.0',
  }, {
    status: status === 'healthy' ? 200 : 503,
  });
}
