import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { IoCheckmarkCircle, IoPencilOutline } from 'react-icons/io5';
import './Account.css'; // Updated import

function Account() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

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
          phoneNumber: data.phoneNumber || 'Not provided',
          gender: data.gender || 'Not provided',
          age: data.age || 'Not provided',
          country: data.country || 'Not provided',
          website: data.website || 'https://example.com',
          postsCount: data.postsCount || 0,
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          photoURL: user.photoURL || 'https://images.pexels.com/photos/11051300/pexels-photo-11051300.jpeg?auto=compress&cs=tinysrgb&w=600',
          instagramConnected: data.instagramConnected || false,
        });
      } catch (err) {
        console.error('Account fetch error:', err.message);
        setError('Failed to load account details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleConnectInstagram = () => {
    console.log('Initiate Instagram connection');
  };

  const handleEdit = (field) => {
    console.log(`Edit ${field}`);
    // Placeholder for future edit functionality (e.g., open a modal or navigate to edit page)
  };

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()} aria-label="Retry loading account">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="account-container">
      {isLoading ? (
        <div className="skeleton-container">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-username"></div>
          <div className="skeleton-bio"></div>
          <div className="skeleton-stats"></div>
          <div className="skeleton-details"></div>
        </div>
      ) : (
        userData && (
          <>
            <div className="account-header">
              <div className="account-avatar-wrapper">
                <img
                  src={userData.photoURL}
                  alt={`Profile picture of ${userData.displayName}`}
                  className="account-avatar"
                />
              </div>
              <div className="account-info">
                <div className="account-username-wrapper">
                  {userData.instagramConnected ? (
                    <>
                      <h1 className="account-username">{userData.displayName}</h1>
                      <IoCheckmarkCircle
                        className="account-verified"
                        aria-label="Verified account"
                      />
                    </>
                  ) : (
                    <>
                      <h1 className="account-username">-</h1>
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
                <div className="account-stats">
                  <div className="account-stat">
                    <span className="account-stat-value">{userData.postsCount}</span>
                    <span className="account-stat-label">Posts</span>
                  </div>
                  <div className="account-stat">
                    <span className="account-stat-value">{userData.followersCount}</span>
                    <span className="account-stat-label">Followers</span>
                  </div>
                  <div className="account-stat">
                    <span className="account-stat-value">{userData.followingCount}</span>
                    <span className="account-stat-label">Following</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="account-details">
              <div className="account-detail-item">
                <span className="account-detail-label">Email</span>
                <span className="account-detail-value">{userData.email}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEdit('email')}
                  aria-label="Edit email"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <span className="account-detail-label">Phone Number</span>
                <span className="account-detail-value">{userData.phoneNumber}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEdit('phoneNumber')}
                  aria-label="Edit phone number"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <span className="account-detail-label">Gender</span>
                <span className="account-detail-value">{userData.gender}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEdit('gender')}
                  aria-label="Edit gender"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <span className="account-detail-label">Age</span>
                <span className="account-detail-value">{userData.age}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEdit('age')}
                  aria-label="Edit age"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <span className="account-detail-label">Country</span>
                <span className="account-detail-value">{userData.country}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEdit('country')}
                  aria-label="Edit country"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <span className="account-detail-label">Bio</span>
                <span className="account-detail-value">{userData.bio}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEdit('bio')}
                  aria-label="Edit bio"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default Account;