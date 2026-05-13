import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VideoPlayer from '../components/VideoPlayer';
import VideoGrid from '../components/VideoGrid';
import LikeDislike from '../components/LikeDislike';
import CommentSection from '../components/CommentSection';
import { mockVideos } from '../utils/mockData';
import {
  loadUploadedVideos,
  applyVideoMetrics,
  applyMetricsToVideos,
  getVideoMetrics,
  incrementVideoViews,
  toggleVideoLike,
  isSubscribedToChannel,
  toggleSubscription,
  addToWatchHistory
} from '../utils/videoStorage';
import api from '../api/axios';
import './Watch.css';

const Watch = () => {
  const { id } = useParams();
  const [subscribed, setSubscribed] = useState(false);
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(null);
  const hasCountedView = useRef(false);

  useEffect(() => {
    const loadVideo = async () => {
      const uploaded = loadUploadedVideos();
      hasCountedView.current = false;

      try {
        const { data } = await api.get(`/videos/${id}`);
        const selectedVideo = applyVideoMetrics(data);
        setVideo(selectedVideo);

        const metrics = getVideoMetrics(id);
        setLikes(metrics.likes ?? selectedVideo.likes ?? 0);
        setDislikes(metrics.dislikes ?? selectedVideo.dislikes ?? 0);
        setUserLiked(metrics.userLiked ?? null);
        setSubscribed(isSubscribedToChannel(selectedVideo.channel));

        const { data: allVideos } = await api.get('/videos');
        const related = allVideos.filter((item) => String(item.id) !== String(id));
        setRelatedVideos(applyMetricsToVideos([
          ...related,
          ...uploaded.filter((item) => String(item.id) !== String(id) && !related.some((relatedItem) => String(relatedItem.id) === String(item.id)))
        ]).slice(0, 8));
      } catch (error) {
        console.error('Failed to load video from backend:', error);
        const videos = [...mockVideos, ...uploaded];
        const selected = videos.find((v) => String(v.id) === String(id));

        if (selected) {
          const selectedVideo = applyVideoMetrics(selected);
          setVideo(selectedVideo);

          const metrics = getVideoMetrics(id);
          setLikes(metrics.likes ?? selectedVideo.likes ?? 0);
          setDislikes(metrics.dislikes ?? selectedVideo.dislikes ?? 0);
          setUserLiked(metrics.userLiked ?? null);
          setSubscribed(isSubscribedToChannel(selectedVideo.channel));
        }

        setRelatedVideos(applyMetricsToVideos(videos.filter((item) => String(item.id) !== String(id))).slice(0, 8));
      }
    };

    loadVideo();
  }, [id]);

  useEffect(() => {
    if (!video || hasCountedView.current) return;
    hasCountedView.current = true;

    const updatedViews = incrementVideoViews(video.id);
    const updatedVideo = video ? { ...video, views: updatedViews } : video;
    setVideo(updatedVideo);
    addToWatchHistory(updatedVideo);
  }, [video?.id]);

  const handleSubscribe = () => {
    if (!video) return;
    const nextSubscribed = toggleSubscription(video.channel);
    setSubscribed(nextSubscribed);
  };

  const handleLike = () => {
    if (!video) return;
    const metrics = toggleVideoLike(video.id, 'like');
    setLikes(metrics.likes);
    setDislikes(metrics.dislikes);
    setUserLiked(metrics.userLiked);
  };

  const handleDislike = () => {
    if (!video) return;
    const metrics = toggleVideoLike(video.id, 'dislike');
    setLikes(metrics.likes);
    setDislikes(metrics.dislikes);
    setUserLiked(metrics.userLiked);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!video) {
    return (
      <div className="watch">
        <Navbar onMenuClick={toggleSidebar} />
        <div className="watch-content">
          <Sidebar isOpen={isSidebarOpen} />
          <main className={`watch-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>Video not found</main>
        </div>
      </div>
    );
  }

  return (
    <div className="watch">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="watch-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`watch-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="video-section">
            <VideoPlayer video={video} />
            <div className="video-info">
              <h1 className="video-title">{video.title}</h1>
              <div className="video-meta">
                <span className="views">{video.views} views</span>
                <span className="timestamp">{video.timestamp}</span>
              </div>
              <div className="engagement-bar">
                <LikeDislike 
                  likes={likes} 
                  dislikes={dislikes} 
                  userLiked={userLiked}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              </div>
              <div className="channel-info">
                <img src={video.channelAvatar} alt={video.channel} className="channel-avatar" />
                <div className="channel-details">
                  <h3 className="channel-name">{video.channel}</h3>
                  <span className="subscriber-count">1.2M subscribers</span>
                </div>
                <button className={`subscribe-btn ${subscribed ? 'subscribed' : ''}`} onClick={handleSubscribe}>
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
              <div className="video-description">
                <p>{video.description}</p>
              </div>
            </div>
            <CommentSection videoId={video.id} />
          </div>
          <div className="related-section">
            <h3>Related Videos</h3>
            <VideoGrid videos={relatedVideos} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Watch;
