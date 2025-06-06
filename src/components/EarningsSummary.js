// src/pages/EarningsSummary.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMoneyBillWave, FaMoneyCheckAlt, FaUniversity } from 'react-icons/fa';
import './EarningsSummary.css';

function EarningsSummary() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [availablePayout, setAvailablePayout] = useState(0);
  const [activeAccount, setActiveAccount] = useState(null);

  // Mock earnings history data with account field for withdrawn transactions
  const earningsHistory = [
    { id: 1, type: 'earned', amount: 50.25, date: '2025-06-01' },
    { id: 2, type: 'withdrawn', amount: 30.00, date: '2025-05-28', account: 'XXXXXX1234' },
    { id: 3, type: 'earned', amount: 75.10, date: '2025-05-20' },
    { id: 4, type: 'withdrawn', amount: 20.50, date: '2025-05-15', account: 'XXXXXX5678' },
  ];

  // Update available payout and load active account from localStorage or navigation state
  useEffect(() => {
    if (state?.balance !== undefined) {
      setAvailablePayout(state.balance);
    }
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

  const handleWithdrawClick = () => {
    if (activeAccount) {
      // Active account exists, display it (handled in JSX)
      navigate('/payout', { state: { balance: availablePayout } });
      return;
    }
    // No active account, navigate to choose-account
    navigate('/choose-account', { state: { balance: availablePayout } });
  };

  const handleChangeAccount = () => {
    // Do not clear localStorage here; pass current activeAccount to ChooseAccount
    navigate('/choose-account', { state: { balance: availablePayout, activeAccount } });
  };

  return (
    <div className="earnings-summary-container">
      <div className="earnings-header">
        <h4 className="earnings-title">Earnings Summary</h4>
        <button className="back-button" onClick={handleBackClick} aria-label="Back to revenue">
          Back
        </button>
      </div>
      <div className="payout-section">
        <h5 className="payout-title">Available Payout</h5>
        <div className="payout-amount">
          <span className="payout-value">
            {availablePayout.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
        </div>
        <button className="withdraw-button" onClick={handleWithdrawClick} aria-label="Withdraw funds">
          Withdraw
        </button>
        {activeAccount && (
          <div className="active-account-card">
            <div className="bank-icon">
              <FaUniversity size={24} color="#833ab4" />
            </div>
            <div className="bank-details">
              <span className="bank-name">{activeAccount.bank}</span>
              <span className="account-number">Account: {activeAccount.accountNumber}</span>
            </div>
            {/* <button
              className="change-button"
              onClick={handleChangeAccount}
              aria-label="Change active account"
            >
              Change
            </button> */}
          </div>
        )}
      </div>
      <div className="history-section">
        <h5 className="history-title">Earnings History</h5>
        <div className="history-cards">
          {earningsHistory.map((entry) => (
            <div key={entry.id} className={`history-card ${entry.type}`}>
              <div className="history-icon">
                {entry.type === 'earned' ? (
                  <FaMoneyBillWave size={24} color="#28a745" />
                ) : (
                  <FaMoneyCheckAlt size={24} color="#dc3545" />
                )}
              </div>
              <div className="history-content">
                <div className="history-details">
                  <span className="history-type">
                    {entry.type === 'earned' ? 'Earned' : 'Withdrawn'}
                  </span>
                  <span className="history-amount">
                    {entry.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                  <span className="history-date">{entry.date}</span>
                </div>
                {entry.type === 'withdrawn' && (
                  <div className="history-account-container">
                    <span className="history-account">Account: {entry.account}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EarningsSummary;