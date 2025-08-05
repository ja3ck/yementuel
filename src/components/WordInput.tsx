import React, { useState } from 'react';

interface WordInputProps {
  onSubmit: (word: string) => void;
  isLoading?: boolean;
}

const WordInput: React.FC<WordInputProps> = ({ onSubmit, isLoading = false }) => {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (word.length < 2) {
      setError('2글자 이상의 단어를 입력해주세요');
      return;
    }

    const koreanRegex = /^[가-힣]+$/;
    if (!koreanRegex.test(word)) {
      setError('한글만 입력 가능합니다');
      return;
    }

    setError('');
    onSubmit(word);
    setWord('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="단어를 입력하세요"
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 transition-colors"
          autoFocus
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
          isLoading
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {isLoading ? '처리 중...' : '확인'}
      </button>
    </form>
  );
};

export default WordInput;