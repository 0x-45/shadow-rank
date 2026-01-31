/**
 * Test script to verify Shadow Rank setup
 * Run with: npx tsx scripts/test-setup.ts
 */

import { parseGitHubUrl, fetchGitHubRepo } from '../src/lib/utils/github';
import {
  calculateRankFromXP,
  calculateProgress,
  getNextRank,
  RANK_THRESHOLDS,
} from '../src/lib/utils/xp';

console.log('\n🌟 Shadow Rank Setup Test\n');
console.log('='.repeat(50));

// Test 1: XP Utilities
console.log('\n📊 Testing XP Utilities...\n');

const xpTests = [
  { xp: 0, expectedRank: 'E', expectedProgress: 0 },
  { xp: 50, expectedRank: 'E', expectedProgress: 50 },
  { xp: 100, expectedRank: 'D', expectedProgress: 0 },
  { xp: 175, expectedRank: 'D', expectedProgress: 50 },
  { xp: 250, expectedRank: 'C', expectedProgress: 0 },
  { xp: 500, expectedRank: 'B', expectedProgress: 0 },
  { xp: 750, expectedRank: 'B', expectedProgress: 50 },
  { xp: 1000, expectedRank: 'A', expectedProgress: 100 },
];

let xpTestsPassed = 0;
for (const test of xpTests) {
  const rank = calculateRankFromXP(test.xp);
  const progress = calculateProgress(test.xp, rank);
  const passed = rank === test.expectedRank;
  
  console.log(
    `  ${passed ? '✅' : '❌'} XP ${test.xp}: Rank ${rank} (expected ${test.expectedRank}), Progress: ${progress}%`
  );
  
  if (passed) xpTestsPassed++;
}

console.log(`\n  XP Tests: ${xpTestsPassed}/${xpTests.length} passed`);

// Test 2: Rank Progression
console.log('\n📈 Testing Rank Progression...\n');

const rankTests = [
  { rank: 'E' as const, expectedNext: 'D' },
  { rank: 'D' as const, expectedNext: 'C' },
  { rank: 'C' as const, expectedNext: 'B' },
  { rank: 'B' as const, expectedNext: 'A' },
  { rank: 'A' as const, expectedNext: null },
];

let rankTestsPassed = 0;
for (const test of rankTests) {
  const nextRank = getNextRank(test.rank);
  const passed = nextRank === test.expectedNext;
  
  console.log(
    `  ${passed ? '✅' : '❌'} ${test.rank} -> ${nextRank ?? 'MAX'} (expected ${test.expectedNext ?? 'MAX'})`
  );
  
  if (passed) rankTestsPassed++;
}

console.log(`\n  Rank Tests: ${rankTestsPassed}/${rankTests.length} passed`);

// Test 3: GitHub URL Parsing
console.log('\n🔗 Testing GitHub URL Parsing...\n');

const urlTests = [
  { url: 'https://github.com/vercel/next.js', expected: { owner: 'vercel', repo: 'next.js' } },
  { url: 'github.com/facebook/react', expected: { owner: 'facebook', repo: 'react' } },
  { url: 'https://github.com/user/repo.git', expected: { owner: 'user', repo: 'repo' } },
  { url: 'user/repo', expected: { owner: 'user', repo: 'repo' } },
  { url: 'invalid-url', expected: null },
];

let urlTestsPassed = 0;
for (const test of urlTests) {
  const parsed = parseGitHubUrl(test.url);
  const passed = JSON.stringify(parsed) === JSON.stringify(test.expected);
  
  console.log(
    `  ${passed ? '✅' : '❌'} "${test.url}" -> ${parsed ? `${parsed.owner}/${parsed.repo}` : 'null'}`
  );
  
  if (passed) urlTestsPassed++;
}

console.log(`\n  URL Tests: ${urlTestsPassed}/${urlTests.length} passed`);

// Test 4: GitHub API (live test)
console.log('\n🌐 Testing GitHub API (live)...\n');

async function testGitHubAPI() {
  const repo = await fetchGitHubRepo('vercel', 'next.js');
  
  if (repo) {
    console.log('  ✅ GitHub API working');
    console.log(`     Fetched: ${repo.full_name}`);
    console.log(`     Language: ${repo.language}`);
    console.log(`     Stars: ${repo.stargazers_count}`);
    return true;
  } else {
    console.log('  ❌ GitHub API failed');
    return false;
  }
}

// Test 5: Environment Variables
console.log('\n🔐 Checking Environment Variables...\n');

const envVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

let envConfigured = 0;
for (const envVar of envVars) {
  const value = process.env[envVar];
  const isPlaceholder = !value || value.includes('your_') || value.includes('_here');
  const status = value && !isPlaceholder ? '✅ Configured' : '⚠️  Not configured';
  
  console.log(`  ${status}: ${envVar}`);
  
  if (value && !isPlaceholder) envConfigured++;
}

// Run async tests
testGitHubAPI().then((apiWorking) => {
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📋 Summary:\n');
  console.log(`  XP Utilities:     ${xpTestsPassed}/${xpTests.length} passed`);
  console.log(`  Rank Progression: ${rankTestsPassed}/${rankTests.length} passed`);
  console.log(`  URL Parsing:      ${urlTestsPassed}/${urlTests.length} passed`);
  console.log(`  GitHub API:       ${apiWorking ? 'Working' : 'Failed'}`);
  console.log(`  Environment:      ${envConfigured}/${envVars.length} configured`);
  
  const allPassed = 
    xpTestsPassed === xpTests.length &&
    rankTestsPassed === rankTests.length &&
    urlTestsPassed === urlTests.length &&
    apiWorking;
  
  console.log(
    `\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests need attention'}\n`
  );
  
  if (envConfigured < envVars.length) {
    console.log('📝 Next Steps:');
    console.log('   1. Create a Supabase project at https://supabase.com');
    console.log('   2. Update .env.local with your Supabase credentials');
    console.log('   3. Run the SQL migration in Supabase SQL Editor');
    console.log('   4. Enable GitHub OAuth in Supabase Auth settings\n');
  }
  
  process.exit(allPassed ? 0 : 1);
});
