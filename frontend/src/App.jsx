import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import BookDetails from './pages/BookDetails';
import MemberDetails from './pages/MemberDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:id" element={<BookDetails />} />
          <Route path="members" element={<Members />} />
          <Route path="members/:id" element={<MemberDetails />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
