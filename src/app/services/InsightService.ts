/**
 * InsightService - AI-powered emotional insights (frontend simulated, backend-ready)
 */

import { MoodEntry, MoodService } from './MoodService';

export interface Insight {
  id: string;
  type: 'pattern' | 'encouragement' | 'suggestion' | 'observation';
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'positive';
  timestamp: string;
}

class InsightServiceClass {
  private async simulateDelay(ms = 700): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateInsights(): Promise<Insight[]> {
    await this.simulateDelay();

    // In production: POST /api/insights/generate (AI backend)
    const moods = MoodService.getAllMoods();
    const insights: Insight[] = [];

    if (moods.length === 0) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'encouragement',
        title: 'Welcome! 🌟',
        message: 'Start tracking your mood to unlock personalized insights.',
        severity: 'info',
        timestamp: new Date().toISOString(),
      });
      return insights;
    }

    // Pattern detection
    const stressPattern = this.detectStressPattern(moods);
    if (stressPattern) insights.push(stressPattern);

    const weekdayPattern = this.detectWeekdayPattern(moods);
    if (weekdayPattern) insights.push(weekdayPattern);

    // Encouragement based on streak
    const stats = await MoodService.getStats();
    if (stats.currentStreak >= 7) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'encouragement',
        title: '🔥 Amazing Streak!',
        message: `You've logged your mood for ${stats.currentStreak} days straight. Keep going!`,
        severity: 'positive',
        timestamp: new Date().toISOString(),
      });
    }

    // Wellness observation
    if (stats.wellnessScore >= 80) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'observation',
        title: '✨ Thriving',
        message: 'Your wellness score is excellent. You\'re doing great!',
        severity: 'positive',
        timestamp: new Date().toISOString(),
      });
    } else if (stats.wellnessScore < 50) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'suggestion',
        title: '💙 Self-Care Time',
        message: 'Your wellness score suggests you might need extra support. Consider reaching out.',
        severity: 'warning',
        timestamp: new Date().toISOString(),
      });
    }

    return insights.slice(0, 4); // Return top 4 insights
  }

  private detectStressPattern(moods: MoodEntry[]): Insight | null {
    const recentMoods = moods.slice(0, 7);
    const avgStress = recentMoods.reduce((sum, m) => sum + m.stress, 0) / recentMoods.length;

    if (avgStress > 7) {
      return {
        id: crypto.randomUUID(),
        type: 'pattern',
        title: '⚠️ High Stress Detected',
        message: 'Your stress levels have been elevated this week. Try breathing exercises or reach out for support.',
        severity: 'warning',
        timestamp: new Date().toISOString(),
      };
    }

    return null;
  }

  private detectWeekdayPattern(moods: MoodEntry[]): Insight | null {
    const moodsByDay: { [key: number]: number[] } = {};

    moods.forEach(mood => {
      const day = new Date(mood.timestamp).getDay();
      if (!moodsByDay[day]) moodsByDay[day] = [];
      moodsByDay[day].push(mood.stress);
    });

    // Check if weekdays (Mon-Fri) have higher stress
    const weekdayStress = [1, 2, 3, 4, 5]
      .filter(day => moodsByDay[day]?.length > 0)
      .flatMap(day => moodsByDay[day]);

    const weekendStress = [0, 6]
      .filter(day => moodsByDay[day]?.length > 0)
      .flatMap(day => moodsByDay[day]);

    if (weekdayStress.length > 3 && weekendStress.length > 0) {
      const avgWeekday = weekdayStress.reduce((a, b) => a + b, 0) / weekdayStress.length;
      const avgWeekend = weekendStress.reduce((a, b) => a + b, 0) / weekendStress.length;

      if (avgWeekday - avgWeekend > 2) {
        return {
          id: crypto.randomUUID(),
          type: 'pattern',
          title: '📊 Weekday Stress',
          message: 'You tend to feel more stressed on weekdays. Consider work-life balance strategies.',
          severity: 'info',
          timestamp: new Date().toISOString(),
        };
      }
    }

    return null;
  }

  async getDailyAffirmation(): Promise<string> {
    await this.simulateDelay(300);

    // In production: GET /api/insights/affirmation
    const affirmations = [
      "You are exactly where you need to be.",
      "Your feelings are valid and important.",
      "You have the strength to overcome today's challenges.",
      "It's okay to take things one step at a time.",
      "You deserve peace, love, and happiness.",
      "Your mental health matters.",
      "You are not alone in this journey.",
      "Progress, not perfection.",
      "You are doing better than you think.",
      "Be gentle with yourself today.",
    ];

    const index = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % affirmations.length;
    return affirmations[index];
  }

  async getSuggestions(mood: string, stress: number): Promise<string[]> {
    await this.simulateDelay(400);

    // In production: POST /api/insights/suggestions
    const suggestions: string[] = [];

    if (stress > 7) {
      suggestions.push('Try the 4-7-8 breathing technique');
      suggestions.push('Take a short walk outside');
      suggestions.push('Listen to calming music');
    }

    if (mood === 'down' || mood === 'terrible') {
      suggestions.push('Reach out to a friend or loved one');
      suggestions.push('Journal about what you\'re feeling');
      suggestions.push('Consider professional support');
    }

    if (suggestions.length === 0) {
      suggestions.push('Practice gratitude journaling');
      suggestions.push('Stay hydrated and get enough rest');
    }

    return suggestions;
  }
}

export const InsightService = new InsightServiceClass();
