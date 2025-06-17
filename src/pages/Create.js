import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { IoAdd, IoArrowBack, IoPaperPlaneOutline, IoImageOutline, IoVideocamOutline, IoTextOutline } from 'react-icons/io5';
import './Create.css';

function Create() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [postContent, setPostContent] = useState(null);
  const [caption, setCaption] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/signin');
        return;
      }
      try {
        await user.getIdToken(true); // Refresh token
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists() && docSnap.data().verified) {
          // Already verified, stay on page
        } else if (user.emailVerified) {
          // Link clicked, update Firestore
          await setDoc(userDoc, { verified: true, email: user.email }, { merge: true });
          console.log('Firestore updated for user:', user.uid);
        } else {
          navigate('/verify-account');
        }
      } catch (error) {
        console.error('Auth or Firestore error:', error.message);
        navigate('/verify-account');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (postContent) URL.revokeObjectURL(postContent);
    };
  }, [postContent]);

  const toggleFab = () => setIsFabOpen(!isFabOpen);
  const openModal = (type) => {
    setModalType(type);
    setIsFabOpen(false);
    setPostContent(null);
    setCaption('');
    setFileName('');
  };
  const closeModal = () => setModalType(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostContent(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleCaptionChange = (e) => setCaption(e.target.value);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="create-page">
      {isLoading ? (
        <div className="stories-container">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="skeleton-story">
              <div className="skeleton-circle"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stories-container">
          <div className="story-placeholder">No stories yet</div>
        </div>
      )}
      <div className="create-container">
        <p className="create-welcome">
          Welcome to Creator's Hub. Create content, post directly to Instagram stories and track your post statistics all times.
        </p>
      </div>
      <div className="fab-container">
        {isFabOpen && (
          <div className="fab-options">
            <button className="fab-option" onClick={() => openModal('text')}>
              <IoTextOutline size={20} />
              Create Text Post
            </button>
            <button className="fab-option" onClick={() => openModal('image')}>
              <IoImageOutline size={20} />
              Create Image Post
            </button>
            <button className="fab-option" onClick={() => openModal('video')}>
              <IoVideocamOutline size={20} />
              Create Video Post
            </button>
          </div>
        )}
        <button className="create-fab" onClick={toggleFab}>
          <IoAdd size={24} className={isFabOpen ? 'rotate' : ''} />
        </button>
      </div>
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-back" onClick={closeModal}>
              <IoArrowBack size={20} />
            </button>
            <h2 className="modal-title">
              {modalType === 'text' ? 'Create Text Post' : modalType === 'image' ? 'Create Image Post' : 'Create Video Post'}
            </h2>
            {modalType === 'text' && (
              <textarea
                className="modal-input modal-textarea"
                placeholder="What's on your mind?"
                value={caption}
                onChange={handleCaptionChange}
              />
            )}
            {modalType === 'image' && (
              <>
                <div className="file-input-container">
                  <button className="file-input-button" onClick={triggerFileInput}>
                    <IoImageOutline size={20} />
                    Choose Image
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input-hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {fileName && <span className="file-name">{fileName}</span>}
                </div>
                {postContent && <img src={postContent} alt="Preview" className="modal-preview" />}
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={handleCaptionChange}
                />
              </>
            )}
            {modalType === 'video' && (
              <>
                <div className="file-input-container">
                  <button className="file-input-button" onClick={triggerFileInput}>
                    <IoVideocamOutline size={20} />
                    Choose Video
                  </button>
                  <input
                    type="file"
                    accept="video/*"
                    className="file-input-hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {fileName && <span className="file-name">{fileName}</span>}
                </div>
                {postContent && <video src={postContent} controls className="modal-preview" />}
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={handleCaptionChange}
                />
              </>
            )}
            <button className="modal-post">
              <IoPaperPlaneOutline size={20} />
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create;