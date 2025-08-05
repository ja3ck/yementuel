'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DailyWord {
  id: number;
  word: string;
  date: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const [dailyWords, setDailyWords] = useState<DailyWord[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchDailyWords();
  }, [router]);

  const fetchDailyWords = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/daily-word', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setDailyWords(Array.isArray(data.data) ? data.data : []);
      } else {
        setError('단어 목록을 불러오는데 실패했습니다.');
        setDailyWords([]);
      }
    } catch (error) {
      console.error('Failed to fetch daily words:', error);
      setError('단어 목록을 불러오는데 실패했습니다.');
      setDailyWords([]);
    }
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/daily-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          word: newWord.trim(), 
          date: newDate 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('단어가 성공적으로 추가되었습니다.');
        setNewWord('');
        setNewDate('');
        fetchDailyWords();
      } else {
        setError(data.error || '단어 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to add word:', error);
      setError('단어 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">예맨틀 관리자 대시보드</h1>
              <p className="text-gray-600 text-sm">일일 단어 관리</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                게임으로 이동
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(error || success) && (
          <div className={`rounded-lg p-4 mb-6 ${error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-center ${error ? 'text-red-800' : 'text-green-800'}`}>
              {error || success}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 새 단어 추가 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">새 단어 추가</h2>
            
            <form onSubmit={handleAddWord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  단어
                </label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="오늘의 단어를 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  날짜
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 transition-colors"
                  min={getTodayDate()}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '추가 중...' : '단어 추가'}
              </button>
            </form>
          </div>

          {/* 단어 목록 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">등록된 단어 목록</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dailyWords.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  등록된 단어가 없습니다
                </div>
              ) : (
                dailyWords.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.word}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.isActive ? '활성' : '대기'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {dailyWords.length}
              </div>
              <div className="text-gray-600">총 등록된 단어</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {dailyWords.filter(w => w.isActive).length}
              </div>
              <div className="text-gray-600">활성 단어</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {dailyWords.filter(w => !w.isActive).length}
              </div>
              <div className="text-gray-600">대기 중인 단어</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}