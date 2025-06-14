import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { initializePayment } from './payment/paystack'; // Fixed import case
import './Subscribe.css';

function Subscribe() {
  const navigate = useNavigate();
  const [loadingStates, setLoadingStates] = useState({});
  const [successStates, setSuccessStates] = useState({});
  const [subscribedTier, setSubscribedTier] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTier, setSuccessTier] = useState('');

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
      amount: 25, // KES
      features: ['Access to Creators Hub', 'Up to 3 posts daily', 'Watermark on posts'],
      buttonText: 'Subscribe to Silver',
    },
    {
      name: 'Premium Bronze',
      price: 'KES 40/month + KES 15/day',
      amount: 40, // Initial KES
      features: ['Access to Creators Hub', 'Up to 5 posts daily', 'Watermark on posts'],
      buttonText: 'Subscribe to Bronze',
    },
    {
      name: 'Premium Gold',
      price: 'KES 200/month',
      amount: 200, // KES
      features: ['Access to Creators Hub', 'Up to 10 posts daily', 'No watermark on posts'],
      buttonText: 'Subscribe to Gold',
    },
  ];

  const handleSubscribe = (plan) => {
    const tier = plan.name.split(' ')[1];
    console.log(`Initiating payment for ${plan.name}`);
    setLoadingStates((prev) => {
      const newState = { ...prev, [plan.name]: true };
      console.log('Set loadingStates:', newState);
      return newState;
    });

    initializePayment(plan.amount, ({ status, response }) => {
      console.log(`Payment callback received: status=${status}`, response);
      setLoadingStates((prev) => {
        const newState = { ...prev, [plan.name]: false };
        console.log('Reset loadingStates:', newState);
        return newState;
      });

      if (status === 'success') {
        console.log(`Payment successful for ${tier}`);
        localStorage.setItem('userSubscription', JSON.stringify({ premium: true, tier }));
        setSubscribedTier(tier);
        setSuccessTier(tier);
        setSuccessStates((prev) => {
          const newState = { ...prev, [plan.name]: true };
          console.log('Set successStates:', newState);
          return newState;
        });
        setShowSuccessModal(true);
        setTimeout(() => {
          setSuccessStates((prev) => {
            const newState = { ...prev, [plan.name]: false };
            console.log('Reset successStates:', newState);
            return newState;
          });
        }, 2000);
      } else if (status === 'cancelled') {
        console.log('Payment cancelled');
        alert('Payment cancelled');
      } else {
        console.log('Payment failed:', response);
        alert('Payment failed. Please try again.');
      }
    });
  };

  const closeSuccessModal = () => {
    console.log('Closing success modal');
    setShowSuccessModal(false);
    navigate('/free-analytics');
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
          const tier = plan.name.split(' ')[1];
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
                onClick={() => handleSubscribe(plan)}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <IoCheckmarkCircle className="success-modal-icon" />
            <h2>Subscription Successful!</h2>
            <p>Subscribed to {successTier}</p>
            <button className="success-modal-button" onClick={closeSuccessModal}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscribe;