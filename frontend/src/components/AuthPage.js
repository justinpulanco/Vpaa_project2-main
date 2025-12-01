import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    try {
      const url = isSignIn
        ? 'http://localhost:8000/api/auth/login/'
        : 'http://localhost:8000/api/auth/register/';

      const requestBody = isSignIn
        ? { email, password, stay_signed_in: staySignedIn }
        : { username: email.split('@')[0], email, password, first_name: '', last_name: '' };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || (isSignIn ? 'Login failed' : 'Registration failed'));
      }

      if (data.token) localStorage.setItem('token', data.token);

      onLogin(data.user || data);
      navigate('/dashboard');

    } catch (err) {
      setError(err.message || `Error during ${isSignIn ? 'login' : 'registration'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'Arial, sans-serif', position: 'relative' },
    backgroundImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("/college-building.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 2 },
    logoContainer: { position: 'absolute', top: '20px', left: '20px', zIndex: 4 },
    logo: { width: '120px', height: '120px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' },
    formContainer: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', width: '100%', maxWidth: '400px', zIndex: 3, position: 'relative' },
    title: { textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '14px', color: '#555', fontWeight: '500' },
    input: { padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', transition: 'border-color 0.3s' },
    rememberMe: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-10px' },
    checkbox: { width: '16px', height: '16px' },
    rememberMeLabel: { fontSize: '14px', color: '#555' },
    submitButton: { backgroundColor: '#2c3e50', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.3s', marginTop: '10px' },
    toggleText: { textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '10px' },
    toggleLink: { color: '#3498db', cursor: 'pointer', fontWeight: '600' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundImage}><div style={styles.overlay}></div></div>
      <div style={styles.logoContainer}><div style={styles.logo}><img src="/logo.png" alt="Logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} /></div></div>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>{isSignIn ? 'SIGN IN' : 'SIGN UP'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required minLength={6} />
          </div>
          {!isSignIn && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} required minLength={6} />
            </div>
          )}
          {isSignIn && (
            <div style={styles.rememberMe}>
              <input type="checkbox" id="staySignedIn" checked={staySignedIn} onChange={() => setStaySignedIn(!staySignedIn)} style={styles.checkbox} />
              <label htmlFor="staySignedIn" style={styles.rememberMeLabel}>Stay Signed in</label>
            </div>
          )}
          <button type="submit" style={{ ...styles.submitButton, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Sign Up')}
          </button>
          <p style={styles.toggleText}>
            {isSignIn ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { if (!isLoading) { setIsSignIn(!isSignIn); setError(''); } }} style={{ ...styles.toggleLink, opacity: isLoading ? 0.7 : 1 }}>
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
          {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
