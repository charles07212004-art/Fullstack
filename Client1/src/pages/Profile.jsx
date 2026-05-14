import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const profileUser = user || {
    name: 'mart ramos',
    email: 'mart@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180&h=180&fit=crop',
    memberSince: 'January 2024'
  };

  // Set initial avatar from user or default
  useEffect(() => {
    setAvatarUrl(profileUser.avatar);
    setName(profileUser.name || '');
  }, [profileUser.avatar, profileUser.name]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = () => {
    if (name.trim()) {
      updateUser({ name: name.trim() });
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarData = e.target.result;
      setAvatarUrl(avatarData);
      updateUser({ avatar: avatarData });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page profile-page">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="page-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`page-main profile-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <section className="profile-hero">
            <div className="profile-hero-copy">
              <p className="profile-badge">Profile</p>
              <h1>Welcome back, {profileUser.name.split(' ')[0]}</h1>
              <p className="profile-description">
                Manage your account details, update your profile picture, and
                sign out when you’re done.
              </p>
              <div className="profile-info-note">
                <span className="info-icon">ℹ️</span>
                <p>
                  Para makatulong sa iyong profile setup: i-click ang camera icon para mag-upload ng bagong avatar, i-update ang account details, at mag-sign out kapag tapos na.
                </p>
              </div>
            </div>
            <button className="sign-out-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </section>

          <section className="profile-card">
            <div className="profile-card-avatar-wrapper">
              <div className="profile-card-avatar">
                <img src={avatarUrl} alt="Profile avatar" />
              </div>
              <label className="profile-avatar-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="profile-avatar-input"
                />
                <span className="upload-icon">📷</span>
              </label>
            </div>
            <div className="profile-card-details">
              <div className="profile-edit-row">
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Username"
                  className="profile-name-input"
                />
              </div>
              <p className="profile-email">{profileUser.email}</p>
              <button type="button" className="save-profile-btn" onClick={handleSaveProfile}>
                Save name
              </button>
              <div className="profile-stats">
                <div>
                  <p>Member since</p>
                  <strong>{profileUser.memberSince}</strong>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
