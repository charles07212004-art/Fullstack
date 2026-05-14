import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computedName = email
      ? email
          .split('@')[0]
          .replace(/[-_.]/g, ' ')
          .replace(/\b\w/g, (match) => match.toUpperCase())
      : 'Erin User';

    login({
      name: computedName,
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
                <p className="auth-badge">Welcome Back</p>
                <h1>Login to your account</h1>
                <p className="auth-subtitle">
                  Enter your email and password to access your profile and saved
                  videos.
                </p>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  required
                />
              </label>
              <button type="submit" className="auth-button">
                Log In
              </button>
            </form>

            <p className="auth-footer">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Login;
