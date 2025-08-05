import React from 'react';

interface WordListItem {
  word: string;
  similarity: number;
  timestamp: Date;
}

interface WordListProps {
  words: WordListItem[];
}

const WordList: React.FC<WordListProps> = ({ words }) => {
  if (words.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        아직 시도한 단어가 없습니다
      </div>
    );
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'bg-green-100 text-green-800';
    if (similarity >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (similarity >= 0.4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getSimilarityWidth = (similarity: number) => {
    return `${similarity * 100}%`;
  };

  return (
    <div className="space-y-3">
      {words.map((item, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-800">
              {index + 1}. {item.word}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSimilarityColor(item.similarity)}`}>
              {(item.similarity * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
              style={{ width: getSimilarityWidth(item.similarity) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default WordList;