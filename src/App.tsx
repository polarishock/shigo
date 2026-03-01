/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
        if (parsed.isLoggedIn) {
          setIsAuthenticated(true);
          setCurrentUser(parsed.member);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
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
    return <div className="min-h-screen bg-[#F7F4EB] flex items-center justify-center">...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 如果未登入，顯示登入頁面 */}
        {!isAuthenticated ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          /* 如果已登入，顯示主要內容 */
          <Route path="/" element={<Layout />}>
            <Route index element={<Schedule />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="expense" element={<Expense />} />
            <Route path="lists" element={<Lists />} />
            <Route path="planning" element={<Planning />} />
            <Route path="members" element={<Members />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}
