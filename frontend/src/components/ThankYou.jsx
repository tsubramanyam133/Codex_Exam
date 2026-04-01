import { CheckCircle } from 'lucide-react';

const ThankYou = () => {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem auto' }} />
      <h1 className="title" style={{ marginBottom: '1rem' }}>Thank You for Attending!</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Your answers have been successfully submitted and recorded.
      </p>

    </div>
  );
};

export default ThankYou;
