import { NextRequest, NextResponse } from 'next/server';
import { adminService } from '../../../../lib/adminService';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: '사용자명과 비밀번호를 입력해주세요.',
      }, { status: 400 });
    }

    const result = await adminService.login(username, password);
    
    if (!result) {
      return NextResponse.json({
        success: false,
        error: '인증에 실패했습니다.',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({
      success: false,
      error: '로그인에 실패했습니다.',
    }, { status: 500 });
  }
}