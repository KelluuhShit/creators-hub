// src/pages/Success.js
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';
import './Success.css';

function Success() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { amount = 0, netAmount = 0, newBalance = 0 } = state || {};

  const handleDoneClick = () => navigate('/revenue', { state: { newBalance } });

  return (
    <div className="success-container">
      <div className="success-content">
        <IoCheckmarkCircle className="success-icon" />
        <h2 className="success-title">Withdrawal Successful</h2>
        <p className="amount-text">{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} withdrawn</p>
        <p className="account-text">to account xxxxxxx68688</p>
        <button
          className="done-button"
          onClick={handleDoneClick}
          aria-label="Return to revenue page"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default Success;