import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  IoCheckmarkCircle,
  IoPencilOutline,
  IoArrowBack,
  IoMailOutline,
  IoCallOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoGlobeOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import { auth, db } from '../services/firebase';
import './Account.css';

function Account() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // New loading states for buttons
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isConnectingInstagram, setIsConnectingInstagram] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);

  // Fetch user data
  useEffect(() => {
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

  const handleConnectInstagram = async () => {
    setIsConnectingInstagram(true);
    try {
      // Placeholder: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Initiate Instagram connection');
    } catch (err) {
      setError('Failed to connect Instagram. Please try again.');
    } finally {
      setIsConnectingInstagram(false);
    }
  };

  const handleBackClick = async () => {
    setIsGoingBack(true);
    try {
      // Simulate navigation delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate('/profile');
    } finally {
      setIsGoingBack(false);
    }
  };

  const handleEditClick = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue === 'Not provided' ? '' : currentValue);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!userData) return;
    setIsSaving(true);

    // Validation
    if (editField === 'email' && editValue && !editValue.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError('Please enter a valid email address.');
      setIsSaving(false);
      return;
    }
    if (editField === 'gender' && editValue && !['Male', 'Female', 'Other'].includes(editValue)) {
      setError('Please enter a valid gender (Male, Female, or Other).');
      setIsSaving(false);
      return;
    }
    if (editField === 'age' && editValue) {
      const age = parseInt(editValue, 10);
      if (isNaN(age) || age < 13 || age > 120) {
        setError('Please enter a valid age (13–120).');
        setIsSaving(false);
        return;
      }
    }
    if (editField === 'country' && editValue && !editValue.match(/^[A-Za-z\s]{2,}$/)) {
      setError('Please enter a valid country name.');
      setIsSaving(false);
      return;
    }
    if (editField === 'bio' && editValue.length > 500) {
      setError('Bio cannot exceed 500 characters.');
      setIsSaving(false);
      return;
    }

    // Update field directly
    const userDoc = doc(db, 'users', auth.currentUser.uid);

    try {
      const updateData = { [editField]: editValue };
      await updateDoc(userDoc, updateData);
      setUserData((prev) => ({ ...prev, [editField]: editValue || 'Not provided' }));
      setIsEditModalOpen(false);
      setEditField(null);
      setEditValue('');
      setError('');
    } catch (err) {
      console.error('Update error:', err.message);
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = async () => {
    setIsCanceling(true);
    try {
      // Simulate cancel delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEditModalOpen(false);
      setEditField(null);
      setEditValue('');
      setError('');
    } finally {
      setIsCanceling(false);
    }
  };

  const getFieldConfig = () => {
    switch (editField) {
      case 'email':
        return {
          title: 'Email',
          icon: <IoMailOutline size={32} />,
          inputType: 'email',
          isTextarea: false,
          placeholder: 'Enter your email',
        };
      case 'phoneNumber':
        return {
          title: 'Phone Number',
          icon: <IoCallOutline size={32} />,
          inputType: 'tel',
          isTextarea: false,
          placeholder: 'Enter your phone number',
        };
      case 'gender':
        return {
          title: 'Gender',
          icon: <IoPersonOutline size={32} />,
          inputType: 'text',
          isTextarea: false,
          placeholder: 'Enter gender (Male, Female, Other)',
        };
      case 'age':
        return {
          title: 'Age',
          icon: <IoCalendarOutline size={32} />,
          inputType: 'number',
          isTextarea: false,
          placeholder: 'Enter your age',
        };
      case 'country':
        return {
          title: 'Country',
          icon: <IoGlobeOutline size={32} />,
          inputType: 'text',
          isTextarea: false,
          placeholder: 'Enter your country',
        };
      case 'bio':
        return {
          title: 'Bio',
          icon: <IoDocumentTextOutline size={32} />,
          inputType: 'text',
          isTextarea: true,
          placeholder: 'Enter your bio',
        };
      default:
        return null;
    }
  };

  const renderEditModal = () => {
    if (!isEditModalOpen || !editField) return null;
    const fieldConfig = getFieldConfig();

    if (!fieldConfig) return null;

    return (
      <div className="edit-modal-overlay" onClick={handleCancelEdit}>
        <div className="edit-account-modal" onClick={(e) => e.stopPropagation()}>
          <div className="edit-modal-header">
            <button
              type="button"
              className="edit-modal-close"
              onClick={handleCancelEdit}
              aria-label="Close edit modal"
              disabled={isCanceling}
            >
              <IoArrowBack size={24} />
            </button>
            <div className="edit-modal-icon">{fieldConfig.icon}</div>
          </div>
          <div className="edit-modal-content">
            <h2 className="edit-account-modal-title">Edit {fieldConfig.title}</h2>
            {fieldConfig.isTextarea ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="edit-modal-input edit-modal-textarea"
                placeholder={fieldConfig.placeholder}
                aria-label={`Edit ${fieldConfig.title.toLowerCase()}`}
                autoFocus
                disabled={isSaving}
              />
            ) : (
              <input
                type={fieldConfig.inputType}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="edit-modal-input"
                placeholder={fieldConfig.placeholder}
                aria-label={`Edit ${fieldConfig.title.toLowerCase()}`}
                autoFocus
                disabled={isSaving}
              />
            )}
            {error && <p className="edit-modal-error">{error}</p>}
          </div>
          <div className="edit-modal-footer">
            <button
              type="button"
              className="edit-modal-save-button"
              onClick={handleSaveEdit}
              aria-label={isSaving ? `Saving ${fieldConfig.title.toLowerCase()}` : `Change ${fieldConfig.title.toLowerCase()}`}
              disabled={isSaving || isCanceling}
            >
              {isSaving ? (
                <>
                  <span className="button-loader"></span>
                  Saving...
                </>
              ) : (
                `Change ${fieldConfig.title}`
              )}
            </button>
            <button
              type="button"
              className="edit-modal-cancel-button"
              onClick={handleCancelEdit}
              aria-label={isCanceling ? 'Canceling edit' : 'Cancel edit'}
              disabled={isSaving || isCanceling}
            >
              {isCanceling ? (
                <>
                  <span className="button-loader"></span>
                  Canceling...
                </>
              ) : (
                'Cancel'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (error && !isEditModalOpen) {
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
      <div className="account-header">
        <button
          type="button"
          className="back-button"
          onClick={handleBackClick}
          aria-label={isGoingBack ? 'Navigating back' : 'Go back'}
          disabled={isGoingBack}
        >
          {isGoingBack ? (
            <>
              <span className="button-loader"></span>
            </>
          ) : (
            <IoArrowBack size={24} />
          )}
        </button>
        <h5 className="account-title">Account</h5>
      </div>
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
            <div className="account-header-content">
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
                        aria-label={isConnectingInstagram ? 'Connecting Instagram account' : 'Connect Instagram account'}
                        disabled={isConnectingInstagram}
                      >
                        {isConnectingInstagram ? (
                          <>
                            <span className="button-loader"></span>
                            Connecting...
                          </>
                        ) : (
                          'Connect my Instagram'
                        )}
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
                <div className="label-container">
                  <IoMailOutline className="account-detail-icon" size={20} />
                  <span className="account-detail-label">Email</span>
                </div>
                <span className="account-detail-value">{userData.email}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEditClick('email', userData.email)}
                  aria-label="Edit email"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <div className="label-container">
                  <IoCallOutline className="account-detail-icon" size={20} />
                  <span className="account-detail-label">Phone Number</span>
                </div>
                <span className="account-detail-value">{userData.phoneNumber}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEditClick('phoneNumber', userData.phoneNumber)}
                  aria-label="Edit phone number"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <div className="label-container">
                  <IoPersonOutline className="account-detail-icon" size={20} />
                  <span className="account-detail-label">Gender</span>
                </div>
                <span className="account-detail-value">{userData.gender}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEditClick('gender', userData.gender)}
                  aria-label="Edit gender"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <div className="label-container">
                  <IoCalendarOutline className="account-detail-icon" size={20} />
                  <span className="account-detail-label">Age</span>
                </div>
                <span className="account-detail-value">{userData.age}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEditClick('age', userData.age)}
                  aria-label="Edit age"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <div className="label-container">
                  <IoGlobeOutline className="account-detail-icon" size={20} />
                  <span className="account-detail-label">Country</span>
                </div>
                <span className="account-detail-value">{userData.country}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEditClick('country', userData.country)}
                  aria-label="Edit country"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
              <div className="account-detail-item">
                <div className="label-container">
                  <IoDocumentTextOutline className="account-detail-icon" size={20} />
                  <span className="account-detail-label">Bio</span>
                </div>
                <span className="account-detail-value">{userData.bio}</span>
                <button
                  type="button"
                  className="account-detail-edit"
                  onClick={() => handleEditClick('bio', userData.bio)}
                  aria-label="Edit bio"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
            </div>
            {renderEditModal()}
          </>
        )
      )}
    </div>
  );
}

export default Account;