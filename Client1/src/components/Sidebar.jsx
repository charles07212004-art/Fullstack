import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/trending', icon: '🔥', label: 'Trending' },
    { path: '/subscriptions', icon: '📺', label: 'Subscriptions' },
    { path: '/library', icon: '📚', label: 'Library' },
    { path: '/history', icon: '🕒', label: 'History' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <hr className="sidebar-divider" />

        <div className="sidebar-section">
          <h3 className="sidebar-title">Explore</h3>
          <Link to="/gaming" className="sidebar-item">
            <span className="sidebar-icon">🎮</span>
            <span className="sidebar-label">Gaming</span>
          </Link>
          <Link to="/music" className="sidebar-item">
            <span className="sidebar-icon">🎵</span>
            <span className="sidebar-label">Music</span>
          </Link>
          <Link to="/sports" className="sidebar-item">
            <span className="sidebar-icon">⚽</span>
            <span className="sidebar-label">Sports</span>
          </Link>
          <Link to="/news" className="sidebar-item">
            <span className="sidebar-icon">📰</span>
            <span className="sidebar-label">News</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
