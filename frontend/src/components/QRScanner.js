import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import API_BASE_URL from '../config';

export default function QRScanner({ onScan }) {
  const [qrData, setQrData] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [attendeeData, setAttendeeData] = useState({
    full_name: '',
    email: '',
    student_id: ''
  });

  useEffect(() => {
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraAvailable(false);
      console.warn('Camera not available - getUserMedia not supported');
    }
  }, []);

  const handleScan = (data) => {
    if (data) {
      setQrData(data.text);
      setShowCamera(false);
      alert('✅ QR Code scanned successfully! Please fill in your details.');
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    setShowCamera(false);
    setCameraAvailable(false);
    alert('❌ Camera not available. Please use manual entry instead.');
  };

  const handleOpenCamera = () => {
    if (!cameraAvailable) {
      alert('❌ Camera is not available on this device/browser. Please use manual entry.');
      return;
    }
    setShowCamera(true);
  };

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
      const response = await fetch(`${API_BASE_URL}/api/attendances/time_in/`, {
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

  const previewStyle = {
    height: 300,
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>📱 QR Code Check-in</h3>
        
        {/* Camera Scanner Section */}
        {showCamera ? (
          <div style={styles.cameraSection}>
            <div style={styles.cameraContainer}>
              <QrScanner
                delay={300}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
                constraints={{
                  video: { facingMode: 'environment' }
                }}
              />
            </div>
            <button 
              type="button"
              onClick={() => setShowCamera(false)} 
              style={styles.closeCameraBtn}
            >
              ✕ Close Camera
            </button>
            <p style={styles.cameraHint}>
              📸 Point your camera at the QR code
            </p>
          </div>
        ) : (
          <div style={styles.scanOptions}>
            {cameraAvailable ? (
              <button 
                type="button"
                onClick={handleOpenCamera} 
                style={styles.scanBtn}
              >
                📷 Scan QR Code with Camera
              </button>
            ) : (
              <div style={styles.cameraUnavailable}>
                <p>📷 Camera not available</p>
                <small>Please use manual entry below</small>
              </div>
            )}
            <div style={styles.divider}>
              <span style={styles.dividerText}>OR</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>QR Code Data</label>
            <input
              type="text"
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              placeholder="Scan QR or type: Event ID: X - Event Name"
              style={styles.input}
              required
              readOnly={showCamera}
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
  cameraSection: {
    marginBottom: '25px'
  },
  cameraContainer: {
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '15px',
    border: '3px solid #c8102e'
  },
  closeCameraBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '10px'
  },
  cameraHint: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#7f8c8d',
    margin: '10px 0'
  },
  scanOptions: {
    marginBottom: '25px'
  },
  scanBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '15px',
    transition: 'background-color 0.3s'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '20px 0'
  },
  dividerText: {
    padding: '0 10px',
    color: '#95a5a6',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto'
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
  },
  cameraUnavailable: {
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '15px',
    color: '#856404'
  }
};
