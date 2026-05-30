/**
 * AuthService - Backend-ready authentication service
 * Currently uses localStorage, designed to easily swap with API calls
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  employmentStatus?: 'employed' | 'unemployed' | 'student' | 'self-employed';
  generation?: 'gen-z' | 'millennial' | 'gen-x' | 'boomer';
  createdAt: string;
  language: 'en' | 'pidgin';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

class AuthServiceClass {
  private STORAGE_KEY = 'earsforyou_user';
  private SESSION_KEY = 'earsforyou_session';

  // Simulated API delay for realistic UX
  private async simulateDelay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    gender: string;
    maritalStatus: string;
    employmentStatus: string;
    generation: string;
  }): Promise<AuthResponse> {
    await this.simulateDelay();

    // In production: POST /api/auth/register
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      fullName: data.fullName,
      gender: data.gender as User['gender'],
      maritalStatus: data.maritalStatus as User['maritalStatus'],
      employmentStatus: data.employmentStatus as User['employmentStatus'],
      generation: data.generation as User['generation'],
      createdAt: new Date().toISOString(),
      language: 'en',
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(this.SESSION_KEY, 'active');

    return { success: true, user };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    await this.simulateDelay();

    // In production: POST /api/auth/login
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const user: User = JSON.parse(stored);
      if (user.email === email) {
        localStorage.setItem(this.SESSION_KEY, 'active');
        return { success: true, user };
      }
    }

    return { success: false, message: 'Invalid credentials' };
  }

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    await this.simulateDelay();

    // In production: POST /api/auth/verify-otp
    // For demo, any 6-digit code works
    if (otp.length === 6) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const user: User = JSON.parse(stored);
        return { success: true, user };
      }
    }

    return { success: false, message: 'Invalid OTP' };
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    await this.simulateDelay();

    // In production: POST /api/auth/reset-password
    return { success: true, message: 'Reset link sent to email' };
  }

  async logout(): Promise<void> {
    // In production: POST /api/auth/logout
    localStorage.removeItem(this.SESSION_KEY);
  }

  async deleteAccount(): Promise<AuthResponse> {
    await this.simulateDelay();

    // In production: DELETE /api/auth/account (soft delete)
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    return { success: true, message: 'Account deleted' };
  }

  getCurrentUser(): User | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return null;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  updateUser(updates: Partial<User>): User | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.SESSION_KEY) === 'active';
  }
}

export const AuthService = new AuthServiceClass();
