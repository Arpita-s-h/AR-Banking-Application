import { useState, useEffect } from 'react';
import { getAllTransactions } from '../../api/bankApi';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getAllTransactions()
      .then(res => setTransactions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter(tx =>
    filter === 'ALL' || tx.transactionType === filter
  );

  const totalCredit = transactions.filter(t => t.transactionType === 'CREDIT').reduce((s, t) => s + t.amount, 0);
  const totalDebit  = transactions.filter(t => t.transactionType === 'DEBIT').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page">
      <div className="page__header">
        <div className="admin-badge">ADMIN</div>
        <h1 className="page__title">Transaction Monitoring</h1>
        <p className="page__sub">All transactions across the system</p>
      </div>

      <div className="statement-summary" style={{ marginBottom: '1.5rem' }}>
        <div className="summary-card summary-card--credit">
          <div className="summary-card__label">Total Credits</div>
          <div className="summary-card__value">+₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="summary-card summary-card--debit">
          <div className="summary-card__label">Total Debits</div>
          <div className="summary-card__value">-₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card__label">Total Transactions</div>
          <div className="summary-card__value">{transactions.length}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="tab-toggle" style={{ marginBottom: '1.5rem', maxWidth: '320px' }}>
        {['ALL', 'CREDIT', 'DEBIT'].map(t => (
          <button key={t} className={`tab-btn ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="auth-loading"><div className="auth-loading__spinner" /></div>
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
              {filtered.map((tx, i) => (
                <tr key={tx.transactionId || i}>
                  <td>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="mono small">{tx.transactionId?.slice(0, 16)}…</td>
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
          {filtered.length === 0 && <div className="empty-state">No transactions found.</div>}
        </div>
      )}
    </div>
  );
}