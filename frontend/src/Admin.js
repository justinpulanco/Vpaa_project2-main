import React, { useState, useEffect } from "react";
import EventForm from "./components/EventForm";
import EventCard from "./components/EventCard";
import QuickStats from "./components/QuickStats";
import CategoryFilter from "./components/CategoryFilter";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import EventDetailsModal from "./components/EventDetailsModal";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const url = filter === 'all' 
        ? 'http://localhost:8000/api/events/'
        : `http://localhost:8000/api/events/filter_by_status/?status=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('Events fetched:', data);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingEvent 
        ? `http://localhost:8000/api/events/${editingEvent.id}/`
        : 'http://localhost:8000/api/events/';
      
      // Convert datetime-local to ISO format
      const eventData = {
        ...formData,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString()
      };
      
      const response = await fetch(url, {
        method: editingEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        alert('Event saved successfully!');
        fetchEvents();
        setShowForm(false);
        setEditingEvent(null);
      } else {
        const error = await response.json();
        alert(`Failed to save event: ${JSON.stringify(error)}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to save event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/api/events/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{margin: 0, fontSize: '24px', color: '#2c3e50'}}>Admin Dashboard</h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={() => setShowAnalytics(!showAnalytics)} style={{...styles.createBtn, backgroundColor: showAnalytics ? '#3498db' : '#95a5a6'}}>
            📊 Analytics
          </button>
          <button onClick={() => setShowForm(true)} style={styles.createBtn}>
            ➕ Create Event
          </button>
        </div>
      </div>

      {showAnalytics && <AnalyticsDashboard />}

      <QuickStats />

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <CategoryFilter selectedCategory={categoryFilter} onSelectCategory={setCategoryFilter} />

      <div style={styles.filterBar}>
        <button onClick={() => setFilter('all')} style={filter === 'all' ? styles.activeFilter : styles.filterBtn}>All</button>
        <button onClick={() => setFilter('upcoming')} style={filter === 'upcoming' ? styles.activeFilter : styles.filterBtn}>Upcoming</button>
        <button onClick={() => setFilter('ongoing')} style={filter === 'ongoing' ? styles.activeFilter : styles.filterBtn}>Ongoing</button>
        <button onClick={() => setFilter('completed')} style={filter === 'completed' ? styles.activeFilter : styles.filterBtn}>Completed</button>
      </div>

      <div style={styles.eventList}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading events...</p>
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id}>
              <EventCard
                event={event}
                showActions={true}
                onEdit={(e) => { setEditingEvent(e); setShowForm(true); }}
                onDelete={handleDelete}
                onSelect={(e) => setSelectedEventDetails(e)}
              />
            </div>
          ))
        ) : searchQuery || categoryFilter !== 'all' ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3>No events found</h3>
            <p>Try adjusting your search query</p>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <h3>No events yet</h3>
            <p>Create your first event to get started!</p>
            <button onClick={() => setShowForm(true)} style={styles.createBtn}>
              ➕ Create Event
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingEvent(null); }}
        />
      )}

      {selectedEventDetails && (
        <EventDetailsModal
          event={selectedEventDetails}
          onClose={() => setSelectedEventDetails(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: { padding: '0', maxWidth: '1200px', margin: '0 auto' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '25px',
    padding: '0 20px'
  },
  createBtn: { 
    padding: '12px 24px', 
    backgroundColor: '#c8102e', 
    color: 'white', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(200,16,46,0.3)',
    transition: 'all 0.3s ease'
  },
  filterBar: { 
    display: 'flex', 
    gap: '10px', 
    marginBottom: '25px',
    padding: '0 20px',
    flexWrap: 'wrap'
  },
  filterBtn: { 
    padding: '8px 18px', 
    backgroundColor: 'white', 
    border: '1.5px solid #ddd', 
    borderRadius: '20px', 
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s ease'
  },
  activeFilter: { 
    padding: '8px 18px', 
    backgroundColor: '#c8102e', 
    color: 'white', 
    border: '1.5px solid #c8102e', 
    borderRadius: '20px', 
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(200,16,46,0.3)'
  },
  eventList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px',
    padding: '0 20px',
    minHeight: '200px'
  },
  searchBar: {
    padding: '0 20px',
    marginBottom: '20px'
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '12px 20px',
    fontSize: '14px',
    border: '2px solid #e8e8e8',
    borderRadius: '25px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'white'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: '#999'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #c8102e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  }
};
