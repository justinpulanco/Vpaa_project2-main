import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

export default function SurveyResults({ surveyId, onClose }) {
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId]);

  const fetchSurveyData = async () => {
    try {
      // Fetch survey details
      const surveyRes = await fetch(`${API_BASE_URL}/api/surveys/${surveyId}/`);
      const surveyData = await surveyRes.json();
      setSurvey(surveyData);

      // Fetch responses
      const responsesRes = await fetch(`${API_BASE_URL}/api/survey-responses/?survey=${surveyId}`);
      const responsesData = await responsesRes.json();
      setResponses(responsesData);
    } catch (err) {
      console.error('Failed to fetch survey data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionStats = (questionId) => {
    const answers = responses.map(r => r.answers[questionId]).filter(Boolean);
    return {
      total: answers.length,
      answers: answers
    };
  };

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.loading}>Loading survey results...</div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return null;
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>📊 Survey Results</h2>
            <p style={styles.subtitle}>{survey.title}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.content}>
          <div style={styles.statsCard}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>{responses.length}</div>
              <div style={styles.statLabel}>Total Responses</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>{survey.questions?.length || 0}</div>
              <div style={styles.statLabel}>Questions</div>
            </div>
          </div>

          {survey.questions && survey.questions.map((question, idx) => {
            const stats = getQuestionStats(question.id);
            
            return (
              <div key={question.id} style={styles.questionCard}>
                <h3 style={styles.questionTitle}>
                  Q{idx + 1}: {question.question}
                </h3>
                <div style={styles.questionType}>
                  Type: {question.type}
                </div>

                <div style={styles.answersSection}>
                  <div style={styles.answerCount}>
                    {stats.total} {stats.total === 1 ? 'response' : 'responses'}
                  </div>

                  {stats.answers.length > 0 ? (
                    <div style={styles.answersList}>
                      {stats.answers.map((answer, ansIdx) => (
                        <div key={ansIdx} style={styles.answerItem}>
                          <span style={styles.answerNumber}>{ansIdx + 1}.</span>
                          <span style={styles.answerText}>{answer}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.noAnswers}>No responses yet</div>
                  )}
                </div>
              </div>
            );
          })}

          {responses.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📝</div>
              <h3>No responses yet</h3>
              <p>Responses will appear here once attendees complete the survey.</p>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.closeButton}>
            Close
          </button>
        </div>
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
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 25px',
    borderBottom: '2px solid #e8e8e8',
    backgroundColor: '#f8f9fa'
  },
  title: {
    margin: '0 0 5px 0',
    fontSize: '22px',
    color: '#2c3e50'
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#95a5a6',
    padding: '5px 10px'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '25px'
  },
  loading: {
    padding: '60px',
    textAlign: 'center',
    color: '#95a5a6'
  },
  statsCard: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px'
  },
  stat: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e8e8e8'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#c8102e',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#7f8c8d',
    fontWeight: '500'
  },
  questionCard: {
    backgroundColor: 'white',
    border: '2px solid #e8e8e8',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  },
  questionTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  questionType: {
    fontSize: '12px',
    color: '#95a5a6',
    marginBottom: '15px',
    fontStyle: 'italic'
  },
  answersSection: {
    marginTop: '15px'
  },
  answerCount: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: '10px'
  },
  answersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  answerItem: {
    display: 'flex',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '14px'
  },
  answerNumber: {
    fontWeight: '600',
    color: '#c8102e',
    minWidth: '25px'
  },
  answerText: {
    color: '#34495e',
    flex: 1
  },
  noAnswers: {
    padding: '20px',
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#95a5a6'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  footer: {
    padding: '15px 25px',
    borderTop: '2px solid #e8e8e8',
    backgroundColor: '#f8f9fa',
    textAlign: 'center'
  },
  closeButton: {
    padding: '12px 40px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
