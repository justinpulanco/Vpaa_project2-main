import React, { useState } from 'react';
import API_BASE_URL from '../config';

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Note: Django's password reset endpoint
      const response = await fetch(`${API_BASE_URL}/api/auth/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSent(true);
      } else {
        setError('Failed to send reset email. Please check your email address.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Check Your Email!</h2>
          <p style={styles.successText}>
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <p style={styles.note}>
            If you don't see the email, check your spam folder.
          </p>
          <button onClick={onBack} style={styles.backBtn}>
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={onBack} style={styles.backLink}>
          ← Back to Login
        </button>
        
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  backLink: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '20px',
    padding: '5px 0'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  subtitle: {
    margin: '0 0 30px 0',
    fontSize: '14px',
    color: '#7f8c8d',
    lineHeight: '1.5'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#34495e'
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e8e8e8',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  error: {
    padding: '12px',
    backgroundColor: '#fadbd8',
    color: '#c0392b',
    borderRadius: '8px',
    fontSize: '14px'
  },
  submitBtn: {
    padding: '14px',
    backgroundColor: '#c8102e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  successTitle: {
    margin: '0 0 15px 0',
    fontSize: '24px',
    color: '#27ae60'
  },
  successText: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    color: '#34495e',
    lineHeight: '1.6'
  },
  note: {
    margin: '0 0 30px 0',
    fontSize: '13px',
    color: '#95a5a6',
    fontStyle: 'italic'
  },
  backBtn: {
    padding: '12px 30px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
