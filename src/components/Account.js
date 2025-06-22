import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
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
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

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

  // Initialize reCAPTCHA
  useEffect(() => {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!recaptchaContainer) {
      setError('reCAPTCHA container not found. Please try again.');
      return;
    }

    if (!window.recaptchaVerifier && auth) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
        });

        // Enable testing mode if configured
        if (process.env.REACT_APP_FIREBASE_TESTING === 'true') {
          auth.settings.appVerificationDisabledForTesting = true;
        }
      } catch (err) {
        console.error('reCAPTCHA initialization error:', err.message);
        setError('Failed to initialize reCAPTCHA. Please try again.');
      }
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleConnectInstagram = () => {
    console.log('Initiate Instagram connection');
  };

  const handleBackClick = () => {
    navigate('/profile');
  };

  const handleEditClick = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue === 'Not provided' ? '' : currentValue);
    setIsEditModalOpen(true);
  };

  const normalizePhoneNumber = (input) => {
    let cleaned = input.replace(/\D/g, ''); // Remove non-digits
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      // Convert 0712345678 or 0112345678 to +254712345678
      cleaned = `+254${cleaned.slice(1)}`;
    } else if (!cleaned.startsWith('+254') && cleaned.length === 9) {
      // Convert 712345678 to +254712345678
      cleaned = `+254${cleaned}`;
    } else if (!cleaned.startsWith('+254') && cleaned.length > 9) {
      // Assume +254 was omitted, take last 9 digits
      cleaned = `+254${cleaned.slice(-9)}`;
    }
    return cleaned;
  };

  const handleSaveEdit = async () => {
    if (!userData) return;

    // Validation
    if (editField === 'email' && editValue && !editValue.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (editField === 'gender' && editValue && !['Male', 'Female', 'Other'].includes(editValue)) {
      setError('Please enter a valid gender (Male, Female, or Other).');
      return;
    }
    if (editField === 'age' && editValue) {
      const age = parseInt(editValue, 10);
      if (isNaN(age) || age < 13 || age > 120) {
        setError('Please enter a valid age (13–120).');
        return;
      }
    }
    if (editField === 'country' && editValue && !editValue.match(/^[A-Za-z\s]{2,}$/)) {
      setError('Please enter a valid country name.');
      return;
    }
    if (editField === 'bio' && editValue.length > 500) {
      setError('Bio cannot exceed 500 characters.');
      return;
    }

    if (editField === 'phoneNumber') {
      // Normalize and validate phone number
      const normalizedNumber = normalizePhoneNumber(editValue);
      if (!normalizedNumber.match(/^\+254\d{9}$/)) {
        setError('Please enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678).');
        return;
      }

      // Initiate SMS verification
      try {
        if (!window.recaptchaVerifier) {
          throw new Error('reCAPTCHA not initialized.');
        }
        const confirmation = await signInWithPhoneNumber(auth, normalizedNumber, window.recaptchaVerifier);
        setConfirmationResult(confirmation);
        setEditValue(normalizedNumber); // Update editValue to show normalized number
        setIsEditModalOpen(false);
        setIsOtpModalOpen(true);
        setError('');
      } catch (err) {
        console.error('SMS send error:', err.message);
        if (err.code === 'auth/billing-not-enabled') {
          setError('Phone verification is not available due to billing restrictions. Please contact support.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('Phone authentication is not enabled. Please contact support.');
        } else if (err.code === 'auth/too-many-requests') {
          setError('Too many attempts. Please try again later.');
        } else if (err.code === 'auth/invalid-phone-number') {
          setError('Invalid phone number format.');
        } else {
          setError('Failed to send verification code. Please try again.');
        }
      }
    } else {
      // Update other fields directly
      const userDoc = doc(db, auth.currentUser.uid);

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
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult || !otpValue) return;

    try {
      await confirmationResult.confirm(otpValue);
      const userDoc = doc(db, auth.currentUser.uid);
      await updateDoc(userDoc, { phoneNumber: editValue });
      setUserData((prev) => ({ ...prev, phoneNumber: editValue }));
      setIsOtpModalOpen(false);
      setEditField(null);
      setEditValue('');
      setOtpValue('');
      setConfirmationResult(null);
      setError('');
    } catch (err) {
      console.error('OTP verification error:', err.message);
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setIsOtpModalOpen(false);
    setEditField(null);
    setEditValue('');
    setOtpValue('');
    setConfirmationResult(null);
    setError('');
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
          placeholder: 'Enter phone number (e.g., 0712345678)',
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
        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
          <div className="edit-modal-header">
            <div className="edit-modal-icon">{fieldConfig.icon}</div>
            <button
              type="button"
              className="edit-modal-close"
              onClick={handleCancelEdit}
              aria-label="Close edit modal"
            >
              <IoArrowBack size={24} />
            </button>
          </div>
          <div className="edit-modal-content">
            <h2 className="edit-modal-title">Edit {fieldConfig.title}</h2>
            {editField === 'phoneNumber' && (
              <p className="edit-modal-info">
                Enter your Kenyan phone number (e.g., 0712345678). You will receive an SMS with a verification code. Standard rates may apply.
              </p>
            )}
            {fieldConfig.isTextarea ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="edit-modal-input edit-modal-textarea"
                placeholder={fieldConfig.placeholder}
                aria-label={`Edit ${fieldConfig.title.toLowerCase()}`}
                autoFocus
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
              />
            )}
            {error && <p className="edit-modal-error">{error}</p>}
          </div>
          <div className="edit-modal-footer">
            <button
              type="button"
              className="edit-modal-save-button"
              onClick={handleSaveEdit}
              aria-label={`Change ${fieldConfig.title.toLowerCase()}`}
            >
              {editField === 'phoneNumber' ? 'Send Verification Code' : `Change ${fieldConfig.title}`}
            </button>
            <button
              type="button"
              className="edit-modal-cancel-button"
              onClick={handleCancelEdit}
              aria-label="Cancel edit"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderOtpModal = () => {
    if (!isOtpModalOpen) return null;

    return (
      <div className="edit-modal-overlay" onClick={handleCancelEdit}>
        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
          <div className="edit-modal-header">
            <div className="edit-modal-icon">
              <IoCallOutline size={32} />
            </div>
            <button
              type="button"
              className="edit-modal-close"
              onClick={handleCancelEdit}
              aria-label="Close OTP modal"
            >
              <IoArrowBack size={24} />
            </button>
          </div>
          <div className="edit-modal-content">
            <h2 className="edit-modal-title">Verify Phone Number</h2>
            <p className="edit-modal-info">
              Enter the 6-digit code sent to {editValue}.
            </p>
            <input
              type="text"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              className="edit-modal-input"
              placeholder="Enter 6-digit code"
              aria-label="Enter verification code"
              autoFocus
            />
            {error && <p className="edit-modal-error">{error}</p>}
          </div>
          <div className="edit-modal-footer">
            <button
              type="button"
              className="edit-modal-save-button"
              onClick={handleVerifyOtp}
              aria-label="Verify code"
            >
              Verify Code
            </button>
            <button
              type="button"
              className="edit-modal-cancel-button"
              onClick={handleCancelEdit}
              aria-label="Cancel verification"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (error && !isEditModalOpen && !isOtpModalOpen) {
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
          aria-label="Go back"
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className="account-title">Account</h1>
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
                  onClick={() => handleEditClick('email', userData.email)}
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
                  onClick={() => handleEditClick('phoneNumber', userData.phoneNumber)}
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
                  onClick={() => handleEditClick('gender', userData.gender)}
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
                  onClick={() => handleEditClick('age', userData.age)}
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
                  onClick={() => handleEditClick('country', userData.country)}
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
                  onClick={() => handleEditClick('bio', userData.bio)}
                  aria-label="Edit bio"
                >
                  <IoPencilOutline size={18} />
                </button>
              </div>
            </div>
            {renderEditModal()}
            {renderOtpModal()}
          </>
        )
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Account;