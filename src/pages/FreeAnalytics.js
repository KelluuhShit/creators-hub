import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoChevronForward, IoEyeOutline, IoHeartOutline, IoPeopleOutline } from 'react-icons/io5';
import { UserContext } from '../context/UserContext';
import SubscriptionModal from '../components/SubscriptionModal';
import ActivityChartModal from '../subscribe/free/ActivityChartModal';
import './FreeAnalytics.css';

function FreeAnalytics() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isChartModalOpen, setChartModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Get user data from context
  const { userData } = useContext(UserContext) || {};
  const isPremium = userData?.isPremium === true;

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

  const handleBack = () => navigate(-1);

  const handleAdvancedStats = () => {
    if (isPremium) {
      navigate('/monitor');
    } else {
      setModalOpen(true);
    }
  };

  const handleDetails = (activity) => {
    if (isPremium) {
      setSelectedActivity(activity);
      setChartModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className="free-analytics-container">
      <div className="button-group">
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
                onClick={() => handleDetails(item.activity)}
                aria-label={`View premium details for ${item.activity}`}
              >
                <IoChevronForward />
              </button>
            </span>
          </div>
        ))}
      </div>

      <SubscriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />
      
      <ActivityChartModal
        isOpen={isChartModalOpen}
        onClose={() => {
          setChartModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
      />
    </div>
  );
}

export default FreeAnalytics;