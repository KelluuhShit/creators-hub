import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!acceptPrivacy) {
      setError('You must accept the terms and privacy policy.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await updateProfile(user, { displayName: username });
      await user.getIdToken(true);
      console.log('Email Sign-Up: emailVerified:', user.emailVerified);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: username,
        })
      );
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), { verified: false, email: user.email }, { merge: true });
      navigate('/verify-account');
    } catch (error) {
      console.error('Email Sign-Up error:', error.code, error.message);
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
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(`Failed to sign up: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await user.getIdToken(true);
      console.log('Google Sign-Up: emailVerified:', user.emailVerified);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
        })
      );
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), { verified: false, email: user.email }, { merge: true });
      navigate('/verify-account');
    } catch (error) {
      console.error('Google Sign-Up error:', error.code, error.message);
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-up cancelled.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(`Failed to sign up with Google: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
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
              minLength={3}
              maxLength={20}
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
                minLength={6}
                aria-describedby={error ? 'password-error' : undefined}
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
                minLength={6}
                aria-describedby={error ? 'confirm-password-error' : undefined}
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
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="accept-privacy"
              checked={acceptPrivacy}
              onChange={(e) => setAcceptPrivacy(e.target.checked)}
              required
            />
            <label htmlFor="accept-privacy">
              I accept the <a href="/terms" target="_blank">terms</a> and{' '}
              <a href="/privacy" target="_blank">privacy policy</a>
            </label>
          </div>
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
      <div className="social-login">
        <span>or continue with</span>
        <div className="social-buttons">
          <button className="social-button" disabled title="Coming soon">
            <FaFacebookF /> Facebook
          </button>
          <button className="social-button" disabled title="Coming soon">
            <FaApple /> Apple
          </button>
          <button className="social-button" onClick={handleGoogleSignUp} disabled={isLoading}>
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