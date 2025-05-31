// src/pages/Profile.js
import './Profile.css';

const mockPosts = [
  { id: '1', image: 'https://via.placeholder.com/150' },
  { id: '2', image: 'https://via.placeholder.com/150' },
  { id: '3', image: 'https://via.placeholder.com/150' },
];

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-avatar"
        />
        <h1 className="profile-username">Creator's Hub</h1>
        <p className="profile-bio">Building cool stuff, one post at a time!</p>
      </div>
      <div className="profile-grid">
        {mockPosts.map((post) => (
          <img key={post.id} src={post.image} alt="Post" className="profile-post-image" />
        ))}
      </div>
    </div>
  );
}

export default Profile;