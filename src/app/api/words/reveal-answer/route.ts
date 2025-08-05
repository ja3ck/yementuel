import { NextResponse } from 'next/server';
import { wordService } from '../../../../lib/wordService';

export async function POST() {
  try {
    // In a real app, you might want to verify the captcha here
    // For now, we'll just return the answer
    const answer = wordService.getAnswer();
    
    return NextResponse.json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    console.error('Failed to reveal answer:', error);
    return NextResponse.json({
      success: false,
      error: '정답을 가져오는데 실패했습니다.',
    }, { status: 500 });
  }
}