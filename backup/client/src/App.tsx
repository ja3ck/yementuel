import React, { useState, useEffect } from 'react';
import ky from 'ky';
import WordInput from './components/WordInput';
import WordList from './components/WordList';
import GiveUpButton from './components/GiveUpButton';
import Header from './components/Header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface WordResult {
  word: string;
  similarity: number;
  isCorrect: boolean;
  rank?: number;
}

interface WordListItem {
  word: string;
  similarity: number;
  timestamp: Date;
}

function App() {
  const [wordList, setWordList] = useState<WordListItem[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWordList();
  }, []);

  const fetchWordList = async () => {
    try {
      const response = await ky.get(`${API_URL}/words/list`).json<{success: boolean, data: WordListItem[]}>();
      setWordList(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch word list:', error);
      setError('단어 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleWordSubmit = async (word: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ky.post(`${API_URL}/words/check`, { json: { word } }).json<{success: boolean, data: WordResult}>();
      const result: WordResult = response.data;
      
      if (result.isCorrect) {
        setIsCorrect(true);
        setCurrentAnswer(word);
      }
      
      await fetchWordList();
    } catch (error) {
      console.error('Failed to check word:', error);
      setError('단어 확인에 실패했습니다. 서버 연결을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGiveUp = (answer: string) => {
    setCurrentAnswer(answer);
    setIsCorrect(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}
        
        {!isCorrect ? (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                오늘의 단어를 맞춰보세요!
              </h2>
              <WordInput onSubmit={handleWordSubmit} isLoading={isLoading} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                시도한 단어들
              </h3>
              <WordList words={wordList} />
            </div>

            <div className="text-center">
              <GiveUpButton onGiveUp={handleGiveUp} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-4xl font-bold text-green-600 mb-4">
              정답입니다! 🎉
            </h2>
            <p className="text-2xl text-gray-800 mb-8">
              오늘의 단어: <span className="font-bold text-orange-600">{currentAnswer}</span>
            </p>
            <p className="text-gray-600">
              내일 다시 도전해보세요!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;