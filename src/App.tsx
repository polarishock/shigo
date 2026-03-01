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
import Login from './pages/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string, emoji: string } | null>(null);

  useEffect(() => {
    // 檢查本地是否已經登入過
    const authData = localStorage.getItem('shikoku_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.isLoggedIn) {
          setIsAuthenticated(true);
          setCurrentUser(parsed.member);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error('Auth check error:', e);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (member: { name: string, emoji: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(member);
  };

  // 避免畫面閃爍，等待狀態確認
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F7F4EB] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#8FB7D3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#8D775F] font-bold animate-pulse">載入中...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* 登入路由 */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />

        {/* 受保護的主程式路由 */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Schedule />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="expense" element={<Expense />} />
          <Route path="lists" element={<Lists />} />
          <Route path="planning" element={<Planning />} />
          <Route path="members" element={<Members />} />
        </Route>

        {/* 萬用路由：未匹配時導向首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
