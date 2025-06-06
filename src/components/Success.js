// src/pages/Success.js
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';
import './Success.css';

function Success() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { amount = 0, netAmount = 0, newBalance = 0, activeAccount } = state || {};

  const handleDoneClick = () => navigate('/revenue', { state: { balance: newBalance } });

  return (
    <div className="success-container">
      <div className="success-content">
        <IoCheckmarkCircle className="success-icon" />
        <h2 className="success-title">Withdrawal Successful</h2>
        <p className="amount-text">{netAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} withdrawn</p>
        <p className="account-text">
          to {activeAccount?.bank || 'account'}, Account: {activeAccount?.accountNumber || 'xxxxxxx68688'}
        </p>
        {/* <p className="balance-text">
          New Balance: {newBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p> */}
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