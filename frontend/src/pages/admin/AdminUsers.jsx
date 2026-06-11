import { useState, useEffect } from 'react';
import { getAllUsers, searchUser, blockUser, unblockUser, deleteUser } from '../../api/bankApi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError(''); setSearchResult(null);
    try {
      const res = await searchUser(search);
      setSearchResult(res.data);
    } catch {
      setSearchError('No user found with that account number.');
    }
  };

  const handleBlock = async (accountNumber) => {
    await blockUser(accountNumber);
    setActionMsg('Account blocked successfully.');
    fetchUsers();
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleUnblock = async (accountNumber) => {
    await unblockUser(accountNumber);
    setActionMsg('Account unblocked successfully.');
    fetchUsers();
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleDelete = async (accountNumber) => {
    if (!window.confirm('Are you sure you want to delete this account? This cannot be undone.')) return;
    await deleteUser(accountNumber);
    setActionMsg('Account deleted successfully.');
    fetchUsers();
    setTimeout(() => setActionMsg(''), 3000);
  };

  const displayUsers = searchResult ? [searchResult] : users;

  return (
    <div className="page">
      <div className="page__header">
        <div className="admin-badge">ADMIN</div>
        <h1 className="page__title">Manage Users</h1>
        <p className="page__sub">View, search, block, and delete accounts</p>
      </div>

      {actionMsg && <div className="success-banner">{actionMsg}</div>}

      {/* Search */}
      <div className="card filter-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="form-field" style={{ flex: 1, marginBottom: 0 }}>
          <label className="form-label">Search by Account Number</label>
          <input className="form-input" value={search}
            onChange={e => { setSearch(e.target.value); setSearchResult(null); setSearchError(''); }}
            placeholder="Enter account number" />
        </div>
        <button className="btn-primary" onClick={handleSearch} style={{ alignSelf: 'flex-end' }}>
          Search
        </button>
        {searchResult && (
          <button className="btn-outline" onClick={() => { setSearchResult(null); setSearch(''); }}
            style={{ alignSelf: 'flex-end' }}>
            Clear
          </button>
        )}
      </div>
      {searchError && <div className="error-box">{searchError}</div>}

      {/* Users Table */}
      {loading ? (
        <div className="auth-loading"><div className="auth-loading__spinner" /></div>
      ) : (
        <div className="card">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account No.</th>
                <th>Email</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((u) => (
                <tr key={u.accountNumber}>
                  <td><strong>{u.firstName} {u.lastName}</strong></td>
                  <td className="mono small">{u.accountNumber}</td>
                  <td className="small">{u.email}</td>
                  <td>₹{parseFloat(u.accountBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`status-badge ${u.status === 'ACTIVE' ? 'status-badge--active' : 'status-badge--inactive'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {u.accountLocked ? (
                        <button className="action-btn action-btn--green"
                          onClick={() => handleUnblock(u.accountNumber)}>Unblock</button>
                      ) : (
                        <button className="action-btn action-btn--orange"
                          onClick={() => handleBlock(u.accountNumber)}>Block</button>
                      )}
                      <button className="action-btn action-btn--red"
                        onClick={() => handleDelete(u.accountNumber)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayUsers.length === 0 && <div className="empty-state">No users found.</div>}
        </div>
      )}
    </div>
  );
}