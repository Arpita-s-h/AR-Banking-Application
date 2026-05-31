import { useState } from 'react';
import { getBankStatement } from '../api/bankApi';

export default function BankStatement() {
  const today = new Date().toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString().split('T')[0];

  const [form, setForm] = useState({ accountNumber: '', startDate: monthAgo, endDate: today });
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setTransactions(null);
    try {
      const res = await getBankStatement(form.accountNumber, form.startDate, form.endDate);
      setTransactions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch statement. Check the account number.');
    } finally {
      setLoading(false);
    }
  };

  const totalCredit = transactions?.filter(t => t.transactionType === 'CREDIT').reduce((s, t) => s + t.amount, 0) || 0;
  const totalDebit = transactions?.filter(t => t.transactionType === 'DEBIT').reduce((s, t) => s + t.amount, 0) || 0;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Bank Statement</h1>
        <p className="page__sub">View transaction history for any date range</p>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="statement-form">
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
            <label className="form-label">From Date</label>
            <input
              className="form-input"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">To Date</label>
            <input
              className="form-input"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Loading…' : 'Get Statement'}
          </button>
        </form>
        {error && <div className="error-box">{error}</div>}
      </div>

      {transactions && (
        <div className="statement-section">
          <div className="statement-summary">
            <div className="summary-card summary-card--credit">
              <div className="summary-card__label">Total Credits</div>
              <div className="summary-card__value">+₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="summary-card summary-card--debit">
              <div className="summary-card__label">Total Debits</div>
              <div className="summary-card__value">-₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="summary-card">
              <div className="summary-card__label">Transactions</div>
              <div className="summary-card__value">{transactions.length}</div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">No transactions found for this period.</div>
          ) : (
            <div className="card">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={tx.transactionId || i}>
                      <td className="mono">{new Date(tx.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="mono small">{tx.transactionId?.slice(0, 12)}…</td>
                      <td>
                        <span className={`tx-badge ${tx.transactionType === 'CREDIT' ? 'tx-badge--credit' : 'tx-badge--debit'}`}>
                          {tx.transactionType}
                        </span>
                      </td>
                      <td><span className="tx-status">{tx.status}</span></td>
                      <td className={`tx-amount ${tx.transactionType === 'CREDIT' ? 'amount--credit' : 'amount--debit'}`}>
                        {tx.transactionType === 'CREDIT' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}