import { useState } from 'react';
import { createAccount } from '../api/bankApi';

const INITIAL = {
  firstName: '', lastName: '', otherName: '',
  gender: '', address: '', stateOfOrigin: '',
  email: '', phoneNumber: '', alternativePhoneNumber: '',
};

export default function CreateAccount() {
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await createAccount(form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.responseMessage || 'Failed to create account. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Open an Account</h1>
        <p className="page__sub">Fill in your details to create a new bank account</p>
      </div>

      <div className="card form-card">
        {result ? (
          <div className="success-box">
            <div className="success-box__icon">✓</div>
            <h2 className="success-box__title">Account Created!</h2>
            <p className="success-box__code">{result.accountInfo?.accountNumber}</p>
            <p className="success-box__msg">{result.responseMessage}</p>
            <p className="success-box__name">{result.accountInfo?.accountName}</p>
            <p className="success-box__balance">Balance: ₹{result.accountInfo?.accountBalance}</p>
            <button className="btn-primary" onClick={() => { setResult(null); setForm(INITIAL); }}>
              Create Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {[
                { name: 'firstName', label: 'First Name', required: true },
                { name: 'lastName', label: 'Last Name', required: true },
                { name: 'otherName', label: 'Other Name' },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'phoneNumber', label: 'Phone Number', required: true },
                { name: 'alternativePhoneNumber', label: 'Alt. Phone Number' },
                { name: 'address', label: 'Address', required: true },
                { name: 'stateOfOrigin', label: 'State of Origin', required: true },
              ].map(({ name, label, type = 'text', required }) => (
                <div className="form-field" key={name}>
                  <label className="form-label">{label}{required && <span className="req">*</span>}</label>
                  <input
                    className="form-input"
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={required}
                    placeholder={label}
                  />
                </div>
              ))}
              <div className="form-field">
                <label className="form-label">Gender<span className="req">*</span></label>
                <select className="form-input" name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            {error && <div className="error-box">{error}</div>}
            <button className="btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
