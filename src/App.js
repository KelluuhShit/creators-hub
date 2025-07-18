import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { UserContext } from './context/UserContext';
import Navbar from './components/Navbar';
import Revenue from './components/Revenue';
import EarningsSummary from './components/EarningsSummary';
import Payout from './components/Payout';
import Success from './components/Success';
import ChooseAccount from './components/ChooseAccount';
import AccountSelections from './components/AccountSelections';
import ConfirmWithdraw from './components/ConfirmWithdraw';
import Account from './components/Account'; // Already imported
import Subscribe from './subscribe/Subscribe';
import Monitor from './subscribe/premium/Monitor';
import Create from './pages/Create';
import FreeAnalytics from './pages/FreeAnalytics';
import Profile from './pages/Profile';
import UserInfo from './components/UserInfo';
import LandingPage from './signin/LandingPage';
import SignInPage from './signin/SignInPage';
import SignUpPage from './signin/SignUpPage';
import VerifyAccountPage from './verify/VerifyAccountPage';
import VerifyEmailPage from './verify/VerifyEmailPage';
import Loader from './components/Loader';
import './App.css';

function Layout({ user, isVerified }) {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/signin', '/signup', '/verify-account', '/verify-email'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className={showNavbar ? 'app-container' : 'auth-container'}>
      <Outlet />
      {showNavbar && <Navbar user={user} />}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    isPremium: false,
    subscriptionTier: null,
    verified: false
  });

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('User authenticated:', currentUser.email);
        const basicUserData = {
          email: currentUser.email,
          uid: currentUser.uid,
          displayName: currentUser.displayName,
        };
        localStorage.setItem('userData', JSON.stringify(basicUserData));
        
        try {
          const userDoc = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDoc);
          
          if (docSnap.exists()) {
            const firestoreData = docSnap.data();
            setUserData(prev => ({
              ...prev,
              ...firestoreData,
              verified: firestoreData.verified || false,
              isPremium: firestoreData.isPremium || false,
              subscriptionTier: firestoreData.subscriptionTier || null
            }));
            setIsVerified(firestoreData.verified || false);
          }
        } catch (error) {
          console.error('Firestore error:', error.message);
        }
      } else {
        console.log('No user authenticated');
        localStorage.removeItem('userData');
        setIsVerified(false);
        setUserData({
          isPremium: false,
          subscriptionTier: null,
          verified: false
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <Router>
        <Routes>
          <Route element={<Layout user={user} isVerified={isVerified} />}>
            <Route
              path="/"
              element={user ? <Navigate to={isVerified ? "/create" : "/verify-account"} /> : <LandingPage />}
            />
            <Route
              path="/signin"
              element={user ? <Navigate to={isVerified ? "/create" : "/verify-account"} /> : <SignInPage />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to={isVerified ? "/create" : "/verify-account"} /> : <SignUpPage />}
            />
            <Route
              path="/verify-account"
              element={user ? <VerifyAccountPage setIsVerified={setIsVerified} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/verify-email"
              element={<VerifyEmailPage />}
            />
            <Route
              path="/create"
              element={user && isVerified ? <Create /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/revenue"
              element={user && isVerified ? <Revenue /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/free-analytics"
              element={user && isVerified ? <FreeAnalytics /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/earnings-summary"
              element={user && isVerified ? <EarningsSummary /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/choose-account"
              element={user && isVerified ? <ChooseAccount /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/account-selections"
              element={user && isVerified ? <AccountSelections /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/confirm-withdraw"
              element={user && isVerified ? <ConfirmWithdraw /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/subscribe"
              element={user && isVerified ? <Subscribe /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/monitor"
              element={user && isVerified ? <Monitor /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/payout"
              element={user && isVerified ? <Payout /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/success"
              element={user && isVerified ? <Success /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/profile"
              element={user && isVerified ? <Profile /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/account"
              element={user && isVerified ? <Account /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/account-information"
              element={user && isVerified ? <UserInfo /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/account-type"
              element={user && isVerified ? <UserInfo /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/connected-account"
              element={user && isVerified ? <UserInfo /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
            <Route
              path="/upgrade"
              element={user && isVerified ? <Subscribe /> : <Navigate to={user ? "/verify-account" : "/signin"} />}
            />
          </Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;