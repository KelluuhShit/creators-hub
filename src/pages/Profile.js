// src/pages/Profile.js
import { useState, useEffect } from 'react';
import { IoCheckmarkCircle, IoLogOutOutline, IoDownloadOutline } from 'react-icons/io5';
import './Profile.css';

const mockPosts = [
  { id: '1', image: 'https://images.pexels.com/photos/7480538/pexels-photo-7480538.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '2', image: 'https://images.pexels.com/photos/5053846/pexels-photo-5053846.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '3', image: 'https://images.pexels.com/photos/3850220/pexels-photo-3850220.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

function Profile() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay (replace with API call later)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogOut = () => {
    // Implement logout logic (e.g., clear auth token, redirect)
    console.log('Logged out');
  };

  const handleDownloadApp = () => {
    
  };

  return (
    <div className="profile-container">
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
        <>
          <div className="profile-header">
            <div className="profile-avatar-wrapper">
              <img
                src="https://images.pexels.com/photos/11051300/pexels-photo-11051300.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Profile"
                className="profile-avatar"
              />
            </div>
            <div className="profile-info">
              <div className="profile-username-wrapper">
                <h1 className="profile-username">Creator's Hub</h1>
                <IoCheckmarkCircle className="profile-verified" />
              </div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="profile-stat-value">128</span>
                  <span className="profile-stat-label">Posts</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-value">1.2k</span>
                  <span className="profile-stat-label">Followers</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-value">350</span>
                  <span className="profile-stat-label">Following</span>
                </div>
              </div>
              <p className="profile-bio">Building cool stuff, one post at a time!</p>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="profile-link">
                example.com
              </a>
            </div>
          </div>
          <div className="profile-grid">
            {mockPosts.map((post) => (
              <img
                key={post.id}
                src={post.image}
                alt="Post"
                className="profile-post-image"
              />
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
      )}
    </div>
  );
}

export default Profile;