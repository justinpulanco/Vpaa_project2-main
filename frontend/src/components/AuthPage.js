import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const AuthPage = () => {
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
        ? `${API_BASE_URL}/api/auth/login/`
        : `${API_BASE_URL}/api/auth/register/`;

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
        // Store tokens and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate to dashboard
        navigate('/dashboard');
        window.location.reload(); // Refresh to update auth state
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
    backgroundImage: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', backgroundImage: 'url("/photos/Login_Background.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 1 },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', backgroundColor: 'transparent', zIndex: 2 },
    formContainer: { backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '0', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)', width: '100%', maxWidth: '340px', zIndex: 3, position: 'relative', border: '1px solid rgba(255,255,255,0.3)' },
    title: { textAlign: 'center', color: 'white', marginBottom: '0', fontSize: '15px', fontWeight: '700', backgroundColor: '#c8102e', padding: '12px', margin: '0', borderRadius: '8px 8px 0 0', letterSpacing: '1.2px' },
    logoImg: { width: '70px', height: '70px', margin: '20px auto 15px', display: 'block', imageRendering: 'crisp-edges' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 25px 25px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' },
    input: { padding: '10px 12px', border: '1px solid #d0d0d0', borderRadius: '4px', fontSize: '13px', transition: 'all 0.3s ease', outline: 'none', width: '100%', boxSizing: 'border-box', backgroundColor: 'white', color: '#333', fontWeight: '400' },
    rememberMe: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0' },
    checkbox: { width: '14px', height: '14px', cursor: 'pointer' },
    rememberMeLabel: { fontSize: '12px', color: '#666', cursor: 'pointer' },
    submitButton: { backgroundColor: '#c8102e', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 2px 4px rgba(200,16,46,0.3)' },
    signUpPrompt: { textAlign: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e8e8e8' },
    signUpText: { fontSize: '13px', color: '#666', fontWeight: '400' },
    signUpLink: { background: 'none', border: 'none', color: '#3498db', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', padding: '0', marginLeft: '3px' },
    vpaaBanner: { position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', zIndex: 3, backgroundColor: 'rgba(74, 54, 44, 0.95)', padding: '15px 60px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' },
    vpaaText: { margin: 0, color: 'white', fontSize: '42px', fontWeight: '700', textAlign: 'center', letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }
  };



  return (
    <div style={styles.container}>
      <div style={styles.backgroundImage}><div style={styles.overlay}></div></div>
      
      {/* VPAA Banner */}
      <div style={styles.vpaaBanner}>
        <h1 style={styles.vpaaText}>VP for Academic Affairs</h1>
      </div>
      
      <div style={styles.formContainer}>
        <h2 style={styles.title}>{isSignIn ? 'SIGN-IN' : 'SIGN-UP'}</h2>
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
            <>
              <div style={styles.rememberMe}>
                <input type="checkbox" id="staySignedIn" checked={staySignedIn} onChange={() => setStaySignedIn(!staySignedIn)} style={styles.checkbox} />
                <label htmlFor="staySignedIn" style={styles.rememberMeLabel}>Stay Signed in</label>
              </div>
              <div style={{ textAlign: 'right', marginTop: '5px' }}>
                <button 
                  type="button"
                  onClick={() => alert('Please contact your administrator to reset your password.')}
                  style={{ background: 'none', border: 'none', color: '#3498db', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}
          <button type="submit" style={{ ...styles.submitButton, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isSignIn ? 'SIGN IN' : 'SIGN UP')}
          </button>
          {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
          
          {/* Sign Up Link */}
          {isSignIn && (
            <div style={styles.signUpPrompt}>
              <span style={styles.signUpText}>You don't have any account? </span>
              <button 
                type="button"
                onClick={() => setIsSignIn(false)}
                style={styles.signUpLink}
              >
                Sign up here
              </button>
            </div>
          )}
          
          {/* Back to Sign In Link */}
          {!isSignIn && (
            <div style={styles.signUpPrompt}>
              <span style={styles.signUpText}>Already have an account? </span>
              <button 
                type="button"
                onClick={() => setIsSignIn(true)}
                style={styles.signUpLink}
              >
                Sign in here
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
