// src/pages/AccountSelections.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUniversity } from 'react-icons/fa';
import './AccountSelections.css';

function AccountSelections() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedBank, setSelectedBank] = useState(state?.bank || '');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');

  // Load saved account from localStorage (simulating persistence)
  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem('savedAccount'));
    if (savedAccount && !state?.bank) {
      setSelectedBank(savedAccount.bank);
      setAccountName(savedAccount.accountName);
      setAccountNumber(savedAccount.accountNumber);
    }
  }, [state]);

  const handleSave = () => {
    // Basic validation
    if (!accountName.trim()) {
      setError('Account name is required');
      return;
    }
    if (!accountNumber.trim() || !/^\d{10,}$/.test(accountNumber.replace(/\D/g, ''))) {
      setError('Account number must be at least 10 digits');
      return;
    }

    // Save account details (simulating API call with localStorage)
    const accountDetails = { bank: selectedBank, accountName, accountNumber };
    localStorage.setItem('savedAccount', JSON.stringify(accountDetails));
    alert('Account saved successfully!');
    setError('');
    navigate('/earnings-summary', { state: { balance: state?.balance } });
  };

  const handleBackClick = () => navigate('/payout', { state: { balance: state?.balance } });

  return (
    <div className="account-selections-container">
      <div className="account-selections-header">
        <h4 className="account-selections-title">Account Selections</h4>
        <button className="back-button" onClick={handleBackClick} aria-label="Back to choose account">
          Back
        </button>
      </div>
      <div className="account-details-section">
        <h5 className="account-details-title">Selected Withdrawal Account</h5>
        <div className="selected-bank-card">
          <div className="bank-icon">
            <FaUniversity size={24} color="#833ab4" />
          </div>
          <div className="bank-details">
            <span className="bank-name">{selectedBank || 'No bank selected'}</span>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="account-name" className="input-label">
            Name on Account
          </label>
          <input
            id="account-name"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Enter account holder's name"
            className="input-field"
            aria-label="Account holder's name"
          />
        </div>
        <div className="input-group">
          <label htmlFor="account-number" className="input-label">
            Account Number
          </label>
          <input
            id="account-number"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
            className="input-field"
            aria-label="Account number"
          />
        </div>
        {error && <span className="error-message">{error}</span>}
        <button className="save-button" onClick={handleSave} aria-label="Save account details">
          Save
        </button>
      </div>
    </div>
  );
}

export default AccountSelections;