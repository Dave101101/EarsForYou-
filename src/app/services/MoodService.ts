/**
 * MoodService - Backend-ready mood tracking service
 * Currently uses localStorage, designed for easy API integration
 */

export type MoodType = 'amazing' | 'good' | 'okay' | 'down' | 'terrible';

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  intensity: number; // 1-10
  stress: number; // 1-10
  energy: number; // 1-10
  focus?: number; // 1-10
  notes?: string;
  timestamp: string;
  tags?: string[];
}

export interface MoodStats {
  averageMood: number;
  averageStress: number;
  averageEnergy: number;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  wellnessScore: number;
}

class MoodServiceClass {
  private STORAGE_KEY = 'earsforyou_moods';

  private async simulateDelay(ms = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async logMood(data: Omit<MoodEntry, 'id' | 'timestamp'>): Promise<MoodEntry> {
    await this.simulateDelay();

    // In production: POST /api/moods
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...data,
    };

    const entries = this.getAllMoods();
    entries.unshift(entry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));

    return entry;
  }

  getAllMoods(): MoodEntry[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async getMoodsByDateRange(startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    await this.simulateDelay(300);

    // In production: GET /api/moods?start=...&end=...
    const allMoods = this.getAllMoods();
    return allMoods.filter(mood => {
      const moodDate = new Date(mood.timestamp);
      return moodDate >= startDate && moodDate <= endDate;
    });
  }

  async getTodayMood(): Promise<MoodEntry | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const moods = await this.getMoodsByDateRange(today, tomorrow);
    return moods.length > 0 ? moods[0] : null;
  }

  async getStats(): Promise<MoodStats> {
    await this.simulateDelay(300);

    // In production: GET /api/moods/stats
    const moods = this.getAllMoods();

    if (moods.length === 0) {
      return {
        averageMood: 0,
        averageStress: 0,
        averageEnergy: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalEntries: 0,
        wellnessScore: 0,
      };
    }

    const moodValues = { amazing: 5, good: 4, okay: 3, down: 2, terrible: 1 };
    const avgMood = moods.reduce((sum, m) => sum + moodValues[m.mood], 0) / moods.length;
    const avgStress = moods.reduce((sum, m) => sum + m.stress, 0) / moods.length;
    const avgEnergy = moods.reduce((sum, m) => sum + m.energy, 0) / moods.length;

    const streak = this.calculateStreak(moods);
    const wellnessScore = this.calculateWellnessScore(avgMood, avgStress, avgEnergy);

    return {
      averageMood: avgMood,
      averageStress: avgStress,
      averageEnergy: avgEnergy,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      totalEntries: moods.length,
      wellnessScore,
    };
  }

  private calculateStreak(moods: MoodEntry[]): { current: number; longest: number } {
    if (moods.length === 0) return { current: 0, longest: 0 };

    const sortedMoods = [...moods].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    let current = 0;
    let longest = 0;
    let temp = 0;
    let lastDate = new Date();
    lastDate.setHours(0, 0, 0, 0);

    for (const mood of sortedMoods) {
      const moodDate = new Date(mood.timestamp);
      moodDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((lastDate.getTime() - moodDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        temp++;
        if (current === 0) current = temp;
      } else {
        longest = Math.max(longest, temp);
        temp = 1;
      }

      lastDate = moodDate;
    }

    longest = Math.max(longest, temp);
    return { current, longest };
  }

  private calculateWellnessScore(avgMood: number, avgStress: number, avgEnergy: number): number {
    // Wellness score: 0-100 based on mood, stress (inverted), and energy
    const moodScore = (avgMood / 5) * 40;
    const stressScore = ((10 - avgStress) / 10) * 30;
    const energyScore = (avgEnergy / 10) * 30;
    return Math.round(moodScore + stressScore + energyScore);
  }

  async deleteMood(id: string): Promise<boolean> {
    await this.simulateDelay();

    // In production: DELETE /api/moods/:id
    const moods = this.getAllMoods();
    const filtered = moods.filter(m => m.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
}

export const MoodService = new MoodServiceClass();
