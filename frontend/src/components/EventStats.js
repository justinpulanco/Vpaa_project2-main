import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const EventStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/stats/`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div style={styles.container}>
      <h3>System Statistics</h3>
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.number}>{stats.total_events}</div>
          <div style={styles.label}>Total Events</div>
        </div>
        <div style={styles.card}>
          <div style={styles.number}>{stats.upcoming}</div>
          <div style={styles.label}>Upcoming</div>
        </div>
        <div style={styles.card}>
          <div style={styles.number}>{stats.ongoing}</div>
          <div style={styles.label}>Ongoing</div>
        </div>
        <div style={styles.card}>
          <div style={styles.number}>{stats.completed}</div>
          <div style={styles.label}>Completed</div>
        </div>
        <div style={styles.card}>
          <div style={styles.number}>{stats.total_attendees}</div>
          <div style={styles.label}>Total Attendees</div>
        </div>
        <div style={styles.card}>
          <div style={styles.number}>{stats.total_certificates}</div>
          <div style={styles.label}>Certificates Issued</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #e9ecef'
  },
  number: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '5px'
  },
  label: {
    fontSize: '14px',
    color: '#6c757d'
  }
};

export default EventStats;
