import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Auth.css';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login({
      name: name || 'Erin User',
      email,
      avatar: 'https://i.pravatar.cc/180?img=32',
      memberSince: 'January 2024'
    });
    navigate('/profile');
  };

  return (
    <div className="page auth-page">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="page-content auth-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`page-main auth-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <section className="auth-panel">
            <div className="auth-top">
              <div>
                <p className="auth-badge">Create Account</p>
                <h1>Register for free</h1>
                <p className="auth-subtitle">
                  Set up your profile to start saving favorites and managing your
                  account.
                </p>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a password"
                  required
                />
              </label>
              <button type="submit" className="auth-button">
                Create account
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Register;
