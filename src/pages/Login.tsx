import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const MEMBERS = [
  { id: '1', name: '阿倫', emoji: '🐶' },
  { id: '2', name: '貝蒂', emoji: '🐱' },
  { id: '3', name: '查理', emoji: '🐻' },
  { id: '4', name: '黛安', emoji: '🐰' }
];

const CORRECT_PASSWORD = '20260301';

interface LoginProps {
  onLogin: (member: { name: string, emoji: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) {
      setError('請選擇你是哪位成員喔！');
      triggerShake();
      return;
    }

    if (password !== CORRECT_PASSWORD) {
      setError('密碼錯誤，請再試一次！');
      triggerShake();
      return;
    }

    const member = MEMBERS.find(m => m.id === selectedMember);
    if (member) {
      // 儲存登入狀態
      localStorage.setItem('shikoku_auth', JSON.stringify({
        isLoggedIn: true,
        member: { name: member.name, emoji: member.emoji }
      }));
      onLogin({ name: member.name, emoji: member.emoji });
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 裝飾背景 */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 rotate-12">🍋</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 -rotate-12">🌊</div>
      <div className="absolute top-40 right-20 text-4xl opacity-20 rotate-45">⛩️</div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-white relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#4A5D5D] mb-2">四國家族旅遊</h1>
          <p className="text-[#8D775F] font-bold text-sm">請輸入通關密語進入小冊子</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* 選擇成員 */}
          <div className="space-y-3">
            <label className="text-sm font-black text-[#6B8E8E] flex items-center gap-2">
              <User size={16} />
              你是哪位成員？
            </label>
            <div className="grid grid-cols-2 gap-3">
              {MEMBERS.map(member => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    setSelectedMember(member.id);
                    setError('');
                  }}
                  className={cn(
                    "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1",
                    selectedMember === member.id 
                      ? "border-[#F4D03F] bg-[#FFF59D]/30 shadow-soft" 
                      : "border-[#E0E5D5] bg-[#F7F4EB] hover:border-[#8FB7D3]"
                  )}
                >
                  <span className="text-2xl">{member.emoji}</span>
                  <span className="font-black text-[#4A5D5D] text-sm">{member.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 輸入密碼 */}
          <div className="space-y-3">
            <label className="text-sm font-black text-[#6B8E8E] flex items-center gap-2">
              <Lock size={16} />
              通關密碼
            </label>
            <input
              type="password"
              placeholder="請輸入密碼..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full bg-[#F7F4EB] p-4 rounded-2xl font-black text-xl text-center text-[#4A5D5D] focus:ring-2 ring-[#F4D03F] outline-none border-2 border-[#E0E5D5] tracking-widest"
            />
          </div>

          {/* 錯誤訊息 */}
          <div className="h-6 flex items-center justify-center">
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: isShaking ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ duration: 0.4 }}
                className="text-[#D97777] font-bold text-sm"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* 登入按鈕 */}
          <button
            type="submit"
            className="w-full bg-gradient-to-b from-[#FFF59D] to-[#F4D03F] text-[#8D775F] p-4 rounded-2xl font-black text-lg shadow-soft active:scale-95 transition-all border-2 border-[#D4AC0D] flex items-center justify-center gap-2"
          >
            進入小冊子
            <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
