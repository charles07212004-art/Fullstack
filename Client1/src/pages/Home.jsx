import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VideoGrid from '../components/VideoGrid';
import CategoryChips from '../components/CategoryChips';
import { mockVideos, categories } from '../utils/mockData';
import { loadUploadedVideos, removeUploadedVideo, clearAllUploadedVideos, removeMultipleUploadedVideos, applyMetricsToVideos } from '../utils/videoStorage';
import api from '../api/axios';
import './Home.css';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const uploaded = loadUploadedVideos();
      try {
        const { data } = await api.get('/videos');

        // Treat uploaded videos as local-only and DO NOT block them by id collisions with server data.
        // This prevents “uploaded videos disappear when a new upload happens”.
        const merged = [...data, ...uploaded];
        setVideos(applyMetricsToVideos(merged));
      } catch (error) {
        console.error('Failed to load videos from backend:', error);
        setVideos(applyMetricsToVideos([...mockVideos, ...uploaded]));
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = (id) => {
    removeUploadedVideo(id);
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const handleSelectVideo = (id, checked) => {
    setSelectedVideos((prev) =>
      checked ? [...prev, id] : prev.filter((vid) => vid !== id)
    );
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedVideos.length} selected video(s)? This cannot be undone.`)) {
      removeMultipleUploadedVideos(selectedVideos);
      setVideos((prev) => prev.filter((video) => !selectedVideos.includes(video.id)));
      setSelectedVideos([]);
      setIsSelectionMode(false);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete all uploaded videos? This cannot be undone.')) {
      clearAllUploadedVideos();
      setVideos(mockVideos);
      setIsSelectionMode(false);
      setSelectedVideos([]);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className="home">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="home-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="top-bar">
            <CategoryChips
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <div className="button-group">
              <button
                type="button"
                className={`select-btn ${isSelectionMode ? 'active' : ''}`}
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  setSelectedVideos([]);
                }}
                title="Select videos to delete"
              >
                {isSelectionMode ? '✓ Done' : '📋 Select'}
              </button>
              {isSelectionMode && selectedVideos.length > 0 && (
                <button type="button" className="delete-selected-btn" onClick={handleDeleteSelected}>
                  🗑️ Delete {selectedVideos.length}
                </button>
              )}
              <button type="button" className="delete-all-btn" onClick={handleDeleteAll} title="Delete all uploaded videos">
                🗑️ Delete All
              </button>
            </div>
          </div>
          {filteredVideos.length === 0 ? (
            <div className="empty-state">
              <p>No videos found. Upload a video or choose a different category.</p>
            </div>
          ) : (
            <VideoGrid
              videos={filteredVideos}
              onDelete={handleDelete}
              selectedVideos={selectedVideos}
              onSelectVideo={handleSelectVideo}
              isSelectionMode={isSelectionMode}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
