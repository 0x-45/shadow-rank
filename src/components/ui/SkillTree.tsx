'use client';

/**
 * @deprecated This component is deprecated in favor of SkillRadarChart.
 * Use SkillRadarChart for the new radar/spider chart visualization of skills.
 * This file is kept for backwards compatibility but will be removed in a future version.
 */

import { Bug, TestTube, Layers, Code, Cloud, Lock, Database, FlaskConical } from 'lucide-react';
import { SkillProgressBar } from './XPProgressBar';
import type { Skill, SkillName } from '@/types';

interface SkillTreeProps {
  skills: Skill[];
  onSkillClick: (skillName: SkillName) => void;
}

const SKILL_CONFIG: Record<
  SkillName,
  { icon: typeof Bug; description: string; color: string }
> = {
  Debugging: {
    icon: Bug,
    description: 'Master the art of finding and fixing bugs',
    color: 'text-green-400',
  },
  'System Design': {
    icon: Layers,
    description: 'Design scalable and maintainable systems',
    color: 'text-blue-400',
  },
  Frontend: {
    icon: Code,
    description: 'Build beautiful and responsive interfaces',
    color: 'text-cyan-400',
  },
  Backend: {
    icon: Cloud,
    description: 'Create robust server-side applications',
    color: 'text-orange-400',
  },
  DevOps: {
    icon: Cloud,
    description: 'Deploy and maintain infrastructure',
    color: 'text-red-400',
  },
  Testing: {
    icon: FlaskConical,
    description: 'Ensure code quality with comprehensive tests',
    color: 'text-purple-400',
  },
  Database: {
    icon: Database,
    description: 'Design and optimize data storage solutions',
    color: 'text-yellow-400',
  },
};

const ALL_SKILLS: SkillName[] = ['Debugging', 'System Design', 'Frontend', 'Backend', 'DevOps', 'Testing', 'Database'];

export default function SkillTree({ skills, onSkillClick }: SkillTreeProps) {
  const skillMap = new Map(skills.map((s) => [s.skill_name, s]));

  return (
    <div className="p-6 rounded-2xl bg-card-bg border border-card-border">
      <h2 className="text-xl font-semibold text-foreground mb-6">Skill Tree</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_SKILLS.map((skillName) => {
          const skill = skillMap.get(skillName);
          const config = SKILL_CONFIG[skillName];
          const isUnlocked = skillName === 'Debugging'; // Only Debugging is unlocked in MVP
          const Icon = config.icon;

          return (
            <button
              key={skillName}
              onClick={() => isUnlocked && onSkillClick(skillName)}
              disabled={!isUnlocked}
              className={`
                relative p-4 rounded-xl border text-left transition-all
                ${
                  isUnlocked
                    ? 'bg-card-bg border-card-border hover:border-purple-accent/50 cursor-pointer'
                    : 'bg-background/50 border-card-border/50 cursor-not-allowed opacity-60'
                }
              `}
            >
              {/* Lock overlay for locked skills */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
              )}

              {/* Skill Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2 rounded-lg ${
                    isUnlocked ? 'bg-purple-dark/30' : 'bg-gray-800/50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isUnlocked ? config.color : 'text-gray-500'}`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-medium ${
                      isUnlocked ? 'text-foreground' : 'text-gray-500'
                    }`}
                  >
                    {skillName}
                  </h3>
                  {skill && isUnlocked && (
                    <span className="text-xs text-purple-accent">
                      Level {skill.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 mb-3">{config.description}</p>

              {/* Progress Bar (only for unlocked skills) */}
              {isUnlocked && skill && (
                <SkillProgressBar level={skill.level} maxLevel={10} />
              )}

              {/* Unlocked badge */}
              {isUnlocked && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/30 text-green-400 border border-green-800/50">
                    Active
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Enter Dungeon Button */}
      <div className="mt-6 pt-6 border-t border-card-border">
        <button
          onClick={() => onSkillClick('Debugging')}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-dark to-purple-accent hover:from-purple-accent hover:to-purple-glow text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Bug className="w-5 h-5" />
          Enter Debugging Dungeon
        </button>
      </div>
    </div>
  );
}
