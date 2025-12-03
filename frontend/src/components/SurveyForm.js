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
      <h3>{survey.title}</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        {survey.questions.map((q, idx) => (
          <div key={idx} style={styles.question}>
            <label>{q.question}</label>
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
  container: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  question: { display: 'flex', flexDirection: 'column', gap: '5px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
  select: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
  button: { padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default SurveyForm;
