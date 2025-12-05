import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from './config';

export default function UserCertificateReview() {
  const { attendanceId } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [modifications, setModifications] = useState({
    name_correction: '',
    reason: '',
    other_changes: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceId]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendanceId}/`);
      const data = await response.json();
      console.log('Attendance data:', data);
      console.log('Certificate URL:', data.certificate);
      console.log('Full certificate path:', `${API_BASE_URL}${data.certificate}`);
      setAttendance(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this certificate? It will be sent to your email.')) {
      return;
    }
    
    setStatus('approving');
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendanceId}/approve_certificate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('approved');
        alert('✅ ' + data.detail);
        fetchAttendance();
        
        // Redirect back to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setStatus('error');
        alert('❌ ' + (data.detail || 'Failed to approve certificate'));
      }
    } catch (err) {
      setStatus('error');
      alert('❌ Failed to approve certificate: ' + err.message);
    }
  };

  const handleRequestModification = async (e) => {
    e.preventDefault();
    setStatus('requesting');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendanceId}/request_certificate_modification/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modifications })
      });
      
      const data = await response.json();
      setStatus('modification_requested');
      alert(data.detail);
      setShowModifyForm(false);
      fetchAttendance();
    } catch (err) {
      setStatus('error');
      alert('Failed to request modification');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendanceId}/download_certificate/`);
      
      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = attendance?.attendee?.full_name 
        ? `certificate_${attendance.attendee.full_name.replace(/\s+/g, '_')}.pdf`
        : 'certificate.pdf';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert('✅ Certificate downloaded successfully!');
    } catch (err) {
      alert('❌ Failed to download certificate: ' + err.message);
    }
  };

  const handleViewInNewTab = () => {
    if (attendance && attendance.certificate) {
      // Check if certificate already has full URL or just path
      const certificateUrl = attendance.certificate.startsWith('http') 
        ? attendance.certificate 
        : `${API_BASE_URL}${attendance.certificate}`;
      console.log('Opening certificate:', certificateUrl);
      window.open(certificateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={styles.error}>
            <h2>Attendance Record Not Found</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header with Back Button */}
        <div style={styles.header}>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>📋 Certificate Review</h1>
          <p style={styles.subtitle}>{attendance.event?.title || 'Event'}</p>
        </div>

        {/* Attendee Info */}
        {attendance.attendee && (
          <div style={styles.infoCard}>
            <h3>Your Information</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Name:</span>
              <span style={styles.infoValue}>{attendance.attendee.full_name || 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email:</span>
              <span style={styles.infoValue}>{attendance.attendee.email || 'N/A'}</span>
            </div>
            {attendance.attendee.student_id && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Student ID:</span>
                <span style={styles.infoValue}>{attendance.attendee.student_id}</span>
              </div>
            )}
          </div>
        )}

        {/* Certificate Preview */}
        {attendance.certificate ? (
          <div style={styles.certificateCard}>
            <h3 style={styles.cardTitle}>📄 Certificate Preview</h3>
            
            {/* Quick Actions */}
            <div style={styles.quickActions}>
              <button onClick={handleViewInNewTab} style={styles.viewBtn}>
                🔍 View Full Size
              </button>
              <button onClick={handleDownload} style={styles.downloadBtnSmall}>
                💾 Download PDF
              </button>
            </div>
            
            {!pdfError ? (
              <div style={styles.pdfPreview}>
                <embed
                  src={`${attendance.certificate.startsWith('http') ? attendance.certificate : API_BASE_URL + attendance.certificate}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  type="application/pdf"
                  style={styles.pdfEmbed}
                  onError={() => {
                    console.error('PDF embed failed');
                    setPdfError(true);
                  }}
                />
              </div>
            ) : (
              <div style={styles.pdfFallback}>
                <div style={styles.fallbackIcon}>📄</div>
                <h4 style={styles.fallbackTitle}>PDF Preview Not Available</h4>
                <p style={styles.fallbackText}>
                  Your browser doesn't support inline PDF viewing.
                </p>
                <div style={styles.fallbackActions}>
                  <button onClick={handleViewInNewTab} style={styles.viewBtnLarge}>
                    🔍 Open in New Tab
                  </button>
                  <button onClick={handleDownload} style={styles.downloadBtnLarge}>
                    💾 Download PDF
                  </button>
                </div>
              </div>
            )}
            
            {/* Status Banner */}
            {attendance.certificate_approved ? (
              <div style={styles.approvedBanner}>
                <div style={styles.bannerIcon}>✅</div>
                <h3 style={styles.bannerTitle}>Certificate Approved!</h3>
                <p style={styles.bannerText}>
                  Certificate has been sent to <strong>{attendance.attendee?.email || 'your email'}</strong>
                </p>
                <button onClick={() => navigate('/dashboard')} style={styles.returnBtn}>
                  ← Return to Dashboard
                </button>
              </div>
            ) : (
              <div style={styles.actionSection}>
                <h4 style={styles.actionTitle}>Review Your Certificate</h4>
                <p style={styles.actionText}>
                  Please review your certificate carefully. You can approve it to receive via email, 
                  or request modifications if you notice any errors.
                </p>
                
                <div style={styles.actions}>
                  <button 
                    onClick={handleApprove} 
                    style={styles.approveBtn}
                    disabled={status === 'approving'}
                  >
                    {status === 'approving' ? '⏳ Processing...' : '✅ Approve & Send to Email'}
                  </button>
                  
                  <button 
                    onClick={() => setShowModifyForm(!showModifyForm)} 
                    style={styles.modifyBtn}
                  >
                    ✏️ Request Modifications
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.noCertificate}>
            <div style={styles.noCertIcon}>⚠️</div>
            <h3>No Certificate Available</h3>
            <p>Your certificate hasn't been generated yet. Please complete all event requirements.</p>
            <button onClick={() => navigate('/dashboard')} style={styles.returnBtn}>
              ← Return to Dashboard
            </button>
          </div>
        )}

        {/* Modification Form */}
        {showModifyForm && !attendance.certificate_approved && (
          <div style={styles.modifyCard}>
            <h3 style={styles.cardTitle}>✏️ Request Certificate Modifications</h3>
            <p style={{fontSize: '14px', color: '#7f8c8d', marginBottom: '20px'}}>
              Please describe what needs to be changed in your certificate. Admin will review and regenerate it.
            </p>
            <form onSubmit={handleRequestModification} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name Correction (if needed)</label>
                <input
                  type="text"
                  value={modifications.name_correction}
                  onChange={(e) => setModifications({...modifications, name_correction: e.target.value})}
                  placeholder="Correct spelling of your name"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Reason for Modification *</label>
                <textarea
                  value={modifications.reason}
                  onChange={(e) => setModifications({...modifications, reason: e.target.value})}
                  placeholder="Explain what needs to be changed and why"
                  style={{...styles.input, minHeight: '100px'}}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Other Changes</label>
                <textarea
                  value={modifications.other_changes}
                  onChange={(e) => setModifications({...modifications, other_changes: e.target.value})}
                  placeholder="Any other changes needed"
                  style={{...styles.input, minHeight: '80px'}}
                />
              </div>

              <div style={styles.formActions}>
                <button type="submit" style={styles.submitBtn} disabled={status === 'requesting'}>
                  {status === 'requesting' ? 'Submitting...' : 'Submit Request'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModifyForm(false)} 
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Status Messages */}
        {status === 'approved' && (
          <div style={styles.successMessage}>
            ✅ Certificate approved and sent to your email!
          </div>
        )}

        {status === 'modification_requested' && (
          <div style={styles.infoMessage}>
            📝 Modification request submitted. Admin will review and regenerate your certificate.
          </div>
        )}

        {status === 'error' && (
          <div style={styles.errorMessage}>
            ❌ An error occurred. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    overflowY: 'auto',
    paddingBottom: '40px'
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '15px',
    transition: 'background-color 0.3s'
  },
  header: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    color: '#2c3e50',
    fontWeight: '700'
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    color: '#7f8c8d'
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  infoRow: {
    display: 'flex',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0'
  },
  infoLabel: {
    fontWeight: '600',
    color: '#34495e',
    minWidth: '120px'
  },
  infoValue: {
    color: '#2c3e50'
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  certificateCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  quickActions: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  viewBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s'
  },
  downloadBtnSmall: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s'
  },
  pdfPreview: {
    width: '100%',
    height: '700px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'auto',
    marginBottom: '20px',
    backgroundColor: '#525659'
  },
  pdfEmbed: {
    width: '100%',
    height: '100%',
    border: 'none'
  },
  pdfFallback: {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px dashed #dee2e6',
    marginBottom: '20px'
  },
  fallbackIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  fallbackTitle: {
    margin: '0 0 10px 0',
    fontSize: '20px',
    color: '#2c3e50'
  },
  fallbackText: {
    margin: '0 0 30px 0',
    fontSize: '14px',
    color: '#7f8c8d'
  },
  fallbackActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  viewBtnLarge: {
    padding: '14px 28px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  downloadBtnLarge: {
    padding: '14px 28px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  actionSection: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  actionTitle: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  actionText: {
    margin: '0 0 20px 0',
    fontSize: '14px',
    color: '#7f8c8d',
    lineHeight: '1.6'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  approveBtn: {
    flex: '1',
    padding: '16px 24px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minWidth: '200px',
    transition: 'background-color 0.3s'
  },
  modifyBtn: {
    flex: '1',
    padding: '16px 24px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minWidth: '200px',
    transition: 'background-color 0.3s'
  },
  approvedBanner: {
    backgroundColor: '#d4edda',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    marginTop: '20px',
    border: '2px solid #c3e6cb'
  },
  bannerIcon: {
    fontSize: '64px',
    marginBottom: '15px'
  },
  bannerTitle: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    color: '#155724',
    fontWeight: '700'
  },
  bannerText: {
    margin: '0 0 25px 0',
    fontSize: '16px',
    color: '#155724'
  },
  returnBtn: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  noCertificate: {
    backgroundColor: 'white',
    padding: '60px 30px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  noCertIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  modifyCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginTop: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '2px solid #f39c12'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px'
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
    fontFamily: 'inherit'
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px'
  },
  submitBtn: {
    padding: '14px 28px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: '1'
  },
  cancelBtn: {
    padding: '14px 28px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: '1'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600'
  },
  infoMessage: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600'
  },
  loading: {
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
