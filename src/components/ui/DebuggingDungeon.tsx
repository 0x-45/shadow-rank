'use client';

import { useState, useCallback } from 'react';
import { X, Play, CheckCircle, XCircle, Lightbulb, Bug, Loader2 } from 'lucide-react';
import type { Challenge } from '@/types';

interface DebuggingDungeonProps {
  challenge: Challenge;
  skillLevel: number;
  onComplete: (success: boolean, xpGained: number) => void;
  onClose: () => void;
  onNextChallenge: () => void;
}

export default function DebuggingDungeon({
  challenge,
  skillLevel,
  onComplete,
  onClose,
  onNextChallenge,
}: DebuggingDungeonProps) {
  const [code, setCode] = useState(challenge.buggy_code);
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const executeCode = useCallback(async (codeToRun: string): Promise<string> => {
    // Wrap in async function to support await
    const asyncWrapper = `
      (async () => {
        ${codeToRun}
      })()
    `;

    try {
      // Use Function constructor for safer execution than eval
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
  }, []);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    setIsCorrect(null);

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = await executeCode(code);
    setOutput(result);

    const correct = result.trim() === challenge.expected_output.trim();
    setIsCorrect(correct);

    if (correct) {
      onComplete(true, challenge.xp_reward);
    }

    setIsRunning(false);
  };

  const handleNextChallenge = () => {
    setCode(challenge.buggy_code);
    setOutput(null);
    setIsCorrect(null);
    setShowHint(false);
    onNextChallenge();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-card-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-dark/30">
              <Bug className="w-5 h-5 text-purple-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {challenge.title}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Debugging Dungeon</span>
                <span className="text-gray-600">•</span>
                <span className="text-purple-accent">Level {skillLevel}</span>
                <span className="text-gray-600">•</span>
                <span className={`capitalize ${
                  challenge.difficulty === 'easy' ? 'text-green-400' :
                  challenge.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Challenge Description */}
          <div className="p-4 rounded-xl bg-background border border-card-border">
            <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Expected output: <code className="text-purple-accent">{challenge.expected_output}</code>
            </div>
          </div>

          {/* Code Editor */}
          <div className="rounded-xl overflow-hidden border border-card-border">
            <div className="flex items-center justify-between px-4 py-2 bg-background border-b border-card-border">
              <span className="text-sm text-gray-400 font-mono">JavaScript</span>
              <span className="text-xs text-gray-500">Fix the bug and run</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-4 bg-[#0d0d12] text-gray-300 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          {output !== null && (
            <div
              className={`p-4 rounded-xl border ${
                isCorrect
                  ? 'bg-green-900/20 border-green-800/50'
                  : 'bg-red-900/20 border-red-800/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span
                  className={`font-medium ${
                    isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {isCorrect ? 'Correct! Challenge Complete!' : 'Incorrect Output'}
                </span>
                {isCorrect && (
                  <span className="ml-auto text-sm text-purple-accent">
                    +{challenge.xp_reward} XP
                  </span>
                )}
              </div>
              <div className="font-mono text-sm">
                <span className="text-gray-500">Output: </span>
                <span className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                  {output}
                </span>
              </div>
              {!isCorrect && (
                <div className="mt-2 font-mono text-sm text-gray-500">
                  Expected: <span className="text-gray-400">{challenge.expected_output}</span>
                </div>
              )}
            </div>
          )}

          {/* Hint */}
          {showHint && (
            <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-yellow-400">Hint</span>
              </div>
              <p className="text-yellow-200/80 text-sm">{challenge.hint}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-card-border bg-background/50">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-900/20 rounded-lg transition-colors flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>

          <div className="flex items-center gap-3">
            {isCorrect && (
              <button
                onClick={handleNextChallenge}
                className="px-4 py-2 bg-purple-dark hover:bg-purple-accent text-white font-medium rounded-lg transition-colors"
              >
                Next Challenge
              </button>
            )}
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-6 py-2 bg-purple-accent hover:bg-purple-glow text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run & Verify
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
