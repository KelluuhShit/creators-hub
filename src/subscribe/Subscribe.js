import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import './Subscribe.css';

function Subscribe() {
  const navigate = useNavigate();
  const [loadingStates, setLoadingStates] = useState({});
  const [successStates, setSuccessStates] = useState({});
  const [subscribedTier, setSubscribedTier] = useState(null);

  // Load subscribed tier from localStorage on mount
  useEffect(() => {
    const subscription = localStorage.getItem('userSubscription');
    if (subscription) {
      const { tier } = JSON.parse(subscription);
      setSubscribedTier(tier);
    }
  }, []);

  const plans = [
    {
      name: 'Premium Silver',
      price: 'KES 25/month',
      features: ['Access to Creators Hub', 'Max posts daily', 'Watermark on posts'],
      buttonText: 'Subscribe to Silver',
    },
    {
      name: 'Premium Bronze',
      price: 'KES 40/month + KES 15/day',
      features: ['Access to Creators Hub', 'Max posts daily', 'Watermark on posts'],
      buttonText: 'Subscribe to Bronze',
    },
    {
      name: 'Premium Gold',
      price: 'KES 200/month',
      features: ['Access to Creators Hub', 'Max posts daily', 'No watermark on posts'],
      buttonText: 'Subscribe to Gold',
    },
  ];

  const handleSubscribe = (planName) => {
    const tier = planName.split(' ')[1]; // Extract "Silver", "Bronze", or "Gold"
    setLoadingStates((prev) => ({ ...prev, [planName]: true }));

    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('userSubscription', JSON.stringify({ premium: true, tier }));
      setSubscribedTier(tier); // Update subscribed tier state

      // Update states
      setLoadingStates((prev) => ({ ...prev, [planName]: false }));
      setSuccessStates((prev) => ({ ...prev, [planName]: true }));

      // Reset success state after 2 seconds
      setTimeout(() => {
        setSuccessStates((prev) => ({ ...prev, [planName]: false }));
      }, 2000);
    }, 4000); // 4-second loader
  };

  return (
    <div className="subscribe-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <IoArrowBack /> Back
      </button>
      <h1>Subscribe to Premium</h1>
      <p>Unlock Advanced Analytics and more!</p>
      <div className="plans-container">
        {plans.map((plan, index) => {
          const tier = plan.name.split(' ')[1]; // Extract tier for comparison
          const isSubscribed = subscribedTier === tier;
          return (
            <div className="plan-card" key={index}>
              <h2 className="plan-title">{plan.name}</h2>
              <p className="plan-price">{plan.price}</p>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button
                className={`subscribe-button ${
                  loadingStates[plan.name] ? 'loading' : successStates[plan.name] ? 'success' : isSubscribed ? 'subscribed' : ''
                }`}
                onClick={() => handleSubscribe(plan.name)}
                disabled={loadingStates[plan.name] || successStates[plan.name] || isSubscribed}
              >
                {loadingStates[plan.name] ? (
                  <span className="loader"></span>
                ) : successStates[plan.name] ? (
                  <IoCheckmarkCircle className="success-icon" />
                ) : isSubscribed ? (
                  'Subscribed'
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Subscribe;