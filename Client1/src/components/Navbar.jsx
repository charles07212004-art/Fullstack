import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = ({ onMenuClick = () => {} }) => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button type="button" className="menu-btn" onClick={onMenuClick}>
          <span className="hamburger"></span>
        </button>
        <Link to="/" className="logo">
          
          <span>ThunderTUBE</span>
        </Link>
      </div>

      <div className="navbar-center">
        <SearchBar />
      </div>

      <div className="navbar-right">
        <Link to="/upload" className="icon-btn upload-btn" title="Upload">
          <svg viewBox="0 0 24 24">
            <path d="M5,20H19A1,1 0 0,0 20,19V13H18V18H6V13H4V19A1,1 0 0,0 5,20M12,2L7,7H10V13H14V7H17L12,2Z" />
          </svg>
        </Link>
        <button className="icon-btn">
          <svg viewBox="0 0 24 24">
            <path d="M14,10H2V12H14V10M14,6H2V8H14V6M2,16H10V14H2V16M21.5,11.5L23,13L16,20L11.5,15.5L13,14L16,17L21.5,11.5Z" />
          </svg>
        </button>
        <button className="icon-btn">
          <svg viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
          </svg>
        </button>
        <Link to="/profile" className="user-avatar">
          <img src={user?.avatar || 'https://picsum.photos/32/32?random=1'} alt={user?.name || 'User'} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
