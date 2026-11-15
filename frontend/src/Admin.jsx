
import { useEffect, useState } from 'react';
import './Admin.css';

function Admin() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('adminToken');

      if (!token) {
        window.location.href = '/admin-login';
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/enquiries',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem('adminToken');
        window.location.href = '/admin-login';
        return;
      }

      if (!response.ok) {
        throw new Error('Unable to fetch enquiries');
      }

      const data = await response.json();
      setEnquiries(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  };

  return (
    <div className="admin-page">

      <header className="admin-header">
        <h2>🧂 SaltShare Admin</h2>

        <div className="admin-header-actions">
          <span>Management Dashboard</span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout →
          </button>
        </div>
      </header>

      <main className="admin-container">

        <div className="admin-heading">
          <div>
            <p className="admin-label">OVERVIEW</p>
            <h1>Investor Enquiries</h1>
            <p>Manage and view submitted enquiries.</p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchEnquiries}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="admin-stats">

          <div className="admin-stat-card">
            <span>Total Enquiries</span>
            <h2>{enquiries.length}</h2>
          </div>

          <div className="admin-stat-card">
            <span>Latest Enquiry</span>
            <h2>
              {enquiries.length > 0
                ? `#${enquiries[0].id}`
                : 'None'}
            </h2>
          </div>

        </div>

        <section className="enquiries-table-section">

          <h2>Enquiry Details</h2>

          {loading && (
            <p className="admin-message">
              Loading enquiries...
            </p>
          )}

          {error && (
            <p className="admin-error">{error}</p>
          )}

          {!loading && !error && enquiries.length === 0 && (
            <p className="admin-message">
              No enquiries have been submitted yet.
            </p>
          )}

          {!loading && !error && enquiries.length > 0 && (

            <div className="table-wrapper">
              <table className="enquiries-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {enquiries.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.full_name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.message}</td>
                      <td>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          )}

        </section>

      </main>
    </div>
  );
}

export default Admin;
