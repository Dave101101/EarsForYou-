/**
 * JournalScreen - Journaling interface
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Save, BookOpen, Sparkles, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { JournalService, JournalEntry } from '../services/JournalService';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function JournalScreen() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [prompts] = useState(JournalService.getPrompts());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showPrompts, setShowPrompts] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const allEntries = JournalService.getAllEntries();
    setEntries(allEntries.slice(0, 5)); // Show recent 5
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setSaving(true);

    try {
      await JournalService.createEntry({
        userId: user.id,
        title: title.trim() || undefined,
        content: content.trim(),
        isPrivate: true,
      });

      toast.success('Journal entry saved!');
      setTitle('');
      setContent('');
      loadEntries();
    } catch (error) {
      toast.error('Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const usePrompt = (prompt: string) => {
    setContent(prev => prev ? `${prev}\n\n${prompt}` : prompt);
    setShowPrompts(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0B1A] to-[#12122A] pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Journal
            </h1>
            <p className="text-sm text-muted-foreground">Write your thoughts</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Writing Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassmorphicCard glow>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="mb-4 bg-transparent border-none text-xl font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
              />

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                className="min-h-[300px] bg-transparent border-none resize-none text-base leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
              />

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span className="text-xs text-muted-foreground">
                  {content.length} characters
                </span>
                <Button
                  onClick={handleSave}
                  disabled={!content.trim() || saving}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/30"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Prompts */}
          {showPrompts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassmorphicCard>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Need Inspiration?
                </h3>
                <div className="space-y-2">
                  {prompts.slice(0, 3).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => usePrompt(prompt)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-card/40 border border-white/10 hover:border-primary/50 hover:bg-card/60 transition-all text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* Recent Entries */}
          {entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassmorphicCard>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Recent Entries
                </h3>
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-xl bg-card/40 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      {entry.title && (
                        <h4 className="font-medium text-sm mb-1">{entry.title}</h4>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.content}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
