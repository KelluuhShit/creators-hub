// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Revenue from './components/Revenue';
import Payout from './components/Payout';
import Success from './components/Success';
import Create from './pages/Create';
import Monitor from './pages/Monitor';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div style={{ paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/monitor" element={<Monitor />} />
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