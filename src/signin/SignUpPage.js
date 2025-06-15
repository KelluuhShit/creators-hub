import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './SignUpPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('Email Sign-Up successful:', user.email);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: username || user.displayName,
        })
      );
      navigate('/create');
    } catch (error) {
      console.error('Email Sign-Up error:', error.message, error.code);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email already in use.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password must be at least 6 characters.');
          break;
        default:
          setError('Failed to sign up. Please try again.');
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google Sign-Up successful:', user.email);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
        })
      );
      navigate('/create');
    } catch (error) {
      console.error('Google Sign-Up error:', error.message, error.code);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled.');
      } else {
        setError('Failed to sign up with Google. Please try again.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>Start Your Creator Journey</h1>
        <p>Join Creator's Hub to manage content, track analytics, and grow your audience.</p>
      </div>
      {error && <p className="error-message" aria-live="polite">{error}</p>}
      <div className="signup-form">
        <form onSubmit={handleEmailSignUp}>
          <div className="input-group">
            <label>
              <span className="icon"><FiMail /></span> Email
            </label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby={error ? 'email-error' : undefined}
            />
          </div>
          <div className="input-group">
            <label>
              <span className="icon"><FiUser /></span> Username
            </label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>
              <span className="icon"><FiLock /></span> Password
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>
              <span className="icon"><FiLock /></span> Confirm Password
            </label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      </div>
      <div className="social-login">
        <span>or continue with</span>
        <div className="social-buttons">
          <button className="social-button" disabled>
            <FaFacebookF /> Facebook
          </button>
          <button className="social-button" disabled>
            <FaApple /> Apple
          </button>
          <button className="social-button" onClick={handleGoogleSignUp}>
            <FcGoogle /> Google
          </button>
        </div>
      </div>
      <p className="signin-link">
        Already have an account? <span onClick={() => navigate('/signin')}>Sign In</span>
      </p>
    </div>
  );
}

export default SignUpPage;