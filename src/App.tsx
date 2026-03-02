/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Schedule from './pages/Schedule';
import Bookings from './pages/Bookings';
import Expense from './pages/Expense';
import Lists from './pages/Lists';
import Planning from './pages/Planning';
import Members from './pages/Members';

export default function App() {
  // --- 狀態設定 ---
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false); // 密碼鎖
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // 成員登入
  const [currentUser, setCurrentUser] = useState<{ name: string, emoji: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const CORRECT_PASSWORD = "1234"; // 👈 在這裡修改你的數字密碼

  useEffect(() => {
    // 1. 檢查密碼解鎖狀態 (用 sessionStorage，關閉分頁才需要重打)
    if (sessionStorage.getItem('shikoku_unlocked') === 'true') {
      setIsUnlocked(true);
    }

    // 2. 檢查原本的成員登入狀態
    const authData = localStorage.getItem('shikoku_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.isLoggedIn) {
          setIsAuthenticated(true);
          setCurrentUser(parsed.member);
        }
      } catch (e) {
        console.error('Auth check error:', e);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // --- 處理函式 ---
  const handleUnlock = () => {
    if (password === CORRECT_PASSWORD) {
      setIsUnlocked(true);
      sessionStorage.setItem('shikoku_unlocked', 'true');
    } else {
      alert("密碼不正確喔！再試一次。");
      setPassword('');
    }
  };

  const handleLogin = (member: { name: string, emoji: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(member);
  };

  const handleLogout = () => {
    localStorage.removeItem('shikoku_auth');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // 載入中畫面
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F7F4EB] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#8FB7D3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#8D775F] font-bold animate-pulse">載入中...</p>
      </div>
    );
  }

  // --- 第一層：密碼鎖定畫面 ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#F7F4EB] flex flex-col items-center justify-center p-6 text-[#8D775F]">
        <div className="bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl border border-[#E5DCC5] space-y-6">
          <div className="text-center">
            <span className="text-5xl">🗾</span>
            <h1 className="text-2xl font-black mt-4 text-[#5A4B3B]">2026 四國之旅</h1>
            <p className="text-sm opacity-70 mt-1 text-[#8D775F]">Family Travel Guide</p>
          </div>

          {/* 旅遊宣言預覽 */}
          <div className="bg-[#FAF9F6] p-4 rounded-2xl text-xs space-y-2 border border-[#F1EEE5] italic">
            <p className="font-bold text-center mb-1 not-italic">📜 旅遊和平小提醒</p>
            <p>• 行程彈性，開心出門愉快回家</p>
            <p>• 遇狀況先解決問題，不責怪彼此</p>
            <p>• 禁說：難吃、有啥好看、好貴</p>
          </div>

          <div className="space-y-4">
            <input 
              type="number" 
              pattern="\d*" 
              inputmode="numeric"
              placeholder="請輸入通行密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-center text-2xl p-4 bg-[#F7F4EB] rounded-2xl outline-none border-2 border-transparent focus:border-[#8FB7D3] transition-all font-mono tracking-widest"
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
            <button 
              onClick={handleUnlock}
              className="w-full bg-[#8FB7D3] hover:bg-[#7AA6C3] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-lg"
            >
              開啟旅程
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 第二層：主路由系統 ---
  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Layout isAuthenticated={isAuthenticated} />}
        >
          <Route 
            index 
            element={isAuthenticated ? <Schedule /> : <Navigate to="/members" replace />} 
          />
          <Route 
            path="bookings" 
            element={isAuthenticated ? <Bookings /> : <Navigate to="/members" replace />} 
          />
          <Route 
            path="expense" 
            element={isAuthenticated ? <Expense /> : <Navigate to="/members" replace />} 
          />
          <Route 
            path="lists" 
            element={isAuthenticated ? <Lists /> : <Navigate to="/members" replace />} 
          />
          <Route 
            path="planning" 
            element={isAuthenticated ? <Planning /> : <Navigate to="/members" replace />} 
          />
          <Route 
            path="members" 
            element={<Members isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />} 
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
