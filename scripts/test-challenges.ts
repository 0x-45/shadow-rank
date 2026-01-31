/**
 * Test script to verify debugging challenges work correctly
 * Run with: npx tsx scripts/test-challenges.ts
 */

import { DEBUGGING_CHALLENGES, getRandomChallenge } from '../src/lib/challenges/debugging';

console.log('\n🐛 Shadow Rank - Debugging Challenges Test\n');
console.log('='.repeat(60));

// Helper function to execute code safely
async function executeCode(code: string): Promise<string> {
  const asyncWrapper = `
    (async () => {
      ${code}
    })()
  `;

  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(`return ${asyncWrapper}`);
    const result = await fn();
    return String(result);
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return 'Error: Unknown error occurred';
  }
}

async function testChallenge(challenge: typeof DEBUGGING_CHALLENGES[0], showDetails: boolean = true) {
  if (showDetails) {
    console.log(`\n📋 ${challenge.title}`);
    console.log(`   Difficulty: ${challenge.difficulty}`);
    console.log(`   XP Reward: ${challenge.xp_reward}`);
  }

  // Test the buggy code (should NOT produce expected output)
  const buggyResult = await executeCode(challenge.buggy_code);
  const buggyCorrect = buggyResult.trim() === challenge.expected_output.trim();

  if (showDetails) {
    console.log(`\n   Buggy code output: "${buggyResult}"`);
    console.log(`   Expected output:   "${challenge.expected_output}"`);
    console.log(`   Bug present:       ${!buggyCorrect ? '✅ Yes (bug confirmed)' : '❌ No (code already works!)'}`);
  }

  return {
    id: challenge.id,
    title: challenge.title,
    bugPresent: !buggyCorrect,
    buggyResult,
    expected: challenge.expected_output,
  };
}

async function main() {
  console.log(`\n📊 Testing ${DEBUGGING_CHALLENGES.length} challenges...\n`);

  const results: { id: string; title: string; bugPresent: boolean }[] = [];

  for (const challenge of DEBUGGING_CHALLENGES) {
    const result = await testChallenge(challenge, true);
    results.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 Summary:\n');

  const validChallenges = results.filter((r) => r.bugPresent);
  const invalidChallenges = results.filter((r) => !r.bugPresent);

  console.log(`  ✅ Valid challenges (bug present):   ${validChallenges.length}/${results.length}`);
  console.log(`  ❌ Invalid challenges (no bug):      ${invalidChallenges.length}/${results.length}`);

  if (invalidChallenges.length > 0) {
    console.log('\n  ⚠️  The following challenges need fixing:');
    for (const c of invalidChallenges) {
      console.log(`     - ${c.title} (${c.id})`);
    }
  }

  // Test random selection
  console.log('\n\n🎲 Testing random challenge selection...\n');
  const selectedIds: string[] = [];
  for (let i = 0; i < 5; i++) {
    const challenge = getRandomChallenge(selectedIds);
    console.log(`   ${i + 1}. Selected: ${challenge.title}`);
    selectedIds.push(challenge.id);
  }

  // Test exclusion works
  console.log('\n   Testing exclusion (selecting from remaining challenges):');
  const challenge = getRandomChallenge(selectedIds);
  const wasExcluded = selectedIds.includes(challenge.id);
  console.log(`   Selected: ${challenge.title}`);
  console.log(`   Was in excluded list: ${wasExcluded ? '⚠️ Yes (might be OK if all were excluded)' : '✅ No'}`);

  // Final result
  console.log('\n' + '='.repeat(60));
  if (validChallenges.length === results.length) {
    console.log('\n🎉 All challenges are valid and ready!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some challenges need attention.\n');
    process.exit(1);
  }
}

main().catch(console.error);
