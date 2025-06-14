import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import './SignInPage.css';

function SignInPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      console.log('Initiating Google Sign-In');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google Sign-In successful:', user.email);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
        })
      );
      navigate('/create'); // Navigate to /create after successful sign-in
    } catch (error) {
      console.error('Google Sign-In error:', error.message);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-header">
        <h1>Sign in</h1>
      </div>
      <div className="signin-form">
        <div className="input-group">
          <label><span className="icon">✉️</span> Email</label>
          <input type="email" placeholder="Your email" disabled />
        </div>
        <div className="input-group">
          <label><span className="icon">🔒</span> Password</label>
          <input type="password" placeholder="Enter your password" disabled />
        </div>
        <div className="terms-checkbox">
          <span className="checkbox-icon">✔️</span> I accept the terms and privacy policy
        </div>
        <button className="signin-button" disabled>
          Sign in
        </button>
      </div>
      <div className="social-login">
        <span>Or Register with</span>
        <div className="social-buttons">
          <button className="social-button" disabled>
            <FaFacebookF /> Facebook
          </button>
          <button className="social-button" onClick={handleGoogleSignIn}>
            <FcGoogle /> Google
          </button>
          <button className="social-button" disabled>
            <FaApple /> Apple
          </button>
        </div>
      </div>
      <p className="signup-link">
        Already have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
      </p>
    </div>
  );
}

export default SignInPage;