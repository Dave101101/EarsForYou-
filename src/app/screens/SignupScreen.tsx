/**
 * SignupScreen - User registration with segmented cards
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { AuthService } from '../services/AuthService';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

export function SignupScreen() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    maritalStatus: '',
    employmentStatus: '',
    generation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.register(formData);
      
      if (result.success && result.user) {
        setUser(result.user);
        toast.success('Account created successfully!');
        navigate('/home');
      } else {
        toast.error(result.message || 'Signup failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const SegmentedOption = ({ 
    value, 
    label, 
    selected, 
    onClick 
  }: { 
    value: string; 
    label: string; 
    selected: boolean; 
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-white/10 bg-card/40 text-muted-foreground hover:border-white/20'
      )}
    >
      {label}
      {selected && (
        <Check className="absolute top-2 right-2 w-4 h-4 text-primary" />
      )}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#0B0B1A] to-[#12122A]">
      <AnimatedBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">Step {step} of 2</p>
          </div>

          <GlassmorphicCard glow>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="pl-10 bg-background/50 border-white/10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="pl-10 bg-background/50 border-white/10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="pl-10 bg-background/50 border-white/10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12"
                  >
                    Next
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <SegmentedOption
                        value="male"
                        label="Male"
                        selected={formData.gender === 'male'}
                        onClick={() => setFormData({ ...formData, gender: 'male' })}
                      />
                      <SegmentedOption
                        value="female"
                        label="Female"
                        selected={formData.gender === 'female'}
                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                      />
                      <SegmentedOption
                        value="non-binary"
                        label="Non-binary"
                        selected={formData.gender === 'non-binary'}
                        onClick={() => setFormData({ ...formData, gender: 'non-binary' })}
                      />
                      <SegmentedOption
                        value="prefer-not-to-say"
                        label="Prefer not to say"
                        selected={formData.gender === 'prefer-not-to-say'}
                        onClick={() => setFormData({ ...formData, gender: 'prefer-not-to-say' })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Marital Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <SegmentedOption
                        value="single"
                        label="Single"
                        selected={formData.maritalStatus === 'single'}
                        onClick={() => setFormData({ ...formData, maritalStatus: 'single' })}
                      />
                      <SegmentedOption
                        value="married"
                        label="Married"
                        selected={formData.maritalStatus === 'married'}
                        onClick={() => setFormData({ ...formData, maritalStatus: 'married' })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Employment Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <SegmentedOption
                        value="employed"
                        label="Employed"
                        selected={formData.employmentStatus === 'employed'}
                        onClick={() => setFormData({ ...formData, employmentStatus: 'employed' })}
                      />
                      <SegmentedOption
                        value="student"
                        label="Student"
                        selected={formData.employmentStatus === 'student'}
                        onClick={() => setFormData({ ...formData, employmentStatus: 'student' })}
                      />
                      <SegmentedOption
                        value="self-employed"
                        label="Self-employed"
                        selected={formData.employmentStatus === 'self-employed'}
                        onClick={() => setFormData({ ...formData, employmentStatus: 'self-employed' })}
                      />
                      <SegmentedOption
                        value="unemployed"
                        label="Unemployed"
                        selected={formData.employmentStatus === 'unemployed'}
                        onClick={() => setFormData({ ...formData, employmentStatus: 'unemployed' })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Generation</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <SegmentedOption
                        value="gen-z"
                        label="Gen Z"
                        selected={formData.generation === 'gen-z'}
                        onClick={() => setFormData({ ...formData, generation: 'gen-z' })}
                      />
                      <SegmentedOption
                        value="millennial"
                        label="Millennial"
                        selected={formData.generation === 'millennial'}
                        onClick={() => setFormData({ ...formData, generation: 'millennial' })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full h-12"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30"
                    >
                      {loading ? 'Creating...' : 'Create Account'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
          </GlassmorphicCard>

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
