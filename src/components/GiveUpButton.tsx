import React, { useState } from 'react';
import SimpleCaptcha from './SimpleCaptcha';

interface GiveUpButtonProps {
  onGiveUp: (answer: string) => void;
}

const GiveUpButton: React.FC<GiveUpButtonProps> = ({ onGiveUp }) => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [captchaText, setCaptchaText] = useState('');

  const handleCaptchaValidate = async (isValid: boolean) => {
    if (isValid) {
      try {
        const response = await fetch('/api/words/reveal-answer', {
          method: 'POST',
        });
        const data = await response.json();
        
        if (data.success) {
          onGiveUp(data.data.answer);
        } else {
          console.error('Failed to get answer from API');
        }
      } catch (error) {
        console.error('Failed to get answer:', error);
      }
    }
  };

  const handleGiveUpSubmit = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      handleCaptchaValidate(true);
    } else {
      // 캡차가 틀렸을 때는 SimpleCaptcha 컴포넌트에서 처리
    }
  };

  if (!showCaptcha) {
    return (
      <button
        onClick={() => setShowCaptcha(true)}
        className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        포기하기
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        정말 포기하시겠습니까?
      </h3>
      <p className="text-gray-600 mb-6 text-center">
        아래 캡차를 입력하면 정답을 확인할 수 있습니다
      </p>
      
      <SimpleCaptcha onValidate={handleCaptchaValidate} />
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowCaptcha(false)}
          className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          취소
        </button>
        <button
          onClick={() => {
            const input = document.querySelector('input[placeholder="위 문자를 입력하세요"]') as HTMLInputElement;
            if (input?.value) {
              input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));
            }
          }}
          className="flex-1 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          포기하기
        </button>
      </div>
    </div>
  );
};

export default GiveUpButton;