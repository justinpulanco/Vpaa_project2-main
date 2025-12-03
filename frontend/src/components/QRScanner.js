import React, { useState } from 'react';

export default function QRScanner({ onScan }) {
  const [qrData, setQrData] = useState('');
  const [attendeeData, setAttendeeData] = useState({
    full_name: '',
    email: '',
    student_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Parse QR data to extract event ID
      // Format: "Event ID: 10 - Testing1"
      const match = qrData.match(/Event ID:\s*(\d+)/i);
      
      if (!match) {
        alert('❌ Invalid QR code format. Expected: "Event ID: X - Event Name"');
        return;
      }
      
      const eventId = match[1];
      
      // Use the regular time_in endpoint
      const response = await fetch('http://localhost:8000/api/attendances/time_in/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          attendee: attendeeData
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('✅ Check-in successful!');
        onScan(data);
      } else {
        const errorText = await response.text();
        let errorMsg = 'Unknown error';
        
        try {
          const error = JSON.parse(errorText);
          errorMsg = error.detail || JSON.stringify(error);
        } catch {
          errorMsg = errorText || 'Server error';
        }
        
        alert('❌ Check-in failed: ' + errorMsg);
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>📱 QR Code Check-in</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>QR Code Data</label>
            <input
              type="text"
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              placeholder="Scan or paste QR code data"
              style={styles.input}
              required
            />
            <small style={styles.hint}>Format: "Event ID: X - Event Name"</small>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={attendeeData.full_name}
              onChange={(e) => setAttendeeData({...attendeeData, full_name: e.target.value})}
              placeholder="Juan Dela Cruz"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={attendeeData.email}
              onChange={(e) => setAttendeeData({...attendeeData, email: e.target.value})}
              placeholder="juan@example.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Student ID (Optional)</label>
            <input
              type="text"
              value={attendeeData.student_id}
              onChange={(e) => setAttendeeData({...attendeeData, student_id: e.target.value})}
              placeholder="2024-12345"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            ✓ Check In
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 25px 0',
    color: '#2c3e50',
    fontSize: '22px',
    textAlign: 'center'
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
  hint: {
    fontSize: '12px',
    color: '#95a5a6',
    fontStyle: 'italic'
  },
  submitBtn: {
    padding: '14px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s'
  }
};
