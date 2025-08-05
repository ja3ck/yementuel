import { Request, Response, NextFunction } from 'express';
import { wordService } from '../services/wordService';

export const checkWord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { word } = req.body;

    if (!word || typeof word !== 'string' || word.length < 2) {
      return res.status(400).json({
        success: false,
        error: '2글자 이상의 한글 단어를 입력해주세요.',
      });
    }

    const result = await wordService.checkWordSimilarity(word);
    
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getWordList = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const wordList = await wordService.getTodayWordList();
    
    return res.json({
      success: true,
      data: wordList,
    });
  } catch (error) {
    return next(error);
  }
};

export const revealAnswer = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real app, you might want to verify the captcha here
    // For now, we'll just return the answer
    const answer = wordService.getAnswer();
    
    return res.json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    return next(error);
  }
};