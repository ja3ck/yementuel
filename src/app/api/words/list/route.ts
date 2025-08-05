import { NextRequest, NextResponse } from 'next/server';
import { wordService } from '../../../../lib/wordService';
import { getSessionIdFromCookies } from '../../../../lib/session';

export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookies
    const cookieHeader = request.headers.get('cookie');
    const sessionId = getSessionIdFromCookies(cookieHeader || undefined);
    
    // Get word list filtered by session ID (if available)
    const wordList = await wordService.getTodayWordList(sessionId || undefined);
    
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