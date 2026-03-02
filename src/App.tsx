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
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: '#F7F4EB', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', zIndex: 9999, padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white', width: '100%', maxWidth: '320px',
          padding: '40px 20px', borderRadius: '30px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          textAlign: 'center', border: '1px solid #E5DCC5'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🗾</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#5A4B3B', marginBottom: '20px' }}>
            請輸入通行密碼
          </h2>
          
          <input 
            type="number" 
            pattern="\d*" 
            inputmode="numeric"
            placeholder="****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%', textAlign: 'center', fontSize: '24px', padding: '12px',
              backgroundColor: '#F7F4EB', borderRadius: '15px', border: 'none',
              outline: 'none', marginBottom: '20px', letterSpacing: '0.5em'
            }}
          />
          
          <button 
            onClick={handleUnlock}
            style={{
              width: '100%', backgroundColor: '#8FB7D3', color: 'white',
              fontWeight: 'bold', padding: '15px', borderRadius: '15px',
              border: 'none', cursor: 'pointer', fontSize: '16px'
            }}
          >
            開啟旅程
          </button>
          
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#8D775F', lineHeight: '1.6' }}>
            📜 記得我們的旅遊宣言：<br/>
            情緒穩定、解決優先、不說負面話！
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
