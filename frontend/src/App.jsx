import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* --- Navigation Bar --- */}
        <Navbar />

        {/* --- Page Content --- */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}



export default App;