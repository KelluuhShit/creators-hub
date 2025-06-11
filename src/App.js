// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Revenue from './components/Revenue';
import EarningsSummary from './components/EarningsSummary';
import Payout from './components/Payout';
import Success from './components/Success';
import ChooseAccount from './components/ChooseAccount';
import AccountSelections from './components/AccountSelections';
import ConfirmWithdraw from './components/ConfirmWithdraw'
import Subscribe from './subscribe/Subscribe';
import Monitor from './subscribe/premium/Monitor';
import ActivityChartModal from './subscribe/free/ActivityChartModal';
import Create from './pages/Create';
import FreeAnalytics from './pages/FreeAnalytics';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div style={{ paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/free-analytics" element={<FreeAnalytics />} />
          <Route path="/earnings-summary" element={<EarningsSummary />} />
          <Route path="/choose-account" element={<ChooseAccount />} />
          <Route path="/account-selections" element={<AccountSelections />} />
          <Route path="/confirm-withdraw" element={<ConfirmWithdraw />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/premium-analytics" element={<Monitor />} />
          <Route path="/activity-chart" element={<ActivityChartModal />} />
          <Route path="/payout" element={<Payout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;