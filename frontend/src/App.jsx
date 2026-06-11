import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BalanceEnquiry from './pages/BalanceEnquiry';
import CreditDebit from './pages/CreditDebit';
import Transfer from './pages/Transfer';
import TransactionHistory from './pages/TransactionHistory';
import BankStatement from './pages/BankStatement';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public */}
              <Route path="/"         element={<Home />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Protected */}
              <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/balance-enquiry" element={<ProtectedRoute><BalanceEnquiry /></ProtectedRoute>} />
              <Route path="/credit-debit"    element={<ProtectedRoute><CreditDebit /></ProtectedRoute>} />
              <Route path="/transfer"        element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
              <Route path="/history"         element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
              <Route path="/statement"       element={<ProtectedRoute><BankStatement /></ProtectedRoute>} />

              {/* Admin Protected */}
              <Route path="/admin"              element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users"        element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/transactions" element={<ProtectedRoute adminOnly><AdminTransactions /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}