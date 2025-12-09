import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Auth.css'; // We will create this CSS file next

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post('http://127.0.0.1:8000/api/signup/', {
        email: email,
        password: password
      });
      alert("Signup Successful! Please Login.");
      navigate('/login'); // Redirect to login page
    } catch (err) {
      // Handle error from Django
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSignup}>
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
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;