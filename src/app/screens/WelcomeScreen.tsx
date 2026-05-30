/**
 * WelcomeScreen - Onboarding carousel
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';

const onboardingSlides = [
  {
    icon: Heart,
    title: 'Track Your Emotions',
    description: 'Log your daily mood and understand your emotional patterns over time',
    color: 'from-pink-400 to-rose-500',
  },
  {
    icon: BookOpen,
    title: 'Journal Your Thoughts',
    description: 'Write freely in a safe, private space designed for emotional healing',
    color: 'from-purple-400 to-violet-500',
  },
  {
    icon: Sparkles,
    title: 'Get Personalized Insights',
    description: 'Receive AI-powered suggestions tailored to your wellness journey',
    color: 'from-cyan-400 to-blue-500',
  },
];

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem('earsforyou_onboarded', 'true');
      navigate('/signup');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('earsforyou_onboarded', 'true');
    navigate('/signup');
  };

  const slide = onboardingSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#0B0B1A] to-[#12122A]">
      <AnimatedBackground />

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-6">
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <GlassmorphicCard className="text-center" glow>
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-2xl`}>
                <Icon className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {slide.description}
              </p>
            </GlassmorphicCard>
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots */}
        <div className="flex gap-2 mt-8">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next button */}
      <div className="relative z-10 p-6">
        <Button
          onClick={handleNext}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-14 text-lg shadow-lg shadow-primary/30"
        >
          {currentSlide < onboardingSlides.length - 1 ? (
            <>
              Next <ChevronRight className="ml-2 w-5 h-5" />
            </>
          ) : (
            'Get Started'
          )}
        </Button>
      </div>
    </div>
  );
}
