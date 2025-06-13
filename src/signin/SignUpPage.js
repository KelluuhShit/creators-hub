import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';
import logoImg from '../assets/logo192.jpg';

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Store user data (WARNING: Plain-text password is insecure; use Firebase/backend in production)
    localStorage.setItem(
      'userData',
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password, // Mock only; hash passwords in production
      })
    );

    // Set free tier subscription
    localStorage.setItem('userSubscription', JSON.stringify({ premium: false, tier: 'Free' }));

    // Mock registration
    console.log('Sign-up:', formData);

    // Redirect to /create with email
    navigate('/create', { state: { email: formData.email } });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="logo">
          <img src={logoImg} alt="Creator's Hub Logo" />
          <h1>Creator's Hub</h1>
        </div>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;