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

              {/* Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/balance-enquiry" element={<ProtectedRoute><BalanceEnquiry /></ProtectedRoute>} />
              <Route path="/credit-debit"    element={<ProtectedRoute><CreditDebit /></ProtectedRoute>} />
              <Route path="/transfer"        element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
              <Route path="/history"         element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
              <Route path="/statement"       element={<ProtectedRoute><BankStatement /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}