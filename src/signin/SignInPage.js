import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';
import logoImg from '../assets/logo192.jpg';

function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock authentication against localStorage
    const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
    if (
      storedUser.email === formData.email &&
      storedUser.password === formData.password
    ) {
      console.log('Sign-in successful:', formData);
      navigate('/free-analytics'); // Redirect to free-analytics
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="logo">
          <img src={logoImg} alt="Creator's Hub Logo" />
          <h1>Creator's Hub</h1>
        </div>
        <h2>Sign In</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;