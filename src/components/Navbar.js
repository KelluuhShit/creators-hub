// src/components/Navbar.js
import { NavLink } from 'react-router-dom';
import { IoAddCircleOutline, IoStatsChartOutline, IoPersonOutline } from 'react-icons/io5';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-item" activeClassName="active">
        <IoAddCircleOutline size={24} />
        <span>Create</span>
      </NavLink>
      <NavLink to="/monitor" className="nav-item" activeClassName="active">
        <IoStatsChartOutline size={24} />
        <span>Analytics</span>
      </NavLink>
      <NavLink to="/profile" className="nav-item" activeClassName="active">
        <IoPersonOutline size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

export default Navbar;