import React, { useState } from 'react';

const defaultCertificate = {
  title: 'Default Certificate',
  content: 'This certifies that the participant has completed the event successfully.',
};

const initialEvents = [
  { id: 1, name: 'Event 1', certificate: { ...defaultCertificate } },
  { id: 2, name: 'Event 2', certificate: { ...defaultCertificate } },
];

function Admin({ events, setEvents }) {
  const [newEventName, setNewEventName] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  const addEvent = () => {
    if (newEventName.trim() === '') return;
    const newEvent = {
      id: Date.now(),
      name: newEventName,
      certificate: { ...defaultCertificate },
    };
    setEvents([...events, newEvent]);
    setNewEventName('');
  };

  const updateCertificate = (eventId, field, value) => {
    setEvents(events.map(ev => ev.id === eventId ? {
      ...ev,
      certificate: {
        ...ev.certificate,
        [field]: value
      }
    } : ev));
  };

  return (
    <div className="admin">
      <h2>Admin Panel</h2>
      <input
        type="text"
        placeholder="New Event Name"
        value={newEventName}
        onChange={e => setNewEventName(e.target.value)}
      />
      <button onClick={addEvent}>Add Event</button>

      {events.map(event => (
        <div key={event.id} style={{border: '1px solid #ccc', margin: '10px 0', padding: '10px'}}>
          <h3>{event.name}</h3>
          <label>
            Certificate Title:
            <input
              type="text"
              value={event.certificate.title}
              onChange={e => updateCertificate(event.id, 'title', e.target.value)}
            />
          </label>
          <br />
          <label>
            Certificate Content:
            <textarea
              rows={3}
              value={event.certificate.content}
              onChange={e => updateCertificate(event.id, 'content', e.target.value)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}

function User({ events }) {
  const [currentEventId, setCurrentEventId] = useState(null);
  const [timeIn, setTimeIn] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [surveySent, setSurveySent] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  const handleTimeIn = () => {
    setTimeIn(new Date());
    setTimeOut(null);
    setSurveySent(false);
  };

  const handleTimeOut = () => {
    setTimeOut(new Date());
  };

  const sendSurvey = () => {
    if (!currentEventId) return;
    setSurveySent(true);
    setTasksCompleted(prev => prev + 1);
  };

  return (
    <div className="user">
      <h2>User Panel</h2>
      <select onChange={e => setCurrentEventId(Number(e.target.value))} value={currentEventId || ''}>
        <option value="" disabled>Select Event</option>
        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
      </select>

      <div>
        <button onClick={handleTimeIn} disabled={timeIn !== null && timeOut === null}>Time In</button>
        <button onClick={handleTimeOut} disabled={timeIn === null || timeOut !== null}>Time Out</button>
      </div>

      <div>
        <button onClick={sendSurvey} disabled={!timeOut || surveySent}>Send Survey</button>
      </div>

      <p>Tasks Completed: {tasksCompleted}</p>
      {tasksCompleted >= 3 && <p>Congratulations! You earned a certificate.</p>}
    </div>
  );
}

export default function App() {
  const [events, setEvents] = useState(initialEvents);

  return (
    <div className="app-container" style={{fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: 'auto', padding: 20}}>
      <h1>Event Management System</h1>
      <Admin events={events} setEvents={setEvents} />
      <hr />
      <User events={events} />
    </div>
  );
}
