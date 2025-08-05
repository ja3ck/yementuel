import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data/yementuel.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db: Database.Database = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export const initDatabase = () => {
  // Daily words table
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      date TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Word attempts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS word_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      similarity REAL NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin user if not exists
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (adminExists.count === 0) {
    // Password: 'admin123' (hashed)
    db.prepare(`
      INSERT INTO admin_users (email, password_hash)
      VALUES (?, ?)
    `).run('admin@yementuel.com', '$2b$10$6jeoxsyHV.xSoOa8hImBN.mnAHyygZ8k0r98J1ICL4e3/1aFVcKoS');
  }

  // Insert default word for today if not exists
  const today = new Date().toISOString().split('T')[0];
  const todayWord = db.prepare('SELECT word FROM daily_words WHERE date = ?').get(today) as { word: string } | undefined;
  if (!todayWord) {
    db.prepare('INSERT INTO daily_words (word, date) VALUES (?, ?)').run('사과', today);
  }
};

// Database queries
export const queries = {
  // Daily words
  getDailyWord: (date: string) => {
    return db.prepare('SELECT word FROM daily_words WHERE date = ?').get(date) as { word: string } | undefined;
  },

  setDailyWord: (word: string, date: string) => {
    return db.prepare(`
      INSERT INTO daily_words (word, date) 
      VALUES (?, ?)
      ON CONFLICT(date) DO UPDATE SET word = excluded.word
    `).run(word, date);
  },

  getAllDailyWords: () => {
    return db.prepare(`
      SELECT id, word, date, created_at
      FROM daily_words
      ORDER BY date DESC
    `).all() as Array<{ id: number; word: string; date: string; created_at: string }>;
  },

  // Word attempts
  addWordAttempt: (word: string, similarity: number, date: string) => {
    return db.prepare(`
      INSERT INTO word_attempts (word, similarity, date)
      VALUES (?, ?, ?)
    `).run(word, similarity, date);
  },

  getTodayAttempts: (date: string) => {
    return db.prepare(`
      SELECT word, similarity, created_at as timestamp
      FROM word_attempts
      WHERE date = ?
      ORDER BY similarity DESC
    `).all(date) as Array<{ word: string; similarity: number; timestamp: string }>;
  },

  // Admin
  getAdminUser: (email: string) => {
    return db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email) as {
      id: number;
      email: string;
      password_hash: string;
    } | undefined;
  },
};

// Initialize database on module load
initDatabase();

export { db };