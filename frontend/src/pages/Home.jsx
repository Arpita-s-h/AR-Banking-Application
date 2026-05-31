import { Link } from 'react-router-dom';

const features = [
  { icon: '🏦', title: 'Open Account', desc: 'Create your bank account in seconds', to: '/create-account' },
  { icon: '💰', title: 'Check Balance', desc: 'Instant balance enquiry anytime', to: '/balance-enquiry' },
  { icon: '↔️', title: 'Fund Transfer', desc: 'Send money securely between accounts', to: '/transfer' },
  { icon: '📄', title: 'Bank Statement', desc: 'Download or view your transactions', to: '/statement' },
];

export default function Home() {
  return (
    <div className="page-home">
      <div className="hero">
        <div className="hero__badge">Secure · Fast · Reliable</div>
        <h1 className="hero__title">
          Banking<br />
          <span className="hero__accent">Reimagined.</span>
        </h1>
        <p className="hero__sub">
          Your complete banking solution — manage accounts, transfer funds,<br />
          and track every transaction with confidence.
        </p>
        <div className="hero__cta">
          <Link to="/create-account" className="btn-primary">Open an Account</Link>
          <Link to="/balance-enquiry" className="btn-outline">Check Balance</Link>
        </div>
      </div>

      <div className="features">
        <h2 className="features__heading">Everything you need</h2>
        <div className="features__grid">
          {features.map(({ icon, title, desc, to }) => (
            <Link to={to} key={title} className="feature-card">
              <div className="feature-card__icon">{icon}</div>
              <h3 className="feature-card__title">{title}</h3>
              <p className="feature-card__desc">{desc}</p>
              <span className="feature-card__arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}