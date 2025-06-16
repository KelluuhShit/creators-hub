import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, applyActionCode } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './VerifyEmailPage.css';

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleVerification = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const urlParams = new URLSearchParams(location.search);
      const oobCode = urlParams.get('oobCode');
      const mode = urlParams.get('mode');
      console.log('Full URL:', window.location.href); // Debug
      console.log('URL Params:', { oobCode, mode, search: location.search }); // Debug

      if (!oobCode || mode !== 'verifyEmail') {
        setError('Invalid or missing verification code.');
        setIsLoading(false);
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          await setDoc(userDoc, { verified: true, email: user.email }, { merge: true });
          console.log('Firestore updated for user:', user.uid);
          setSuccess('Email verified successfully! Redirecting...');
          setTimeout(() => navigate('/create'), 2000);
        } else {
          setError('No user is signed in. Please sign in again.');
          setTimeout(() => navigate('/signin'), 2000);
        }
      } catch (error) {
        console.error('Verification error:', error.code, error.message);
        if (error.code === 'auth/expired-action-code') {
          setError('Verification link has expired. Please request a new one.');
        } else if (error.code === 'auth/invalid-action-code') {
          setError('Invalid verification link.');
        } else {
          setError(`Failed to verify email: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    handleVerification();
  }, [navigate, location]);

  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      {isLoading && <p>Processing verification...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}

export default VerifyEmailPage;