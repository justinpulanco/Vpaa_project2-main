import React, { useState, useEffect } from 'react';

const SurveyForm = ({ survey, attendanceId, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/survey-responses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attendance: attendanceId,
          survey: survey.id,
          answers: answers
        })
      });

      if (response.ok) {
        alert('Survey submitted successfully!');
        onComplete();
      }
    } catch (err) {
      alert('Failed to submit survey');
    } finally {
      setLoading(false);
    }
  };

  if (!survey || !survey.questions || !Array.isArray(survey.questions) || survey.questions.length === 0) {
    return (
      <div style={styles.container}>
        <h3>Survey</h3>
        <p>No survey questions available for this event yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📝 {survey.title}</h3>
        <p style={styles.subtitle}>Please answer all questions to complete the event</p>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        {survey.questions.map((q, idx) => (
          <div key={idx} style={styles.question}>
            <label style={styles.label}>
              <span style={styles.questionNumber}>Q{idx + 1}.</span> {q.question}
            </label>
            {q.type === 'text' && (
              <input
                type="text"
                onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                required
                style={styles.input}
              />
            )}
            {q.type === 'rating' && (
              <select
                onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                required
                style={styles.select}
              >
                <option value="">Select rating</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            )}
            {q.type === 'yesno' && (
              <select
                onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                required
                style={styles.select}
              >
                <option value="">Select answer</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
          </div>
        ))}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { 
    backgroundColor: '#fff', 
    padding: '25px', 
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  header: {
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e8e8e8'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  question: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e8e8e8'
  },
  label: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#34495e'
  },
  questionNumber: {
    color: '#c8102e',
    fontWeight: '700',
    marginRight: '5px'
  },
  input: { 
    padding: '12px', 
    border: '2px solid #e8e8e8', 
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  select: { 
    padding: '12px', 
    border: '2px solid #e8e8e8', 
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none'
  },
  button: { 
    padding: '14px', 
    backgroundColor: '#27ae60', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'background-color 0.3s'
  }
};

export default SurveyForm;
