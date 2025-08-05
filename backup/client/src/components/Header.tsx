import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center text-orange-600">
          예맨틀
        </h1>
        <p className="text-center text-gray-600 mt-2">
          단어의 유사도로 정답을 찾아보세요
        </p>
      </div>
    </header>
  );
};

export default Header;