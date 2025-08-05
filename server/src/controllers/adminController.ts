import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/adminService';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '사용자명과 비밀번호를 입력해주세요.',
      });
    }

    const result = await adminService.login(username, password);
    
    if (!result) {
      return res.status(401).json({
        success: false,
        error: '인증에 실패했습니다.',
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDailyWord = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const dailyWord = await adminService.getDailyWord();
    
    return res.json({
      success: true,
      data: dailyWord,
    });
  } catch (error) {
    return next(error);
  }
};

export const setDailyWord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { word } = req.body;

    if (!word || typeof word !== 'string' || word.length < 2) {
      return res.status(400).json({
        success: false,
        error: '2글자 이상의 한글 단어를 입력해주세요.',
      });
    }

    const result = await adminService.setDailyWord(word);
    
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};