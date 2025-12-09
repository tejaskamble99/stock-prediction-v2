import '../styles/components/Navbar.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in when the component loads
  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear data
    setUser(null);
    alert("Logged out successfully");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo" onClick={() => setIsMobile(false)}>
        STOCK<span className="brand-span">+</span>
      </Link>

      {/* Links */}
      <ul className={isMobile ? "nav-links active" : "nav-links"}>
        <li>
          <Link to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"} onClick={() => setIsMobile(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/prediction" className={location.pathname === "/prediction" ? "nav-link active" : "nav-link"} onClick={() => setIsMobile(false)}>
            Prediction
          </Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === "/about" ? "nav-link active" : "nav-link"} onClick={() => setIsMobile(false)}>
            About
          </Link>
        </li>
        
        {/* Mobile Auth Links */}
        {isMobile && !user && (
          <>
            <li><Link to="/login" className="nav-link" onClick={() => setIsMobile(false)}>Login</Link></li>
            <li><Link to="/signup" className="nav-link" onClick={() => setIsMobile(false)}>Sign Up</Link></li>
          </>
        )}
        {isMobile && user && (
           <li><span className="nav-link" onClick={handleLogout}>Logout</span></li>
        )}
      </ul>

      {/* Desktop Auth Buttons */}
      <div className="auth-buttons">
        {user ? (
          <>
            <span style={{ marginRight: '15px', fontWeight: 'bold' }}>Hi, {user}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? "✕" : "☰"}
      </div>
    </nav>
  );
}

export default Navbar;