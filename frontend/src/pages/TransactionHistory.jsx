import { useState } from 'react';
import { getBankStatement } from '../api/bankApi';
import { useAuth } from '../context/AuthContext';

const TYPE_COLORS = { CREDIT: 'tx-badge--credit', DEBIT: 'tx-badge--debit', TRANSFER: 'tx-badge--transfer' };

export default function TransactionHistory() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const yearAgo = new Date(Date.now() - 365 * 864e5).toISOString().split('T')[0];

  const [filter, setFilter] = useState({ startDate: yearAgo, endDate: today, type: 'ALL' });
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true); setError('');
    try {
      const res = await getBankStatement(user.accountNumber, filter.startDate, filter.endDate);
      setTransactions(res.data);
    } catch {
      setError('Could not fetch transaction history.');
    } finally {
      setLoading(false);
    }
  };

  // Load on first render
  useState(() => { fetchHistory(); }, []);

  const filtered = transactions?.filter(tx =>
    filter.type === 'ALL' || tx.transactionType === filter.type
  ) || [];

  const totalCredit = filtered.filter(t => t.transactionType === 'CREDIT').reduce((s, t) => s + t.amount, 0);
  const totalDebit  = filtered.filter(t => t.transactionType === 'DEBIT').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Transaction History</h1>
        <p className="page__sub">All transactions for account <span className="mono">{user?.accountNumber}</span></p>
      </div>

      {/* Filters */}
      <div className="card filter-bar">
        <div className="form-field">
          <label className="form-label">From</label>
          <input className="form-input" type="date" value={filter.startDate}
            onChange={e => setFilter({ ...filter, startDate: e.target.value })} />
        </div>
        <div className="form-field">
          <label className="form-label">To</label>
          <input className="form-input" type="date" value={filter.endDate}
            onChange={e => setFilter({ ...filter, endDate: e.target.value })} />
        </div>
        <div className="form-field">
          <label className="form-label">Type</label>
          <select className="form-input" value={filter.type}
            onChange={e => setFilter({ ...filter, type: e.target.value })}>
            <option value="ALL">All Types</option>
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
          </select>
        </div>
        <button className="btn-primary" onClick={fetchHistory} disabled={loading}
          style={{ alignSelf: 'flex-end' }}>
          {loading ? 'Loading…' : 'Apply'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {transactions && (
        <>
          {/* Summary */}
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
              <div className="summary-card__label">Net Flow</div>
              <div className={`summary-card__value ${totalCredit - totalDebit >= 0 ? '' : 'amount--debit'}`}>
                ₹{(totalCredit - totalDebit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-card__label">Transactions</div>
              <div className="summary-card__value">{filtered.length}</div>
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="empty-state">No transactions found for this period.</div>
          ) : (
            <div className="card">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx, i) => (
                    <tr key={tx.transactionId || i}>
                      <td>
                        <div>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</div>
                        <div className="tx-time">{new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="mono small">{tx.transactionId?.slice(0, 16)}…</td>
                      <td>
                        <span className={`tx-badge ${TYPE_COLORS[tx.transactionType] || ''}`}>
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
        </>
      )}
    </div>
  );
}