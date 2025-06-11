// src/subscription-components/SubscriptionModal.js
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './SubscriptionModal.css';

function SubscriptionModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubscribe = () => {
    onClose();
    navigate('/subscribe');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
          <IoClose />
        </button>
        <h2 className="modal-title">Premium Access Restricted</h2>
        <p className="modal-description">
          You’re currently on the free tier and cannot access premium features like Advanced Analytics. Upgrade to a premium subscription to unlock all features!
        </p>
        <div className="modal-actions">
          <button className="modal-cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-subscribe-button" onClick={handleSubscribe}>
            Subscribe
          </button>
        </div>
      </div>    
    </div>
  );
}

export default SubscriptionModal;