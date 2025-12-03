import React, { useState, useEffect } from 'react';

export default function UserProfileCard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/profiles/me/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  if (!profile) {
    return null;
  }

  const getRoleBadge = (role) => {
    const badges = {
      'ADMIN': { color: '#e74c3c', icon: '👑', label: 'Administrator' },
      'PROF': { color: '#3498db', icon: '👨‍🏫', label: 'Professor' },
      'STUDENT': { color: '#27ae60', icon: '🎓', label: 'Student' }
    };
    return badges[role] || badges['STUDENT'];
  };

  const badge = getRoleBadge(profile.role);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            {profile.user.first_name?.[0] || profile.user.username?.[0] || '?'}
          </div>
          <div style={styles.info}>
            <h3 style={styles.name}>
              {profile.user.first_name} {profile.user.last_name}
            </h3>
            <p style={styles.email}>{profile.user.email}</p>
          </div>
        </div>
        
        <div style={{...styles.roleBadge, backgroundColor: badge.color}}>
          <span style={styles.roleIcon}>{badge.icon}</span>
          <span style={styles.roleLabel}>{badge.label}</span>
        </div>

        {profile.email_verified ? (
          <div style={styles.verifiedBadge}>
            ✓ Email Verified
          </div>
        ) : (
          <div style={styles.unverifiedBadge}>
            ⚠ Email Not Verified
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#c8102e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  info: {
    flex: 1
  },
  name: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  email: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d'
  },
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 15px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    marginBottom: '10px'
  },
  roleIcon: {
    fontSize: '18px'
  },
  roleLabel: {
    fontSize: '14px'
  },
  verifiedBadge: {
    padding: '8px 12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center'
  },
  unverifiedBadge: {
    padding: '8px 12px',
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center'
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#95a5a6'
  }
};
