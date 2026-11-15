
import { useState } from 'react';
import './AdminLogin.css';

function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            adminId,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      sessionStorage.setItem('adminToken', data.token);

      window.location.href = '/admin';

    } catch (error) {
      setError('Cannot connect to backend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">

        <div className="login-logo">🧂</div>

        <p className="login-label">
          SALTSHARE MANAGEMENT
        </p>

        <h1>Admin Login</h1>

        <p className="login-description">
          Sign in to access your private dashboard.
        </p>

        <form onSubmit={handleLogin}>

          <label>Admin ID</label>

          <input
            type="text"
            placeholder="Enter admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter secret password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Dashboard →'}
          </button>

        </form>

        <a href="/" className="back-home">
          ← Back to Home
        </a>

      </div>
    </div>
  );
}

export default AdminLogin;
