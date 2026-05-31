import { useState } from 'react';
import { transferFunds } from '../api/bankApi';

export default function Transfer() {
  const [form, setForm] = useState({ sourceAccountNumber: '', destinationAccountNumber: '', amount: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await transferFunds({
        sourceAccountNumber: form.sourceAccountNumber,
        destinationAccountNumber: form.destinationAccountNumber,
        amount: parseFloat(form.amount),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.responseMessage || 'Transfer failed. Please check account numbers and balance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Fund Transfer</h1>
        <p className="page__sub">Transfer money between accounts instantly</p>
      </div>

      <div className="card form-card form-card--narrow">
        <form onSubmit={handleSubmit}>
          <div className="transfer-flow">
            <div className="form-field">
              <label className="form-label">From Account</label>
              <input
                className="form-input"
                type="text"
                value={form.sourceAccountNumber}
                onChange={(e) => setForm({ ...form, sourceAccountNumber: e.target.value })}
                placeholder="Source account number"
                required
              />
            </div>
            <div className="transfer-arrow">↓</div>
            <div className="form-field">
              <label className="form-label">To Account</label>
              <input
                className="form-input"
                type="text"
                value={form.destinationAccountNumber}
                onChange={(e) => setForm({ ...form, destinationAccountNumber: e.target.value })}
                placeholder="Destination account number"
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input form-input--amount"
              type="number"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          {error && <div className="error-box">{error}</div>}
          <button className="btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Transferring…' : 'Transfer Funds'}
          </button>
        </form>

        {result && (
          <div className="result-card result-card--success">
            <div className="result-card__check">✓</div>
            <div className="result-card__value">{result.responseMessage}</div>
          </div>
        )}
      </div>
    </div>
  );
}