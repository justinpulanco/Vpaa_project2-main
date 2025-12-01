import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Admin from "./Admin";
import User from "./User";

const initialEvents = [];

function App() {
  const [events, setEvents] = useState(initialEvents);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const verify = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/token/verify/", {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: token })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      setUser(data.user);  // This might need adjustment based on your actual response
      setIsAuthenticated(true);
      setIsAdmin(data.user.is_staff || data.user.is_superuser);
    } else {
      throw new Error('Token verification failed');
    }
  } catch (error) {
    console.error('Verification error:', error);
    localStorage.removeItem("token");
    navigate('/login');
  }
};

    
    verify(); // Call the verify function
  }, [navigate]); // Add navigate to dependency array

  const handleLogin = async (userData) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
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
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.is_staff || data.user.is_superuser);
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
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <div>
              <header style={{ padding: "20px", background: "#eee", display: "flex", justifyContent: "space-between" }}>
                <h1>Event System</h1>
                <div>
                  <span style={{ marginRight: "15px" }}>{user?.email}</span>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </header>

              <main style={{ padding: "20px" }}>
                {isAdmin ? (
                  <Admin events={events} setEvents={setEvents} />
                ) : (
                  <User events={events} />
                )}
              </main>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;