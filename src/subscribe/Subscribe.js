import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { UserContext } from '../context/UserContext';
import { initializePayment } from './payment/paystack';
import './Subscribe.css';

function Subscribe() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const [loadingStates, setLoadingStates] = useState({});
  const [successStates, setSuccessStates] = useState({});
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTier, setSuccessTier] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  const plans = [
    {
      id: 'silver',
      name: 'Premium Silver',
      price: 'KES 25/month',
      amount: 25,
      features: [
        'Access to Creators Hub',
        'Up to 3 posts daily',
        'Watermark on posts'
      ],
      buttonText: 'Subscribe to Silver',
    },
    {
      id: 'bronze',
      name: 'Premium Bronze',
      price: 'KES 40/month + KES 15/day',
      amount: 40,
      features: [
        'Access to Creators Hub',
        'Up to 5 posts daily',
        'Watermark on posts'
      ],
      buttonText: 'Subscribe to Bronze',
    },
    {
      id: 'gold',
      name: 'Premium Gold',
      price: 'KES 200/month',
      amount: 200,
      features: [
        'Access to Creators Hub',
        'Up to 10 posts daily',
        'No watermark on posts'
      ],
      buttonText: 'Subscribe to Gold',
    },
  ];

  // Real-time subscription listener
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', auth.currentUser.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data.subscriptionTier) {
            setUserData(prev => ({
              ...prev,
              isPremium: true,
              subscriptionTier: data.subscriptionTier
            }));
          }
        }
      },
      (err) => {
        console.error('Subscription listener error:', err);
        setError('Failed to load subscription status');
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser?.uid, db, setUserData]);

  const handleSubscribe = async (plan) => {
    if (!auth.currentUser) {
      setError('You must be logged in to subscribe');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [plan.id]: true }));
    setError(null);

    try {
      await initializePayment(plan.amount, async ({ status, response }) => {
        if (status === 'success') {
          try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
              isPremium: true,
              subscriptionTier: plan.id,
              subscriptionDate: new Date().toISOString()
            });

            setSuccessTier(plan.id);
            setSuccessStates(prev => ({ ...prev, [plan.id]: true }));
            setShowSuccessModal(true);
            
            setTimeout(() => {
              setSuccessStates(prev => ({ ...prev, [plan.id]: false }));
            }, 2000);
          } catch (firestoreError) {
            console.error('Firestore update error:', firestoreError);
            setError('Failed to update subscription. Please contact support.');
          }
        } else if (status === 'cancelled') {
          setError('Payment was cancelled');
        } else {
          setError('Payment failed. Please try again.');
        }
        setLoadingStates(prev => ({ ...prev, [plan.id]: false }));
      });
    } catch (initError) {
      console.error('Payment initialization error:', initError);
      setError('Failed to initialize payment');
      setLoadingStates(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  const closeSuccessModal = () => {
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
      
      {error && (
        <div className="error-message">
          <IoWarning /> {error}
        </div>
      )}

      <div className="plans-container">
        {plans.map((plan) => {
          const isSubscribed = userData?.subscriptionTier === plan.id;
          return (
            <div className="plan-card" key={plan.id}>
              <h2 className="plan-title">{plan.name}</h2>
              <p className="plan-price">{plan.price}</p>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button
                className={`subscribe-button ${
                  loadingStates[plan.id] ? 'loading' : 
                  successStates[plan.id] ? 'success' : 
                  isSubscribed ? 'subscribed' : ''
                }`}
                onClick={() => handleSubscribe(plan)}
                disabled={loadingStates[plan.id] || successStates[plan.id] || isSubscribed}
                aria-busy={loadingStates[plan.id]}
                aria-live="polite"
              >
                {loadingStates[plan.id] ? (
                  <span className="loader"></span>
                ) : successStates[plan.id] ? (
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

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <IoCheckmarkCircle className="success-modal-icon" />
            <h2>Subscription Successful!</h2>
            <p>You're now subscribed to {plans.find(p => p.id === successTier)?.name}</p>
            <button 
              className="success-modal-button" 
              onClick={closeSuccessModal}
              autoFocus
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscribe;