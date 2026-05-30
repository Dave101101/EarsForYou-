/**
 * ProfileScreen - User profile and settings
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, User, Globe, Moon, Sun, LogOut, Trash2, Shield, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';
import { toast } from 'sonner';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, setUser, language, setLanguage, theme, toggleTheme } = useApp();
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await AuthService.deleteAccount();
      setUser(null);
      toast.success('Account deleted');
      navigate('/welcome');
    } catch (error) {
      toast.error('Failed to delete account');
      setDeleting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

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
          <div>
            <h1 className="text-2xl font-bold">Profile & Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassmorphicCard glow className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/50">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-xs text-accent">Verified Account</span>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassmorphicCard>
              <h3 className="font-medium mb-4">Preferences</h3>

              <div className="space-y-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary" />
                    )}
                    <div>
                      <Label className="cursor-pointer">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        {theme === 'dark' ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                {/* Language Toggle */}
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-accent" />
                    <div>
                      <Label>Language</Label>
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'English' : 'Nigerian Pidgin'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={language === 'en' ? 'default' : 'outline'}
                      onClick={() => setLanguage('en')}
                      className="text-xs"
                    >
                      English
                    </Button>
                    <Button
                      size="sm"
                      variant={language === 'pidgin' ? 'default' : 'outline'}
                      onClick={() => setLanguage('pidgin')}
                      className="text-xs"
                    >
                      Pidgin
                    </Button>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassmorphicCard>
              <h3 className="font-medium mb-4">Account Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="capitalize">{user.gender?.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-muted-foreground">Marital Status</span>
                  <span className="capitalize">{user.maritalStatus}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-muted-foreground">Employment</span>
                  <span className="capitalize">{user.employmentStatus?.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Generation</span>
                  <span className="uppercase">{user.generation?.replace('-', ' ')}</span>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassmorphicCard>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/account')}
                  variant="outline"
                  className="w-full justify-start border-white/10 hover:border-primary/50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Account
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start border-white/10 hover:border-primary/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-white/10 hover:border-destructive/50 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {deleting ? 'Deleting...' : 'Delete Account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
