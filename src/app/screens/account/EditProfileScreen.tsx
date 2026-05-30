/**
 * EditProfileScreen - Profile management with picture upload
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, User, Mail, Pencil, Shield, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import { useApp } from '../../context/AppContext';
import { AccountService } from '../../services/AccountService';
import { toast } from 'sonner';

export function EditProfileScreen() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [displayName, setDisplayName] = useState(user?.fullName?.split(' ')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'details'>('profile');

  if (!user) {
    navigate('/login');
    return null;
  }

  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setUploading(true);
    try {
      const result = await AccountService.uploadProfilePicture(file);
      if (result.success && result.url) {
        setAvatarUrl(result.url);
        toast.success('Profile photo updated');
      }
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    setSaving(true);
    try {
      const result = await AccountService.updateProfile({ fullName: fullName.trim(), email });
      if (result.success && result.user) {
        setUser(result.user);
        toast.success('Profile updated successfully');
        navigate('/account');
      } else {
        toast.error(result.message || 'Update failed');
      }
    } finally {
      setSaving(false);
    }
  };

  const infoRows = [
    { label: 'Gender', value: user.gender?.replace('-', ' ') || '—' },
    { label: 'Marital Status', value: user.maritalStatus || '—' },
    { label: 'Employment', value: user.employmentStatus?.replace('-', ' ') || '—' },
    { label: 'Generation', value: user.generation?.replace('-', ' ').toUpperCase() || '—' },
    { label: 'Account Created', value: new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0B1A] to-[#12122A] pb-28">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/account')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">Update your personal information</p>
          </div>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/40 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">{initials}</span>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-[#0B0B1A] hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground mt-3">Tap to change profile photo</p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10">
          {(['profile', 'details'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'profile' ? 'Edit Info' : 'Account Details'}
            </button>
          ))}
        </div>

        {activeTab === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <GlassmorphicCard>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10 bg-background/50 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Display Name</Label>
                  <div className="relative">
                    <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="How others see your name"
                      className="pl-10 bg-background/50 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10 bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-green-400">Email verified</span>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                Account Information
              </h3>
              <div className="space-y-3">
                {infoRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center py-2.5 text-sm ${
                      i < infoRows.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium capitalize">{row.value}</span>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Contact support to update demographic information
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
