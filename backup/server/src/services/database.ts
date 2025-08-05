import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(__dirname, '../../data/yementuel.db');
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
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin user if not exists
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (adminExists.count === 0) {
    // Password: 'admin123' (hashed)
    db.prepare(`
      INSERT INTO admin_users (username, password_hash)
      VALUES (?, ?)
    `).run('admin', '$2b$10$xGxN1rSVqCzFJ7fDgE0b8OQ8M9NXm2JEYtQGJxZK2xqK.xvF0oJZe');
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
  getAdminUser: (username: string) => {
    return db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as {
      id: number;
      username: string;
      password_hash: string;
    } | undefined;
  },
};

// Initialize database on module load
initDatabase();

export { db };