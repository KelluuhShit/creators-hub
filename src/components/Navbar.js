import { NavLink, Navigate } from 'react-router-dom';
import { IoAddCircleOutline, IoStatsChartOutline, IoPersonOutline } from 'react-icons/io5';
import './Navbar.css';

function Navbar({ user }) {
  const isAuthenticated = !!user; // Check if user exists (Firebase auth)

  const protectedRoutes = ['/create', '/free-analytics', '/profile'];
  if (!isAuthenticated && protectedRoutes.includes(window.location.pathname)) {
    return <Navigate to="/signin" />;
  }

  return (
    <nav className="navbar">
      {isAuthenticated ? (
        <>
          <NavLink
            to="/create"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-content">
              <IoAddCircleOutline size={24} />
              <span>Create</span>
            </div>
          </NavLink>
          <NavLink
            to="/free-analytics"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-content">
              <IoStatsChartOutline size={24} />
              <span>Analytics</span>
            </div>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-content">
              <IoPersonOutline size={24} />
              <span>Profile</span>
            </div>
          </NavLink>
        </>
      ) : (
        <NavLink
          to="/signup"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="nav-content">
            <IoPersonOutline size={24} />
            <span>Sign Up</span>
          </div>
        </NavLink>
      )}
    </nav>
  );
}

export default Navbar;