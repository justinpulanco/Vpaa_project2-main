import React, { useState, useEffect } from 'react';
import EventQRCode from './EventQRCode';
import SurveyBuilder from './SurveyBuilder';
import SurveyResults from './SurveyResults';
import API_BASE_URL from '../config';

export default function EventDetailsModal({ event, onClose }) {
  const [attendances, setAttendances] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showSurveyBuilder, setShowSurveyBuilder] = useState(false);
  const [showSurveyResults, setShowSurveyResults] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  useEffect(() => {
    if (activeTab === 'attendees') {
      fetchAttendances();
    } else if (activeTab === 'surveys') {
      fetchSurveys();
    }
  }, [activeTab, event.id]);

  const fetchAttendances = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${event.id}/attendees/`);
      const data = await response.json();
      setAttendances(data);
    } catch (err) {
      console.error('Failed to fetch attendances:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/surveys/by_event/?event_id=${event.id}`);
      const data = await response.json();
      setSurveys(data);
    } catch (err) {
      console.error('Failed to fetch surveys:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{event.title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.tabs}>
          <button 
            onClick={() => setActiveTab('details')} 
            style={activeTab === 'details' ? styles.activeTab : styles.tab}
          >
            📋 Details
          </button>
          <button 
            onClick={() => setActiveTab('qr')} 
            style={activeTab === 'qr' ? styles.activeTab : styles.tab}
          >
            📱 QR Code
          </button>
          <button 
            onClick={() => setActiveTab('surveys')} 
            style={activeTab === 'surveys' ? styles.activeTab : styles.tab}
          >
            📝 Surveys
          </button>
          <button 
            onClick={() => setActiveTab('attendees')} 
            style={activeTab === 'attendees' ? styles.activeTab : styles.tab}
          >
            👥 Attendees
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === 'details' && (
            <div>
              <div style={styles.infoRow}>
                <strong>Description:</strong>
                <p>{event.description || 'No description'}</p>
              </div>
              <div style={styles.infoRow}>
                <strong>Category:</strong>
                <span>{event.category}</span>
              </div>
              <div style={styles.infoRow}>
                <strong>Start:</strong>
                <span>{formatDate(event.start)}</span>
              </div>
              <div style={styles.infoRow}>
                <strong>End:</strong>
                <span>{formatDate(event.end)}</span>
              </div>
              <div style={styles.infoRow}>
                <strong>Status:</strong>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: event.status === 'ongoing' ? '#27ae60' : event.status === 'upcoming' ? '#3498db' : '#95a5a6',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {event.status?.toUpperCase()}
                </span>
              </div>
              <div style={styles.infoRow}>
                <strong>Capacity:</strong>
                <span>
                  {event.max_capacity > 0 
                    ? `${event.attendee_count || 0} / ${event.max_capacity}` 
                    : 'Unlimited'}
                </span>
              </div>
              <div style={styles.infoRow}>
                <strong>Certificate Template:</strong>
                <span>{event.certificate_template}</span>
              </div>
              {event.recurrence !== 'NONE' && (
                <>
                  <div style={styles.infoRow}>
                    <strong>Recurrence:</strong>
                    <span>{event.recurrence}</span>
                  </div>
                  {event.recurrence_end_date && (
                    <div style={styles.infoRow}>
                      <strong>Recurrence Ends:</strong>
                      <span>{formatDate(event.recurrence_end_date)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'qr' && (
            <EventQRCode eventId={event.id} />
          )}

          {activeTab === 'surveys' && (
            <div>
              <div style={styles.surveyHeader}>
                <h3 style={styles.sectionTitle}>Event Surveys</h3>
                <button 
                  onClick={() => setShowSurveyBuilder(true)}
                  style={styles.createSurveyBtn}
                >
                  ➕ Create Survey
                </button>
              </div>

              {surveys.length > 0 ? (
                <div style={styles.surveyList}>
                  {surveys.map((survey) => (
                    <div key={survey.id} style={styles.surveyCard}>
                      <div style={styles.surveyInfo}>
                        <h4 style={styles.surveyTitle}>{survey.title}</h4>
                        <p style={styles.surveyMeta}>
                          {survey.questions?.length || 0} questions • 
                          {survey.is_active ? ' Active' : ' Inactive'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSurveyId(survey.id);
                          setShowSurveyResults(true);
                        }}
                        style={styles.viewResultsBtn}
                      >
                        📊 View Results
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📝</div>
                  <h3>No surveys yet</h3>
                  <p>Create a survey to collect feedback from attendees</p>
                  <button 
                    onClick={() => setShowSurveyBuilder(true)}
                    style={styles.createSurveyBtn}
                  >
                    ➕ Create Survey
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendees' && (
            <div>
              {loading ? (
                <div style={styles.loading}>Loading attendees...</div>
              ) : attendances.length > 0 ? (
                <div style={styles.attendeeList}>
                  {attendances.map((att, idx) => (
                    <div key={idx} style={styles.attendeeCard}>
                      <div style={styles.attendeeInfo}>
                        <strong>{att.attendee.full_name}</strong>
                        <span style={styles.attendeeEmail}>{att.attendee.email}</span>
                        {att.attendee.student_id && (
                          <span style={styles.studentId}>ID: {att.attendee.student_id}</span>
                        )}
                      </div>
                      <div style={styles.attendeeStatus}>
                        {att.present ? (
                          <span style={styles.presentBadge}>✓ Present</span>
                        ) : (
                          <span style={styles.absentBadge}>✗ Absent</span>
                        )}
                        {att.certificate && (
                          <span style={styles.certBadge}>📄 Cert</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>No attendees yet</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Survey Builder Modal */}
      {showSurveyBuilder && (
        <SurveyBuilder
          eventId={event.id}
          onClose={() => setShowSurveyBuilder(false)}
          onSuccess={() => {
            fetchSurveys();
            setShowSurveyBuilder(false);
          }}
        />
      )}

      {/* Survey Results Modal */}
      {showSurveyResults && selectedSurveyId && (
        <SurveyResults
          surveyId={selectedSurveyId}
          onClose={() => {
            setShowSurveyResults(false);
            setSelectedSurveyId(null);
          }}
        />
      )}
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
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '85vh',
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
    fontSize: '22px',
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
  tabs: {
    display: 'flex',
    borderBottom: '2px solid #e8e8e8',
    backgroundColor: '#f8f9fa'
  },
  tab: {
    flex: 1,
    padding: '15px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#7f8c8d',
    transition: 'all 0.3s'
  },
  activeTab: {
    flex: 1,
    padding: '15px',
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#c8102e',
    borderBottom: '3px solid #c8102e'
  },
  content: {
    padding: '25px',
    overflowY: 'auto',
    flex: 1
  },
  infoRow: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  attendeeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  attendeeCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e8e8e8'
  },
  attendeeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  attendeeEmail: {
    fontSize: '13px',
    color: '#7f8c8d'
  },
  studentId: {
    fontSize: '12px',
    color: '#95a5a6'
  },
  attendeeStatus: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  presentBadge: {
    padding: '4px 10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600'
  },
  absentBadge: {
    padding: '4px 10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600'
  },
  certBadge: {
    padding: '4px 10px',
    backgroundColor: '#cce5ff',
    color: '#004085',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#95a5a6'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#95a5a6',
    fontSize: '14px'
  },
  surveyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  createSurveyBtn: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  surveyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  surveyCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e8e8e8'
  },
  surveyInfo: {
    flex: 1
  },
  surveyTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  surveyMeta: {
    margin: 0,
    fontSize: '13px',
    color: '#7f8c8d'
  },
  viewResultsBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
};
