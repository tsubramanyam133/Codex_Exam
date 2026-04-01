import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/submissions`)
      .then(res => {
        setSubmissions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatTimeTaken = (seconds) => {
    if (seconds === undefined || seconds === null) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="app-container" style={{ maxWidth: '1000px' }}>
      <h1 className="title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Exam Results Dashboard</h1>
      <div className="card" style={{ padding: '2rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading results...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Student ID</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Phone Number</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Score</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.5)', transition: 'background-color 0.2s ease', ':hover': { backgroundColor: 'rgba(99, 102, 241, 0.05)' } }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{sub.userId?.userId || 'Unknown'}</td>
                    <td style={{ padding: '1rem' }}>{sub.userId?.phoneNumber || 'Unknown'}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      <span style={{ color: sub.score > (sub.answers.length / 2) ? 'var(--success)' : 'var(--error)' }}>
                        {sub.score}
                      </span> 
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / {sub.answers.length}</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {formatTimeTaken(sub.timeTakenSeconds)}
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No exam submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
