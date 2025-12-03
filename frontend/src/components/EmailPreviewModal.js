import React from 'react';

export default function EmailPreviewModal({ emailData, onClose }) {
  if (!emailData) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>📧 Email Preview</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.content}>
          <div style={styles.emailField}>
            <strong>From:</strong> noreply@hcdc.edu.ph
          </div>
          <div style={styles.emailField}>
            <strong>To:</strong> {emailData.to}
          </div>
          <div style={styles.emailField}>
            <strong>Subject:</strong> Certificate for {emailData.eventTitle}
          </div>
          
          <div style={styles.divider}></div>
          
          <div style={styles.emailBody}>
            <p>Dear {emailData.attendeeName},</p>
            <p>Congratulations! Your certificate for <strong>{emailData.eventTitle}</strong> is attached.</p>
            <p>Best regards,<br/>HCDC Event System</p>
          </div>

          <div style={styles.note}>
            <strong>📎 Attachment:</strong> certificate.pdf
          </div>

          <div style={styles.devNote}>
            ℹ️ <strong>Development Mode:</strong> Email is not actually sent. 
            In production, this will be delivered to the recipient's inbox.
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.okBtn}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '2px solid #e8e8e8',
    backgroundColor: '#f8f9fa'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: '#2c3e50'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#95a5a6',
    padding: '5px 10px'
  },
  content: {
    padding: '25px',
    overflowY: 'auto',
    flex: 1
  },
  emailField: {
    marginBottom: '12px',
    fontSize: '14px',
    color: '#34495e'
  },
  divider: {
    height: '2px',
    backgroundColor: '#e8e8e8',
    margin: '20px 0'
  },
  emailBody: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#2c3e50',
    border: '1px solid #e8e8e8'
  },
  note: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#e3f2fd',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#1565c0'
  },
  devNote: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#fff3cd',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#856404',
    border: '1px solid #ffeaa7'
  },
  footer: {
    padding: '15px 25px',
    borderTop: '2px solid #e8e8e8',
    backgroundColor: '#f8f9fa',
    textAlign: 'center'
  },
  okBtn: {
    padding: '12px 40px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
