import React, { useState, useEffect } from "react";
import EventCard from "./components/EventCard";
import TimeInOut from "./components/TimeInOut";
import SurveyForm from "./components/SurveyForm";
import ProgressBar from "./components/ProgressBar";
import CertificateActions from "./components/CertificateActions";
import QRScanner from "./components/QRScanner";
import UserProfileCard from "./components/UserProfileCard";
import MyCertificates from "./components/MyCertificates";

export default function User() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'certificates'

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (attendance) {
      checkCompletion();
      fetchSurveys();
    }
  }, [attendance]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/events/');
      const data = await response.json();
      console.log('Events fetched:', data);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]);
    }
  };

  const fetchSurveys = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(`http://localhost:8000/api/surveys/by_event/?event_id=${selectedEvent.id}`);
      const data = await response.json();
      setSurveys(data);
    } catch (err) {
      console.error('Failed to fetch surveys:', err);
    }
  };

  const checkCompletion = async () => {
    if (!attendance) return;
    try {
      const response = await fetch(`http://localhost:8000/api/attendances/${attendance.id}/check_completion/`);
      const data = await response.json();
      setCompletionStatus(data);
    } catch (err) {
      console.error('Failed to check completion:', err);
    }
  };

  const handleTimeOut = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/attendances/${attendance.id}/time_out/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setTimedOut(true);
        alert('Time out successful! Please complete the survey.');
        checkCompletion();
      }
    } catch (err) {
      alert('Failed to time out');
    }
  };

  const handleQRScan = (data) => {
    setAttendance(data);
    setShowQRScanner(false);
    // Fetch the event details
    if (data.event) {
      setSelectedEvent(data.event);
    }
  };

  return (
    <div style={styles.container}>
      <UserProfileCard />
      
      <div style={styles.header}>
        <h2 style={{margin: 0}}>User Dashboard</h2>
        <button onClick={() => setShowQRScanner(!showQRScanner)} style={styles.qrBtn}>
          📱 {showQRScanner ? 'Hide' : 'QR Check-in'}
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button 
          onClick={() => { setActiveTab('events'); setSelectedEvent(null); setAttendance(null); }}
          style={activeTab === 'events' ? styles.activeTab : styles.tab}
        >
          📅 Events
        </button>
        <button 
          onClick={() => setActiveTab('certificates')}
          style={activeTab === 'certificates' ? styles.activeTab : styles.tab}
        >
          📄 My Certificates
        </button>
      </div>

      {showQRScanner && activeTab === 'events' && (
        <QRScanner onScan={handleQRScan} />
      )}

      {activeTab === 'certificates' ? (
        <MyCertificates />
      ) : !selectedEvent ? (
        <div>
          <h3>Available Events</h3>
          {events && events.length > 0 ? (
            events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(e) => setSelectedEvent(e)}
              />
            ))
          ) : (
            <p>No events available</p>
          )}
        </div>
      ) : (
        <div>
          <button onClick={() => { setSelectedEvent(null); setAttendance(null); }} style={styles.backBtn}>
            ← Back to Events
          </button>

          <h3>{selectedEvent.title}</h3>

          {!attendance ? (
            <TimeInOut event={selectedEvent} onComplete={(data) => setAttendance(data)} />
          ) : (
            <div>
              <ProgressBar currentStep={
                !completionStatus?.time_out ? 2 :
                !completionStatus?.survey_completed ? 3 :
                completionStatus?.certificate_ready ? 4 : 3
              } />
              
              {!completionStatus?.time_out && (
                <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
                  <h4>Step 2: Time Out</h4>
                  <p>Click the button below to mark your time out from the event.</p>
                  <button onClick={handleTimeOut} style={styles.timeOutBtn}>
                    ⏰ Time Out Now
                  </button>
                </div>
              )}

              {completionStatus?.time_out && !completionStatus?.survey_completed && (
                surveys.length > 0 ? (
                  <SurveyForm
                    survey={surveys[0]}
                    attendanceId={attendance.id}
                    onComplete={checkCompletion}
                  />
                ) : (
                  <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
                    <p>✅ No survey required for this event. Your certificate is ready!</p>
                  </div>
                )
              )}

              {completionStatus?.survey_completed && completionStatus?.certificate_ready && (
                <div style={{ backgroundColor: '#d4edda', padding: '30px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
                  <h3 style={{ color: '#155724', marginBottom: '15px' }}>🎉 Congratulations!</h3>
                  <p style={{ marginBottom: '20px' }}>You have completed all tasks. Your certificate is ready!</p>
                  <CertificateActions 
                    attendanceId={attendance.id} 
                    attendeeEmail={attendance.attendee?.email || ''} 
                    attendeeName={attendance.attendee?.full_name || 'Attendee'}
                    eventTitle={selectedEvent?.title || 'Event'}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '0', maxWidth: '1000px', margin: '0 auto' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px',
    padding: '0 20px'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    padding: '0 20px',
    borderBottom: '2px solid #e8e8e8'
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#7f8c8d',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  activeTab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#c8102e',
    border: 'none',
    borderBottom: '3px solid #c8102e',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  qrBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  backBtn: { padding: '8px 16px', marginBottom: '20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  statusCard: { backgroundColor: '#ecf0f1', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  timeOutBtn: { marginTop: '10px', padding: '12px 24px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};
