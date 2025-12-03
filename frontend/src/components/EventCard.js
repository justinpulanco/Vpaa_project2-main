import React from 'react';
import EventCapacity from './EventCapacity';

// EventCard component with capacity tracking and category badges
const EventCard = ({ event, onSelect, showActions = false, onEdit, onDelete, onExport }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      upcoming: '#3498db',
      ongoing: '#27ae60',
      completed: '#95a5a6'
    };
    const icons = {
      upcoming: '📅',
      ongoing: '🔴',
      completed: '✅'
    };
    return (
      <span style={{
        padding: '5px 14px',
        backgroundColor: colors[status] || '#95a5a6',
        color: 'white',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        {icons[status]} {status?.toUpperCase()}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const icons = {
      SEMINAR: '🎓',
      WORKSHOP: '🔧',
      CONFERENCE: '🎤',
      TRAINING: '📚',
      MEETING: '💼',
      OTHER: '📌'
    };
    return (
      <span style={{
        padding: '5px 12px',
        backgroundColor: '#f0f0f0',
        color: '#666',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        {icons[category]} {category}
      </span>
    );
  };

  return (
    <div 
      style={{...styles.card, ...(isHovered ? styles.cardHover : {})}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.title}>{event.title}</h3>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap'}}>
            {event.status && getStatusBadge(event.status)}
            {event.category && getCategoryBadge(event.category)}
            {event.attendee_count !== undefined && (
              <span style={{ color: '#666', fontSize: '13px' }}>
                👥 {event.attendee_count}{event.max_capacity > 0 ? `/${event.max_capacity}` : ''} attendees
              </span>
            )}
          </div>
        </div>
        {showActions && (
          <div style={styles.actions}>
            <button onClick={() => onEdit(event)} style={styles.editBtn}>✏️ Edit</button>
            <button onClick={() => onDelete(event.id)} style={styles.deleteBtn}>🗑️ Delete</button>
          </div>
        )}
      </div>
      <p style={styles.description}>{event.description}</p>
      <div style={styles.dateInfo}>
        <div>
          <strong>Start:</strong> {formatDate(event.start)}
        </div>
        <div>
          <strong>End:</strong> {formatDate(event.end)}
        </div>
      </div>
      
      <EventCapacity event={event} />
      
      {onSelect && (
        <button onClick={() => onSelect(event)} style={styles.selectBtn}>
          View Details
        </button>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px 25px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8e8e8',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    maxWidth: '800px',
    margin: '0 auto 15px',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 20px rgba(200,16,46,0.15)',
    borderColor: '#c8102e'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    margin: 0,
    color: '#c8102e',
    fontSize: '18px',
    fontWeight: '600'
  },
  description: {
    color: '#666',
    marginBottom: '12px',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  dateInfo: {
    fontSize: '13px',
    color: '#777',
    marginBottom: '12px',
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  exportBtn: {
    padding: '6px 12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  selectBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default EventCard;
