import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/bankApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Users',        value: stats.totalUsers,          color: 'gold' },
    { label: 'Active Users',       value: stats.activeUsers,         color: 'green' },
    { label: 'Locked Accounts',    value: stats.lockedUsers,         color: 'red' },
    { label: 'Total Transactions', value: stats.totalTransactions,   color: 'blue' },
    { label: 'Total Deposits',     value: `₹${parseFloat(stats.totalDeposits).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,    color: 'green' },
    { label: 'Total Withdrawals',  value: `₹${parseFloat(stats.totalWithdrawals).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,  color: 'red' },
    { label: 'Total Balance',      value: `₹${parseFloat(stats.totalBalanceInSystem).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'gold' },
  ] : [];

  const actions = [
    { icon: '👥', title: 'Manage Users',         desc: 'View, block, delete users',     to: '/admin/users' },
    { icon: '📊', title: 'Transactions',          desc: 'Monitor all transactions',      to: '/admin/transactions' },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <div className="admin-badge">ADMIN</div>
        <h1 className="page__title">Admin Dashboard</h1>
        <p className="page__sub">System overview and management</p>
      </div>

      {loading ? (
        <div className="auth-loading"><div className="auth-loading__spinner" /></div>
      ) : (
        <div className="admin-stats-grid">
          {statCards.map(({ label, value, color }) => (
            <div className={`admin-stat-card admin-stat-card--${color}`} key={label}>
              <div className="admin-stat-card__label">{label}</div>
              <div className="admin-stat-card__value">{value}</div>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-heading" style={{ marginTop: '2.5rem' }}>Quick Actions</h2>
      <div className="dashboard-grid">
        {actions.map(({ icon, title, desc, to }) => (
          <Link to={to} key={title} className="feature-card">
            <div className="feature-card__icon">{icon}</div>
            <h3 className="feature-card__title">{title}</h3>
            <p className="feature-card__desc">{desc}</p>
            <span className="feature-card__arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}