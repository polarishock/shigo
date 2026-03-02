/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Schedule from './pages/Schedule';
import Bookings from './pages/Bookings';
import Expense from './pages/Expense';
import Lists from './pages/Lists';
import Planning from './pages/Planning';
import Members from './pages/Members';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
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
