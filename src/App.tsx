/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Schedule from './pages/Schedule';
import Bookings from './pages/Bookings';
import Expense from './pages/Expense';
import Journal from './pages/Journal';
import Planning from './pages/Planning';
import Members from './pages/Members';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Schedule />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="expense" element={<Expense />} />
          <Route path="journal" element={<Journal />} />
          <Route path="planning" element={<Planning />} />
          <Route path="members" element={<Members />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
