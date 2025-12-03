import React, { useState, useEffect } from 'react';

const QuickStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/events/stats/');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading stats...</div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Events', value: stats.total_events, icon: '📅', color: '#3498db' },
    { label: 'Upcoming', value: stats.upcoming, icon: '⏰', color: '#f39c12' },
    { label: 'Ongoing', value: stats.ongoing, icon: '🔴', color: '#27ae60' },
    { label: 'Completed', value: stats.completed, icon: '✅', color: '#95a5a6' },
    { label: 'Total Attendees', value: stats.total_attendees, icon: '👥', color: '#9b59b6' },
    { label: 'Certificates', value: stats.total_certificates, icon: '🎓', color: '#c8102e' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {statCards.map((stat, idx) => (
          <div key={idx} style={styles.card}>
            <div style={{...styles.icon, backgroundColor: stat.color + '20', color: stat.color}}>
              {stat.icon}
            </div>
            <div style={styles.content}>
              <div style={styles.value}>{stat.value}</div>
              <div style={styles.label}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '30px',
    padding: '0 20px'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#999'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #f0f0f0'
  },
  icon: {
    fontSize: '28px',
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1
  },
  value: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '4px'
  },
  label: {
    fontSize: '12px',
    color: '#7f8c8d',
    fontWeight: '500'
  }
};

export default QuickStats;
