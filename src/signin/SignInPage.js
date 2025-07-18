import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../services/firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import logoImg from '../assets/logo192.jpg';
import './SignInPage.css';

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!acceptPrivacy) {
      setError('You must accept the terms and privacy policy.');
      setIsLoading(false);
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('Email Sign-In: emailVerified:', user.emailVerified);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
        })
      );
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), { verified: user.emailVerified, email: user.email }, { merge: true });
      navigate(user.emailVerified ? '/create' : '/verify-account');
    } catch (error) {
      console.error('Email Sign-In error:', error.code, error.message);
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(`Failed to sign in: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google Sign-In: emailVerified:', user.emailVerified);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
        })
      );
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), { verified: user.emailVerified, email: user.email }, { merge: true });
      navigate(user.emailVerified ? '/create' : '/verify-account');
    } catch (error) {
      console.error('Google Sign-In error:', error.code, error.message);
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-in cancelled.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(`Failed to sign in with Google: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    setError('');
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Password reset email sent. Check your inbox and spam folder.');
      setResetEmail('');
    } catch (error) {
      console.error('Password Reset error:', error.code, error.message);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(`Failed to send reset email: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <section className="signin-section">
        <h2>{isForgotPassword ? 'Reset Your Password' : "Welcome Back to Creator's Hub"}</h2>
        <p>{isForgotPassword ? 'Enter your email to receive a password reset link.' : 'Sign in to manage your content and grow your audience.'}</p>
        {error && <p className="error-message" aria-live="polite">{error}</p>}
        {resetMessage && <p className="success-message" aria-live="polite">{resetMessage}</p>}
        <div className="signin-form">
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <div className="input-group">
                <label>
                  <span className="icon"><FiMail /></span> Email
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  aria-describedby={error ? 'email-error' : undefined}
                />
              </div>
              <button type="submit" className="signin-button" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p className="back-link">
                <span onClick={() => setIsForgotPassword(false)}>Back to Sign In</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleEmailSignIn}>
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
                  <span className="icon"><FiLock /></span> Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              <p className="forgot-password">
                <span onClick={() => setIsForgotPassword(true)}>Forgot Password?</span>
              </p>
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
              <button type="submit" className="signin-button" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}
        </div>
        {!isForgotPassword && (
          <>
            <div className="social-login">
              <span>Or sign in with</span>
              <div className="social-buttons">
                <button className="social-button" disabled title="Coming soon">
                  <FaFacebookF /> Facebook
                </button>
                <button className="social-button" onClick={handleGoogleSignIn} disabled={isLoading}>
                  <FcGoogle /> Google
                </button>
                <button className="social-button" disabled title="Coming soon">
                  <FaApple /> Apple
                </button>
              </div>
            </div>
            <p className="signup-link">
              Don’t have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
            </p>
          </>
        )}
      </section>
    </div>
  );
}

export default SignInPage;