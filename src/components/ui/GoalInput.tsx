'use client';

import { useState } from 'react';

interface GoalInputProps {
  currentGoal: string | null;
  onGoalSave?: (goal: string) => void;
  onGoalDelete?: () => void;
}

/**
 * GoalInput Component
 * 
 * Allows users to set, edit, and delete their career goal.
 * The goal is used by the AI quest generation system to create
 * personalized quests aligned with the user's career aspirations.
 */
export default function GoalInput({ currentGoal, onGoalSave, onGoalDelete }: GoalInputProps) {
  const [goal, setGoal] = useState(currentGoal || '');
  const [isEditing, setIsEditing] = useState(!currentGoal);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!goal.trim()) {
      setError('Please enter a goal');
      return;
    }

    if (goal.length > 500) {
      setError('Goal must be 500 characters or less');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save goal');
      }

      setIsEditing(false);
      setSuccessMessage('Goal saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      onGoalSave?.(goal.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save goal');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch('/api/goal', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete goal');
      }

      setGoal('');
      setIsEditing(true);
      setShowDeleteConfirm(false);
      setSuccessMessage('Goal removed');
      setTimeout(() => setSuccessMessage(null), 3000);
      onGoalDelete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete goal');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
          <svg 
            className="w-5 h-5 text-purple-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Career Goal</h3>
          <p className="text-sm text-gray-400">
            Your goal helps us generate personalized quests
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          {successMessage}
        </div>
      )}

      {isEditing ? (
        /* Editing Mode */
        <div className="space-y-4">
          <div>
            <label htmlFor="goal-input" className="sr-only">
              Career Goal
            </label>
            <textarea
              id="goal-input"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Become a senior full-stack developer specializing in AI/ML applications..."
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
              rows={3}
              maxLength={500}
              disabled={isSaving}
            />
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-gray-500">
                Be specific - this influences your generated quests
              </span>
              <span className={goal.length > 450 ? 'text-yellow-400' : 'text-gray-500'}>
                {goal.length}/500
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !goal.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Goal
                </>
              )}
            </button>
            
            {currentGoal && (
              <button
                onClick={() => {
                  setGoal(currentGoal);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Display Mode */
        <div className="space-y-4">
          <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
            <p className="text-white leading-relaxed">{goal}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Goal
            </button>

            {showDeleteConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-red-600/20 text-gray-400 hover:text-red-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-700 hover:border-red-600/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      {/* Info about quest generation */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-300">
          <span className="font-medium">💡 Tip:</span> After updating your goal, generate new quests to get personalized challenges aligned with your aspirations!
        </p>
      </div>
    </div>
  );
}
