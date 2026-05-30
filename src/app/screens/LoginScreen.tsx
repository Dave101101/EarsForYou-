/**
 * LoginScreen - User login
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Headphones } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { AuthService } from '../services/AuthService';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function LoginScreen() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await AuthService.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        toast.success('Welcome back!');
        navigate('/home');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#0B0B1A] to-[#12122A]">
      <AnimatedBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg shadow-primary/50">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Login to continue your journey</p>
          </div>

          <GlassmorphicCard glow>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-background/50 border-white/10"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </GlassmorphicCard>

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
