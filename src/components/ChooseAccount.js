// src/pages/ChooseAccount.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUniversity } from 'react-icons/fa';
import './ChooseAccount.css';

function ChooseAccount() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [balance, setBalance] = useState(state?.balance || 0);

  // Load saved account from localStorage or navigation state
  useEffect(() => {
    if (state?.activeAccount) {
      setActiveAccount(state.activeAccount);
    } else {
      const savedAccount = JSON.parse(localStorage.getItem('savedAccount'));
      if (savedAccount) {
        setActiveAccount(savedAccount);
      }
    }
    if (state?.balance !== undefined) {
      setBalance(state.balance);
    }
  }, [state]);

  // List of banks for suggestions
  const banks = [
    'African Banking Corp. Ltd.',
    'Bank of Africa Kenya Ltd.',
    'Bank of India',
    'Bank of Baroda (K) Ltd.',
    'Barclays Bank of Kenya Ltd.',
    'CfC Stanbic Bank Ltd.',
    'Chase Bank (K) Ltd.',
    'Citibank N.A.',
    'Commercial Bank of Africa Ltd.',
    'Consolidated Bank of Kenya Ltd.',
    'Co-operative Bank of Kenya Ltd.',
    'Credit Bank Ltd.',
    'Development Bank (K) Ltd.',
    'Diamond Trust Bank (K) Ltd.',
    'Dubai Bank Ltd.',
    'Ecobank Limited',
    'Equatorial Commercial Bank Ltd.',
    'Equity Bank Ltd.',
    'Family Bank Ltd.',
    'Faulu Bank',
    'Fidelity Commercial Bank Ltd.',
    'Fina Bank Ltd.',
    'First Community Bank Ltd.',
    'Giro Commercial Bank Ltd.',
    'Guardian Bank Ltd.',
    'Gulf African Bank Ltd.',
    'Habib Bank A.G. Zurich',
    'Habib Bank Ltd.',
    'Housing Finance Company Ltd.',
    'Imperial Bank Ltd.',
    'I & M Bank Ltd.',
    'Jamii Bora Bank Ltd.',
    'K-Rep Bank Ltd.',
    'Kenya Commercial Bank Ltd.',
    'Kenya Women Microfinance Bank',
    'Middle East Bank Ltd.',
    'National Bank of Kenya Ltd.',
    'NIC Bank Ltd.',
    'Oriental Commercial Bank Ltd.',
    'Paramount Universal Bank Ltd.',
    'Prime Bank Ltd.',
    'Postbank',
    'Standard Chartered Bank Ltd.',
    'Transnational Bank Ltd.',
    'UBA Kenya Bank Ltd.',
    'Victoria Commercial Bank Ltd.',
  ];

  // Default banks to display
  const defaultBanks = [
    { name: 'KCB Bank', icon: <FaUniversity size={24} color="#28a745" /> },
    { name: 'Equity Bank', icon: <FaUniversity size={24} color="#dc3545" /> },
    { name: 'NCBA Bank', icon: <FaUniversity size={24} color="#833ab4" /> },
  ];

  // Filter banks based on search query
  const filteredBanks = banks.filter((bank) =>
    bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchClick = () => {
    setShowSuggestions(true);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleBankSelect = (bank) => {
    navigate('/account-selections', { state: { bank, balance, returnPath: state?.returnPath, previousAccount: activeAccount } });
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleAddBank = (bankName) => {
    navigate('/account-selections', { state: { bank: bankName, balance, returnPath: state?.returnPath, previousAccount: activeAccount } });
  };

  const handleChangeAccount = () => {
    // Don't clear activeAccount here; defer to navigation
    navigate('/account-selections', { state: { balance, returnPath: state?.returnPath, previousAccount: activeAccount } });
  };

  const handleBackClick = () => {
    const returnPath = state?.returnPath || '/earnings-summary'; // Default to earnings-summary
    navigate(returnPath, { state: { balance, activeAccount } });
  };

  return (
    <div className="choose-account-container">
      <div className="choose-account-header">
        <h4 className="choose-account-title">Choose Account</h4>
        <button className="back-button" onClick={handleBackClick} aria-label="Back to previous page">
          Back
        </button>
      </div>
      {activeAccount && (
        <div className="active-account-section">
          <h5 className="active-account-title">Active Account</h5>
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
        </div>
      )}
      <div className="withdrawal-account-section">
        <h5 className="withdrawal-account-title">Withdrawal Account</h5>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={handleSearchClick}
            placeholder="Search for a bank..."
            className="search-input"
            aria-label="Search for a bank"
          />
          <button
            className="search-button"
            onClick={handleSearchClick}
            aria-label="Search banks"
          >
            <FaSearch size={18} />
          </button>
        </div>
        {showSuggestions && searchQuery && (
          <div className="suggestions-list">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleBankSelect(bank)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${bank}`}
                >
                  {bank}
                </div>
              ))
            ) : (
              <div className="suggestion-item no-results">No banks found</div>
            )}
          </div>
        )}
      </div>
      <div className="default-banks-section">
        <h5 className="default-banks-title">Popular Banks</h5>
        <div className="bank-cards">
          {defaultBanks.map((bank, index) => (
            <div key={index} className="bank-card">
              <div className="bank-icon">{bank.icon}</div>
              <div className="bank-details">
                <span className="bank-name">{bank.name}</span>
                <button
                  className="add-button"
                  onClick={() => handleAddBank(bank.name)}
                  aria-label={`Add ${bank.name} account`}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChooseAccount;