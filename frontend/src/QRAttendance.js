import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from './config';

export default function QRAttendance() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('scan'); // scan, register, processing, result
  const [result, setResult] = useState(null);
  const [attendeeData, setAttendeeData] = useState({
    full_name: '',
    email: '',
    student_id: ''
  });

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/`);
      const data = await response.json();
      setEvent(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch event:', err);
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStep('processing');
    
    try {
      // First create attendee
      const response = await fetch(`${API_BASE_URL}/api/attendances/time_in/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          attendee: attendeeData
        })
      });

      const data = await response.json();
      
      setResult({
        action: 'time_in',
        detail: 'Registration and Time In successful!',
        attendance: data
      });
      setStep('result');
      
      // Auto-redirect
      setTimeout(() => {
        setStep('scan');
        setResult(null);
        setAttendeeData({ full_name: '', email: '', student_id: '' });
      }, 3000);
    } catch (err) {
      setResult({
        action: 'error',
        detail: 'Registration failed. Please try again.'
      });
      setStep('result');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Event Header */}
      <div style={styles.header}>
        <h1 style={styles.eventTitle}>{event.title}</h1>
        <p style={styles.eventDate}>
          {new Date(event.start).toLocaleDateString()} • {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* QR Code Display */}
      {step === 'scan' && (
        <div style={styles.qrSection}>
          <div style={styles.qrCard}>
            <h2 style={styles.qrTitle}>📱 Scan QR Code to Continue</h2>
            <p style={styles.qrSubtitle}>Point your camera at the QR code below</p>
            
            {event.qr_code ? (
              <div style={styles.qrImageContainer}>
                <img 
                  src={`${API_BASE_URL}${event.qr_code}`} 
                  alt="Event QR Code" 
                  style={styles.qrImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<p style="color: #e74c3c; padding: 20px;">⚠️ QR Code image not found. Please regenerate QR codes.</p>';
                  }}
                />
              </div>
            ) : (
              <div style={styles.qrImageContainer}>
                <p style={{color: '#e74c3c', padding: '20px', textAlign: 'center'}}>
                  ⚠️ QR Code not available<br/>
                  <small>Please contact admin to generate QR code for this event.</small>
                </p>
              </div>
            )}
            
            <div style={styles.instructions}>
              <h3>How it works:</h3>
              <ol style={styles.instructionList}>
                <li><strong>First scan:</strong> Time In (Check In)</li>
                <li><strong>Second scan:</strong> Time Out (Check Out)</li>
                <li><strong>After Time Out:</strong> Complete survey & get certificate</li>
              </ol>
            </div>

            {/* Manual Entry Option */}
            <div style={styles.manualEntry}>
              <p style={styles.orText}>OR</p>
              <button 
                onClick={() => setStep('register')} 
                style={styles.manualBtn}
              >
                Enter Details Manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      {step === 'register' && (
        <div style={styles.formSection}>
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Register for Event</h2>
            <p style={styles.formSubtitle}>Please provide your details</p>
            
            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name *</label>
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
                <label style={styles.label}>Email *</label>
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
                ✓ Register & Time In
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep('scan')} 
                style={styles.backBtn}
              >
                ← Back to QR Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div style={styles.processing}>
          <div style={styles.spinner}></div>
          <p>Processing...</p>
        </div>
      )}

      {/* Result */}
      {step === 'result' && result && (
        <div style={styles.resultSection}>
          <div style={{
            ...styles.resultCard,
            backgroundColor: result.action === 'error' ? '#f8d7da' : 
                           result.action === 'time_in' ? '#d4edda' :
                           result.action === 'time_out' ? '#fff3cd' : '#d1ecf1'
          }}>
            <div style={styles.resultIcon}>
              {result.action === 'time_in' && '✅'}
              {result.action === 'time_out' && '⏰'}
              {result.action === 'completed' && '🎉'}
              {result.action === 'error' && '❌'}
            </div>
            
            <h2 style={styles.resultTitle}>
              {result.action === 'time_in' && 'Time In Successful!'}
              {result.action === 'time_out' && 'Time Out Successful!'}
              {result.action === 'completed' && 'Already Completed'}
              {result.action === 'error' && 'Error'}
            </h2>
            
            <p style={styles.resultDetail}>{result.detail}</p>
            
            {result.action === 'time_out' && (
              <p style={styles.resultNext}>
                Redirecting to {result.next_step}...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  header: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  eventTitle: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    color: '#2c3e50',
    fontWeight: '700'
  },
  eventDate: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d'
  },
  qrSection: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0'
  },
  qrCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  qrTitle: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    color: '#2c3e50'
  },
  qrSubtitle: {
    margin: '0 0 30px 0',
    fontSize: '14px',
    color: '#7f8c8d'
  },
  qrImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px'
  },
  qrImage: {
    maxWidth: '300px',
    width: '100%',
    height: 'auto',
    border: '4px solid #3498db',
    borderRadius: '8px'
  },
  instructions: {
    textAlign: 'left',
    backgroundColor: '#e8f4f8',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  instructionList: {
    margin: '10px 0 0 0',
    paddingLeft: '20px'
  },
  manualEntry: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '2px solid #e0e0e0'
  },
  orText: {
    color: '#95a5a6',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '15px'
  },
  manualBtn: {
    padding: '12px 24px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  formSection: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0'
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  formTitle: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    color: '#2c3e50',
    textAlign: 'center'
  },
  formSubtitle: {
    margin: '0 0 30px 0',
    fontSize: '14px',
    color: '#7f8c8d',
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
    outline: 'none'
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
    marginTop: '10px'
  },
  backBtn: {
    padding: '12px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  processing: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    color: '#7f8c8d'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  resultSection: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0'
  },
  resultCard: {
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  resultIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  resultTitle: {
    margin: '0 0 15px 0',
    fontSize: '24px',
    color: '#2c3e50'
  },
  resultDetail: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: '#34495e'
  },
  resultNext: {
    margin: '20px 0 0 0',
    fontSize: '14px',
    color: '#7f8c8d',
    fontStyle: 'italic'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    color: '#7f8c8d'
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    textAlign: 'center',
    color: '#e74c3c'
  }
};
