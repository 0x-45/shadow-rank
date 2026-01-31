/**
 * Test script to verify API endpoints work correctly
 * Run with: npx tsx scripts/test-api.ts
 * 
 * Note: This tests the API logic without actually calling the endpoints
 * (since that would require the dev server running)
 */

import { parseGitHubUrl, verifyGitHubRepo, fetchGitHubProfile } from '../src/lib/utils/github';
import { calculateXPGain, calculateRankFromXP, XP_REWARDS } from '../src/lib/utils/xp';
import { getFallbackAwakeningResult, parseAIResponse } from '../src/lib/ai/prompts';

console.log('\n🔌 Shadow Rank - API Logic Test\n');
console.log('='.repeat(60));

async function testGitHubVerification() {
  console.log('\n📡 Testing GitHub Verification Logic...\n');

  const testCases = [
    { url: 'https://github.com/vercel/next.js', shouldPass: true },
    { url: 'https://github.com/facebook/react', shouldPass: true },
    { url: 'https://github.com/nonexistent-user-12345/fake-repo-67890', shouldPass: false },
    { url: 'invalid-url', shouldPass: false },
  ];

  let passed = 0;
  for (const test of testCases) {
    const result = await verifyGitHubRepo(test.url);
    const success = result.valid === test.shouldPass;
    
    console.log(`  ${success ? '✅' : '❌'} ${test.url}`);
    console.log(`     Expected: ${test.shouldPass ? 'valid' : 'invalid'}, Got: ${result.valid ? 'valid' : 'invalid'}`);
    if (!result.valid && result.error) {
      console.log(`     Error: ${result.error}`);
    }
    
    if (success) passed++;
  }

  console.log(`\n  GitHub Verification: ${passed}/${testCases.length} passed`);
  return passed === testCases.length;
}

async function testGitHubProfileFetch() {
  console.log('\n👤 Testing GitHub Profile Fetch...\n');

  const profile = await fetchGitHubProfile('vercel');
  
  if (profile) {
    console.log('  ✅ Profile fetched successfully');
    console.log(`     Source: ${profile.source}`);
    console.log(`     Languages: ${profile.languages.slice(0, 5).join(', ')}`);
    console.log(`     Projects: ${profile.projects.length}`);
    return true;
  } else {
    console.log('  ❌ Failed to fetch profile');
    return false;
  }
}

function testXPCalculations() {
  console.log('\n📊 Testing XP Calculations...\n');

  const testCases = [
    { currentXP: 0, currentRank: 'E' as const, xpGain: 50, expectedRankUp: false },
    { currentXP: 75, currentRank: 'E' as const, xpGain: 50, expectedRankUp: true, expectedNewRank: 'D' },
    { currentXP: 200, currentRank: 'D' as const, xpGain: 75, expectedRankUp: true, expectedNewRank: 'C' },
    { currentXP: 950, currentRank: 'B' as const, xpGain: 100, expectedRankUp: true, expectedNewRank: 'A' },
    { currentXP: 1000, currentRank: 'A' as const, xpGain: 50, expectedRankUp: false },
  ];

  let passed = 0;
  for (const test of testCases) {
    const result = calculateXPGain(test.currentXP, test.currentRank, test.xpGain);
    const rankUpCorrect = result.rank_up === test.expectedRankUp;
    const newRankCorrect = !test.expectedRankUp || result.new_rank === test.expectedNewRank;
    const success = rankUpCorrect && newRankCorrect;

    console.log(`  ${success ? '✅' : '❌'} ${test.currentXP} XP (${test.currentRank}) + ${test.xpGain} XP`);
    console.log(`     Rank up: ${result.rank_up} (expected: ${test.expectedRankUp})`);
    if (result.rank_up) {
      console.log(`     New rank: ${result.new_rank} (expected: ${test.expectedNewRank})`);
    }

    if (success) passed++;
  }

  console.log(`\n  XP Calculations: ${passed}/${testCases.length} passed`);
  return passed === testCases.length;
}

function testAIResponseParsing() {
  console.log('\n🤖 Testing AI Response Parsing...\n');

  const testCases = [
    {
      name: 'Valid JSON',
      input: '{"rank": "D", "message": "You have awakened!"}',
      shouldParse: true,
    },
    {
      name: 'JSON with markdown',
      input: '```json\n{"rank": "C", "message": "test"}\n```',
      shouldParse: true,
    },
    {
      name: 'JSON with text before',
      input: 'Here is your result: {"rank": "B"}',
      shouldParse: true,
    },
    {
      name: 'Invalid JSON',
      input: 'This is not JSON at all',
      shouldParse: false,
    },
  ];

  let passed = 0;
  for (const test of testCases) {
    const result = parseAIResponse(test.input);
    const success = (result !== null) === test.shouldParse;

    console.log(`  ${success ? '✅' : '❌'} ${test.name}`);
    console.log(`     Parsed: ${result !== null}`);

    if (success) passed++;
  }

  console.log(`\n  AI Response Parsing: ${passed}/${testCases.length} passed`);
  return passed === testCases.length;
}

function testFallbackAwakening() {
  console.log('\n🔄 Testing Fallback Awakening...\n');

  const fallback = getFallbackAwakeningResult();

  const checks = [
    { name: 'Has rank', pass: !!fallback.rank },
    { name: 'Has quest', pass: !!fallback.quest },
    { name: 'Quest has title', pass: !!fallback.quest.title },
    { name: 'Quest has description', pass: !!fallback.quest.description },
    { name: 'Quest has XP reward', pass: fallback.quest.xp_reward > 0 },
    { name: 'Has message', pass: !!fallback.message },
  ];

  let passed = 0;
  for (const check of checks) {
    console.log(`  ${check.pass ? '✅' : '❌'} ${check.name}`);
    if (check.pass) passed++;
  }

  console.log(`\n  Fallback Awakening: ${passed}/${checks.length} passed`);
  return passed === checks.length;
}

async function main() {
  const results = {
    github: await testGitHubVerification(),
    profile: await testGitHubProfileFetch(),
    xp: testXPCalculations(),
    aiParsing: testAIResponseParsing(),
    fallback: testFallbackAwakening(),
  };

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 Summary:\n');

  const allPassed = Object.values(results).every(Boolean);
  
  for (const [name, passed] of Object.entries(results)) {
    console.log(`  ${passed ? '✅' : '❌'} ${name}`);
  }

  console.log(`\n${allPassed ? '🎉 All API logic tests passed!' : '⚠️  Some tests failed.'}\n`);
  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
