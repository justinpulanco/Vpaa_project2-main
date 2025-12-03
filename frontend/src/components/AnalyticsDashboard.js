import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/events/analytics/');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📊 Analytics Dashboard</h3>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h4>Events by Category</h4>
          {analytics.events_by_category.map((item, idx) => (
            <div key={idx} style={styles.row}>
              <span>{item.category || 'Other'}</span>
              <span style={styles.badge}>{item.count}</span>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h4>Popular Events (Top 5)</h4>
          {analytics.popular_events.map((event, idx) => (
            <div key={idx} style={styles.row}>
              <span>{idx + 1}. {event.title}</span>
              <span style={styles.badge}>👥 {event.attendee_count}</span>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h4>Attendance Overview</h4>
          <div style={styles.statRow}>
            <span>Total Registered:</span>
            <strong>{analytics.attendance_rate.total_registered}</strong>
          </div>
          <div style={styles.statRow}>
            <span>Total Present:</span>
            <strong>{analytics.attendance_rate.total_present}</strong>
          </div>
          <div style={styles.statRow}>
            <span>Certificates Issued:</span>
            <strong>{analytics.attendance_rate.total_certificates}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    marginBottom: '30px'
  },
  title: {
    marginBottom: '20px',
    color: '#2c3e50'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  badge: {
    backgroundColor: '#c8102e',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px'
  }
};

export default AnalyticsDashboard;
