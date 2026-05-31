import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BalanceEnquiry from './pages/BalanceEnquiry';
import CreditDebit from './pages/CreditDebit';
import Transfer from './pages/Transfer';
import BankStatement from './pages/BankStatement';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/"        element={<Home />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes — must be logged in */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/balance-enquiry" element={
              <ProtectedRoute><BalanceEnquiry /></ProtectedRoute>
            } />
            <Route path="/credit-debit" element={
              <ProtectedRoute><CreditDebit /></ProtectedRoute>
            } />
            <Route path="/transfer" element={
              <ProtectedRoute><Transfer /></ProtectedRoute>
            } />
            <Route path="/statement" element={
              <ProtectedRoute><BankStatement /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}