import { nlpService } from './nlp';
import { queries } from './database';

export interface WordCheckResult {
  word: string;
  similarity: number;
  isCorrect: boolean;
  rank?: number;
}

export interface WordListItem {
  word: string;
  similarity: number;
  timestamp: Date;
}

class WordService {
  async checkWordSimilarity(word: string): Promise<WordCheckResult> {
    const today = new Date().toISOString().split('T')[0];
    const dailyWord = queries.getDailyWord(today);
    
    if (!dailyWord) {
      throw new Error('오늘의 단어가 설정되지 않았습니다');
    }

    const currentAnswer = dailyWord.word;
    
    // Get similarity from NLP service
    const similarity = await nlpService.calculateSimilarity(word, currentAnswer);
    
    const isCorrect = word === currentAnswer;
    
    // Save attempt to database
    queries.addWordAttempt(word, similarity, today);
    
    // Get updated list and find rank
    const attempts = queries.getTodayAttempts(today);
    const rank = attempts.findIndex(item => item.word === word) + 1;
    
    return {
      word,
      similarity,
      isCorrect,
      rank,
    };
  }

  async getTodayWordList(): Promise<WordListItem[]> {
    const today = new Date().toISOString().split('T')[0];
    const attempts = queries.getTodayAttempts(today);
    
    return attempts.map(item => ({
      word: item.word,
      similarity: item.similarity,
      timestamp: new Date(item.timestamp),
    }));
  }

  getAnswer(): string {
    const today = new Date().toISOString().split('T')[0];
    const dailyWord = queries.getDailyWord(today);
    return dailyWord?.word || '';
  }
}

export const wordService = new WordService();