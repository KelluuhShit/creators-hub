import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
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

      // Check verification status in Firestore
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

    const db = getFirestore();
    try {
      const userDoc = doc(db, 'users', userData.uid);
      await setDoc(userDoc, { verified: true, email: userData.email }, { merge: true });
      setSuccess('Account verified successfully!');
      setIsVerified(true);
      navigate('/create');
    } catch (error) {
      console.error('Verification error:', error.message);
      setError('Failed to verify account. Please try again.');
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
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default VerifyAccountPage;