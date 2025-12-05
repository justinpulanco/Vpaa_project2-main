import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

export default function UserEventQR({ event }) {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  const fetchQRCode = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${event.id}/qr_code/`);
      const data = await response.json();
      
      if (data.qr_code_url) {
        setQrCodeUrl(`${API_BASE_URL}${data.qr_code_url}`);
      }
    } catch (err) {
      console.error('Failed to fetch QR code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const a = document.createElement('a');
      a.href = qrCodeUrl;
      a.download = `${event.title.replace(/\s+/g, '_')}_QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading QR Code...</p>
      </div>
    );
  }

  if (!qrCodeUrl) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <p style={styles.errorText}>QR Code not available</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>📱</div>
          <h3 style={styles.title}>Event QR Code</h3>
          <p style={styles.subtitle}>Show this to check in</p>
        </div>

        <div style={styles.qrContainer}>
          <div style={styles.qrWrapper}>
            <img src={qrCodeUrl} alt="Event QR Code" style={styles.qrImage} />
          </div>
          <div style={styles.scanLine}></div>
        </div>

        <div style={styles.eventInfo}>
          <div style={styles.eventTitle}>{event.title}</div>
          <div style={styles.eventMeta}>
            <span style={styles.metaItem}>
              📅 {new Date(event.start).toLocaleDateString()}
            </span>
            <span style={styles.metaItem}>
              ⏰ {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div style={styles.instructions}>
          <div style={styles.instructionItem}>
            <span style={styles.stepNumber}>1</span>
            <span style={styles.stepText}>Show this QR code at the event</span>
          </div>
          <div style={styles.instructionItem}>
            <span style={styles.stepNumber}>2</span>
            <span style={styles.stepText}>Admin will scan to check you in</span>
          </div>
          <div style={styles.instructionItem}>
            <span style={styles.stepNumber}>3</span>
            <span style={styles.stepText}>You're all set! ✨</span>
          </div>
        </div>

        <button onClick={handleDownload} style={styles.downloadBtn}>
          💾 Download QR Code
        </button>
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
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    border: '1px solid #e8e8e8'
  },
  header: {
    textAlign: 'center',
    marginBottom: '25px'
  },
  iconCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#e3f2fd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    margin: '0 auto 15px'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    color: '#2c3e50',
    fontWeight: '700'
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d',
    fontWeight: '500'
  },
  qrContainer: {
    position: 'relative',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    marginBottom: '25px',
    overflow: 'hidden'
  },
  qrWrapper: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '3px solid #c8102e'
  },
  qrImage: {
    width: '100%',
    maxWidth: '280px',
    height: 'auto',
    display: 'block'
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    height: '2px',
    backgroundColor: '#c8102e',
    opacity: 0.3,
    animation: 'scan 2s ease-in-out infinite'
  },
  eventInfo: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    marginBottom: '20px'
  },
  eventTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  eventMeta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  metaItem: {
    fontSize: '13px',
    color: '#7f8c8d',
    fontWeight: '500'
  },
  instructions: {
    backgroundColor: '#e8f5e9',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  },
  instructionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#2c3e50'
  },
  stepNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#27ae60',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0
  },
  stepText: {
    flex: 1,
    fontWeight: '500'
  },
  downloadBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#7f8c8d',
    fontSize: '14px'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fff5f5',
    borderRadius: '20px',
    border: '2px solid #fee'
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '14px',
    fontWeight: '500'
  }
};
