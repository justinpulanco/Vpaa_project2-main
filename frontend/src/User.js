import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "./components/EventCard";
import TimeInOut from "./components/TimeInOut";
import SurveyForm from "./components/SurveyForm";
import ProgressBar from "./components/ProgressBar";
import CertificateActions from "./components/CertificateActions";
import QRScanner from "./components/QRScanner";
import UserProfileCard from "./components/UserProfileCard";
import MyCertificates from "./components/MyCertificates";
import UserEventQR from "./components/UserEventQR";
import API_BASE_URL from './config';

export default function User() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedSemester, setSelectedSemester] = useState('1ST');
  const [enrolledExpanded, setEnrolledExpanded] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (attendance && selectedEvent) {
      checkCompletion();
      fetchSurveys();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance, selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/`);
      const data = await response.json();
      console.log('Events fetched:', data);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]);
    }
  };

  const getEventInitial = (title) => {
    return title.charAt(0).toUpperCase();
  };

  const getEventColor = (index) => {
    const colors = ['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#2ecc71', '#34495e'];
    return colors[index % colors.length];
  };

  const filteredEvents = events.filter(event => {
    if (activeTab !== 'events') return false;
    return event.semester === selectedSemester;
  });

  const fetchSurveys = async () => {
    if (!selectedEvent) return;
    try {
      console.log('Fetching surveys for event:', selectedEvent.id);
      const response = await fetch(`${API_BASE_URL}/api/surveys/by_event/?event_id=${selectedEvent.id}`);
      const data = await response.json();
      console.log('Surveys fetched:', data);
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
      
      // If certificate is ready and not yet reviewed, redirect to review page
      if (data.certificate_ready && !data.certificate_reviewed) {
        setTimeout(() => {
          navigate(`/user/attendance/${attendance.id}`);
        }, 2000); // 2 second delay to show success message
      }
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

  const handleQRScan = (data) => {
    setAttendance(data);
    setShowQRScanner(false);
    // Fetch the event details
    if (data.event) {
      setSelectedEvent(data.event);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <UserProfileCard />
      
      <div style={styles.mainLayout}>
        {/* Left Sidebar */}
        <div style={styles.sidebar}>
          {/* Enrolled Section */}
          <div style={styles.enrolledSection}>
            <button 
              onClick={() => setEnrolledExpanded(!enrolledExpanded)}
              style={styles.enrolledHeader}
            >
              <span style={styles.enrolledIcon}>🎓</span>
              <span style={styles.enrolledText}>Enrolled</span>
              <span style={styles.expandIcon}>{enrolledExpanded ? '▼' : '▶'}</span>
            </button>
            
            {enrolledExpanded && (
              <div style={styles.enrolledContent}>
                {/* Semester Tabs */}
                <div style={styles.semesterTabs}>
                  <button
                    onClick={() => setSelectedSemester('1ST')}
                    style={selectedSemester === '1ST' ? styles.semesterTabActive : styles.semesterTab}
                  >
                    1st Sem
                  </button>
                  <button
                    onClick={() => setSelectedSemester('2ND')}
                    style={selectedSemester === '2ND' ? styles.semesterTabActive : styles.semesterTab}
                  >
                    2nd Sem
                  </button>
                </div>

                {/* Event List */}
                <div style={styles.eventList}>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                      <div
                        key={event.id}
                        onClick={() => { setSelectedEvent(event); setActiveTab('events'); }}
                        style={{
                          ...styles.eventItem,
                          backgroundColor: selectedEvent?.id === event.id ? '#f0f8ff' : 'white'
                        }}
                      >
                        <div style={{...styles.eventInitial, backgroundColor: getEventColor(index)}}>
                          {getEventInitial(event.title)}
                        </div>
                        <div style={styles.eventInfo}>
                          <div style={styles.eventTitle}>{event.title}</div>
                          <div style={styles.eventDetails}>
                            {new Date(event.start).toLocaleDateString()} • {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.noEvents}>
                      <p>No events for this semester</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* To-do Section */}
          <div style={styles.todoSection}>
            <div style={styles.todoHeader}>
              <span style={styles.todoIcon}>📋</span>
              <span style={styles.todoText}>To-do</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
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
              onClick={() => setActiveTab('qrcodes')}
              style={activeTab === 'qrcodes' ? styles.activeTab : styles.tab}
            >
              📱 My QR Codes
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
          ) : activeTab === 'qrcodes' ? (
            <div>
              <h3 style={{ padding: '0 20px' }}>My Event QR Codes</h3>
              <p style={{ padding: '0 20px', color: '#7f8c8d', fontSize: '14px' }}>
                Show these QR codes at events for quick check-in
              </p>
              {events && events.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
                  {events.map(event => (
                    <UserEventQR key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#95a5a6' }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>📱</div>
                  <h3>No Events Available</h3>
                  <p>QR codes will appear here when events are created</p>
                </div>
              )}
            </div>
          ) : !selectedEvent ? (
            <div>
              <h3>Available Events</h3>
              {filteredEvents && filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={(e) => setSelectedEvent(e)}
                  />
                ))
              ) : (
                <p>No events available for this semester</p>
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
                    completionStatus?.event_has_survey ? (
                      surveys.length > 0 ? (
                        <SurveyForm
                          survey={surveys[0]}
                          attendanceId={attendance.id}
                          onComplete={checkCompletion}
                        />
                      ) : (
                        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
                          <h4>Step 3: Survey</h4>
                          <p>⏳ Loading survey...</p>
                        </div>
                      )
                    ) : (
                      <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
                        <h4>✅ All Tasks Complete!</h4>
                        <p>No survey required for this event. Generating your certificate...</p>
                      </div>
                    )
                  )}

                  {completionStatus?.survey_completed && completionStatus?.certificate_ready && (
                    <div style={{ backgroundColor: '#d4edda', padding: '30px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
                      <h3 style={{ color: '#155724', marginBottom: '15px' }}>🎉 Congratulations!</h3>
                      <p style={{ marginBottom: '20px' }}>You have completed all tasks. Your certificate is ready!</p>
                      
                      {!completionStatus?.certificate_reviewed ? (
                        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '15px' }}>
                          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
                          <h4 style={{ color: '#856404', marginBottom: '10px' }}>Certificate Review Required</h4>
                          <p style={{ color: '#856404', marginBottom: '15px' }}>
                            Redirecting you to review your certificate...
                          </p>
                          <div style={styles.spinner}></div>
                        </div>
                      ) : completionStatus?.certificate_approved ? (
                        <CertificateActions 
                          attendanceId={attendance.id} 
                          attendeeEmail={attendance.attendee?.email || ''} 
                          attendeeName={attendance.attendee?.full_name || 'Attendee'}
                          eventTitle={selectedEvent?.title || 'Event'}
                        />
                      ) : (
                        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '15px' }}>
                          <h4 style={{ color: '#856404', marginBottom: '10px' }}>⏳ Pending Review</h4>
                          <p style={{ color: '#856404', marginBottom: '15px' }}>
                            Your certificate is waiting for your review and approval.
                          </p>
                          <button 
                            onClick={() => navigate(`/user/attendance/${attendance.id}`)}
                            style={{
                              padding: '12px 24px',
                              backgroundColor: '#f39c12',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '16px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            📋 Review Certificate Now
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { 
    padding: '0', 
    maxWidth: '100%', 
    margin: '0 auto',
    backgroundColor: '#f5f5f5'
  },
  mainLayout: {
    display: 'flex',
    gap: '0',
    minHeight: '100vh'
  },
  sidebar: {
    width: '350px',
    backgroundColor: 'white',
    borderRight: '1px solid #e0e0e0',
    height: '100vh',
    overflowY: 'auto',
    position: 'sticky',
    top: 0
  },
  enrolledSection: {
    borderBottom: '1px solid #e0e0e0'
  },
  enrolledHeader: {
    width: '100%',
    padding: '16px 20px',
    backgroundColor: 'white',
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  enrolledIcon: {
    fontSize: '20px'
  },
  enrolledText: {
    flex: 1,
    textAlign: 'left',
    color: '#2c3e50',
    fontWeight: '600'
  },
  expandIcon: {
    fontSize: '12px',
    color: '#7f8c8d'
  },
  enrolledContent: {
    padding: '0'
  },
  semesterTabs: {
    display: 'flex',
    padding: '12px 16px',
    gap: '8px',
    backgroundColor: '#f8f9fa'
  },
  semesterTab: {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6c757d',
    transition: 'all 0.2s'
  },
  semesterTabActive: {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: '#007bff',
    border: '1px solid #007bff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    color: 'white',
    transition: 'all 0.2s'
  },
  eventList: {
    padding: '8px 0'
  },
  eventItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s'
  },
  eventInitial: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0
  },
  eventInfo: {
    flex: 1,
    minWidth: 0
  },
  eventTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  eventDetails: {
    fontSize: '12px',
    color: '#7f8c8d',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  noEvents: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: '14px'
  },
  todoSection: {
    padding: '16px 20px',
    borderBottom: '1px solid #e0e0e0'
  },
  todoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px'
  },
  todoIcon: {
    fontSize: '20px'
  },
  todoText: {
    color: '#2c3e50',
    fontWeight: '600'
  },
  mainContent: {
    flex: 1,
    padding: '0',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%'
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px',
    padding: '20px'
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
  backBtn: { 
    padding: '8px 16px', 
    marginBottom: '20px', 
    backgroundColor: '#95a5a6', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  },
  statusCard: { 
    backgroundColor: '#ecf0f1', 
    padding: '20px', 
    borderRadius: '8px', 
    marginBottom: '20px' 
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
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #f39c12',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  }
};
