import { useState } from 'react';
import axios from 'axios';
import { User, Phone } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !phoneNumber) return setError('Please fill all fields.');

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${API_URL}/api/login`, {
        userId,
        phoneNumber
      });
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="title"> Codex 2K26 <span>🚀</span></h1>
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Pass ID</label>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} size={20} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '40px' }}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your Pass ID"
            />
          </div>
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <Phone style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} size={20} />
            <input
              type="tel"
              className="input-field"
              style={{ paddingLeft: '40px' }}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Authenticating...' : 'Start Examination'}
        </button>
      </form>
    </div>
  );
};

export default Login;
