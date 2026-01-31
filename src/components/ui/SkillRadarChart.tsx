'use client';

import { useState, useCallback } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Zap, Lock, Info } from 'lucide-react';
import type { Skill, SkillName, SkillRadarData } from '@/types';
import { LEVELABLE_SKILLS } from '@/types';

interface SkillRadarChartProps {
  skills: Skill[];
  onSkillClick: (skillName: SkillName) => void;
}

// Default skills to show even if user doesn't have them
const DEFAULT_SKILLS: SkillName[] = [
  'Frontend',
  'Backend', 
  'Debugging',
  'DevOps',
  'Testing',
  'Database',
  'System Design',
];

// Custom tooltip content - defined outside component to avoid re-creation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltipContent(props: any) {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload as SkillRadarData;
    return (
      <div className="bg-card-bg border border-card-border rounded-lg p-3 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-foreground">{data.skill_name}</span>
          {data.is_levelable && (
            <Zap className="w-4 h-4 text-purple-accent" />
          )}
        </div>
        <div className="text-sm text-muted space-y-1">
          <p>Level: <span className="text-foreground font-medium">{data.level}/10</span></p>
          {data.is_levelable && (
            <>
              <p>Base Level: <span className="text-foreground">{data.base_level}</span></p>
              <p>Earned XP: <span className="text-purple-accent">{data.earned_xp}</span></p>
            </>
          )}
        </div>
        {data.is_levelable && (
          <p className="text-xs text-purple-accent mt-2">Click to level up!</p>
        )}
      </div>
    );
  }
  return null;
}

/**
 * SkillRadarChart - A radar/spider chart visualization of user skills
 * 
 * Features:
 * - Polygonal shape based on number of skills
 * - Concentric level rings (1-10 scale)
 * - Filled area representing proficiency levels
 * - Hover tooltips with skill details
 * - Clickable skills (Debugging opens dungeon)
 * - Visual distinction for levelable skills
 */
export default function SkillRadarChart({ skills, onSkillClick }: SkillRadarChartProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transform skills data for the radar chart
  const skillMap = new Map(skills.map(s => [s.skill_name, s]));
  
  const chartData: SkillRadarData[] = DEFAULT_SKILLS.map(skillName => {
    const skill = skillMap.get(skillName);
    const isLevelable = LEVELABLE_SKILLS.includes(skillName);
    
    return {
      skill_name: skillName,
      level: skill?.level || 1,
      base_level: skill?.base_level || 1,
      earned_xp: skill?.earned_xp || 0,
      is_levelable: isLevelable,
      full_mark: 10,
    };
  });

  const handleSkillClick = useCallback((skillName: string) => {
    const isLevelable = LEVELABLE_SKILLS.includes(skillName as SkillName);
    
    if (isLevelable) {
      onSkillClick(skillName as SkillName);
    } else {
      // Show "Coming soon" toast for non-levelable skills
      setToastMessage(`${skillName} training coming soon!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  }, [onSkillClick]);

  // Custom tick renderer for angle axis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPolarAngleAxisTick = (props: any) => {
    const { payload, x, y, textAnchor } = props;
    const isLevelable = LEVELABLE_SKILLS.includes(payload.value as SkillName);
    
    return (
      <g className="cursor-pointer" onClick={() => handleSkillClick(payload.value)}>
        <text
          x={x}
          y={y}
          textAnchor={textAnchor as 'start' | 'middle' | 'end'}
          dominantBaseline="middle"
          className={`text-xs font-medium ${
            isLevelable 
              ? 'fill-purple-400' 
              : 'fill-gray-400'
          }`}
        >
          {payload.value}
          {isLevelable && ' ⚡'}
        </text>
      </g>
    );
  };

  return (
    <div className="p-6 rounded-2xl bg-card-bg border border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Skill Radar</h2>
        <div className="flex items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-accent" />
            <span>Levelable</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs text-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-accent/50" />
          <span>Your Skills</span>
        </div>
        <div className="flex items-center gap-2">
          <Info className="w-3 h-3" />
          <span>Click skill name to train</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid 
              stroke="#374151" 
              strokeOpacity={0.5}
            />
            <PolarAngleAxis
              dataKey="skill_name"
              tick={renderPolarAngleAxisTick}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              axisLine={false}
              tickCount={6}
            />
            <Radar
              name="Skills"
              dataKey="level"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{
                r: 4,
                fill: '#a855f7',
                stroke: '#7c3aed',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: '#c084fc',
                stroke: '#a855f7',
                strokeWidth: 2,
              }}
            />
            <Tooltip content={CustomTooltipContent} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Stats Summary */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {chartData.slice(0, 4).map((skill) => (
          <button
            key={skill.skill_name}
            onClick={() => handleSkillClick(skill.skill_name)}
            className={`
              p-3 rounded-lg border transition-colors text-left
              ${skill.is_levelable 
                ? 'border-purple-accent/30 hover:border-purple-accent bg-purple-dark/10 hover:bg-purple-dark/20' 
                : 'border-card-border hover:border-gray-600 bg-background/50 hover:bg-background'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{skill.skill_name}</span>
              {skill.is_levelable && <Zap className="w-3 h-3 text-purple-accent" />}
            </div>
            <div className="text-lg font-bold text-foreground mt-1">
              Lv. {skill.level}
            </div>
            {skill.is_levelable && skill.earned_xp > 0 && (
              <div className="text-xs text-purple-accent">
                +{skill.earned_xp} XP earned
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="bg-card-bg border border-card-border rounded-lg px-4 py-3 shadow-xl flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted" />
            <span className="text-sm text-foreground">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
