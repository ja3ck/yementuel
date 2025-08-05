import { NextResponse } from 'next/server';
import { wordService } from '../../../../lib/wordService';

export async function GET() {
  try {
    const wordList = await wordService.getTodayWordList();
    
    return NextResponse.json({
      success: true,
      data: wordList,
    });
  } catch (error) {
    console.error('Failed to get word list:', error);
    return NextResponse.json({
      success: false,
      error: '단어 목록을 가져오는데 실패했습니다.',
    }, { status: 500 });
  }
}