// src/subscribe/free/FreeAnalytics.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoArrowForward, IoEyeOutline, IoHeartOutline, IoPeopleOutline } from 'react-icons/io5';
import SubscriptionModal from '../components/SubscriptionModal';
import './FreeAnalytics.css';

function FreeAnalytics() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const analyticsData = {
    views: 1830,
    netFollowers: 250,
    likes: 3050,
  };

  const activities = [
    { id: 1, date: '2025-06-01', activity: 'New post reached 500 views' },
    { id: 2, date: '2025-06-03', activity: 'Gained 50 new followers' },
    { id: 3, date: '2025-06-05', activity: 'Post received 200 likes' },
    { id: 4, date: '2025-06-07', activity: '10 new comments on post' },
  ];

  const handleBack = () => {
    navigate('/free-analytics'); // Navigate back to the Free Analytics page
  };

  const handleAdvancedStats = () => {
    setModalOpen(true);
  };

  const handleDetails = () => {
    setModalOpen(true); // Open modal instead of navigating to /details/:id
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="free-analytics-container">
      <div className="button-group">
        {/* <button className="back-button" onClick={handleBack} aria-label="Go back">
          <IoArrowBack /> Back
        </button> */}
        <button
          className="advanced-stats-button"
          onClick={handleAdvancedStats}
          aria-label="View advanced statistics"
        >
          Advanced Stats
        </button>
      </div>

      <h1 className="analytics-title">Analytics</h1>

      <div className="analytics-card">
        <div className="metric-item">
          <IoEyeOutline className="metric-icon" />
          <h2 className="metric-title">Views</h2>
          <p className="metric-value">{analyticsData.views.toLocaleString()}</p>
        </div>
        <div className="metric-item">
          <IoPeopleOutline className="metric-icon" />
          <h2 className="metric-title">Net Followers</h2>
          <p className="metric-value">{analyticsData.netFollowers.toLocaleString()}</p>
        </div>
        <div className="metric-item">
          <IoHeartOutline className="metric-icon" />
          <h2 className="metric-title">Likes</h2>
          <p className="metric-value">{analyticsData.likes.toLocaleString()}</p>
        </div>
      </div>

      <h1 className="activities-title">Activities</h1>

      <div className="activities-card">
        <div className="table-header">
          <span className="table-column">Date</span>
          <span className="table-column">Activity</span>
          <span className="table-column">Details</span>
        </div>
        {activities.map((item) => (
          <div key={item.id} className="table-row">
            <span className="table-column">{item.date}</span>
            <span className="table-column">{item.activity}</span>
            <span className="table-column details-column">
              <button
                className="details-button"
                onClick={handleDetails} // Updated to open modal
                aria-label={`View premium details for ${item.activity}`}
              >
                <IoArrowForward />
              </button>
            </span>
          </div>
        ))}
      </div>

      <SubscriptionModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}

export default FreeAnalytics;