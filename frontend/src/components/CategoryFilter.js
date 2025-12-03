import React from 'react';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { value: 'all', label: 'All', icon: '📋' },
    { value: 'SEMINAR', label: 'Seminar', icon: '🎓' },
    { value: 'WORKSHOP', label: 'Workshop', icon: '🔧' },
    { value: 'CONFERENCE', label: 'Conference', icon: '🎤' },
    { value: 'TRAINING', label: 'Training', icon: '📚' },
    { value: 'MEETING', label: 'Meeting', icon: '💼' },
    { value: 'OTHER', label: 'Other', icon: '📌' }
  ];

  return (
    <div style={styles.container}>
      {categories.map(cat => (
        <button
          key={cat.value}
          onClick={() => onSelectCategory(cat.value)}
          style={selectedCategory === cat.value ? styles.activeBtn : styles.btn}
        >
          {cat.icon} {cat.label}
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    padding: '0 20px'
  },
  btn: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1.5px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s ease'
  },
  activeBtn: {
    padding: '8px 16px',
    backgroundColor: '#c8102e',
    color: 'white',
    border: '1.5px solid #c8102e',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(200,16,46,0.3)'
  }
};

export default CategoryFilter;
