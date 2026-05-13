import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VideoGrid from '../components/VideoGrid';
import { mockVideos } from '../utils/mockData';
import { loadUploadedVideos, removeUploadedVideo, applyMetricsToVideos } from '../utils/videoStorage';
import api from '../api/axios';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState(mockVideos);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const loadSearchResults = async () => {
      const uploaded = loadUploadedVideos();
      try {
        const { data } = await api.get('/videos', { params: { q: query } });
        // Treat uploaded videos as local-only and DO NOT block them by id collisions with server data.
        const merged = [...data, ...uploaded];
        setVideos(applyMetricsToVideos(merged));
      } catch (error) {
        console.error('Failed to load search results from backend:', error);
        setVideos(applyMetricsToVideos([...mockVideos, ...uploaded]));
      }
    };

    loadSearchResults();
  }, [query]);

  const handleDelete = (id) => {
    removeUploadedVideo(id);
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(query.toLowerCase()) ||
    video.channel.toLowerCase().includes(query.toLowerCase()) ||
    video.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-results">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="search-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`search-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="search-header">
            <h2>Search results for "{query}"</h2>
            <p>About {filteredVideos.length} results</p>
          </div>
          <VideoGrid videos={filteredVideos} onDelete={handleDelete} />
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
