// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Revenue from './components/Revenue';
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
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;