import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TimeInOut from './components/TimeInOut';
import ProgressBar from './components/ProgressBar';
import SurveyForm from './components/SurveyForm';
import CertificateActions from './components/CertificateActions';
import API_BASE_URL from './config';

export default function EventCheckIn() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    if (attendance && event) {
      checkCompletion();
      fetchSurveys();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance, event]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/`);
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      console.error('Failed to fetch event:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    if (!event) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/surveys/by_event/?event_id=${event.id}`);
      const data = await response.json();
      setSurveys(data);
    } catch (err) {
      console.error('Failed to fetch surveys:', err);
    }
  };

  const checkCompletion = async () => {
    if (!attendance) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendance.id}/check_completion/`);
      const data = await response.json();
      setCompletionStatus(data);
    } catch (err) {
      console.error('Failed to check completion:', err);
    }
  };

  const handleTimeOut = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendances/${attendance.id}/time_out/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        alert('Time out successful! Please complete the survey.');
        checkCompletion();
      }
    } catch (err) {
      alert('Failed to time out');
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={styles.error}>
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.eventTitle}>{event.title}</h1>
        <p style={styles.eventDate}>
          {new Date(event.start).toLocaleDateString()} • {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {!attendance ? (
        <TimeInOut event={event} onComplete={(data) => setAttendance(data)} />
      ) : (
        <div>
          <ProgressBar currentStep={
            !completionStatus?.time_out ? 2 :
            !completionStatus?.survey_completed ? 3 :
            completionStatus?.certificate_ready ? 4 : 3
          } />
          
          {!completionStatus?.time_out && (
            <div style={styles.stepCard}>
              <h4>Step 2: Time Out</h4>
              <p>Click the button below to mark your time out from the event.</p>
              <button onClick={handleTimeOut} style={styles.timeOutBtn}>
                ⏰ Time Out Now
              </button>
            </div>
          )}

          {completionStatus?.time_out && !completionStatus?.survey_completed && (
            completionStatus?.event_has_survey ? (
              surveys.length > 0 ? (
                <SurveyForm
                  survey={surveys[0]}
                  attendanceId={attendance.id}
                  onComplete={checkCompletion}
                />
              ) : (
                <div style={styles.stepCard}>
                  <h4>Step 3: Survey</h4>
                  <p>⏳ Loading survey...</p>
                </div>
              )
            ) : (
              <div style={styles.successCard}>
                <h4>✅ All Tasks Complete!</h4>
                <p>No survey required for this event. Generating your certificate...</p>
              </div>
            )
          )}

          {completionStatus?.survey_completed && completionStatus?.certificate_ready && (
            <div style={styles.successCard}>
              <h3 style={{ color: '#155724', marginBottom: '15px' }}>🎉 Congratulations!</h3>
              <p style={{ marginBottom: '20px' }}>You have completed all tasks. Your certificate is ready!</p>
              <CertificateActions 
                attendanceId={attendance.id} 
                attendeeEmail={attendance.attendee?.email || ''} 
                attendeeName={attendance.attendee?.full_name || 'Attendee'}
                eventTitle={event?.title || 'Event'}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
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
  stepCard: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
    textAlign: 'center'
  },
  successCard: {
    backgroundColor: '#d4edda',
    padding: '30px',
    borderRadius: '8px',
    marginTop: '20px',
    textAlign: 'center'
  },
  timeOutBtn: {
    marginTop: '10px',
    padding: '12px 24px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
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
    minHeight: '100vh',
    textAlign: 'center',
    color: '#e74c3c'
  }
};
