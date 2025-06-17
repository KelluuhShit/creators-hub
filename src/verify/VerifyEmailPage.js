import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, applyActionCode, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './VerifyEmailPage.css';

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const prepareVerification = async () => {
      const auth = getAuth();
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('oobCode');
      const mode = urlParams.get('mode');
      console.log('Full URL:', window.location.href);
      console.log('URL Params:', { oobCode: code, mode, search: location.search });

      if (code && mode === 'verifyEmail') {
        try {
          await applyActionCode(auth, code); // Verify email
        } catch (error) {
          console.error('Verification error:', error.code, error.message);
        }
      }
      setIsLoading(false);
    };

    prepareVerification();
  }, [location]);

  const handleGoToHome = async () => {
    setButtonLoading(true);
    const auth = getAuth();
    const db = getFirestore();
    try {
      await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            resolve(user);
          } else {
            reject(new Error('No user signed in'));
          }
        });
      });
      const user = auth.currentUser;
      const userDoc = doc(db, 'users', user.uid);
      console.log('Attempting to set verified: true for user:', user.uid);
      await setDoc(userDoc, { verified: true, email: user.email }, { merge: true });
      console.log('Firestore updated successfully for user:', user.uid);
      navigate('/create'); // Redirect to /create
    } catch (error) {
      console.error('Error in handleGoToHome:', error.message);
    } finally {
      setButtonLoading(false);
    }
  };

  if (isLoading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="verify-email-container">
      <h2>Email verified successfully</h2>
      <button
        className={`go-to-home-button ${buttonLoading ? 'loading' : ''}`}
        onClick={handleGoToHome}
        disabled={buttonLoading}
      >
        {buttonLoading ? (
          <span className="button-spinner"></span>
        ) : (
          'Go to home'
        )}
      </button>
    </div>
  );
}

export default VerifyEmailPage;