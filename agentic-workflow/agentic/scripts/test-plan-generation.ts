/**
 * Test Real AI Plan Generation
 * Tests the /api/plans/generate endpoint with the GitHub repo
 */

async function testPlanGeneration() {
  console.log('🧪 Testing Real AI Plan Generation\n');
  console.log('Repository: https://github.com/sidkid78/test1\n');

  const payload = {
    mission_statement: 'Build the HOMEase AI platform backend with Firestore, Cloud Functions, and Stripe integration',
    repo_url: 'https://github.com/sidkid78/test1',
    model_preference: 'gemini-2.5-flash',
  };

  console.log('📤 Sending request to /api/plans/generate...');
  console.log('Mission:', payload.mission_statement);
  console.log();

  try {
    const response = await fetch('http://localhost:3000/api/plans/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error || response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ Plan Generated Successfully!\n');
    console.log(`📋 Model Used: ${data.model_used}`);
    console.log(`📁 Context Files Found: ${data.context_files.length}`);
    console.log();

    console.log('🎯 Generated Plan:\n');
    data.plan.forEach((step: any, index: number) => {
      console.log(`Step ${index + 1}: ${step.step_description}`);
      console.log(`  Agent: ${step.agent_name}`);
      console.log(`  Specialization: ${step.agent_specialization.join(', ')}`);
      console.log(`  Model: ${step.model_preference}`);
      console.log(`  Duration: ${step.estimated_duration} mins`);
      console.log();
    });

    console.log('📂 Sample Context Files:');
    data.context_files.slice(0, 10).forEach((file: string) => {
      console.log(`  - ${file}`);
    });

    if (data.context_files.length > 10) {
      console.log(`  ... and ${data.context_files.length - 10} more files`);
    }

    console.log('\n✨ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the test
testPlanGeneration().catch(console.error);

