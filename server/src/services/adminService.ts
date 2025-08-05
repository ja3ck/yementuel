import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { queries } from './database';

interface LoginResult {
  token: string;
  username: string;
}

class AdminService {
  async login(username: string, password: string): Promise<LoginResult | null> {
    const adminUser = queries.getAdminUser(username);
    
    if (!adminUser) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
    
    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      { id: adminUser.id, username: adminUser.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return {
      token,
      username: adminUser.username,
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
}

export const adminService = new AdminService();