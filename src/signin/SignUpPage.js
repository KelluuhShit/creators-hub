import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import './SignUpPage.css';

function SignUpPage() {
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      console.log('Initiating Google Sign-Up, auth:', auth);
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
      navigate('/create'); // Navigate to /create after successful sign-up
    } catch (error) {
      console.error('Google Sign-Up error:', error.message, error.code);
      alert('Failed to sign up with Google. Please try again. Check console for details.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <span className="lotus-icon">🌸</span>
        <h1>Your journey starts here</h1>
        <p>Take the first step</p>
      </div>
      <div className="signup-form">
        <div className="input-group">
          <label><span className="icon">✉️</span> E-mail</label>
          <input type="email" placeholder="Your email" disabled />
        </div>
        <div className="input-group">
          <label><span className="icon">👤</span> Username</label>
          <input type="text" placeholder="Username" disabled />
        </div>
        <div className="input-group">
          <label><span className="icon">🔒</span> Password</label>
          <input type="password" placeholder="Password" disabled />
        </div>
        <div className="input-group">
          <label><span className="icon">🔒</span> Confirm password</label>
          <input type="password" placeholder="Confirm password" disabled />
        </div>
        <button className="signup-button" disabled>
          Sign up
        </button>
      </div>
      <div className="social-login">
        <span>or</span>
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
        Already have an account? <span onClick={() => navigate('/signin')}>Sign in</span>
      </p>
    </div>
  );
}

export default SignUpPage;