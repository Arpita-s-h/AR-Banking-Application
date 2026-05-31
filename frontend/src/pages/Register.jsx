import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/bankApi';

const INITIAL = {
  firstName: '', lastName: '', otherName: '',
  gender: '', address: '', stateOfOrigin: '',
  email: '', password: '', confirmPassword: '',
  phoneNumber: '', alternativePhoneNumber: '',
};

export default function Register() {
  const [form, setForm] = useState(INITIAL);
  const [step, setStep] = useState(1); // 2-step form
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { confirmPassword, ...payload } = form;
      const res = await registerUser(payload);
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card--wide">
          <div className="success-box">
            <div className="success-box__icon">✓</div>
            <h2 className="success-box__title">Account Created!</h2>
            <p className="success-box__msg">Your account number is</p>
            <p className="success-box__code">{success.accountNumber}</p>
            <p className="success-box__name">{success.name}</p>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-card__brand">
          <div className="auth-card__logo">AR</div>
          <span className="auth-card__name">Bank</span>
        </div>

        <h1 className="auth-card__title">Open an Account</h1>
        <p className="auth-card__sub">Step {step} of 2 — {step === 1 ? 'Personal Info' : 'Account Details'}</p>

        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line" />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {step === 1 && (
          <form onSubmit={handleNext}>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">First Name <span className="req">*</span></label>
                <input className="form-input" name="firstName" value={form.firstName}
                  onChange={handleChange} placeholder="First name" required />
              </div>
              <div className="form-field">
                <label className="form-label">Last Name <span className="req">*</span></label>
                <input className="form-input" name="lastName" value={form.lastName}
                  onChange={handleChange} placeholder="Last name" required />
              </div>
              <div className="form-field">
                <label className="form-label">Email <span className="req">*</span></label>
                <input className="form-input" name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="Email address" required />
              </div>
              <div className="form-field">
                <label className="form-label">Phone <span className="req">*</span></label>
                <input className="form-input" name="phoneNumber" value={form.phoneNumber}
                  onChange={handleChange} placeholder="10-digit phone number" required />
              </div>
              <div className="form-field">
                <label className="form-label">Password <span className="req">*</span></label>
                <input className="form-input" name="password" type="password" value={form.password}
                  onChange={handleChange} placeholder="Create a password" required />
              </div>
              <div className="form-field">
                <label className="form-label">Confirm Password <span className="req">*</span></label>
                <input className="form-input" name="confirmPassword" type="password" value={form.confirmPassword}
                  onChange={handleChange} placeholder="Repeat password" required />
              </div>
            </div>
            {error && <div className="error-box">{error}</div>}
            <button className="btn-primary btn-full" type="submit">Next →</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Gender <span className="req">*</span></label>
                <select className="form-input" name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Other Name</label>
                <input className="form-input" name="otherName" value={form.otherName}
                  onChange={handleChange} placeholder="Middle name (optional)" />
              </div>
              <div className="form-field">
                <label className="form-label">Address <span className="req">*</span></label>
                <input className="form-input" name="address" value={form.address}
                  onChange={handleChange} placeholder="Residential address" required />
              </div>
              <div className="form-field">
                <label className="form-label">State <span className="req">*</span></label>
                <input className="form-input" name="stateOfOrigin" value={form.stateOfOrigin}
                  onChange={handleChange} placeholder="State of origin" required />
              </div>
              <div className="form-field">
                <label className="form-label">Alt. Phone</label>
                <input className="form-input" name="alternativePhoneNumber" value={form.alternativePhoneNumber}
                  onChange={handleChange} placeholder="Alternative phone (optional)" />
              </div>
            </div>
            {error && <div className="error-box">{error}</div>}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-outline" type="button" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}