import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
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

// Pass user as a prop to Layout
function Layout({ user }) {
  const location = useLocation();
  // Hide Navbar on /, /signin, and /signup
  const hideNavbarRoutes = ['/', '/signin', '/signup'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className={showNavbar ? 'app-container' : 'auth-container'}>
      <Outlet />
      {showNavbar && <Navbar user={user} />} {/* Use user prop */}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        console.log('User authenticated:', currentUser.email);
        localStorage.setItem(
          'userData',
          JSON.stringify({
            email: currentUser.email,
            uid: currentUser.uid,
            displayName: currentUser.displayName,
          })
        );
      } else {
        console.log('No user authenticated');
        localStorage.removeItem('userData');
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Simple loading state
  }

  return (
    <Router>
      <Routes>
        {/* Pass user to Layout */}
        <Route element={<Layout user={user} />}>
          <Route
            path="/"
            element={user ? <Navigate to="/create" /> : <LandingPage />}
          />
          <Route
            path="/signin"
            element={user ? <Navigate to="/create" /> : <SignInPage />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/create" /> : <SignUpPage />}
          />
          <Route
            path="/create"
            element={user ? <Create /> : <Navigate to="/signin" />}
          />
          <Route
            path="/revenue"
            element={user ? <Revenue /> : <Navigate to="/signin" />}
          />
          <Route
            path="/free-analytics"
            element={user ? <FreeAnalytics /> : <Navigate to="/signin" />}
          />
          <Route
            path="/earnings-summary"
            element={user ? <EarningsSummary /> : <Navigate to="/signin" />}
          />
          <Route
            path="/choose-account"
            element={user ? <ChooseAccount /> : <Navigate to="/signin" />}
          />
          <Route
            path="/account-selections"
            element={user ? <AccountSelections /> : <Navigate to="/signin" />}
          />
          <Route
            path="/confirm-withdraw"
            element={user ? <ConfirmWithdraw /> : <Navigate to="/signin" />}
          />
          <Route
            path="/subscribe"
            element={user ? <Subscribe /> : <Navigate to="/signin" />}
          />
          <Route
            path="/monitor"
            element={user ? <Monitor /> : <Navigate to="/signin" />}
          />
          <Route
            path="/payout"
            element={user ? <Payout /> : <Navigate to="/signin" />}
          />
          <Route
            path="/success"
            element={user ? <Success /> : <Navigate to="/signin" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/signin" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;