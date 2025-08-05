import { NextRequest, NextResponse } from 'next/server';
import { wordService } from '../../../../lib/wordService';
import { getSessionIdFromCookies, generateSessionId, formatSetCookieHeader } from '../../../../lib/session';

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();

    if (!word || typeof word !== 'string' || word.length < 2) {
      return NextResponse.json({
        success: false,
        error: '2글자 이상의 한글 단어를 입력해주세요.',
      }, { status: 400 });
    }

    // Get or create session ID
    const cookieHeader = request.headers.get('cookie');
    let sessionId = getSessionIdFromCookies(cookieHeader || undefined);
    let shouldSetCookie = false;

    if (!sessionId) {
      sessionId = generateSessionId();
      shouldSetCookie = true;
    }

    const result = await wordService.checkWordSimilarity(word, sessionId);
    
    const response = NextResponse.json({
      success: true,
      data: result,
    });

    // Set session cookie if new session
    if (shouldSetCookie) {
      response.headers.set('Set-Cookie', formatSetCookieHeader(sessionId));
    }

    return response;
  } catch (error) {
    console.error('Failed to check word:', error);
    return NextResponse.json({
      success: false,
      error: '단어 확인에 실패했습니다.',
    }, { status: 500 });
  }
}