/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Input } from './pages/Input';
import { Dashboard } from './pages/Dashboard';
import { Suggestions } from './pages/Suggestions';
import { CoverLetter } from './pages/CoverLetter';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/input" element={<Input />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/suggestions" element={<Suggestions />} />
                <Route path="/cover-letter" element={<CoverLetter />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
