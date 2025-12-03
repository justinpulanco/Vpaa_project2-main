import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

export default function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_BASE_URL}/api/attendances/?attendee__email=${user.email}`);
      const data = await response.json();
      
      // Filter only those with certificates
      const withCerts = data.filter(att => att.certificate && att.present);
      setCertificates(withCerts);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (attendanceId, eventTitle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendanceId}/download_certificate/`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate_${eventTitle.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert('Failed to download certificate');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading your certificates...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📄 My Certificates</h2>
      
      {certificates.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📜</div>
          <h3>No certificates yet</h3>
          <p>Complete events to earn certificates!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {certificates.map((cert) => (
            <div key={cert.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.certIcon}>🏆</div>
                <h3 style={styles.eventTitle}>{cert.event.title}</h3>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.info}>
                  <span style={styles.label}>Date:</span>
                  <span>{formatDate(cert.event.start)}</span>
                </div>
                <div style={styles.info}>
                  <span style={styles.label}>Category:</span>
                  <span>{cert.event.category}</span>
                </div>
                <div style={styles.info}>
                  <span style={styles.label}>Status:</span>
                  <span style={styles.badge}>✓ Completed</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleDownload(cert.id, cert.event.title)}
                style={styles.downloadBtn}
              >
                📥 Download Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    color: '#95a5a6'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #c8102e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#95a5a6'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '2px solid #e8e8e8',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0'
  },
  certIcon: {
    fontSize: '48px',
    marginBottom: '10px'
  },
  eventTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#c8102e',
    fontWeight: '600'
  },
  cardBody: {
    marginBottom: '20px'
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#34495e'
  },
  label: {
    fontWeight: '600',
    color: '#7f8c8d'
  },
  badge: {
    padding: '2px 10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  downloadBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }
};
