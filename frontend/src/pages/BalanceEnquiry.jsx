import { useState } from 'react';
import { balanceEnquiry, nameEnquiry } from '../api/bankApi';

export default function BalanceEnquiry() {
  const [accountNumber, setAccountNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const [balRes, nameRes] = await Promise.all([
        balanceEnquiry(accountNumber),
        nameEnquiry(accountNumber),
      ]);
      setResult({ ...balRes.data, accountName: nameRes.data });
    } catch (err) {
      setError(err.response?.data?.responseMessage || 'Account not found or backend unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Balance Enquiry</h1>
        <p className="page__sub">Enter your account number to check your balance</p>
      </div>

      <div className="card form-card form-card--narrow">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Account Number</label>
            <input
              className="form-input"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter 10-digit account number"
              required
            />
          </div>
          {error && <div className="error-box">{error}</div>}
          <button className="btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Checking…' : 'Check Balance'}
          </button>
        </form>

        {result && (
          <div className="result-card">
            <div className="result-card__label">Account Name</div>
            <div className="result-card__value">{result.accountName || result.accountInfo?.accountName}</div>
            <div className="result-card__label">Account Number</div>
            <div className="result-card__value mono">{result.accountInfo?.accountNumber || accountNumber}</div>
            <div className="result-card__divider" />
            <div className="result-card__label">Available Balance</div>
            <div className="result-card__balance">
              ₹{parseFloat(result.accountInfo?.accountBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
