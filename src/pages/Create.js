// src/pages/Create.js
import { useState, useEffect } from 'react';
import { IoAdd, IoArrowBack, IoPaperPlaneOutline, IoImageOutline, IoVideocamOutline, IoTextOutline } from 'react-icons/io5';
import './Create.css';

function Create() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [postContent, setPostContent] = useState(null);
  const [caption, setCaption] = useState('');

  // Simulate loading delay (replace with actual data fetching later)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000); // 2-second delay for demo
    return () => clearTimeout(timer);
  }, []);

  const toggleFab = () => setIsFabOpen(!isFabOpen);
  const openModal = (type) => {
    setModalType(type);
    setIsFabOpen(false); // Close FAB buttons when modal opens
    setPostContent(null); // Reset content
    setCaption(''); // Reset caption
  };
  const closeModal = () => setModalType(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPostContent(URL.createObjectURL(file));
  };

  const handleCaptionChange = (e) => setCaption(e.target.value);

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
                <input
                  type="file"
                  accept="image/*"
                  className="modal-input"
                  onChange={handleFileChange}
                />
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
                <input
                  type="file"
                  accept="video/*"
                  className="modal-input"
                  onChange={handleFileChange}
                />
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