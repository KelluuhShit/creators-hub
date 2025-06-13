import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Revenue from './components/Revenue';
import EarningsSummary from './components/EarningsSummary';
import Payout from './components/Payout';
import Success from './components/Success';
import ChooseAccount from './components/ChooseAccount';
import AccountSelections from './components/AccountSelections';
import ConfirmWithdraw from './components/ConfirmWithdraw';
import Subscribe from './subscribe/Subscribe';
import Monitor from './subscribe/premium/Monitor';
import Create from './pages/Create';
import FreeAnalytics from './pages/FreeAnalytics';
import Profile from './pages/Profile';
import LandingPage from './signin/LandingPage';
import SignInPage from './signin/SignInPage';
import SignUpPage from './signin/SignUpPage';
import './App.css';

function Layout() {
  const location = useLocation();
  // Hide Navbar on /, /signin, and /signup
  const hideNavbarRoutes = ['/', '/signin', '/signup'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className={showNavbar ? 'app-container' : 'auth-container'}>
      <Outlet />
      {showNavbar && <Navbar />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/create" element={<Create />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/free-analytics" element={<FreeAnalytics />} />
          <Route path="/earnings-summary" element={<EarningsSummary />} />
          <Route path="/choose-account" element={<ChooseAccount />} />
          <Route path="/account-selections" element={<AccountSelections />} />
          <Route path="/confirm-withdraw" element={<ConfirmWithdraw />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/payout" element={<Payout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;