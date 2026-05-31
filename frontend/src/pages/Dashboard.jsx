import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const actions = [
  { icon: '💰', title: 'Balance Enquiry', desc: 'Check your account balance', to: '/balance-enquiry' },
  { icon: '💵', title: 'Deposit', desc: 'Add funds to your account', to: '/credit-debit' },
  { icon: '🏧', title: 'Withdraw', desc: 'Withdraw funds', to: '/credit-debit' },
  { icon: '↔️', title: 'Transfer', desc: 'Send money to another account', to: '/transfer' },
  { icon: '📄', title: 'Statement', desc: 'View transaction history', to: '/statement' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1 className="page__title">Good day, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p className="page__sub">Account No: <span className="mono">{user?.accountNumber}</span></p>
        </div>
        <button className="btn-outline" onClick={handleLogout}>Sign Out</button>
      </div>

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