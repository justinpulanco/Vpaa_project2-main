import React, { useState, useEffect } from 'react';

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    category: 'OTHER',
    max_capacity: 0,
    certificate_template: 'default',
    recurrence: 'NONE',
    recurrence_end_date: '',
    semester: 'NONE',
    academic_year: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        start: event.start.slice(0, 16),
        end: event.end.slice(0, 16),
        category: event.category || 'OTHER',
        max_capacity: event.max_capacity || 0,
        certificate_template: event.certificate_template || 'default',
        recurrence: event.recurrence || 'NONE',
        recurrence_end_date: event.recurrence_end_date ? event.recurrence_end_date.slice(0, 16) : '',
        semester: event.semester || 'NONE',
        academic_year: event.academic_year || ''
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              style={styles.textarea}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label>Start Date & Time</label>
            <input
              type="datetime-local"
              value={formData.start}
              onChange={(e) => setFormData({...formData, start: e.target.value})}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label>End Date & Time</label>
            <input
              type="datetime-local"
              value={formData.end}
              onChange={(e) => setFormData({...formData, end: e.target.value})}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={styles.input}
            >
              <option value="SEMINAR">🎓 Seminar</option>
              <option value="WORKSHOP">🔧 Workshop</option>
              <option value="CONFERENCE">🎤 Conference</option>
              <option value="TRAINING">📚 Training</option>
              <option value="MEETING">💼 Meeting</option>
              <option value="OTHER">📌 Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Max Capacity (0 = Unlimited)</label>
            <input
              type="number"
              min="0"
              value={formData.max_capacity}
              onChange={(e) => setFormData({...formData, max_capacity: parseInt(e.target.value) || 0})}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Semester</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({...formData, semester: e.target.value})}
              style={styles.input}
            >
              <option value="NONE">Not Applicable</option>
              <option value="1ST">1st Semester</option>
              <option value="2ND">2nd Semester</option>
              <option value="SUMMER">Summer</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Academic Year (e.g., 2024-2025)</label>
            <input
              type="text"
              value={formData.academic_year}
              onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
              placeholder="2024-2025"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Certificate Template</label>
            <select
              value={formData.certificate_template}
              onChange={(e) => setFormData({...formData, certificate_template: e.target.value})}
              style={styles.input}
            >
              <option value="default">Default Template</option>
              <option value="modern">Modern Template</option>
              <option value="classic">Classic Template</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Recurrence</label>
            <select
              value={formData.recurrence}
              onChange={(e) => setFormData({...formData, recurrence: e.target.value})}
              style={styles.input}
            >
              <option value="NONE">No Recurrence</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          {formData.recurrence !== 'NONE' && (
            <div style={styles.formGroup}>
              <label>Recurrence End Date</label>
              <input
                type="datetime-local"
                value={formData.recurrence_end_date}
                onChange={(e) => setFormData({...formData, recurrence_end_date: e.target.value})}
                style={styles.input}
              />
            </div>
          )}
          
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitBtn}>
              {event ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default EventForm;
