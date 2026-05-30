/**
 * MoodSelector - Emotional orb selector for mood tracking
 */

import React from 'react';
import { motion } from 'motion/react';
import { Smile, Meh, Frown, CloudRain, Sparkles } from 'lucide-react';
import { cn } from './ui/utils';
import { MoodType } from '../services/MoodService';

interface MoodOption {
  value: MoodType;
  label: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

const moodOptions: MoodOption[] = [
  {
    value: 'amazing',
    label: 'Amazing',
    icon: Sparkles,
    color: 'text-green-400',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    value: 'good',
    label: 'Good',
    icon: Smile,
    color: 'text-blue-400',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    value: 'okay',
    label: 'Okay',
    icon: Meh,
    color: 'text-purple-400',
    gradient: 'from-purple-400 to-violet-500',
  },
  {
    value: 'down',
    label: 'Down',
    icon: Frown,
    color: 'text-orange-400',
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    value: 'terrible',
    label: 'Terrible',
    icon: CloudRain,
    color: 'text-pink-400',
    gradient: 'from-pink-400 to-rose-500',
  },
];

interface MoodSelectorProps {
  selected: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {moodOptions.map((mood) => {
        const Icon = mood.icon;
        const isSelected = selected === mood.value;

        return (
          <motion.button
            key={mood.value}
            onClick={() => onSelect(mood.value)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all',
              'border-2',
              isSelected
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-white/10 bg-card/40 hover:bg-card/60 hover:border-white/20'
            )}
            whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center',
                'bg-gradient-to-br shadow-lg',
                mood.gradient
              )}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <span className={cn('text-sm font-medium', isSelected && 'text-primary')}>
              {mood.label}
            </span>

            {isSelected && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-primary/20"
                layoutId="mood-selection"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
