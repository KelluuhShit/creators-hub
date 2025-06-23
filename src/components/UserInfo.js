// src/pages/UserInfo.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { IoArrowBack, IoPencil, IoPerson, IoCall, IoCalendar, IoMailOutline, IoStarOutline, IoLogoInstagram } from 'react-icons/io5';
import './UserInfo.css';

function UserInfo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { state } = useLocation();

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
          phoneNumber: data.phoneNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          isPremium: data.isPremium || false,
          instagramConnected: data.instagramConnected || false,
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

  const handleEditClick = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!userData) return;

    // Validation
    if (editField === 'displayName' && !editValue.trim()) {
      setError('Display Name cannot be empty.');
      return;
    }
    if (editField === 'phoneNumber' && editValue && !editValue.match(/^\+?\d{7,15}$/)) {
      setError('Please enter a valid phone number (e.g., +1234567890 or 1234567890).');
      return;
    }
    if (editField === 'dateOfBirth' && editValue) {
      const dob = new Date(editValue);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (isNaN(dob.getTime())) {
        setError('Please enter a valid date.');
        return;
      }
      if (age < 13) {
        setError('You must be at least 13 years old.');
        return;
      }
    }

    const auth = getAuth();
    const db = getFirestore();
    const userDoc = doc(db, 'users', auth.currentUser.uid);

    try {
      const updateData = { [editField]: editValue };
      await updateDoc(userDoc, updateData);
      setUserData((prev) => ({ ...prev, [editField]: editValue }));
      setIsEditModalOpen(false);
      setEditField(null);
      setEditValue('');
      setError('');
    } catch (err) {
      console.error('Update error:', err.message);
      setError('Failed to save changes. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditField(null);
    setEditValue('');
    setError('');
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

  const getFieldConfig = () => {
    switch (editField) {
      case 'displayName':
        return {
          title: 'Display Name',
          icon: <IoPerson size={32} />,
          inputType: 'text',
          isTextarea: false,
          placeholder: 'Enter your display name',
        };
      case 'phoneNumber':
        return {
          title: 'Phone Number',
          icon: <IoCall size={32} />,
          inputType: 'tel',
          isTextarea: false,
          placeholder: 'Enter your phone number (e.g., +1234567890)',
        };
      case 'dateOfBirth':
        return {
          title: 'Date of Birth',
          icon: <IoCalendar size={32} />,
          inputType: 'date',
          isTextarea: false,
          placeholder: 'Select your date of birth',
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
              Change {fieldConfig.title}
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const renderContent = () => {
    if (!userData) return null;

    switch (pathname) {
      case '/account-information':
        return (
          <div className="user-info-section">
            <div className="user-info-item">
              <div className="label-container">
                <IoPerson className="user-info-icon" size={20} />
                <span className="user-info-label">Display Name</span>
              </div>
              <div className="value-container">
                <span className="user-info-value">{userData.displayName}</span>
                <button
                  type="button"
                  className="edit-icon-button"
                  onClick={() => handleEditClick('displayName', userData.displayName)}
                  aria-label="Edit display name"
                >
                  <IoPencil size={18} />
                </button>
              </div>
            </div>
            <div className="user-info-item">
              <div className="label-container">
                <IoMailOutline className="user-info-icon" size={20} />
                <span className="user-info-label">Email</span>
              </div>
              <span className="user-info-value">{userData.email}</span>
            </div>
            <div className="user-info-item">
              <div className="label-container">
                <IoCall className="user-info-icon" size={20} />
                <span className="user-info-label">Phone Number</span>
              </div>
              <div className="value-container">
                <span className="user-info-value">{userData.phoneNumber || 'Not set'}</span>
                <button
                  type="button"
                  className="edit-icon-button"
                  onClick={() => handleEditClick('phoneNumber', userData.phoneNumber)}
                  aria-label="Edit phone number"
                >
                  <IoPencil size={18} />
                </button>
              </div>
            </div>
            <div className="user-info-item">
              <div className="label-container">
                <IoCalendar className="user-info-icon" size={20} />
                <span className="user-info-label">Date of Birth</span>
              </div>
              <div className="value-container">
                <span className="user-info-value">{formatDate(userData.dateOfBirth)}</span>
                <button
                  type="button"
                  className="edit-icon-button"
                  onClick={() => handleEditClick('dateOfBirth', userData.dateOfBirth)}
                  aria-label="Edit date of birth"
                >
                  <IoPencil size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      case '/account-type':
        return (
          <div className="user-info-section">
            <div className="user-info-item">
              <div className="label-container">
                <IoStarOutline className="user-info-icon" size={20} />
                <span className="user-info-label">Account Type</span>
              </div>
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
              <div className="label-container">
                <IoLogoInstagram className="user-info-icon" size={20} />
                <span className="user-info-label">Instagram</span>
              </div>
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

  if (error && !isEditModalOpen) {
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
        <>
          {renderContent()}
          {renderEditModal()}
        </>
      )}
    </div>
  );
}

export default UserInfo;