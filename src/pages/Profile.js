import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { IoCheckmarkCircle, IoLogOutOutline, IoDownloadOutline, IoMenuOutline, IoCloseOutline, IoArrowForward } from 'react-icons/io5';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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
          postsCount: data.postsCount || 0,
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          photoURL: user.photoURL || 'https://images.pexels.com/photos/11051300/pexels-photo-11051300.jpeg?auto=compress&cs=tinysrgb&w=600',
          instagramConnected: data.instagramConnected || false,
        });

        setIsPremium(data.isPremium ?? false);
      } catch (err) {
        console.error('Profile fetch error:', err.message);
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem('userData');
      navigate('/signin');
    } catch (err) {
      console.error('Logout error:', err.message);
      setError('Failed to log out. Please try again.');
    }
  };

  const handleDownloadApp = () => {
    window.open('https://example.com/app', '_blank', 'noopener,noreferrer');
  };

  const handleConnectInstagram = () => {
    console.log('Initiate Instagram connection');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
    setIsMenuOpen(false);
  };

  const handleMenuNavigation = (path) => {
    setIsMenuOpen(false);
    try {
      if (path === '/free-analytics') {
        if (!isPremium) {
          setError('Analytics are available for premium accounts only.');
          return;
        }
        navigate('/monitor');
      } else if (path === '/revenue') {
        if (!isPremium) {
          setError('Revenue statistics are available for premium accounts only.');
          return;
        }
        navigate('/revenue', { state: { from: pathname } });
      } else if (path === '/settings') {
        toggleSettingsModal();
      } else {
        navigate(path);
      }
    } catch (err) {
      console.error('Navigation error:', err.message);
      setError('Failed to navigate. Please try again.');
    }
  };

  const handleSettingsNavigation = (path) => {
    setIsSettingsModalOpen(false);
    try {
      navigate(path, { state: { from: pathname } });
    } catch (err) {
      console.error('Settings navigation error:', err.message);
      setError('Failed to navigate. Please try again.');
    }
  };

  const handleOverlayClick = () => {
    setIsMenuOpen(false);
    setIsSettingsModalOpen(false);
  };

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()} aria-label="Retry loading profile">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button
        type="button"
        className="hamburger-menu"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMenuOpen ? <IoCloseOutline size={30} /> : <IoMenuOutline size={30} />}
      </button>
      {isMenuOpen && (
        <div className="bottom-sheet-overlay" onClick={handleOverlayClick}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-handle" onClick={toggleMenu}></span>
            </div>
            <div className="bottom-sheet-content">
              <button
                type="button"
                className="menu-button"
                onClick={() => handleMenuNavigation('/free-analytics')}
                title={isPremium ? '' : 'Available for premium accounts only'}
                aria-label={isPremium ? 'View analytics dashboard' : 'View analytics dashboard (premium accounts only)'}
                disabled={!isPremium || isLoading}
              >
                Analytics
              </button>
              <button
                type="button"
                className="menu-button"
                onClick={() => handleMenuNavigation('/revenue')}
                title={isPremium ? '' : 'Available for premium accounts only'}
                aria-label={isPremium ? 'View revenue statistics' : 'View revenue statistics (premium accounts only)'}
                disabled={!isPremium || isLoading}
              >
                Revenue
              </button>
              <button
                type="button"
                className="menu-button"
                onClick={() => handleMenuNavigation('/settings')}
                aria-label="Open settings menu"
              >
                Settings
              </button>
              <button
                type="button"
                className="menu-button"
                onClick={() => handleMenuNavigation('/account')}
                aria-label="Go to account details"
              >
                Account
              </button>
            </div>
          </div>
        </div>
      )}
      {isSettingsModalOpen && (
        <div className="settings-modal-overlay" onClick={handleOverlayClick}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2 className="settings-modal-title">Settings</h2>
              <button
                type="button"
                className="settings-modal-close"
                onClick={toggleSettingsModal}
                aria-label="Close settings modal"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            <div className="settings-modal-content">
              <button
                type="button"
                className="settings-item"
                onClick={() => handleSettingsNavigation('/account-information')}
                aria-label="Go to account information"
              >
                <span>Account Information</span>
                <IoArrowForward size={20} />
              </button>
              <button
                type="button"
                className="settings-item"
                onClick={() => handleSettingsNavigation('/account-type')}
                aria-label="Go to account type"
              >
                <span>Account Type</span>
                <IoArrowForward size={20} />
              </button>
              <button
                type="button"
                className="settings-item"
                onClick={() => handleSettingsNavigation('/connected-account')}
                aria-label="Go to connected account"
              >
                <span>Connected Account</span>
                <IoArrowForward size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="skeleton-container">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-username"></div>
          <div className="skeleton-bio"></div>
          <div className="skeleton-stats"></div>
          <div className="skeleton-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton-post"></div>
            ))}
          </div>
          <div className="skeleton-buttons"></div>
        </div>
      ) : (
        userData && (
          <>
            <div className="profile-header">
              <div className="profile-avatar-wrapper">
                <img
                  src={userData.photoURL}
                  alt={`Profile picture of ${userData.displayName}`}
                  className="profile-avatar"
                />
              </div>
              <div className="profile-info">
                <div className="profile-username-wrapper">
                  {userData.instagramConnected ? (
                    <>
                      <h1 className="profile-username">{userData.displayName}</h1>
                      <IoCheckmarkCircle
                        className="profile-verified"
                        aria-label="Verified account"
                      />
                    </>
                  ) : (
                    <>
                      <h1 className="profile-username">-</h1>
                      <button
                        type="button"
                        className="connect-instagram-button"
                        onClick={handleConnectInstagram}
                        aria-label="Connect Instagram account"
                      >
                        Connect my Instagram
                      </button>
                    </>
                  )}
                </div>
                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="profile-stat-value">{userData.postsCount}</span>
                    <span className="profile-stat-label">Posts</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{userData.followersCount}</span>
                    <span className="profile-stat-label">Followers</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{userData.followingCount}</span>
                    <span className="profile-stat-label">Following</span>
                  </div>
                </div>
                <p className="profile-bio">{userData.bio}</p>
                <a
                  href={userData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  {userData.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
            <div className="profile-grid">
              {posts.map((post) => (
                <img
                  key={post.id}
                  src={post.image}
                  alt={`Post ${post.id} by ${userData.displayName}`}
                  className="profile-post-image"
                />
              ))}
            </div>
            <div className="profile-buttons">
              <button
                type="button"
                className="download-app-button"
                onClick={handleDownloadApp}
                aria-label="Download the app"
              >
                <IoDownloadOutline size={20} /> Download App
              </button>
              <button
                type="button"
                className="logout-button"
                onClick={handleLogOut}
                aria-label="Log out of account"
              >
                <IoLogOutOutline size={20} /> Log Out
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default Profile;