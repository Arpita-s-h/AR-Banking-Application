import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api/bankApi';

const actions = [
  { icon: '💰', title: 'Balance Enquiry',    desc: 'Check your account balance',    to: '/balance-enquiry' },
  { icon: '💵', title: 'Deposit',             desc: 'Add funds to your account',     to: '/credit-debit' },
  { icon: '🏧', title: 'Withdraw',            desc: 'Withdraw funds',                to: '/credit-debit' },
  { icon: '↔️', title: 'Fund Transfer',       desc: 'Send money to another account', to: '/transfer' },
  { icon: '📋', title: 'Transaction History', desc: 'View all your transactions',    to: '/history' },
  { icon: '📄', title: 'Bank Statement',      desc: 'Download PDF statement',        to: '/statement' },
  { icon: '👤', title: 'My Profile',          desc: 'View your account details',     to: '/profile' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    getProfile()
      .then(res => setBalance(res.data.accountBalance))
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      {/* Welcome banner */}
      <div className="dash-banner card">
        <div className="dash-banner__left">
          <div className="dash-banner__greeting">Welcome back</div>
          <div className="dash-banner__name">{user?.fullName}</div>
          <div className="dash-banner__acc mono">{user?.accountNumber}</div>
        </div>
        <div className="dash-banner__right">
          <div className="dash-banner__bal-label">Available Balance</div>
          <div className="dash-banner__bal">
            {balance !== null
              ? `₹${parseFloat(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
              : '—'}
          </div>
        </div>
      </div>

      {/* Actions grid */}
      <h2 className="section-heading">What would you like to do?</h2>
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