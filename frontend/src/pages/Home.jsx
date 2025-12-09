import React from 'react';
import { Link } from 'react-router-dom';

// Import the new styles
import '../styles/pages/Home.css';
function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <h1 className="hero-title">Master the Market</h1>
      <p className="hero-subtitle">
        Predict stock trends with our advanced LSTM machine learning models. 
        Analyze data, visualize trends, and stay ahead of the curve.
      </p>

      <div className="cta-buttons">
        <Link to="/prediction" className="btn-primary">Get Started</Link>
        <Link to="/about" className="btn-secondary">Learn More</Link>
      </div>

      {/* Features Section */}
      <div className="features-grid">
        <div className="feature-card">
          <h3>🚀 AI Prediction</h3>
          <p>Powered by LSTM neural networks for high accuracy.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Live Charts</h3>
          <p>Interactive graphs to visualize market movements.</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Real-time Data</h3>
          <p>Fetches the latest NSE market data instantly.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;