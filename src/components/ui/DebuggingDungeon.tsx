'use client';

import { useState, useCallback, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Lightbulb, Bug, Loader2, Eye, RotateCcw } from 'lucide-react';
import SlidePanel from './SlidePanel';
import CodeEditor from './CodeEditor';
import ConsoleOutput, { type ConsoleMessage } from './ConsoleOutput';
import { runCode, verifyCodeOutput } from '@/lib/utils/codeRunner';
import type { Challenge } from '@/types';

interface DebuggingDungeonProps {
  challenge: Challenge;
  skillLevel: number;
  onComplete: (success: boolean, xpGained: number) => void;
  onClose: () => void;
  onNextChallenge: () => void;
  isOpen: boolean;
}

export default function DebuggingDungeon({
  challenge,
  skillLevel,
  onComplete,
  onClose,
  onNextChallenge,
  isOpen,
}: DebuggingDungeonProps) {
  const [code, setCode] = useState(challenge.buggy_code);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleMessage[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);

  // Reset state when challenge changes
  useEffect(() => {
    setCode(challenge.buggy_code);
    setConsoleOutput([]);
    setIsCorrect(null);
    setShowHint(false);
    setShowSolution(false);
    setXpAwarded(null);
  }, [challenge]);

  const handleRun = async () => {
    setIsRunning(true);
    setIsCorrect(null);

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 200));

    const result = runCode(code);
    setConsoleOutput(result.output);

    // Check if output matches expected
    const correct = verifyCodeOutput(code, challenge.expected_output);
    setIsCorrect(correct);

    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsRunning(true);

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 200));

    const result = runCode(code);
    setConsoleOutput(result.output);

    const correct = verifyCodeOutput(code, challenge.expected_output);
    setIsCorrect(correct);

    if (correct && !showSolution) {
      // Award XP only if solution wasn't revealed
      const xp = challenge.xp_reward;
      setXpAwarded(xp);
      onComplete(true, xp);
    } else if (correct && showSolution) {
      // No XP if solution was revealed
      setXpAwarded(0);
      onComplete(true, 0);
    }

    setIsRunning(false);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setShowHint(true); // Also show hint when revealing solution
    
    // Set a placeholder message that the solution is shown
    setConsoleOutput([{
      type: 'info',
      content: 'Solution revealed. No XP will be awarded for this challenge.',
      timestamp: Date.now(),
    }]);
  };

  const handleNextChallenge = () => {
    setCode(challenge.buggy_code);
    setConsoleOutput([]);
    setIsCorrect(null);
    setShowHint(false);
    setShowSolution(false);
    setXpAwarded(null);
    onNextChallenge();
  };

  const handleReset = () => {
    setCode(challenge.buggy_code);
    setConsoleOutput([]);
    setIsCorrect(null);
  };

  const handleClose = () => {
    setCode(challenge.buggy_code);
    setConsoleOutput([]);
    setIsCorrect(null);
    setShowHint(false);
    setShowSolution(false);
    setXpAwarded(null);
    onClose();
  };

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      title="Debugging Dungeon"
    >
      <div className="flex flex-col h-full">
        {/* Challenge Header */}
        <div className="p-4 border-b border-card-border bg-background/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-dark/30">
              <Bug className="w-5 h-5 text-purple-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {challenge.title}
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-purple-accent">Level {skillLevel}</span>
                <span className="text-gray-600">•</span>
                <span className={`capitalize ${
                  challenge.difficulty === 'easy' ? 'text-green-400' :
                  challenge.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {challenge.difficulty}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-muted">{challenge.xp_reward} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Challenge Description */}
          <div className="p-4 rounded-xl bg-background border border-card-border">
            <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
            <div className="mt-3 p-2 rounded-lg bg-card-bg">
              <span className="text-sm text-gray-500">Expected output: </span>
              <code className="text-purple-accent font-mono">{challenge.expected_output}</code>
            </div>
          </div>

          {/* Code Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 font-mono">JavaScript</span>
              <button
                onClick={handleReset}
                className="text-xs text-muted hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Code
              </button>
            </div>
            <CodeEditor
              value={code}
              onChange={setCode}
              height="280px"
              placeholder="// Fix the buggy code..."
            />
          </div>

          {/* Console Output */}
          <ConsoleOutput messages={consoleOutput} maxHeight="180px" />

          {/* Result Banner */}
          {isCorrect !== null && (
            <div
              className={`p-4 rounded-xl border ${
                isCorrect
                  ? 'bg-green-900/20 border-green-800/50'
                  : 'bg-red-900/20 border-red-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Correct! Challenge Complete!' : 'Incorrect Output - Keep Trying!'}
                </span>
                {isCorrect && xpAwarded !== null && (
                  <span className={`ml-auto text-sm ${xpAwarded > 0 ? 'text-purple-accent' : 'text-muted'}`}>
                    {xpAwarded > 0 ? `+${xpAwarded} XP` : '0 XP (Solution revealed)'}
                  </span>
                )}
              </div>
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

          {/* Solution Revealed Warning */}
          {showSolution && (
            <div className="p-4 rounded-xl bg-orange-900/20 border border-orange-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-orange-400" />
                <span className="font-medium text-orange-400">Solution Mode</span>
              </div>
              <p className="text-orange-200/80 text-sm">
                The solution hint is now visible. You can still complete this challenge, but no XP will be awarded. 
                Use this as a learning opportunity!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-card-border bg-background/50">
          <div className="flex items-center justify-between">
            {/* Left side - Hint and Solution buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-900/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              
              {!showSolution && !isCorrect && (
                <button
                  onClick={handleShowSolution}
                  className="px-3 py-2 text-sm text-orange-400 hover:bg-orange-900/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Complete Solution (0 XP)
                </button>
              )}
            </div>

            {/* Right side - Action buttons */}
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
                className="px-4 py-2 bg-card-bg hover:bg-card-border text-foreground font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 border border-card-border"
              >
                <Play className="w-4 h-4" />
                Run Code
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isRunning || isCorrect === true}
                className="px-6 py-2 bg-purple-accent hover:bg-purple-glow text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SlidePanel>
  );
}
