// src/pages/UserInfo.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { IoArrowBack } from 'react-icons/io5';
import './UserInfo.css';

function UserInfo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { state } = useLocation(); // Get 'from' for back navigation

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError('User not authenticated. Please sign in.');
        navigate('/signin');
        return;
      }

      try {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (!docSnap.exists() || !docSnap.data().verified) {
          setError('Account not verified.');
          navigate('/verify-account');
          return;
        }

        const data = docSnap.data();
        setUserData({
          email: user.email,
          displayName: data.displayName || user.displayName || '-',
          bio: data.bio || 'No bio provided.',
          website: data.website || 'https://example.com',
          isPremium: data.isPremium || false,
          instagramConnected: data.instagramConnected || false,
          // Add other fields as needed
        });
      } catch (err) {
        console.error('User info fetch error:', err.message);
        setError('Failed to load user info. Please try again.');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleBackClick = () => {
    navigate(state?.from || '/profile');
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/account-information':
        return 'Account Information';
      case '/account-type':
        return 'Account Type';
      case '/connected-account':
        return 'Connected Account';
      default:
        return 'User Settings';
    }
  };

  const renderContent = () => {
    if (!userData) return null;

    switch (pathname) {
      case '/account-information':
        return (
          <div className="user-info-section">
            <div className="user-info-item">
              <span className="user-info-label">Display Name</span>
              <span className="user-info-value">{userData.displayName}</span>
            </div>
            <div className="user-info-item">
              <span className="user-info-label">Email</span>
              <span className="user-info-value">{userData.email}</span>
            </div>
            <div className="user-info-item">
              <span className="user-info-label">Bio</span>
              <span className="user-info-value">{userData.bio}</span>
            </div>
            <div className="user-info-item">
              <span className="user-info-label">Website</span>
              <a
                href={userData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="user-info-link"
              >
                {userData.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          </div>
        );
      case '/account-type':
        return (
          <div className="user-info-section">
            <div className="user-info-item">
              <span className="user-info-label">Account Type</span>
              <span className="user-info-value">
                {userData.isPremium ? 'Premium' : 'Free'}
              </span>
            </div>
            {!userData.isPremium && (
              <button
                type="button"
                className="upgrade-button"
                onClick={() => navigate('/upgrade')}
                aria-label="Upgrade to premium"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        );
      case '/connected-account':
        return (
          <div className="user-info-section">
            <div className="user-info-item">
              <span className="user-info-label">Instagram</span>
              <span className="user-info-value">
                {userData.instagramConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            {!userData.instagramConnected && (
              <button
                type="button"
                className="connect-button"
                onClick={() => console.log('Initiate Instagram connection')}
                aria-label="Connect Instagram account"
              >
                Connect Instagram
              </button>
            )}
          </div>
        );
      default:
        return <p>Invalid section.</p>;
    }
  };

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()} aria-label="Retry loading">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="user-info-container">
      <div className="user-info-header">
        <button
          type="button"
          className="back-button"
          onClick={handleBackClick}
          aria-label="Go back"
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className="user-info-title">{getPageTitle()}</h1>
      </div>
      {isLoading ? (
        <div className="skeleton-container">
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}

export default UserInfo;