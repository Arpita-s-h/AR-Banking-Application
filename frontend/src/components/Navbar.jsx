import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const authedLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/balance-enquiry', label: 'Balance' },
    { to: '/credit-debit', label: 'Deposit/Withdraw' },
    { to: '/transfer', label: 'Transfer' },
    { to: '/history', label: 'History' },
    { to: '/statement', label: 'Statement' },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="ar-nav">
      <Link to={isAuthenticated() ? '/dashboard' : '/'} className="ar-nav__brand">
        <span className="ar-nav__logo">AR</span>
        <span className="ar-nav__name">Bank</span>
      </Link>

      <div className="ar-nav__links">
        {isAuthenticated() ? (
          <>
            {authedLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`ar-nav__link ${pathname === to ? 'active' : ''}`}>
                {label}
              </Link>
            ))}
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/profile" className="ar-nav__user" title="My Profile">
              {user?.fullName?.split(' ')[0]}
            </Link>
            <button className="ar-nav__logout" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/login" className="ar-nav__link">Sign In</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>
              Open Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}