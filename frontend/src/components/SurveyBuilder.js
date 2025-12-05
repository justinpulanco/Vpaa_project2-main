import React, { useState } from 'react';
import API_BASE_URL from '../config';

export default function SurveyBuilder({ eventId, surveyToEdit, onClose, onSuccess }) {
  const [title, setTitle] = useState(surveyToEdit?.title || '');
  const [questions, setQuestions] = useState(
    surveyToEdit?.questions?.map((q, idx) => ({
      id: q.id || idx + 1,
      text: q.question || q.text || '',
      type: q.type || 'text'
    })) || [{ id: 1, text: '', type: 'text' }]
  );
  const isEditing = !!surveyToEdit;

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      text: '',
      type: 'text'
    }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const surveyData = {
      event: eventId,
      title,
      is_active: true,
      questions: questions.map((q, idx) => ({
        id: idx + 1,
        question: q.text,
        type: q.type
      }))
    };

    try {
      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `${API_BASE_URL}/api/surveys/${surveyToEdit.id}/`
        : `${API_BASE_URL}/api/surveys/`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(surveyData)
      });

      if (response.ok) {
        alert(isEditing ? '✅ Survey updated successfully!' : '✅ Survey created successfully!');
        onSuccess();
        onClose();
      } else {
        alert(isEditing ? '❌ Failed to update survey' : '❌ Failed to create survey');
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{isEditing ? '✏️ Edit Survey' : '📝 Create Survey'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Survey Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Feedback Survey"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.questionsSection}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Questions</h3>
              <button type="button" onClick={addQuestion} style={styles.addBtn}>
                ➕ Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} style={styles.questionCard}>
                <div style={styles.questionHeader}>
                  <span style={styles.questionNumber}>Q{index + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      style={styles.removeBtn}
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                  placeholder="Enter your question here..."
                  style={styles.questionInput}
                  required
                />

                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                  style={styles.select}
                >
                  <option value="text">Text Answer</option>
                  <option value="rating">Rating (1-5)</option>
                  <option value="yesno">Yes/No</option>
                </select>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Create Survey
            </button>
          </div>
        </form>
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
    zIndex: 2000,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },
  inputGroup: {
    padding: '20px 25px',
    borderBottom: '1px solid #e8e8e8'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#34495e'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e8e8e8',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  questionsSection: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 25px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  addBtn: {
    padding: '8px 16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  questionCard: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #e8e8e8'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#c8102e'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px'
  },
  questionInput: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '2px solid #e8e8e8',
    borderRadius: '6px',
    marginBottom: '10px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '13px',
    border: '2px solid #e8e8e8',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  footer: {
    display: 'flex',
    gap: '10px',
    padding: '20px 25px',
    borderTop: '2px solid #e8e8e8',
    backgroundColor: '#f8f9fa'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#c8102e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
