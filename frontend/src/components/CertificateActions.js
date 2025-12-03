import React, { useState } from 'react';
import API_BASE_URL from '../config';
import EmailPreviewModal from './EmailPreviewModal';

export default function CertificateActions({ attendanceId, attendeeEmail, attendeeName, eventTitle }) {
  const [sending, setSending] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailData, setEmailData] = useState(null);

  const handleDownload = async () => {
    try {
      console.log('Downloading certificate for attendance:', attendanceId);
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendanceId}/download_certificate/`);
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const blob = await response.blob();
        console.log('Blob size:', blob.size);
        
        if (blob.size < 100) {
          alert('❌ Certificate file is empty or corrupted. Please try again.');
          return;
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificate.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('✅ Certificate downloaded successfully!');
      } else {
        const errorText = await response.text();
        console.error('Download failed:', errorText);
        alert('❌ Failed to download certificate. Please make sure you completed the event.');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('❌ Error: ' + err.message + '\n\nMake sure the backend server is running!');
    }
  };

  const handleEmail = async () => {
    if (!window.confirm(`Send certificate to ${attendeeEmail}?`)) return;
    
    setSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendanceId}/email_certificate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (response.ok) {
        // Show email preview modal
        setEmailData({
          to: attendeeEmail,
          attendeeName: attendeeName || 'Attendee',
          eventTitle: eventTitle || 'Event'
        });
        setShowEmailPreview(true);
      } else {
        // Show friendly message
        alert('ℹ️ ' + (data.detail || 'Email feature not available. Please download instead.'));
      }
    } catch (err) {
      alert('ℹ️ Email feature not configured. Please download the certificate instead.');
    } finally {
      setSending(false);
    }
  };

  const handlePrint = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendanceId}/download_certificate/`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Open in new window and print
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      } else {
        alert('❌ Failed to load certificate for printing');
      }
    } catch (err) {
      console.error('Print error:', err);
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <>
      <div style={styles.container}>
        <button onClick={handleDownload} style={styles.downloadBtn}>
          📄 Download
        </button>
        <button onClick={handlePrint} style={styles.printBtn}>
          🖨️ Print
        </button>
        <button onClick={handleEmail} disabled={sending} style={styles.emailBtn}>
          {sending ? '📧 Sending...' : '📧 Email'}
        </button>
      </div>

      {showEmailPreview && (
        <EmailPreviewModal
          emailData={emailData}
          onClose={() => setShowEmailPreview(false)}
        />
      )}
    </>
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
    minWidth: '120px',
    padding: '12px 16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  printBtn: {
    flex: 1,
    minWidth: '120px',
    padding: '12px 16px',
    backgroundColor: '#9b59b6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  emailBtn: {
    flex: 1,
    minWidth: '120px',
    padding: '12px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }
};
