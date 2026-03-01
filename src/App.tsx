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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string, emoji: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // 檢查本地是否已經登入過
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

  const handleLogin = (member: { name: string, emoji: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(member);
  };

  const handleLogout = () => {
    localStorage.removeItem('shikoku_auth');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (isCheckingAuth) {
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

        {/* 萬用路由：未匹配時導向首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
