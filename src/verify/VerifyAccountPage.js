import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { FiCheckCircle } from 'react-icons/fi';
import './VerifyAccountPage.css';

function VerifyAccountPage({ setIsVerified }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifiedInDb, setIsVerifiedInDb] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const data = JSON.parse(localStorage.getItem('userData'));
      if (!data || !data.email || !data.uid) {
        setError('Invalid session. Please sign in again.');
        navigate('/signin');
        return;
      }
      if (!user) {
        setError('User not authenticated. Please sign in.');
        navigate('/signin');
        return;
      }
      if (user.email.toLowerCase() !== data.email.toLowerCase()) {
        setError('Email mismatch. Please sign in with the correct account.');
        navigate('/signin');
        return;
      }

      try {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists() && docSnap.data().verified) {
          setIsVerifiedInDb(true);
          setIsVerified(true);
          navigate('/create');
        } else {
          setIsVerifiedInDb(false);
          setUserData(data);
        }
      } catch (error) {
        console.error('Firestore error:', error.message);
        setError('Failed to check verification status. Try again.');
      }
    });

    return () => unsubscribe();
  }, [navigate, setIsVerified]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError('No user is signed in.');
      setIsLoading(false);
      return;
    }

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      };
      console.log('Sending verification email to:', user.email, 'with settings:', actionCodeSettings); // Debug
      await sendEmailVerification(user, actionCodeSettings);
      setSuccess('Verification email sent! Please check your inbox and click the link to verify.');
    } catch (error) {
      console.error('Verification email error:', error.code, error.message);
      if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError(`Failed to send verification email: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData || isVerifiedInDb === null) return null;

  return (
    <div className="verify-container">
      <section className="verify-section">
        <h2>Verify Your Account</h2>
        <p>Please confirm authentication for {userData.email}.</p>
        {error && <p className="error-message" aria-live="polite">{error}</p>}
        {success && <p className="success-message" aria-live="polite">{success}</p>}
        <div className="verify-form">
          <form onSubmit={handleVerify}>
            <div className="input-group">
              <span className="icon"><FiCheckCircle /></span>
              <p>Authenticated as {userData.email}</p>
            </div>
            <button type="submit" className="verify-button" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Verification Email'}
            </button>
            {success && (
              <button
                type="button"
                className="resend-button"
                onClick={handleVerify}
                disabled={isLoading}
              >
                Resend Verification Email
              </button>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

export default VerifyAccountPage;