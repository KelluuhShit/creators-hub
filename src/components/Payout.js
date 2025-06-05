// src/pages/Payout.js
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCheckmarkCircleOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { FaSpinner } from 'react-icons/fa6';
import './Payout.css';

function Payout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const balance = state?.balance || 0; // Numeric balance
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const RPM = 0.5; // $0.50 per 1000 impressions
  const TRANSACTION_FEE = 0.05; // Fixed fee $0.50

  const handleBackClick = () => navigate('/revenue');

  const handleWithdrawalChange = (e) => {
    const value = e.target.value;
    setWithdrawalAmount(value);
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalError('Please enter a valid amount greater than 0.');
    } else if (amount > balance - TRANSACTION_FEE) {
      setWithdrawalError(`Amount plus $${TRANSACTION_FEE} fee exceeds available balance.`);
    } else if (amount < TRANSACTION_FEE) {
      setWithdrawalError(`Amount must cover the $${TRANSACTION_FEE} transaction fee.`);
    } else {
      setWithdrawalError('');
    }
  };

  const handleMaxClick = () => {
    if (balance >= TRANSACTION_FEE) {
      const maxAmount = (balance - TRANSACTION_FEE).toFixed(2);
      setWithdrawalAmount(maxAmount);
      setWithdrawalError('');
    } else {
      setWithdrawalError(`Balance is less than the $${TRANSACTION_FEE} transaction fee.`);
    }
  };

  const handleProceedClick = () => {
    if (!withdrawalError && withdrawalAmount && !isProcessing) {
      setIsProcessing(true);
      const amount = parseFloat(withdrawalAmount);
      const netAmount = amount - TRANSACTION_FEE;
      const newBalance = balance - amount; // Deduct gross amount
      console.log(`Payout requested: $${amount.toFixed(2)}, Net after $${TRANSACTION_FEE} fee: $${netAmount.toFixed(2)}, New balance: $${newBalance.toFixed(2)}`);
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/success', { state: { amount, netAmount, newBalance } });
      }, 3000); // 3-second delay
    }
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
            min={TRANSACTION_FEE.toFixed(2)} // Ensure amount covers fee
            max={(balance - TRANSACTION_FEE).toFixed(2)} // Cap at balance minus fee
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
          disabled={isProcessing || withdrawalError || !withdrawalAmount}
          aria-label="Proceed with payout"
        >
          {isProcessing ? <FaSpinner className="spinner" /> : 'Proceed'}
        </button>
      </div>
    </div>
  );
}

export default Payout;