// src/pages/ConfirmWithdraw.js
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { FaSpinner, FaUniversity } from 'react-icons/fa';
import './ConfirmWithdraw.css';

function ConfirmWithdraw() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { amount, balance, activeAccount } = state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const TRANSACTION_FEE = 0.05; // Fixed fee $0.05

  const netAmount = amount - TRANSACTION_FEE;

  const handleConfirmClick = () => {
    if (!isProcessing) {
      setIsProcessing(true);
      const newBalance = balance - amount; // Deduct gross amount
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/success', { state: { amount, netAmount, newBalance, activeAccount } });
      }, 2000); // 2-second delay
    }
  };

  const handleBackClick = () => {
    navigate('/payout', { state: { balance, activeAccount } });
  };

  return (
    <div className="confirm-withdraw-container">
      <div className="confirm-withdraw-header">
        <h4 className="confirm-withdraw-title">Confirm Withdrawal</h4>
        <button className="back-button" onClick={handleBackClick} aria-label="Back to payout">
          Back
        </button>
      </div>
      <div className="confirm-withdraw-content">
        {activeAccount && (
          <div className="detail-card">
            <h5 className="card-title">Active Account</h5>
            <div className="active-account-card">
              <div className="bank-icon">
                <FaUniversity size={24} color="#833ab4" />
              </div>
              <div className="bank-details">
                <span className="bank-name">{activeAccount.bank}</span>
                <span className="account-number">Account: {activeAccount.accountNumber}</span>
              </div>
            </div>
          </div>
        )}
        <div className="detail-card">
          <h5 className="card-title">Withdrawal Amount</h5>
          <p className="card-value">
            {amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <div className="detail-card">
          <h5 className="card-title">Service Fee</h5>
          <p className="card-value">
            {TRANSACTION_FEE.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <div className="detail-card">
          <h5 className="card-title">Receiving Amount</h5>
          <p className="card-value">
            {netAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <div className="info-section">
          <IoInformationCircleOutline className="info-icon" />
          <p className="info-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <button
          className="confirm-button"
          onClick={handleConfirmClick}
          disabled={isProcessing || netAmount < 0}
          aria-label="Confirm withdrawal"
        >
          {isProcessing ? <FaSpinner className="spinner" /> : 'Confirm Withdrawal'}
        </button>
      </div>
    </div>
  );
}

export default ConfirmWithdraw;