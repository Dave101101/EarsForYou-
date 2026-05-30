/**
 * BottomNav - Floating bottom navigation with glow effects
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Home, Heart, BookOpen, BarChart3, User } from 'lucide-react';
import { cn } from './ui/utils';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/mood', icon: Heart, label: 'Mood' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/insights', icon: BarChart3, label: 'Insights' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-auto max-w-lg px-4 pb-4">
        <div className="relative rounded-3xl backdrop-blur-xl bg-card/80 border border-white/10 shadow-2xl shadow-primary/20 p-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className="relative">
                    <Icon className={cn('w-6 h-6', isActive && 'drop-shadow-[0_0_8px_rgba(124,92,255,0.6)]')} />
                    
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                        layoutId="nav-glow"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                  
                  <span className="text-xs font-medium">{item.label}</span>

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20"
                      layoutId="nav-bg"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}