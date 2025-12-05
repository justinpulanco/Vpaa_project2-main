import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Admin from "./Admin";
import User from "./User";
import EventCheckIn from "./EventCheckIn";
import QRAttendance from "./QRAttendance";
import UserCertificateReview from "./UserCertificateReview";
import API_BASE_URL from "./config";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        setIsAuthenticated(true);
        setIsAdmin(user.is_staff || user.is_superuser || user.role === 'ADMIN');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json().catch(err => {
        throw new Error('Invalid response from server');
      });

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        setIsAdmin(data.user.is_staff || data.user.is_superuser || data.user.role === 'ADMIN');
        navigate('/dashboard');
      } else {
        throw new Error(data.detail || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'An error occurred during login');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/login");
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
              <header style={{ 
                padding: "15px 30px", 
                background: "#c8102e", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                color: "white"
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src="/photos/download.png" alt="HCDC Logo" style={{ width: '40px', height: '40px' }} />
                  <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', letterSpacing: '0.5px' }}>VPAA Event System</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '14px' }}>{user?.email}</span>
                  <button onClick={handleLogout} style={{
                    padding: '8px 20px',
                    backgroundColor: 'white',
                    color: '#c8102e',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}>Logout</button>
                </div>
              </header>

              <main style={{ 
                flex: 1, 
                padding: "30px", 
                backgroundColor: "#f5f5f5",
                overflowY: "auto"
              }}>
                {isAdmin ? (
                  <Admin />
                ) : (
                  <User />
                )}
              </main>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public routes for QR code check-in */}
      <Route path="/event/:eventId/checkin" element={<EventCheckIn />} />
      <Route path="/event/:eventId/qr" element={<QRAttendance />} />
      <Route path="/user/attendance/:attendanceId" element={<UserCertificateReview />} />

      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
    </div>
  );
}

export default App;
