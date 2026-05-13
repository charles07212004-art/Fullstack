import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { loadHistory } from '../utils/videoStorage';
import './History.css';

const History = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    setHistoryItems(loadHistory());
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="page">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="page-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`page-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <h1>History</h1>
          {historyItems.length === 0 ? (
            <p>No watched videos yet. Play a video to build your history.</p>
          ) : (
            <div className="history-list">
              {historyItems.map((entry) => (
                <Link key={entry.id} to={`/watch/${entry.id}`} className="history-item">
                  <img src={entry.thumbnail} alt={entry.title} className="history-thumbnail" />
                  <div className="history-details">
                    <h2>{entry.title}</h2>
                    <p>{entry.channel} • {entry.duration || '0:00'}</p>
                    <p>{new Date(entry.watchedAt).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default History;
