import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { queries } from './database';

export interface LoginResult {
  token: string;
  email: string;
}

class AdminService {
  async login(email: string, password: string): Promise<LoginResult | null> {
    const adminUser = queries.getAdminUser(email);
    
    if (!adminUser) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
    
    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      { id: adminUser.id, email: adminUser.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return {
      token,
      email: adminUser.email,
    };
  }

  async getDailyWord(): Promise<{ word: string; date: string }> {
    const today = new Date().toISOString().split('T')[0];
    const dailyWord = queries.getDailyWord(today);
    
    return {
      word: dailyWord?.word || '',
      date: today,
    };
  }

  async setDailyWord(word: string): Promise<{ success: boolean; word: string }> {
    const today = new Date().toISOString().split('T')[0];
    queries.setDailyWord(word, today);
    
    return {
      success: true,
      word,
    };
  }

  async getAllDailyWords(): Promise<Array<{ id: number; word: string; date: string; isActive: boolean }>> {
    const today = new Date().toISOString().split('T')[0];
    const words = queries.getAllDailyWords();
    
    return words.map(word => ({
      ...word,
      isActive: word.date === today
    }));
  }

  async addDailyWord(word: string, date: string): Promise<{ success: boolean; word: string; date: string }> {
    queries.setDailyWord(word, date);
    
    return {
      success: true,
      word,
      date,
    };
  }
}

export const adminService = new AdminService();