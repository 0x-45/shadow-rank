import type { Challenge } from '@/types';

/**
 * Pre-written JavaScript debugging challenges
 * Each challenge has buggy code that the user must fix
 */
export const DEBUGGING_CHALLENGES: Challenge[] = [
  {
    id: 'off-by-one',
    title: 'The Off-By-One Error',
    description:
      'This function should return the sum of all numbers from 1 to n (inclusive), but something is wrong.',
    buggy_code: `function sumToN(n) {
  let sum = 0;
  for (let i = 1; i < n; i++) {
    sum += i;
  }
  return sum;
}

// Test: sumToN(5) should return 15 (1+2+3+4+5)
return sumToN(5);`,
    expected_output: '15',
    hint: 'Check the loop condition carefully. Should it be < or <=?',
    difficulty: 'easy',
    xp_reward: 10,
  },
  {
    id: 'array-mutation',
    title: 'The Mutating Array',
    description:
      'This function should double all numbers in an array without modifying the original array, but it has a bug.',
    buggy_code: `function doubleArray(arr) {
  const result = arr;
  for (let i = 0; i < result.length; i++) {
    result[i] = result[i] * 2;
  }
  return result;
}

// Test: Should return [2, 4, 6] without modifying original
const original = [1, 2, 3];
const doubled = doubleArray(original);
return original[0] === 1 ? doubled.join(',') : 'MUTATION_ERROR';`,
    expected_output: '2,4,6',
    hint: 'Assigning an array to a new variable doesn\'t copy it. How do you properly clone an array?',
    difficulty: 'easy',
    xp_reward: 10,
  },
  {
    id: 'async-await',
    title: 'The Missing Await',
    description:
      'This async function should wait for data to load, but the timing is off.',
    buggy_code: `async function fetchData() {
  // Simulating an API call
  const getData = () => new Promise(resolve => {
    setTimeout(() => resolve('data loaded'), 100);
  });
  
  let result = 'initial';
  
  async function load() {
    result = await getData();
  }
  
  load();
  return result;
}

// Test: Should return 'data loaded'
return await fetchData();`,
    expected_output: 'data loaded',
    hint: 'When calling an async function, you might need to wait for it to complete.',
    difficulty: 'medium',
    xp_reward: 15,
  },
  {
    id: 'scope-closure',
    title: 'The Closure Trap',
    description:
      'This function creates an array of functions that should return their index, but they all return the same value.',
    buggy_code: `function createCounters() {
  const counters = [];
  
  for (var i = 0; i < 3; i++) {
    counters.push(function() {
      return i;
    });
  }
  
  return counters;
}

// Test: counters[0]() should return 0, counters[1]() should return 1, etc.
const counters = createCounters();
return counters[0]() + ',' + counters[1]() + ',' + counters[2]();`,
    expected_output: '0,1,2',
    hint: 'The problem is with variable scoping. Consider the difference between var and let.',
    difficulty: 'medium',
    xp_reward: 15,
  },
  {
    id: 'type-coercion',
    title: 'The Type Confusion',
    description:
      'This function should sum numbers from form inputs, but returns an unexpected result.',
    buggy_code: `function sumInputs(a, b) {
  // Simulating form input values (always strings)
  const input1 = String(a);
  const input2 = String(b);
  
  return input1 + input2;
}

// Test: sumInputs(10, 20) should return 30
return sumInputs(10, 20);`,
    expected_output: '30',
    hint: 'Form inputs are strings. What happens when you use + with strings?',
    difficulty: 'easy',
    xp_reward: 10,
  },
  {
    id: 'null-check',
    title: 'The Null Reference',
    description:
      'This function should safely get a nested property, but crashes on null values.',
    buggy_code: `function getNestedValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    current = current[part];
  }
  
  return current;
}

// Test: Should return 'default' when path doesn't exist
const data = { user: null };
const result = getNestedValue(data, 'user.name');
return result === undefined || result === null ? 'default' : result;`,
    expected_output: 'default',
    hint: 'What happens when you try to access a property of null?',
    difficulty: 'medium',
    xp_reward: 15,
  },
  {
    id: 'array-filter',
    title: 'The Truthy Filter',
    description:
      'This function should remove all falsy values from an array, but it doesn\'t work correctly.',
    buggy_code: `function removeFalsy(arr) {
  return arr.filter(function(item) {
    if (item) {
      return item;
    }
  });
}

// Test: Should return [1, 2, 'hello']
const input = [0, 1, false, 2, '', 'hello', null, undefined];
return removeFalsy(input).join(',');`,
    expected_output: '1,2,hello',
    hint: 'The filter callback should return true or false, not the item itself. Or use an even simpler approach.',
    difficulty: 'easy',
    xp_reward: 10,
  },
  {
    id: 'object-reference',
    title: 'The Shared State',
    description:
      'This function creates multiple users with default settings, but changes to one affect all.',
    buggy_code: `function createUsers(names, defaultSettings) {
  return names.map(name => ({
    name: name,
    settings: defaultSettings
  }));
}

// Test: Changing one user's settings shouldn't affect others
const defaults = { theme: 'dark' };
const users = createUsers(['Alice', 'Bob'], defaults);
users[0].settings.theme = 'light';
return users[1].settings.theme;`,
    expected_output: 'dark',
    hint: 'Objects are passed by reference. Each user should have their own settings object.',
    difficulty: 'medium',
    xp_reward: 15,
  },
  {
    id: 'reduce-init',
    title: 'The Missing Initial Value',
    description:
      'This function should count occurrences of each item, but sometimes crashes.',
    buggy_code: `function countItems(items) {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  });
}

// Test: Should return { a: 2, b: 1 }
const result = countItems(['a', 'b', 'a']);
return result.a + ',' + result.b;`,
    expected_output: '2,1',
    hint: 'reduce() without an initial value uses the first element. What should the initial value be?',
    difficulty: 'medium',
    xp_reward: 15,
  },
  {
    id: 'promise-all',
    title: 'The Race Condition',
    description:
      'This function should process items in parallel and return results in order, but the order is wrong.',
    buggy_code: `async function processInParallel(items) {
  const results = [];
  
  items.forEach(async (item) => {
    const result = await new Promise(resolve => {
      setTimeout(() => resolve(item * 2), Math.random() * 100);
    });
    results.push(result);
  });
  
  return results;
}

// Test: processInParallel([1, 2, 3]) should return [2, 4, 6]
const result = await processInParallel([1, 2, 3]);
return result.length === 3 ? result.join(',') : 'empty';`,
    expected_output: '2,4,6',
    hint: 'forEach doesn\'t wait for async operations. Consider using Promise.all with map.',
    difficulty: 'hard',
    xp_reward: 20,
  },
];

/**
 * Get a random challenge, optionally excluding recently completed ones
 */
export function getRandomChallenge(excludeIds: string[] = []): Challenge {
  const available = DEBUGGING_CHALLENGES.filter(
    (c) => !excludeIds.includes(c.id)
  );

  // If all challenges have been completed, reset and allow repeats
  const pool = available.length > 0 ? available : DEBUGGING_CHALLENGES;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Get a challenge by ID
 */
export function getChallengeById(id: string): Challenge | undefined {
  return DEBUGGING_CHALLENGES.find((c) => c.id === id);
}

/**
 * Get all challenges
 */
export function getAllChallenges(): Challenge[] {
  return DEBUGGING_CHALLENGES;
}
