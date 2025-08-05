import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SimpleCaptchaProps {
  onValidate: (isValid: boolean) => void;
  onSubmit?: () => void;
}

const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ onValidate, onSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput('');
    setError('');
    drawCaptcha(text);
  }, []);

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.05})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw text
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw each character with slight rotation
    const charWidth = canvas.width / (text.length + 1);
    text.split('').forEach((char, i) => {
      ctx.save();
      const x = charWidth * (i + 1);
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    // Add some dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleSubmit = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      onValidate(true);
    } else {
      setError('캡차가 올바르지 않습니다');
      generateCaptcha();
    }
  };

  const handleExternalSubmit = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={200}
          height={60}
          className="border border-gray-300 rounded-lg"
        />
      </div>
      
      <button
        type="button"
        onClick={generateCaptcha}
        className="w-full text-sm text-gray-600 hover:text-gray-800"
      >
        다른 문자로 새로고침
      </button>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="위 문자를 입력하세요"
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

    </div>
  );
};

export default SimpleCaptcha;