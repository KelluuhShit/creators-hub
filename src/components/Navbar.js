// src/components/Navbar.js
import { NavLink } from 'react-router-dom';
import { IoAddCircleOutline, IoStatsChartOutline, IoPersonOutline } from 'react-icons/io5';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-item" activeClassName="active">
        <div className="nav-content">
          <IoAddCircleOutline size={24} />
          <span>Create</span>
        </div>
      </NavLink>
      <NavLink to="/free-analytics" className="nav-item" activeClassName="active">
        <div className="nav-content">
          <IoStatsChartOutline size={24} />
          <span>Analytics</span>
        </div>
      </NavLink>
      <NavLink to="/profile" className="nav-item" activeClassName="active">
        <div className="nav-content">
          <IoPersonOutline size={24} />
          <span>Profile</span>
        </div>
      </NavLink>
    </nav>
  );
}

export default Navbar;