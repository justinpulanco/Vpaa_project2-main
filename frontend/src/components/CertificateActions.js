import React, { useState } from 'react';

export default function CertificateActions({ attendanceId, attendeeEmail }) {
  const [sending, setSending] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/attendances/${attendanceId}/download_certificate/`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificate.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download certificate');
      }
    } catch (err) {
      alert('Error downloading certificate: ' + err.message);
    }
  };

  const handleEmail = async () => {
    if (!window.confirm(`Send certificate to ${attendeeEmail}?`)) return;
    
    setSending(true);
    try {
      const response = await fetch(`http://localhost:8000/api/attendances/${attendanceId}/email_certificate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Certificate sent successfully to ' + attendeeEmail);
      } else {
        alert('❌ Failed to send: ' + (data.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleDownload} style={styles.downloadBtn}>
        📄 Download Certificate
      </button>
      <button onClick={handleEmail} disabled={sending} style={styles.emailBtn}>
        {sending ? '📧 Sending...' : '📧 Email Certificate'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '15px'
  },
  downloadBtn: {
    flex: 1,
    minWidth: '150px',
    padding: '12px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  emailBtn: {
    flex: 1,
    minWidth: '150px',
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }
};
