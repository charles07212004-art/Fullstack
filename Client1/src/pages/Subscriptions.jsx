import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VideoGrid from '../components/VideoGrid';
import { mockVideos } from '../utils/mockData';
import {
  loadSubscriptions,
  toggleSubscription,
  loadUploadedVideos,
  applyMetricsToVideos,
} from '../utils/videoStorage';
import './Subscriptions.css';

const Subscriptions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionVideos, setSubscriptionVideos] = useState([]);

  const refreshSubscriptions = () => {
    const currentSubscriptions = loadSubscriptions();
    setSubscriptions(currentSubscriptions);

    const allVideos = [...mockVideos, ...loadUploadedVideos()];
    const subscribedVideos = applyMetricsToVideos(
      allVideos.filter((video) => currentSubscriptions.includes(video.channel))
    );

    setSubscriptionVideos(subscribedVideos);
  };

  useEffect(() => {
    refreshSubscriptions();
  }, []);

  const handleUnsubscribe = (channel) => {
    toggleSubscription(channel);
    refreshSubscriptions();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="page">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="page-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`page-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="subscriptions-header">
            <h1>Subscriptions</h1>
            <p className="subscriptions-summary">
              {subscriptions.length} channel{subscriptions.length !== 1 ? 's' : ''} subscribed
            </p>
          </div>

          {subscriptions.length === 0 ? (
            <p className="empty-message">You have not subscribed to any channels yet.</p>
          ) : (
            <>
              <div className="subscription-grid">
                {subscriptions.map((channel) => (
                  <div key={channel} className="subscription-card">
                    <div className="subscription-card-left">
                      <div className="subscription-avatar">{channel.charAt(0).toUpperCase()}</div>
                      <div>
                        <h2>{channel}</h2>
                        <p>Subscribed channel</p>
                      </div>
                    </div>
                    <button className="unsubscribe-btn" onClick={() => handleUnsubscribe(channel)}>
                      Unsubscribe
                    </button>
                  </div>
                ))}
              </div>

              <div className="subscription-videos">
                <h2>Latest from your subscriptions</h2>
                {subscriptionVideos.length > 0 ? (
                  <VideoGrid videos={subscriptionVideos} />
                ) : (
                  <p className="empty-message">
                    No videos available yet from your subscribed channels.
                  </p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Subscriptions;
