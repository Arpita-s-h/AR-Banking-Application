import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/bankApi';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    getProfile()
      .then(res => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true); setSaveSuccess(false); setError('');
    try {
      const res = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        otherName: form.otherName,
        gender: form.gender,
        address: form.address,
        stateOfOrigin: form.stateOfOrigin,
        phoneNumber: form.phoneNumber,
        alternativePhoneNumber: form.alternativePhoneNumber,
      });
      setProfile(res.data);
      setForm(res.data);
      setEditing(false);
      setSaveSuccess(true);
      updateUser({ fullName: res.data.firstName + ' ' + res.data.lastName });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
    setError('');
  };

  if (loading) return <div className="auth-loading"><div className="auth-loading__spinner" /><p>Loading profile…</p></div>;

  const displayFields = [
    { label: 'First Name',   key: 'firstName',              editable: true },
    { label: 'Last Name',    key: 'lastName',               editable: true },
    { label: 'Other Name',   key: 'otherName',              editable: true },
    { label: 'Gender',       key: 'gender',                 editable: true, type: 'select' },
    { label: 'Email',        key: 'email',                  editable: false },
    { label: 'Phone',        key: 'phoneNumber',            editable: true },
    { label: 'Alt. Phone',   key: 'alternativePhoneNumber', editable: true },
    { label: 'Address',      key: 'address',                editable: true },
    { label: 'State',        key: 'stateOfOrigin',          editable: true },
    { label: 'Member Since', key: 'createdAt',              editable: false,
      format: (v) => new Date(v).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">My Profile</h1>
        <p className="page__sub">Your personal and account details</p>
      </div>

      {saveSuccess && <div className="success-banner">✓ Profile updated successfully!</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="profile-hero card">
        <div className="profile-hero__avatar">
          {profile.firstName?.[0]}{profile.lastName?.[0]}
        </div>
        <div className="profile-hero__info">
          <h2 className="profile-hero__name">{profile.firstName} {profile.lastName}</h2>
          <p className="profile-hero__email">{profile.email}</p>
          <div className="profile-hero__badges">
            <span className={`status-badge ${profile.status === 'ACTIVE' ? 'status-badge--active' : 'status-badge--inactive'}`}>
              {profile.status}
            </span>
            <span className={`status-badge ${profile.accountLocked ? 'status-badge--locked' : 'status-badge--unlocked'}`}>
              {profile.accountLocked ? '🔒 Locked' : '🔓 Unlocked'}
            </span>
          </div>
        </div>
        <div className="profile-hero__balance">
          <div className="profile-hero__balance-label">Account Balance</div>
          <div className="profile-hero__balance-amount">
            ₹{parseFloat(profile.accountBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="profile-hero__acc-num mono">{profile.accountNumber}</div>
        </div>
      </div>

      <div className="card profile-details">
        <div className="profile-details__header">
          <h3 className="profile-details__heading">Personal Information</h3>
          {!editing ? (
            <button className="btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-outline btn-sm" onClick={handleCancel} disabled={saving}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : '✓ Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="profile-grid">
          {displayFields.map(({ label, key, editable, type, format }) => (
            <div className="profile-field" key={key}>
              <div className="profile-field__label">{label}</div>
              {editing && editable ? (
                type === 'select' ? (
                  <select className="form-input form-input--sm" name={key}
                    value={form[key] || ''} onChange={handleChange}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <input className="form-input form-input--sm" name={key}
                    value={form[key] || ''} onChange={handleChange} />
                )
              ) : (
                <div className="profile-field__value">
                  {format ? format(profile[key]) : (profile[key] || '—')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}