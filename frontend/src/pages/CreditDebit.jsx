import { useState } from 'react';
import { creditAccount, debitAccount } from '../api/bankApi';

export default function CreditDebit() {
  const [mode, setMode] = useState('credit');
  const [form, setForm] = useState({ accountNumber: '', amount: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const fn = mode === 'credit' ? creditAccount : debitAccount;
      const res = await fn({ accountNumber: form.accountNumber, amount: parseFloat(form.amount) });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.responseMessage || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Deposit / Withdraw</h1>
        <p className="page__sub">Add or withdraw funds from an account</p>
      </div>

      <div className="card form-card form-card--narrow">
        <div className="tab-toggle">
          <button
            className={`tab-btn ${mode === 'credit' ? 'active' : ''}`}
            onClick={() => { setMode('credit'); setResult(null); setError(''); }}
            type="button"
          >
            💵 Deposit
          </button>
          <button
            className={`tab-btn ${mode === 'debit' ? 'active' : ''}`}
            onClick={() => { setMode('debit'); setResult(null); setError(''); }}
            type="button"
          >
            🏧 Withdraw
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Account Number</label>
            <input
              className="form-input"
              type="text"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              placeholder="Enter account number"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Enter amount"
              required
            />
          </div>
          {error && <div className="error-box">{error}</div>}
          <button className={`btn-full ${mode === 'credit' ? 'btn-primary' : 'btn-danger'}`} type="submit" disabled={loading}>
            {loading ? 'Processing…' : mode === 'credit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </button>
        </form>

        {result && (
          <div className="result-card result-card--success">
            <div className="result-card__check">✓</div>
            <div className="result-card__value">{result.responseMessage}</div>
            {result.accountInfo && (
              <>
                <div className="result-card__label">New Balance</div>
                <div className="result-card__balance">
                  ₹{parseFloat(result.accountInfo.accountBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}