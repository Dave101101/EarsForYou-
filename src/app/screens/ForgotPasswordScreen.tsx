/**
 * ForgotPasswordScreen - Password recovery
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { AuthService } from '../services/AuthService';
import { toast } from 'sonner';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.resetPassword(email);
      setSuccess(true);
      toast.success('Recovery email sent!');
    } catch (error) {
      toast.error('Failed to send recovery email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#0B0B1A] to-[#12122A] flex items-center justify-center px-6">
        <AnimatedBackground />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>
          <p className="text-muted-foreground mb-6">
            We've sent password recovery instructions to {email}
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-primary/90 text-white rounded-full"
          >
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#0B0B1A] to-[#12122A]">
      <AnimatedBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate('/login')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you recovery instructions
            </p>
          </div>

          <GlassmorphicCard glow>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-background/50 border-white/10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30"
              >
                {loading ? 'Sending...' : 'Send Recovery Email'}
              </Button>
            </form>
          </GlassmorphicCard>
        </motion.div>
      </div>
    </div>
  );
}
