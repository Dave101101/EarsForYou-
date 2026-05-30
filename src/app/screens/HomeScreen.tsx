/**
 * HomeScreen - Main dashboard
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Heart, TrendingUp, Flame, Sparkles, Clock, Battery, Focus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { MoodService, MoodStats } from '../services/MoodService';
import { InsightService } from '../services/InsightService';

export function HomeScreen() {
  const { user, language } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [affirmation, setAffirmation] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const moodStats = await MoodService.getStats();
    setStats(moodStats);

    const dailyAffirmation = await InsightService.getDailyAffirmation();
    setAffirmation(dailyAffirmation);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0B1A] to-[#12122A] pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-1">
            {greeting}, {user?.fullName?.split(' ')[0] || 'Friend'} 👋
          </h1>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </motion.div>

        <div className="space-y-4">
          {/* Daily Affirmation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassmorphicCard gradient glow className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Today's Affirmation</h3>
                  <p className="text-muted-foreground leading-relaxed">{affirmation}</p>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Quick Check-In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => navigate('/mood')}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-lg shadow-xl shadow-primary/30"
            >
              <Heart className="w-6 h-6 mr-2" />
              Quick Check-In
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Wellness Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GlassmorphicCard className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {stats?.wellnessScore || 0}
                </div>
                <div className="text-xs text-muted-foreground">Wellness Score</div>
              </GlassmorphicCard>
            </motion.div>

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
            >
              <GlassmorphicCard className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {stats?.currentStreak || 0}
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </GlassmorphicCard>
            </motion.div>
          </div>

          {/* Emotional Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Recent Patterns
              </h3>

              <div className="space-y-4">
                {/* Average Stress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Stress Level</span>
                    <span className="font-medium">
                      {stats?.averageStress ? Math.round(stats.averageStress) : 0}/10
                    </span>
                  </div>
                  <Progress 
                    value={(stats?.averageStress || 0) * 10} 
                    className="h-2 bg-white/10"
                  />
                </div>

                {/* Average Energy */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Battery className="w-4 h-4" />
                      Energy Level
                    </span>
                    <span className="font-medium">
                      {stats?.averageEnergy ? Math.round(stats.averageEnergy) : 0}/10
                    </span>
                  </div>
                  <Progress 
                    value={(stats?.averageEnergy || 0) * 10} 
                    className="h-2 bg-white/10"
                  />
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassmorphicCard>
              <h3 className="font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/journal')}
                  className="h-auto py-4 flex-col gap-2 border-white/10 hover:border-primary/50"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">Journal</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/insights')}
                  className="h-auto py-4 flex-col gap-2 border-white/10 hover:border-accent/50"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm">Insights</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/support')}
                  className="h-auto py-4 flex-col gap-2 border-white/10 hover:border-pink-500/50"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-500" />
                  </div>
                  <span className="text-sm">Support</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/sos')}
                  className="h-auto py-4 flex-col gap-2 border-white/10 hover:border-destructive/50"
                >
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Focus className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-sm">SOS</span>
                </Button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
