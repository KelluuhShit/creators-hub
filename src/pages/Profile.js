import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { IoCheckmarkCircle, IoLogOutOutline, IoDownloadOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Placeholder for premium status

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
        // Fetch user data from Firestore
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

        // Check premium status (placeholder)
        setIsPremium(data.isPremium || false);

        // Fetch posts (mock for now)
        setPosts([
          { id: '1', image: 'https://images.pexels.com/photos/7480538/pexels-photo-7480538.jpeg?auto=compress&cs=tinysrgb&w=600' },
          { id: '2', image: 'https://images.pexels.com/photos/5053846/pexels-photo-5053846.jpeg?auto=compress&cs=tinysrgb&w=600' },
          { id: '3', image: 'https://images.pexels.com/photos/3850220/pexels-photo-3850220.jpeg?auto=compress&cs=tinysrgb&w=600' },
        ]);
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
    // Placeholder for Instagram OAuth
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <button className="hamburger-menu" onClick={toggleMenu} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
        {isMenuOpen ? <IoCloseOutline size={30} /> : <IoMenuOutline size={30} />}
      </button>
      {isMenuOpen && (
        <div className="bottom-sheet-overlay" onClick={handleOverlayClick}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-handle"></span>
              <button className="bottom-sheet-close" onClick={toggleMenu} aria-label="Close bottom sheet">
                <IoCloseOutline size={24} />
              </button>
            </div>
            <div className="bottom-sheet-content">
              <button className="menu-button" onClick={() => handleMenuNavigation('/analytics')}>
                Analytics
              </button>
              <button
                className="menu-button"
                onClick={() => handleMenuNavigation('/revenue')}
                disabled={!isPremium}
                title={isPremium ? '' : 'Available for premium accounts only'}
              >
                Revenue
              </button>
              <button className="menu-button" onClick={() => handleMenuNavigation('/settings')}>
                Settings
              </button>
              <button className="menu-button" onClick={() => handleMenuNavigation('/account')}>
                Account
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
                <img src={userData.photoURL} alt="Profile" className="profile-avatar" />
              </div>
              <div className="profile-info">
                <div className="profile-username-wrapper">
                  {userData.instagramConnected ? (
                    <>
                      <h1 className="profile-username">{userData.displayName}</h1>
                      <IoCheckmarkCircle className="profile-verified" />
                    </>
                  ) : (
                    <>
                      <h1 className="profile-username">-</h1>
                      <button className="connect-instagram-button" onClick={handleConnectInstagram}>
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
                <a href={userData.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                  {userData.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
            <div className="profile-grid">
              {posts.map((post) => (
                <img key={post.id} src={post.image} alt="Post" className="profile-post-image" />
              ))}
            </div>
            <div className="profile-buttons">
              <button className="download-app-button" onClick={handleDownloadApp}>
                <IoDownloadOutline size={20} />
                Download App
              </button>
              <button className="logout-button" onClick={handleLogOut}>
                <IoLogOutOutline size={20} />
                Log Out
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default Profile;