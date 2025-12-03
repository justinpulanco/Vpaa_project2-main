import React from 'react';

export default function EventCapacity({ event }) {
  if (!event.max_capacity || event.max_capacity === 0) {
    return null; // Unlimited capacity
  }

  const attendeeCount = event.attendee_count || 0;
  const percentage = (attendeeCount / event.max_capacity) * 100;
  const isFull = attendeeCount >= event.max_capacity;
  const isAlmostFull = percentage >= 80;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>
          👥 Capacity: {attendeeCount} / {event.max_capacity}
        </span>
        {isFull && <span style={styles.fullBadge}>FULL</span>}
        {!isFull && isAlmostFull && <span style={styles.almostFullBadge}>Almost Full</span>}
      </div>
      
      <div style={styles.progressBar}>
        <div style={{
          ...styles.progressFill,
          width: `${Math.min(percentage, 100)}%`,
          backgroundColor: isFull ? '#e74c3c' : isAlmostFull ? '#f39c12' : '#27ae60'
        }} />
      </div>
      
      <div style={styles.stats}>
        <span style={styles.statText}>
          {event.max_capacity - attendeeCount} {isFull ? 'over capacity' : 'slots remaining'}
        </span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '10px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  fullBadge: {
    padding: '4px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  almostFullBadge: {
    padding: '4px 12px',
    backgroundColor: '#f39c12',
    color: 'white',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e8e8e8',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease'
  },
  stats: {
    marginTop: '8px',
    textAlign: 'right'
  },
  statText: {
    fontSize: '12px',
    color: '#7f8c8d',
    fontStyle: 'italic'
  }
};
