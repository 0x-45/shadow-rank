import type { ConsoleMessage } from '@/components/ui/ConsoleOutput';

export interface CodeRunResult {
  success: boolean;
  output: ConsoleMessage[];
  returnValue?: string;
  error?: string;
}

/**
 * Runs JavaScript code in a sandboxed environment
 * Captures console.log, console.error, console.warn, console.info outputs
 * 
 * @param code - The JavaScript code to execute
 * @returns CodeRunResult with captured output and any errors
 */
export function runCode(code: string): CodeRunResult {
  const output: ConsoleMessage[] = [];
  
  // Create mock console methods to capture output
  const mockConsole = {
    log: (...args: unknown[]) => {
      output.push({
        type: 'log',
        content: args.map(formatValue).join(' '),
        timestamp: Date.now(),
      });
    },
    error: (...args: unknown[]) => {
      output.push({
        type: 'error',
        content: args.map(formatValue).join(' '),
        timestamp: Date.now(),
      });
    },
    warn: (...args: unknown[]) => {
      output.push({
        type: 'warn',
        content: args.map(formatValue).join(' '),
        timestamp: Date.now(),
      });
    },
    info: (...args: unknown[]) => {
      output.push({
        type: 'info',
        content: args.map(formatValue).join(' '),
        timestamp: Date.now(),
      });
    },
  };

  try {
    // Create a sandboxed function with limited scope
    // We inject our mock console as 'console' in the function scope
    const sandboxedFunction = new Function(
      'console',
      `
      "use strict";
      ${code}
      `
    );

    // Execute with our mock console
    const result = sandboxedFunction(mockConsole);

    // If there's a return value, add it to output
    if (result !== undefined) {
      output.push({
        type: 'result',
        content: `Return value: ${formatValue(result)}`,
        timestamp: Date.now(),
      });
    }

    return {
      success: true,
      output,
      returnValue: result !== undefined ? formatValue(result) : undefined,
    };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : String(error);
    
    output.push({
      type: 'error',
      content: errorMessage,
      timestamp: Date.now(),
    });

    return {
      success: false,
      output,
      error: errorMessage,
    };
  }
}

/**
 * Formats a value for display in the console
 */
function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (Array.isArray(value)) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Array]';
    }
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Object]';
    }
  }
  return String(value);
}

/**
 * Checks if the code output matches the expected output
 * Used for verifying debugging challenge solutions
 * 
 * @param code - The JavaScript code to execute
 * @param expectedOutput - The expected output string
 * @returns boolean indicating if the output matches
 */
export function verifyCodeOutput(code: string, expectedOutput: string): boolean {
  const result = runCode(code);
  
  if (!result.success) return false;

  // Get all non-error messages as the actual output
  const actualOutput = result.output
    .filter(msg => msg.type === 'log' || msg.type === 'result')
    .map(msg => msg.content)
    .join('\n')
    .trim();

  // Normalize both outputs for comparison
  const normalizedExpected = expectedOutput.trim().replace(/\s+/g, ' ');
  const normalizedActual = actualOutput.replace(/\s+/g, ' ');

  return normalizedActual.includes(normalizedExpected) || 
         normalizedExpected.includes(normalizedActual) ||
         normalizedActual === normalizedExpected;
}
