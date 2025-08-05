import { NextRequest, NextResponse } from 'next/server';
import { adminService } from '../../../../lib/adminService';
import jwt from 'jsonwebtoken';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    throw new Error('인증 토큰이 필요합니다.');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('인증 토큰이 필요합니다.');
  }

  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
}

export async function GET(request: NextRequest) {
  try {
    verifyToken(request);
    
    const dailyWord = await adminService.getDailyWord();
    
    return NextResponse.json({
      success: true,
      data: dailyWord,
    });
  } catch (error) {
    console.error('Get daily word failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '일일 단어를 가져오는데 실패했습니다.',
    }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    verifyToken(request);
    
    const { word } = await request.json();

    if (!word || typeof word !== 'string' || word.length < 2) {
      return NextResponse.json({
        success: false,
        error: '2글자 이상의 한글 단어를 입력해주세요.',
      }, { status: 400 });
    }

    const result = await adminService.setDailyWord(word);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Set daily word failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '일일 단어 설정에 실패했습니다.',
    }, { status: 401 });
  }
}