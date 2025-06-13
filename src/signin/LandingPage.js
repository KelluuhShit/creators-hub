import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logoImg from '../assets/logo192.jpg'; // Adjust the path as necessary

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <img src={logoImg} alt="Creator's Hub Logo" />
          <h1>Creator's Hub</h1>
        </div>
        <nav className="landing-nav">
          <button onClick={() => navigate('/signin')} className="nav-button signin">
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} className="nav-button signup">
            Sign Up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h2>Empower Your Creator Journey</h2>
        <p>
          Creator's Hub provides tools to manage social media content, track analytics, and grow
          your audience with ease.
        </p>
        <button onClick={() => navigate('/signup')} className="cta-button">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h3>Why Choose Creator's Hub?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>Content Management</h4>
            <p>Schedule and manage your posts across platforms like Instagram.</p>
          </div>
          <div className="feature-card">
            <h4>Analytics Dashboard</h4>
            <p>Track views, likes, and followers with real-time insights.</p>
          </div>
          <div className="feature-card">
            <h4>Audience Growth</h4>
            <p>Leverage tools to engage and expand your community.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2025 Creator's Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;