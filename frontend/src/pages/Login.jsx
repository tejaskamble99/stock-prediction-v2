import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Auth.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        email: email,
        password: password
      });
      
      // Save user info to LocalStorage (Browser Memory)
      localStorage.setItem('user', response.data.username);
      
      alert("Login Success!");
      navigate('/prediction'); // Redirect to Dashboard
      
      // Force reload to update Navbar (Simple fix for now)
      window.location.reload(); 
      
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please check your connection.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            className="auth-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className="auth-input"
          />
          <button type="submit" className="auth-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;