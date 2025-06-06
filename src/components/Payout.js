// src/pages/Payout.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCheckmarkCircleOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { FaSpinner } from 'react-icons/fa6';
import { FaUniversity } from 'react-icons/fa';
import './Payout.css';

function Payout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const balance = state?.balance || 0; // Numeric balance
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);

  const RPM = 0.5; // $0.50 per 1000 impressions
  const TRANSACTION_FEE = 0.05; // Fixed fee $0.05

  // Load active account from localStorage or navigation state
  useEffect(() => {
    if (state?.activeAccount) {
      setActiveAccount(state.activeAccount);
    } else {
      const savedAccount = JSON.parse(localStorage.getItem('savedAccount'));
      if (savedAccount) {
        setActiveAccount(savedAccount);
      }
    }
  }, [state]);

  const handleBackClick = () => navigate('/revenue');

  const handleWithdrawalChange = (e) => {
    const value = e.target.value;
    setWithdrawalAmount(value);
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalError('Please enter a valid amount greater than 0.');
    } else if (amount > balance) {
      setWithdrawalError('Amount exceeds available balance.');
    } else {
      setWithdrawalError('');
    }
  };

  const handleMaxClick = () => {
    if (balance > 0) {
      const maxAmount = balance.toFixed(2);
      setWithdrawalAmount(maxAmount);
      setWithdrawalError('');
    } else {
      setWithdrawalError('Insufficient balance.');
    }
  };

  const handleProceedClick = () => {
    if (!withdrawalError && withdrawalAmount && !isProcessing && activeAccount) {
      setIsProcessing(true);
      const amount = parseFloat(withdrawalAmount);
      console.log(`Payout requested: $${amount.toFixed(2)}, Balance remains: $${balance.toFixed(2)}`);
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/confirm-withdraw', { state: { amount, balance, activeAccount } });
      }, 3000); // 3-second delay
    } else if (!activeAccount) {
      setWithdrawalError('Please select a withdrawal account.');
    }
  };

  const handleChangeAccount = () => {
    navigate('/choose-account', { state: { balance, activeAccount, returnPath: '/payout' } });
  };

  return (
    <div className="payout-container">
      <div className="payout-header">
        <h4 className="payout-title">Payout</h4>
        <button className="back-button" onClick={handleBackClick} aria-label="Back to revenue">
          Back
        </button>
      </div>
      <div className="payout-content">
        <h2 className="balance-title">Total Balance</h2>
        <p className="balance-value">{balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
        {activeAccount && (
          <div className="active-account-card">
            <div className="bank-icon">
              <FaUniversity size={24} color="#833ab4" />
            </div>
            <div className="bank-details">
              <span className="bank-name">{activeAccount.bank}</span>
              <span className="account-number">Account: {activeAccount.accountNumber}</span>
            </div>
            <button
              className="change-button"
              onClick={handleChangeAccount}
              aria-label="Change active account"
            >
              Change
            </button>
          </div>
        )}
        <ul className="payout-details">
          {[
            'Total revenue earned',
            `On RPM ${RPM.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
            `Transaction fees - ${TRANSACTION_FEE.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
          ].map((text, index) => (
            <li key={index} className="payout-detail-item">
              <IoCheckmarkCircleOutline className="checkmark-icon" />
              {text}
            </li>
          ))}
        </ul>
        <div className="warning-section">
          <IoInformationCircleOutline className="warning-icon" />
          <p className="warning-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="withdrawal-input-container">
          <input
            type="number"
            className="withdrawal-input"
            value={withdrawalAmount}
            onChange={handleWithdrawalChange}
            placeholder="Enter amount"
            min="0.01"
            max={balance.toFixed(2)}
            step="0.01"
            aria-label="Withdrawal amount"
            disabled={isProcessing}
          />
          <button
            className="max-button"
            onClick={handleMaxClick}
            aria-label="Set maximum withdrawal amount"
            disabled={isProcessing}
          >
            Max
          </button>
        </div>
        {withdrawalError && <p className="error-text">{withdrawalError}</p>}
        <button
          className="proceed-button"
          onClick={handleProceedClick}
          disabled={isProcessing || withdrawalError || !withdrawalAmount || !activeAccount}
          aria-label="Proceed with payout"
        >
          {isProcessing ? <FaSpinner className="spinner" /> : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default Payout;