import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

export default function EventQRCode({ eventId }) {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchQRCode = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/qr_code/`);
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
      a.download = `event_${eventId}_qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePrint = () => {
    if (qrCodeUrl) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Event QR Code</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              img {
                max-width: 400px;
                border: 2px solid #333;
                padding: 20px;
              }
              h2 {
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <img src="${qrCodeUrl}" alt="Event QR Code" />
            <h2>Scan to Check In</h2>
            <p>Event ID: ${eventId}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading QR Code...</div>;
  }

  if (!qrCodeUrl) {
    return <div style={styles.error}>QR Code not available</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h4 style={styles.title}>📱 Event QR Code</h4>
        <div style={styles.qrContainer}>
          <img src={qrCodeUrl} alt="Event QR Code" style={styles.qrImage} />
        </div>
        <p style={styles.instruction}>
          Attendees can scan this QR code to check in to the event
        </p>
        <div style={styles.actions}>
          <button onClick={handleDownload} style={styles.downloadBtn}>
            💾 Download
          </button>
          <button onClick={handlePrint} style={styles.printBtn}>
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  title: {
    margin: '0 0 20px 0',
    color: '#2c3e50',
    fontSize: '18px'
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  qrImage: {
    maxWidth: '250px',
    width: '100%',
    height: 'auto',
    border: '3px solid #c8102e',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: 'white'
  },
  instruction: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '20px'
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  downloadBtn: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  printBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#95a5a6'
  },
  error: {
    padding: '20px',
    textAlign: 'center',
    color: '#e74c3c',
    backgroundColor: '#fadbd8',
    borderRadius: '8px'
  }
};
