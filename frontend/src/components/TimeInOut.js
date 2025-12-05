import React, { useState } from 'react';
import API_BASE_URL from '../config';

const TimeInOut = ({ event, onComplete }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    student_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTimeIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/time_in/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_id: event.id,
          attendee: formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Time in successful!');
        onComplete(data);
      } else {
        setError(data.detail || 'Time in failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Time In for {event.title}</h3>
      <form onSubmit={handleTimeIn} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Student ID</label>
          <input
            type="text"
            value={formData.student_id}
            onChange={(e) => setFormData({...formData, student_id: e.target.value})}
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Processing...' : 'Time In'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px'
  }
};

export default TimeInOut;
