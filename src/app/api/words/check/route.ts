import { NextRequest, NextResponse } from 'next/server';
import { wordService } from '../../../../lib/wordService';

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();

    if (!word || typeof word !== 'string' || word.length < 2) {
      return NextResponse.json({
        success: false,
        error: '2글자 이상의 한글 단어를 입력해주세요.',
      }, { status: 400 });
    }

    const result = await wordService.checkWordSimilarity(word);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Failed to check word:', error);
    return NextResponse.json({
      success: false,
      error: '단어 확인에 실패했습니다.',
    }, { status: 500 });
  }
}