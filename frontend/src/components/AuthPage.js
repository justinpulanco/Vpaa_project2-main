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

      if (data.token) {
        localStorage.setItem('token', data.token);
        onLogin({ email, password });
      } else {
        throw new Error('No token received');
      }

    } catch (err) {
      setError(err.message || `Error during ${isSignIn ? 'login' : 'registration'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', position: 'relative', margin: 0, padding: 0, overflow: 'hidden', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
    backgroundImage: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', backgroundImage: 'url("/photos/Holy-Cross-of-Davao-College.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 1 },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 2 },
    formContainer: { backgroundColor: 'white', padding: '0', borderRadius: '6px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)', width: '100%', maxWidth: '360px', zIndex: 3, position: 'relative', border: '1px solid rgba(255,255,255,0.3)' },
    title: { textAlign: 'center', color: 'white', marginBottom: '0', fontSize: '17px', fontWeight: '600', backgroundColor: '#c8102e', padding: '14px', margin: '0', borderRadius: '6px 6px 0 0', letterSpacing: '1.5px' },
    logoImg: { width: '70px', height: '70px', margin: '20px auto 15px', display: 'block', imageRendering: '-webkit-optimize-contrast', imageRendering: 'crisp-edges' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '25px 30px 30px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' },
    input: { padding: '11px 14px', border: '1.5px solid #d0d0d0', borderRadius: '4px', fontSize: '14px', transition: 'all 0.3s ease', outline: 'none', width: '100%', boxSizing: 'border-box', backgroundColor: '#fafafa', color: '#333', fontWeight: '400' },
    rememberMe: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0' },
    checkbox: { width: '14px', height: '14px', cursor: 'pointer' },
    rememberMeLabel: { fontSize: '12px', color: '#666', cursor: 'pointer' },
    submitButton: { backgroundColor: '#c8102e', color: 'white', padding: '13px', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 2px 4px rgba(200,16,46,0.3)' },

  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundImage}><div style={styles.overlay}></div></div>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>{isSignIn ? 'SIGN-IN' : 'SIGN-UP'}</h2>
        <img src="/photos/download.png" alt="Holy Cross Logo" style={styles.logoImg} />
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email" 
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#c8102e'}
              onBlur={(e) => e.target.style.borderColor = '#d0d0d0'}
              required 
            />
          </div>
          <div style={styles.inputGroup}>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#c8102e'}
              onBlur={(e) => e.target.style.borderColor = '#d0d0d0'}
              required 
              minLength={6} 
            />
          </div>
          {!isSignIn && (
            <div style={styles.inputGroup}>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm Password" 
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#c8102e'}
                onBlur={(e) => e.target.style.borderColor = '#d0d0d0'}
                required 
                minLength={6} 
              />
            </div>
          )}
          {isSignIn && (
            <div style={styles.rememberMe}>
              <input type="checkbox" id="staySignedIn" checked={staySignedIn} onChange={() => setStaySignedIn(!staySignedIn)} style={styles.checkbox} />
              <label htmlFor="staySignedIn" style={styles.rememberMeLabel}>Stay Signed in</label>
            </div>
          )}
          <button type="submit" style={{ ...styles.submitButton, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isSignIn ? 'SIGN IN' : 'SIGN UP')}
          </button>
          {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
